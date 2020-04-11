import sessionService from "./sessionService";
import UserDto from "../model/dto/UserDto";

describe("sessionService", () => {
    it("should save and load session", (done) => {
        const user = new UserDto("name", "password");
        
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
