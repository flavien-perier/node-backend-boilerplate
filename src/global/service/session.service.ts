import * as redis from "redis";
import  * as crypto from "crypto";
import configuration from "../../configuration/environment";
import AccountDto from "../../account/dto/account.dto";
import JwtBean from "../bean/jwt.bean";
import AccountSessionDto from "../../account/dto/account-session.dto";
import logger from "../../configuration/logger";
import HttpInternalServerError from "../error/http-internal-server.error";
import HttpUnauthorizedError from "../error/http-unauthorized.error";
import TokenDto from "../dto/token.dto";
import * as jwt from "jsonwebtoken";

class SessionService {
    private readonly _logger = logger("SessionService");
    private _redisClient: redis.RedisClient;

    private TOKEN_TTL = 1800;

    constructor() {
        this._redisClient = redis.createClient({
            url: configuration.redisUrl
        });
    }

    public createSession(user: AccountDto): TokenDto {
        const redisKey = crypto.randomBytes(16).toString("hex");
        const token = jwt.sign({
            token: redisKey
        } as JwtBean, configuration.jwtToken, { expiresIn: this.TOKEN_TTL });

        const userSession = new AccountSessionDto(user.name);
        this._redisClient.set(redisKey, JSON.stringify(userSession), "EX", this.TOKEN_TTL);
        this._logger.debug(`Associates the user "${user.name}" with the token "${token}".`);
        return new TokenDto(token);
    }

    public loadSession(token: string): Promise<AccountSessionDto> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, configuration.jwtToken, (error, decoded: JwtBean) => {
                if (!error) {
                    this._redisClient.get(decoded.token, (error, reply) => {
                        if (reply) {
                            const userSession = JSON.parse(reply) as AccountSessionDto;
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
