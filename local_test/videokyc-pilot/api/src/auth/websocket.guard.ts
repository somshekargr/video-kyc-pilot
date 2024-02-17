import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CustomerDTO } from '../dto/customer.dto';
import { TokenType } from '../dto/token-type';
import { UserDTO } from '../dto/user.dto';

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const wsContext = context.switchToWs();
      const client: Socket = wsContext.getClient<Socket>();

      const authToken = client.handshake?.query?.token;
      const ipAddress = client.handshake.address;

      try {
        const decodedToken = this.jwtService.verify(authToken as string);
        const tokenType = decodedToken['tokenType'];

        if (tokenType == TokenType.AgentToken) {
          wsContext.getData().decodedTokenObject = this.decodeToUserDTO(decodedToken);
        } else {
          wsContext.getData().decodedTokenObject = this.decodeToCustomerDTO(decodedToken);
        }
      } catch (error) {
        //TODO Handle invalid token
      }

      //Valid token and valid case
      return true;
    } catch (err) {
      throw new WsException(err.message);
    }
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
}
