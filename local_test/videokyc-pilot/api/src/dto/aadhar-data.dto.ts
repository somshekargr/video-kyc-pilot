import { ApiProperty } from "@nestjs/swagger";

export class Poi {
    @ApiProperty()
    dob: string;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    mobile: string;

    @ApiProperty()
    email: string;
}

export class Poa {
    @ApiProperty()
    careof: string;

    @ApiProperty()
    country: string;
    
    @ApiProperty()
    dist: string;

    @ApiProperty()
    house: string;

    @ApiProperty()
    landmark: string;

    @ApiProperty()
    loc: string;

    @ApiProperty()
    pc: string;

    @ApiProperty()
    po: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    street: string;

    @ApiProperty()
    subdist: string;

    @ApiProperty()
    vtc: string;
}

export class AadharDataDTO {
    @ApiProperty()
    Poi: Poi;

    @ApiProperty()
    Poa: Poa;

    @ApiProperty()
    Pht: string;

    @ApiProperty()
    referenceId: string;

    @ApiProperty()
    generatedDate: Date;
}

