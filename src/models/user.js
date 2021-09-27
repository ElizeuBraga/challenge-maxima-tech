const db = require('./db')
const balance = require('./balance')
const movement = require('./movement')
const helper = require('./helper')

const table = "virtual_wallet.users"

exports.getUser = async (user) => {
    const sql = {
        text: `SELECT * FROM ${table} WHERE email = $1`,
        values: [user]
    }

    return await db.getOne(sql)
}

exports.getDataAcount = async (user_id) => {
    return {
        balance: await balance.balance(user_id),
        movements: {
            sent: await movement.sent(user_id),
            received: await movement.received(user_id),
            lastSent: await movement.lastSent(user_id)
        }
    }
}

exports.transfer = async (user_id_origin, user_email_destination, value_transferred) => {
    const user = await this.getUser(user_email_destination)

    await db.execute('BEGIN;')
    await balance.remove(user_id_origin, value_transferred)
    await balance.add(user.id, value_transferred)
    await movement.add(user_id_origin, user.id, value_transferred)
    await db.execute('COMMIT;')

    return helper.validateMessage(true, 'success', 'Tranferencia realizada com sucesso!')
}

exports.balance = async (user_id) => {
    return await balance.balance(user_id)
}