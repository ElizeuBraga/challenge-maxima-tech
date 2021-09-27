const db = require('./db')

const table = "virtual_wallet.balances"

exports.initBalance = async (user_id) => {
    const sql = {
        text: `INSERT INTO ${table} (user_id, balance)VALUES($1, 0);`,
        values: [user_id]
    }

    await db.execute(sql)
}

exports.add = async (user_id, balance) => {
    const sql = {
        text: `UPDATE ${table} SET balance = balance + $1 WHERE user_id = $2`,
        values: [parseFloat(balance), user_id]
    }

    await db.execute(sql)
}

exports.remove = async (user_id, balance) => {
    const sql = {
        text: `UPDATE ${table} SET balance = balance - $1 WHERE user_id = $2`,
        values: [parseFloat(balance), user_id]
    }

    await db.execute(sql)
}

exports.balance = async (user_id) => {
    const sql = {
        text: `SELECT balance FROM ${table} WHERE user_id = $1`,
        values: [user_id]
    }

    const balance = await db.getOne(sql)

    return balance.balance
}