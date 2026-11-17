# Roteiro de apresentação — NEXO Estoque com PostgreSQL

## 1. Como o frontend realiza uma requisição HTTP ao backend?

O frontend utiliza JavaScript e a função `fetch()` para enviar requisições HTTP para a API REST do Spring Boot. A URL base das operações é `/produtos`, no mesmo servidor que entrega a página.

## 2. Como são utilizados os verbos HTTP?

- GET `/produtos`: lista os produtos.
- GET `/produtos/{id}`: consulta um produto pelo ID.
- POST `/produtos`: cadastra um novo produto.
- PUT `/produtos/{id}`: atualiza um produto existente.
- DELETE `/produtos/{id}`: exclui um produto.

## 3. Como os dados são enviados?

No formulário, o JavaScript lê nome, descrição, preço e estoque, monta um objeto e usa `JSON.stringify()` para convertê-lo em JSON. Esse conteúdo é enviado no corpo da requisição com o cabeçalho `Content-Type: application/json`.

## 4. Como o backend processa e responde?

O `ProdutoController` recebe a requisição HTTP e chama o `ProdutoService`. A Service valida os campos e chama o `ProdutoRepository`. Esse repositório estende `JpaRepository`, e o Spring Data JPA/Hibernate transforma as operações em comandos SQL executados no PostgreSQL. O backend retorna os dados em JSON e um status HTTP adequado.

## 5. Como o frontend apresenta a resposta?

O JavaScript lê a resposta do `fetch()`, converte o JSON em objetos JavaScript e atualiza os indicadores e a tabela. Após cadastrar, editar ou excluir, o frontend consulta novamente `GET /produtos` para exibir os dados atualizados.

## 6. Como o banco e as tabelas são criados?

O banco `nexo_estoque` é criado uma vez no pgAdmin executando `database/criar_banco.sql`. Na inicialização do Spring Boot, o Hibernate usa `spring.jpa.hibernate.ddl-auto=update` para criar ou atualizar a tabela `produtos` dentro desse banco. Essa configuração não cria o próprio banco, apenas as tabelas.

## 7. O que cada camada faz?

- **Controller:** recebe as requisições HTTP e define as respostas.
- **Service:** concentra validações e regras de negócio.
- **Repository:** faz a comunicação com o banco por meio do Spring Data JPA.
- **Entity Produto:** representa a tabela `produtos` e seus campos.
- **PostgreSQL:** armazena os dados de forma persistente.

## Demonstração sugerida

1. Mostrar a conexão com o servidor PostgreSQL no pgAdmin e o banco `nexo_estoque`.
2. Abrir `http://localhost:8081`.
3. Cadastrar um produto e mostrar que ele aparece na tabela.
4. Atualizar o navegador e confirmar que o registro continua salvo.
5. No pgAdmin, abrir `nexo_estoque` → Schemas → public → Tables → produtos e consultar os registros.
6. Editar um produto e depois excluí-lo pela interface.

## Pontos técnicos para lembrar

- O pgAdmin é a ferramenta gráfica de administração; o PostgreSQL é o servidor de banco de dados.
- O `pom.xml` adiciona `spring-boot-starter-data-jpa` e o driver `postgresql`.
- A porta do frontend/backend nesta versão é 8081; a porta do PostgreSQL é configurada separadamente na URL JDBC (padrão 5432).
- Os valores de usuário e senha do PostgreSQL devem corresponder à instalação local.
- Os produtos ficam persistidos no banco, portanto não desaparecem ao reiniciar o backend.
