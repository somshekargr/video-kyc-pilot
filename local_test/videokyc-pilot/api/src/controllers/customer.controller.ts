import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { appConfig } from 'src/config/app-config';
import { AadharDataDTO } from 'src/dto/aadhar-data.dto';
import { APIResponse } from 'src/dto/api-response';
import { EmailSubjects, EmailTemplateName } from 'src/dto/app.constants';
import { NewCustomerDTO } from 'src/dto/new-customer.dto';
import { KYCStatus } from 'src/entity/customer.entity';
import { MailInfo } from 'src/mail/mail-info';
import { MailService } from 'src/mail/mail.service';
import { KYCSessionQueueService } from 'src/services/kyc-session-queue.service';
import { OfflineAadharXmlService } from 'src/services/offline-aadhar-xml.service';
import { AuthenticatedCustomerDTO } from '../dto/authenticated-customer.dto';
import { CustomerLoginDTO } from '../dto/customer-login.dto';
import { CustomerDTO, PanLookupDTO } from '../dto/customer.dto';
import { CustomerService } from '../services/customer.service';

@Controller('customer')
@ApiTags('customer')
export class CustomerController {
  constructor(
    private customerService: CustomerService,
    private kycSessionQueueService: KYCSessionQueueService,
    private authService: AuthService,
    private mailService: MailService,
    private offlineKycService: OfflineAadharXmlService,
  ) { }

  @Post('isRegistered')
  @ApiOperation({ operationId: 'isRegistered' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean,
  })
  async isRegistered(@Body() panInfo: PanLookupDTO): Promise<boolean> {
    let isRegistered = await this.customerService.isRegistered(panInfo.panNumber);
    return isRegistered;
  }

  @Get('getCustomer/:id')
  @ApiOperation({ operationId: 'getCustomer' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: CustomerDTO
  })
  async getCustomer(@Param('id') id: number): Promise<CustomerDTO> {
    let customer = await this.customerService.findOne(id);
    return customer;
  }

  @Get('getCustomerByQueueId/:queueId')
  @ApiOperation({ operationId: 'getCustomerByQueueId' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: CustomerDTO || null
  })
  async getCustomerByQueueId(@Param('queueId') queueId: number): Promise<CustomerDTO | null> {
    let customer = await this.customerService.findOneByQueueId(queueId);
    return customer;
  }

  // @UseGuards(JwtAuthGuard)
  @Post('getCustomerByPAN')
  @ApiOperation({ operationId: 'getCustomerByPAN' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: CustomerDTO
  })
  async getCustomerByPAN(@Body() panInfo: PanLookupDTO): Promise<CustomerDTO> {
    let customer = await this.customerService.getCustomerByPAN(panInfo.panNumber);
    return customer;
  }

  @Post('registerNewCustomer')
  @ApiOperation({ operationId: 'registerNewCustomer' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: APIResponse,
  })
  async registerNewCustomer(@Body() newCustomerDto: NewCustomerDTO): Promise<APIResponse<any>> {

    let result: APIResponse<any>;

    //Reading the Aadhar XML and parsing the data
    try {
      var b64string = newCustomerDto.aadharUploadDTO.base64XmlBase64Data;
      if (b64string.indexOf(',') >= 0)
        b64string = b64string.split(',')[1];

      var buffer = Buffer.from(b64string, 'base64');
      result = await this.offlineKycService.parse(buffer, newCustomerDto.aadharUploadDTO);

    } catch (error: any) {
      return new APIResponse({ error: error?.message, success: false });
    }

    if (result.success) {
      try {

        //let aadharData = result.data as AadharDataDTO;
        let newCust = this.mapAadharData(result, newCustomerDto.panNumber, newCustomerDto.consentAccepted);

        newCust = await this.customerService.registerNewCustomer(newCust);

        let queuedCustomer = await this.kycSessionQueueService.addToKYCSessionQueue(newCust.id);

        //Sending the Email for the Customer
        let maininfo: MailInfo = {
          subject: EmailSubjects.customerKycJoinSubject,
          teamplateContext: {
            url: this.getCustomerJoinUrl(queuedCustomer.id)
          },
          templateName: EmailTemplateName.customerKycJoinTemplate,
          to: newCust.email
        };

        //Sending Email to Customer, if Email is enabled
        if (appConfig.emailConfig.enabled) {
          await this.mailService.sendEmail(maininfo);
        }

        let retVal = new APIResponse({ data: queuedCustomer.id });
        return retVal;

      } catch (error) {
        return new APIResponse({ error: error, success: false });
      }
    } else {
      //returning the error response
      return result;
    }
  }

  private mapAadharData(result: any, panNumber: string, consentAccepted: boolean): CustomerDTO {
    let aadharData = result.data as AadharDataDTO;

    let newCust: CustomerDTO = {
      id: 0,
      photo: aadharData.Pht,
      careof: aadharData.Poa.careof,
      dob: this.getFormattedDate(aadharData.Poi.dob),
      name: aadharData.Poi.name,
      email: aadharData.Poi.email,
      phone: aadharData.Poi.mobile,
      panNumber: panNumber,
      kycStatus: KYCStatus.notStarted,
      consentAccepted: consentAccepted
    };
    newCust.addressInfo = {};
    newCust.addressInfo.villageTownCity = aadharData.Poa.vtc;
    newCust.addressInfo.aadharName = aadharData.Poi.name;
    newCust.addressInfo.country = aadharData.Poa.country;
    newCust.addressInfo.street = aadharData.Poa.street;
    newCust.addressInfo.state = aadharData.Poa.state;
    newCust.addressInfo.post = aadharData.Poa.po;
    newCust.addressInfo.pincode = aadharData.Poa.pc;
    newCust.addressInfo.location = aadharData.Poa.loc;
    newCust.addressInfo.landmark = aadharData.Poa.landmark;
    newCust.addressInfo.house = aadharData.Poa.house;
    newCust.addressInfo.district = aadharData.Poa.dist;
    newCust.addressInfo.subDistrict = aadharData.Poa.subdist;

    return newCust;
  }

  private getCustomerJoinUrl(queued: number): string {
    let vkycJoinUrl = new URL(`/vkyc/${queued}`, appConfig.applicationUIEndPointUrl).href;
    return vkycJoinUrl;
  }

  @Post('authenticateCustomer')
  @ApiOperation({ operationId: 'authenticateCustomer' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: AuthenticatedCustomerDTO,
  })
  async authenticateCustomer(@Body() customer: CustomerLoginDTO): Promise<AuthenticatedCustomerDTO> {
    let authenticatedCustomer = await this.authService.authenticateCustomer(customer.panNumber, customer.phone);
    return authenticatedCustomer;
  }


  @Post('deleteAllEntries')
  @ApiOperation({ operationId: 'deleteAllEntries' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteAllEntries(): Promise<boolean> {
    return this.customerService.deleteAllEntries();
  }

  //Date in dd-mm-yyyy format as string
  private getFormattedDate(dateString: string) {
    if (dateString.trim().length > 0) {
      var from: any = dateString.split("-");
      return new Date(from[2], from[1] - 1, from[0])
    }
    return null;
  }
}