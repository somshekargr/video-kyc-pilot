import { ApiProperty } from '@nestjs/swagger';

export class SessionInfo {
    @ApiProperty()
    queueId: number;

    constructor(initialValues?: Partial<SessionInfo>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}