
const JWT_SECRET=require("./config");
const jwt=require("jsonwebtoken");

const AuthMiddleware=(req,res,next)=>{
    const authheader=req.headers.authorization;

    if(!authheader|| !authheader.startsWith('Bearer '))
        return res.status(403).json({message:"Not verified"});

    const token =authheader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }
        else return res.status(403).json({});

    } catch(err){
        return res.status(403).json({});
    }
};

module.exports= AuthMiddleware;



//token -eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFjNjc1MTdlMDc5OThlNzZmOWNmZDYiLCJpYXQiOjE3NDY2OTI0Nzl9.BAMSYU1HxK8tYhcknJFVspgfg3K6CYRD2vlxs5u-5Yw