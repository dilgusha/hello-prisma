import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/app/user/dto/user-create.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
    'userName',
    'password',
]) { }