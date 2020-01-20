import knex from "knex";
import configuration from "./configuration";
import databaseBuilder from "./databaseBuilder";

class Database {
    private _knex: knex;

    constructor() {
        this._knex  = knex({
            client: "pg",
            connection: configuration.postgresUrl
        });
        this._knex.raw("CURRENT_TIMESTAMP");

        databaseBuilder.build();
    }

    public get knex() {
        return this._knex;
    }
}

const database = new Database();

export default database;
