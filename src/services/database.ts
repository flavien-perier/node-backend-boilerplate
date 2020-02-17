import * as knex from "knex";
import configuration from "./configuration";

class Database {
    private _knex: knex;

    constructor() {
        this._knex  = knex({
            client: "pg",
            connection: configuration.postgresUrl
        });
        this._knex.raw("CURRENT_TIMESTAMP");
    }

    public get knex() {
        return this._knex;
    }
}

const database = new Database();

export default database;
