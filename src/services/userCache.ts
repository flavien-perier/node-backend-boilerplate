import * as redis from "redis";
import * as crypto from "crypto";
import configuration from "./configuration";
import UserApi from "../model/api/UserApi";
import UserSessionApi from "../model/api/UserSessionApi";
import logger from "./logger";

class UserCache {
    private _logger = logger("UserCache");
    private _redisClient: redis.RedisClient;

    constructor() {
        this._redisClient = redis.createClient({
            url: configuration.redisUrl
        });
    }

    public createSession(user: UserApi) {
        const token = crypto.createHmac("sha512", configuration.salt)
                            .update(user.name + user.password + new Date().getTime() + (Math.random()))
                            .digest("hex");
        
        const userSession = new UserSessionApi(user.name);
        this._redisClient.set(token, JSON.stringify(userSession), "EX", 1800);
        this._logger.debug(`Associates the "${user.name}" user with the token "${token}".`);
        return token;
    }

    public loadSession(token: string): Promise<UserSessionApi> {
        return new Promise((resolve, reject) => {
            this._redisClient.get(token, (error, reply) => {
                if (error) {
                    this._logger.alert(`Fatal error with redis database. (${error.message}).`);
                    reject(error.message);
                    return;
                }

                if (reply) {
                    const userSession = JSON.parse(reply) as UserSessionApi;
                    this._logger.debug(`The "${userSession.name}" user has logged in with token "${token}".`);
                    resolve(userSession);
                } else {
                    this._logger.warn(`Invalid token: "${token}".`);
                    reject("Invalid token");
                }
            });
        });
    }
}

const userCache = new UserCache();

export default userCache;
