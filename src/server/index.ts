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
import HttpNotFoundError from "../error/HttpNotFoundError";
import BadRequestInformations from "../model/BadRequestInformations";

class Server {
    private _logger = logger("Server");
    private _app: express.Express;
    private _server: http.Server;

    constructor() {
        this._app = express();

        this._app.use(bodyParser.json());
        this._app.use(helmet());

        // log request
        this._app.use((req, res, next) => {
            const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
            const userAgent = req.get("User-Agent");
            const method = req.method;
            const url = req.originalUrl;

            this._logger.http(`${method}: ${url}`, {ip, userAgent, method, url});
            next();
        });

        new OpenApiValidator({
            apiSpec: yaml.safeLoad(fs.readFileSync("swagger.yaml", "utf8")),
            validateRequests: true,
            validateResponses: true,
            validateSecurity: true
        }).install(this._app);
    }

    public get app() {
        return this._app;
    }

    public addRouter(route: string, router: express.Router) {
        this._logger.info(`Add router ${route}`);
        this._app.use(route, router);
    }

    public start() {
        // default response
        this._app.use((req, res, next) => {
            next(new HttpNotFoundError("Not found"));
        });

        // error catching
        this._app.use((err, req, res, next) => {
            if (err instanceof HttpError) {
                err.apply(res);
            } else if (err.status && err.message && err.errors) {
                this._logger.warn("Swagger compliance issue", {error: err.message});
                res.status(err.status).json(new BadRequestInformations(err.message, err.errors));
            } else {
                this._logger.error("Internal server error", {errorMessage: err.message || err});
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
