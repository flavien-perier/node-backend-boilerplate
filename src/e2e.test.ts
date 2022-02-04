import * as supertest from "supertest";
import { server, app } from "./configuration/server";
import userRepository from "./account/repository/account.repository";
import * as http from "http";

describe("e2e tests", () => {
    const USER_NAME = "user-test";
    const PASSWORD = "PASSWORD";
    var api: http.Server;

    beforeAll(async done => {
        api = await server;
        done();
    });
    
    afterAll(() => {
        api.close();
    });

    
    afterEach(() => {
        userRepository.deleteUserByName(USER_NAME);
    });

    it("Create user", done => {
        supertest(app)
            .post("/account")
            .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
            .set("Content-Type", "application/json")
            .expect(201)
            .end((err, res) => {
                expect(err).toBeNull();
                done();
            });
    });

    it("Ping api", done => {
        supertest(app)
            .get("/ping")
            .set("Content-Type", "application/json")
            .expect(200)
            .end((err, res) => {
                expect(err).toBeNull();
                expect(res.body.ping).toEqual("OK");
                done();
            });
    });

    describe("api", () => {
        let token: string;

        beforeAll(done => {
            supertest(app)
                .post("/account")
                .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
                .set("Content-Type", "application/json")
                .expect(201)
                .end((err, res) => {
                    expect(err).toBeNull();
                    
                    supertest(app)
                        .get("/account/login")
                        .send(JSON.stringify({"name": USER_NAME, "password": PASSWORD}))
                        .set("Authorization", `Basic ${Buffer.from(USER_NAME + ":" + PASSWORD).toString("base64")}`)
                        .set("Content-Type", "application/json")
                        .expect(200)
                        .end((err, res) => {
                            expect(err).toBeNull();
                            expect(res.body.token).toMatch(/^[0-9a-zA-Z=_\-\.]{128,1024}$/);
    
                            token = res.body.token;
                            done();
                        });
                });
        });

        it("Sum value 1 and 2", done => {
            supertest(app)
                .get("/sum")
                .query({
                    value1: 1,
                    value2: 2
                })
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBeNull();
                    expect(res.body.result).toEqual(3);
                    done();
                });
        });
    });
});
