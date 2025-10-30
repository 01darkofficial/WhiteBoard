import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

/**
 * Starts an in-memory MongoDB server and connects mongoose to it.
 * This runs before your test suites start.
 */
export const setupTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
};

/**
 * Drops the database, closes mongoose connection, and stops the in-memory server.
 * This runs after your test suites complete.
 */
export const teardownTestDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
};

/**
 * Clears all collections between tests for a clean state.
 */
export const clearTestDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};
