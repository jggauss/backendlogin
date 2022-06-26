const express = require('express')
var cors = require('cors')
const yup = require('yup')
const { Op } = require("sequelize")

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { eAdmin }= require("./middlewares/auth.js")
const User = require("./models/User.js") //criando o banco de dados
const { application } = require('express')
const app = express()


app.use(express.json()) //permite o app a usar json

app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin","*")
  res.header(" Access-Control-Allow-Methods","GET", "PUT", "POST", "DELETE")
  res.header("Access-Control-Allow-Headers","X-PINGOTHER,Content-Type, Authorization")
  app.use(cors())
  next()
})



//rotas listar todos os usuários
app.get('/users/:page',eAdmin ,async (req, res) => {

  const {page = 1} = req.params
  const limit = 4
  var lastPage = 1

  const countUser = await User.count()
  if(countUser===null){
    return res.status(400).json({
      erro:true,
      mensagem:"Erro.Nenhum usuário encontrado"
    })
  }else{
    lastPage = Math.ceil(countUser/limit)
  }
  
  await User.findAll({
    attributes:['id','name','email','password'],
    order: [['id','DESC']],
    offset:Number((page*limit)-limit),
    limit:limit
  })
  .then((users)=>{
    return res.json({
      erro:false,
      users,
      countUser,
      lastPage
    })
  }).catch(()=>{
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nenhum usuário encontrado"
  })
  })
  
})


app.get('/user/:id', eAdmin , async (req, res) => {
    const { id } = req.params

    //await User.findAll({where: {id:id}})
    await User.findByPk(id)
    //await User.findAll({where: {"name":id}})
    .then((user)=>{
      return res.json({
        erro: false,
        user:user
      })
    }).catch(()=>{
      return res.status(400).json({
        erro:true,
        mensagem:"Erro, nenhum usuário encontrado"
    })
  })
   
})


  app.put("/user", eAdmin, async (req, res) => {
    const { id,name, email } = req.body

    const schema = yup.object().shape({
      // password:yup.string("Erro. Nescessário preencher o campo senha")
      // .required("Erro. Nescessário preencher o campo senha")
      // .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
      email: yup.string("Erro. nescessário preencher o campo e-mail")
      .email("Erro. Preencha um email válido")
      .required("Erro. Nescessário preencher o campo e-mail"),
      name: yup.string("Erro. Nescessário preencher o campo nome")
      .required("Erro. Nescessário preencher o campo nome"),
    })
  
    try{
      await schema.validate(req.body)
    }catch(err){
      return res.status(400).json({
        erro:true,
        mensagem:err.errors
      })
    }
  
    const user = await User.findOne({
      where:{
        email: req.body.email,
        id: {
          [Op.ne]:id
        }
        
      }
    })
    if(user){
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Este email já está cadastrado"
    });
    }
  
    
    await User.update(req.body, {where:{id}})
    .then(()=>{
      return res.json({
        erro:false,
        mensagem:"Usuário editado com sucesso"
    })
    }).catch(()=>{
      return res.status(400).json({
        erro:true,
        mensagem:"Erro, usuário não foi editado"
    })
    })

    
  })

  app.delete("/user/:id",eAdmin , async (req, res) => {
    const { id } = req.params
    await User.destroy({where:{id}})
    .then(()=>{
      return res.json({
        erro: false,
        mensagem: "Usuário apagado com sucesso!"
    });
    })
    .catch(()=>{
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Usuário não apagado!"
    });
    })
   
  })


app.post("/user", async(req, res) => {
  var dados = req.body;   
  
  const schema = yup.object().shape({
    password:yup.string("Erro. Nescessário preencher o campo senha")
    .required("Erro. Nescessário preencher o campo senha")
    .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
    email: yup.string("Erro. nescessário preencher o campo e-mail")
    .email("Erro. Preencha um email válido")
    .required("Erro. Nescessário preencher o campo e-mail"),
    name: yup.string("Erro. Nescessário preencher o campo nome")
    .required("Erro. Nescessário preencher o campo nome"),
  })

  try{
    await schema.validate(dados)
  }catch(err){
    console.log(err)
    return res.status(400).json({
      erro:true,
      mensagem:err.errors
    })
  }

  const user = await User.findOne({
    where:{
      email: req.body.email,
    }
  })
  if(user){
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Este email já está cadastrado"
  });
  }

  dados.password = await bcrypt.hash(dados.password,8)
  
  await User.create(dados)
  .then(()=>   {
      return res.json({
          erro: false,
          mensagem: "Usuário cadastrado com sucesso!"
      });
  }).catch(()=>  {
      return res.status(400).json({
          erro: true,
          mensagem: "Erro: Usuário não cadastrado com sucesso!"
      });
  });    
});

//Editar somente a senha
app.put("/user-senha", eAdmin , async (req, res) => {
  const { id, password } = req.body
 
  const schema = yup.object().shape({
    password:yup.string("Erro. Nescessário preencher o campo senha")
    .required("Erro. Nescessário preencher o campo senha")
    .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
    
  })

  try{
    await schema.validate(req.body)
  }catch(err){
    console.log(err)
    return res.status(400).json({
      erro:true,
      mensagem:err.errors
    })
  }

  

  var senhaCrypt = await bcrypt.hash(password,8)


  
  await User.update({password:senhaCrypt}, {where:{id}})
  .then(()=>{
    return res.json({
      erro:false,
      mensagem:"Usuário editado com sucesso"
  })
  }).catch(()=>{
    return res.status(400).json({
      erro:true,
      mensagem:"Erro, usuário não foi editado"
  })
  })

  
})

app.post('/login', async (req,res)=>{

  await sleep(1000)
  function sleep(ms){
    return new Promise((resolve) => {setTimeout(resolve,ms)})
  }

  const user = await User.findOne({
    attributes:['id','name','email','password'],
    where:{
      email:req.body.email
    }})
  
  if (user===null){
    return res.status(400).json({
      erro:true,
      mensagem:"Erro, usuário ou senha incorretos"
  })
  }
  if(!(await bcrypt.compare(req.body.password,user.password))){
    return res.status(400).json({
      erro:true,
      mensagem:"Erro,  usuário ou senha incorretos"
  })
  }

  var token = jwt.sign({ id: user.id },process.env.SECRET,{expiresIn:'7d'}) //expira em 7 dias {expiresIn:600}) //expira em 10 minutos
  return res.json({
    erro:false,
    mensagem:"Login efetuado com sucesso",
    token
  })
})

app.get('/val-token', eAdmin,async (req,res) => {
  await User.findByPk(req.userId,{attributes:['id','name','email']})
  
  .then((user)=>{
    return res.json({
      erro:false,
      user
    })
  }).catch(()=>{
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Nescessário realizar o login"
  })
  })
})

app.get('/view-profile', eAdmin , async (req, res) => {
  const id = req.userId

  
  await User.findByPk(id)
  
  .then((user)=>{
    return res.json({
      erro: false,
      user:user
    })
  }).catch(()=>{
    return res.status(400).json({
      erro:true,
      mensagem:"Erro, nenhum usuário encontrado"
  })
})
 
})


app.put("/edit-profile", eAdmin, async (req, res) => {
  const id = req.userId
  const schema = yup.object().shape({
    // password:yup.string("Erro. Nescessário preencher o campo senha")
    // .required("Erro. Nescessário preencher o campo senha")
    // .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
    email: yup.string("Erro. nescessário preencher o campo e-mail")
    .email("Erro. Preencha um email válido")
    .required("Erro. Nescessário preencher o campo e-mail"),
    name: yup.string("Erro. Nescessário preencher o campo nome")
    .required("Erro. Nescessário preencher o campo nome"),
  })

  try{
    await schema.validate(req.body)
  }catch(err){
    return res.status(400).json({
      erro:true,
      mensagem:err.errors
    })
  }

    
  await User.update(req.body, {where:{id}})
  .then(()=>{
    console.log("erro, não foi editado")
    return res.json({
      erro:false,
      mensagem:"Perfil editado com sucesso"
  })
  }).catch(()=>{
    console.log("erro, não foi editado")
    return res.status(400).json({
      erro:true,
      
      mensagem:"Erro, Perfil não foi editado"
  })
  })

  
})

app.put("/edit-profile-password", eAdmin , async (req, res) => {
  const id = req.userId
  const {password} = req.body
 
  const schema = yup.object().shape({
    password:yup.string("Erro. Nescessário preencher o campo senha")
    .required("Erro. Nescessário preencher o campo senha")
    .min(6,"Erro. A senha deve ter no mínimo 6 caracteres"),
    
  })

  try{
    await schema.validate(req.body)
  }catch(err){
    console.log(err)
    return res.status(400).json({
      erro:true,
      mensagem:err.errors
    })
  }

  

  var senhaCrypt = await bcrypt.hash(password,8)


  
  await User.update({password:senhaCrypt}, {where:{id}})
  .then(()=>{
    return res.json({
      erro:false,
      mensagem:"Usuário editado com sucesso"
  })
  }).catch(()=>{
    return res.status(400).json({
      erro:true,
      mensagem:"Erro, usuário não foi editado"
  })
  })

  
})


app.listen(8080,() =>{
  console.log("Servidor rodando na porta 8080")
})
