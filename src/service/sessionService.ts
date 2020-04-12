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
    private tokenGenerator = this.token();

    constructor() {
        this._redisClient = redis.createClient({
            url: configuration.redisUrl
        });
    }

    private *token() {
        let i = 0;
        while (true) {
            yield Buffer.from(JSON.stringify({
                id: i++,
                code: crypto.randomBytes(32).toString("hex"),
                date: new Date().getTime()
            })).toString("base64");
        }
    }

    public createSession(user: UserDto): TokenDto {
        const token = this.tokenGenerator.next(user.name);
        
        if (token.value) {
            const userSession = new UserSession(user.name);
            this._redisClient.set(token.value, JSON.stringify(userSession), "EX", 1800);
            this._logger.debug(`Associates the "${user.name}" user with the token "${token}".`);
            return new TokenDto(token.value);
        }

        this._logger.error("Token generator error");
        throw new HttpInternalServerError("Token generator error");
    }

    public loadSession(token: string): Promise<UserSession> {
        return new Promise((resolve, reject) => {
            this._redisClient.get(token, (error, reply) => {
                if (reply) {
                    const userSession = JSON.parse(reply) as UserSession;
                    this._logger.debug(`The "${userSession.name}" user has logged in with token "${token}".`);
                    resolve(userSession);
                } else if (error) {
                    this._logger.alert(`Fatal error with redis database. (${error.message}).`);
                    reject(new HttpInternalServerError("Redis error"));
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
