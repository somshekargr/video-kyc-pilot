export abstract class WebSocketRoomType {
  static readonly AgentsRoom: string = 'AgentsRoom';
  static readonly CustomersRoom: string = 'CustomersRoom';
}

export abstract class ParticipantRoleType {
  static readonly Agent: string = 'agent';
  static readonly Customer: string = 'customer';
}

export abstract class ParticipantConnectionState {
  static readonly Disconnected: string = 'disconnected';
  static readonly Connected: string = 'connected';
}

export abstract class TextLocalClientConstants {
  static readonly SendMessageEndPoint = `https://api.textlocal.in/send/`;
  static readonly AppId: string = 'NzE1YTU0NTk0MjYxMzA1MzQxNGY3NDc4NGU2YjYzMzA=';
  static readonly Sender: string = 'BOTAIML-VIDEOKYC';
}

export abstract class EmailTemplateName {
  static readonly customerKycJoinTemplate = `customer-join-invitation`;
  static readonly customerKycCompletedTemplate = `customer-kyc-completed`;
  static readonly customerKycAcceptedTemplate = `customer-kyc-accepted`;
  static readonly customerKycRejectedTemplate = `customer-kyc-rejected`;
  static readonly agentKycJoinTemplate = `agent-join-invitation`;
}

export abstract class EmailSubjects {
  static readonly customerKycJoinSubject = `Video KYC Link`;
  static readonly customerKycCompletedSubject = `Your Video KYC application has been submitted`;
  static readonly customerKycAcceptedSubject = `Your Video KYC application has been accepted successfully`;
  static readonly customerKycRejectedSubject = `Your Video KYC application has been rejected`;
}

export abstract class VideoFloActivityTypes {
  static readonly ipVerification = `ipVerification`;
  static readonly geolocationVerification = `geolocationVerification`;
  static readonly randomQuestions = `randomQuestions`;
  static readonly faceRecognition = `faceRecognition`;
  static readonly customerSignature = `customerSignature`;
  static readonly panCapture = `panCapture`;
}
