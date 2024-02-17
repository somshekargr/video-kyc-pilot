import { Dependencies, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { TextLocalClientConstants } from "../dto/app.constants";
import { NewMessageRequest } from "../dto/new-message-request";
@Injectable()
@Dependencies(HttpService)
export class MessageClientService {
  constructor(private httpService: HttpService) { }

  async sendMessage(messageRequest: NewMessageRequest): Promise<void> {
    let response = await firstValueFrom(this.httpService.post(TextLocalClientConstants.SendMessageEndPoint, messageRequest));
    let data = response.data.accessToken;
  }
}