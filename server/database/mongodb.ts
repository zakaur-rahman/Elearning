import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = process.env.MONGODB_URL || "";

const connectDB =async () => {
    
    try{
        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`MongoDB Connected : ${data.connection.host}`);
        }) 
    }catch(error:any){
        console.log(`Error Connecting to MongoDB : ${error.message}`)
    }
    
}

export default connectDB