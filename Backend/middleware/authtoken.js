import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import CaptionModel  from '../models/caption.model.js';
export const authUser = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]|| req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "Un" });
    }
const isBlackListed=await userModel.findOne({token:token})    
if(isBlackListed){
    return res.status(401).json({Unauthorized});
}
    console.log(token);
    try {
        const decod = jwt.verify(token, process.env.JWT_SECRET);
         const decoded=await userModel.findById(decod._id);
         if (!decoded) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(decoded);
        req.user = decoded;
        req.userId=decoded._id;
        console.log(req.user);
       next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
export const authCaption = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
       if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const isBlackListed = await CaptionModel.findOne({ token: token });
    if (isBlackListed) {
        return res.status(401).json({ error: "Token is blacklisted" });
    }
console.log(token);   
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find user (caption) based on the decoded token _id
        const caption = await CaptionModel.findById(decoded._id);
        // If no caption is found, return an error
        if (!caption) {
            return res.status(404).json({ error: "Caption not found" });
        }

        // Attach the caption to the request object so the next middleware can access it
        req.captain = caption;
        console.log(req.captain);
        // Call next middleware or route handler
        return next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid token" });
    }
};
