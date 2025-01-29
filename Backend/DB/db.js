import mongoose from "mongoose";
const connectDb=async()=>{
   try{
    await  mongoose.connect(process.env.CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("DataBase Connected");
   }
   catch(error){
    console.log("Failed to connectDB",error)
   }
}
export default connectDb