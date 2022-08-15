//jshint esversion:6
const express=require('express');
const app=express();
const ejs=require('ejs');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const mongoose_encrypt=require('mongoose-encryption');
require('dotenv').config();
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
userSchema.plugin(mongoose_encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
const Users=new mongoose.model("user",userSchema);
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/login',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    Users.findOne({email:username,password:password},(err,foundusers)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('secrets');
        }
    })
})
app.post('/register',(req,res)=>{
    const newUser=new Users({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render('submit')
        }
    });
})

app.listen(3000,()=>{
    console.log("Server has started at port 3000");
})