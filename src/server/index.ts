import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import configuration from "../services/configuration";
import logger from "../services/logger";

class Server {
    private _logger = logger("Server");
    private _app: express.Express;

    constructor() {
        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(helmet());

        this._app.use((req, res, next) => {
            const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
            const userAgent = req.get("User-Agent");
            const method = req.method;
            const url = req.originalUrl;

            this._logger.http(`${method}: ${url}`, {ip, userAgent, method, url});
            next();
        });
    }

    public addRouter(route: string, router: express.Router) {
        this._logger.info(`Add router ${route}`);
        this._app.use(route, router);
    }

    public start() {
        this._app.listen(configuration.port, () => {
            this._logger.info(`Application start on port ${configuration.port}`);
        });
    }
}

const server = new Server();

export default server;
