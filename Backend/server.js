import http from 'http';
import app from './index.js';
import { initializeSocket } from './socket.js';
const port=process.env.PORT||3000
const server=http.createServer(app);
initializeSocket(server);
server.listen(port,()=>{
    console.log("Server has started");
})