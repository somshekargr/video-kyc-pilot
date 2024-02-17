export class NewSessionInfo {
    sessionId: string;
    participants: NewParticipantInfo[];
  }
  
  export class NewParticipantInfo {
    participantId: string;
    externalParticipantId: string;
  }
  