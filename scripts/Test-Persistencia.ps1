$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$jar = Join-Path $projectRoot 'target/helpdesk-fullstack-0.0.1-SNAPSHOT.jar'
if (-not (Test-Path -LiteralPath $jar)) {
    throw 'Execute .\mvnw.cmd verify antes deste teste.'
}

# Cada execução usa seu próprio banco em target, sem tocar no database.db do usuário.
$testFolder = 'target/persistencia-' + [Guid]::NewGuid().ToString('N')
$absoluteTestFolder = Join-Path $projectRoot $testFolder
New-Item -ItemType Directory -Path $absoluteTestFolder | Out-Null
$javaCommand = (Get-Command java.exe).Source
# O atalho Oracle no PATH pode criar outro processo. Usar o executável real
# permite encerrar a JVM correta e verificar um reinício de verdade.
$javaSettings = & $javaCommand -XshowSettings:properties -version 2>&1
$javaHomeLine = $javaSettings | Select-String '^\s*java.home\s*=\s*(.+)$' | Select-Object -First 1
if ($null -eq $javaHomeLine) { throw 'Não foi possível localizar java.home.' }
$java = Join-Path $javaHomeLine.Matches[0].Groups[1].Value.Trim() 'bin/java.exe'
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$port = $listener.LocalEndpoint.Port
$listener.Stop()
$baseUrl = "http://127.0.0.1:$port/api"
$backendProcess = $null

function Start-TestBackend([string] $phase) {
    $process = Start-Process -FilePath $java -ArgumentList @(
        '-jar', 'target/helpdesk-fullstack-0.0.1-SNAPSHOT.jar',
        "--server.port=$port", "--spring.datasource.url=jdbc:h2:file:./$testFolder/database"
    ) -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru `
      -RedirectStandardOutput (Join-Path $absoluteTestFolder "$phase.log") `
      -RedirectStandardError (Join-Path $absoluteTestFolder "$phase-error.log")
    try {
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            if ($process.HasExited) { throw "Backend encerrou. Consulte $absoluteTestFolder" }
            try {
                $null = Invoke-RestMethod "$baseUrl/chamados" -TimeoutSec 1
                return $process
            } catch {
                Start-Sleep -Milliseconds 500
            }
        }
        throw "Backend não iniciou a tempo. Consulte $absoluteTestFolder"
    } catch {
        if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force }
        throw
    }
}

try {
    $backendProcess = Start-TestBackend 'primeira-inicializacao'
    $body = @{ titulo = 'Teste de persistência'; descricao = 'Deve sobreviver ao reinício'; status = 'ABERTO' } | ConvertTo-Json
    $created = Invoke-RestMethod "$baseUrl/chamados" -Method Post -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($body))
    # Stop-Process força o término, sem o fechamento normal do H2 feito pelo Ctrl+C.
    # Aguarda a gravação periódica do banco antes dessa interrupção forçada.
    Start-Sleep -Seconds 2
    Stop-Process -Id $backendProcess.Id -Force
    $backendProcess.WaitForExit()
    # Impede um falso positivo: a porta precisa estar sem servidor antes do reinício.
    $stillRunning = $false
    try {
        $null = Invoke-RestMethod "$baseUrl/chamados" -TimeoutSec 1
        $stillRunning = $true
    } catch { }
    if ($stillRunning) { throw 'O primeiro servidor não foi encerrado.' }
    $backendProcess = Start-TestBackend 'segunda-inicializacao'
    $found = Invoke-RestMethod "$baseUrl/chamados/$($created.id)"
    if ($found.titulo -ne $created.titulo -or $found.descricao -ne $created.descricao -or $found.status -ne 'ABERTO') {
        throw 'O registro não foi preservado após reiniciar.'
    }
    if (-not (Test-Path -LiteralPath (Join-Path $absoluteTestFolder 'database.mv.db'))) {
        throw 'O arquivo H2 não foi criado.'
    }
    Invoke-RestMethod "$baseUrl/chamados/$($created.id)" -Method Delete | Out-Null
    Write-Output 'PASSOU: JAR iniciou duas vezes; cadastro sobreviveu ao reinício no H2 em arquivo; exclusão funcionou.'
    Write-Output "Logs e banco isolado: $absoluteTestFolder"
} finally {
    if ($null -ne $backendProcess -and -not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force
        $backendProcess.WaitForExit()
    }
}
