import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ExpenseCategoryModel } from '../../models/merchant-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-expense-category',
    templateUrl: `expense-category.component.html`
})

export class ExpenseCategoryDetailsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("expenseCategoryPopup") upsertExpenseCategoryPopover;
    @ViewChildren("deleteExpenseCategoryPopup") deleteExpenseCategorypopUp;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;

    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isThereAnError: boolean;
    validationMessage: any;
    expenseCategoryId: any;
    expenseCategoryForm: FormGroup;
    timeStamp: any;
    isFiltersVisible: boolean;
    expenseCategoryName: any;
    accountCode: any;
    isSubCategory: any;
    temp: any;
    searchText: string;
    isCategoryArchived: boolean;
    expenseCategoryEdit: string;
    description: string;
    expenseCategories: any;

    constructor(private expenseService: MasterDataManagementService,
        private translateService: TranslateService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
            super();
        
        
    }

    ngOnInit() {
        this.clearExpenseCategoryForm();
        super.ngOnInit();
        this.getExpenseCategories();
    }

    getExpenseCategories() {
        this.isAnyOperationIsInprogress = true;
        var expenseCategoryModel = new ExpenseCategoryModel();
        expenseCategoryModel.isArchived = this.isArchived;
        this.expenseService.searchExpenseCategories(expenseCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.expenseCategories = response.data;
                this.temp = this.expenseCategories;
                this.clearExpenseCategoryForm();
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

    createExpenseCategory(expenseCategorypopUp) {
        expenseCategorypopUp.openPopover();
        this.expenseCategoryEdit = this.translateService.instant('EXPENSECATEGORY.ADDEXPENSECATEGORYTITLE');
    }

    editExpenseCategory(row, expenseCategorypopUp) {
        this.expenseCategoryForm.patchValue(row);
        this.expenseCategoryId = row.expenseCategoryId;
        this.timeStamp = row.timeStamp;
        expenseCategorypopUp.openPopover();
        this.expenseCategoryEdit = this.translateService.instant('EXPENSECATEGORY.EDITEXPENSECATEGORYTITLE');
    }

    clearExpenseCategoryForm() {
        this.isAnyOperationIsInprogress = false;
        this.expenseCategoryId = null;
        this.timeStamp = null;
        this.description = null;
        this.accountCode = null;
        this.expenseCategoryName = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.searchText = null;
        this.expenseCategoryForm = new FormGroup({
            categoryName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            accountCode: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            isSubCategory: new FormControl(false,
                Validators.compose([
                    Validators.required,
                ])
            ),
        })
    }

    upsertExpenseCategory(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        let expenseCategory = new ExpenseCategoryModel();
        expenseCategory = this.expenseCategoryForm.value;
        expenseCategory.expenseCategoryName = this.expenseCategoryForm.get('categoryName').value.toString().trim();
        expenseCategory.expenseCategoryId = this.expenseCategoryId;
        expenseCategory.timeStamp = this.timeStamp;
        expenseCategory.isSubCategory = this.expenseCategoryForm.get('isSubCategory').value;

        this.expenseService.upsertExpenseCategory(expenseCategory).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertExpenseCategoryPopover.forEach((p) => p.closePopover());
                this.closeUpsertExpenseCategoryPopup(formDirective);
                this.getExpenseCategories();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    closeUpsertExpenseCategoryPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearExpenseCategoryForm();
        this.upsertExpenseCategoryPopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteExpenseCategoryPopupOpen(row, deleteexpenseCategorypopUp) {
        this.expenseCategoryId = row.expenseCategoryId;
        this.expenseCategoryName = row.categoryName;
        this.description = row.description;
        this.accountCode = row.accountCode;
        this.isSubCategory = row.isSubCategory;
        this.timeStamp = row.timeStamp;
        this.isCategoryArchived = !this.isArchived;
        deleteexpenseCategorypopUp.openPopover();
    }

    closeExpenseCategoryPopup() {
        this.clearExpenseCategoryForm();
        this.deleteExpenseCategorypopUp.forEach((p) => p.closePopover());
    }

    deleteExpenseCategory() {
        this.isAnyOperationIsInprogress = true;

        let expenseCategory = new ExpenseCategoryModel();
        expenseCategory.expenseCategoryId = this.expenseCategoryId;
        expenseCategory.expenseCategoryName = this.expenseCategoryName;
        expenseCategory.accountCode = this.accountCode;
        expenseCategory.description = this.description;
        expenseCategory.isSubCategory = this.isSubCategory;
        expenseCategory.timeStamp = this.timeStamp;
        expenseCategory.isArchived = this.isCategoryArchived;

        this.expenseService.upsertExpenseCategory(expenseCategory).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteExpenseCategorypopUp.forEach((p) => p.closePopover());
                this.clearExpenseCategoryForm();
                this.getExpenseCategories();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }


    closeExpenseCategoryPopupOpen() {
        this.clearExpenseCategoryForm();
        this.deleteExpenseCategorypopUp.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((category => (category.categoryName.toLowerCase().indexOf(this.searchText) > -1)
            || (category.accountCode == null ? null : (category.accountCode.toLowerCase().indexOf(this.searchText) > -1))
            || (category.description == null ? null : (category.description.toLowerCase().indexOf(this.searchText) > -1))));
        this.expenseCategories = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
