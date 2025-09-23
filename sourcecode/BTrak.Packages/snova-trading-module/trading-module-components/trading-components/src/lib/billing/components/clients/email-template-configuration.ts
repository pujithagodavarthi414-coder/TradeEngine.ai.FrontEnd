import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { ConstantVariables } from "../../constants/constant-variables";
import { AppBaseComponent } from "../componentbase";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { EmailTemplateModel } from "../../models/email-template.model";

@Component({
    selector: "app-trading-component-email-template",
    templateUrl: "email-template-configuration.html"
})
export class EmailTemplateComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("emailTemplatePopup") upsertEmailTemplatePopover;
    @ViewChildren("deleteEmailTemplatePopup") deleteEmailTemplatePopup;
    @Input("clientId")
    set _pageCount(data: any) {
        if (data) {
            this.clientId = data;
        }
    }
    state: State = {
        skip: 0,
        take: 20,
    };
    templateState: State = {
        skip: 0,
        take: 30,
    };
    searchText: string;
    temp: any;
    emailTemplateList: EmailTemplateModel[] = [];
    isAnyOperationIsInprogress: boolean = false;
    emailTemplate: string;
    emailTemplateId: string;
    timeStamp: any;
    emailTemplateName: string;
    isArchived: boolean;
    isEmailTemplateArchived: boolean;
    emailTemplateForm: FormGroup;
    validationMessage: string;
    isThereAnError: boolean;
    emailTemplateModel: EmailTemplateModel;
    productList: any;
    clientId: string;
    kycTagsList: any[] = [];
    constructor(private BillingDashboardService: BillingDashboardService, private translateService: TranslateService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllEmailTemplates();
    }

    getAllEmailTemplates() {
        let emailTemplate = new EmailTemplateModel();
        emailTemplate.isArchived = this.isArchived;
        emailTemplate.clientId = this.clientId;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllEmailTemplates(emailTemplate)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.emailTemplateList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    getHtmlTagsById(emailTemplateReferenceId) {
        let emailTemplate = new EmailTemplateModel();
        emailTemplate.isArchived = this.isArchived;
        emailTemplate.emailTemplateReferenceId = emailTemplateReferenceId;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getHtmlTagsById(emailTemplate)
            .subscribe((responseData: any) => {
                this.kycTagsList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                //this.cdRef.detectChanges();
            });
    }


    editEmailTemplate(rowDetails, emailTemplatePopup) {
        this.emailTemplateForm.patchValue(rowDetails);
        this.emailTemplateId = rowDetails.emailTemplateId;
        // this.vessel = this.translateService.instant("BILLINGGRADE.EDITGRADE");
         this.emailTemplate = "Edit email template";
         this.getHtmlTagsById(rowDetails.emailTemplateReferenceId);
         emailTemplatePopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((emailTemplate) =>
            (emailTemplate.emailTemplateName.toLowerCase().indexOf(this.searchText) > -1)
            || (emailTemplate.emailSubject.toLowerCase().indexOf(this.searchText) > -1)
            || (emailTemplate.emailTemplate.toLowerCase().indexOf(this.searchText) > -1)
            ));
        this.emailTemplateList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }

    createEmailTemplate(emailTemplatePopup) {
        emailTemplatePopup.openPopover();
        //this.vessel = this.translateService.instant("BILLINGGRADE.ADDGRADE");
        this.emailTemplate = this.translateService.instant("LEGALENTITY.ADDLEGALENTITY");
    }

    deleteEmailTemplatePopUpOpen(row, deleteEmailTemplatePopup) {
        this.emailTemplateId = row.emailTemplateId;
        this.emailTemplateName = row.emailTemplateName;
        this.timeStamp = row.timeStamp;
        this.isEmailTemplateArchived = !this.isArchived;
        deleteEmailTemplatePopup.openPopover();
    }

    upsertEmailTemplate(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let emailTemplate = new EmailTemplateModel();
        emailTemplate = this.emailTemplateForm.value;
        emailTemplate.emailTemplateName = this.emailTemplateForm.controls['emailTemplateName'].value.trim();
        emailTemplate.emailTemplateId = this.emailTemplateId;
        emailTemplate.clientId = this.clientId;
        emailTemplate.timeStamp = this.timeStamp;
        this.BillingDashboardService.UpsertEmailTemplate(emailTemplate).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertEmailTemplatePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllEmailTemplates();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.emailTemplateId = null;
        this.validationMessage = null;
        this.emailTemplateName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.emailTemplateModel = null;
        this.timeStamp = null;
        this.emailTemplateForm = new FormGroup({
            emailTemplateName: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.maxLength(ConstantVariables.MaxLength)]
            ),
            emailSubject: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            emailTemplate: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    closeUpsertEmailTemplatePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmailTemplatePopover.forEach((p) => p.closePopover());
    }

    closeDeleteEmailTemplatePopup() {
        this.clearForm();
        this.deleteEmailTemplatePopup.forEach((p) => p.closePopover());
    }

    deleteEmailTemplate() {
        this.isAnyOperationIsInprogress = true;
        const emailTemplateModel = new EmailTemplateModel();
        emailTemplateModel.emailTemplateId = this.emailTemplateId;
        emailTemplateModel.emailTemplateName = this.emailTemplateName;
        emailTemplateModel.clientId = this.clientId;
        emailTemplateModel.timeStamp = this.timeStamp;
        emailTemplateModel.isArchived = this.isEmailTemplateArchived;
        this.BillingDashboardService.UpsertEmailTemplate(emailTemplateModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteEmailTemplatePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmailTemplates();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
}