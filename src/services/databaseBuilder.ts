import database from "./database";
import logger from "./logger";

class DatabaseBuilder {
    private _logger = logger("DatabaseBuilder");

    public async build() {
        if (!await database.knex.schema.hasTable("User")) {
            database.knex.schema.createTableIfNotExists("User", table => {
                this._logger.info("Create database: User");
    
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
