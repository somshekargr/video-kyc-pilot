import { ApiProperty } from '@nestjs/swagger';

export class CustomerJoinLinkInfo {
    @ApiProperty()
    queueId: number;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    agentId?: number;

    @ApiProperty()
    sessionId?: string;

    @ApiProperty()
    customerPID?: string;

    @ApiProperty()
    videofloEndpoint: string;

    constructor(initialValues?: Partial<CustomerJoinLinkInfo>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}