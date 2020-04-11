import UserOrm from "../orm/UserOrm";
import UserDto from "../dto/UserDto";
import UserInformationDto from "../dto/UserInformationDto";

class UserOrmMapper {
    public userOrmToUserDto(userOrm: UserOrm) {
        return new UserDto(userOrm.name, userOrm.password);
    }

    public userOrmToUserInformationDto(userOrm: UserOrm) {
        return new UserInformationDto(userOrm.name);
    }
}

const userOrmMapper = new UserOrmMapper();

export default userOrmMapper;