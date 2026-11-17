# Guia rápido: configurar o PostgreSQL para o NEXO Estoque

## A. Criar o banco

1. Abra o pgAdmin.
2. Na árvore à esquerda, expanda **Servers** e conecte ao seu servidor PostgreSQL.
3. Clique com o botão direito no banco **postgres** e selecione **Query Tool**.
4. Abra o arquivo `database/criar_banco.sql` no editor, copie `CREATE DATABASE nexo_estoque;` para o Query Tool e execute (ícone de raio / F5).
5. Clique com o botão direito em **Databases** e escolha **Refresh**. O banco `nexo_estoque` deve aparecer.

Não crie uma tabela manualmente. O Spring Boot fará isso na primeira inicialização.

## B. Conferir porta, usuário e senha

No pgAdmin, clique com o botão direito no servidor → **Properties** → **Connection**. Confira:

- Host: normalmente `localhost`.
- Port: frequentemente `5432`, mas use o número que aparece aí.
- Maintenance database: normalmente `postgres`.
- Username: frequentemente `postgres`.

Abra `src/main/resources/application.properties` e confira as mesmas informações:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexo_estoque
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Troque `5432` pela porta do seu pgAdmin e `postgres` na senha pela senha real definida na instalação do PostgreSQL. Se seu usuário tiver outro nome, ajuste o username também.

## C. Executar e conferir a tabela

1. Execute `NexoEstoqueApplication.java` no IntelliJ.
2. Acesse `http://localhost:8081`.
3. Cadastre um produto pela interface.
4. No pgAdmin, expanda `nexo_estoque` → **Schemas** → **public** → **Tables**.
5. Clique com o botão direito em `produtos` → **View/Edit Data** → **All Rows**. O registro cadastrado deve aparecer.

## D. Se aparecer erro de conexão

- `Connection refused`: o serviço PostgreSQL não está iniciado ou a porta na URL está errada.
- `password authentication failed`: a senha configurada em `application.properties` não corresponde à senha do PostgreSQL.
- `database "nexo_estoque" does not exist`: o banco ainda não foi criado; execute o passo A.
- `Port 8081 was already in use`: outro programa está usando a porta da aplicação. Pare a execução anterior ou escolha outra porta em `server.port` e acesse a mesma porta no navegador.
