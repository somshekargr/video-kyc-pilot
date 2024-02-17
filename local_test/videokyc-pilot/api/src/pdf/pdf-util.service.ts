import { Injectable } from "@nestjs/common";
import { PDFOptions, PDFService } from "@t00nday/nestjs-pdf";
import { firstValueFrom } from "rxjs";
import { KYCStatus } from "src/entity/customer.entity";
import { KYCSessionQueueService } from "src/services/kyc-session-queue.service";
import * as moment from 'moment';
import { VideoFloActivityTypes } from "src/dto/app.constants";


@Injectable()
export class PDFUtilService {
    constructor(
        private pdfService: PDFService,
        private kycSessionQueueService: KYCSessionQueueService,
    ) {
    }


    KYC(dto) {
        let statusDetail = { status: '', css: '' };
        switch (dto.customerInfo.kycStatus) {
            case KYCStatus.notStarted:
                statusDetail.status = "Not Started";
                statusDetail.css = "text-primary";
                break;
            case KYCStatus.scheduled:
                statusDetail.status = "Schedulded";
                statusDetail.css = "text-primary";
                break;
            case KYCStatus.inProgress:
                statusDetail.status = "Inprogress";
                statusDetail.css = "text-primary";
                break;
            case KYCStatus.toBeAudited:
                statusDetail.status = "To be Audited";
                statusDetail.css = "text-primary";
                break;
            case KYCStatus.accepted:
                statusDetail.status = "Accepted"
                statusDetail.css = "text-primary";
                break;
            case KYCStatus.rejected:
                statusDetail.status = "Rejected"
                statusDetail.css = "text-danger";
                break;
            case KYCStatus.agentRejected:
                statusDetail.status = "Agent Rejected"
                statusDetail.css = "text-danger";
                break;
            default:
        }

        return statusDetail;
    }


    async generatePDFToFile(
        options?: PDFOptions,
        template?: string,
        filename?: string,
    ) {

        let queueId = 188;
        let sessionData = await this.kycSessionQueueService.getAuditDataBySession(queueId);

        let queueDetails = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(queueId);

        let addressInfo = queueDetails.customerInfo.addressInfo;
        let address = `${queueDetails.customerInfo.name} ${queueDetails.customerInfo.careof} ${addressInfo.street} ${addressInfo.villageTownCity}
        ${addressInfo.subDistrict} ${addressInfo.district} ${addressInfo.post} ${addressInfo.state}`;

        let kycDoneOn = moment(queueDetails.queueInfo.customerConnectedTs).format('MMM DD, YYYY');

        let templateData = {
            customerName: queueDetails.customerInfo.name,
            customerPAN: queueDetails.customerInfo.panNumber,
            customerAadharAddress: address,
            kycStatus: this.KYC(queueDetails).status,
            kycDoneOn: kycDoneOn,
            activityState: {
                hasIpVerification: sessionData.data.hasOwnProperty(VideoFloActivityTypes.ipVerification),
                hasGeolocationVerification: sessionData.data.hasOwnProperty(VideoFloActivityTypes.geolocationVerification),
                hasRandomQuestions: sessionData.data.hasOwnProperty(VideoFloActivityTypes.randomQuestions),
                hasFaceRecognition: sessionData.data.hasOwnProperty(VideoFloActivityTypes.faceRecognition),
                hasCustomerSignature: sessionData.data.hasOwnProperty(VideoFloActivityTypes.customerSignature),
                hasPanCapture: sessionData.data.hasOwnProperty(VideoFloActivityTypes.panCapture),
            },
            activityData: {
                ipVerification: {},
                geolocationVerification: {},
                randomQuestions: {},
                faceRecognition: {},
                customerSignature: {},
                panCapture: {}
            },
            sessionData: sessionData,
            // hasActivity: function (activityName: string) {
            //     return this.sessionData.hasOwnProperty(activityName);
            // }
            // getAgentDataByActivity: function (activityName: string) {
            //     if (queueDetails)
            //         return this.sessionData.data[activityName][queueDetails.queueInfo.customerPID]

            //     return null
            // }
        };


        if (templateData.activityState.hasIpVerification) {
            let activityData = sessionData.data[VideoFloActivityTypes.ipVerification][queueDetails.queueInfo.customerPID];
            templateData.activityData.ipVerification = {
                ip: activityData.payload.ip,
                latitude: activityData.payload.latitude,
                longitude: activityData.payload.longitude,
                internetProvider: activityData.payload?.asn?.name,
                city: activityData.payload.city,
                country: activityData.payload.country_name
            }
        }

        if (templateData.activityState.hasGeolocationVerification) {
            let activityData = sessionData.data[VideoFloActivityTypes.geolocationVerification][queueDetails.queueInfo.customerPID];
            templateData.activityData.geolocationVerification = {
                formatted_address: activityData.payload.results[0].formatted_address,
                lat: activityData.payload.results[0].geometry.location.lat,
                lng: activityData.payload.results[0].geometry.location.lng,
            }
        }

        if (templateData.activityState.hasRandomQuestions) {
            let activityData = sessionData.data[VideoFloActivityTypes.randomQuestions][queueDetails.queueInfo.customerPID];

            let items = [];
            activityData.payload.forEach(element => {
                let i = 1;
                items.push({ index: i, question: element.question, expectedAnswer: element.expectedAnswer });
                i += 1;
            });
            templateData.activityData.randomQuestions = items;
        }


        if (templateData.activityState.hasFaceRecognition) {
            let activityData = sessionData.data[VideoFloActivityTypes.faceRecognition][queueDetails.queueInfo.customerPID];

            templateData.activityData.faceRecognition = {
                matchingPercentage: activityData.payload.faceMatchingResult.matchingPercentage,
                aadharImageBase64: activityData.payload.image1.base64Image,
                liveImageBase64: activityData.payload.image2.base64Image
            }
        }

        if (templateData.activityState.hasCustomerSignature) {
            let activityData = sessionData.data[VideoFloActivityTypes.customerSignature][queueDetails.queueInfo.customerPID];

            templateData.activityData.customerSignature = {
                signatureBase64: activityData.payload.base64Image,
            }
        }

        if (templateData.activityState.hasPanCapture) {
            let activityData = sessionData.data[VideoFloActivityTypes.panCapture][queueDetails.queueInfo.customerPID];

            templateData.activityData.panCapture = {
                panImageBase64: activityData.payload.result.pan_image,
                faceImageBase64: activityData.payload.result.face_image,
                signatureBase64: activityData.payload.result.signature_image,
                panNumber: activityData.payload.result.pan_num,
                name: activityData.payload.result.name,
                fatherName: activityData.payload.result.father_name,
                dob: activityData.payload.result.dob,
            }
        }


        let localOptions = { 'locals': templateData };

        let localFileName = "D:\\videoflo_session_videos\\test.pdf";

        let localTemplate = 'vkyc-summary'

        let fileResult = await firstValueFrom(this.pdfService.toFile(localTemplate, localFileName, localOptions));

        // let streamResult = await firstValueFrom(this.pdfService.toStream(localTemplate, localOptions));

        //let bufferResult = await firstValueFrom(this.pdfService.toBuffer(localTemplate, localOptions));

        return fileResult;
    }

    generatePDFToStream(template: string, options?: PDFOptions) {
        this.pdfService.toStream(template, options); // returns Observable<Readable>;
    }

    generatePDFToBuffer(template: string, options?: PDFOptions) {
        this.pdfService.toBuffer(template, options); // returns Observable<Buffer>;
    }
}