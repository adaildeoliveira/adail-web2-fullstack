# HELPDESK

Sistema de gerenciamento de chamados, com cadastro, listagem, edição e exclusão de usuários, permissões e solicitações de suporte.

## Tecnologias e requisitos

- Java 21 como alvo de compilação (`release 21`).
- Spring Boot 4.1.0, Spring Web MVC, Spring Data JPA e Spring Security.
- H2 em arquivo. O driver PostgreSQL está nas dependências, mas não é utilizado na execução.
- Maven 3.9.11 via Wrapper, incluído no projeto; não é necessário Maven global.
- React 19.3.0, TypeScript 5.9.3, Vite 8.3.3 e Axios 1.20.0, com CSS próprio.
- Node.js 24 e npm.

É necessário ter Java e Node.js no PATH e acesso à internet para baixar as dependências na primeira execução. O projeto foi validado com JDK 26 e Node.js 24.14.0; a execução em JVM 21 ainda não foi verificada.

## Iniciar o back-end

No PowerShell, na raiz do projeto:

```powershell
.\mvnw.cmd verify
.\mvnw.cmd spring-boot:run
```

O primeiro comando compila e executa os testes. O segundo inicia a API em `http://localhost:8080/api`.

## Iniciar o front-end

Mantenha o back-end em execução e abra outro terminal na raiz do projeto:

```powershell
cd src/main/frontend
npm.cmd ci
npm.cmd run dev
```

Acesse **http://localhost:5173**. Para verificar o TypeScript e gerar o build:

```powershell
npm.cmd run build
```

Use `Ctrl+C` no respectivo terminal para encerrar cada servidor. Em Linux/macOS, utilize `./mvnw` e `npm` em lugar de `mvnw.cmd` e `npm.cmd`.

## Funcionalidades

- CRUD de Usuários: nome, username, senha e e-mail. A senha não aparece nas respostas da API nem nas listagens; na edição, deixá-la vazia mantém a anterior.
- CRUD de Permissões: nome e descrição.
- CRUD de Chamados: título, descrição e status (`ABERTO`, `EM_ATENDIMENTO` e `CONCLUIDO`). Título e descrição não podem estar vazios, inclusive na atualização.
- Formulários de cadastro e edição, confirmação de exclusão e atualização das listas após as operações.

As rotas são `/api/usuarios`, `/api/permissoes` e `/api/chamados`. Cada uma aceita GET e POST; com `/{id}`, aceita GET, PUT e DELETE.

## Persistência e configuração

O banco ativo é **H2 em arquivo**, configurado em `src/main/resources/application.properties` com `jdbc:h2:file:./database.db`. Inicie o back-end pela raiz para manter o banco no mesmo local. O arquivo `database.db.mv.db` é criado automaticamente e mantém os dados entre execuções; não é versionado.

A API segue o fluxo Controller → Service → Repository. O front-end fica em `src/main/frontend`, separado em `pages`, `components`, `services` e `types`. O endereço da API está em `services/api.ts`.

O Spring Security permite acesso local às rotas `/api/**` sem login, com CSRF desativado nessas rotas. O CORS permite o front-end em `http://localhost:5173`. Permissões são apenas um cadastro, sem controle de acesso aplicado. Não há autenticação nem hash de senha; utilize dados fictícios.

## Testes

`mvnw.cmd verify` executa os testes de integração com H2 em memória isolado, sem modificar o banco local. Após o build do back-end, o teste adicional de persistência pode ser executado com:

```powershell
.\scripts\Test-Persistencia.ps1
```

O script inicia o JAR duas vezes e verifica a recuperação de um registro, usando banco e logs próprios em `target/`.
