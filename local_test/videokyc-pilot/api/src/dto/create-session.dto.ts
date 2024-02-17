import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionInfo {
    @ApiProperty()
    queueId: number;

    constructor(initialValues?: Partial<CreateSessionInfo>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}