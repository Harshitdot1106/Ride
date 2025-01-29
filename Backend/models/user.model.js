 import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
 const userSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be of # char']
        },
        lastname:{
            type:String,
            minlength:[3,'Last Name min 3']
        }
    },
    email:{
type:String,
required:true,
unique:true,
    },
password:{
type:String,
required:true,
select:false
//we can add select:true if we neednot want to select the password
},
socketId:{
type:String
}
    }
 )
 userSchema.methods.generateAuthToken=function(){
    const token =jwt.sign({_id:this.id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
 }
 userSchema.methods.comparePassword = async function (password) {
    try {
      if (!password || !this.password) {
        throw new Error("Password data is missing");
      }
  
      // Compare the provided password with the hashed password stored in the database
      const match = await bcrypt.compare(password, this.password);
      return match;
    } catch (err) {
      console.log("Error Comparing", err);
      throw new Error("Error comparing passwords");
    }
  };
  

 userSchema.statics.hashPassword=async function (password) {
    return await bcrypt.hash(password,10);
    }
const userModel=mongoose.model('user',userSchema)
export { userModel,
    }