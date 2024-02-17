/* tslint:disable */
/* eslint-disable */
import { AadharUploadDto } from './aadhar-upload-dto';
export interface NewCustomerDto {
  aadharUploadDTO: AadharUploadDto;
  consentAccepted: boolean;
  panNumber: string;
}
