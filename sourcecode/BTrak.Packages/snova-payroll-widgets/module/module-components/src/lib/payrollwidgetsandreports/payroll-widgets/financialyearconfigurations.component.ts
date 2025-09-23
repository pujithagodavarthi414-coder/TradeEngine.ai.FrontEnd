import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { FinancialYearConfigurationsModel } from '../models/financialyearconfigurationsmodel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import * as moment_ from 'moment';
const moment = moment_;
import { CompanyRegistrationModel } from '../models/company-registration-model';

@Component({
    selector: 'app-financialyearconfigurations',
    templateUrl: `financialyearconfigurations.component.html`
})

export class FinancialYearConfigurationsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertFinancialYearConfigurationsPopUp") upsertFinancialYearConfigurationsPopover;
    @ViewChildren("deleteFinancialYearConfigurationsPopUp") deleteFinancialYearConfigurationsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    financialYearConfigurationsName: string;
    timeStamp: any;
    searchText: string;
    financialYearConfigurationsForm: FormGroup;
    financialYearConfigurationsModel: FinancialYearConfigurationsModel;
    isFinancialYearConfigurationsArchived: boolean = false;
    toMonth: number;
    fromMonth: number;
    isArchivedTypes: boolean = false;
    financialYearConfigurations: FinancialYearConfigurationsModel[];
    financialYearConfigurationsId: string;
    percentage: number;
    financialYearConfigurationsTitle: string;
    countryId: string;
    financialYearTypeId: string;
    financialYearTypes: any;
    minDate = new Date(1753, 0, 1);
    activeFrom: Date;
    activeTo: Date;
    countries: any;
    
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCountries();
        this.getAllFinancialYearTypes();
        this.getAllFinancialYearConfigurations();
        
    }

    constructor(private payRollService: PayRollService,private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }


    getAllFinancialYearConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var financialYearConfigurationsModel = new FinancialYearConfigurationsModel();
        financialYearConfigurationsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllFinancialYearConfigurations(financialYearConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.financialYearConfigurations = response.data;
                this.temp = this.financialYearConfigurations;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }

    getCountries() {
        var companymodel = new CompanyRegistrationModel();
        companymodel.isArchived = false;
        this.payRollService.getCountries(companymodel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getAllFinancialYearTypes() {
        this.isAnyOperationIsInprogress = true;
        var FinancialYearTypeModel = new PayRollTemplateModel();
        FinancialYearTypeModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllFinancialYearTypes(FinancialYearTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.financialYearTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.financialYearConfigurationsId = null;
        this.fromMonth = null;
        this.toMonth = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.toMonth = null;
        this.isAnyOperationIsInprogress = false;
        this.financialYearConfigurationsForm = new FormGroup({
            fromMonth: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            toMonth: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            financialYearTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null,
                Validators.compose([
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(financialYearConfigurations =>
            (financialYearConfigurations.fromMonth == null ? null : this.getMonth(financialYearConfigurations.fromMonth).toString().toLowerCase().indexOf(this.searchText) > -1)
            || (financialYearConfigurations.toMonth == null ? null : this.getMonth(financialYearConfigurations.toMonth).toString().toLowerCase().indexOf(this.searchText) > -1)
            || (financialYearConfigurations.countryName == null ? null : financialYearConfigurations.countryName.toLowerCase().indexOf(this.searchText) > -1)
            || (financialYearConfigurations.financialYearTypeName == null ? null : financialYearConfigurations.financialYearTypeName.toLowerCase().indexOf(this.searchText) > -1)
            || (financialYearConfigurations.activeFrom == null? null : moment(financialYearConfigurations.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (financialYearConfigurations.activeTo == null ? null : moment(financialYearConfigurations.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            );

        this.financialYearConfigurations = temp;
    }

    editFinancialYearConfigurationsPopupOpen(row, upsertFinancialYearConfigurationsPopUp) {
        this.financialYearConfigurationsForm.patchValue(row);
        this.financialYearConfigurationsId = row.financialYearConfigurationsId;
        this.timeStamp = row.timeStamp;
        this.financialYearConfigurationsTitle = 'FINANCIALYEARCONFIGURATIONS.EDITFINANCIALYEARCONFIGURATIONS';
        upsertFinancialYearConfigurationsPopUp.openPopover();
    }


    closeUpsertFinancialYearConfigurationsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertFinancialYearConfigurationsPopover.forEach((p) => p.closePopover());
    }

    createFinancialYearConfigurationsPopupOpen(upsertFinancialYearConfigurationsPopUp) {
        this.clearForm();
        upsertFinancialYearConfigurationsPopUp.openPopover();
        this.financialYearConfigurationsTitle = 'FINANCIALYEARCONFIGURATIONS.ADDFINANCIALYEARCONFIGURATIONS';
    }

    upsertFinancialYearConfigurations(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.financialYearConfigurationsModel = this.financialYearConfigurationsForm.value;
        if (this.financialYearConfigurationsId) {
            this.financialYearConfigurationsModel.financialYearConfigurationsId = this.financialYearConfigurationsId;
            this.financialYearConfigurationsModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertFinancialYearConfigurations(this.financialYearConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertFinancialYearConfigurationsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllFinancialYearConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }

            this.cdRef.detectChanges();
        });
        this.isAnyOperationIsInprogress = false;
    }

    deleteFinancialYearConfigurationsPopUpOpen(row, deleteFinancialYearConfigurationsPopUp) {
        this.financialYearConfigurationsId = row.financialYearConfigurationsId;
        this.fromMonth = row.fromMonth;
        this.countryId = row.countryId;
        this.financialYearTypeId = row.financialYearTypeId;
        this.toMonth = row.toMonth;
        this.activeFrom = row.activeFrom;
        this.activeTo = row.activeTo;
        this.timeStamp = row.timeStamp;
        this.isFinancialYearConfigurationsArchived = !this.isArchivedTypes;
        deleteFinancialYearConfigurationsPopUp.openPopover();
    }

    deleteFinancialYearConfigurations() {
        this.isAnyOperationIsInprogress = true;
        this.financialYearConfigurationsModel = new FinancialYearConfigurationsModel();
        this.financialYearConfigurationsModel.financialYearConfigurationsId = this.financialYearConfigurationsId;
        this.financialYearConfigurationsModel.fromMonth = this.fromMonth;
        this.financialYearConfigurationsModel.toMonth = this.toMonth;
        this.financialYearConfigurationsModel.countryId = this.countryId;
        this.financialYearConfigurationsModel.activeFrom = this.activeFrom;
        this.financialYearConfigurationsModel.activeTo = this.activeTo;
        this.financialYearConfigurationsModel.financialYearTypeId = this.financialYearTypeId;
        this.financialYearConfigurationsModel.timeStamp = this.timeStamp;
        this.financialYearConfigurationsModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertFinancialYearConfigurations(this.financialYearConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteFinancialYearConfigurationsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllFinancialYearConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }


    closeDeleteFinancialYearConfigurationsDialog() {
        this.clearForm();
        this.deleteFinancialYearConfigurationsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    getMonth(monthname: number): String {
        switch (monthname) {
            case 1:
                return 'January';
            case 2:
                return 'February';
            case 3:
                return 'March';
            case 4:
                return 'April';
            case 5:
                return 'May';
            case 6:
                return 'June';
            case 7:
                return 'July';
            case 8:
                return 'August';
            case 9:
                return 'September';
            case 10:
                return 'October';
            case 11:
                return 'November';
            case 12:
                return 'December';
        }
    }
} 