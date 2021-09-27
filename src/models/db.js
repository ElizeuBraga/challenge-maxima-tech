const { Client } = require('pg')

let client = new Client({
    user: process.env.NODE_APP_USER,
    host: process.env.NODE_APP_HOST,
    database: process.env.NODE_APP_DATABASE,
    password: process.env.NODE_APP_PASSWORD,
    port: process.env.NODE_APP_PORT
})

if(process.env.NODE_ENV == 'production'){
    client = new Client({
        user: process.env.NODE_APP_USER,
        host: process.env.NODE_APP_HOST,
        database: process.env.NODE_APP_DATABASE,
        password: process.env.NODE_APP_PASSWORD,
        port: process.env.NODE_APP_PORT,
        ssl: {rejectUnauthorized: false}
    })
}

client.connect()

exports.execute = async (sql) => {
    let data = [];
    await client.query(sql).then(res => {
        data = res.rows
    }).catch(e => {
        console.error(e.stack)
    })

    return data
};

exports.getOne = async (sql) => {
    let data = false;
    await client.query(sql).then(res => {
        data = res.rows[0]
    }).catch(e => {
        console.error(e.stack)
    })

    return data
};

exports.createDataBaseEstructure = async () =>{
    const sqlCreateSchema = `CREATE SCHEMA IF NOT EXISTS virtual_wallet;`
    await this.execute(sqlCreateSchema)

    const sqlCreateTableUsers = `
        CREATE TABLE IF NOT EXISTS virtual_wallet.users(
            id SERIAL PRIMARY KEY,
            "name" VARCHAR(200) NULL,
            email VARCHAR(200) NOT NULL UNIQUE,
            "password" VARCHAR(200) NOT NULL
        );
    `

    await this.execute(sqlCreateTableUsers)

    const sqlCreateTableBalances = `
        CREATE TABLE IF NOT EXISTS virtual_wallet.balances(
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            balance FLOAT8,
            FOREIGN KEY(user_id) REFERENCES virtual_wallet.users(id)
        );
    `

    await this.execute(sqlCreateTableBalances)
    
    const sqlCreateTableMovements = `
        CREATE TABLE IF NOT EXISTS virtual_wallet.movements(
            id SERIAL PRIMARY KEY,
            "date_transaction" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            user_id_origin INTEGER NOT NULL,
            user_id_destination INTEGER NOT NULL,
            value_transferred FLOAT8 NOT NULL,
            FOREIGN KEY(user_id_origin) REFERENCES virtual_wallet.users(id),
            FOREIGN KEY(user_id_destination) REFERENCES virtual_wallet.users(id)
        );
    `

    await this.execute(sqlCreateTableMovements);
}

exports.validateMessage = async (status, icon, text) =>{
    return {
        status: status,
        text: text,
        icon: icon
    }
}