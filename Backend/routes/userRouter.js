const express=require('express');
const zod=require('zod');
const UserRouter=express.Router();
const jwt =require("jsonwebtoken");
const JWT_SECRET=require("../config");
const AuthMiddleware = require('../middlewares');
const { Account, User } = require('../databaseUtil');



// all are validated using ZOD


//SignUp Handle 
// Also when he signs up make sure to give him a random balance 
const signUpSchema= zod.object({
    username:zod.string().email(),
    password:zod.string(),
    Fname: zod.string(),
    Lname:zod.string()
})

UserRouter.post("/signUp", async(req,res)=>{
    const body=req.body;
    console.log(req.body);
    const {success}= signUpSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Email Already Taken / Incorrect Inputs"
        })
    }
    const usr= await User.findOne({
        username:body.username
    })
    if(usr){
        return res.status(411).json({
            message:"UserName Taken"
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

    // Create a new account 
    await Account.create({
        userId:dbUser._id,
        balance:+Math.random() *1000
    })

    // Now he has some balance to play 
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
            message: "Incorrect inputs"
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
            message:"Sucessfully Logged IN",
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

UserRouter.put("/updates", AuthMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    const updated=await User.updateOne(
        { _id: req.userId },       // ✅ filter
        { $set: req.body }         // ✅ update
    )
    //cross check
    // console.log(updated)
    // const updatedUser = await User.findOne({ _id: req.userId });
    // console.log("Updated User:", updatedUser);
    if(updated){
        return res.json({
            message: "Updated successfully"
        })
        
    }
    return res.json({
        message: "Unable to update"
    })
})

// To find other users to Send Money 

UserRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            Fname: {
                "$regex": filter
            }
        }, {
            Lname: {
                "$regex": filter
            }
        }]
    })

    return res.json({
        user: users.map(user => ({
            username: user.username,
            Fname: user.Fname,
            Lname: user.Lname,
            _id: user._id
        }))
    })
})


module.exports=UserRouter;