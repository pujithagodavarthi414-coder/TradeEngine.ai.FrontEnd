import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { PayRollService } from '../services/PayRollService'
import { PayRollRoleConfigurationModel } from '../models/payrollroleconfigurationmodel';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-payrollroleconfiguration',
    templateUrl: `payrollroleconfiguration.component.html`
})

export class PayRollRoleConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollRoleConfigurationPopUp") upsertPayRollRoleConfigurationPopover;
    @ViewChildren("deletePayRollRoleConfigurationPopUp") deletePayRollRoleConfigurationPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollRoleConfiguration: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollRoleConfigurationName: string;
    timeStamp: any;
    searchText: string;
    payRollRoleConfigurationForm: FormGroup;
    payRollRoleConfigurationModel: PayRollRoleConfigurationModel;
    isPayRollRoleConfigurationArchived: boolean = false;
    payRollTemplateId: string;
    isArchivedTypes: boolean = false;
    roleId: string;
    payRollRoleConfigurations: string;
    payRollRoleConfigurationId: string;
    activeTo: Date;
    employerContributionPercentage: number;
    payRollTemplates: PayRollTemplateModel[];
    rolesDropDown: any[];

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayRollRoleConfigurations();
        this.getAllPayRollTemplates();
        this.getAllRoles();
        
    }

    constructor(private payRollService: PayRollService,private cdRef: ChangeDetectorRef,
        private toastr: ToastrService) { super() }


    getAllPayRollRoleConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollRoleConfigurationModel = new PayRollRoleConfigurationModel();
        payRollRoleConfigurationModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollRoleConfigurations(payRollRoleConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollRoleConfigurations = response.data;
                this.temp = this.payRollRoleConfigurations;
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

    getAllRoles() {
        this.payRollService
          .getAllRoles()
          .subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
          });
      }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.payRollRoleConfigurationId = null;
        this.payRollTemplateId = null;
        this.roleId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollRoleConfigurationForm = new FormGroup({
            payRollTemplateId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            roleId: new FormControl(null,
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

         const temp = this.temp.filter(payRollRoleConfigurations => 
               (payRollRoleConfigurations.payRollTemplateName == null ? null : payRollRoleConfigurations.payRollTemplateName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollRoleConfigurations.roleName == null ? null : payRollRoleConfigurations.roleName.toString().toLowerCase().indexOf(this.searchText) > -1)
              );

              this.payRollRoleConfigurations = temp;
    }

    editPayRollRoleConfigurationPopupOpen(row, upsertPayRollRoleConfigurationPopUp) {
        this.payRollRoleConfigurationForm.patchValue(row);
        this.payRollRoleConfigurationId = row.payRollRoleConfigurationId;
        this.timeStamp = row.timeStamp;
        this.payRollRoleConfiguration = 'PAYROLLROLECONFIGURATION.EDITPAYROLLROLECONFIGURATION';
        upsertPayRollRoleConfigurationPopUp.openPopover();
    }


    closeUpsertPayRollRoleConfigurationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollRoleConfigurationPopover.forEach((p) => p.closePopover());
    }

    createPayRollRoleConfigurationPopupOpen(upsertPayRollRoleConfigurationPopUp) {
        this.clearForm();
        upsertPayRollRoleConfigurationPopUp.openPopover();
        this.payRollRoleConfiguration = 'PAYROLLROLECONFIGURATION.ADDPAYROLLROLECONFIGURATION';
    }

    upsertPayRollRoleConfiguration(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollRoleConfigurationModel = this.payRollRoleConfigurationForm.value;
        if (this.payRollRoleConfigurationId) {
            this.payRollRoleConfigurationModel.payRollRoleConfigurationId = this.payRollRoleConfigurationId;
            this.payRollRoleConfigurationModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertPayRollRoleConfiguration(this.payRollRoleConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayRollRoleConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayRollRoleConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }
    deletePayRollRoleConfigurationPopUpOpen(row, deletePayRollRoleConfigurationPopUp) {
        this.payRollRoleConfigurationId = row.payRollRoleConfigurationId;
        this.payRollTemplateId = row.payRollTemplateId;
        this.roleId = row.roleId;
        this.timeStamp = row.timeStamp;
        this.employerContributionPercentage = row.employerContributionPercentage;
        this.isPayRollRoleConfigurationArchived = !this.isArchivedTypes;
        deletePayRollRoleConfigurationPopUp.openPopover();
    }

    deletePayRollRoleConfiguration() {
        this.isAnyOperationIsInprogress = true;
        this.payRollRoleConfigurationModel = new PayRollRoleConfigurationModel();
        this.payRollRoleConfigurationModel.payRollRoleConfigurationId = this.payRollRoleConfigurationId;
        this.payRollRoleConfigurationModel.payRollTemplateId = this.payRollTemplateId;
        this.payRollRoleConfigurationModel.roleId = this.roleId;
        this.payRollRoleConfigurationModel.timeStamp = this.timeStamp;
        this.payRollRoleConfigurationModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollRoleConfiguration(this.payRollRoleConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollRoleConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollRoleConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }


    closeDeletePayRollRoleConfigurationDialog() {
        this.clearForm();
        this.deletePayRollRoleConfigurationPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 