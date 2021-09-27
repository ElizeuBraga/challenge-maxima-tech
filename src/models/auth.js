const db = require('../models/db')
const bcrypt = require('bcrypt')
const balance = require('./balance')
const jwt = require('jsonwebtoken')

const table = "virtual_wallet.users"

exports.login = async (reqBody) => {
    const sql = {
        text: `select id, name, email, password from ${table} where email = $1`,
        values: [reqBody.email]
    }

    const userDB = await db.getOne(sql)

    
    if(!userDB){
        return false
    }
    
    const match = await bcrypt.compare(reqBody.password, userDB.password)

    if(!match){
        return false
    }

    delete userDB.password

    userDB.token = await this.generateAccessToken(userDB.email) 

    return userDB

};

exports.register = async (reqBody) => {
    await db.createDataBaseEstructure()
    
    const hash = bcrypt.hashSync(reqBody.password, 10)

    await db.execute('BEGIN;')
    const sql = {
        text: `INSERT INTO ${table}("name",email,"password") VALUES($1, $2, $3) RETURNING *`,
        values: [reqBody.name, reqBody.email, hash],
    }

    const user = await db.getOne(sql)

    if(user){
        await balance.initBalance(user.id)
        await balance.add(user.id, 100)
        delete user.password

        user.token = await this.generateAccessToken(user.email)
    }

    await db.execute('COMMIT;')

    return user
};

exports.checkAuth = async (reqBody) => {
    res.status(200).send('Ok')
};

exports.emailExists = async (email) => {
    const sql = {
        text: `SELECT COUNT(*) FROM ${table} WHERE email = $1`,
        values: [email],
    }

    const result = await db.getOne(sql)

    if(parseInt(result.count) > 0){
        return true
    }
    return false
};

exports.generateAccessToken = async (email) => {
    return jwt.sign({uid:email}, process.env.NODE_TOKEN_SECRET, { expiresIn: '20m' })
};

exports.authenticateToken = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.NODE_TOKEN_SECRET, (err, user) => {
      
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}