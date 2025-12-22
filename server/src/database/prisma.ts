/**
 * Database clients for the hybrid PostgreSQL + MongoDB architecture
 * 
 * PostgreSQL: Used for relational data (users, documents, departments, etc.)
 * MongoDB: Used for audit logs and notifications (high-volume, flexible schema)
 */

import { PrismaClient as PostgresClient } from '../../node_modules/.prisma/client/postgresql';
import { PrismaClient as MongoClient } from '../../node_modules/.prisma/client/mongodb';

// PostgreSQL client for relational data
const postgresClient = new PostgresClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// MongoDB client for audit logs and notifications
const mongoClient = new MongoClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * PostgreSQL Prisma client
 * Used for: User, Document, Department, Function, Role, Type, Version,
 * Classification, ReviewFrequency, IsoClause, NonConformity, CorrectiveAction,
 * ClauseCompliance, DocumentReviewer, DocumentAuthor, and junction tables
 */
export const prismaPostgres = postgresClient;

/**
 * MongoDB Prisma client
 * Used for: AuditLog, Notification
 */
export const prismaMongo = mongoClient;

/**
 * Default export for backward compatibility
 * @deprecated Use prismaPostgres or prismaMongo explicitly
 */
export default prismaPostgres;

/**
 * Connect to both databases
 */
export async function connectDatabases(): Promise<void> {
    try {
        await prismaPostgres.$connect();
        console.log('✅ Connected to PostgreSQL database');
        
        await prismaMongo.$connect();
        console.log('✅ Connected to MongoDB database');
    } catch (error) {
        console.error('❌ Failed to connect to databases:', error);
        throw error;
    }
}

/**
 * Disconnect from both databases
 */
export async function disconnectDatabases(): Promise<void> {
    try {
        await prismaPostgres.$disconnect();
        console.log('✅ Disconnected from PostgreSQL database');
        
        await prismaMongo.$disconnect();
        console.log('✅ Disconnected from MongoDB database');
    } catch (error) {
        console.error('❌ Failed to disconnect from databases:', error);
        throw error;
    }
}
