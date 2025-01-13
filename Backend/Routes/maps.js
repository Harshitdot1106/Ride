import express from 'express'
import { authUser } from '../middleware/authtoken.js';
import {getCoordinates,getDistanceTime,getSuggestion} from '../controller/maps.controller.js'
const router=express.Router();
router.get('/get-coordinates',authUser,getCoordinates);
router.get('/get-distance-time',authUser,getDistanceTime);
router.get('/get-suggestions',authUser,getSuggestion)
export default router