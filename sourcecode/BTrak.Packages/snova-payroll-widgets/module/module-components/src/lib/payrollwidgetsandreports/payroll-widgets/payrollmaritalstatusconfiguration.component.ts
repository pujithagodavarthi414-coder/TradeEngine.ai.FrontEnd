import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { PayRollService } from '../services/PayRollService'
import { PayRollMaritalStatusConfigurationModel } from '../models/payrollmaritalstatusconfigurationmodel';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { ToastrService } from 'ngx-toastr';
import { MaritalStatusesSearchModel } from '../models/marital-statuses-search-model';

@Component({
    selector: 'app-payrollmaritalstatusconfiguration',
    templateUrl: `payrollmaritalstatusconfiguration.component.html`
})

export class PayRollMaritalStatusConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollMaritalStatusConfigurationPopUp") upsertPayRollMaritalStatusConfigurationPopover;
    @ViewChildren("deletePayRollMaritalStatusConfigurationPopUp") deletePayRollMaritalStatusConfigurationPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollMaritalStatusConfiguration: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollMaritalStatusConfigurationName: string;
    timeStamp: any;
    searchText: string;
    payRollMaritalStatusConfigurationForm: FormGroup;
    payRollMaritalStatusConfigurationModel: PayRollMaritalStatusConfigurationModel;
    isPayRollMaritalStatusConfigurationArchived: boolean = false;
    payRollTemplateId: string;
    isArchivedTypes: boolean = false;
    maritalStatusId: string;
    payRollMaritalStatusConfigurations: string;
    payRollMaritalStatusConfigurationId: string;
    employerContributionPercentage: number;
    payRollTemplates: PayRollTemplateModel[];
    maritalStatusesList: any;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayRollMaritalStatusConfigurations();
        this.getAllPayRollTemplates();
        this.getAllMaritalStatuses();
        
    }

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService) { super() }


    getAllPayRollMaritalStatusConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollMaritalStatusConfigurationModel = new PayRollMaritalStatusConfigurationModel();
        payRollMaritalStatusConfigurationModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollMaritalStatusConfigurations(payRollMaritalStatusConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollMaritalStatusConfigurations = response.data;
                this.temp = this.payRollMaritalStatusConfigurations;
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

    getAllPayRollTemplates() {
        var payRollTemplateModel = new PayRollTemplateModel();
        payRollTemplateModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollTemplates = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);

            }
        });
    }

    getAllMaritalStatuses() {
        const maritalStatusesSearchModel = new MaritalStatusesSearchModel();
        maritalStatusesSearchModel.isArchived = false;
        this.payRollService.getMaritalStatuses(maritalStatusesSearchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.maritalStatusesList = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);

            }
        });
    }
    

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.payRollMaritalStatusConfigurationId = null;
        this.payRollTemplateId = null;
        this.maritalStatusId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollMaritalStatusConfigurationForm = new FormGroup({
            payRollTemplateId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            maritalStatusId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            )
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

        const temp = this.temp.filter(payRollMaritalStatusConfigurations => 
               (payRollMaritalStatusConfigurations.payRollTemplateName == null ? null : payRollMaritalStatusConfigurations.payRollTemplateName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollMaritalStatusConfigurations.maritalStatusName == null ? null : payRollMaritalStatusConfigurations.maritalStatusName.toString().toLowerCase().indexOf(this.searchText) > -1)
              );

              this.payRollMaritalStatusConfigurations = temp;
    }

    editPayRollMaritalStatusConfigurationPopupOpen(row, upsertPayRollMaritalStatusConfigurationPopUp) {
        this.payRollMaritalStatusConfigurationForm.patchValue(row);
        this.payRollMaritalStatusConfigurationId = row.payRollMaritalStatusConfigurationId;
        this.timeStamp = row.timeStamp;
        this.payRollMaritalStatusConfiguration = 'PAYROLLMARITALSTATUSCONFIGURATION.EDITPAYROLLMARITALSTATUSCONFIGURATION';
        upsertPayRollMaritalStatusConfigurationPopUp.openPopover();
    }


    closeUpsertPayRollMaritalStatusConfigurationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollMaritalStatusConfigurationPopover.forEach((p) => p.closePopover());
    }

    createPayRollMaritalStatusConfigurationPopupOpen(upsertPayRollMaritalStatusConfigurationPopUp) {
        this.clearForm();
        upsertPayRollMaritalStatusConfigurationPopUp.openPopover();
        this.payRollMaritalStatusConfiguration = 'PAYROLLMARITALSTATUSCONFIGURATION.ADDPAYROLLMARITALSTATUSCONFIGURATION';
    }

    upsertPayRollMaritalStatusConfiguration(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollMaritalStatusConfigurationModel = this.payRollMaritalStatusConfigurationForm.value;
        if (this.payRollMaritalStatusConfigurationId) {
            this.payRollMaritalStatusConfigurationModel.payRollMaritalStatusConfigurationId = this.payRollMaritalStatusConfigurationId;
            this.payRollMaritalStatusConfigurationModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertPayRollMaritalStatusConfiguration(this.payRollMaritalStatusConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayRollMaritalStatusConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayRollMaritalStatusConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }
    deletePayRollMaritalStatusConfigurationPopUpOpen(row, deletePayRollMaritalStatusConfigurationPopUp) {
        this.payRollMaritalStatusConfigurationId = row.payRollMaritalStatusConfigurationId;
        this.payRollTemplateId = row.payRollTemplateId;
        this.maritalStatusId = row.maritalStatusId;
        this.timeStamp = row.timeStamp;
        this.employerContributionPercentage = row.employerContributionPercentage;
        this.isPayRollMaritalStatusConfigurationArchived = !this.isArchivedTypes;
        deletePayRollMaritalStatusConfigurationPopUp.openPopover();
    }

    deletePayRollMaritalStatusConfiguration() {
        this.isAnyOperationIsInprogress = true;
        this.payRollMaritalStatusConfigurationModel = new PayRollMaritalStatusConfigurationModel();
        this.payRollMaritalStatusConfigurationModel.payRollMaritalStatusConfigurationId = this.payRollMaritalStatusConfigurationId;
        this.payRollMaritalStatusConfigurationModel.payRollTemplateId = this.payRollTemplateId;
        this.payRollMaritalStatusConfigurationModel.maritalStatusId = this.maritalStatusId;
        this.payRollMaritalStatusConfigurationModel.timeStamp = this.timeStamp;
        this.payRollMaritalStatusConfigurationModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollMaritalStatusConfiguration(this.payRollMaritalStatusConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollMaritalStatusConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollMaritalStatusConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }


    closeDeletePayRollMaritalStatusConfigurationDialog() {
        this.clearForm();
        this.deletePayRollMaritalStatusConfigurationPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 