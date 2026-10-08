package br.ueg.trindade.helpdesk;

import br.ueg.trindade.helpdesk.repository.ChamadoRepository;
import br.ueg.trindade.helpdesk.repository.PermissaoRepository;
import br.ueg.trindade.helpdesk.repository.UsuarioRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.*;

// Servidor HTTP real, com Security, Controllers, Services, JPA e H2.
// O banco de testes é separado do arquivo usado pelo usuário.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
        "spring.datasource.url=jdbc:h2:mem:helpdesk-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BackendIntegrationTest {
    @LocalServerPort
    private int port;

    @Autowired
    private UsuarioRepository usuarios;
    @Autowired
    private PermissaoRepository permissoes;
    @Autowired
    private ChamadoRepository chamados;

    private final HttpClient client = HttpClient.newHttpClient();
    private final JsonMapper json = JsonMapper.builder().build();

    @BeforeEach
    void limparBancoDeTestes() {
        usuarios.deleteAll();
        permissoes.deleteAll();
        chamados.deleteAll();
    }

    private HttpResponse<String> enviar(String metodo, String caminho, String corpo) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + caminho))
                .header("Content-Type", "application/json")
                .method(metodo, corpo == null ? HttpRequest.BodyPublishers.noBody()
                        : HttpRequest.BodyPublishers.ofString(corpo))
                .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    static Stream<Arguments> cadastros() {
        return Stream.of(
                Arguments.of("usuarios", "nome",
                        "{\"nome\":\"Ana\",\"username\":\"ana\",\"senha\":\"segredo-inicial\",\"email\":\"ana@example.com\"}",
                        "{\"nome\":\"Ana editada\",\"username\":\"ana2\",\"senha\":\"segredo-novo\",\"email\":\"ana2@example.com\"}", "Ana editada"),
                Arguments.of("permissoes", "nome", "{\"nome\":\"Consultar\",\"descricao\":\"Consulta\"}",
                        "{\"nome\":\"Editar\",\"descricao\":\"Edição\"}", "Editar"),
                Arguments.of("chamados", "titulo", "{\"titulo\":\"Impressora\",\"descricao\":\"Sem papel\",\"status\":\"ABERTO\"}",
                        "{\"titulo\":\"Impressora resolvida\",\"descricao\":\"Papel reposto\",\"status\":\"CONCLUIDO\"}", "Impressora resolvida"));
    }

    @ParameterizedTest
    @MethodSource("cadastros")
    void crudCompleto(String recurso, String campo, String criacao, String edicao, String esperado) throws Exception {
        String rota = "/api/" + recurso;
        assertEquals(200, enviar("GET", rota, null).statusCode());
        var criado = enviar("POST", rota, criacao);
        assertEquals(201, criado.statusCode(), criado.body());
        long id = json.readTree(criado.body()).get("id").asLong();
        String item = rota + "/" + id;
        assertEquals(item, criado.headers().firstValue("Location").orElseThrow());
        assertFalse(criado.body().contains("senha"));
        var consultado = enviar("GET", item, null);
        assertEquals(200, consultado.statusCode());
        assertFalse(consultado.body().contains("senha"));
        var atualizado = enviar("PUT", item, edicao);
        assertEquals(200, atualizado.statusCode(), atualizado.body());
        assertEquals(esperado, json.readTree(atualizado.body()).get(campo).asText());
        assertFalse(atualizado.body().contains("senha"));
        var lista = enviar("GET", rota, null);
        assertEquals(1, json.readTree(lista.body()).size());
        assertFalse(lista.body().contains("senha"));
        assertFalse(lista.body().contains("segredo"));
        if (recurso.equals("usuarios")) {
            assertEquals("segredo-novo", usuarios.findById(id).orElseThrow().getSenha());
        }
        assertEquals(204, enviar("DELETE", item, null).statusCode());
        assertEquals(404, enviar("GET", item, null).statusCode());
        assertEquals(404, enviar("PUT", item, edicao).statusCode());
        assertEquals(404, enviar("DELETE", item, null).statusCode());
        assertEquals(0, json.readTree(enviar("GET", rota, null).body()).size());
    }

    static Stream<Arguments> camposInvalidos() {
        return Stream.of("POST", "PUT").flatMap(metodo ->
                Stream.of("titulo", "descricao").flatMap(campo ->
                        Stream.of("null", "\"\"", "\"   \"").map(valor -> Arguments.of(metodo, campo, valor))));
    }

    @ParameterizedTest
    @MethodSource("camposInvalidos")
    void rejeitarChamadoInvalidoSemAlterarBanco(String metodo, String campo, String valor) throws Exception {
        String valido = "{\"titulo\":\"Original\",\"descricao\":\"Descrição original\",\"status\":\"ABERTO\"}";
        String rota = "/api/chamados";
        if (metodo.equals("PUT")) {
            var criado = enviar("POST", rota, valido);
            rota += "/" + json.readTree(criado.body()).get("id").asLong();
        }
        String titulo = campo.equals("titulo") ? valor : "\"Alterado\"";
        String descricao = campo.equals("descricao") ? valor : "\"Alterada\"";
        var resposta = enviar(metodo, rota,
                "{\"titulo\":" + titulo + ",\"descricao\":" + descricao + ",\"status\":\"CONCLUIDO\"}");
        assertEquals(400, resposta.statusCode(), resposta.body());
        assertTrue(json.readTree(resposta.body()).has("mensagem"));
        if (metodo.equals("PUT")) {
            JsonNode registro = json.readTree(enviar("GET", rota, null).body());
            assertEquals("Original", registro.get("titulo").asText());
            assertEquals("Descrição original", registro.get("descricao").asText());
            assertEquals("ABERTO", registro.get("status").asText());
        } else {
            assertEquals(0, chamados.count());
        }
    }

    @Test
    void senhaOmitidaOuVaziaNaEdicaoMantemValor() throws Exception {
        var criado = enviar("POST", "/api/usuarios", "{\"nome\":\"Ana\",\"senha\":\"segredo\"}");
        long id = json.readTree(criado.body()).get("id").asLong();
        for (String corpo : new String[]{"{\"nome\":\"Ana\"}", "{\"nome\":\"Ana\",\"senha\":\"\"}"}) {
            var resposta = enviar("PUT", "/api/usuarios/" + id, corpo);
            assertEquals(200, resposta.statusCode());
            assertFalse(resposta.body().contains("senha"));
            assertEquals("segredo", usuarios.findById(id).orElseThrow().getSenha());
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"ABERTO", "EM_ATENDIMENTO", "CONCLUIDO"})
    void aceitarOsTresStatus(String status) throws Exception {
        var resposta = enviar("POST", "/api/chamados",
                "{\"titulo\":\"Teste\",\"descricao\":\"Teste\",\"status\":\"" + status + "\"}");
        assertEquals(201, resposta.statusCode());
        assertEquals(status, json.readTree(resposta.body()).get("status").asText());
    }

    @Test
    void statusPadraoENuloOuDesconhecido() throws Exception {
        String base = "{\"titulo\":\"Teste\",\"descricao\":\"Teste\"";
        var criado = enviar("POST", "/api/chamados", base + "}");
        assertEquals(201, criado.statusCode());
        assertEquals("ABERTO", json.readTree(criado.body()).get("status").asText());
        String item = "/api/chamados/" + json.readTree(criado.body()).get("id").asLong();
        for (String status : new String[]{"null", "\"INVALIDO\""}) {
            assertEquals(400, enviar("POST", "/api/chamados", base + ",\"status\":" + status + "}").statusCode());
            assertEquals(400, enviar("PUT", item, base + ",\"status\":" + status + "}").statusCode());
        }
        assertEquals("ABERTO", json.readTree(enviar("GET", item, null).body()).get("status").asText());
    }

    @Test
    void erroJsonNaoRevelaSenha() throws Exception {
        var resposta = enviar("POST", "/api/usuarios", "{\"senha\":{\"valor\":\"segredo\"}}");
        assertEquals(400, resposta.statusCode());
        assertFalse(resposta.body().contains("senha"));
        assertFalse(resposta.body().contains("segredo"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"usuarios", "permissoes", "chamados"})
    void corsPermiteReactEBloqueiaOutraOrigem(String recurso) throws Exception {
        for (String origem : new String[]{"http://localhost:5173", "http://example.com"}) {
            var request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/" + recurso + "/1"))
                    .header("Origin", origem)
                    .header("Access-Control-Request-Method", "PUT")
                    .header("Access-Control-Request-Headers", "content-type")
                    .method("OPTIONS", HttpRequest.BodyPublishers.noBody()).build();
            var resposta = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (origem.equals("http://localhost:5173")) {
                assertEquals(200, resposta.statusCode());
                assertEquals(origem, resposta.headers().firstValue("Access-Control-Allow-Origin").orElseThrow());
                assertTrue(resposta.headers().firstValue("Access-Control-Allow-Methods").orElseThrow().contains("PUT"));
            } else {
                assertEquals(403, resposta.statusCode());
            }
        }
    }
}
