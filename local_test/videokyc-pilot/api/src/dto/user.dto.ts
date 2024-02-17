import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/entity/user.entity';

export class UserDTO {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    userRole: UserRole;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    mobileNo: string;

    constructor(initialValues?: Partial<UserDTO>) {

        if (initialValues) Object.assign(this, initialValues);
    }
}
