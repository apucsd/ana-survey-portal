import { Server } from 'socket.io';
import { prisma } from '../utils/prisma';

export const registerDriverSocket = (io: Server) => {
    io.on('connection', (socket) => {
        if (socket.data.role !== 'DRIVER') return;
        const driverId = socket.data.userId;
        socket.join(`driver:${driverId}`);
        console.log(`Driver joined room driver:${driverId}`);

        socket.on('driver:location:update', async ({ latitude, longitude }: any) => {
            console.log('Driver location:', latitude, longitude);
            try {
                if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
                    throw new Error('Invalid latitude or longitude');
                }

                const result = await prisma.driverLocation.upsert({
                    where: { driverId },
                    update: {
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                    },
                    create: {
                        driverId,
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                    },
                });
                // ✅ NEW: Broadcast to all admins
                io.to('admin:tracking').emit('driver:location:updated', {
                    driverId,
                    latitude,
                    longitude,
                    timestamp: new Date(),
                });

                const activeOrders = await prisma.order.findMany({
                    where: {
                        driverId,
                        status: {
                            in: ['EN_ROUTE'],
                        },
                    },
                });

                // console.log('Active orders', activeOrders);

                // console.log('Active orders', activeOrders);

                if (activeOrders.length > 0) {
                    activeOrders.forEach((order) => {
                        io.to(`order:${order.id}`).emit('driver:location', {
                            driverId,
                            latitude,
                            longitude,
                            timestamp: new Date(),
                        });
                    });
                }
            } catch (error) {
                console.log('Driver location update failed', error);
            }
        });
    });
};
