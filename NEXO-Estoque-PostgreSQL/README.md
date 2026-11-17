# NEXO Estoque — versão com PostgreSQL

Sistema web de gerenciamento de produtos desenvolvido com Java 17, Spring Boot 3.3.5, Spring Data JPA, PostgreSQL, HTML, CSS e JavaScript.

## O que esta versão faz

- Lista produtos: `GET /produtos`
- Consulta um produto: `GET /produtos/{id}`
- Cadastra produto: `POST /produtos`
- Atualiza produto: `PUT /produtos/{id}`
- Exclui produto: `DELETE /produtos/{id}`
- Salva os registros permanentemente no PostgreSQL.
- Cria automaticamente a tabela `produtos` quando a aplicação inicia, desde que o banco `nexo_estoque` já exista e a conexão esteja correta.

## 1. Criar o banco no pgAdmin

O pgAdmin é o programa usado para administrar o PostgreSQL. O servidor PostgreSQL é o banco de dados propriamente dito.

1. Abra o pgAdmin e conecte ao seu servidor PostgreSQL.
2. Clique com o botão direito no banco padrão `postgres` e escolha **Query Tool**.
3. Abra o arquivo `database/criar_banco.sql` e execute o comando. Ele cria o banco `nexo_estoque`.
4. Atualize a árvore **Databases** no pgAdmin. O banco `nexo_estoque` deverá aparecer.

> O Hibernate cria a tabela `produtos` automaticamente dentro desse banco quando o Spring Boot inicia. Não é necessário criar a tabela manualmente.

## 2. Conferir a conexão

Abra `src/main/resources/application.properties` e confira:

```properties
server.port=8081
spring.datasource.url=jdbc:postgresql://localhost:5432/nexo_estoque
spring.datasource.username=postgres
spring.datasource.password=postgres
```

- `5432` é a porta padrão mais comum do PostgreSQL. Se o seu servidor estiver usando `5433` ou outra porta, altere o número na URL.
- Substitua a senha `postgres` pela senha que você definiu ao instalar o PostgreSQL.
- Se o usuário do PostgreSQL for diferente de `postgres`, altere também `spring.datasource.username`.

Também é possível configurar por variáveis de ambiente `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`; se elas não existirem, o Spring usa os valores padrão mostrados acima.

## 3. Executar o projeto

1. Abra a pasta que contém este `pom.xml` no IntelliJ IDEA.
2. Aguarde o Maven carregar as dependências. O projeto utiliza Java 17.
3. Execute `src/main/java/br/com/nexo/estoque/NexoEstoqueApplication.java`.
4. Quando o console indicar que o Tomcat iniciou na porta **8081**, abra `http://localhost:8081`.

O frontend fica em `src/main/resources/static`, então é servido pelo próprio Spring Boot. Não é necessário usar Live Server.

## 4. Testar a API

| Método | URL | Ação |
|---|---|---|
| GET | `http://localhost:8081/produtos` | Lista produtos |
| GET | `http://localhost:8081/produtos/1` | Consulta o produto 1 |
| POST | `http://localhost:8081/produtos` | Cadastra produto |
| PUT | `http://localhost:8081/produtos/1` | Atualiza o produto 1 |
| DELETE | `http://localhost:8081/produtos/1` | Exclui o produto 1 |

Exemplo de JSON para POST e PUT:

```json
{
  "nome": "Teclado mecânico",
  "descricao": "Teclado USB com iluminação",
  "preco": 159.90,
  "estoque": 12
}
```

## 5. Organização do backend

- `model/Produto.java`: entidade JPA mapeada para a tabela `produtos`.
- `repository/ProdutoRepository.java`: interface que estende `JpaRepository`; fornece operações de persistência.
- `service/ProdutoService.java`: valida os dados e coordena as operações de negócio.
- `controller/ProdutoController.java`: recebe as requisições HTTP e chama a Service.
- `controller/HomeController.java`: encaminha `/` para `index.html`.
- `NexoEstoqueApplication.java`: inicia o Spring Boot.

## 6. Como a persistência funciona

O frontend envia JSON para a API. O Controller recebe a requisição e chama a Service. A Service utiliza o `ProdutoRepository`, e o Spring Data JPA/Hibernate executa os comandos SQL no PostgreSQL.

A propriedade `spring.jpa.hibernate.ddl-auto=update` cria/atualiza a estrutura das tabelas dentro do banco já criado. Ela **não cria o próprio banco de dados**. O banco `nexo_estoque` precisa existir antes da primeira inicialização, por isso incluímos o script `database/criar_banco.sql`.

Os dados não são perdidos quando o backend é reiniciado: permanecem no PostgreSQL.
