import database from "./database";
import logger from "./logger";

class DatabaseBuilder {
    private _logger = logger("UserCache");

    public build() {
        database.knex.schema.createTableIfNotExists("User", table => {
            this._logger.info("Create database: User");

            table.increments("id");
            table.string("name");
            table.string("password");
            table.string("password_encryption");
        });
    }
}

const databaseBuilder = new DatabaseBuilder();

export default databaseBuilder;
