import {userModel} from "../models/user.model.js";
import blackList from "../models/blackListToken.model.js";
export const registerUser=async(req,res)=>{
console.log(req.body);
const {fullname,email,password}=req.body;
if(!fullname||!email||!password){
    throw new Error("All Fields are required");
}
const hashPassword=await userModel.hashPassword(password);
const NewUser=await userModel.create({
    fullname,
email,
password: hashPassword
})
const token=NewUser.generateAuthToken();
res.status(201).json({token});
}
export const signin = async (req, res) => {
  console.log(req.body);
    try {
      const { email, password } = req.body;
  if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  const user = await userModel
        .findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } })
        .select('+password');  
        if (!user) {
        return res.status(404).json({ message: "User not found. Please create an account." });
      }
   console.log("Password in DB: ", user.password); 
      const isMatch = await user.comparePassword(password);
  if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
  }
  const token=user.generateAuthToken();
  return res.status(200).json({ token,message: "Sign in successful", user });
  } catch (error) {
      console.error("Signin Error: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  export const getUserProfile=(req,res)=>{
    console.log(req.user)
    return res.status(200).json(req.user)
  }
  export const logoutUser=async(req,res)=>{
    res.clearCookie('token');
    const token=req.cookies.token||req.headers.authorization.split('')[1]
    await blackList.create({token});
    res.status(200).json({message:"Logged Out"})
  }