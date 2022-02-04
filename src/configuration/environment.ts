import * as yaml from "js-yaml";
import * as fs from "fs";
import * as crypto from "crypto";

class Environment {
    private readonly _applicationVersion: string;
    private readonly _nodeId: string;
    private readonly _logLevel: string;
    private readonly _port: string;
    private readonly _salt: string;
    private readonly _jwtToken: string;
    private readonly _redisUrl: string
    private readonly _postgresUrl: string;

    constructor() {
        const staticConfiguration: any = yaml.load(fs.readFileSync("configuration.yaml", "utf8"));

        this._applicationVersion = require("../../package.json").version;
        this._nodeId = process.env.NODE_ID || staticConfiguration.application.nodeId || crypto.randomBytes(10).toString("hex");
        this._logLevel = process.env.LOG || staticConfiguration.application.logLevel;
        this._port = process.env.PORT || staticConfiguration.application.port;
        this._salt = process.env.SALT || staticConfiguration.application.salt;
        this._jwtToken = process.env.JWT_TOKEN || staticConfiguration.application.salt;
        this._redisUrl = process.env.REDIS_URL || staticConfiguration.application.redisUrl;
        this._postgresUrl = process.env.POSTGRES_URL || staticConfiguration.application.postgresUrl;
    }

    public get nodeId() {
        return this._nodeId;
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
        
    public get jwtToken() {
        return this._jwtToken;
    }

    public get redisUrl() {
        return this._redisUrl;
    }

    public get postgresUrl() {
        return this._postgresUrl;
    }
}

const configuration = new Environment();

export default configuration;
