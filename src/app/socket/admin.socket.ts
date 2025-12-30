import { Server } from 'socket.io';

export const registerAdminSocket = (io: Server) => {
    io.on('connection', (socket) => {
        if (!socket.data.role || socket.data.role !== 'SUPERADMIN') return;

        socket.join('admins');
        console.log('Admin joined admins room');
    });
};
