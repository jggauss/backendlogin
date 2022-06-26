const jwt = require('jsonwebtoken')
const { promisify } = require("util")
require('dotenv').config()

//require('dotenv').config();


module.exports = {
    eAdmin: async function(req, res, next){
        //return res.json({mensagem:"Validar token"})
        const authHeader = req.headers.authorization;
        if(!authHeader){
          return res.status(400).json({
            erro:true,
            mensagem:"Erro, nescessário fazer o login"
        })
        }
        const [bearer, token ]=authHeader.split(' ')
        console.log(token)
        
        
        //verificar se existe o token
        if(!token){
          return res.status(400).json({
            erro:true,
            mensagem:"Erro, nescessário fazer o login"
          })
        }
        try {
          const decoded = await promisify(jwt.verify)(token,process.env.SECRET) // esta é a chave que foi gerado o token apenas com ela é possível acessar
          req.userId =decoded.id;
          //req.levelAcess = decoded.levelAcess;
          return next()
        }catch(err){
          return res.status(401).json({
            erro:true,
            mensagem:"Erro, nescessário fazer o login"
          });
        }
      }
};