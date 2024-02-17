export enum QueueStatus {
    registered = 0,
    waitingForAgent = 1,
    waitingForCallToConnect = 2,
    callConnected = 3,
    callDisconnected = 4,
    callCompleted = 5
}