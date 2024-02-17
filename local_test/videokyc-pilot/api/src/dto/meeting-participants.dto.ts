import { ApiProperty } from '@nestjs/swagger';
import { PrecallChecks } from './precall-checks';

export class MeetingParticipants {
    @ApiProperty()
    externalParticipantId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    videoLayoutSettings: any;

    @ApiProperty()
    precallChecks: PrecallChecks;

    constructor(initialValues?: Partial<MeetingParticipants>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}


