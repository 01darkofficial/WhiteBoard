import request from "supertest";
import app from "@/app";
import { setupTestDB, teardownTestDB, clearTestDB } from "../../setup/testEnvSetup";

describe("User Routes", () => {

    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    const endpoint = "/api/auth";
    let cookie: string;

    beforeEach(async () => {
        await request(app)
            .post(`${endpoint}/register`)
            .send({ name: "User", email: "usr@ex.com", password: "Strong123!" });

        const loginRes = await request(app)
            .post(`${endpoint}/login`)
            .send({ email: "usr@ex.com", password: "Strong123!" });

        cookie = loginRes.headers["set-cookie"];
    });

    it("should update user info", async () => {
        const res = await request(app)
            .put(`${endpoint}/user`)
            .set("Cookie", cookie)
            .send({ name: "Updated" });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated");
    });

    it("should delete user account", async () => {
        const res = await request(app)
            .delete(`${endpoint}/user`)
            .set("Cookie", cookie);
        expect(res.status).toBe(200);
    });

    it("should logout and clear cookie", async () => {
        const res = await request(app)
            .post(`${endpoint}/logout`)
            .set("Cookie", cookie);
        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"][0]).toMatch(/Expires/);
    });
});
