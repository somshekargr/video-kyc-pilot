/* tslint:disable */
/* eslint-disable */
import { CustomerAddress } from './customer-address';
export interface CustomerDto {
  addressInfo: CustomerAddress;
  careof: string;
  consentAccepted: boolean;
  dob: string;
  email: string;
  id: number;
  kycStatus: number;
  name: string;
  panNumber: string;
  phone: string;
  photo: string;
}
