import express from 'express';
import { registerUser, signin,getUserProfile,logoutUser} from '../controller/user.controller.js';
import { validateMyUserRequest } from '../middleware/validation.js';
import { authUser } from '../middleware/authtoken.js';
const router=express.Router();
router.post('/register',validateMyUserRequest,registerUser)
router.post('/signin',signin);
router.get('/profile',authUser,getUserProfile);
router.get('/logout',authUser,logoutUser)
export default router;