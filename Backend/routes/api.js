const express=require('express');
const UserRouter = require('./userRouter');
const AccRouter = require('./AccountRouter');

const Router=express.Router();

//api/v1/user/signin 
//api/v1/user/changePassword
Router.use("/user",UserRouter);
//api/v1/account
//api/v1/account/transferMoney
//api/v1/account/checkBalance

Router.use("/account",AccRouter);

Router.get('/',(req,res)=>{
    res.send("Hellow World!!")
})


module.exports=Router;