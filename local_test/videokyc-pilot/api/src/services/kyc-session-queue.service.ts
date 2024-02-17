import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { appConfig } from 'src/config/app-config';
import { AuditDTO } from 'src/dto/audit.dto';
import { VideofloSessionDTO } from 'src/dto/videoflo-session.dto';
import { KYCStatus } from 'src/entity/customer.entity';
import { KYCSessionQueue, QueueStatus } from 'src/entity/kyc-session-queue.entity';
import { VideofloSessionDocument, VideofloSessionsCollection } from 'src/schemas/videoflo-session';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { AgentJoinLinkInfo } from '../dto/agent-join-info';
import { CustomerJoinLinkInfo } from '../dto/customer-join-info';
import { KYCSessionQueueDTO } from '../dto/kyc-session-queue.dto';
import { MeetingParticipants } from '../dto/meeting-participants.dto';
import { QueuedCustomerAgentDTO } from '../dto/queued-customer-agent.dto';
import { VideoFloAccessTokenDTO } from '../dto/videoflo-access-token.dto';
import { CustomerService } from './customer.service';
import { UsersService } from './users.service';
import { VideoKycClientService } from './video-kyc-client.service';

@Injectable()
export class KYCSessionQueueService {
    constructor(
        @InjectRepository(KYCSessionQueue)
        private readonly kycSessionRepo: Repository<KYCSessionQueue>,
        private readonly customerService: CustomerService,
        private readonly usersService: UsersService,
        private readonly videoKycClientService: VideoKycClientService,
        @InjectModel(VideofloSessionsCollection)
        private readonly sessionModel: Model<VideofloSessionDocument>,
    ) { }

    async getActiveSessions(): Promise<QueuedCustomerAgentDTO[]> {
        let activeSessions = await this.kycSessionRepo.find({
            where: {
                exitTs: IsNull(), completedTs: IsNull(), queuedTs: Not(IsNull())
            },
            order: { queuedTs: 'DESC' }
        });

        let queuedActiveSessions = await Promise.all(activeSessions.map(async queue => await this.getQueuedCustomerAgentDTO(queue.id)));

        return queuedActiveSessions;
    }

    async getCallCompletedSessions(): Promise<QueuedCustomerAgentDTO[]> {
        let allSessions = await this.kycSessionRepo.find({
            where: {
                id: MoreThan(0), queueStatus: QueueStatus.callCompleted
            },
            order: { completedTs: 'DESC' }
        });

        let dtoModels = await Promise.all(allSessions.map(async queue => await this.getQueuedCustomerAgentDTO(queue.id)));

        return dtoModels;
    }


    async getAuditDataBySession(queueId: number): Promise<VideofloSessionDTO> {
        let workflowData = await this.sessionModel.findOne({ queueId: queueId });

        let dto: VideofloSessionDTO = {
            timestamp: workflowData.timestamp,
            data: workflowData.data.data,
            queueId: workflowData.queueId
        };
        return dto;
    }

    async findOne(id: number): Promise<KYCSessionQueue> {
        const queuedCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: id
            }
        });

        return queuedCustomer;
    }


    async getBySessionId(sessionId: string): Promise<KYCSessionQueue> {
        const queuedCustomer = await this.kycSessionRepo.findOne({
            where: {
                sessionId: sessionId
            }
        });

        return queuedCustomer;
    }

    async updateCallRecordingStoragePath(sessionId: string, path: string) {
        let queue = await this.kycSessionRepo.findOne({
            where: {
                sessionId: sessionId,
            }
        });

        if (queue == undefined) {
            throw new ConflictException(`Queue not found with the Session Id ${sessionId}.`);
        }

        queue.callRecordingVideoPath = path;

        await this.kycSessionRepo.save(queue);
    }

    async updateAudit(auditDto: AuditDTO): Promise<KYCSessionQueue> {
        try {
            let queue = await this.kycSessionRepo.findOne({
                where: {
                    sessionId: auditDto.sessionId,
                }
            });

            if (queue == undefined) {
                throw new ConflictException(`Queue not found with the Session Id ${auditDto.sessionId}.`);
            }

            let customer = await this.customerService.findOne(queue.customerId);
            let status = auditDto.isAccepted ? KYCStatus.accepted : KYCStatus.rejected;
            await this.customerService.updateKycStatus(customer.id, status);
            queue.auditedBy = auditDto.auditedBy;
            queue.rejectReason = auditDto.rejectReason;
            queue.auditedOn = new Date();

            await this.kycSessionRepo.save(queue);

            return queue;
        } catch (error) {
            return null;
        }
    }

    async addToKYCSessionQueue(customerId: number): Promise<KYCSessionQueueDTO> {
        const inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                customerId: customerId,
                completedTs: IsNull()
            }
        });

        if (inQueueCustomer != undefined) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        let queuedCustomer: KYCSessionQueue;
        try {
            queuedCustomer = await this.kycSessionRepo.save(new KYCSessionQueue({
                id: 0,
                customerId: customerId,
                queueStatus: QueueStatus.registered
            }));
        } catch (error) {
            let err = error;
        }
        return { ...queuedCustomer };
    }


    async updateKYCSessionQueue(queueId: number): Promise<KYCSessionQueueDTO> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId,
            }
        });

        if (inQueueCustomer == undefined) {
            throw new ConflictException(`Queue not found with the queueId ${queueId}.`);
        }

        inQueueCustomer.queuedTs = new Date();
        inQueueCustomer.queueStatus = QueueStatus.waitingForAgent;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);

        return { ...queuedCustomer };
    }

    async updateAgentDetailsToQueue(agentId: number, queueId: number): Promise<KYCSessionQueueDTO> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        inQueueCustomer.agentId = agentId;
        inQueueCustomer.queueStatus = QueueStatus.waitingForCallToConnect;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);

        return { ...queuedCustomer };
    }

    async updateQueueStateOnAgentConnected(queueId: number): Promise<KYCSessionQueueDTO> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        inQueueCustomer.agentConnectedTs = new Date();

        //updating the queueStatus to "callConnected" only if customer connected.
        if (inQueueCustomer.agentConnectedTs != null)
            inQueueCustomer.queueStatus = QueueStatus.callConnected;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);

        return { ...queuedCustomer };
    }

    async updateQueueStateOnCustomerConnected(queueId: number): Promise<KYCSessionQueueDTO> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        inQueueCustomer.customerConnectedTs = new Date();

        //if customer is connected, lets set the queueStatus as "callConnected". 
        if (inQueueCustomer.customerConnectedTs != null)
            inQueueCustomer.queueStatus = QueueStatus.callConnected;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);


        //updating the Customer KYC Status 

        await this.customerService.updateKycStatus(inQueueCustomer.customerId, KYCStatus.inProgress);

        return { ...queuedCustomer };
    }

    async updateQueueStateOnCallCompleted(queueId: number): Promise<KYCSessionQueue> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        inQueueCustomer.completedTs = new Date();
        inQueueCustomer.queueStatus = QueueStatus.callCompleted;

        //if customer is connected, lets set the queueStatus as "callConnected". 
        if (inQueueCustomer.customerConnectedTs != null)
            inQueueCustomer.queueStatus = QueueStatus.callCompleted;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);

        return { ...queuedCustomer };
    }

    async updateQueueStateOnCallDisconnected(queueId: number): Promise<KYCSessionQueue> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
        }

        inQueueCustomer.queueStatus = QueueStatus.callDisconnected;

        let queuedCustomer: KYCSessionQueue = await this.kycSessionRepo.save(inQueueCustomer);

        return { ...queuedCustomer };
    }

    async getQueuedCustomerAgentDTO(queueId: number): Promise<QueuedCustomerAgentDTO> {
        let dto: QueuedCustomerAgentDTO = new QueuedCustomerAgentDTO();
        dto.queueInfo = { ...await this.findOne(queueId) };
        dto.customerInfo = await this.customerService.findOne(dto.queueInfo.customerId);
        dto.agentInfo = null;
        if (dto.queueInfo.agentId)
            dto.agentInfo = await this.usersService.findOneById(dto.queueInfo.agentId);
        return dto;
    }

    async getAgentJoinLinkInfo(queueId: number): Promise<AgentJoinLinkInfo> {
        let queueInfo = await this.findOne(queueId);
        let joinLinkInfo = new AgentJoinLinkInfo({
            videofloEndpoint: appConfig.videofloBaseUrl,
            queueId: queueInfo.id,
            agentId: queueInfo.agentId,
            agentPId: queueInfo.agentPId,
            customerId: queueInfo.customerId,
            sessionId: queueInfo.sessionId,
        });

        return joinLinkInfo;
    }

    async getCustomerJoinLinkInfo(queueId: number): Promise<CustomerJoinLinkInfo> {
        let queueInfo = await this.findOne(queueId);
        let joinLinkInfo = new CustomerJoinLinkInfo({
            videofloEndpoint: appConfig.videofloBaseUrl,
            queueId: queueInfo.id,
            agentId: queueInfo.agentId,
            customerId: queueInfo.customerId,
            customerPID: queueInfo.customerPID,
            sessionId: queueInfo.sessionId
        });

        return joinLinkInfo;
    }

    async isValidSession(queueId: number): Promise<boolean> {
        let inQueueCustomer = await this.kycSessionRepo.findOne({
            where: {
                id: queueId
            }
        });

        if (inQueueCustomer == null) {
            return false;
        }

        //if Call is completed lets set this as invalid Session
        if (inQueueCustomer.completedTs != null && inQueueCustomer.queueStatus == QueueStatus.callCompleted) {
            return false;
        }

        // //if Call in in progress lets set this as invalid Session
        // if (inQueueCustomer.agentConnectedTs != null && inQueueCustomer.customerConnectedTs != null) {
        //     return false;
        // }

        return true;
    }

    async createSession(queueId: number): Promise<boolean> {
        try {

            let inQueueCustomer = await this.kycSessionRepo.findOne({
                where: {
                    id: queueId
                }
            });

            if (inQueueCustomer == null) {
                throw new ConflictException(`Queue not found with the queueId ${inQueueCustomer.id}.`);
            }

            let queue = await this.getQueuedCustomerAgentDTO(queueId);

            let sessionName: string = `VideoKYC Session with - ${queue.agentInfo.name}`;

            let meetingParticipants = [
                new MeetingParticipants({
                    externalParticipantId: `agent-${queue.agentInfo.id}`,
                    name: queue.agentInfo.name,
                    role: "agent",
                    videoLayoutSettings: { [`agent-${queue.agentInfo.id}`]: 'Small', [`customer-${queue.customerInfo.id}`]: 'Big' },
                    precallChecks: this.videoKycClientService.getAgentPrecallChecklist()
                }),
                new MeetingParticipants({
                    externalParticipantId: `customer-${queue.customerInfo.id}`,
                    name: queue.customerInfo.name,
                    role: "customer",
                    videoLayoutSettings: { [`agent-${queue.agentInfo.id}`]: 'Small', [`customer-${queue.customerInfo.id}`]: 'Big' },
                    precallChecks: this.videoKycClientService.getCustomerPrecallChecklist()
                }),
            ];

            //Create session by calling Video KYC Client
            let newSessionInfo = await this.videoKycClientService.createSession(sessionName, meetingParticipants, queue);

            let agentPID = newSessionInfo.participants.find(p => p.externalParticipantId == "agent-" + inQueueCustomer.agentId).participantId;

            let customerPID = newSessionInfo.participants.find(p => p.externalParticipantId == "customer-" + inQueueCustomer.customerId).participantId;

            inQueueCustomer.sessionId = newSessionInfo.sessionId;
            inQueueCustomer.agentPId = agentPID;
            inQueueCustomer.customerPID = customerPID;

            await this.kycSessionRepo.save(inQueueCustomer);

            return true;
        } catch (error) {
            console.log('Error while creating the Session');
            console.log(error);
            return false;
        }
    }


    async getVideofloAccessToken(): Promise<VideoFloAccessTokenDTO> {
        try {
            let accessToken = await this.videoKycClientService.getAccessToken();
            return { accessToken: accessToken };
        } catch (error) {
            return null;
        }
    }

    async getCallRecordingPath(sessionId: string): Promise<string> {
        let queue = await this.kycSessionRepo.findOne({
            where: {
                sessionId: sessionId
            }
        });
        if (queue == null) {
            throw new ConflictException(`Queue not found with the sessionId ${sessionId}.`);
        }

        return queue.callRecordingVideoPath;
    }

    //TODO
    async saveVideofloWorkfloData(queueId: number, webhookCallbackData: any) {

        let existingDoc = await this.sessionModel.findOne({ queueId: queueId });

        if (existingDoc != undefined) {
            existingDoc.data = webhookCallbackData;
            await existingDoc.save();
        } else {
            const newSession = await this.sessionModel.create({
                queueId: queueId,
                data: webhookCallbackData,
                timestamp: new Date(),
            });
            await newSession.save();
        }
    }


    async deleteAllEntries(): Promise<boolean> {
        await this.sessionModel.remove({});
        return true;
    }

}

