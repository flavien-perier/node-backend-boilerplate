import database from "../../configuration/database";
import logger from "../../configuration/logger";
import AccountModel from "../model/account.model";
import HttpNotFoundError from "../../global/error/http-not-found.error";

class AccountRepository {
    private readonly _logger = logger("AccountRepository");

    public async findAccountById(id: number): Promise<AccountModel> {
        const users = await database.knex
            .select("id", "name", "password")
            .from("Account")
            .where({id}) as AccountModel[];

        if (users.length == 1) {
            return users[0];
        }

        this._logger.warn(`No user found with id: ${id}`);
        throw new HttpNotFoundError("User not found");
    }

    public async findAccountByName(name: string): Promise<AccountModel> {
        const users = await database.knex
            .select("id", "name", "password")
            .from("Account")
            .where({name}) as AccountModel[];

        if (users.length == 1) {
            return users[0];
        }

        this._logger.warn(`No user found with name: ${name}`);
        throw new HttpNotFoundError("User not found");
    }

    public async accountExistsById(id: number): Promise<boolean> {
        const users = await database.knex
            .select("id")
            .from("Account")
            .where({id}) as AccountModel[];
        return users.length == 1;

    }

    public async accountExistsByName(name: string): Promise<boolean> {
        const users = await database.knex
            .select("id")
            .from("Account")
            .where({name}) as AccountModel[];
        return users.length == 1;

    }

    public createAccount(name: string, password: string, passwordEncryption: string): Promise<any> {
        return database.knex
            .from("Account")
            .insert({
                name,
                password,
                password_encryption: passwordEncryption
            });
    }

    public async deleteAccountById(id: number): Promise<any> {
        return database.knex.delete()
            .from("Account")
            .where({id});
    }

    public async deleteUserByName(name: string): Promise<any> {
        return database.knex.delete()
            .from("Account")
            .where({name});
    }
}

const userRepository = new AccountRepository();

export default userRepository;
