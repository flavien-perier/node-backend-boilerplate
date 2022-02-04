import * as crypto from "crypto";
import userRepository from "../repository/account.repository";
import configuration from "../../configuration/environment";
import logger from "../../configuration/logger";
import HttpForbidenError from "../../global/error/http-forbiden.error";
import UserInformationDto from "../dto/account-information.dto";
import userOrmMapper from "../mapper/account.mapper"

class AccountService {
    private readonly _logger = logger("AccountService");
    public async createAccount(username: string, password: string): Promise<UserInformationDto> {
        if (!await userRepository.accountExistsByName(username)) {
            const hashedPassword = this.hashPassword(password);

            await userRepository.createAccount(username, hashedPassword, "sha512");

            this._logger.info(`The user "${username}" has been created`);

            const userOrm = await userRepository.findAccountByName(username)

            return userOrmMapper.userOrmToUserInformationDto(userOrm);
        }

        this._logger.warn(`The user "${username}" already exists`);
        throw new HttpForbidenError("User already exists");
    }

    public async authentification(username: string, password: string): Promise<boolean> {
        const user = await userRepository.findAccountByName(username);

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
