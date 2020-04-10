import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import configuration from "../services/configuration";
import logger from "../services/logger";
import * as http from "http";

class Server {
    private _logger = logger("Server");
    private _app: express.Express;
    private _server: http.Server;

    constructor() {
        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(helmet());

        this.app.use((req, res, next) => {
            res.set("User-Agent", "application/json");
            next();
        });

        this._app.use((req, res, next) => {
            const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
            const userAgent = req.get("User-Agent");
            const method = req.method;
            const url = req.originalUrl;

            this._logger.http(`${method}: ${url}`, {ip, userAgent, method, url});
            next();
        });
    }

    public get app() {
        return this._app;
    }

    public addRouter(route: string, router: express.Router) {
        this._logger.info(`Add router ${route}`);
        this._app.use(route, router);
    }

    public start() {
        this._server = this._app.listen(configuration.port, () => {
            this._logger.info(`Application start on port ${configuration.port}`);
        });
    }

    public stop() {
        this._server.close();
    }
}

const server = new Server();

export default server;
