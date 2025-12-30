import { Server as SocketIOServer } from 'socket.io';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { registerSocketAuth } from './auth.socket';
import { registerDriverSocket } from './driver.socket';
import { registerAdminSocket } from './admin.socket';
import { registerOrderSocket } from './order.socket';

let initialIo: SocketIOServer;
export const initSocket = (server: any) => {
    initialIo = new SocketIOServer(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    registerSocketAuth(initialIo);

    initialIo.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        if (socket.data.userId) {
            socket.join(socket.data.userId);
            console.log(`User ${socket.data.userId} joined their personal room`);
        }
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    registerDriverSocket(initialIo);
    registerAdminSocket(initialIo);
    registerOrderSocket(initialIo);
    return initialIo;
};

export const getSocket = () => {
    if (!initialIo) {
        throw new AppError(httpStatus.NOT_FOUND, 'Socket.io instance not initialized yet!');
    }
    return initialIo;
};
