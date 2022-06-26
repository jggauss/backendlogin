

CRIAR a base de dados no MYSQL
### create database celke character set utf8mb4 collate utf8mb4_unicode_ci

criar a tabela no Mysql
### create table `users`(
### `id` int NOT NULL AUTO_INCREMENT,
### `name` varchar(220) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
### `email` varchar(220) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
### PRIMARY KEY(`id`)
### )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

Selecionar um registro no banco de dados.
### SELECT id, name, email FROM users
Limitar a seleção dos registros
### SELECT id, name, email FROM users LIMIT 2
Limitar a seleção dos registros e indicar o início o OFFSET indica onde começa
### SELECT id, name, email FROM users LIMIT 2 OFFSET 4

Cadastrar um registro no banco de dados
### INSERT INTO users(name, email) VALUE ('Cesar','celke@gmail.com.br') LIMIT 1

Condição na busca do registro
### INSERT INTO users(name, email) VALUE ('Cesar','celke@gmail.com.br') LIMIT 1

Condição na busca do registro AND
### SELECT id,name, email FROM users WHERE email = 'jose@gmail.com.br' AND name = 'José'

Condição na busca do registro OR
### SELECT id,name, email FROM users WHERE email = 'jose@gmail.com.br' OR name = 'José'

Ordenar os registros ASCENDENTE
### SELECT id, name, email FROM users ORDER BY id ASC
Ordenar os registros DESCENDENTE
### SELECT id, name, email FROM users ORDER BY id ASC

Editar um registro do banco de Dados
### UPDATE users SET name = 'Pedroso', email = 'pedroso@gmail.com.br' WHERE id = 6

Apagar um registro
### DELETE FROM users WHERE id = 6

Instalar a biblioteca  Sequelize para gerenciar o banco de Dados MySql
### npm install --save sequelize

Instalar o drive do banco de dados MySql
### npm install --save mysql2

Instalar o módulo para criptografar a senha
### npm install --save bcryptjs

Instalar a dependência jwt
### npm install --save jsonwebtoken 

Gerenciar variáveis de ambiente (para usar o token em todo o projeto)
### npm install --save dotenv

Liberar acesso a APIS
### npm install --save cors

Dependência para validar campos
### npm install --save yup
