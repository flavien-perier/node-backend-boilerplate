import * as express from "express";
import server from ".";
import logger from "../services/logger";
import userCache from "../services/userCache";
import UserApi from "../model/api/UserApi";

class Account {
    private _logger = logger("Auth");
    private _router: express.Router;

    constructor() {
        this._router = express.Router();

        this._router.post("/login", (req, res) => {
            const user = req.body as UserApi;
            console.log(user)

            if (!user.name || !user.password) {
                this._logger.warn("No username or password");
                res.statusMessage = "No username or password";
                return res.status(401).end();
            }

            if (user.name != "user" || user.password != "password") {
                this._logger.warn(`Invalid username or password: "${user.name}"`);
                res.statusMessage = "Invalid username or password";
                return res.status(401).end();
            }

            res.json({
                token: userCache.createSession(user)
            });
        });

        this._router.post("/create", (req, res) => {

        });
    }

    public load() {
        server.addRouter("/account", this._router);
    }
}

const account = new Account();

export default account;
