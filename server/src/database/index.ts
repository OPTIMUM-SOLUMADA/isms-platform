/**
 * Database module - Central export for all database-related functionality
 */

export {
    prismaPostgres,
    prismaMongo,
    connectDatabases,
    disconnectDatabases,
    default as prisma,
} from './prisma';

export * from './types';
