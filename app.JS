// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();

//CONFIG JSON RESPONSE
app.use(express.json());

//models
const User = require('./models/User')

//Open Route - Public Route
app.get('/', (req, res) =>{
    res.status(200).json({msg:"Bem vindo a nossa api"})
})

//credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;


//register User → DELETAR QUANDO FOR APRESENTAR
app.post('/auth/register', async(req, res) =>{

    const {name, email, password, confirmpassword} = req.body

    //validação
if(!name){
    return res.status(422).json({msg: 'O nome é obrigatório!'})
}
if(!email){
    return res.status(422).json({msg: 'O email é obrigatório!'})
}
if(!password){
    return res.status(422).json({msg: 'O password é obrigatório!'})
}
if(password !== confirmpassword){
    return res.status(422).json({msg: 'As senhas não são iguais'})
}

//checar se o usuario já existe
const userExists = await User.findOne({email: email})
if(userExists){
    return res.status(422).json({msg: 'Email já cadastrado! Tente outro'})
}

//criação de senha
const salt = await bcrypt.genSalt(12)
const passwordHash = await bcrypt.hash(password, salt)

//criação do usuario
const user = new User({
    name,
    email,
    password: passwordHash,
})

try {
await user.save()

res.status(201).json({msg:'usuario criado com sucesso'})

} catch (err) {
    console.log(err)
    res.status(500).json({msg: 'Aconteceu um erro no servidor gratis'})
}

})

//Login
app.post("/auth/login", async (req,res) =>{
    const {email, password} = req.body

    //validação
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({msg: 'O password é obrigatório!'})
    }

    //login se o usuario existe
    const user = await User.findOne({email: email})
    if(!user){
        return res.status(422).json({msg: 'usuario não encontrado'})
    }
    

})

mongoose
.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@suas.joppbdz.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(3000)
    console.log('conectou no banco, parabens')
}).catch(err =>console.log(err))


