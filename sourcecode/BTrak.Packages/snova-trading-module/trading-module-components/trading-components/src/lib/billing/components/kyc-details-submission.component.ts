import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ClientSearchInputModel } from "../models/client-search-input.model";
import { KycConfigurationModel } from "../models/clientKyc.model";
import { BillingDashboardService } from '../services/billing-dashboard.service';

@Component({
    selector: 'app-billing-component-kyc-submission',
    templateUrl: 'kyc-details-submission.component.html',
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

    constructor(private BillingDashboardService: BillingDashboardService,private DatePipe: DatePipe,
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
                        var inputFormJson = this.form;
                        inputFormJson = this.getUploadObjects(inputFormJson, 'type', 'myfileuploads', true, ['myfileuploads']);
                        this.form = inputFormJson;
                        this.formData.data = JSON.parse(responseData.data[0].kycFormData);
                        this.timeStamp = responseData.data[0].timeStamp;
                        this.companyId = responseData.data[0].companyId;
                        this.userId = responseData.data[0].userId;
                        this.fullName = responseData.data[0].fullName;
                        if (responseData.data[0].kycStatusName != "Verified" 
                            && responseData.data[0].kycStatusName != "Submitted") {
                            this.canSubmit = true;
                        }
                        else {
                            this.canSubmit = false;
                            this.submittedMsg = "Your response is already submitted";
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

    getUploadObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getUploadObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj.properties['referenceTypeId'] = this.clientId;
                obj.properties['referenceTypeName'] = (obj.key != null && obj.key != undefined && obj.key != "") ? obj.key : val;
            }
            else if (i != key && !list.includes(obj[key])) {
                
            }
        }
        return obj;
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
        kycConfigurationModel.kycSubmittedDate = this.DatePipe.transform(new Date(),"yyyy-MM-dd");
        this.submitLoadingIndicator = true;
        this.BillingDashboardService.UpsertKycDetails(kycConfigurationModel)
            .subscribe((responseData: any) => {
                let formId = responseData.data;
                if (formId) {
                    //this.submittedMsg = "Your response is submitted successfully";
                    this.submittedMsg = "Thank You for your response";
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
            this.validFormSubmission = event.detail.isValid != undefined?event.detail.isValid : this.validFormSubmission;
        }
    }
    onSubmit(data: any) {
        if(this.validFormSubmission) {
            this.submitKycDetails();
        }
    }
}