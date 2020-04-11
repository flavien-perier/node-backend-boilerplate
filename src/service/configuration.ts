import * as yaml from "js-yaml";
import * as fs from "fs";

class Configuration {
    private _applicationVersion: string;
    private _logLevel: string;
    private _port: string;
    private _salt: string;
    private _redisUrl: string
    private _postgresUrl: string;

    constructor() {
        const staticConfiguration = yaml.safeLoad(fs.readFileSync("configuration.yaml", "utf8"));

        this._applicationVersion = require("../../package.json").version
        this._logLevel = process.env.LOG || staticConfiguration.application.logLevel;
        this._port = process.env.PORT || staticConfiguration.application.port;
        this._salt = process.env.SALT || staticConfiguration.application.salt;
        this._redisUrl = process.env.REDIS_URL || staticConfiguration.application.redisUrl;
        this._postgresUrl = process.env.POSTGRES_URL || staticConfiguration.application.postgresUrl;
    }

    public get applicationVersion() {
        return this._applicationVersion;
    }

    public get logLevel() {
        return this._logLevel;
    }

    public get port() {
        return this._port;
    }

    public get salt() {
        return this._salt;
    }

    public get redisUrl() {
        return this._redisUrl;
    }

    public get postgresUrl() {
        return this._postgresUrl;
    }
}

const configuration = new Configuration();

export default configuration;
