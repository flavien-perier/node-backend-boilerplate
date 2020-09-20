import sessionService from "./sessionService";
import UserDto from "../model/dto/UserDto";
import HttpUnauthorizedError from "../error/HttpUnauthorizedError";

describe("sessionService", () => {
    it("should save and load session", done => {
        const user = new UserDto("name", "password");
        
        const tokenDto = sessionService.createSession(user);
        sessionService.loadSession(tokenDto.token).then(userSession => {
            expect(userSession.name).toEqual("name");
            done();
        });
    });

    it("should dont load session with bad token", done => {
        sessionService.loadSession("badToken").catch(err => {
            expect(err).toBeInstanceOf(HttpUnauthorizedError);
            expect(err.message).toEqual("Invalid token");
            done();
        });
    });
});
