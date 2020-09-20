import * as redis from "redis";
import  * as crypto from "crypto";
import configuration from "./configuration";
import UserDto from "../model/dto/UserDto";
import JwtDto from "../model/dto/JwtDto";
import UserSession from "../model/UserSession";
import logger from "./logger";
import HttpInternalServerError from "../error/HttpInternalServerError";
import HttpUnauthorizedError from "../error/HttpUnauthorizedError";
import TokenDto from "../model/dto/TokenDto";
import * as jwt from "jsonwebtoken";

class SessionService {
    private _logger = logger("SessionService");
    private _redisClient: redis.RedisClient;

    private TOKEN_TTL = 1800;

    constructor() {
        this._redisClient = redis.createClient({
            url: configuration.redisUrl
        });
    }

    public createSession(user: UserDto): TokenDto {
        const redisKey = crypto.randomBytes(16).toString("hex");
        const token = jwt.sign(new JwtDto(redisKey),  configuration.jwtToken, { expiresIn: this.TOKEN_TTL });

        const userSession = new UserSession(user.name);
        this._redisClient.set(token, JSON.stringify(userSession), "EX", this.TOKEN_TTL);
        this._logger.debug(`Associates the user "${user.name}" with the token "${token}".`);
        return new TokenDto(token);
    }

    public loadSession(token: string): Promise<UserSession> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, configuration.jwtToken, (error, decoded: JwtDto) => {
                if (decoded) {
                    this._redisClient.get(decoded.token, (error, reply) => {
                        if (reply) {
                            const userSession = JSON.parse(reply) as UserSession;
                            this._logger.debug(`The user "${userSession.name}" has logged in with token "${token}".`);
                            resolve(userSession);
                        } else if (error) {
                            this._logger.alert(`Fatal error with redis database. (${error.message}).`);
                            reject(new HttpInternalServerError("Redis error"));
                        } else {
                            this._logger.warn(`Invalid token: "${token}".`);
                            reject(new HttpUnauthorizedError("Invalid token"));
                        }
                    });
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
