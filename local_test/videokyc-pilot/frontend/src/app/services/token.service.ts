import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CustomerDto, UserDto } from '../api/models';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {
  }

  public tokenType(token: string): string {
    const decoded = jwt_decode(token) as any;
    return decoded.tokenType;
  }

  public getValue(token: string, valueKey: string): string {
    const decoded = jwt_decode(token) as any;
    return decoded[valueKey];
  }

  public decodeAsUserDto(token: string): UserDto {
    const userDto = jwt_decode(token) as UserDto;
    return userDto
  }

  public decodeAsCustomerDto(token: string): CustomerDto {
    const customerDto = jwt_decode(token) as CustomerDto;
    return customerDto
  }
}