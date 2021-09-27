const auth = require('../models/auth')
const helper = require('../models/helper')

exports.login = async (req, res, next) => {
    const user = await auth.login(req.body)
    if(!user){
        res.status(200).send(
           await helper.validateMessage(false, 'error', 'Usuario ou senha inválidos!') 
        )
        return;
    }
    res.status(200).send(user)
};

exports.register = async (req, res, next) => {
    if(await auth.emailExists(req.body.email)){
        res.status(200).send(
            await helper.validateMessage(false, 'error', 'E-mail já está cadastrado na base de dados!')
        );
        return;
    }
    const result = await auth.register(req.body)
    res.status(200).send(result);
};

exports.checkAuth = async (req, res, next) => {
    res.status(200).send('Ok')
};