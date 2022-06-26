const Sequelize = require('sequelize') // incluir o sequelize
const db = require('./db.js') // incluir o banco de dados

const User =  db.define('users',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true,
    },
    name: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    email: {
        type:Sequelize.STRING,
        allowNull:false,
    }, 
    password:{
        type:Sequelize.STRING
    }
})
//Criar a tabela
//User.sync
//Verificar se há alguma diferença na tabela e realiza a alteração 
//User.sync( {alter:true})
module.exports = User;

