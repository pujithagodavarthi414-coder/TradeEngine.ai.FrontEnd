import { Component, OnInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LeaveEncashmentSettingsModel } from '../models/LeaveEncashmentSettingsModel';
import { PayRollService } from '../services/PayRollService'
import { ToastrService } from 'ngx-toastr';
import { PayRollComponentModel } from '../models/PayRollComponentModel';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { Branch } from '../models/branch';
import * as branchReducer from '../store/reducers/index';
import * as moment_ from 'moment';
const moment = moment_;
import { PayRollManagementState } from '../store/reducers/index';

@Component({
    selector: 'app-leaveEncashmentSettings',
    templateUrl: `leaveEncashmentSettings.component.html`
})

export class LeaveEncashmentSettingsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertLeaveEncashmentSettingsPopUp") upsertLeaveEncashmentSettingsPopover;
    @ViewChildren("deleteLeaveEncashmentSettingsPopUp") deleteLeaveEncashmentSettingsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    leaveEncashmentSettingsName: string;
    timeStamp: any;
    searchText: string;
    leaveEncashmentSettingsForm: FormGroup;
    leaveEncashmentSettingsModel: LeaveEncashmentSettingsModel;
    isLeaveEncashmentSettingsArchived: boolean = false;
    isCtcType: boolean;
    payRollComponentId: string;
    isArchivedTypes: boolean = false;
    leaveEncashmentSettings: LeaveEncashmentSettingsModel[];
    leaveEncashmentSettingsId: string;
    percentage: number;
    seeArchivedItems = this.translateService.instant('PAYROLLTEMPLATE.SEEARCHIVEDITEMS');
    seeUnArchivedItems = this.translateService.instant('PAYROLLTEMPLATE.SEEUNARCHIVEDITEMS');
    payRollComponents: PayRollComponentModel[];
    leaveEncashmentSettingsTitle: string;
    branchId: string;
    branchList$: Observable<Branch[]>;
    amount: number;
    minDate = new Date(1753, 0, 1);
    activeFrom: Date;
    activeTo: Date;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getPayRollComponents();
        this.getAllBranches()
        this.getAllLeaveEncashmentSettings();
        
    }

    constructor(private store: Store<PayRollManagementState>,private payRollService: PayRollService,
         private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService) { super() }


    getAllLeaveEncashmentSettings() {
        this.isAnyOperationIsInprogress = true;
        var leaveEncashmentSettingsModel = new LeaveEncashmentSettingsModel();
        leaveEncashmentSettingsModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllLeaveEncashmentSettings(leaveEncashmentSettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.leaveEncashmentSettings = response.data;
                this.temp = this.leaveEncashmentSettings;
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

    getAllBranches() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
        this.branchList$ = this.store.pipe(select(branchReducer.getBranchAll));
    }

    getPayRollComponents() {
        var payRollComponentModel = new PayRollComponentModel();
        payRollComponentModel.isArchived = this.isArchivedTypes;
        payRollComponentModel.isVisible = true;

        this.payRollService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.payRollComponents = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.leaveEncashmentSettingsId = null;
        this.leaveEncashmentSettingsName = null;
        this.percentage = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isCtcType = null;
        this.branchId = null;
        this.isAnyOperationIsInprogress = false;
        this.leaveEncashmentSettingsForm = new FormGroup({
            payRollComponentId: new FormControl(null,
            ),
            dependentType: new FormControl(null,
            ),
            isCtcType: new FormControl(null,
            ),
            value: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.max(100)
                ])
            ),
            branchId: new FormControl(null,
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

        const temp = this.temp.filter(leaveEncashmentSettings =>
            (leaveEncashmentSettings.payRollComponentName == null ? null : leaveEncashmentSettings.payRollComponentName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (leaveEncashmentSettings.branchName == null ? null : leaveEncashmentSettings.branchName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (leaveEncashmentSettings.percentage == null ? null : leaveEncashmentSettings.percentage.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (leaveEncashmentSettings.amount == null ? null : leaveEncashmentSettings.amount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (leaveEncashmentSettings.activeFrom == null? null : moment(leaveEncashmentSettings.activeFrom).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (leaveEncashmentSettings.activeTo == null ? null : moment(leaveEncashmentSettings.activeTo).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
            || (this.searchText == null || ('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? leaveEncashmentSettings.isCtcType == true :
                ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? leaveEncashmentSettings.isCtcType == false : null)
        );

        this.leaveEncashmentSettings = temp;
    }

    editLeaveEncashmentSettingsPopupOpen(row, upsertLeaveEncashmentSettingsPopUp) {
        this.leaveEncashmentSettingsForm.patchValue(row);
        this.leaveEncashmentSettingsId = row.leaveEncashmentSettingsId;
        this.timeStamp = row.timeStamp;
        this.leaveEncashmentSettingsTitle = 'LEAVEENCASHMENTSETTINGS.EDITLEAVEENCASHMENTSETTINGS';
        this.changeType(row.type);
        upsertLeaveEncashmentSettingsPopUp.openPopover();
    }


    closeUpsertLeaveEncashmentSettingsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLeaveEncashmentSettingsPopover.forEach((p) => p.closePopover());
    }

    createLeaveEncashmentSettingsPopupOpen(upsertLeaveEncashmentSettingsPopUp) {
        this.clearForm();
        upsertLeaveEncashmentSettingsPopUp.openPopover();
        this.leaveEncashmentSettingsTitle = 'LEAVEENCASHMENTSETTINGS.ADDLEAVEENCASHMENTSETTINGS';
    }

    upsertLeaveEncashmentSettings(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.leaveEncashmentSettingsModel = this.leaveEncashmentSettingsForm.value;

        this.leaveEncashmentSettingsModel.percentage = this.leaveEncashmentSettingsModel.value;

        if (this.leaveEncashmentSettingsModel.dependentType == 1) {
            this.leaveEncashmentSettingsModel.isCtcType = true
            this.leaveEncashmentSettingsModel.payRollComponentId = null
        }
        else {
            this.leaveEncashmentSettingsModel.isCtcType = false
        }
        if (this.leaveEncashmentSettingsId) {
            this.leaveEncashmentSettingsModel.leaveEncashmentSettingsId = this.leaveEncashmentSettingsId;
            this.leaveEncashmentSettingsModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertLeaveEncashmentSettings(this.leaveEncashmentSettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertLeaveEncashmentSettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllLeaveEncashmentSettings();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }

            this.cdRef.detectChanges();
        });
        this.isAnyOperationIsInprogress = false;
    }

    deleteLeaveEncashmentSettingsPopUpOpen(row, deleteLeaveEncashmentSettingsPopUp) {
        this.leaveEncashmentSettingsId = row.leaveEncashmentSettingsId;
        this.payRollComponentId = row.payRollComponentId;
        this.branchId = row.branchId;
        this.percentage = row.percentage;
        this.amount = row.amount;
        this.isCtcType = row.isCtcType;
        this.activeFrom = row.activeFrom;
        this.activeTo = row.activeTo;
        this.timeStamp = row.timeStamp;
        this.isLeaveEncashmentSettingsArchived = !this.isArchivedTypes;
        deleteLeaveEncashmentSettingsPopUp.openPopover();
    }

    deleteLeaveEncashmentSettings() {
        this.isAnyOperationIsInprogress = true;
        this.leaveEncashmentSettingsModel = new LeaveEncashmentSettingsModel();
        this.leaveEncashmentSettingsModel.leaveEncashmentSettingsId = this.leaveEncashmentSettingsId;
        this.leaveEncashmentSettingsModel.payRollComponentId = this.payRollComponentId;
        this.leaveEncashmentSettingsModel.branchId = this.branchId;
        this.leaveEncashmentSettingsModel.isCtcType = this.isCtcType;
        this.leaveEncashmentSettingsModel.percentage = this.percentage;
        this.leaveEncashmentSettingsModel.amount = this.amount;
        this.leaveEncashmentSettingsModel.activeFrom = this.activeFrom;
        this.leaveEncashmentSettingsModel.activeTo = this.activeTo;
        this.leaveEncashmentSettingsModel.timeStamp = this.timeStamp;
        this.leaveEncashmentSettingsModel.isArchived = !this.isArchivedTypes;
        this.payRollService.upsertLeaveEncashmentSettings(this.leaveEncashmentSettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteLeaveEncashmentSettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllLeaveEncashmentSettings();
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


    closeDeleteLeaveEncashmentSettingsDialog() {
        this.clearForm();
        this.deleteLeaveEncashmentSettingsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    changeType(value) {
        if (value == 0) {
            this.leaveEncashmentSettingsForm.controls['dependentType'].setValue(null);
            this.leaveEncashmentSettingsForm.controls['payRollComponentId'].setValue(null);
            this.leaveEncashmentSettingsForm.controls['isCtcType'].setValue(false);

            this.leaveEncashmentSettingsForm.controls["dependentType"].clearValidators();
            this.leaveEncashmentSettingsForm.get("dependentType").updateValueAndValidity();

            this.leaveEncashmentSettingsForm.controls["value"].clearValidators();
            this.leaveEncashmentSettingsForm.get("value").updateValueAndValidity();

            this.leaveEncashmentSettingsForm.controls["value"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.leaveEncashmentSettingsForm.get("value").updateValueAndValidity();

        }
        else {
            this.leaveEncashmentSettingsForm.controls["dependentType"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.leaveEncashmentSettingsForm.get("dependentType").updateValueAndValidity();
            
            this.leaveEncashmentSettingsForm.controls["value"].clearValidators();
            this.leaveEncashmentSettingsForm.get("value").updateValueAndValidity();

            this.leaveEncashmentSettingsForm.controls["value"].setValidators(Validators.compose([
                Validators.required,
                Validators.max(100)
            ]));
            this.leaveEncashmentSettingsForm.get("value").updateValueAndValidity();
        }
    }
    changeAmountType(value) {
        if (value == 1) {
            this.leaveEncashmentSettingsForm.controls['payRollComponentId'].setValue(null);
            this.leaveEncashmentSettingsForm.controls["payRollComponentId"].clearValidators();
            this.leaveEncashmentSettingsForm.get("payRollComponentId").updateValueAndValidity();
        }
        else {
            this.leaveEncashmentSettingsForm.controls['isCtcType'].setValue(false);
            this.leaveEncashmentSettingsForm.controls["payRollComponentId"].setValidators(Validators.compose([
                Validators.required
            ]));
            this.leaveEncashmentSettingsForm.get("payRollComponentId").updateValueAndValidity();
        }
    }
} 