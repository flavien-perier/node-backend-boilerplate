import * as crypto from "crypto";
import userRepository from "../repositorie/userRepository";
import configuration from "./configuration";
import logger from "./logger";
import HttpForbidenError from "../error/HttpForbidenError";
import UserInformationDto from "../model/dto/UserInformationDto";
import userOrmMapper from "../model/mapper/userMapper"

class AccountService {
    private _logger = logger("SessionService");
    public async createAccount(username: string, password: string): Promise<UserInformationDto> {
        if (!await userRepository.userExistsByName(username)) {
            const hashedPassword = this.hashPassword(password);

            await userRepository.createUser(username, hashedPassword, "sha512");

            this._logger.info(`The user "${username}" has been created`);

            const userOrm = await userRepository.findUserByName(username)

            return userOrmMapper.userOrmToUserInformationDto(userOrm);
        }

        this._logger.warn(`The user "${username}" already exists`);
        throw new HttpForbidenError("User already exists");
    }

    public async authentification(username: string, password: string): Promise<boolean> {
        const user = await userRepository.findUserByName(username);

        if (user != null) {
            const hashedPassword = this.hashPassword(password);

            if (user.password === hashedPassword) {
                return true;
            }
            return false;
        }

        this._logger.warn(`The user "${username}" does not exist`);
        return false;
    }

    private hashPassword(password: string): string {
        return crypto.createHmac("sha512", configuration.salt)
                    .update(password)
                    .digest("hex");
    }
}

const accountService = new AccountService();

export default accountService;
