import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/entity/user.entity';

export class AuthenticatedUserDTO {
    @ApiProperty()
    public id: number;

    @ApiProperty()
    public name: string;

    @ApiProperty()
    public userRole?: UserRole | unknown;

    @ApiProperty()
    public token: string;

    constructor(initialValues?: Partial<AuthenticatedUserDTO>) {
        if (initialValues) Object.assign(this, initialValues);
    }
}
