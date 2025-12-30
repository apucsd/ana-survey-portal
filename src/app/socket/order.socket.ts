import { Server } from 'socket.io';
import { prisma } from '../utils/prisma';

export const registerOrderSocket = (io: Server) => {
    io.on('connection', (socket) => {
        socket.on('order:join', async ({ orderId }) => {
            if (!orderId) {
                console.log('No order ID provided');
                return;
            }
            const order = await prisma.order.findFirst({
                where: {
                    id: orderId,
                    userId: socket.data.userId,
                },
            });
            console.log(order);
            if (!order) {
                return socket.emit('error', ' sOrder not found');
            }
            socket.join(`order:${orderId}`);
            console.log(`Socket joined order:${orderId}`);
            if (order.driverId) {
                const driverLocation = await prisma.driverLocation.findUnique({
                    where: { driverId: order.driverId },
                });

                if (driverLocation) {
                    socket.emit('driver:location', {
                        driverId: order.driverId,
                        latitude: driverLocation.location.coordinates[1],
                        longitude: driverLocation.location.coordinates[0],
                    });
                }
            }
        });
    });
};
