import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { CountryModel } from '../../models/hr-models/country-model';
import { CurrencyModel } from '../../models/hr-models/currency-model';
import { NumberFormatModel } from '../../models/number-format-model';
import { TimeZoneModel } from '../../models/hr-models/time-zone';
import { DateFormatModel } from '../../models/date-format-model';
import { TimeFormatModel } from '../../models/time-format-model';
import { MainUseCaseModel } from '../../models/mainUseCaseModel';
import { RolesModel } from '../../models/hr-models/role-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { CompanyregistrationService } from '../../services/company-registration.service';
import { CustomFormsComponent } from '@thetradeengineorg1/snova-custom-fields';
import { MatDialog } from '@angular/material/dialog';
import "../../../globaldependencies/helpers/fontawesome-icons";

@Component({
    selector: "app-fm-component-company-details",
    templateUrl: "company-details.component.html",
})

export class CompanyDetailsComponent{
    configurationForm: FormGroup;
    companyRegistrationModel = new CompanyRegistrationModel();
    isThereAnError: boolean = false;
    validationMessage: string;
    countries: CountryModel[];
    isArchived: boolean = false;
    currencies: CurrencyModel[];
    numberFormats: NumberFormatModel[];
    timezones: TimeZoneModel[];
    dateFormats: DateFormatModel[];
    timeFormats: TimeFormatModel[];
    mainUseCases: MainUseCaseModel[];
    roles: RolesModel[];
    isAnyOperationInProgress: boolean;
    registrationForm: FormGroup;
    timestamp: any;
    isreload: string;
    moduleTypeId = 9;
    referenceId = ConstantVariables.CompanyStructureReferenceTypeId;

    constructor(private translateService: TranslateService, private CompanyRegistration: CompanyregistrationService , private dialog: MatDialog) {
        this.clearForm();
        this.getRoles();
        this.getMainUseCases();
        this.getCountries();
        this.getCurrencies();
        this.getNumberformat();
        this.getdateFormats();
        this.getTimeFormats();
        this.getTimezone();
        this.getCompanyDetails();
    }


    getCountries() {
        var companymodel = new CompanyRegistrationModel();
        companymodel.isArchived = false;
        this.CompanyRegistration.getCountries(companymodel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    clearForm() {
        this.registrationForm = new FormGroup({
            companyName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            mainUseCaseId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            teamSize: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(9999999999999999999999999),
                ])
            ),

            phoneNumber: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(15)
                ])
            ),

            countryId: new FormControl(null,
                Validators.compose([
                ])
            ),

            currencyId: new FormControl(null,
                Validators.compose([
                ])
            ),

            numberFormatId: new FormControl(null,
                Validators.compose([
                ])
            ),

            timeZoneId: new FormControl(null,
                Validators.compose([
                ])
            ),

            dateFormatId: new FormControl(null,
                Validators.compose([
                ])
            ),

            timeFormatId: new FormControl(null,
                Validators.compose([
                ])
            )
        })
    }

    getCurrencies() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getCurrencies(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencies = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getNumberformat() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getNumberformat(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.numberFormats = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getTimezone() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getTimeZones(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timezones = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getdateFormats() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getdateFormats(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.dateFormats = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getTimeFormats() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getTimeFormats(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeFormats = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getMainUseCases() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getMainUseCases(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.mainUseCases = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getRoles() {
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.CompanyRegistration.getRoles(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.roles = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    upsertCompanyDetails(){
       this.isAnyOperationInProgress = true;
       this.companyRegistrationModel = this.registrationForm.value;
       this.companyRegistrationModel.timeStamp = this.timestamp;
       this.CompanyRegistration.upsertCompanyDetails(this.companyRegistrationModel).subscribe((response: any) => {
        if (response.success == true) {
            this.isAnyOperationInProgress = false;
            this.validationMessage = null;
            this.getCompanyDetails();
        }
        else {
            this.isThereAnError = true;
            this.validationMessage = response.apiResponseMessages[0].message;
            this.isAnyOperationInProgress = false;
        }
    });
    }

    getCompanyDetails(){
        this.isAnyOperationInProgress = true;
       this.companyRegistrationModel = this.registrationForm.value;
       this.CompanyRegistration.getCompanyDetails().subscribe((response: any) => {
        if (response.success == true) {
            this.isAnyOperationInProgress = false;
            this.timestamp = response.data.timeStamp;
            this.registrationForm.patchValue(response.data);
            this.validationMessage = null;
        }
        else {
            this.isThereAnError = true;
            this.validationMessage = response.apiResponseMessages[0].message;
            this.isAnyOperationInProgress = false;
        }
    });
    }
    
    openCustomForm() {
        const formsDialog = this.dialog.open(CustomFormsComponent, {
            height: "62%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            data: { moduleTypeId: this.moduleTypeId, referenceId: this.referenceId,
                    referenceTypeId: this.referenceId, customFieldComponent: null, isButtonVisible: true },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        formsDialog.componentInstance.closeMatDialog.subscribe((result) => {
            this.dialog.closeAll();
        });

    }
}