import { knex, Knex } from "knex";
import configuration from "./configuration";
import logger from "./logger";

class Database {
    private _knex: Knex;
    private _logger = logger("Database");

    constructor() {
        this._knex  = knex({
            client: "pg",
            connection: configuration.postgresUrl,
            log: {
                warn: message => {
                    this._logger.warn(message);
                },
                error: message => {
                    this._logger.error(message);
                },
                debug: message => {
                    this._logger.debug(message);
                }
            }
        });
        this._knex.raw("CURRENT_TIMESTAMP");
    }

    public get knex() {
        return this._knex;
    }
}

const database = new Database();

export default database;
