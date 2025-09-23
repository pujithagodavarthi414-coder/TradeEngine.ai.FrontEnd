import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AppBaseComponent } from "../componentbase";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { CounterPartySettingsModel } from "../../models/counterparty-settings.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { LocalStorageProperties } from "../../constants/localstorage-properties";
import { CookieService } from "ngx-cookie-service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-counter-party-settings",
    templateUrl: "counter-party-settings.component.html",
})
export class CounterPartySettingsComponent extends AppBaseComponent implements OnInit {
    isEmail: boolean = true;
    isEmailTemplate: boolean = false;
    toMailsList: string[] = [];
    tempToMailsList: string[] = [];
    selectable: boolean = true;
    removable = true;
    count = 0;
    toMail: string;
    loadingInProgress: boolean = false;
    kycLoadingInProgress: boolean = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    counterPartySettingsId: string;
    timeStamp: any;
    description: string;
    softLabels: SoftLabelConfigurationModel[];
    userModel: any;
    kycForm: FormGroup;
    counterPartySettings: CounterPartySettingsModel[] = [];
    clientId: string;
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
            }
        })
    }

    ngOnInit() {
        this.getCounterPartySettings();
        this.getSoftLabels();
        super.ngOnInit();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.cdRef.markForCheck();
        }
    }

    emailSelect() {
        this.isEmail = true;
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
}