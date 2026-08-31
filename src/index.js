// require('dotenv').config({path: './env'});
import express from "express";
import connectDB from "./db/index.js";

import dotenv from "dotenv";
dotenv.config({
    path:'./env'
})


connectDB()

/*
;(async ()=>{
    const app = express()
    try {
       await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("app unable to talk to db",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
       })
    } catch (error) {
        console.error("ERROR :",error)
        throw error
    }
})()
*/
