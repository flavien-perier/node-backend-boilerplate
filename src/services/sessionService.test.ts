import sessionService from "./sessionService";
import Auth from "../model/api/UserApi";

describe("sessionService", () => {
    it("should save and load session", (done) => {
        const user = new Auth("name", "password");
        
        const token = sessionService.createSession(user);
        sessionService.loadSession(token).then(userSession => {
            expect(userSession.name).toEqual("name");
            done();
        });
    });

    it("should dont load session with bad token", (done) => {
        sessionService.loadSession("badToken").catch(err => {
            expect(err).toEqual("Invalid token");
            done();
        });
    });
});
