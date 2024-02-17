import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedCustomerDTO {
    @ApiProperty()
    public token: string;
}
