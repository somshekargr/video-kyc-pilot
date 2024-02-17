import { ApiProperty } from "@nestjs/swagger";

export class VideofloSessionDTO {
    @ApiProperty()
    timestamp?: any;

    @ApiProperty()
    data: any;

    @ApiProperty()
    queueId: number;

    constructor(initialValues?: Partial<VideofloSessionDTO>) {
        if (initialValues) Object.assign(this, initialValues);
    }
}