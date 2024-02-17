import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { KYCStatus } from 'src/entity/customer.entity';

export class PanLookupDTO {
    @ApiProperty()
    @IsNotEmpty()
    panNumber: string;
}

export class CustomerAddress {
    @ApiProperty()
    @IsOptional()
    villageTownCity?: string;

    @ApiProperty()
    @IsOptional()
    aadharName?: string;

    @ApiProperty()
    @IsOptional()
    country?: string;

    @ApiProperty()
    @IsOptional()
    street?: string;

    @ApiProperty()
    @IsOptional()
    state?: string;

    @ApiProperty()
    @IsOptional()
    post?: string;

    @ApiProperty()
    @IsOptional()
    pincode?: string;

    @ApiProperty()
    @IsOptional()
    location?: string;

    @ApiProperty()
    @IsOptional()
    landmark?: string;

    @ApiProperty()
    @IsOptional()
    house?: string;

    @ApiProperty()
    @IsOptional()
    district?: string;

    @ApiProperty()
    @IsOptional()
    subDistrict?: string;
}

export class CustomerDTO {
    @ApiProperty()
    @IsOptional()
    id: number;

    @ApiProperty()
    @IsOptional()
    photo?: string;

    @ApiProperty()
    @IsOptional()
    careof?: string;

    @ApiProperty()
    @IsOptional()
    dob?: Date;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    panNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    kycStatus: KYCStatus;

    @ApiProperty()
    @IsNotEmpty()
    addressInfo?: CustomerAddress;

    @ApiProperty()
    @IsNotEmpty()
    consentAccepted?: boolean;
}
