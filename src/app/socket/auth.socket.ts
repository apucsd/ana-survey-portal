import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../../config';

export const registerSocketAuth = (io: Server) => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.headers?.token as string;
            if (!token) return next(new AppError(httpStatus.UNAUTHORIZED, 'Please provide a token'));

            const decoded = jwt.verify(token, config.jwt.access_secret!) as any;

            socket.data.userId = decoded.id;
            socket.data.role = decoded.role;

            next();
        } catch {
            next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid token'));
        }
    });
};
