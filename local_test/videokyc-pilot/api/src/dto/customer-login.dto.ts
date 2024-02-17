import { ApiProperty } from '@nestjs/swagger';
export class CustomerLoginDTO {
    @ApiProperty()
    public panNumber: string;

    @ApiProperty()
    public phone: string;
}
