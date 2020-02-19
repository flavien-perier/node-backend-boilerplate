import database from "../services/database";
import logger from "../services/logger";
import UserOrm from "../model/orm/UserOrm";

class UserRepository {
    private _logger = logger("UserRepository");
    
    public findUserById(id: number): Promise<UserOrm> {
        return new Promise((resolve, reject) => {
            database.knex.select("id", "name", "password")
                .from("User")
                .where({id})
                .then(users => {
                    if (users.length == 1) {
                        resolve(users[0] as UserOrm);
                    } else {
                        this._logger.error(`No user Found with id: ${id}`);
                        resolve(null);
                    }
                })
                .catch(error => {
                    this._logger.alert("Database error", {error: error.message});
                    reject("Database error");
                });
        });
    }

    public findUserByName(name: string): Promise<UserOrm> {
        return new Promise((resolve, reject) => {
            database.knex.select("id", "name", "password")
                .from("User")
                .where({name})
                .then(users => {
                    if (users.length == 1) {
                        resolve(users[0] as UserOrm);
                    } else {
                        this._logger.error(`No user Found with name: ${name}`);
                        resolve(null);
                    }
                }).catch(error => {
                    this._logger.alert("Database error", {error: error.message});
                    reject("Database error");
                });
        });
    }

    public createUser(name: string, password: string, passwordEncryption: string) {
        database.knex.from("User").insert({
            name,
            password,
            password_encryption: passwordEncryption
        }).catch(error => {
            this._logger.alert("Database error", {error: error.message});
        });
    }

    public deleteUserById(id: number) {
        database.knex.delete().from("User").where({id}).catch(error => {
            this._logger.alert("Database error", {error: error.message});
        });
    }
}

const userRepository = new UserRepository();

export default userRepository;
