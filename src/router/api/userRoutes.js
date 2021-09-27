const express = require('express')
const router = express.Router()
const controller = require('../../controllers/userController')
const jwt = require('jsonwebtoken')
const auth = require('../../models/auth')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.NODE_TOKEN_SECRET, (err, user) => {
      
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}

router.post('/getAcountData', authenticateToken, controller.getDataAcount)
router.post('/transfer', controller.transfer)
module.exports = router