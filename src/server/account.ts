import server from ".";
import logger from "../service/logger";
import sessionService from "../service/sessionService";
import UserDto from "../model/dto/UserDto";
import accountService from "../service/accountService";
import HttpUnauthorizedError from "../error/HttpUnauthorizedError";
import HttpBadRequestError from "../error/HttpBadRequestError";
import Router from "./Router";

class Account extends Router {
    private _logger = logger("Auth");

    constructor() {
        super();

        this.router.get("/login", async (req, res, next) => {
            try {
                const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
                const [userName, password] = Buffer.from(b64auth, "base64").toString().split(":");
                const user = new UserDto(userName, password);

                if (!user.name || !user.password) {
                    this._logger.warn("No username or password");
                    throw new HttpBadRequestError("No username or password");
                }

                if (!await accountService.authentification(user.name, user.password)) {
                    this._logger.warn(`Bad password for the user: "${user.name}"`);
                    throw new HttpUnauthorizedError("Bad password")
                }

                res.json({
                    token: sessionService.createSession(user)
                });
            } catch (err) {
                next(err);
            }
        });

        this.router.post("/", async (req, res, next) => {
            try {
                const user = req.body as UserDto;
    
                if (!user.name || !user.password) {
                    this._logger.warn("No username or password");
                    throw new HttpBadRequestError("No username or password");
                }
    
                await accountService.createAccount(user.name, user.password);
                res.status(201).json();
            } catch(err) {
                next(err);
            }
        });
    }

    public load() {
        server.addRouter("/account", this.router);
    }
}

const account = new Account();

export default account;
