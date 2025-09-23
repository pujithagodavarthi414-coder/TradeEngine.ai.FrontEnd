import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ClientSearchInputModel } from "../models/client-search-input.model";
import { KycConfigurationModel } from "../models/clientKyc.model";
import { BillingDashboardService } from '../services/billing-dashboard.service';

@Component({
    selector: 'app-billing-component-kyc-submission',
    templateUrl: 'kyc-details-submission.component.html'
})

export class KycDetailsSubmissionComponent {
    @ViewChild("formio") formio: any;

    clientId: string;
    isInProgress: boolean = false;
    form: any = { components: [] };
    formData: any = { data: {} };
    canSubmit: boolean = false;
    loadingIndicator: boolean = false;
    submitLoadingIndicator: boolean = false;
    submittedMsg: string;
    timeStamp: any;
    companyId: string;
    userId: string;
    fullName: string;
    readOnly: boolean = false;
    validFormSubmission: any;
    formBgColor: string;

    constructor(private BillingDashboardService: BillingDashboardService, private DatePipe: DatePipe,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private route: ActivatedRoute) {
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.clientId = routeParams.id;
                this.clientKycDetails();
            }
        })
    }

    ngOnInit() {

    }

    clientKycDetails() {
        this.loadingIndicator = true;
        let clientInputModel = new ClientSearchInputModel();
        clientInputModel.clientId = this.clientId;
        this.BillingDashboardService.getClientKycDetails(clientInputModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data && responseData.data.length > 0) {
                        this.form = JSON.parse(responseData.data[0].formJson);
                        this.formData.data = JSON.parse(responseData.data[0].kycFormData);
                        this.timeStamp = responseData.data[0].timeStamp;
                        this.companyId = responseData.data[0].companyId;
                        this.userId = responseData.data[0].userId;
                        this.fullName = responseData.data[0].fullName;
                        this.formBgColor = responseData.data[0].formBgColor;
                        if (responseData.data[0].kycStatusName != "Verified"
                            && responseData.data[0].kycStatusName != "Submitted") {
                            this.canSubmit = true;
                        }
                        else {
                            this.canSubmit = false;
                            this.submittedMsg = "Your response is already submitted<br>Thank You!";
                        }
                    }
                    this.loadingIndicator = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.loadingIndicator = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    submitKycDetails() {
        let kycConfigurationModel = new KycConfigurationModel();
        kycConfigurationModel.clientId = this.clientId;
        kycConfigurationModel.formData = JSON.stringify(this.formData.data);
        kycConfigurationModel.formJson = JSON.stringify(this.form);
        kycConfigurationModel.timeStamp = this.timeStamp;
        kycConfigurationModel.companyId = this.companyId;
        kycConfigurationModel.userId = this.userId;
        kycConfigurationModel.fullName = this.fullName;
        kycConfigurationModel.kycSubmittedDate = this.DatePipe.transform(new Date(), "yyyy-MM-dd");
        this.submitLoadingIndicator = true;
        this.BillingDashboardService.UpsertKycDetails(kycConfigurationModel)
            .subscribe((responseData: any) => {
                let formId = responseData.data;
                if (formId) {
                    //this.submittedMsg = "Your response is submitted successfully";
                    // this.submittedMsg = "Thank You for your response!<br> You will receive an email with Login Credentials once the KYC is verified";
                    this.submittedMsg = "Thank You for your response<br> You will receive Login Credentials for LIVES once your verification is completed";
                    this.canSubmit = false
                }
                this.submitLoadingIndicator = false;
                this.cdRef.detectChanges();
            });
    }

    onChange(event: any) {
        if ((event?.detail.hasOwnProperty('changed') && (event?.detail?.changed != undefined)) || event?.detail.hasOwnProperty('changed') == false) {
            if (event.detail.data)
                this.formData.data = event.detail.data;
            this.validFormSubmission = event.detail.isValid != undefined ? event.detail.isValid : this.validFormSubmission;
        }
    }
    onSubmit(data: any) {
        if (this.validFormSubmission) {
            this.submitKycDetails();
        }
    }

    reset() {
        this.formData = { data: {} };
    }
}