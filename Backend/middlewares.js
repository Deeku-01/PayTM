const express=require('express');
const JWT_SECRET=require("./config");
const jwt=require("jsonwebtoken");

const AuthMiddleware=(req,res,next)=>{
    const authheader=req.headers.authorization;

    if(!authheader|| !authheader.startsWith('Bearer '))
        return res.status(403).json({});

    const token =authheader.split('')[1];

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(decode.userId){
            req.userId=decoded.userId;
            next();
        }
        else return res.status(403).json({});

    } catch(err){
        return res.status(403).json({});
    }
};

module.exports= AuthMiddleware;