const express=require('express');
const zod=require('zod');
const UserRouter=express.Router();
const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config");
const AuthMiddleware = require('../middlewares');



// all are validated using ZOD


//SignUp Handle 
const signUpSchema= zod.object({
    username:zod.string().email(),
    password:zod.string(),
    FName: zod.string(),
    Lname:zod.string()
})

UserRouter.post("/signUp", async(req,res)=>{
    const body=req.body;
    const {success}= signUpSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Email Already Taken / Incorrect Inputs"
        })
    }
    const usr= await User.findOne({
        username:body.username
    })
    if(usr._id){
        return res.status(411).json({
            message:"Email Already Taken / Incorrect Inputs"
        })
    }

    const dbUser=await User.create(body);
    const token=jwt.sign({
        UserId:dbUser._id
    },JWT_SECRET);

    res.json({
        message:"User Created Succesfully",
        token:token
    })
})


// Sign in handle
const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

UserRouter.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})


//Update User 
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

UserRouter.put("/", AuthMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

// To find other users to Send Money 

UserRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports=UserRouter;