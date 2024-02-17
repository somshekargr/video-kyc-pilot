import { ApiProperty } from '@nestjs/swagger';
export class UserLoginDTO {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  public password: string;
}
