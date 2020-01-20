import database from "../services/database";
import logger from "../services/logger";
import UserOrm from "../model/orm/UserOrm";

class UserRepository {
    private _logger = logger("UserRepository");
    
    public getUserById(id: number): Promise<UserOrm> {
        return new Promise((resolve, reject) => {
            database.knex.select("name", "password")
                .from("User")
                .where({id})
                .then(users => {
                    if (users.length == 1) {
                        resolve(users[0] as UserOrm);
                    } else {
                        this._logger.error(`No user Found with id: ${id}`);
                        reject(`No user Found with id: ${id}`);
                    }
                })
                .catch(error => {
                    this._logger.alert("Database error");
                    reject("Database error");
                });
        });
    }

    public createUser(name: string, password: string) {

    }

    public deleteUserById(id: number) {

    }
}

const userRepository = new UserRepository();

export default userRepository;
