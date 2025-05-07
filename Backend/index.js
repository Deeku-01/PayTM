const express=require('express');
const mongoose = require('mongoose');
const cors=require('cors');

//local
const {DBPath,User} =require("./databaseUtil");
const Router = require('./routes/api');
const UserRouter = require('./routes/userRouter');

const app=express();

app.use(cors());
app.use(express.json()); //body parser for post req

app.use('/api/v1',Router);
app.use('/user',UserRouter)

const PORT=3003;
mongoose.connect(DBPath).then(()=>
        app.listen(PORT,()=>{
            console.log(`Listening on http://localhost:${PORT}`);
    })).catch(err=>{
    console.log(err);
})

