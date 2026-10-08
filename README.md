# HELPDESK

Sistema para gerenciar solicitações de suporte e os cadastros de usuários e permissões.

## Tecnologias

Java 21, Spring Boot, Maven Wrapper, Spring Data JPA, Spring Security e H2 no back-end. React, TypeScript, Vite e Axios no front-end, com CSS próprio.

## Funcionalidades

- Cadastro, listagem, edição e exclusão de usuários, permissões e chamados.
- Chamados com status Aberto, Em atendimento e Concluído.
- Validação de título e descrição dos chamados.
- Senha do usuário oculta nas respostas da API e nas listagens.

## Executar o back-end

Com Java instalado, abra um terminal na raiz do projeto:

```powershell
.\mvnw.cmd spring-boot:run
```

O Maven Wrapper baixa as dependências necessárias. A API fica em `http://localhost:8080/api`.

## Executar o front-end

Com Node.js 24 e npm instalados, mantenha o back-end em execução e abra outro terminal na raiz do projeto:

```sh
cd src/main/frontend
npm ci
npm run dev
```

Acesse `http://localhost:5173`. Para encerrar cada servidor, pressione `Ctrl+C` no respectivo terminal.

## Banco de dados

O H2 é persistente em arquivo. Ao iniciar o back-end pela raiz do projeto, os dados são salvos em `database.db.mv.db` e permanecem após reiniciar a aplicação. Esse arquivo é local e não faz parte do repositório.
