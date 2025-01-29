import express from 'express';
import { registerUser, signin,getUserProfile,logoutUser} from '../controller/caption.controller.js';
import { validateMyCaptionRequest } from '../middleware/validation.js';
import { authCaption, } from '../middleware/authtoken.js';
const router=express.Router();
router.post('/register',validateMyCaptionRequest,registerUser)
router.post('/signin',signin);
router.get('/profile',authCaption,getUserProfile);
router.get('/logout',authCaption,logoutUser)
export default router