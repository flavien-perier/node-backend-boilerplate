import * as supertest from "supertest";
import server from "./server";
import userRepository from "./repositories/userRepository";
import account from "./server/account";
import api from "./server/api";

describe("e2e tests", () => {
    const USER_NAME = "user-test";
    const PASSWORD = "PASSWORD";

    beforeAll(() => new Promise((resolve, reject) => {
        try {
            account.load();
            api.load();

            server.start();
            resolve();
        } catch (err) {
            reject(err);
        }
    }));
    
    afterAll(() => {
        server.stop();
    });

    
    afterEach(() => {
        userRepository.deleteUserByName(USER_NAME);
    });

    it("Create user", done => {
        supertest(server.app)
            .post("/account")
            .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
            .set("Content-Type", "application/json")
            .expect(201)
            .end((err, res) => {
                expect(err).toBeNull();
                done();
            });
    });

    it("Login user", done => {
        supertest(server.app)
            .post("/account")
            .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
            .set("Content-Type", "application/json")
            .expect(201)
            .end((err, res) => {
                expect(err).toBeNull();
                
                supertest(server.app)
                    .get("/account/login")
                    .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
                    .set("authorization", `Basic ${Buffer.from(USER_NAME + ":" + PASSWORD).toString("base64")}`)
                    .set("Content-Type", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(err).toBeNull();
                        expect(res.body.token).toMatch(/^[0-9a-z]{64,512}$/);

                        const token = res.body.token;

                        supertest(server.app)
                            .get("/api/ping")
                            .set("Content-Type", "application/json")
                            .set("Authorization", `Bearer ${token}`)
                            .expect(200)
                            .end((err, res) => {
                                expect(err).toBeNull();
                                expect(res.body.ping).toEqual("pong");

                                done();
                            });
                    });
            });
    });
});
