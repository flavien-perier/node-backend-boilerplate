import AccountModel from "../model/account.model";
import AccountDto from "../dto/account.dto";
import UserInformationDto from "../dto/account-information.dto";

class UserOrmMapper {
    public userOrmToUserDto(userOrm: AccountModel) {
        return new AccountDto(userOrm.name, userOrm.password);
    }

    public userOrmToUserInformationDto(userOrm: AccountModel) {
        return new UserInformationDto(userOrm.name);
    }
}

const userOrmMapper = new UserOrmMapper();

export default userOrmMapper;