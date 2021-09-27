const auth = require('../models/auth')
const user = require('../models/user')
const helper = require('../models/helper')
exports.getDataAcount = async (req, res, next) => {
    if(req.user){
        const userDB = await user.getUser(req.user.uid)
        const result = await user.getDataAcount(userDB.id)
        res.status(200).send(result)
        return;
    }else{
        res.status(200).send(login)
    }
};

exports.transfer = async (req, res, next) => {
    let response = ''

    const login = await auth.login(req.body)

    if(!login.id){
        response = await helper.validateMessage(false, 'warning', 'Senha inválida.')
        res.status(200).send(response)
        return;
    }
    
    const exists = await auth.emailExists(req.body.user_email_destination)
    if(!exists){
        response = await helper.validateMessage(false, 'warning', 'Destinatário não encontrado.')
        res.status(200).send(response)
        return;
    }
    
    const balance = await user.balance(login.id)
    if(exists && (parseFloat(balance) < parseFloat(req.body.value_transferred))){
        response = await helper.validateMessage(false, 'error', 'Saldo insuficiente.')
        res.status(200).send(response)
        return;
    }else{
        response = await user.transfer(login.id, req.body.user_email_destination, req.body.value_transferred);
        res.status(200).send(response)
    }
}