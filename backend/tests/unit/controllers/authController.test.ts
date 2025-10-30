import request from 'supertest';
import app from '@/app';
import User from '@/models/User';
import { setupTestDB, teardownTestDB, clearTestDB } from "../../setup/testEnvSetup";

describe('Auth Controller', () => {
    beforeAll(async () => {
        // Connect to test DB
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB()
    });

    afterEach(async () => {
        await clearTestDB();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test', email: 'test@example.com', password: '1234Test' })
            .expect(201);

        expect(res.body.email).toBe('test@example.com');
    });

    it('should login an existing user', async () => {
        await User.create({ name: 'Test', email: 'test@example.com', password: '1234Test' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: '1234Test' })
            .expect(200);

        expect(res.body.email).toBe('test@example.com');
    });

    it("should return 401 for wrong password", async () => {
        await User.create({ name: 'Test', email: 'test@example.com', password: '1234Test' });
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "1234Rest" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

});
