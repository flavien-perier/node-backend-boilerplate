import database from "./database";
import logger from "./logger";

class DatabaseBuilder {
    private readonly _logger = logger("DatabaseBuilder");

    public async build() {
        if (!await database.knex.schema.hasTable("Account")) {
            database.knex.schema.createTableIfNotExists("Account", table => {
                this._logger.info("Create database: Account");
    
                table.increments();
                table.string("name").unique();
                table.string("password");
                table.string("password_encryption");
            }).catch(error => {
                this._logger.alert("Database error", {error: error.message});
                process.exit(1);
            });
        }
    }
}

const databaseBuilder = new DatabaseBuilder();

export default databaseBuilder;
