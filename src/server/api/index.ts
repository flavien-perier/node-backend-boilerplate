import * as express from "express";
import server from "..";
import logger from "../../service/logger";
import sessionService from "../../service/sessionService";

class Api {
    private _logger = logger("Api");
    private _router: express.Router;

    constructor() {
        this._router = express.Router();

        this._router.use((req, res, next) => {
            const { authorization } = req.headers;

            if (!authorization) {
                this._logger.warn("Connection attempt without authorization");
                res.statusMessage = "No authorization";
                return res.status(401).end();
            }

            const bearerPattern = /Bearer (.*)/.exec(authorization);

            if (!bearerPattern) {
                this._logger.warn("Attempt to connect with bad bearer");
                res.statusMessage = "Bad bearer format";
                return res.status(403).end();
            }

            const bearer = bearerPattern[1];

            sessionService.loadSession(bearer).then(() => {
                next();
            }).catch(err => {
                this._logger.warn("The bearer does not exist.");
                res.statusMessage = "Bad bearer";
                return res.status(403).end();
            });
        });

        this._router.get("/ping", (req, res) => {
            res.json({ping: "pong"});
        });
    }

    public get router() {
        return this._router;
    }

    public load() {
        server.addRouter("/api", this._router);
    }
}

const api = new Api();

export default api;
