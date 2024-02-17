export abstract class WebSocketEvents {
  static readonly getWaitingPeriod = 'getWaitingPeriod';
  static readonly customerWaiting = 'customerWaiting';
  static readonly onWaitingPeriodReceived = 'onWaitingPeriodReceived';

  //from Agent
  static readonly acceptRequest = 'acceptRequest';

  //From Customer to Agents
  static readonly onCustomerConnectsToCall = 'onCustomerConnectsToCall';

  //By Customer
  static readonly rejectRequest = 'rejectRequest';

  static readonly joinSession = 'joinSession';

  //From Agent to Customer
  static readonly onJoinSession = 'onJoinSession';

  //From Customer to Agent
  static readonly customerAcceptsCall = 'customerAcceptsCall';

  static readonly refreshKycSessionQueue = 'refreshKycSessionQueue';
}
