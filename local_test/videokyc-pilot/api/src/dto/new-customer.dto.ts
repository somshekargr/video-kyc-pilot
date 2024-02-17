import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AadharUploadDTO } from './aadhar-upload.dto';

export class NewCustomerDTO {
    @ApiProperty()
    @IsNotEmpty()
    aadharUploadDTO: AadharUploadDTO;

    @ApiProperty()
    @IsNotEmpty()
    panNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    consentAccepted: boolean;
}
