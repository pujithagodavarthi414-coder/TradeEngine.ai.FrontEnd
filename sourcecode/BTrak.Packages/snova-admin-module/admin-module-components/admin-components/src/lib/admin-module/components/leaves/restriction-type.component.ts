import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { LeavesManagementService } from '../../services/leaves-management.service';
import { TranslateService } from '@ngx-translate/core';
import { RestrictionTypeModel } from '../../models/leaves-models/restriction-type-model';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-restriction-type',
    templateUrl: `restriction-type.component.html`
})

export class RestrictionTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteRestrictionTypePopup") deleteRestrictionTypePopover;
    @ViewChildren("upsertRestrictionTypePopUp") upsertRestrictionTypePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
      if (data && data !== undefined) {
        this.dashboardFilters = data;
      }
    }

    dashboardFilters: DashboardFilterModel;
    restrictionTypeForm: FormGroup;
    isFiltersVisible: boolean = false;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    isWeekly: boolean;
    isMonthly: boolean;
    isQuarterly: boolean;
    isHalfYearly: boolean;
    isYearly: boolean;
    restrictionTypeId: string;
    restrictionTypeName: string;
    validationMessage: string;
    searchText: string;
    restrictionType: RestrictionTypeModel;
    isAnyOperationIsInprogress: boolean = false;
    restrictionTypes: any;
    timeStamp: any;
    temp: any;
    noOfLeaves: number;
    restrictionTypeTitle: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllRestrictionTypes();
    }
    constructor(private cdRef: ChangeDetectorRef,private translateService: TranslateService,
          private leavesManagementService: LeavesManagementService) { super(); }

    getAllRestrictionTypes() {
        this.isAnyOperationIsInprogress = true;

        var restrictionTypeModel = new RestrictionTypeModel();
        restrictionTypeModel.isArchived = this.isArchived;

        this.leavesManagementService.getAllRestrictionTypes(restrictionTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.restrictionTypes = response.data;
                this.temp = this.restrictionTypes;
                this.clearForm();
            }
            else if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteRestrictionTypePopUpOpen(row, deleteRestrictionTypePopUp) {
        this.restrictionTypeId = row.restrictionTypeId;
        this.restrictionTypeName = row.restrictionType;
        this.noOfLeaves = row.leavesCount;
        this.isWeekly = row.isWeekly;
        this.isMonthly = row.isMonthly;
        this.isQuarterly = row.isQuarterly;
        this.isHalfYearly = row.isHalfYearly;
        this.isYearly = row.isYearly;
        this.timeStamp = row.timeStamp;
        deleteRestrictionTypePopUp.openPopover();
    }

    closeDeleteRestrictionTypeDialog() {
        this.clearForm();
        this.deleteRestrictionTypePopover.forEach((p) => p.closePopover());
    }

    upsertRestrictionType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.restrictionType = this.restrictionTypeForm.value;
        this.restrictionType.isWeekly = this.restrictionTypeForm.get('restrictionCategory').value == '1' ? true : null;
        this.restrictionType.isMonthly = this.restrictionTypeForm.get('restrictionCategory').value == '2' ? true : null;
        this.restrictionType.isQuarterly = this.restrictionTypeForm.get('restrictionCategory').value == '3' ? true : null;
        this.restrictionType.isHalfYearly = this.restrictionTypeForm.get('restrictionCategory').value == '4' ? true : null;
        this.restrictionType.isYearly = this.restrictionTypeForm.get('restrictionCategory').value == '5' ? true : null;
        this.restrictionType.restrictionTypeId = this.restrictionTypeId;
        this.restrictionType.timeStamp = this.timeStamp;

        this.leavesManagementService.upsertRestrictionType(this.restrictionType).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertRestrictionTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllRestrictionTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    deleteRestrictionType() {
        this.isAnyOperationIsInprogress = true;
        this.restrictionType = new RestrictionTypeModel();
        this.restrictionType.restrictionTypeId = this.restrictionTypeId;
        this.restrictionType.restrictionType = this.restrictionTypeName;
        this.restrictionType.leavesCount = this.noOfLeaves;
        this.restrictionType.isMonthly = this.isMonthly ? this.isMonthly : null;
        this.restrictionType.isWeekly = this.isWeekly ? this.isWeekly : null;
        this.restrictionType.isQuarterly = this.isQuarterly ? this.isQuarterly : null;
        this.restrictionType.isHalfYearly = this.isHalfYearly ? this.isHalfYearly : null;
        this.restrictionType.isYearly = this.isYearly ? this.isYearly : null;
        this.restrictionType.timeStamp = this.timeStamp;
        this.restrictionType.isArchived = !this.isArchived;

        this.leavesManagementService.upsertRestrictionType(this.restrictionType).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteRestrictionTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllRestrictionTypes();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    editRestrictionType(row, upsertRestrictionTypePopUp) {
        this.restrictionTypeForm.patchValue(row);
        let selectedCategory = row.isWeekly ? 1 : row.isMonthly ? 2 : row.isQuarterly ? 3 : row.isHalfYearly ? 4 : 5;
        this.restrictionTypeForm.controls['restrictionCategory'].setValue(selectedCategory);
        this.restrictionTypeId = row.restrictionTypeId;
        this.timeStamp = row.timeStamp;
        this.restrictionTypeTitle = this.translateService.instant('RESTRICTIONTYPE.EDITRESTRICTIONTYPE');
        upsertRestrictionTypePopUp.openPopover();
    }

    closeUpsertRestrictionTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertRestrictionTypePopover.forEach((p) => p.closePopover());
    }

    createRestrictionType(upsertRestrictionTypePopUp) {
        upsertRestrictionTypePopUp.openPopover();
        this.restrictionTypeTitle = this.translateService.instant('RESTRICTIONTYPE.ADDRESTRICTIONTYPE');
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.restrictionType = null;
        this.restrictionTypeId = null;
        this.isThereAnError = false;
        this.restrictionTypeName = null;
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.restrictionTypeForm = new FormGroup({
            restrictionType: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            leavesCount: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.max(366)
                ])
            ),
            restrictionCategory: new FormControl(null,
                Validators.compose([
                    Validators.required,
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

        const temp = this.temp.filter(restrictionType => restrictionType.restrictionType.toLowerCase().indexOf(this.searchText) > -1
            || (restrictionType.leavesCount.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (restrictionType.type.toString().toLowerCase().indexOf(this.searchText) > -1));
        this.restrictionTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
