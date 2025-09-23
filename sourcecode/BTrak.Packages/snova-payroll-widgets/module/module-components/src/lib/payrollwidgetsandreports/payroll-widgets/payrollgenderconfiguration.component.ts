import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { PayRollService } from '../services/PayRollService'
import { PayRollGenderConfigurationModel } from '../models/payrollgenderconfigurationmodel';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { ToastrService } from 'ngx-toastr';
import { GenderSearchModel } from '../models/gender-search-model';

@Component({
    selector: 'app-payrollgenderconfiguration',
    templateUrl: `payrollgenderconfiguration.component.html`
})

export class PayRollGenderConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollGenderConfigurationPopUp") upsertPayRollGenderConfigurationPopover;
    @ViewChildren("deletePayRollGenderConfigurationPopUp") deletePayRollGenderConfigurationPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollGenderConfiguration: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollGenderConfigurationName: string;
    timeStamp: any;
    searchText: string;
    payRollGenderConfigurationForm: FormGroup;
    payRollGenderConfigurationModel: PayRollGenderConfigurationModel;
    isPayRollGenderConfigurationArchived: boolean = false;
    payRollTemplateId: string;
    isArchivedTypes: boolean = false;
    genderId: string;
    payRollGenderConfigurations: string;
    payRollGenderConfigurationId: string;
    employerContributionPercentage: number;
    payRollTemplates: PayRollTemplateModel[];
    gendersList : any;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayRollGenderConfigurations();
        this.getAllPayRollTemplates();
        this.getAllGenders();
        
    }

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService) { super() }


    getAllPayRollGenderConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollGenderConfigurationModel = new PayRollGenderConfigurationModel();
        payRollGenderConfigurationModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollGenderConfigurations(payRollGenderConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollGenderConfigurations = response.data;
                this.temp = this.payRollGenderConfigurations;
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

      getAllGenders() {
        const genderSearchModel = new GenderSearchModel();
        genderSearchModel.isArchived = false;
        this.payRollService.getGenders(genderSearchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.gendersList = response.data;
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
        this.payRollGenderConfigurationId = null;
        this.payRollTemplateId = null;
        this.genderId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollGenderConfigurationForm = new FormGroup({
            payRollTemplateId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            genderId: new FormControl(null,
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

        const temp = this.temp.filter(payRollGenderConfigurations => 
               (payRollGenderConfigurations.payRollTemplateName == null ? null : payRollGenderConfigurations.payRollTemplateName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollGenderConfigurations.genderName == null ? null : payRollGenderConfigurations.genderName.toString().toLowerCase().indexOf(this.searchText) > -1)
              );

              this.payRollGenderConfigurations = temp;
    }

    editPayRollGenderConfigurationPopupOpen(row, upsertPayRollGenderConfigurationPopUp) {
        this.payRollGenderConfigurationForm.patchValue(row);
        this.payRollGenderConfigurationId = row.payRollGenderConfigurationId;
        this.timeStamp = row.timeStamp;
        this.payRollGenderConfiguration = 'PAYROLLGENDERCONFIGURATION.EDITPAYROLLGENDERCONFIGURATION';
        upsertPayRollGenderConfigurationPopUp.openPopover();
    }


    closeUpsertPayRollGenderConfigurationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollGenderConfigurationPopover.forEach((p) => p.closePopover());
    }

    createPayRollGenderConfigurationPopupOpen(upsertPayRollGenderConfigurationPopUp) {
        this.clearForm();
        upsertPayRollGenderConfigurationPopUp.openPopover();
        this.payRollGenderConfiguration = 'PAYROLLGENDERCONFIGURATION.ADDPAYROLLGENDERCONFIGURATION';
    }

    upsertPayRollGenderConfiguration(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollGenderConfigurationModel = this.payRollGenderConfigurationForm.value;
        if (this.payRollGenderConfigurationId) {
            this.payRollGenderConfigurationModel.payRollGenderConfigurationId = this.payRollGenderConfigurationId;
            this.payRollGenderConfigurationModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertPayRollGenderConfiguration(this.payRollGenderConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayRollGenderConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayRollGenderConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }
    deletePayRollGenderConfigurationPopUpOpen(row, deletePayRollGenderConfigurationPopUp) {
        this.payRollGenderConfigurationId = row.payRollGenderConfigurationId;
        this.payRollTemplateId = row.payRollTemplateId;
        this.genderId = row.genderId;
        this.timeStamp = row.timeStamp;
        this.employerContributionPercentage = row.employerContributionPercentage;
        this.isPayRollGenderConfigurationArchived = !this.isArchivedTypes;
        deletePayRollGenderConfigurationPopUp.openPopover();
    }

    deletePayRollGenderConfiguration() {
        this.isAnyOperationIsInprogress = true;
        this.payRollGenderConfigurationModel = new PayRollGenderConfigurationModel();
        this.payRollGenderConfigurationModel.payRollGenderConfigurationId = this.payRollGenderConfigurationId;
        this.payRollGenderConfigurationModel.payRollTemplateId = this.payRollTemplateId;
        this.payRollGenderConfigurationModel.genderId = this.genderId;
        this.payRollGenderConfigurationModel.timeStamp = this.timeStamp;
        this.payRollGenderConfigurationModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollGenderConfiguration(this.payRollGenderConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollGenderConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollGenderConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;

        });
    }


    closeDeletePayRollGenderConfigurationDialog() {
        this.clearForm();
        this.deletePayRollGenderConfigurationPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 