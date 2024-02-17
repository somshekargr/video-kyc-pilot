import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedUserDTO } from '../dto/authenticated-user.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserLoginDTO } from '../dto/user-login.dto';
import { UserDTO } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService) { }

  @Post('registerNewUser')
  @ApiOperation({ operationId: 'registerNewUser' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: UserDTO,
  })
  async registerNewUser(@Body() customer: NewUserDTO): Promise<NewUserDTO> {
    let newCustomer = await this.usersService.registerNewCustomer(customer);
    return newCustomer;
  }

  @Post('authenticateUser')
  @ApiOperation({ operationId: 'authenticateUser' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: AuthenticatedUserDTO,
  })
  async authenticateUser(@Body() user: UserLoginDTO): Promise<AuthenticatedUserDTO> {
    let authenticatedUser = await this.authService.authenticateUser(user.username, user.password);
    return authenticatedUser;
  }


  @Post('deleteAllEntries')
  @ApiOperation({ operationId: 'deleteAllEntries' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteAllEntries(): Promise<boolean> {
    return this.usersService.deleteAllEntries();
  }
}
