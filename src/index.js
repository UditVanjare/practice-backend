// require('dotenv').config({path: './env'});
import connectDB from "./db/index.js";
import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config({
    path:'./env'
})


connectDB()
.then(()=>{
    app.on('error',()=>{
        console.log("ERROR :",error)
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on the port ${process.env.PORT}`);
    })
    
})
.catch((error)=>{
    console.log(" mongoDB connection failed !!!! ", error)
})

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
