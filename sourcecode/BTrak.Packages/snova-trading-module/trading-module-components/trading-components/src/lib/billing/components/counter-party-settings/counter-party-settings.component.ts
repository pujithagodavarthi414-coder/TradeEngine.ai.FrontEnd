import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AppBaseComponent } from "../componentbase";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { CounterPartySettingsModel } from "../../models/counterparty-settings.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { CookieService } from "ngx-cookie-service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ConstantVariables } from "../../constants/constant-variables";
import { TradeTemplateModel } from "../../models/trade-template-model";
import { TemplateConfigModel } from "../../models/template-config-model";
import * as _ from "underscore";
import { ClientOutPutModel } from "../../models/client-model";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
@Component({
    selector: "app-counter-party-settings",
    templateUrl: "counter-party-settings.component.html",
})
export class CounterPartySettingsComponent extends AppBaseComponent implements OnInit {
    isEmail: boolean = false;
    isEmailTemplate: boolean = false;
    isContractTemplate: boolean = false;
    isTradeTemplate: boolean = false;
    isTreeStructure: boolean = false;
    templateId: string;
    clientModel: ClientOutPutModel;
    isInvoiceTemplate: boolean = false;
    isKycTemplateSelect: boolean = true;
    toMailsList: string[] = [];
    tempToMailsList: string[] = [];
    templateTypeId: any[] = [];
    templateTypes: any[] = [];
    tradeTemplateTypes: any[] = [];
    selectable: boolean = true;
    removable = true;
    keyName: string;
    count = 0;
    toMail: string;
    loadingInProgress: boolean = false;
    kycLoadingInProgress: boolean = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    counterPartySettingsId: string;
    timeStamp: any;
    selectedParentFolderId: null;
    description: string;
    softLabels: SoftLabelConfigurationModel[];
    userModel: any;
    kycForm: FormGroup;
    referenceTypeId: string = ConstantVariables.ClientSettingsReferenceTypeId;
    counterPartySettings: CounterPartySettingsModel[] = [];
    clientId: string;
    templatesList: any;
    invoiceTemplateDescription: string;
    invoiceTemplateId: string;
    getFilesByReferenceId: boolean = true;
    moduleTypeId: number = 19;
    stampModuleTypeId : number = 20;
    stampReferenceTypeId : string = ConstantVariables.ClientStampReferenceTypeId;
    isToUploadFiles: boolean;
    selectedStoreId: string;
    removeFiles: boolean;
    templateName: string;
    isRefresh: boolean;

    constructor(private toastr: ToastrService,
        private translateService: TranslateService,
        private BillingDashboardService: BillingDashboardService,
        private cdRef: ChangeDetectorRef,
        private cookieService: CookieService,
        private route: ActivatedRoute
    ) {
        super();
        this.clearForm();
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.clientId = routeParams.id;
                this.getClientById();
                this.isToUploadFiles = true;
                this.removeFiles = true;
            }
        })
    }
    getContractTemplates() {
        this.loadingInProgress = true;
        let kycHistoryModel = new TradeTemplateModel();
        kycHistoryModel.isArchived = false;
        this.BillingDashboardService.getTradeTemplates(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.templatesList = responseData.data;
                }
            });
    }
    ngOnInit() {
        super.ngOnInit();
        this.getTradeTemplateTypes();
        this.getCounterPartySettings();
        this.getContractTemplates();
        this.getTemplateTypes();
        this.getSoftLabels();
    }

    getTradeTemplateTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.BillingDashboardService.getTemplateTypes(templateConfig)
            .subscribe((responseData: any) => {
                this.templateTypes = responseData.data;
            });
    }

    getClientById() {
        var searchModel = new ClientSearchInputModel();
        searchModel.clientId = this.clientId;
        this.BillingDashboardService.getClients(searchModel).subscribe((response: any) => {
            if (response.success) {
                if (response.data.length > 0) {
                    this.clientModel = response.data[0];
                } else {
                    this.clientModel = null;
                }
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.cdRef.markForCheck();
        }
    }

    enableTreeStructure() {
        this.isTreeStructure = !this.isTreeStructure;
        this.cdRef.detectChanges();
    }

    emailSelect() {
        this.isEmail = true;
        this.isEmailTemplate = false;
        this.removeFiles = true;
        this.isContractTemplate = false;
        this.isTradeTemplate = false;
        this.isInvoiceTemplate = false;
        this.isKycTemplateSelect = false;
    }

    emailTemplateSelect() {
        this.isEmail = false;
        this.removeFiles = false;
        this.isEmailTemplate = true;
        this.isContractTemplate = false;
        this.isTradeTemplate = false;
        this.isInvoiceTemplate = false;
        this.isKycTemplateSelect = false;
    }

    contractTemplatesSelect() {
        this.isEmail = false;
        this.removeFiles = false;
        this.isEmailTemplate = false;
        this.isContractTemplate = true;
        this.isTradeTemplate = false;
        this.isInvoiceTemplate = false;
        this.isKycTemplateSelect = false;
    }

    documentTemplateSelect() {
        this.isEmail = false;
        this.removeFiles = false;
        this.isEmailTemplate = false;
        this.isContractTemplate = false;
        this.isTradeTemplate = true;
        this.isInvoiceTemplate = false;
        this.isKycTemplateSelect = false;
        this.cdRef.detectChanges();
    }

    getTemplateTypeName(template) {
        this.templateName = template.templateTypeName + ' ' + 'Template';
        return this.templateName;
    }

    getKeyName(template) {
        this.keyName = template.templateTypeName + 'Template';
        return this.keyName;
    }

    invoiceTemplatesSelect() {
        this.isEmail = false;
        this.removeFiles = false;
        this.isEmailTemplate = false;
        this.isContractTemplate = false;
        this.isTradeTemplate = false;
        this.isInvoiceTemplate = true;
        this.isKycTemplateSelect = false;
        this.getCounterPartySettings();
    }

    kycConfigurationTemplateSelect() {
        this.isEmail = false;
        this.removeFiles = false;
        this.isEmailTemplate = false;
        this.isContractTemplate = false;
        this.isTradeTemplate = false;
        this.isInvoiceTemplate = false;
        this.isKycTemplateSelect = true;
        this.getCounterPartySettings();
    }

    removeToMailId(toMail) {
        const index = this.toMailsList.indexOf(toMail);
        if (index >= 0) {
            this.toMailsList.splice(index, 1);
        }
        if (this.toMailsList.length === 0) {
            this.count = 0;
        }
    }


    addToMailIds(event: MatChipInputEvent) {
        const inputTags = event.input;
        const userStoryTags = event.value.trim();
        if (userStoryTags != null && userStoryTags != "") {
            let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            if (regexpEmail.test(userStoryTags)) {
                this.toMailsList.push(userStoryTags);
                this.count++;
            } else {
                this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
            }
        }
        if (inputTags) {
            inputTags.value = " ";
        }
    }

    saveSettings(key) {
        this.loadingInProgress = true;
        let counterPartySettingsModel = new CounterPartySettingsModel();
        if (key == 'KYCSubmissionEmails') {
            counterPartySettingsModel.counterPartysettingsName = "KYC submission emails";
            counterPartySettingsModel.key = "KYCSubmissionEmails";
            counterPartySettingsModel.value = this.toMailsList.toString();
            counterPartySettingsModel.description = this.description;
        }
        else if (key == 'KYCDuration') {
            counterPartySettingsModel.counterPartysettingsName = "KYC Duaration";
            counterPartySettingsModel.key = "KYCDuration";
            counterPartySettingsModel.value = this.kycForm.controls['settingValue'].value;
            counterPartySettingsModel.description = this.kycForm.controls['description'].value;
        }
        else if (key == 'InvoiceTemplate') {
            counterPartySettingsModel.counterPartysettingsName = "KYC Duaration";
            counterPartySettingsModel.key = "InvoiceTemplate";
            counterPartySettingsModel.value = this.invoiceTemplateId;
            counterPartySettingsModel.description = this.invoiceTemplateDescription;
        }
        counterPartySettingsModel.clientId = this.clientId;
        counterPartySettingsModel.timeStamp = this.counterPartySettings.find((x) => x.key == key)?.timeStamp;
        counterPartySettingsModel.counterPartySettingsId = this.counterPartySettings.find((x) => x.key == key)?.counterPartySettingsId;
        counterPartySettingsModel.isArchived = false;
        counterPartySettingsModel.isVisible = true;
        this.BillingDashboardService.UpsertCounterPartyDetails(counterPartySettingsModel).subscribe((result: any) => {
            if (result.success) {
                this.loadingInProgress = false;
                this.getCounterPartySettings();
                this.toastr.success("", "Saved successfully");
            } else {
                this.loadingInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    getCounterPartySettings() {
        this.loadingInProgress = true;
        let counterPartySettingsModel = new CounterPartySettingsModel();
        counterPartySettingsModel.isArchived = false;
        counterPartySettingsModel.isVisible = true;
        counterPartySettingsModel.clientId = this.clientId;
        counterPartySettingsModel.timeStamp = this.timeStamp;
        this.BillingDashboardService.getCounterPartySettings(counterPartySettingsModel).subscribe((result: any) => {
            if (result.success) {
                this.loadingInProgress = false;
                this.counterPartySettings = result.data;
                if (result.data && result.data.length > 0) {
                    result.data.forEach(element => {
                        if (element.key == 'KYCSubmissionEmails') {
                            this.toMailsList = element.value.split(',');
                            this.tempToMailsList = element.value.split(',');
                            this.description = element.description;
                            this.counterPartySettingsId = element.counterPartySettingsId;
                            this.timeStamp = element.timeStamp;
                            this.count = this.toMailsList.length;
                        }
                        if (element.key == 'KYCDuration') {
                            this.kycForm.controls['settingValue'].setValue(element.value);
                            this.kycForm.controls['description'].setValue(element.description);
                        }
                        if (element.key == 'InvoiceTemplate') {
                            this.invoiceTemplateId = element.value;
                            this.invoiceTemplateDescription = element.description;
                        }
                    });
                }
            } else {
                this.loadingInProgress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    resetEmails() {
        this.counterPartySettings.forEach((x) => {
            if (x.key == 'KYCSubmissionEmails') {
                this.description = x.description;
                this.toMailsList = x.value.split(',');
            }
        })
        this.count = this.toMailsList.length;
    }

    clearForm() {
        this.kycForm = new FormGroup({
            settingValue: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(1),
                    Validators.max(730)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    resetKyc() {
        this.counterPartySettings.forEach((x) => {
            if (x.key == 'KYCDuration') {
                this.kycForm.controls['settingValue'].setValue(x.value);
                this.kycForm.controls['description'].setValue(x.description);
            }
        })
    }

    getTemplateTypes() {
        let templateConfig = new TemplateConfigModel();
        templateConfig.isArchived = false;
        this.BillingDashboardService.getTemplateTypes(templateConfig)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.templateTypes = responseData.data;
                    this.getFilteredList();
                }
                else {
                    this.templateTypeId = [];
                }
            });
    }

    getFilteredList() {
        let templateTypes = this.templateTypes;
        let filteredList = _.filter(templateTypes, function (filter) {
            return filter.templateTypeName.toLowerCase().includes("Invoice".toLowerCase())
        })
        if (filteredList.length > 0) {
            this.templateTypeId = filteredList.map(x => x.templateTypeId);
        } else {
            this.templateTypeId = [];
        }
        this.cdRef.detectChanges();
    }

    goToClients() {
        window.history.go(-1)
        //this.router.navigate(['lives/clients']);
      }
}