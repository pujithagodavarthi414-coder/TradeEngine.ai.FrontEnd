import { ChangeDetectorRef, Component, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { ClientOutPutModel } from "../../models/client-model";
import { LeadTemplate } from "../../models/lead-template.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
export interface DialogData {
    template: LeadTemplate;
    rowData: any;
    readOnly: boolean;
}

@Component({
    selector: 'app-lead-submission-dialog',
    templateUrl: './lead-submission-dialog.component.html'
})

export class LeadSubmissionDialogComponent {

    @ViewChild("formio") formio: any;
    form: any = { components: [] };
    formData: any = { data: {} };
    rowData: any;
    clientData: ClientOutPutModel = new ClientOutPutModel();
    validationMessage: string;
    anyOperationInProgress: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    anySCOperationInProgress: boolean;
    isClientKyc: boolean;
    disabled: boolean = true;
    creditLimit: number;
    availableCreditLimit: number;
    readOnly: boolean = false;
    enableSCOButton: boolean;
    leadFormId: string;
    creditsAllocated: number;
    constructor(public dialog: MatDialog,
        private toastr: ToastrService, private BillingDashboardService: BillingDashboardService, private toaster: ToastrService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private softLabelPipe: SoftLabelPipe,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private translateService: TranslateService,
        public dialogRef: MatDialogRef<LeadSubmissionDialogComponent>) {
        this.form = JSON.parse(this.data.template.formJson);
        this.formData.data = this.data.rowData.leadFormData ? 
                                JSON.parse(this.data.rowData.leadFormData) : 
                                this.data.rowData.formData ? JSON.parse(this.data.rowData.formData): { data: {} };
        this.rowData = this.data.rowData;
        this.creditLimit = this.data.rowData.creditLimit;
        this.availableCreditLimit = this.data.rowData.availableCreditLimit;
        this.readOnly = this.data.readOnly;
        this.isClientKyc = this.data.rowData.isClientKyc;
        if (this.formData.data.contractType == 'Contract') {
            this.enableSCOButton = false;
        } else {
            this.enableSCOButton = true;
        }
    }

    ngOnInit() {
        this.getSoftLabels();
    }


    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.cdRef.markForCheck();
        }
    }

    onChange(data: any) {
        this.formData.data = this.formio.formio.data;
    }
    onSubmit(data: any) {
        this.formData.data = this.formio.formio.data;
        this.upsertClient();
    }
    onNoClick(): void {
        this.dialogRef.close({ success: false });
    }
    onNoClickSuccess(): void {
        this.dialogRef.close({ success: true });
    }

    upsertClient() {
        this.anyOperationInProgress = true;
        this.clientData.profileImage = this.rowData.profileImage;
        this.clientData.clientId = this.rowData.clientId;
        this.clientData.clientAddressId = this.rowData.clientAddressId;
        this.clientData.clientType = this.rowData.clientType;
        this.clientData.kycDocument = this.rowData.kycDocument;
        this.clientData.clientAddressTimeStamp = this.rowData.clientAddressTimeStamp;
        this.clientData.timeStamp = this.rowData.timeStamp;
        this.clientData.leadFormData = JSON.stringify(this.formData.data);
        this.clientData.leadFormJson = JSON.stringify(this.form);
        this.clientData.leadFormId = this.rowData.leadFormId ? this.rowData.leadFormId : this.data.template.templateId;
        this.clientData.roleId = this.rowData.roleId;
        this.clientData.firstName = this.rowData.firstName;
        this.clientData.lastName = this.rowData.lastName;
        this.clientData.email = this.rowData.email;
        this.clientData.companyName = this.rowData.companyName;
        this.clientData.countryId = this.rowData.countryId;
        this.clientData.isForLeadSubmission = true;
        this.clientData.creditLimit = this.rowData.creditLimit;
        if(this.formData.data.creditsToBeUsed) {
            if(this.formData.data.creditsToBeUsed > 0 && (this.rowData.availableCreditLimit - this.formData.data.creditsToBeUsed > 0)) {
                this.clientData.availableCreditLimit = this.rowData.availableCreditLimit - this.formData.data.creditsToBeUsed;
            }
            else {
                this.toaster.error("Please enter valid credit limit");
                return;
            }
        }
        else {
            this.clientData.availableCreditLimit = this.rowData.availableCreditLimit;
        }

        this.BillingDashboardService.addClient(this.clientData).subscribe((result: any) => {
            if (result) {
                this.anyOperationInProgress = false;
                if (result.success == false) {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toaster.error(this.softLabelPipe.transform(this.validationMessage, this.softLabels));
                }
                else if (result.success == true) {
                    this.snackbar.open(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.CLIENTDETAILSUPDATEDSUCCESSFULLY), this.softLabels), this.translateService.instant(ConstantVariables.success), {
                        duration: 3000
                    });
                    this.leadFormId = result.data;
                    this.anyOperationInProgress = false;
                    if (this.formData.data.contractType == 'Contract') {
                        this.enableSCOButton = false;
                    } else if(this.formData.data.contractType.toLowerCase() == 'noncontract' && !this.readOnly) {
                        this.enableSCOButton = false;
                    }
                    else {
                        this.enableSCOButton = true;
                        this.onNoClickSuccess();
                    }
                    
                }
            }
        })
    }

    upsertSCO() {
        this.anySCOperationInProgress = true;
        var scoLeadModel = new ClientOutPutModel();
        scoLeadModel.leadFormData = JSON.stringify(this.formData.data);
        scoLeadModel.leadFormJson = JSON.stringify(this.form);
        scoLeadModel.clientId = this.clientData.clientId;
        scoLeadModel.email = this.clientData.email;
        scoLeadModel.firstName = this.clientData.firstName;
        scoLeadModel.leadFormId = this.leadFormId;
        scoLeadModel.creditsAllocated = this.creditsAllocated;
        scoLeadModel.email = this.rowData.email ? this.rowData.email : null;
        let headers = [];
        let leadFormJson = this.form.components;
        leadFormJson.forEach((component) => {
           headers.push({
               key: component.key,
               label: component.label
            });
          })
        scoLeadModel.components = headers;
        this.BillingDashboardService.upsertSCO(scoLeadModel).subscribe((response: any)=> {
            this.anySCOperationInProgress = false;
            if(response.success) {
                this.onNoClickSuccess();
            } else {
                this.toastr.error("",response.apiResponseMessages[0].message);
            }
        })

    }

    change() {
        
    }
}