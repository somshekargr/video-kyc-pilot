/* tslint:disable */
/* eslint-disable */
export interface KycSessionQueueDto {
  agentConnectedTs: string;
  agentId: number;
  agentPId: string;
  auditedBy: number;
  auditedOn: string;
  callRecordingVideoPath: string;
  completedTs: string;
  customerConnectedTs: string;
  customerId: number;
  customerPID: string;
  exitTs: string;
  id: number;
  queueStatus: number;
  queuedTs: string;
  rejectReason: string;
  sessionId: string;
}
