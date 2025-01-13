import mongoose from "mongoose";
const blackListToken=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
       type:Date,
       default:Date.now,
       expires:84600 
    }
})
const blackList=mongoose.model('blacklisttoken',blackListToken)
export default blackList