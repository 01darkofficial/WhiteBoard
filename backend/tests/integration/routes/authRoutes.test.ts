import request from "supertest";
import app from "@/app";
// import User from "@/models/User";
import { setupTestDB, teardownTestDB, clearTestDB } from "../../setup/testEnvSetup";

describe("Auth Routes", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    it("should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "Test User", email: "test@example.com", password: "Password123" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("email", "test@example.com");
        expect(res.body).toHaveProperty("name", "Test User");
    });

    it("should fail registration with invalid data", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "", email: "invalid", password: "123" });

        expect(res.status).toBe(400);
    });

    it("should login with valid credentials", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({ name: "User", email: "login@example.com", password: "Password123" });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "login@example.com", password: "Password123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "login@example.com");
    });

    it("should return 401 for invalid password", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({ name: "User", email: "wrongpass@example.com", password: "Password123" });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "wrongpass@example.com", password: "WrongPassword" });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should access /user route with valid cookie token", async () => {
        const registerRes = await request(app)
            .post("/api/auth/register")
            .send({ name: "User", email: "secure@example.com", password: "Password123" });

        const cookie = registerRes.headers["set-cookie"];

        const res = await request(app)
            .get("/api/auth/user")
            .set("Cookie", cookie);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("email", "secure@example.com");
    });

    it("should return 401 when accessing /user without cookie token", async () => {
        const res = await request(app).get("/api/auth/user");
        expect(res.status).toBe(401);
    });
});
