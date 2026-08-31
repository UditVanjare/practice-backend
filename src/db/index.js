import mongoose  from "mongoose";
import {DB_NAME} from "../constants.js"


const connectDB = async () => {
    try{
    const connection_instatnt = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n mongodb connected !! DB HOST : ${connection_instatnt.connection.host}`)
    }catch(error){
        console.log("error connecting to db : ",error);
        process.exit(1)
    }
    
}
export default connectDB