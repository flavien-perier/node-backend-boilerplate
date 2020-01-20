import userCache from "./userCache";
import Auth from "../model/api/UserApi";

describe("userCache", () => {
    it("should save and load session", (done) => {
        const user = new Auth("name", "password");
        
        const token = userCache.createSession(user);
        userCache.loadSession(token).then(userSession => {
            expect(userSession.name).toEqual("name");
            done();
        });
    });

    it("should dont load session with bad token", (done) => {
        userCache.loadSession("badToken").catch(err => {
            expect(err).toEqual("Invalid token");
            done();
        });
    });
});
