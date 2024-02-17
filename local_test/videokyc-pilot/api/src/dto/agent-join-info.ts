import { ApiProperty } from '@nestjs/swagger';

export class AgentJoinLinkInfo {
    @ApiProperty()
    queueId: number;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    agentId?: number;

    @ApiProperty()
    sessionId?: string;

    @ApiProperty()
    agentPId?: string;

    @ApiProperty()
    videofloEndpoint: string;

    constructor(initialValues?: Partial<AgentJoinLinkInfo>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}