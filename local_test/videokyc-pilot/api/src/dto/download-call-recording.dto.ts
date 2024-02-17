import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DownloadCallRecordingDTO {
    @ApiProperty()
    @IsNotEmpty()
    sessionId: string;

    @ApiProperty()
    @IsNotEmpty()
    outputPath: string;

    constructor(initialValues?: Partial<DownloadCallRecordingDTO>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}