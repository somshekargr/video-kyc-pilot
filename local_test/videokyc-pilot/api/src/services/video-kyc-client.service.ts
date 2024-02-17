import { HttpService } from '@nestjs/axios';
import { Dependencies, Injectable } from "@nestjs/common";
import { createWriteStream } from 'fs';
import { firstValueFrom } from "rxjs";
import { appConfig } from "src/config/app-config";
import { PrecallChecks } from 'src/dto/precall-checks';
import { QueuedCustomerAgentDTO } from "src/dto/queued-customer-agent.dto";
import { WorkflowActivity } from "src/dto/videoflo-workflow-activity.dto";
import { MeetingParticipants } from "../dto/meeting-participants.dto";
import { NewSessionInfo } from "../dto/new-session-info.dto";

var dateFormat = require('dateformat');

@Injectable()
@Dependencies(HttpService)
export class VideoKycClientService {

  private VideofloBaseUrl: string;
  private WebhookBaseUrl: string;

  private VideoKycPilotBaseUrl: string;

  private CreateTokenEndPoint: string;
  private CreateSessionEndPoint: string;

  private getActivityDataEndPoint: string;
  private downloadCallRecordingEndPoint: string;

  private AppId: string;
  private SecretKey: string;

  private Webhooks: string

  constructor(
    private httpService: HttpService
  ) {
    this.VideofloBaseUrl = appConfig.videofloBaseUrl;
    this.WebhookBaseUrl = appConfig.webHookBaseUrl;
    this.VideoKycPilotBaseUrl = appConfig.applicationBaseUrl;

    this.CreateTokenEndPoint = `${this.VideofloBaseUrl}/token/getToken`;
    this.CreateSessionEndPoint = `${this.VideofloBaseUrl}/videoSessions/createSession`;

    this.getActivityDataEndPoint = `${this.VideofloBaseUrl}/videoSessions/getActivityData`;
    this.downloadCallRecordingEndPoint = `${this.VideofloBaseUrl}/videoSessions/downloadCallRecording`;

    this.AppId = appConfig.videofloAppId;
    this.SecretKey = appConfig.videofloSecretKey;

    this.Webhooks = `{
      "onParticipantConnected": "${this.WebhookBaseUrl}/VideoKycWebhook/onParticipantConnected",
      "onParticipantDisconnected": "${this.WebhookBaseUrl}/VideoKycWebhook/onParticipantDisconnected",
      "onWorkflowFinished": "${this.WebhookBaseUrl}/VideoKycWebhook/onWorkflowFinished",
      "onRecordingAvailable": "${this.WebhookBaseUrl}/VideoKycWebhook/onRecordingAvailable",
      "onRecordingError": "${this.WebhookBaseUrl}/VideoKycWebhook/onRecordingError"
    }`;
  }

  async createSession(sessionName: string, meetingParticipants: MeetingParticipants[], dto: QueuedCustomerAgentDTO): Promise<NewSessionInfo> {

    let participants = meetingParticipants;
    let webhooks = this.Webhooks;

    let activities = this.getDynamicActivities(dto);

    let createTokenPayLoad = {
      appId: this.AppId,
      secretKey: this.SecretKey,
    };

    try {

      let response = await firstValueFrom(this.httpService.post(this.CreateTokenEndPoint, createTokenPayLoad));
      let accessToken = response.data.accessToken;

      const createSessionPayload = {
        name: sessionName,
        participants: participants,
        activities: activities,
        webhooks: JSON.parse(webhooks),
      };

      let headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      };

      let responseObject = await firstValueFrom(this.httpService.post(this.CreateSessionEndPoint, createSessionPayload, headers));
      let sessionInfo = responseObject.data;

      return { ...sessionInfo };
    } catch (error) {
      console.log('Erorr while creating the session');
      console.error(error);
      return null;
    }
  }

  async getAccessToken(): Promise<string> {
    let createTokenPayLoad = {
      appId: this.AppId,
      secretKey: this.SecretKey,
    };

    try {
      let response = await firstValueFrom(this.httpService.post(this.CreateTokenEndPoint, createTokenPayLoad));
      let accessToken = response.data.accessToken;
      return accessToken;
    } catch (error) {
      return null;
    }
  }

  async getActivityData(sessionId: string): Promise<any> {
    try {
      const createTokenPayLoad = {
        appId: this.AppId,
        secretKey: this.SecretKey,
      };

      const response = await firstValueFrom(this.httpService.post(this.CreateTokenEndPoint, createTokenPayLoad));
      const accessToken = response.data.accessToken;

      let headers = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      };

      let responseObject = await firstValueFrom(this.httpService.get(`${this.getActivityDataEndPoint}/${sessionId}`, headers));
      let sessionInfo = responseObject.data;

      return { ...sessionInfo };
    } catch (error) {
      return null;
    }
  }

  async downloadCallRecording(sessionId: string, filePath: string): Promise<void> {
    const createTokenPayLoad = {
      appId: this.AppId,
      secretKey: this.SecretKey,
    };

    const response = await firstValueFrom(this.httpService.post(this.CreateTokenEndPoint, createTokenPayLoad));
    const accessToken = response.data.accessToken;

    let headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: <any>'stream'
    };

    const file = createWriteStream(filePath);

    let responseObject = await firstValueFrom(this.httpService.get(`${this.downloadCallRecordingEndPoint}/${sessionId}`, headers));

    try {

      responseObject.data.pipe(file);
    } catch (error) {
      console.log('error downloading the call recording : ', file);

    }

  }

  getDynamicActivities(dto: QueuedCustomerAgentDTO): WorkflowActivity[] {
    let agentId = `agent-${dto.agentInfo.id}`;
    let customerId = `customer-${dto.customerInfo.id}`;

    let activities: WorkflowActivity[] = [];

    let geolocationVerificationActivity: WorkflowActivity =
    {
      id: "geolocationVerification",
      activityType: "GeolocationVerification",
      gatherFrom: ["customer"],
      displayTo: ["agent"]
    };


    let ipVerificationActivity: WorkflowActivity =
    {
      id: "ipVerification",
      activityType: "IpAddressVerification",
      gatherFrom: ["customer"],
      displayTo: ["agent"]
    }


    //Section for QnA
    var qnaPairs = [];
    if (dto.customerInfo.careof) {
      qnaPairs.push(
        {
          "question": "What is your careof's name?",
          "expectedAnswer": dto.customerInfo.careof,
          "allowedAttempts": 3,
          "speech": {
            "speak": "What is your careof's name?",
            "audioUrl": ""
          }
        }
      );
    }

    let address = this.getCustomeraddressFromAadhar(dto)
    if (address) {
      qnaPairs.push(
        {
          "question": "Could you please confirm your current address?",
          "expectedAnswer": address,
          "allowedAttempts": 3,
          "speech": {
            "speak": "Could you please confirm your current address?",
            "audioUrl": ""
          }
        }
      );
    }


    let dob = dto.customerInfo.dob;
    var dobFormatted = dateFormat(dob, "dd-mm-yyyy");

    if (dob != null) {
      qnaPairs.push(
        {
          "question": "What is your Date of Birth?",
          "expectedAnswer": dobFormatted,
          "allowedAttempts": 3,
          "speech": {
            "speak": "What is your Date of Birth?",
            "audioUrl": ""
          }
        },
      );
    }


    let randomQuestionsActivity: WorkflowActivity =
    {
      id: "randomQuestions",
      activityType: "QnA",
      gatherFrom: ["customer"],
      displayTo: ["agent"],
      configuration: {
        "title": "Question/Answers",
        "description": "Please answer a few questions for us.",
        "noOfQuestionsToAsk": 3,
        "qnaPairs": qnaPairs
      }
    }

    let matchHeadPosesActivity: WorkflowActivity =
    {
      id: "matchHeadPoses",
      activityType: "MatchHeadPoses",
      gatherFrom: ["customer"],
      displayTo: ["agent"],
      configuration: {
        title: "Liveness Detection",
        description: "Please turn your head in the direction prompted",
        poses: ["faceleft", "faceright", "faceup", "facedown"],
        noOfPosesToCheck: 2,
        noOfFramesToCheck: 5
      }
    };

    activities.push(geolocationVerificationActivity, ipVerificationActivity, randomQuestionsActivity, matchHeadPosesActivity);

    if (dto.customerInfo.photo != null) {

      let faceRecognitionActivity: WorkflowActivity =
      {
        id: "faceRecognition",
        activityType: "FaceRecognition",
        gatherFrom: ["customer"],
        displayTo: ["agent"],
        configuration: {
          title: "Face Recognition",
          face1: {
            sourceType: "Base64",
            value: "data:image/jpeg;base64," + dto.customerInfo.photo,
            caption: "Photo in Aadhar Card",
            displayTo: [agentId]
          },
          "face2": {
            sourceType: "Camera",
            caption: "Photo from Live Stream",
            capturerExternalId: agentId,
            instructionTitle: "Capturing your photo",
            instructionDescription: "Please hold your face straight and look towards the camera",
            capturerInstructionTitle: "Capture Customer's Photo",
            capturerInstructionDescription: "Make sure that the customer is faced towards the camera and the full-frontal face is visible"
          }
        }
      }

      activities.push(faceRecognitionActivity);
    }


    let panCaptureActivity: WorkflowActivity =
    {
      id: "panCapture",
      activityType: "PanRecognition",
      gatherFrom: ["customer"],
      displayTo: ["agent"],
      onActivityDataGathered: `${this.WebhookBaseUrl}/api/VideoKycWebhook/onActivityDataGathered`,
      onActivityAction: `${this.WebhookBaseUrl}/api/VideoKycWebhook/onActivityAction`,
      configuration: {
        title: "Pan Recognition",
        responseRequired: true,
        requiredFields: ["pan_num", "name", "dob", "father_name"],
        optionalFields: ["face_image", "signature_image", "pan_image"],
        image: {
          sourceType: "Camera",
          caption: "Captured Pan Card Image",
          capturerExternalId: agentId,
          instructionTitle: "Capturing your pan photo",
          instructionDescription: "Please hold your pan straight and show to the camera",
          capturerInstructionTitle: "Capture Customer's PAN Card Photo",
          capturerInstructionDescription: "Make sure that the PAN Card is faced towards the camera, is being held in correct orientation and all the fields are visible and legible"
        },
      }
    }


    let customerSignatureActivity: WorkflowActivity = {
      id: "customerSignature",
      activityType: "CaptureImage",
      gatherFrom: ["customer"],
      displayTo: ["agent"],
      configuration: {
        title: "Capture Signature Image",
        options: {
          sourceType: "Camera",
          caption: "Captured Image",
          capturerExternalId: agentId,
          instructionTitle: "Capturing your speciment signature",
          instructionDescription: "Please sign on a white paper and show it to the camera",
          capturerInstructionTitle: "Capture Customer's Speciment Signature",
          capturerInstructionDescription: "Make sure that the signature is fully focused and readable"
        }
      }
    }

    activities.push(panCaptureActivity, customerSignatureActivity);

    return activities;
  }

  getCustomeraddressFromAadhar(dto: QueuedCustomerAgentDTO): string {
    let add = dto.customerInfo.addressInfo;
    let address = `${add.aadharName} ${dto.customerInfo.careof} ${add.house}, ${add.street} ${add.villageTownCity} ${add.location}
    ${add.district} ${add.subDistrict} ${add.state} ${add.pincode} ${add.post}`;
    return address;
  }


  getCustomerPrecallChecklist(): PrecallChecks {
    let jsonText = `{
      "awaitCallJoining": true,
      "awaitMessage": {
        "title": "Customer Onboarding in progress",
        "description": "Please wait for the customer onboarding to complete"
      },
      "consent": {
        "title": "Thank you for your interest in Integra Video KYC Pilot.",
        "subTitle": "Here are some instructions you need to know, before starting your video based KYC process.",
        "body": "<ol><li>Follow the instructions to regarding camera, mic and location access as they appear on the next screen.</li><li>Keep your PAN Card along with Specimen Signature (signed on a white paper) handy for the Video KYC session.</li><li>Tick the below consent checkbox to agree to our terms and click on \\"Proceed for Video KYC\\" button.</li></ol>",
        "checkboxText": "I hereby authorize Integra Micro Systems Pvt. Ltd. to conduct Video KYC and to collect and store my \\"Proof of Identity\\", \\"Proof of Address\\", \\"Specimen Signature\\" &amp; \\"Live Picture\\" during the Video KYC process for the purpose of KYC identity verification.",
        "validationErrorText": "You need to give your consent before proceeding further.",
        "footer": "You will be redirected from the current page after clicking on \\"Proceed to Video KYC\\" button to start the Video KYC session.",
        "continueButtonText": "Proceed to Video KYC"
      },
      "devicePermissions": {
        "title": "Give Permissions",
        "subTitle": "We need a few permissions before we can connect you to the video call",
        "geolocation": "Please give permission to access your location.",
        "ipAddress": "",
        "microphone": "Please give access to microphone.",
        "microphoneNotFoundText": "Oops! Mic is not available",
        "camera": "Please give access to camera.",
        "cameraNotFoundText": "Oops! Camera is not available",
        "rearCamera": "Please give access to back camera.",
        "rearCameraNotFoundText": "Oops! Rear camera is not available. While you may still continue, we advice you to use a device with rear camera to ensure any documents that are captured, are as clear as possible.",
        "isRearCameraMandatory": false
      },
      "checklist": [
        {
          "id": "ensureDocuments",
          "title": "Do you have all the documents handy?",
          "subTitle": "Make sure that:",
          "items": [
            "You have your original PAN Card with you",
            "You have put your signature on a blank white paper, it is clearly legible and matches your signature"
          ],
          "continueButtonText": "Yes, I have them ready"
        },
        {
          "id": "ensureEnvironment",
          "title": "Are you ready for the video call?",
          "subTitle": "Ensure that:",
          "items": [
            "You are in a well lit surrounding",
            "There are no background noises or disturbance"
          ],
          "continueButtonText": "Yes, I am ready"
        },
        {
          "id": "goodInternet",
          "title": "Almost there!",
          "body": "<h3>Do you have a strong internet connection?</h3><p>Ensure you are on a stable mobile network or, use a WiFi network.</p>",
          "footer": "Upon pressing the \\"Start Video Call\\" button, you will be connected to an authorized representative for a quick video-based KYC process.",
          "continueButtonText": "Start Video Call"
        }
      ]
    }`;

    let precallChecks: PrecallChecks = JSON.parse(jsonText);

    return precallChecks;
  }

  getAgentPrecallChecklist(): PrecallChecks {
    let jsonText = `{     
      "devicePermissions": {
        "title": "Give Permissions",
        "subTitle": "We need a few permissions before we can connect you to the video call",
        "geolocation": "Please give permission to access your location.",
        "ipAddress": "",
        "microphone": "Please give access to microphone.",
        "microphoneNotFoundText": "Oops! Mic is not available",
        "camera": "Please give access to camera.",
        "cameraNotFoundText": "Oops! Camera is not available",
        "rearCamera": "Please give access to back camera.",
        "rearCameraNotFoundText": "Oops! Rear camera is not available. While you may still continue, we advice you to use a device with rear camera to ensure any documents that are captured, are as clear as possible.",
        "isRearCameraMandatory": false
      }
  }`;

    let precallChecks: PrecallChecks = JSON.parse(jsonText);

    return precallChecks;
  }
}