import * as OpenApiValidator from "express-openapi-validator";
import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as yaml from "js-yaml";
import * as fs from "fs";
import configuration from "./environment";
import logger from "./logger";
import HttpError from "../global/error/http.error";
import HttpInternalServerError from "../global/error/http-internal-server.error";
import HttpNotFoundError from "../global/error/http-not-found.error";
import BadRequestInformationsBean from "../global/bean/bad-request-informations.bean";
import account from "../account/controller/account.controller";
import auth from "./server-auth";
import ping from "../ping/controller/ping.controller";

const _logger = logger("server");
const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

// log request
app.use((req, res, next) => {
    const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");
    const method = req.method;
    const url = req.originalUrl;

    _logger.http(`${method}: ${url}`, {ip, userAgent, method, url});
    next();
});

// edit header
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(OpenApiValidator.middleware({
    apiSpec: yaml.load(fs.readFileSync("swagger.yaml", "utf8")) as any,
    validateRequests: true,
    validateResponses: true,
    validateSecurity: true,
}));

// include rooters
app.use("/ping", ping);
app.use("/account", account);
app.use("/", auth);

// default response
app.use((req, res, next) => {
    next(new HttpNotFoundError("Not found"));
});

// error catching
app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
        err.apply(res);
    } else if (err.status && err.message && err.errors) {
        _logger.warn("Swagger compliance issue", {error: err.message});
        res.status(err.status).json(new BadRequestInformationsBean(err.message, err.errors));
    } else {
        _logger.error("Internal controller error", {errorMessage: err.message || err});
        new HttpInternalServerError("Internal server error").apply(res);
    }
});

const server = app.listen(configuration.port, () => {
    _logger.info(`Application start on port ${configuration.port} with id "${configuration.nodeId}"`, {port: configuration.port, nodeId: configuration.nodeId});
});

export { server, app };
