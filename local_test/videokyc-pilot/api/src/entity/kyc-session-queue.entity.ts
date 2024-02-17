import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum QueueStatus {
    registered = 0,
    waitingForAgent = 1,
    waitingForCallToConnect = 2,
    callConnected = 3,
    callDisconnected = 4,
    callCompleted = 5
}

@Entity()
export class KYCSessionQueue {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerId: number;

    @Column({ nullable: true })
    agentId?: number;

    @Column({ nullable: true })
    queuedTs?: Date;

    @Column({ nullable: true })
    customerConnectedTs?: Date;

    @Column({ nullable: true })
    agentConnectedTs?: Date;

    @Column({ nullable: true })
    completedTs?: Date;

    @Column({ nullable: true })
    exitTs?: Date;

    @Column({ nullable: true })
    sessionId?: string;

    @Column({ nullable: true })
    agentPId?: string;

    @Column({ nullable: true })
    customerPID?: string;

    @Column({ nullable: true })
    callRecordingVideoPath?: string;

    @Column({ nullable: true })
    rejectReason?: string;

    @Column({ nullable: true })
    auditedBy?: number;

    @Column({ nullable: true })
    auditedOn?: Date;

    @Column({
        type: 'enum',
        enum: QueueStatus,
        default: QueueStatus.registered
    })
    queueStatus: QueueStatus;

    constructor(initialValues?: Partial<KYCSessionQueue>) {
        if (initialValues) {
            Object.assign(this, initialValues);
        }
    }
}