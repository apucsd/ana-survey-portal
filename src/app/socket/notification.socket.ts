import { getSocket } from '../socket/socket';
import { prisma } from '../utils/prisma';

export const sendNotification = async (recipientId: string, message: string, type: 'INFO' | 'USER_REGISTRATION') => {
    const notification = await prisma.notification.create({
        data: { recipientId, message, type },
    });
    console.log('created notification', notification);
    const io = getSocket();
    io.to(recipientId).emit('notification', notification);
};
