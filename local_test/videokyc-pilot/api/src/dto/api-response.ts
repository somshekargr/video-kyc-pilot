import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class APIResponse<T> {
    @IsNotEmpty()
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    @Optional()
    statusCode: number;

    @ApiProperty()
    @Optional()
    data: T

    @ApiProperty()
    @Optional()
    error: string;

    constructor(initialValues?: Partial<APIResponse<T>>) {
        this.data = null;
        this.error = null;
        this.success = true;
        //Setting the status code as 200 by default.
        this.statusCode = 200;
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}