import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/app/user/dto/user-create.dto';

export class RegisterUserDto extends OmitType(CreateUserDto, ['role','userId']) {}