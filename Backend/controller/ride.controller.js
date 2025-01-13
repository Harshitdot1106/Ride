import rideModel from "../models/ride.model.js"
import bcrypt from 'bcrypt'
import { sendMessageToSocketId } from "../socket.js";
import { fetchCoordinates, fetchDistanceAndDuration,getCaptainsInTheRadius } from "./maps.controller.js"
const getOtp = (length) => {
    const otp = Math.random().toString().slice(2, 2 + length); // Generate a numeric OTP
    const saltRounds = 10; // Define the number of salt rounds
    const hashedOtp = bcrypt.hashSync(otp, saltRounds); // Hash the OTP
    return hashedOtp; // Return the hashed OTP
};

// Helper function to calculate the fare based on distance and duration
const calculateFare = async(pickup,destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }
    const distanceTime = await fetchDistanceAndDuration(pickup, destination);
    console.log(distanceTime);
    console.log(distanceTime.distance.value);
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };
    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };
    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };
    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };
    return fare;
}
  
const getfare=async(req,res)=>{
const {pickup,destination}=req.query;

try{
    if(!pickup||!destination){
        throw new Error('Pickup and destination are required');
    }
    console.log(pickup,destination);
    const fare = await calculateFare(pickup,destination);
console.log(fare)
    return res.status(200).json({fare});
}catch(err){
console.log(err);
res.status(200).json({message:err})
}

}
const createRide=async(req,res)=>{
    console.log(req.body);
    const {pickup,destination,vehicleType}=req.body;
    const user=req.user;
    if (!user) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try{
const fare=await calculateFare(pickup,destination);
const ride=await rideModel.create({
   user:user,
    pickup,
    destination,
    otp:getOtp(6),
    fare:fare[vehicleType]
})
//res.status(201).json(ride);
const pickupCoordinates = await fetchCoordinates(pickup);
console.log(pickupCoordinates)
const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);
console.log(captainsInRadius);
ride.otp=""
const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })
return res.status(201).json(ride);
    }catch(err){
        console.log(err);
        res.status(500);
    }
}
const endRide=async(req,res)=>{
const {rideId}=req.body;
const captain=req.captain;
try{
const ride=await rideModel.findOne({
    _id:rideId,
    captain:captain._id
}).populate('user').populate('caption').select('+otp');
if(!ride){
    throw new Error('Ride not Found');
}
if(ride.status!='ongoing'){
    throw new Error('Ride not Ongoing');
}
await rideModel.findOneAndUpdate({
    _id:rideId,
},{
    status:'completed'
});
sendMessageToSocketId(ride.user.socketId,{
    event:'ride-ended',
    data:ride
});
return res.status(200).json(ride);
}catch(err){
    res.json(500).json({message:err.message})
}
}
const startRide=async(req,res)=>{
    const {rideId,otp}=req.query;
    try{
        const ride = await rideModel.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp')
        console.log(ride);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        if (!ride) {
            throw new Error('Ride not found');
        }
    
        if (ride.status !== 'accepted') {
            throw new Error('Ride not accepted');
        }
    
        if (ride.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        await rideModel.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'ongoing'
        })
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
}
const confirmRide = async (req, res) => {
   const { rideId } = req.body;
    const {captain}=req.captain;

    try {

        if (!rideId) {
            throw new Error('Ride id is required');
        }
    
        await rideModel.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'accepted',
            captain: captain._id
        })
    
        const ride = await rideModel.findOne({
            _id: rideId
        }).populate('user').populate('captain').select('+otp');
    
        if (!ride) {
            throw new Error('Ride not found');
        }
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export {
    getfare,
    createRide,
endRide,
startRide,
confirmRide
}