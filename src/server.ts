import { createServer, Server as HTTPServer } from 'http';
import app from './app';
import seedSuperAdmin from './app/DB';
import config from './config';
import { initSocket } from './app/socket/socket';
import { prisma } from './app/utils/prisma';
// import { initWebSocket } from './app/utils/ws-server';
// import { initRedis } from './app/utils/redis.client';

const port = config.port || 5000;

async function main() {
    try {
        // await initRedis();
        const server: HTTPServer = createServer(app);

        server.listen(port, () => {
            console.log('Server is running on port ', port);
            seedSuperAdmin();
        });

        await prisma.$runCommandRaw({
            createIndexes: 'driver_location',
            indexes: [
                {
                    key: {
                        location: '2dsphere',
                    },
                    name: 'location_2dsphere',
                },
            ],
        });
        const io = initSocket(server);

        // Start WebSocket server
        // initWebSocket(server);

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.info('Server closed!');
                });
            }
            process.exit(1);
        };

        process.on('uncaughtException', (error) => {
            console.log(error);
            exitHandler();
        });

        process.on('unhandledRejection', (error) => {
            console.log(error);
            exitHandler();
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

main();
