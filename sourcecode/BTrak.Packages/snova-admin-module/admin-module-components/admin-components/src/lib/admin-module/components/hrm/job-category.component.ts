import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { JobCategoryModel } from '../../models/hr-models/job-category-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-jobcategory",
    templateUrl: `job-category.component.html`
})

export class JobCategoryComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("editJobCategoryPopup") upsertJobCategoryPopup;
    @ViewChildren("deleteJobCategoryPopup") deleteJobCategoryPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    preserveWhitespaces: true;
    isAnyOperationIsInprogress = false;
    jobCategoryForm: FormGroup;
    isJobCategoryArchived: boolean;
    isThereAnError = false;
    isFiltersVisible: boolean;
    isArchived = false;
    jobCategoryId: string;
    validationMessage: string;
    jobCategoryName: string;
    jobCategoryModel: JobCategoryModel;
    jobCategories: JobCategoryModel[];
    timeStamp: any;
    searchText: string;
    temp: any;
    jobCategory: string;

    constructor(
        private hrManagement: HRManagementService,private snackbar: MatSnackBar,
        private translateService: TranslateService, private cdref: ChangeDetectorRef) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllJobCategories();
    }

    getAllJobCategories() {
        this.isAnyOperationIsInprogress = true;
        const jobCategoryModel = new JobCategoryModel();
        jobCategoryModel.isArchived = this.isArchived;
        this.hrManagement.getJobCategories(jobCategoryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.jobCategories = response.data;
                this.temp = this.jobCategories;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    createJobCategory(jobCategoryPopup) {
        jobCategoryPopup.openPopover();
        this.jobCategory = this.translateService.instant("JOBCATEGORY.ADDJOBCATEGORYTITLE");
    }

    closeUpsertJobCategoryPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertJobCategoryPopup.forEach((p) => p.closePopover());
    }

    closeDeleteJobCategoryPopup() {
        this.clearForm();
        this.deleteJobCategoryPopup.forEach((p) => p.closePopover());
    }

    upsertJobCategory(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let jobCategoryModel = new JobCategoryModel();
        jobCategoryModel = this.jobCategoryForm.value;
        jobCategoryModel.jobCategoryName = jobCategoryModel.jobCategoryName.trim();
        jobCategoryModel.jobCategoryId = this.jobCategoryId;
        jobCategoryModel.timeStamp = this.timeStamp;
        this.hrManagement.upsertJobCategory(jobCategoryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertJobCategoryPopup.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllJobCategories();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    deleteJobCategory() {
        this.isAnyOperationIsInprogress = true;
        const jobCategoryModel = new JobCategoryModel();
        jobCategoryModel.jobCategoryId = this.jobCategoryId;
        jobCategoryModel.jobCategoryName = this.jobCategoryName;
        jobCategoryModel.timeStamp = this.timeStamp;
        jobCategoryModel.isArchived = this.isJobCategoryArchived;
        this.hrManagement.upsertJobCategory(jobCategoryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteJobCategoryPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllJobCategories();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdref.detectChanges();
        });
    }

    clearForm() {
        this.jobCategoryId = null;
        this.validationMessage = null;
        this.jobCategoryName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.jobCategoryModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.jobCategoryForm = new FormGroup({
            jobCategoryName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    editJobCategory(rowDetails, jobCategoryPopup) {
        this.jobCategoryForm.patchValue(rowDetails);
        this.jobCategoryId = rowDetails.jobCategoryId;
        this.jobCategory = this.translateService.instant("JOBCATEGORY.EDITJOBCATEGORYTITLE");
        jobCategoryPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    deleteJobCategoryPopUpOpen(row, deletejobCategoryPopup) {
        this.jobCategoryId = row.jobCategoryId;
        this.jobCategoryName = row.jobCategoryName;
        this.timeStamp = row.timeStamp;
        this.isJobCategoryArchived = !this.isArchived;
        deletejobCategoryPopup.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        if (this.temp != null) {
            const temp = this.temp.filter(((jobCategory) => (jobCategory == null ? null : (jobCategory.jobCategoryName == null ? null : jobCategory.jobCategoryName.toLowerCase().indexOf(this.searchText) > -1))));
            this.jobCategories = temp;
        }
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}
