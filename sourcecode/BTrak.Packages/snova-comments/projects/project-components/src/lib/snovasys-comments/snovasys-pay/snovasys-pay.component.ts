import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  SecurityContext,
  ViewChild,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  Output,
  EventEmitter
} from "@angular/core";
import { Observable } from "rxjs";
import { CommentApiReturnModel } from "../models/commentApiReturnModel";
import { ComponentModel } from "../models/componentModel";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTab } from '@angular/material/tabs';
import { CallService } from '../services/call.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SmsService } from '../services/sms.service';
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
import   Resumable from "resumablejs";
import { CookieService } from "ngx-cookie-service";

export enum PaymentType {
  Cash = "CASH",
  Cheque = "CHEQUE",
  CreditCard = "CREDITCARD",
  DebitCard = "DEBITCARD",
  UPI = 'UPI',
  NetBanking = 'NETBANKING',
  Others = "OTHERS"
}

@Component({
  selector: 'snovasys-pay',
  templateUrl: './snovasys-pay.component.html',
  styleUrls: ['./snovasys-pay.component.scss'],
  inputs: ['receiverId', 'componentModel', 'isPermissionExists', 'amount'],
  encapsulation: ViewEncapsulation.None
})

export class SnovasysPayComponent implements OnInit {
  @ViewChild('tabGroup', { static: true }) public tabGroup: any;

  selected: number = 1;
  public activeTabIndex: number | undefined = undefined;
  public activeTabLabel: any;
  PaymentType = PaymentType;
  selectedPayment = PaymentType.Cash;
  uploaded: boolean = false;
  environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  progressValue: number;
  fileName: string = '';
  uploading: boolean = false;
  fileUrl: string;

  receiverId
  @Input('receiverId')
  set _receiverId(data: string) {
    this.receiverId = data;
  }

  componentModel
  @Input('componentModel')
  set _componentModel(data: ComponentModel) {
    this.componentModel = data;
    console.log(this.componentModel);
    this.componentModel.callBackFunction(this.componentModel.parentComponent);
  }

  @Input() isPermissionExists: boolean;

  @Input() amount: number;

  @Input() mobileNumber: string;

  @Output() paymentInfo = new EventEmitter<any>();

  @ViewChildren(MatTab) tabs: QueryList<MatTab>;

  otpForm: FormGroup;
  showChequeForm: boolean;
  showCashForm: boolean;
  paymentFormGroup: FormGroup;
  showOtpError: boolean;
  OtpErrormessage: any;


  constructor(private callservice: CallService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private translateService: TranslateService, private smsService: SmsService, private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,) {

  }

  ngOnInit(): void {
    this.initiatePaymentForm();

    this.otpForm = new FormGroup({
      otp: new FormControl("", Validators.required)
    });
  }

  initiatePaymentForm() {
    switch (this.selectedPayment) {
      case PaymentType.Cash:
        this.paymentFormGroup = this.formBuilder.group({
          amountDue: new FormControl((this.amount ? this.amount : 0),
            Validators.compose([
              Validators.required
            ])
          ),
          amountPaid: new FormControl("",
            Validators.compose([
              Validators.required
            ])
          )
        });
        break;
      case PaymentType.Cheque:
        this.paymentFormGroup = this.formBuilder.group({
          amountDue: new FormControl(this.amount ? this.amount : 0,
            Validators.compose([
              Validators.required
            ])
          ),
          amountPaid: new FormControl("",
            Validators.compose([
              Validators.required
            ])
          ),
          chequeNumber: new FormControl("",
            Validators.compose([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern("^[a-zA-Z0-9]+$")
            ])
          ),
          bankName: new FormControl("",
            Validators.compose([
              Validators.required
            ])
          ),
          benificiaryName: new FormControl("",
            Validators.compose([
              Validators.required
            ])
          )
        });
        break;
    }
  }

  ngAfterViewInit() {
    this.activeTabIndex = this.tabGroup.selectedIndex;
    this.activeTabLabel = this.tabs.first.textLabel;
  }

  public handleTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.activeTabLabel = event.tab.textLabel;
    this.selectedPayment = (event.tab.textLabel) as PaymentType;
    this.initiatePaymentForm();
  }

  submitPayment() {
    let paymentDetails: any = {};
    paymentDetails = this.paymentFormGroup.value;
    paymentDetails.file = this.fileUrl;
    this.fileUrl = '';
    paymentDetails.paymentType = this.selectedPayment;
    paymentDetails.receiverId = this.receiverId;
    paymentDetails.mobileNumber = this.mobileNumber;
    paymentDetails.OTP = this.otpForm.value.otp;
    this.paymentInfo.emit(paymentDetails);
    this.callservice.UpdatePayment(this.componentModel, paymentDetails).subscribe((response: any) => {
      if (response && response.data) {
        this.toastr.success(this.translateService.instant("CRM.PAYMENTSUCCESSFUL"));
        this.initiatePaymentForm();
      } else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
    });
  }
  uploadFile(event) {
    this.uploading = true;
    var url = this.environment.apiURL + 'File/FileApi/UploadFileChunks';
    var files: File[] = [];
    this.fileName = event[0].name;
    let progress = 0;
    for (var i = 0; i < event.length; i++) {
      files.push(event[i]);
    }
    if (files.length > 0) {
      const r = new Resumable({
        target: url,
        chunkSize: 1 * 1024 * 1024, //3 MB
        headers: {
          // enctype: "multipart/form-data",
          // "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
        },
      });
      r.addFiles(files);
      r.on('fileAdded', (file, event) => {
        r.upload();
      });
      r.on('complete', (event) => {
        r.files.pop();
        this.uploading = false;
        this.uploaded = true;
        this.progressValue = 0;
      });
      r.on('progress', () => {
        progress = Math.round(r.progress() * 100);
        this.progressValue = progress;
        this.cdRef.detectChanges();
      });
      r.on('fileSuccess', (file, response) => {
        if (response) {
          response = JSON.parse(response)
          this.fileUrl = response[0].FilePath;
        }
      });
    }
  }
  sendOtp() {
    let otpDetails: any = {};
    otpDetails.mobileNumber = this.mobileNumber;
    otpDetails.isOtp = true;
    if (!this.mobileNumber) {
      this.toastr.error(this.translateService.instant("CRM.INVALIDMOBILENUMBER"));
      return;
    }
    this.smsService.sendOtp(otpDetails, this.componentModel).subscribe((response: any) => {
      if (response && response.data) {
        if (response.data.type == "success") {
          if (this.selectedPayment == PaymentType.Cash) {
            this.showCashForm = true;
            this.showChequeForm = true;
            this.showOtpError = false;
          }
          else if (this.selectedPayment == PaymentType.Cheque) {
            this.showChequeForm = true;
            this.showOtpError = false;
            this.showCashForm = false;
          }
        } else {
          this.showOtpError = true;
          this.showChequeForm = false;
          this.showOtpError = false;
          this.OtpErrormessage = response.data.message
        }
        this.cdRef.detectChanges();
      }
    });
  }

}
