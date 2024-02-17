import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiResponse, CustomerDto, NewCustomerDto } from '../api/models';
import { CustomerService } from '../api/services';
import { KYCStatus } from '../types/kyc-status';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from '../services/authentication.service';
import { AppConstants } from '../utils/app-constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css']
})
export class CustomerRegistrationComponent implements OnInit, OnDestroy {
  aadharXmlUploadConsent: string = AppConstants.aadharXmlUploadConsent;
  isRegisteredCustomer = false;
  isRegistrationSuccess: boolean;
  isLookupDone: boolean = false;
  showAadharCheckContent: boolean = false;
  hasOfflineAadharReady: boolean;
  customerHasAadhar: boolean;
  queueIdGenerated: any;
  registrationForm: FormGroup;
  panLookUpForm: FormGroup;
  customerInfo: CustomerDto = null;
  customerPAN: string = "";
  uploadedFiles: any[] = [];
  offlineAadharXmlZip: File = null;
  aaadharZipBase64: string;
  validFile = false;
  fileDetailText = "";
  allowedFileTypes = ["application/zip", "application/x-zip-compressed"]
  apiResponse: ApiResponse = null;
  isNewlyRegistered: boolean = false;
  public isSubmited: boolean = false;

  panControlSubscription: Subscription;

  constructor(private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    localStorage.clear();
  }

  ngOnDestroy(): void {
    if (this.panControlSubscription) {
      this.panControlSubscription.unsubscribe();
      this.panControlSubscription = null;
    }
  }

  ngOnInit(): void {
    this.authenticationService.customerLogout(null);
    this.initializeForm();

    const panControl = this.panLookUpForm.get('pan');
    this.panControlSubscription = panControl.valueChanges.subscribe(() => {
      let first10Chars = panControl.value.substring(0, 10);
      panControl.patchValue(first10Chars.toUpperCase(), { emitEvent: false });
    });
  }

  initializeForm() {
    let panRegex = "[A-Z]{5}[0-9]{4}[A-Z]{1}";

    this.registrationForm = this.builder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      consent: new FormControl(null, [Validators.required]),
      panNumber: new FormControl('', [Validators.required, Validators.pattern(panRegex)]),
      passPhrase: new FormControl('', [Validators.required]),
    });

    this.panLookUpForm = this.builder.group({
      pan: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(panRegex),])
    });
  }

  get pf() {
    return this.panLookUpForm.controls;
  }

  get cf() {
    return this.registrationForm.controls;
  }

  public get KycStatus(): typeof KYCStatus {
    return KYCStatus;
  }

  isKycDone(): boolean {
    if (this.customerKycStatus == this.KycStatus.toBeAudited || this.customerKycStatus == this.KycStatus.accepted || this.customerKycStatus == this.KycStatus.rejected)
      return true;
    else
      return false;
  }

  get customerKycStatus() {
    if (!this.customerInfo) {
      return KYCStatus.notStarted;
    }
    return this.customerInfo.kycStatus as KYCStatus;
  }


  getCssBasedOnKYC(): string {
    let css = "";
    switch (this.customerKycStatus) {
      case KYCStatus.notStarted:
      case KYCStatus.scheduled:
      case KYCStatus.inProgress:

      case KYCStatus.toBeAudited:
      case KYCStatus.accepted:
        css = "alert-success"
        break;

      case KYCStatus.rejected:
        css = "alert-warning"
        break;
      default:
    }

    return `alert ${css} alert-has-icon`;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async registerNewCustomer() {
    this.isSubmited = true;
    this.markFormGroupTouched(this.registrationForm);

    if (this.isValidRegistrationForm()) {
      this.spinner.show();
      this.apiResponse = null;

      let formData = this.registrationForm.value as CustomerDto;

      let isRegisteredCustomer = await this.customerService.isRegistered({
        body: { panNumber: formData.panNumber }
      }).toPromise();

      if (isRegisteredCustomer) {
        this.messageService.add({ severity: 'info', summary: "Already Registered", detail: "You are already registered." });
      } else {
        let requestBody: NewCustomerDto = {
          aadharUploadDTO: {
            base64XmlBase64Data: this.aaadharZipBase64,
            email: formData.email,
            mobile: formData.phone,
            passPhrase: this.registrationForm.value.passPhrase
          }, panNumber: this.customerPAN, consentAccepted: this.registrationForm.value.consent
        }
        //TODO. Validate the File uploaded.
        this.apiResponse = await this.customerService.registerNewCustomer({ body: requestBody }).toPromise();
        if (this.apiResponse.success) {
          this.isNewlyRegistered = true;
          this.isRegistrationSuccess = true;
          this.isRegisteredCustomer = true;
          this.queueIdGenerated = this.apiResponse.data;
        } else {
        }
      }
      this.spinner.hide();
    }
  }


  hafFormPageError() {
    if (this.apiResponse == null) {
      return false;
    }
    return this.apiResponse.success == false ? true : false;
  }


  async panNumberLookup() {
    if (this.panLookUpForm.valid) {
      this.customerPAN = this.panLookUpForm.value.pan;

      this.customerInfo = await this.customerService.getCustomerByPan({ body: { panNumber: this.customerPAN } }).toPromise();
      if (this.customerInfo != null) {
        this.isRegisteredCustomer = true;
      }

      this.isLookupDone = true;

      //if registered customer, Lets get the customer details
      if (this.isRegisteredCustomer) {

        //Lets navigate to waiting room
      } else {
        this.showAadharCheckContent = true;
        this.registrationForm.controls.panNumber.disable();
        this.registrationForm.controls.panNumber.setValue(this.customerPAN);
      }
    }
  }

  onHasOfflineAadharReady() {
    this.hasOfflineAadharReady = true;
    this.showAadharCheckContent = false;
  }

  onNoOfflineAadharReady() {
    this.showAadharCheckContent = false;
    this.hasOfflineAadharReady = false;
  }

  isValidRegistrationForm(): boolean {
    return this.registrationForm.valid && this.validFile && this.registrationForm.value.consent == true;
  }

  onFileSelect(event: any, fileUploadControl: any) {
    if (event.files) {
      this.offlineAadharXmlZip = event.files[0];

      if (this.allowedFileTypes.includes(this.offlineAadharXmlZip.type.toLocaleLowerCase())) {
        this.validFile = true;
        this.getBase64(this.offlineAadharXmlZip);
        this.fileDetailText = `${this.offlineAadharXmlZip.name}`
      }
      else {
        this.validFile = false;
        this.offlineAadharXmlZip = null;
        fileUploadControl.clear();
      }

    }
  }

  getBase64(file: any) {
    let _this = this;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      _this.aaadharZipBase64 = reader.result as string;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  redirectsToJoin(): void {
    let url = `/vkyc/${this.queueIdGenerated}`
    this.router.navigateByUrl(url);
  }
}
