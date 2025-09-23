import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PayRollCalculationConfigurationsModel } from '../models/payrollcalculationconfigurationsmodel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import * as moment_ from 'moment';
const moment = moment_;
import { PayRollManagementState } from '../store/reducers/index';
@Component({
    selector: 'app-payrollcalculationconfigurations',
    templateUrl: `payrollcalculationconfigurations.component.html`
})

export class PayRollCalculationConfigurationsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertPayRollCalculationConfigurationsPopUp") upsertPayRollCalculationConfigurationsPopover;
    @ViewChildren("deletePayRollCalculationConfigurationsPopUp") deletePayRollCalculationConfigurationsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    payRollCalculationConfigurations: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    payRollCalculationConfigurationsName: string;
    timeStamp: any;
    searchText: string;
    payRollCalculationConfigurationsForm: FormGroup;
    payRollCalculationConfigurationsModel: PayRollCalculationConfigurationsModel;
    isPayRollCalculationConfigurationsArchived: boolean = false;
    isVariablePay: boolean;
    branchId: string;
    isArchivedTypes: boolean = false;
    periodTypeId: string;
    company: string;
    payRollCalculationConfigurationsId: string;
    branchList$: Observable<Branch[]>;
    periodTypes: any;
    payRollCalculationTypes: any;
    payRollCalculationTypeId: string;
    minDate = new Date(1753, 0, 1);
    activeFrom: Date;
    activeTo: Date;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllBranches();
        this.getAllPeriodTypes();
        this.getAllPayRollCalculationTypes();
        this.getAllPayRollCalculationConfigurations();
        
    }

    constructor(private store: Store<PayRollManagementState>, private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }


    getAllPayRollCalculationConfigurations() {
        this.isAnyOperationIsInprogress = true;
        var payRollCalculationConfigurationsModel = new PayRollCalculationConfigurationsModel();
        payRollCalculationConfigurationsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollCalculationConfigurations(payRollCalculationConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.company = response.data;
                this.temp = this.company;
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

    
    getAllPeriodTypes() {
        this.isAnyOperationIsInprogress = true;
        var periodTypeModel = new PayRollTemplateModel();
        periodTypeModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPeriodTypes(periodTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.periodTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    
    getAllPayRollCalculationTypes() {
        this.isAnyOperationIsInprogress = true;
        var payRollTemplateModel = new PayRollTemplateModel();
        payRollTemplateModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllPayRollCalculationTypes(payRollTemplateModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollCalculationTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
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
        this.payRollCalculationConfigurationsId = null;
        this.payRollCalculationConfigurationsName = null;
        this.branchId = null;
        this.periodTypeId = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isVariablePay = null;
        this.isAnyOperationIsInprogress = false;
        this.payRollCalculationConfigurationsForm = new FormGroup({
            branchId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            periodTypeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            payRollCalculationTypeId: new FormControl(null,
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

        const temp = this.temp.filter(payRollCalculationConfigurationss =>
            (payRollCalculationConfigurationss.branchName == null ? null : payRollCalculationConfigurationss.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollCalculationConfigurationss.periodTypeName == null ? null : payRollCalculationConfigurationss.periodTypeName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollCalculationConfigurationss.payRollCalculationTypeName == null ? null : payRollCalculationConfigurationss.payRollCalculationTypeName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollCalculationConfigurationss.activeFrom == null? null : moment(payRollCalculationConfigurationss.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (payRollCalculationConfigurationss.activeTo == null ? null : moment(payRollCalculationConfigurationss.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)          
            );

        this.company = temp;
    }

    editPayRollCalculationConfigurationsPopupOpen(row, upsertPayRollCalculationConfigurationsPopUp) {
        this.payRollCalculationConfigurationsForm.patchValue(row);
        this.payRollCalculationConfigurationsId = row.payRollCalculationConfigurationsId;
        this.timeStamp = row.timeStamp;
        this.payRollCalculationConfigurations = 'PAYROLLCALCULATIONCONFIGURATIONS.EDITPAYROLLCALCULATIONCONFIGURATIONS';
        upsertPayRollCalculationConfigurationsPopUp.openPopover();
    }


    closeUpsertPayRollCalculationConfigurationsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertPayRollCalculationConfigurationsPopover.forEach((p) => p.closePopover());
    }

    createPayRollCalculationConfigurationsPopupOpen(upsertPayRollCalculationConfigurationsPopUp) {
        this.clearForm();
        upsertPayRollCalculationConfigurationsPopUp.openPopover();
        this.payRollCalculationConfigurations = 'PAYROLLCALCULATIONCONFIGURATIONS.ADDPAYROLLCALCULATIONCONFIGURATIONS';
    }

    upsertPayRollCalculationConfigurations(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.payRollCalculationConfigurationsModel = this.payRollCalculationConfigurationsForm.value;
        if (this.payRollCalculationConfigurationsId) {
            this.payRollCalculationConfigurationsModel.payRollCalculationConfigurationsId = this.payRollCalculationConfigurationsId;
            this.payRollCalculationConfigurationsModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertPayRollCalculationConfigurations(this.payRollCalculationConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertPayRollCalculationConfigurationsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllPayRollCalculationConfigurations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deletePayRollCalculationConfigurationsPopUpOpen(row, deletePayRollCalculationConfigurationsPopUp) {
        this.payRollCalculationConfigurationsId = row.payRollCalculationConfigurationsId;
        this.branchId = row.branchId;
        this.periodTypeId = row.periodTypeId;
        this.payRollCalculationTypeId = row.payRollCalculationTypeId;
        this.isVariablePay = row.isVariablePay;
        this.activeFrom = row.activeFrom;
        this.activeTo = row.activeTo;
        this.timeStamp = row.timeStamp;
        this.isPayRollCalculationConfigurationsArchived = !this.isArchivedTypes;
        deletePayRollCalculationConfigurationsPopUp.openPopover();
    }

    deletePayRollCalculationConfigurations() {
        this.isAnyOperationIsInprogress = true;
        this.payRollCalculationConfigurationsModel = new PayRollCalculationConfigurationsModel();
        this.payRollCalculationConfigurationsModel.payRollCalculationConfigurationsId = this.payRollCalculationConfigurationsId;
        this.payRollCalculationConfigurationsModel.branchId = this.branchId;
        this.payRollCalculationConfigurationsModel.periodTypeId = this.periodTypeId;
        this.payRollCalculationConfigurationsModel.payRollCalculationTypeId = this.payRollCalculationTypeId;
        this.payRollCalculationConfigurationsModel.timeStamp = this.timeStamp;
        this.payRollCalculationConfigurationsModel.activeFrom = this.activeFrom;
        this.payRollCalculationConfigurationsModel.activeTo = this.activeTo;
        this.payRollCalculationConfigurationsModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertPayRollCalculationConfigurations(this.payRollCalculationConfigurationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletePayRollCalculationConfigurationsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllPayRollCalculationConfigurations();
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


    closeDeletePayRollCalculationConfigurationsDialog() {
        this.clearForm();
        this.deletePayRollCalculationConfigurationsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
} 