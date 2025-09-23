import { Component, Inject, ChangeDetectorRef, Output, EventEmitter, ViewChildren } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder, FormArray, AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MerchantModel, ExpenseCategoryModel } from "../models/merchant-model";
import { ExpenseManagementService } from "../expensemanagement.service";
import { ExpenseManagementModel } from "../models/expenses-model";
import { ToastrService } from "ngx-toastr";
import { Guid } from "guid-typescript";
import { CookieService } from "ngx-cookie-service";
import { AppBaseComponent } from './componentbase';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { ConstantVariables } from '../constants/constant-variables';
import { ProjectList } from '../models/projectlist';
import { Currency } from '../models/currency';
import { StoreManagementService } from '../services/store-management.service';
import { SearchFileModel } from '../models/search-file-model';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { Branch } from '../models/branch';
import { UserModel } from '../models/user';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as _ from "underscore";
import '../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "app-add-multiple-expenses",
    templateUrl: "add-multiple-expenses.component.html"
})

export class AddMultipleExpenseViewComponent extends AppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();
    @ViewChildren("confirmationPopup") confirmationPopOver;
    @ViewChildren("receiptsFileUploadPopup") receiptsFileUploadPopup;

    expenseForm: FormGroup;
    expenseCategoryForm: FormGroup;
    addExpenseElement: FormArray;
    merchantForm: FormGroup;
    categoryName = new FormControl('', Validators.required);
    categoryNameValue: string;
    accountCode = new FormControl('', Validators.required);
    isClamibedByOthers = new FormControl('', []);
    claimedByUser = new FormControl('', Validators.required);
    accountCodeValue: string;
    isSubCategory = new FormControl(false, []);
    isSubCategoryValue: boolean;
    description = new FormControl('', []);
    categoryDescription: string;
    loggedInUserBranchId: string = null;
    selectedMember: string;
    minDueDate = new Date();
    endDateBool: boolean = false;
    isUpsertExpenseInprogress: boolean = false;
    isRecurringExpense: boolean = false;
    isUpsertConfigurationDetailsInprogress: boolean = false;
    expenseId: string;
    expenseDetails = new ExpenseManagementModel();
    selectedExpenseDetails: any;
    merchantsList: any;
    merchantsListCopy: any;
    expenseCategories: any;
    expenseCategoriesCopy: any;
    currencyList: Currency[];
    projectsList: ProjectList[];
    branchList: Branch[];
    branchListCopy: any;
    employeeList: any;
    expenses: any;
    moduleTypeId = 10;
    referenceTypeId = ConstantVariables.ExpenseReferenceTypeId;
    referenceId: string;
    claimedByUserId: string;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    isButtonVisible: boolean = true;
    loggedInUserId: string;
    getFilesByReferenceId:boolean = true;

    constructor(public dialogRef: MatDialogRef<AddMultipleExpenseViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private expenseService: ExpenseManagementService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private formBuilder: FormBuilder, private storeService: StoreManagementService,
        // private documentStore: Store<DocumentStore.State>,
        private cookieService: CookieService) {
        super();
        if (data && data.data) {
            this.selectedExpenseDetails = data.data;
            this.expenseId = data.data.expenseId;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.insertMultipleExpenses();
        this.clearExpenseCategoryForm(null);
        this.clearMerchantForm(null);
        this.getCurrencyList();
        this.getMerchantsList();
        this.getExpenseCategories();
        this.getBranchList();
        this.getAllUsers();
        if (this.selectedExpenseDetails)
            this.expenseForm.patchValue(this.selectedExpenseDetails);
    }

    clearForm() {
        this.expenseForm = new FormGroup({ addExpenseElement: this.formBuilder.array([]) });
    }

    addExpenseItem() {
        this.addExpenseElement = this.expenseForm.get('addExpenseElement') as FormArray;
        this.addExpenseElement.insert(this.addExpenseElement.length, this.createExpenseItem());
    }

    createExpenseItem() {
        return this.formBuilder.group({
            expenseId: new FormControl(Guid.create()),
            expenseDate: new FormControl('', Validators.compose([Validators.required])),
            expenseName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            description: new FormControl('', Validators.compose([Validators.maxLength(800)])),
            merchantId: new FormControl('', Validators.compose([])),
            expenseCategoryId: new FormControl('', Validators.compose([Validators.required])),
            currencyId: new FormControl('', Validators.compose([Validators.required])),
            branchId: new FormControl(this.loggedInUserBranchId, Validators.compose([Validators.required])),
            amount: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(24)])),
            filesCount: new FormControl(null),
        });
    }

    insertMultipleExpenses() {
        this.addExpenseElement = this.expenseForm.get('addExpenseElement') as FormArray;
        for (let i = 0; i < 5; i++) {
            this.addExpenseElement.insert(i, this.createExpenseItem());
        }
    }

    removeItemAtIndex(index: number) {
        const expenseId = this.addExpenseElement.at(index).get("expenseId").value.value;
        var deleteFileModel = new DeleteFileInputModel();
        deleteFileModel.referenceId = expenseId;
        this.storeService.DeleteFileByReferenceId(deleteFileModel).subscribe((response: any) => {
        });
        (<FormArray>this.expenseForm.get('addExpenseElement')).removeAt(index);
        this.cdRef.detectChanges();
    }

    clearExpenseCategoryForm(formDirective: FormGroupDirective) {
        if (formDirective) formDirective.resetForm();
        this.isUpsertConfigurationDetailsInprogress = false;
        this.expenseCategoryForm = new FormGroup({
            expenseCategoryName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            accountCode: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.MaxLength)])),
            isSubCategory: new FormControl(false, Validators.compose([Validators.required,])),
        })
    }

    clearMerchantForm(formDirective: FormGroupDirective) {
        if (formDirective) formDirective.resetForm();
        this.isUpsertConfigurationDetailsInprogress = false;
        this.merchantForm = new FormGroup({
            merchantName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.MaxLength)])),
        })
    }

    startDate() {
        if (this.expenseForm.value.expenseDate) {
            this.minDueDate = this.expenseForm.value.expenseDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
        }
    }

    getCurrencyList() {
        this.expenseService.getCurrencyList().subscribe((result: any) => {
            if (result.success) {
                this.currencyList = result.data;
            }
        });
    }

    getMerchantsList() {
        var merchantModel = new MerchantModel();
        merchantModel.isArchived = false;
        merchantModel.sortDirectionAsc = true;
        this.expenseService.searchMerchants(merchantModel).subscribe((response: any) => {
            if (response.success == true) {
                this.merchantsList = response.data;
                this.merchantsListCopy = response.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getExpenseCategories() {
        var expenseCategoryModel = new ExpenseCategoryModel();
        expenseCategoryModel.isArchived = false;
        this.expenseService.searchExpenseCategories(expenseCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.expenseCategories = response.data;
                this.expenseCategoriesCopy = response.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getBranchList() {
        const branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.expenseService.getBranchDropdown(branchSearchResult).subscribe((response: any) => {
            this.branchList = response.data;
            this.branchListCopy = response.data;
            if (this.branchList && this.branchList.length > 0) {
                if (localStorage.getItem(LocalStorageProperties.Branch)) {
                    this.loggedInUserBranchId = localStorage.getItem(LocalStorageProperties.Branch);
                }
                if (this.expenseId == null && this.loggedInUserBranchId) {
                    for (let i = 0; i < this.addExpenseElement.length; i++) {
                        this.addExpenseElement.at(i).get("branchId").setValue(this.loggedInUserBranchId);
                    }
                }
            }
            this.cdRef.markForCheck();
        });
    }

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isArchived = false;
        this.expenseService.getAllUsers(userModel).subscribe((responseData: any) => {
            this.employeeList = responseData.data;
        })
    }

    checkIsClaimedByOthers() {
        let isClamibedByOthers = this.isClamibedByOthers.value;
        if (isClamibedByOthers) {
            this.claimedByUser.setValidators(Validators.required);
            this.claimedByUser.updateValueAndValidity();
            this.claimedByUser.setValue(this.claimedByUserId);
        } else {
            this.claimedByUser.clearValidators();
            this.claimedByUser.updateValueAndValidity();
            this.claimedByUser.setValue(null);
        }
    }

    onUserSelected(event) {
        this.claimedByUserId = event.value;
        const usersList = this.employeeList;
        const filteredList = _.find(usersList, function (member: any) {
            return member.id === event.value;
        })
        if (filteredList) {
            this.selectedMember = filteredList.fullName;
            this.cdRef.markForCheck();
        }
    }

    upsertExpenses(formDirective: FormGroupDirective) {
        this.isUpsertExpenseInprogress = true;
        this.expenseForm.value.addExpenseElement.forEach(element => {
            element.expenseId = element.expenseId.value;
            element.claimedByUserId = this.claimedByUserId;
            // if (element.branchId == "0") {
            //     element.branchId = null;
            // }
        });
        this.expenseDetails = this.expenseForm.value.addExpenseElement;
        this.expenseService.upsertMultipleExpenses(this.expenseDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.expenseId = response.data;
                this.isUpsertExpenseInprogress = false;
                formDirective.resetForm();
                this.closeExpenseForm();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isUpsertExpenseInprogress = false;
            }
        });
    }

    upsertExpenseCategory(formDirective: FormGroupDirective) {
        this.isUpsertConfigurationDetailsInprogress = true;
        let expenseCategoryDetails = new ExpenseCategoryModel();
        expenseCategoryDetails = this.expenseCategoryForm.value;
        this.expenseService.upsertExpenseCategory(expenseCategoryDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.clearExpenseCategoryForm(formDirective);
                this.getExpenseCategories();
                this.isUpsertConfigurationDetailsInprogress = false;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.clearExpenseCategoryForm(formDirective);
            }
        });
    }

    upsertMerchant(formDirective: FormGroupDirective) {
        this.isUpsertConfigurationDetailsInprogress = true;
        let merchantDetails = new MerchantModel();
        merchantDetails = this.merchantForm.value;
        this.expenseService.upsertMerchant(merchantDetails).subscribe((response: any) => {
            if (response.success == true) {
                this.clearMerchantForm(formDirective);
                this.getMerchantsList();
                this.isUpsertConfigurationDetailsInprogress = false;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.clearMerchantForm(formDirective);
            }
        });
    }

    confirmationPopupOpen(confirmationPopup) {
        confirmationPopup.openPopover();
    }

    closeconfirmationPopup() {
        this.expenseDetails = null;
        this.confirmationPopOver.forEach((p) => p.closePopover());
    }

    closeExpenseForm() {
        // this.dialogRef.close();
        this.closePopup.emit();
        this.confirmationPopOver.forEach((p) => p.closePopover());
        this.expenseForm.value.addExpenseElement.forEach(element => {
            var deleteFileModel = new DeleteFileInputModel();
            deleteFileModel.referenceId = element.expenseId.value;
            this.storeService.DeleteFileByReferenceId(deleteFileModel).subscribe((response: any) => {
                if (response.success == true) {
                }
                this.cdRef.detectChanges();
            });
        });
    }

    closePopover() {
        this.clearForm();
        this.dialogRef.close();
    }

    getExpenseControls() {
        return this.newMethod();
    }

    private newMethod() {
        let returnvalue = (this.expenseForm.get('addExpenseElement') as FormArray).controls;
        return returnvalue;
    }

    openStepExpectedPopover(index, receiptsFileUploadPopover) {
        receiptsFileUploadPopover.openPopover();
        const expenseId = this.addExpenseElement.at(index).get("expenseId").value.value;
        this.referenceId = expenseId;
    }

    getReceiptsCount(index) {
        const expenseId = this.addExpenseElement.at(index).get("expenseId").value.value;
        this.getUploadedFilesDetails(expenseId);
    }

    getUploadedFilesDetails(referenceId) {
        const searchFolderModel = new SearchFileModel();
        searchFolderModel.referenceId = referenceId;
        searchFolderModel.referenceTypeId = this.referenceTypeId;
        searchFolderModel.isArchived = false;
        searchFolderModel.sortDirectionAsc = true;
        // this.documentStore.dispatch(new LoadFilesTriggered(searchFolderModel));
        // return this.commonStore.pipe(select(commonModuleReducers.getFileTotal));
    }

    closereceiptsPopup() {
        this.receiptsFileUploadPopup.forEach((p) => p.closePopover());
        let fileDetails = this.cookieService.get(LocalStorageProperties.ExpensesFileCount);
        let fileCountDetails = JSON.parse(fileDetails);
        fileCountDetails = (fileCountDetails && fileCountDetails.length > 0) ? fileCountDetails : [];
        let index = fileCountDetails.findIndex(x => x.expenseId == this.referenceId);
        let expenseIndex = this.expenseForm.value.addExpenseElement.findIndex(x => x.expenseId.value == this.referenceId);
        this.addExpenseElement.at(expenseIndex).get("filesCount").setValue(fileCountDetails[index].filesCount);
        this.referenceId = null;
    }

    disabledButton(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            this.searchExpenses(searchText);
        }
    }

    searchExpenses(searchText: string) {
        var expenseModel = new ExpenseManagementModel();
        expenseModel.isArchived = false;
        expenseModel.searchText = searchText;
        this.expenseService.searchExpenses(expenseModel).subscribe((response: any) => {
            if (response.success == true) {
                this.expenses = response.data;
                this.cdRef.detectChanges();
            }
        });
    }

    selectedExpense(event, index) {
        this.addExpenseElement.at(index).get("expenseName").setValue(event.option.value);
    }

    getExpenseFormLength() {
        return ((this.expenseForm.get('addExpenseElement') as FormArray).length - 1);
    }

    getAddExpenseFormLength() {
        return ((this.expenseForm.get('addExpenseElement') as FormArray).length);
    }

    onMerchantBlur(value, index) {
        let details = this.merchantsListCopy.find(x => x.merchantName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('merchantId').setValue(details.merchantId);
        } else {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('merchantId').setValue(null);
        }
    }

    onCategoryBlur(value, index) {
        let details = this.expenseCategoriesCopy.find(x => x.categoryName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('expenseCategoryId').setValue(details.expenseCategoryId);
        } else {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('expenseCategoryId').setValue(null);
        }
    }

    onBranchBlur(value, index) {
        let details = this.branchListCopy.find(x => x.branchName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('branchId').setValue(details.branchId);
        } else {
            let data = this.expenseForm.get('addExpenseElement') as FormArray;
            data.at(index).get('branchId').setValue(null);
        }
    }

    searchMerchants(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            const temp = this.merchantsListCopy.filter((merchant => (merchant.merchantName.toLowerCase().indexOf(searchText) > -1)));
            this.merchantsList = temp;
        }
    }

    searchBranches(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            const temp = this.branchListCopy.filter((merchant => (merchant.branchName.toLowerCase().indexOf(searchText) > -1)));
            this.branchList = temp;
        }
    }

    searchExpenseCategories(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            const temp = this.expenseCategoriesCopy.filter((expense => (expense.categoryName.toLowerCase().indexOf(searchText) > -1)));
            this.expenseCategories = temp;
        }
    }

    selectedMerchant(event, index) {
        this.addExpenseElement.at(index).get("merchantId").setValue(event.option.value.merchantId);
    }

    displayMerchantFn(merchant?: any): string | undefined {
        if (merchant != null && merchant.merchantId != null) {
            return merchant ? merchant.merchantName : undefined;
        } else if (this.merchantsListCopy) {
            let details = this.merchantsListCopy.find(x => x.merchantId == merchant);
            if (details) return details.merchantName;
        }
    }

    selectedCategory(event, index) {
        this.addExpenseElement.at(index).get("expenseCategoryId").setValue(event.option.value.expenseCategoryId);
    }

    displayCategoryFn(category?: any): string | undefined {
        if (category != null && category.expenseCategoryId != null) {
            return category ? category.categoryName : undefined;
        } else if (this.expenseCategoriesCopy) {
            let details = this.expenseCategoriesCopy.find(x => x.expenseCategoryId == category);
            if (details) return details.categoryName;
        }
    }

    selectedBranch(event, index) {
        this.addExpenseElement.at(index).get("branchId").setValue(event.option.value.branchId);
    }

    displayBranchFn(branch?: any): string | undefined {
        if (branch != null && branch.branchId != null) {
            return branch ? branch.branchName : undefined;
        } else if (this.branchListCopy) {
            let details = this.branchListCopy.find(x => x.branchId == branch);
            if (details) return details.branchName;
        }
    }
}