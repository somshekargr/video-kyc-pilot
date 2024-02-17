import { ApiProperty } from '@nestjs/swagger';
import { CustomerDTO } from './customer.dto';
import { KYCSessionQueueDTO } from './kyc-session-queue.dto';
import { UserDTO } from './user.dto';

export class QueuedCustomerAgentDTO {
    @ApiProperty()
    queueInfo: KYCSessionQueueDTO;

    @ApiProperty()
    customerInfo: CustomerDTO;

    @ApiProperty()
    agentInfo?: UserDTO;

    constructor(initialValues?: Partial<QueuedCustomerAgentDTO>) {
        if (initialValues) {
            Object.assign(this, initialValues);
            Object.assign(this.customerInfo, initialValues);
        }
    }
}