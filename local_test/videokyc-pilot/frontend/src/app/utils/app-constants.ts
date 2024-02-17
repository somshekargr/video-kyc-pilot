import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../environments/environment';

export class AppConstants {

  public static get baseURL(): string {
    return '/api/';
  }

  private static _baseWsUrl: string;

  public static webSocketIoConfig: SocketIoConfig = {
    url: AppConstants.getBaseWebSocketUrl(),
    options: {},
  };

  public static getBaseWebSocketUrl(): string {
    if (!AppConstants._baseWsUrl) {
      AppConstants._baseWsUrl = environment.webSocketUrl.replace('http', 'ws');
    }

    return AppConstants._baseWsUrl;
  }

  public static aadharXmlUploadConsent: string = `I am authorizing Integra Micro Systems Pvt. Ltd. to do the offline verification of
  Aadhar XML for identification purpose. I am aware that my aadhar number will not be
  stored or will be redacted by Integra Micro Systems Pvt. Ltd.`;
}
