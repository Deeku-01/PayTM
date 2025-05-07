const express=require('express');
const AccRouter=express.Router();

AccRouter.get('/',(req,res)=>{
    res.send("Hellow World!!")
})


module.exports=AccRouter;