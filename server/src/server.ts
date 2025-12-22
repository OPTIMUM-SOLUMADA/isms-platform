import app from './app';
import { env } from './configs/env';
import { connectDatabases, disconnectDatabases } from './database/prisma';
import { initData } from './init/data.init';
import { registerCronJobs } from './jobs';

async function startServer() {
    try {
        // Connect to both PostgreSQL and MongoDB databases
        await connectDatabases();

        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);

            // init data
            initData();

            // start cron jobs
            if (env.NODE_ENV !== 'development') {
                registerCronJobs();
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await disconnectDatabases();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...');
    await disconnectDatabases();
    process.exit(0);
});

startServer();
