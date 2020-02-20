import * as express from "express";
import server from ".";
import logger from "../services/logger";
import sessionService from "../services/sessionService";
import UserDto from "../model/dto/UserDto";
import accountService from "../services/accountService";

class Account {
    private _logger = logger("Auth");
    private _router: express.Router;

    constructor() {
        this._router = express.Router();

        this._router.get("/login", (req, res) => {
            const user = req.body as UserDto;

            if (!user.name || !user.password) {
                this._logger.warn("No username or password");
                res.statusMessage = "No username or password";
                return res.status(401).end();
            }

            if (accountService.authentification(user.name, user.password)) {
                this._logger.warn(`Invalid username or password: "${user.name}"`);
                res.statusMessage = "Invalid username or password";
                return res.status(401).end();
            }

            res.json({
                token: sessionService.createSession(user)
            });
        });

        this._router.post("/", async (req, res) => {
            const user = req.body as UserDto;

            if (!user.name || !user.password) {
                this._logger.warn("No username or password");
                res.statusMessage = "No username or password";
                return res.status(401).end();
            }

            try {
                await accountService.createAccount(user.name, user.password);
                res.status(201).end();
            } catch (err) {
                this._logger.warn(err);
                res.statusMessage = err;
                return res.status(401).end();
            }
        });
    }

    public load() {
        server.addRouter("/account", this._router);
    }
}

const account = new Account();

export default account;
