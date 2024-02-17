import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Customer } from 'src/entity/customer.entity';
import { Repository } from 'typeorm';
import { AuthenticatedCustomerDTO } from '../dto/authenticated-customer.dto';
import { AuthenticatedUserDTO } from '../dto/authenticated-user.dto';
import { TokenType } from '../dto/token-type';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private jwtService: JwtService) { }

  async authenticateUser(username: string, password: string): Promise<AuthenticatedUserDTO> {
    const user = await this.usersService.findOne(username);
    
    if (user && (await compare(password, user.password))) {
      const jwtToken = this.jwtService.sign({
        id: user.id,
        name: user.name,
        username: username,
        email: user.email,
        userRole: user.userRole,
        tokenType: TokenType.AgentToken
      });

      return {
        id: user.id,
        name: user.name,
        userRole: user.userRole,
        token: jwtToken
      };
    }
    return null;
  }

  async authenticateCustomer(panNumber: string, phone: string): Promise<AuthenticatedCustomerDTO> {
    const customer = await this.customerRepo.findOne({
      where: {
        panNumber: panNumber, phone: phone
      }
    });

    if (!customer) {
      return null;
    }

    const payload = { ...customer, tokenType: TokenType.CustomerToken }

    return {
      token: this.jwtService.sign(payload)
    };
  }
}
