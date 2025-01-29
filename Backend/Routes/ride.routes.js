import express from 'express'
import { createRide, getfare,confirmRide,startRide,endRide } from '../controller/ride.controller.js';
import { authCaption, authUser } from '../middleware/authtoken.js';

const router=express.Router();
router.post('/create',authUser,createRide);
router.get('/get-fare',authUser,getfare);
router.post('/confirm',authCaption,confirmRide);
router.get('/start-ride',authCaption,startRide);
router.post('/end-ride',authCaption,endRide);
export default router;

//676d91ed293f11428411ccd7