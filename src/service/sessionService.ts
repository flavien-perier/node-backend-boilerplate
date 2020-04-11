import * as redis from "redis";
import * as crypto from "crypto";
import configuration from "./configuration";
import UserDto from "../model/dto/UserDto";
import UserSession from "../model/UserSession";
import logger from "./logger";
import HttpInternalServerError from "../error/HttpInternalServerError";
import HttpUnauthorizedError from "../error/HttpUnauthorizedError";
import TokenDto from "../model/dto/TokenDto";

class SessionService {
    private _logger = logger("SessionService");
    private _redisClient: redis.RedisClient;

    constructor() {
        this._redisClient = redis.createClient({
            url: configuration.redisUrl
        });
    }

    public createSession(user: UserDto): TokenDto {
        const token = crypto.createHmac("sha512", configuration.salt)
                            .update(user.name + user.password + new Date().getTime() + (Math.random()))
                            .digest("hex");
        
        const userSession = new UserSession(user.name);
        this._redisClient.set(token, JSON.stringify(userSession), "EX", 1800);
        this._logger.debug(`Associates the "${user.name}" user with the token "${token}".`);
        return new TokenDto(token);
    } 

    public loadSession(token: string): Promise<UserSession> {
        return new Promise((resolve, reject) => {
            this._redisClient.get(token, (error, reply) => {
                if (error) {
                    this._logger.alert(`Fatal error with redis database. (${error.message}).`);
                    reject(new HttpInternalServerError("Redis error"));
                    return;
                }

                if (reply) {
                    const userSession = JSON.parse(reply) as UserSession;
                    this._logger.debug(`The "${userSession.name}" user has logged in with token "${token}".`);
                    resolve(userSession);
                } else {
                    this._logger.warn(`Invalid token: "${token}".`);
                    reject(new HttpUnauthorizedError("Invalid token"));
                }
            });
        });
    }
}

const sessionService = new SessionService();

export default sessionService;
