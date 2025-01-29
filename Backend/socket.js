import { Server } from 'socket.io';
import { userModel } from './models/user.model.js';
import captainModel from './models/caption.model.js';

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        transports: ['websocket'], // Use WebSocket exclusively for better performance
    });

    io.on('connection', (socket) => {
        // Store socket ID in memory instead of using DB for frequent updates
        let userId, userType;

        socket.on('join', async (data) => {
            ({ userId, userType } = data);

            // Only update DB once for each user, or if it's necessary
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            // Avoid unnecessary DB updates with validation
            if (location && location.ltd && location.lng) {
                await captainModel.findByIdAndUpdate(userId, {
                    location: { ltd: location.ltd, lng: location.lng },
                });
                io.emit('location-update', { userId, location });
            } else {
                socket.emit('error', { message: 'Invalid location data' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

export { 
    initializeSocket, 
    sendMessageToSocketId 
};
