import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationCategoryModel } from '../../models/application-category.model';
import { ActivityTrackerService } from '../../services/activitytracker-services';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Component({
    selector: 'app-at-application-category',
    templateUrl: `application-category.component.html`
})

export class ApplicationCategoryComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @Input() isForDialog?: boolean = false;
    @ViewChildren("deleteApplicationCategoryPopUp") deleteApplicationCategoryPopover;
    @ViewChildren("upsertApplicationCategoryPopUp") upsertApplicationCategoryPopover;

    masterDataForm: FormGroup;

    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    applicationCategoryId: string;
    applicationCategoryName: string;
    validationMessage: string;
    applicationCategoryModel: ApplicationCategoryModel;
    ApplicationCategoryForm: FormGroup;
    applicationCategories: ApplicationCategoryModel[];
    timeStamp: any;
    temp: any;
    searchText: string;
    categoryType: string;

    constructor(private cdRef: ChangeDetectorRef,
        private activityTrackerService: ActivityTrackerService,
        private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        if (this.canAccess_feature_ManageApplicationCategory) {
            this.getAllApplicationCategories();
        }
    }

    getAllApplicationCategories() {
        this.isAnyOperationIsInprogress = true;
        var genericApplicationCategoryModel = new ApplicationCategoryModel();
        genericApplicationCategoryModel.isArchived = this.isArchived;
        this.activityTrackerService.getAllApplicationCategories(genericApplicationCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.applicationCategories = response.data;
                this.temp = this.applicationCategories;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteApplicationCategoryPopUpOpen(row, deleteApplicationCategoryPopUp) {
        this.applicationCategoryId = row.applicationCategoryId;
        this.timeStamp = row.timeStamp;
        this.applicationCategoryName = row.applicationCategoryName;
        deleteApplicationCategoryPopUp.openPopover();
    }

    closeDeleteApplicationCategoryPopUp() {
        this.clearForm();
        this.deleteApplicationCategoryPopover.forEach((p) => p.closePopover());
    }

    deleteApplicationCategory() {
        this.isAnyOperationIsInprogress = true;
        this.applicationCategoryModel = new ApplicationCategoryModel();
        this.applicationCategoryModel.applicationCategoryId = this.applicationCategoryId;
        this.applicationCategoryModel.timeStamp = this.timeStamp;
        this.applicationCategoryModel.applicationCategoryName = this.applicationCategoryName;
        this.applicationCategoryModel.isArchived = !this.isArchived;
        this.activityTrackerService.upsertApplicationCategory(this.applicationCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteApplicationCategoryPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllApplicationCategories();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeUpsertApplicationCategoryPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertApplicationCategoryPopover.forEach((p) => p.closePopover());
    }

    cancelDeleteApplicationCategory() {
        this.clearForm();
        this.deleteApplicationCategoryPopover.forEach((p) => p.closePopover());
    }

    editApplicationCategoryPopupOpen(row, upsertApplicationCategoryPopUp) {
        this.ApplicationCategoryForm.patchValue(row);
        this.applicationCategoryId = row.applicationCategoryId;
        this.categoryType = this.translateService.instant('AUDIT.EDITCATEGORY');
        this.timeStamp = row.timeStamp;
        upsertApplicationCategoryPopUp.openPopover();
    }

    createApplicationCategoryPopupOpen(upsertApplicationCategoryPopUp) {
        upsertApplicationCategoryPopUp.openPopover();
        this.categoryType = this.translateService.instant('EXPENSEMANAGEMENT.ADDCATEGORY');
    }

    upsertApplicationCategory(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.applicationCategoryModel = this.ApplicationCategoryForm.value;
        this.applicationCategoryModel.applicationCategoryName = this.applicationCategoryModel.applicationCategoryName.trim();
        this.applicationCategoryModel.timeStamp = this.timeStamp;
        this.applicationCategoryModel.applicationCategoryId = this.applicationCategoryId;
        this.activityTrackerService.upsertApplicationCategory(this.applicationCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertApplicationCategoryPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllApplicationCategories();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    clearForm() {
        this.applicationCategoryId = null;
        this.applicationCategoryName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.applicationCategoryModel = null;
        this.validationMessage = null;
        this.searchText = null;
        this.timeStamp = null;
        this.ApplicationCategoryForm = new FormGroup({
            applicationCategoryName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
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
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(category => category.applicationCategoryName.toLowerCase().indexOf(this.searchText) > -1);
        this.applicationCategories = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
