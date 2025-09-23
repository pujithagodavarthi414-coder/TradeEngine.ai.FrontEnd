import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PayRollBranchConfigurationModel } from '../models/payrollbranchconfigurationmodel';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { ToastrService } from 'ngx-toastr';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollManagementState } from '../store/reducers/index';
import { PayRollService } from '../services/PayRollService';

@Component({
    selector: 'app-payrollbranchconfiguration',
    templateUrl: `payrollbranchconfiguration.component.html`
})

export class PayRollBranchConfigurationComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollBranchConfigurationPopUp") upsertPayRollBranchConfigurationPopover;
    @ViewChildren("deletePayRollBranchConfigurationPopUp") deletePayRollBranchConfigurationPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollBranchConfiguration: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollBranchConfigurationName: string;
    timeStamp: any;
    searchText: string;
    payRollBranchConfigurationForm: FormGroup;
    payRollBranchConfigurationModel: PayRollBranchConfigurationModel;
    isPayRollBranchConfigurationArchived: boolean = false;
    payRollTemplateId: string;
    isArchivedTypes: boolean = false;
    branchId: string;
    payRollBranchConfigurations: string;
    payRollBranchConfigurationId: string;
    employerContributionPercentage: number;
    payRollTemplates: PayRollTemplateModel[];
    rolesDropDown: any[];
    branchList$: Observable<Branch[]>;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllPayRollBranchConfigurations();
        this.getAllPayRollTemplates();
        this.getAllBranches();
        
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService) { super() }


    getAllPayRollBranchConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollBranchConfigurationModel = new PayRollBranchConfigurationModel();
        payRollBranchConfigurationModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollBranchConfigurations(payRollBranchConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollBranchConfigurations = response.data;
                this.temp = this.payRollBranchConfigurations;
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

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
      }
    

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.payRollBranchConfigurationId = null;
        this.payRollTemplateId = null;
        this.branchId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollBranchConfigurationForm = new FormGroup({
            payRollTemplateId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            branchId: new FormControl(null,
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

        const temp = this.temp.filter(payRollBranchConfigurations => 
               (payRollBranchConfigurations.payRollTemplateName == null ? null : payRollBranchConfigurations.payRollTemplateName.toString().toLowerCase().indexOf(this.searchText) > -1)
               || (payRollBranchConfigurations.branchName == null ? null : payRollBranchConfigurations.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
              );

              this.payRollBranchConfigurations = temp;
    }

    editPayRollBranchConfigurationPopupOpen(row, upsertPayRollBranchConfigurationPopUp) {
        this.payRollBranchConfigurationForm.patchValue(row);
        this.payRollBranchConfigurationId = row.payRollBranchConfigurationId;
        this.timeStamp = row.timeStamp;
        this.payRollBranchConfiguration = 'PAYROLLBRANCHCONFIGURATION.EDITPAYROLLBRANCHCONFIGURATION';
        upsertPayRollBranchConfigurationPopUp.openPopover();
    }


    closeUpsertPayRollBranchConfigurationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollBranchConfigurationPopover.forEach((p) => p.closePopover());
    }

    createPayRollBranchConfigurationPopupOpen(upsertPayRollBranchConfigurationPopUp) {
        this.clearForm();
        upsertPayRollBranchConfigurationPopUp.openPopover();
        this.payRollBranchConfiguration = 'PAYROLLBRANCHCONFIGURATION.ADDPAYROLLBRANCHCONFIGURATION';
    }

    upsertPayRollBranchConfiguration(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollBranchConfigurationModel = this.payRollBranchConfigurationForm.value;
        if (this.payRollBranchConfigurationId) {
            this.payRollBranchConfigurationModel.payRollBranchConfigurationId = this.payRollBranchConfigurationId;
            this.payRollBranchConfigurationModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertPayRollBranchConfiguration(this.payRollBranchConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayRollBranchConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayRollBranchConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }
    deletePayRollBranchConfigurationPopUpOpen(row, deletePayRollBranchConfigurationPopUp) {
        this.payRollBranchConfigurationId = row.payRollBranchConfigurationId;
        this.payRollTemplateId = row.payRollTemplateId;
        this.branchId = row.branchId;
        this.timeStamp = row.timeStamp;
        this.employerContributionPercentage = row.employerContributionPercentage;
        this.isPayRollBranchConfigurationArchived = !this.isArchivedTypes;
        deletePayRollBranchConfigurationPopUp.openPopover();
    }

    deletePayRollBranchConfiguration() {
        this.isAnyOperationIsInprogress = true;
        this.payRollBranchConfigurationModel = new PayRollBranchConfigurationModel();
        this.payRollBranchConfigurationModel.payRollBranchConfigurationId = this.payRollBranchConfigurationId;
        this.payRollBranchConfigurationModel.payRollTemplateId = this.payRollTemplateId;
        this.payRollBranchConfigurationModel.branchId = this.branchId;
        this.payRollBranchConfigurationModel.timeStamp = this.timeStamp;
        this.payRollBranchConfigurationModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollBranchConfiguration(this.payRollBranchConfigurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollBranchConfigurationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollBranchConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toastr.error("", this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }


    closeDeletePayRollBranchConfigurationDialog() {
        this.clearForm();
        this.deletePayRollBranchConfigurationPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 