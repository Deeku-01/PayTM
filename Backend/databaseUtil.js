const mongoose=require('mongoose');
const { string } = require('zod');

const DBPath="mongodb://localhost:27017/PayTm"

 const UserSchema= new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:10
    },
    password:{
        type:String,
        required:true,
        minLength:6

    },
    Fname:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:10
    },
    Lname:{
        type:String,
        lowercase:true,
        maxLength:15
    }
})

const accSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,//Reference to user Model
        ref:"User", //refers to  the user table 
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account=mongoose.model("Account",accSchema);
const User=mongoose.model("User",UserSchema);

exports.User=User;
exports.DBPath=DBPath;
exports.Account=Account;
