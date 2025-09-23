import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HrBranchModel } from '../../models/hr-models/branch-model';
import { TimeZoneModel } from '../../models/hr-models/time-zone';
import { RegionsModel } from '../../models/hr-models/region-model';
import { HRManagementService } from '../../services/hr-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-branch',
    templateUrl: `branch.component.html`
})

export class BranchComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertBranchPopUp") upsertBranchPopover;
    @ViewChildren("deleteBranchPopUp") deleteBranchPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    constructor(
        private translateService: TranslateService, private branchService: HRManagementService,
        public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllRegions();
        this.getTimeZoneList();
        this.getAllBranches();
    }

    public isArchived: boolean = false;
    branches: HrBranchModel[];
    isAnyOperationIsInprogress: boolean = false;
    branch: HrBranchModel;
    branchName: string;
    branchId: string;
    isThereAnError: boolean = false;
    validationMessage: string;
    timeStamp: any;
    branchForm: FormGroup;
    isFiltersVisible: boolean;
    regionId: string;
    regions: string;
    searchText: string;
    temp: any;
    branchEdit: string;
    isHeadOffice: boolean;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    timeZoneList: TimeZoneModel[];

    getAllBranches() {
        this.isAnyOperationIsInprogress = true;

        var hrBranchModel = new HrBranchModel();
        hrBranchModel.isArchived = this.isArchived;
        hrBranchModel.searchText = this.searchText
        this.branchService.getBranches(hrBranchModel).subscribe((response: any) => {
            if (response.success == true) {
                this.branches = response.data;
                this.temp = this.branches;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    getTimeZoneList() {
        var timeZoneModel = new TimeZoneModel;
        timeZoneModel.isArchived = false;
        this.branchService.getAllTimeZones(timeZoneModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeZoneList = response.data;
            }
            this.cdRef.detectChanges();
        });
    }

    upsertBranch(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.branch = this.branchForm.value;
        this.branch.branchName = this.branch.branchName.trim();
        this.branch.street = this.branch.street == null ? null : this.branch.street.trim() == '' ? null : this.branch.street.trim();
        this.branch.city = this.branch.city == null ? null : this.branch.city.trim() == '' ? null : this.branch.city.trim();
        this.branch.state = this.branch.state == null ? null : this.branch.state.trim() == '' ? null : this.branch.state.trim();
        this.branch.branchId = this.branchId;
        this.branch.timeStamp = this.timeStamp;

        this.branchService.upsertBranch(this.branch).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertBranchPopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                formDirective.resetForm();
                this.getAllBranches();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteBranch() {
        this.isAnyOperationIsInprogress = true;
        this.branch.isArchived = !this.isArchived;
        this.branchService.upsertBranch(this.branch).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteBranchPopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllBranches();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllRegions() {
        var regionsModel = new RegionsModel();
        regionsModel.isArchived = false;
        this.branchService.getRegions(regionsModel).subscribe((responseData: any) => {
            this.regions = responseData.data;
        });
    }

    createBranchPopupOpen(upsertBranchPopUp) {
        upsertBranchPopUp.openPopover();
        this.branchEdit = this.translateService.instant('BRANCH.ADDBRANCHTITLE');
    }

    closeUpsertBranchPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertBranchPopover.forEach((p) => p.closePopover());
    }

    editBranchPopupOpen(row, upsertBranchPopUp) {
        this.branchForm.patchValue(row);
        this.branchId = row.branchId;
        this.branchEdit = this.translateService.instant('BRANCH.EDITBRANCHTITLE');
        this.timeStamp = row.timeStamp;
        upsertBranchPopUp.openPopover();
    }

    deleteBranchPopUpOpen(row, deleteBranchPopUp) {
        this.branch = row;
        deleteBranchPopUp.openPopover();
    }

    closeDeleteBranchDialog() {
        this.isThereAnError = false;
        this.deleteBranchPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.branchId = null;
        this.branch = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.regionId = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.branchForm = new FormGroup({
            branchName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            regionId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            isHeadOffice: new FormControl(null,
                Validators.compose([
                ])
            ),
            street: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            city: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            state: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            postalCode: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(7)
                ])
            ),
            timeZoneId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
            var hrBranchModel = new HrBranchModel();
            hrBranchModel.isArchived = this.isArchived;
            hrBranchModel.searchText = this.searchText
            this.branchService.getBranches(hrBranchModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.branches = response.data;
                }
            })

        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((branch => (branch.branchName.toLowerCase().indexOf(this.searchText) > -1)
            || (branch.timeZoneName == null ? null : branch.timeZoneName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (branch.regionName.toLowerCase().indexOf(this.searchText) > -1)));
        this.branches = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
