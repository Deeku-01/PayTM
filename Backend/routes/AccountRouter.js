const express=require('express');
const AuthMiddleware = require('../middlewares');
const { Account } = require('../databaseUtil');
const { default: mongoose } = require('mongoose');
const AccRouter=express.Router();

AccRouter.get('/balance',AuthMiddleware, async(req,res)=>{
    const acc=await Account.findOne({
        userId:req.userId
    });

    res.json({
        balance:acc.balance
    })
    
})

AccRouter.post("/transfer",AuthMiddleware,async(req,res)=>{
          //sessions are required to ensure that the transaction is completed in its entirely
          const session=await mongoose.startSession();
          session.startTransaction();
          //This is defined here coz in catch block we require the session
    try{
      
        const {amount,to}= req.body;

        //Fetch the accounts within the transaction
        const account=await Account.findOne({userId:req.userId}).session(session);

        if(!account || account.balance<amount){
            await session.abortTransaction();
            return res.status(400).json({
                message:"Insufficient  Balance"
            })
        }
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        //Perform the Transfer 
        await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        //commit the transaction 
        await session.commitTransaction();
        res.json({
            message:"Transaction Succesfull"
        });

    } catch(err){
        await session.abortTransaction();
        throw new Error(err);

    }finally {
        session.endSession();
    }

})

module.exports=AccRouter;