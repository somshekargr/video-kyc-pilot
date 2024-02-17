import { UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketAuthGuard } from '../auth/websocket.guard';
import { WebSocketEvents } from '../dto/websocket-events';
import { Server, Socket } from 'socket.io';
import { TokenType } from '../dto/token-type';
import { WebSocketRoomType } from '../dto/app.constants';
import { JwtService } from '@nestjs/jwt';
import { CustomerDTO } from '../dto/customer.dto';
import { UserDTO } from '../dto/user.dto';
import { KYCSessionQueueService } from '../services/kyc-session-queue.service';

@UseGuards(WebSocketAuthGuard)
@WebSocketGateway({ transports: ['websocket'] })
export class ApplicationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private kycSessionQueueService: KYCSessionQueueService,
  ) { }

  public async handleDisconnect(client: Socket) {

    const authToken = client.handshake?.query?.token;
    const ipAddress = client.handshake.address;

    try {
      const decodedToken = this.jwtService.verify(authToken as string);
      const tokenType = decodedToken['tokenType'];

      if (tokenType == TokenType.AgentToken) {
        client.leave(WebSocketRoomType.AgentsRoom);
      } else {
        client.leave(this.getCustomerRoomName(decodedToken));
      }
    } catch (error) {
      //TODO Handle invalid token
    }
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    const authToken = client.handshake?.query?.token;
    const ipAddress = client.handshake.address;

    try {
      const decodedToken = this.jwtService.verify(authToken as string);
      const tokenType = decodedToken['tokenType'];

      if (tokenType == TokenType.AgentToken) {
        client.join(WebSocketRoomType.AgentsRoom);
      } else {
        client.join(this.getCustomerRoomName(decodedToken));
      }
    } catch (error) {
      //TODO Handle invalid token
    }
  }

  //Event fired from Customer
  @SubscribeMessage(WebSocketEvents.getWaitingPeriod)
  public async getWaitingPeriod(@MessageBody() data: any) {

    //decodedTokenObject is the data is from WebSocketAuthGuard. It has either UserDTO or CustomerDTO based on Token Type
    const customerInfo: CustomerDTO = data.decodedTokenObject;

    const eventData = data.eventData;
    eventData.queueId;

    const queuedCustomer = await this.kycSessionQueueService.updateKYCSessionQueue(eventData.queueId);

    const agentsRoom = this.server.to(WebSocketRoomType.AgentsRoom);

    const QueuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(queuedCustomer.id);

    agentsRoom.emit(WebSocketEvents.customerWaiting, { QueuedCustomerAgentDTO });
  }

  @SubscribeMessage(WebSocketEvents.onCustomerConnectsToCall)
  public async onAgentConnectsToCall(@MessageBody() data: any) {
    //decodedTokenObject is the data is from WebSocketAuthGuard. It has either UserDTO or CustomerDTO based on Token Type
    const customerInfo: CustomerDTO = data.decodedTokenObject;

    const eventData = data.eventData;

    const queuedCustomer = await this.kycSessionQueueService.updateQueueStateOnCustomerConnected(eventData.queueId);

    const agentsRoom = this.server.to(WebSocketRoomType.AgentsRoom);

    const QueuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(queuedCustomer.id);

    //Lets emit the Agent to Start the call
    agentsRoom.emit(WebSocketEvents.customerAcceptsCall, { QueuedCustomerAgentDTO });

    agentsRoom.emit(WebSocketEvents.refreshKycSessionQueue, { QueuedCustomerAgentDTO });
  }

  @SubscribeMessage(WebSocketEvents.acceptRequest)
  public async acceptRequest(@MessageBody() data: any) {
    //decodedTokenObject is the data is from WebSocketAuthGuard. It has either UserDTO or CustomerDTO based on Token Type
    const userInfo: UserDTO = data.decodedTokenObject;

    const eventData = data.eventData;

    //Update the agent details to queue
    await this.kycSessionQueueService.updateAgentDetailsToQueue(userInfo.id, eventData.queueId);

    let queueInfo = await this.kycSessionQueueService.findOne(eventData.queueId);

    let customerRoomName = this.getCustomerRoomNameById(queueInfo.customerId);
    const customerRoom = this.server.to(customerRoomName);

    let queuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(eventData.queueId)

    customerRoom.emit(WebSocketEvents.onJoinSession, { queuedCustomerAgentDTO });

    //TODO
    //Create the meeting join link

    const agentsRoom = this.server.to(WebSocketRoomType.AgentsRoom);
    agentsRoom.emit(WebSocketEvents.refreshKycSessionQueue, { queuedCustomerAgentDTO });
  }

  private decodeToCustomerDTO(decodedToken: any): CustomerDTO {
    let dto: CustomerDTO = {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      phone: decodedToken.phone,
      panNumber: decodedToken.panNumber,
      kycStatus: decodedToken.kycStatus,
    }
    return dto;
  }

  private decodeToUserDTO(decodedToken: any): UserDTO {
    let userDTO: UserDTO =
    {
      id: decodedToken.id,
      mobileNo: decodedToken.mobileNo,
      name: decodedToken.name,
      username: decodedToken.username,
      email: decodedToken.email,
      userRole: decodedToken.userRole
    }
    return userDTO;
  }

  private getCustomerRoomName(decodedToken: any): string {
    let roomName = `${WebSocketRoomType.CustomersRoom}-${this.decodeToCustomerDTO(decodedToken).id}`;
    return roomName;
  }

  private getCustomerRoomNameById(id: number): string {
    let roomName = `${WebSocketRoomType.CustomersRoom}-${id}`;
    return roomName;
  }

}