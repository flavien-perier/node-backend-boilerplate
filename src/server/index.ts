import { OpenApiValidator } from "express-openapi-validator";
import configuration from "../service/configuration";
import logger from "../service/logger";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as http from "http";
import * as yaml from "js-yaml";
import * as fs from "fs";
import HttpError from "../error/HttpError";
import HttpInternalServerError from "../error/HttpInternalServerError";

class Server {
    private _logger = logger("Server");
    private _app: express.Express;
    private _server: http.Server;

    constructor() {
        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(helmet());

        /* new OpenApiValidator({
            apiSpec: yaml.safeLoad(fs.readFileSync("swagger.yaml", "utf8")),
            validateRequests: true,
            validateResponses: true
        }).install(this._app); */

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
        this._app.use((err, req, res, next) => {
            if (err instanceof HttpError) {
                err.apply(res);
            } else {
                this._logger.error("Internal server error");
                new HttpInternalServerError("Internal server error").apply(res);
            }
        });

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
