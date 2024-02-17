import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AadharUploadDTO {

  @ApiProperty()
  @IsNotEmpty()
  base64XmlBase64Data: string;

  @ApiProperty()
  @IsNotEmpty()
  passPhrase: string;

  @ApiProperty()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;
}