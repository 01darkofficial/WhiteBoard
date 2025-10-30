// tests/integration/app.test.ts

import request from 'supertest';
import app from '../../src/app';

describe('Express App Integration', () => {
    it('should respond with 200 on /api/health', async () => {
        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            status: 'ok',
            message: 'Server is running!',
        });
        expect(typeof res.body.timeStamp).toBe('string');
    });

    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/nonexistent');
        expect(res.status).toBe(404);
    });

    it('should include security headers from Helmet', async () => {
        const res = await request(app).get('/api/health');
        expect(res.headers).toHaveProperty('x-dns-prefetch-control');
    });

    it('should allow CORS requests from configured origin', async () => {
        const res = await request(app)
            .options('/api/health')
            .set('Origin', 'http://localhost:3000');

        expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should handle errors via middleware', async () => {
        const res = await request(app).get('/api/unknown');
        expect([404, 500]).toContain(res.status);
    });
});
