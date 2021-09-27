const db = require('./db')

const table = "virtual_wallet.movements";

exports.add = async (user_id_origin, user_id_destination, value_transferred) => {
    const sql = {
        text: `INSERT INTO ${table} (user_id_origin,user_id_destination,value_transferred) VALUES ($1, $2, $3)`,
        values: [user_id_origin, user_id_destination, parseFloat(value_transferred)]
    }

    await db.execute(sql);
}

exports.sent = async (user_id_origin) => {
    const sql = {
        text: `
        select 
            to_char(date_transaction, 'DD-MM-YYYY') as date_transaction,
            value_transferred::numeric::money,
            u.name
        from virtual_wallet.movements m
        join virtual_wallet.users u on u.id = m.user_id_destination
        WHERE user_id_origin = $1 ORDER BY m.date_transaction DESC`,
        values: [user_id_origin]
    }

    return await db.execute(sql)
}

exports.lastSent = async (user_id_origin) => {
    const sql = {
        text: `
            select 
                to_char(date_transaction, 'DD-MM-YYYY') as date_transaction,
                value_transferred::numeric::money,
                u.name
            from virtual_wallet.movements m
            join virtual_wallet.users u on u.id = m.user_id_destination
            WHERE user_id_origin = $1
            and m.id = (select max(id) from virtual_wallet.movements)`,
        values: [user_id_origin]
    }

    return await db.getOne(sql)
}

exports.received = async (user_id_origin) => {
    const sql = {
        text: `
        select 
            to_char(date_transaction, 'DD-MM-YYYY') as date_transaction,
            value_transferred::numeric::money,
            u.name
        from virtual_wallet.movements m
        join virtual_wallet.users u on u.id = m.user_id_origin
        WHERE user_id_destination = $1`,
        values: [user_id_origin]
    }

    return await db.execute(sql)
}