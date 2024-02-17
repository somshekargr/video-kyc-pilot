/* tslint:disable */
/* eslint-disable */
import { CustomerDto } from './customer-dto';
import { KycSessionQueueDto } from './kyc-session-queue-dto';
import { UserDto } from './user-dto';
export interface QueuedCustomerAgentDto {
  agentInfo: UserDto;
  customerInfo: CustomerDto;
  queueInfo: KycSessionQueueDto;
}
