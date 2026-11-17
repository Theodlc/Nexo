# Prompt utilizado para orientar a geração do frontend e da integração

Desenvolva uma aplicação web de gerenciamento de estoque chamada **NEXO Estoque**, com identidade visual própria, aparência de painel administrativo moderno, responsivo e de fácil utilização. Utilize HTML, CSS e JavaScript no frontend e integre-o a uma API REST desenvolvida em Java com Spring Boot.

A aplicação deve gerenciar produtos com os campos `id`, `nome`, `descricao`, `preco` e `estoque`. O usuário deve conseguir listar produtos, cadastrar novos produtos, editar registros existentes e excluir produtos. Inclua pesquisa local por identificador, nome, descrição, preço e quantidade.

A interface deve conter um painel com indicadores de total de produtos, total de unidades, produtos com estoque reduzido e valor estimado em estoque; formulário com validação; tabela com os registros; identificação visual de produtos sem estoque, com estoque baixo e disponíveis; confirmação antes da exclusão; mensagens de sucesso e erro; estado de carregamento; e indicação visual da conexão com a API.

Use os endpoints REST: `GET /produtos`, `GET /produtos/{id}`, `POST /produtos`, `PUT /produtos/{id}` e `DELETE /produtos/{id}`. Para POST e PUT, envie os dados no corpo da requisição em JSON, utilizando `Content-Type: application/json`. Utilize `fetch()` no JavaScript, trate respostas HTTP de erro e atualize a listagem após alterações.

O backend deve utilizar Java 17 e Spring Boot 3.3.5. Organize as classes em camadas: Controller para receber as requisições, Service para validação e regras de negócio, Repository com Spring Data JPA para persistência e uma entidade Produto mapeada para a tabela `produtos`. O banco deve ser PostgreSQL, com configuração em `application.properties` e driver JDBC no Maven. Configure o Hibernate para criar/atualizar a tabela automaticamente dentro de um banco já existente. O banco `nexo_estoque` deve ser criado previamente no pgAdmin.

Sirva os arquivos do frontend a partir de `src/main/resources/static`, para que o próprio Spring Boot entregue a página. Utilize a porta 8081. Mantenha o código organizado, com nomes claros, validação no servidor e tratamento básico de erros. Não utilize armazenamento em memória: os produtos precisam permanecer salvos no PostgreSQL mesmo após reiniciar a aplicação.
