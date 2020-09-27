import database from "../configuration/database";
import logger from "../configuration/logger";
import UserOrm from "../model/orm/UserOrm";
import HttpNotFoundError from "../error/HttpNotFoundError";

class UserRepository {
    private _logger = logger("UserRepository");
    
    public async findUserById(id: number): Promise<UserOrm> {
        const users = await database.knex.select("id", "name", "password").from("User").where({id}) as UserOrm[];

        if (users.length == 1) {
            return users[0];
        }
        
        this._logger.warn(`No user found with id: ${id}`);
        throw new HttpNotFoundError("User not found");
    }

    public async findUserByName(name: string): Promise<UserOrm> {
        const users = await database.knex.select("id", "name", "password").from("User").where({name}) as UserOrm[];

        if (users.length == 1) {
            return users[0];
        }
        
        this._logger.warn(`No user found with name: ${name}`);
        throw new HttpNotFoundError("User not found");
    }

    public async userExistsById(id: number): Promise<boolean> {
        const users = await database.knex.select("id", "name", "password").from("User").where({id}) as UserOrm[];
        if (users.length == 1) {
            return true;
        }
        return false;
    }

    public async userExistsByName(name: string): Promise<boolean> {
        const users = await database.knex.select("id", "name", "password").from("User").where({name}) as UserOrm[];
        if (users.length == 1) {
            return true;
        }
        return false;
    }

    public async createUser(name: string, password: string, passwordEncryption: string): Promise<any> {
        return await database.knex.from("User").insert({
            name,
            password,
            password_encryption: passwordEncryption
        });
    }

    public async deleteUserById(id: number): Promise<any> {
        return await database.knex.delete().from("User").where({id});
    }

    public async deleteUserByName(name: string): Promise<any> {
        return await database.knex.delete().from("User").where({name});
    }
}

const userRepository = new UserRepository();

export default userRepository;
