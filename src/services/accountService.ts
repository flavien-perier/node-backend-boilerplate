import * as crypto from "crypto";
import userRepository from "../repositories/userRepository";
import configuration from "./configuration";
import logger from "./logger";

class AccountService {
    private _logger = logger("SessionService");

    public async createAccount(username: string, password: string) {
        const user = await userRepository.findUserByName(username);

        if (user == null) {
            const hashedPassword = this.hashPassword(password);

            userRepository.createUser(username, hashedPassword, "sha512");
            const user = await userRepository.findUserByName(username);

            return user;
        }

        this._logger.warn(`The user "${username}" already exists`);
        throw `The user "${username}" already exists`;
    }

    public async authentification(username: string, password: string) {
        const user = await userRepository.findUserByName(username);

        if (user != null) {
            const hashedPassword = this.hashPassword(password);

            if (user.password == hashedPassword) {
                return true;
            }
            return false;
        }

        this._logger.warn(`The user "${username}" does not exist`);
        return false;
    }

    private hashPassword(password: string) {
        return crypto.createHmac("sha512", configuration.salt)
                    .update(password)
                    .digest("hex");
    }
}

const accountService = new AccountService();

export default accountService;
