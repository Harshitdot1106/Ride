import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './DB/db.js';
import userRouter from './Routes/user.routes.js';
import captionRouter from './Routes/caption.routes.js';
import Mapsrouter from './Routes/maps.js';
import RiderRouter from './Routes/ride.routes.js';
import { initializeSocket } from './socket.js';  // Import the socket initializer

dotenv.config();

// Initialize Express
const server = express();

// Middleware setup
server.use(cors());
server.use(express.json());

// Database connection
await connectDb();

// Setup routes
server.use('/user', userRouter);
server.use('/caption', captionRouter);
server.use('/maps', Mapsrouter);
server.use('/rider', RiderRouter);

// Export the Express app
export default server;
