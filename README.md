# Carteira Digital

> Um desafio da Máxima Tech

## Build Setup

``` bash
# Instalar dependencias
npm install

# Terminal 1 localhost:8080
npm start

# Terminal 2 localhost:3000
node ./src/server

# Para conexão com banco de dados, seguir arquivo (.env), a criação de tabelas e schemas serão executadas automaticamente pela aplicação.
CREATE SCHEMA IF NOT EXISTS virtual_wallet;

CREATE TABLE IF NOT EXISTS virtual_wallet.users(
    id SERIAL PRIMARY KEY,
    "name" VARCHAR(200) NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    "password" VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS virtual_wallet.balances(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    balance FLOAT8,
    FOREIGN KEY(user_id) REFERENCES virtual_wallet.users(id)
);

CREATE TABLE IF NOT EXISTS virtual_wallet.movements(
    id SERIAL PRIMARY KEY,
    "date_transaction" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id_origin INTEGER NOT NULL,
    user_id_destination INTEGER NOT NULL,
    value_transferred FLOAT8 NOT NULL,
    FOREIGN KEY(user_id_origin) REFERENCES virtual_wallet.users(id),
    FOREIGN KEY(user_id_destination) REFERENCES virtual_wallet.users(id)
);

# Endpoints
post> api/auth/login
{
  "email": "elizeu@gmail.com", 
  "password": "1234"
}

post> api/auth/register
{
  "name": "Elizeu", 
  "email": "elizeu@gmail.com", 
  "password": "1234"
}

post> api/user/transfer
{
  "email": "elizeu@gmail.com", 
  "password": "1234", 
  "user_email_destination": "fulanodetal@gmail.com", 
  "value_transferred": "80.00"
}

post> api/user/getAcountData
authorization: Bearer <Token retornado em login ou registrar>

# Justificativas
Prezados(as), levando em conta o tempo disponibilizado que foi relativamente curto para execução da tarefa, os topicos a seguir não foram implementados.
- Docker
- Deploy (Houve tentativa, em heroku)
