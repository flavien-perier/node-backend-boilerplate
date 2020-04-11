import server from "..";
import logger from "../../service/logger";
import sessionService from "../../service/sessionService";
import Router from "../Router";

class Api extends Router {
    private _logger = logger("Api");

    constructor() {
        super();

        this.router.use(async (req, res, next) => {
            try {
                const bearerToken = /^Bearer ?(.*)$/i.exec(req.headers.authorization)[1];
                await sessionService.loadSession(bearerToken);
                next();
            } catch (err) {
                next(err);
            }
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
