import { ApiProperty } from '@nestjs/swagger';
import { QueueStatus } from 'src/entity/kyc-session-queue.entity';

export class KYCSessionQueueDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    agentId?: number;

    @ApiProperty()
    queuedTs?: Date;

    @ApiProperty()
    customerConnectedTs?: Date;

    @ApiProperty()
    agentConnectedTs?: Date;

    @ApiProperty()
    completedTs?: Date;

    @ApiProperty()
    exitTs?: Date;

    @ApiProperty()
    sessionId?: string;

    @ApiProperty()
    agentPId?: string;

    @ApiProperty()
    customerPID?: string;

    @ApiProperty()
    queueStatus: QueueStatus;
    
    @ApiProperty()
    callRecordingVideoPath?: string;

    @ApiProperty()
    rejectReason?: string;

    @ApiProperty()
    auditedBy?: number;

    @ApiProperty()
    auditedOn?: Date;

    constructor(initialValues?: Partial<KYCSessionQueueDTO>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}