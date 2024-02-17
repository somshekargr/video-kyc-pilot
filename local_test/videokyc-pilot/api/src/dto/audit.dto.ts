import { ApiProperty } from '@nestjs/swagger';

export class AuditDTO {
    @ApiProperty()
    queueId: number;

    @ApiProperty()
    sessionId: string;

    @ApiProperty()
    isAccepted: boolean;

    @ApiProperty()
    rejectReason?: string;

    @ApiProperty()
    auditedBy?: number;

    constructor(initialValues?: Partial<AuditDTO>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}