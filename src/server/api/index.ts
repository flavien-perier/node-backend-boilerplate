import server from "..";
import logger from "../../service/logger";
import sessionService from "../../service/sessionService";
import Router from "../Router";
import HttpUnauthorizedError from "../../error/HttpUnauthorizedError";

class Api extends Router {
    private _logger = logger("Api");

    constructor() {
        super();

        this.router.use(async (req, res, next) => {
            const { authorization } = req.headers;

            if (!authorization) {
                this._logger.warn("Connection attempt without authorization");
                throw new HttpUnauthorizedError("No authorization");
            }

            const bearerPattern = /^Bearer (.*)$/.exec(authorization);

            if (!bearerPattern) {
                this._logger.warn("Attempt to connect with bad bearer");
                res.statusMessage = "Bad bearer";
                return res.status(403).end();
            }

            const bearer = bearerPattern[1];

            await sessionService.loadSession(bearer);
            next();
        });

        this.router.get("/ping", (req, res) => {
            res.json({ping: "pong"});
        });
    }

    public load() {
        server.addRouter("/api", this.router);
    }
}

const api = new Api();

export default api;
