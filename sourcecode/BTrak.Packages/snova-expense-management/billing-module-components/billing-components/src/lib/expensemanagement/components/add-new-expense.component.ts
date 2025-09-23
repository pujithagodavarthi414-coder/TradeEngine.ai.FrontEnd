import { Component, Inject, ChangeDetectorRef, Output, EventEmitter, ViewChildren, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormArray, FormBuilder, ValidationErrors } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MerchantModel, ExpenseCategoryModel } from "../models/merchant-model";
import { ExpenseManagementService } from "../expensemanagement.service";
import { ExpenseManagementModel, ExpenseManagementConfigurationModel } from "../models/expenses-model";
import { ToastrService } from "ngx-toastr";
import { CronOptions } from "cron-editor";
import cronstrue from 'cronstrue';
import { Guid } from "guid-typescript";
import * as _ from "underscore";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../constants/constant-variables';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { DeleteFileInputModel } from '../models/delete-file-input-model';
import { Branch } from '../models/branch';
import { StoreManagementService } from '../services/store-management.service';
import { AppBaseComponent } from './componentbase';
import { Currency } from '../models/currency';
import { CronExpressionModel } from '../models/cron-expression-model';
import { UserModel } from '../models/user';
import '../../globaldependencies/helpers/fontawesome-icons'
import { Store } from '@ngrx/store';
import { State } from '@thetradeengineorg1/snova-file-uploader/lib/dropzone/store/reducers';
//import { AbstractControl } from '@angular/forms/src/model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-add-new-expense",
    templateUrl: "add-new-expense.component.html",
    styles: [`
    .add-expense-popup-width
    {
        width: calc(100% - 3px) !important;
    }`]
})

export class AddExpenseViewComponent extends AppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();
    @ViewChildren("addCronExpressionPopUp") addCronExpressionPopUp;
    @ViewChildren("receiptsFileUploadPopup") receiptsFileUploadPopup;
    @ViewChildren("addMerchantPopup") addMerchantPopup;
    @ViewChildren("addCategoryPopup") addCategoryPopup;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.selectedEditExpenseDetails = data;
            this.setExpenseDetails(data);
        }
    }

    expenseForm: FormGroup;
    expenseCategoryForm: FormGroup;
    merchantForm: FormGroup;
    selectedEditExpenseDetails: any;
    categoryName = new FormControl('', Validators.required);
    categoryNameValue: string;
    accountCode = new FormControl('', Validators.required);
    accountCodeValue: string;
    isSubCategory = new FormControl(false, []);
    isSubCategoryValue: boolean;
    description = new FormControl('', []);
    categoryDescription: string;
    minDueDate = new Date();
    endDateBool: boolean = false;
    isUpsertExpenseInprogress: boolean = false;
    isRecurringExpense: boolean = false;
    isToClosePopup: boolean;
    isGroupingExpense: boolean = false;
    isUpsertConfigurationDetailsInprogress: boolean = false;
    moduleTypeId = 10;
    referenceTypeId = ConstantVariables.ExpenseReferenceTypeId;
    getFilesByReferenceId:boolean = true;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    expenseId: string;
    loggedInUserId: string;
    loggedInUserBranchId: string;
    selectedMember: string;
    expenseDetails = new ExpenseManagementModel();
    selectedExpenseDetails: any;
    expenses: any;
    merchantsList: any;
    merchantsListCopy: any;
    expenseCategoriesList: any;
    expenseCategoriesCopy: any;
    employeeList: any;
    currencyList: Currency[];
    branchList: Branch[];
    branchListCopy: Branch[];
    expenseCategoryDetails: FormArray;
    length: number = 1;
    totalAmount: number = 0;
    cronExpressionId: string;
    cronExpressionTimeStamp: any = null;
    isButtonVisible: boolean = true;
    isToUploadFiles: boolean = false;
    formReferenceId: string;
    customFormReferenceTypeId: string;
    formModuleTypeId: number;
    isEditFieldPermission: boolean;
    assetReferenceId: string;
    jobId: string;
    claimedByUserId: string;
    referenceId: string;
    isreload: string;
    public cronExpression = "0 10 1/1 * ?";
    cronExpressionDescription: string;
    public isCronDisabled = false;
    public cronExpressionModel: CronExpressionModel;
    public cronOptions: CronOptions = {
        formInputClass: "form-control cron-editor-input",
        formSelectClass: "form-control cron-editor-select",
        formRadioClass: "cron-editor-radio",
        formCheckboxClass: "cron-editor-checkbox",
        defaultTime: "10:00:00",
        use24HourTime: true,
        hideMinutesTab: true,
        hideHourlyTab: true,
        hideDailyTab: false,
        hideWeeklyTab: false,
        hideMonthlyTab: false,
        hideYearlyTab: false,
        hideAdvancedTab: true,
        hideSeconds: true,
        removeSeconds: true,
        removeYears: true
    };

    constructor(public dialogRef: MatDialogRef<AddExpenseViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private expenseService: ExpenseManagementService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private formBuilder: FormBuilder, private store: Store<State>, private translateService: TranslateService,
        private storeService: StoreManagementService, private cookieService: CookieService) {
        super();
        this.clearForm();
        this.selectedEditExpenseDetails = data;
        this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.setExpenseDetails(data);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getMerchantsList();
        this.getExpenseCategories();
        this.getBranchList();
        this.getCurrencyList();
        this.getAllUsers();
        this.clearExpenseCategoryForm(null);
        this.clearMerchantForm(null);
        if (this.selectedExpenseDetails)
            this.expenseForm.patchValue(this.selectedExpenseDetails);
    }

    ngAfterViewInit() {
        (document.querySelector(".mat-dialog-padding") as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    setExpenseDetails(data) {
        if(data) {
            this.formModuleTypeId = data.moduleTypeId;
            this.customFormReferenceTypeId = data.referenceTypeId;
            this.formReferenceId = data.referenceId;
            this.isEditFieldPermission = data.isEditFieldPermission;
        }
        if (data && data.data) {
            this.selectedExpenseDetails = data.data;
            this.expenseId = data.data.expenseId;
            if (data.data.claimedByUserId != data.data.createdByUserId) {
                this.expenseForm.get('isClamibedByOthers').setValue(true);
                this.expenseForm.get('claimedByUserId').setValue(data.data.claimedByUserId);
                this.claimedByUserId = data.data.claimedByUserId;
            }
            if (data.data.cronExpressionId) {
                this.expenseForm.get('isRecurringExpense').setValue(true);
                this.isRecurringExpense = true;
                this.cronExpressionId = data.data.cronExpressionId;
                this.cronExpression = data.data.cronExpression;
                this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
                this.cronExpressionTimeStamp = data.data.cronExpressionTimestamp;
                this.jobId = data.data.jobId;
            }
            if (this.selectedExpenseDetails.expenseCategoriesConfigurations.length > 1) {
                this.expenseForm.get('isGroupingExpense').setValue(true);
                this.checkIsGrouping();
            }
            else {
                let details = this.selectedExpenseDetails.expenseCategoriesConfigurations[0];
                if (details.expenseCategoryName == this.selectedExpenseDetails.expenseName) {
                    this.selectedExpenseDetails.expenseCategoryId = details.expenseCategoryId;
                    this.selectedExpenseDetails.merchantId = details.merchantId;
                    this.selectedExpenseDetails.amount = details.amount;
                    this.selectedExpenseDetails.description = details.description;
                    this.selectedExpenseDetails.expenseCategoryConfigurationId = details.expenseCategoryConfigurationId;
                } else {
                    this.expenseForm.get('isGroupingExpense').setValue(true);
                    this.checkIsGrouping();
                }
            }
        }
    }

    clearForm() {
        this.expenseForm = new FormGroup({
            expenseDate: new FormControl(null, Validators.compose([Validators.required,])),
            expenseName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.ProjectNameMaxLength250)])),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.CommentsMaxLength)])),
            merchantId: new FormControl(null),
            expenseCategoryId: new FormControl(null, Validators.compose([Validators.required])),
            currencyId: new FormControl(null, Validators.compose([Validators.required,])),
            amount: new FormControl(null, Validators.compose([Validators.required, Validators.max(999999999)])),
            branchId: new FormControl(null, Validators.compose([Validators.required])),
            isRecurringExpense: new FormControl(false, []),
            isGroupingExpense: new FormControl(false, []),
            isClamibedByOthers: new FormControl(false, []),
            claimedByUserId: new FormControl(null, []),
            expenseCategories: this.formBuilder.array([]),
        });
    }

    createItem(details: any): FormGroup {
        if (!details) {
            return this.formBuilder.group({
                expenseCategoryId: '',
                merchantId: '',
                expenseCategoryName: '',
                description: '',
                amount: '',
                expenseCategoryConfigurationId: Guid.create(),
            });
        } else {
            let merchantData = details.merchantId;
            let categoryData = details.expenseCategoryId;
            if (this.merchantsListCopy) {
                merchantData = this.merchantsListCopy.find(x => x.merchantId == details.merchantId);
            }
            if (this.expenseCategoriesCopy) {
                categoryData = this.expenseCategoriesCopy.find(x => x.expenseCategoryId == details.expenseCategoryId);
            }
            return this.formBuilder.group({
                expenseCategoryId: categoryData,
                merchantId: merchantData,
                expenseCategoryName: details.expenseCategoryName,
                description: details.description,
                amount: details.amount,
                expenseCategoryConfigurationId: details.expenseCategoryConfigurationId,
            });
        }
    }

    getExpenseControls() {
        return (<FormArray>this.expenseForm.get('expenseCategories')).controls;
    }

    clearExpenseCategoryForm(formDirective: FormGroupDirective) {
        if (formDirective) formDirective.resetForm();
        this.isUpsertConfigurationDetailsInprogress = false;
        this.expenseCategoryForm = new FormGroup({
            expenseCategoryName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            accountCode: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.DescriptionLength)])),
            isSubCategory: new FormControl(false, Validators.compose([Validators.required,])),
        })
    }

    clearMerchantForm(formDirective: FormGroupDirective) {
        if (formDirective) formDirective.resetForm();
        this.isUpsertConfigurationDetailsInprogress = false;
        this.merchantForm = new FormGroup({
            merchantName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.MaxLength)])),
            description: new FormControl(null, Validators.compose([Validators.maxLength(ConstantVariables.DescriptionLength)])),
        })
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
                if (this.selectedExpenseDetails) {
                    let data = this.merchantsList.find(x => x.merchantId == this.selectedExpenseDetails.merchantId);
                    this.expenseForm.get('merchantId').setValue(data);
                }
                if (this.selectedExpenseDetails && this.selectedExpenseDetails.expenseCategoriesConfigurations.length > 1) {
                    let expenseCategoryDetails = this.expenseForm.get('expenseCategories') as FormArray;
                    this.selectedExpenseDetails.expenseCategoriesConfigurations.forEach((element, i) => {
                        let data = this.merchantsList.find(x => x.merchantId == element.merchantId);
                        expenseCategoryDetails.at(i).get('merchantId').setValue(data);
                    });
                }
            }
            this.cdRef.detectChanges();
        });
    }

    getExpenseCategories() {
        var expenseCategoryModel = new ExpenseCategoryModel();
        expenseCategoryModel.isArchived = false;
        this.expenseService.searchExpenseCategories(expenseCategoryModel).subscribe((response: any) => {
            if (response.success == true) {
                this.expenseCategoriesList = response.data;
                this.expenseCategoriesCopy = response.data;
                if (this.selectedExpenseDetails) {
                    let data = this.expenseCategoriesList.find(x => x.expenseCategoryId == this.selectedExpenseDetails.expenseCategoryId);
                    this.expenseForm.get('expenseCategoryId').setValue(data);
                }
                if (this.selectedExpenseDetails && this.selectedExpenseDetails.expenseCategoriesConfigurations.length > 1) {
                    let expenseCategoryDetails = this.expenseForm.get('expenseCategories') as FormArray;
                    this.selectedExpenseDetails.expenseCategoriesConfigurations.forEach((element, i) => {
                        let data = this.expenseCategoriesList.find(x => x.expenseCategoryId == element.expenseCategoryId);
                        expenseCategoryDetails.at(i).get('expenseCategoryId').setValue(data);
                    });
                }
            }
            this.cdRef.detectChanges();
        });
    }

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isArchived = false;
        userModel.isActive = true;
        this.expenseService.getAllUsers(userModel).subscribe((responseData: any) => {
            this.employeeList = responseData.data;
            const usersList = this.employeeList;
            if (this.selectedExpenseDetails) {
                const userId = this.selectedExpenseDetails.claimedByUserId;
                const filteredList = _.find(usersList, function (member : any) {
                    return member.id === userId;
                })
                if (filteredList) {
                    this.selectedMember = filteredList.fullName;
                    this.cdRef.markForCheck();
                }
            }
        })
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
                    this.expenseForm.get('branchId').setValue(this.loggedInUserBranchId);
                } else if (this.selectedExpenseDetails) {
                    let data = this.branchList.find(x => x.branchId == this.selectedExpenseDetails.branchId);
                    this.expenseForm.get('branchId').setValue(data);
                }
            }
            // if (this.selectedEditExpenseDetails) {
            //     this.setExpenseDetails(this.selectedEditExpenseDetails);
            // }
            this.cdRef.markForCheck();
        });
    }

    startDate() {
        if (this.expenseForm.value.expenseDate) {
            this.minDueDate = this.expenseForm.value.expenseDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
        }
    }

    upsertExpense() {
        let isNewExpense;
        this.isUpsertExpenseInprogress = true;
        this.isToClosePopup = true;
        let expenseDetails = this.expenseForm.value;
        if (expenseDetails.expenseName.trim() === '') {
            this.toastr.error("", this.translateService.instant('EXPENSECATEGORY.EMPTYEXPENSENAMEMESSAGE'));
            this.isUpsertExpenseInprogress = false;
            return;
        }
        else {
            this.expenseForm.value.expenseCategories.forEach(element => {
                element.expenseCategoryConfigurationId = element.expenseCategoryConfigurationId.value != null ? element.expenseCategoryConfigurationId.value
                    : element.expenseCategoryConfigurationId;
                if (element.expenseCategoryId && element.expenseCategoryId.expenseCategoryId) {
                    element.expenseCategoryId = element.expenseCategoryId.expenseCategoryId;
                }
                if (element.merchantId && element.merchantId.merchantId) {
                    element.merchantId = element.merchantId.merchantId;
                }
            });

            this.expenseDetails = this.expenseForm.value;
            if (this.expenseDetails) {
                if (this.expenseDetails.branchId && this.expenseDetails.branchId.branchId) {
                    this.expenseDetails.branchId = this.expenseDetails.branchId.branchId;
                }
                if (this.expenseDetails.expenseCategoryId && this.expenseDetails.expenseCategoryId.expenseCategoryId) {
                    this.expenseDetails.expenseCategoryId = this.expenseDetails.expenseCategoryId.expenseCategoryId;
                }
                if (this.expenseDetails.merchantId && this.expenseDetails.merchantId.merchantId) {
                    this.expenseDetails.merchantId = this.expenseDetails.merchantId.merchantId;
                }
            }
            if (this.selectedExpenseDetails) {
                this.expenseDetails.expenseId = this.selectedExpenseDetails.expenseId;
                this.expenseDetails.timeStamp = this.selectedExpenseDetails.timeStamp;
                this.expenseDetails.expenseStatusId = this.selectedExpenseDetails.expenseStatusId;
            }
            if (!this.expenseDetails.expenseId) {
                this.expenseDetails.isApproved = null;
                isNewExpense = true;
                
            }
            if (!this.isGroupingExpense) {
                this.expenseDetails.expenseCategories = [];
                let expenseCategoryModel = new ExpenseManagementConfigurationModel();
                expenseCategoryModel.expenseCategoryId = this.expenseDetails.expenseCategoryId;
                expenseCategoryModel.description = this.expenseDetails.description;
                expenseCategoryModel.amount = this.expenseDetails.amount;
                expenseCategoryModel.merchantId = this.expenseDetails.merchantId;
                expenseCategoryModel.expenseCategoryName = this.expenseDetails.expenseName;
                if (this.selectedExpenseDetails && this.selectedExpenseDetails.expenseCategoriesConfigurations && this.selectedExpenseDetails.expenseCategoriesConfigurations.length > 0) {
                    expenseCategoryModel.expenseCategoryConfigurationId = this.selectedExpenseDetails.expenseCategoriesConfigurations[0].expenseCategoryConfigurationId;
                }
                this.expenseDetails.expenseCategories.push(expenseCategoryModel);
            }
            // if (this.expenseDetails.branchId == "0") {
            //     this.expenseDetails.branchId = null;
            // }
            this.expenseDetails.cronExpression = this.cronExpression;
            this.expenseDetails.cronExpressionDescription = cronstrue.toString(this.cronExpression);
            this.expenseDetails.cronExpressionId = this.cronExpressionId;
            this.expenseDetails.cronExpressionTimeStamp = this.cronExpressionTimeStamp;
            this.expenseDetails.jobId = this.jobId;

            this.expenseService.upsertExpense(this.expenseDetails).subscribe((response: any) => {
                if (response.success == true) {
                    if (response.data) {
                        this.expenseId = response.data;
                        if(isNewExpense) {
                           this.assetReferenceId = this.expenseId;
                           this.cdRef.detectChanges();
                        }

                        this.isToUploadFiles = true;
                        // this.store.dispatch(new GetReferenceIdOfFile(response.data));
                    }
                    if (!this.isFileExist) {
                        // this.dialogRef.close();
                        this.closePopup.emit();
                        this.isToClosePopup = false;
                        this.clearForm();
                    }
                    this.expenseId = response.data;
                    this.isUpsertExpenseInprogress = false;
                }
                else {
                    this.isUpsertExpenseInprogress = false;
                    this.toastr.error(response.apiResponseMessages[0].message);
                }
            });
        }
    }

    upsertExpenseCategory(formDirective: FormGroupDirective) {
        if (!this.expenseCategoryForm.get('expenseCategoryName').value.toString().trim()) {
            this.toastr.error("", this.translateService.instant('EXPENSECATEGORY.CATEGORYNAMEREQUIREDERROR'));
        } else if (!this.expenseCategoryForm.get('accountCode').value.toString().trim()) {
            this.toastr.error("", "Account code is required");
        } else {
            this.isUpsertConfigurationDetailsInprogress = true;
            let expenseCategoryDetails = new ExpenseCategoryModel();
            expenseCategoryDetails = this.expenseCategoryForm.value;
            this.expenseService.upsertExpenseCategory(expenseCategoryDetails).subscribe((response: any) => {
                if (response.success == true) {
                    this.clearExpenseCategoryForm(formDirective);
                    this.addCategoryPopup.forEach((p) => p.closePopover());
                    this.getExpenseCategories();
                    this.isUpsertConfigurationDetailsInprogress = false;
                }
                else {
                    this.toastr.error(response.apiResponseMessages[0].message);
                    this.clearExpenseCategoryForm(formDirective);
                }
            });
        }
    }

    upsertMerchant(formDirective: FormGroupDirective) {
        if (this.merchantForm.get('merchantName').value.toString().trim()) {
            this.isUpsertConfigurationDetailsInprogress = true;
            let merchantDetails = new MerchantModel();
            merchantDetails = this.merchantForm.value;
            this.expenseService.upsertMerchant(merchantDetails).subscribe((response: any) => {
                if (response.success == true) {
                    this.addMerchantPopup.forEach((p) => p.closePopover());
                    this.clearMerchantForm(formDirective);
                    this.getMerchantsList();
                    this.isUpsertConfigurationDetailsInprogress = false;
                }
                else {
                    this.toastr.error(response.apiResponseMessages[0].message);
                    this.clearMerchantForm(formDirective);
                }
            });
        } else {
            this.toastr.error("", this.translateService.instant('MERCHANT.MERCHANTNAMEREQUIREDERROR'));
        }
    }

    closeExpenseForm() {
        if (this.isToClosePopup) {
            // this.dialogRef.close();
            this.closePopup.emit();
            this.isToClosePopup = false;
        }
    }

    cancelAddExpenseForm() {
        // this.dialogRef.close();
        this.closePopup.emit();
    }

    checkIsRecurring(addCronExpressionPopUp) {
        this.isRecurringExpense = this.expenseForm.get('isRecurringExpense').value;
        if (this.isRecurringExpense) {
            addCronExpressionPopUp.openPopover();
        }
    }

    checkIsClaimedByOthers() {
        let isClamibedByOthers = this.expenseForm.get('isClamibedByOthers').value;
        if (isClamibedByOthers) {
            this.expenseForm.get('claimedByUserId').setValidators(Validators.required);
            this.expenseForm.get('claimedByUserId').updateValueAndValidity();
            this.expenseForm.get('claimedByUserId').setValue(this.claimedByUserId);
        } else {
            this.expenseForm.get('claimedByUserId').clearValidators();
            this.expenseForm.get('claimedByUserId').updateValueAndValidity();
            this.expenseForm.get('claimedByUserId').setValue(null);
        }
    }

    onUserSelected(event) {
        this.claimedByUserId = event.value;
        const usersList = this.employeeList;
        const filteredList = _.find(usersList, function (member : any) {
            return member.id === event.value;
        })
        if (filteredList) {
            this.selectedMember = filteredList.fullName;
            this.cdRef.markForCheck();
        }
    }

    editCronExpressionPopup(addCronExpressionPopUp) {
        addCronExpressionPopUp.openPopover();
    }

    closeCronExpressionPopUp() {
        this.addCronExpressionPopUp.forEach((p) => p.closePopover());
        this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
    }

    cancelCronExpressionPopup() {
        this.addCronExpressionPopUp.forEach((p) => p.closePopover());
        if (this.cronExpressionId) {
            this.expenseForm.get('isRecurringExpense').setValue(true);
            this.isRecurringExpense = true;
            this.cronExpression = this.cronExpression;
            this.cronExpressionDescription = cronstrue.toString(this.cronExpression);
        } else {
            this.expenseForm.get('isRecurringExpense').setValue(false);
        }
        this.cdRef.detectChanges();
    }

    checkIsGrouping() {
        this.isGroupingExpense = this.expenseForm.get('isGroupingExpense').value;
        if (this.isGroupingExpense && this.expenseId) {
            this.expenseForm.get('expenseCategoryId').clearValidators();
            this.expenseForm.get('expenseCategoryId').updateValueAndValidity();
            this.expenseForm.get('amount').clearValidators();
            this.expenseForm.get('amount').updateValueAndValidity();
            this.expenseForm.get('description').clearValidators();
            this.expenseForm.get('description').updateValueAndValidity();
            this.selectedExpenseDetails.expenseCategoriesConfigurations.forEach(element => {
                this.addItem(element);
            });
            this.calculateTotalAmount();
        }
        else if (this.isGroupingExpense) {
            this.expenseForm.get('expenseCategoryId').clearValidators();
            this.expenseForm.get('expenseCategoryId').updateValueAndValidity();
            this.expenseForm.get('amount').clearValidators();
            this.expenseForm.get('amount').updateValueAndValidity();
            this.expenseForm.get('description').clearValidators();
            this.expenseForm.get('description').updateValueAndValidity();
            this.expenseCategoryDetails = this.expenseForm.get('expenseCategories') as FormArray;
            this.expenseCategoryDetails.insert(1, this.createItem(null));
        } else {
            this.expenseForm.get('expenseCategoryId').setValidators(Validators.required);
            this.expenseForm.get('expenseCategoryId').updateValueAndValidity();
            this.expenseForm.get('amount').setValidators(Validators.required);
            this.expenseForm.get('amount').updateValueAndValidity();
            this.expenseForm.get('description').setValidators(Validators.maxLength(ConstantVariables.CommentsMaxLength));
            this.expenseForm.get('description').updateValueAndValidity();
            this.formBuilder.array([]);
            const control = <FormArray>this.expenseForm.controls['expenseCategories'];
            for (let i = control.length - 1; i >= 0; i--) {
                control.removeAt(i)
            }
        }
    }

    addItem(details: any) {
        this.expenseCategoryDetails = this.expenseForm.get('expenseCategories') as FormArray;
        this.expenseCategoryDetails.insert(this.length, this.createItem(details));
        this.length = this.length + 1;
    }

    removeItem(index: number) {
        const expenseId = this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value.value != null ? this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value.value
            : this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value;
        var deleteFileModel = new DeleteFileInputModel();
        deleteFileModel.referenceId = expenseId;
        this.storeService.DeleteFileByReferenceId(deleteFileModel).subscribe((response: any) => {
            if (response.success == true) {
                (<FormArray>this.expenseForm.get('expenseCategories')).removeAt(index);
                this.calculateTotalAmount();
                this.length = this.length - 1;
            }
            this.cdRef.detectChanges();
        });
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.closePopover();
    }

    closePopover() {
        this.clearForm();
        this.dialogRef.close();
    }

    calculateTotalAmount() {
        let totalAmount: any = 0;
        if (this.expenseCategoryDetails && this.expenseCategoryDetails.controls) {
            this.expenseCategoryDetails.controls.forEach((x: any) => {
                let result: number;
                result = x.get('amount').value == null ? 0 : +(x.get('amount').value);
                totalAmount = totalAmount + result;
            });
            this.totalAmount = totalAmount;
        }
    }

    openStepExpectedPopover(index, receiptsFileUploadPopover) {
        receiptsFileUploadPopover.openPopover();
        const expenseId = this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value.value != null ? this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value.value
            : this.expenseCategoryDetails.controls[index].get("expenseCategoryConfigurationId").value;
        this.referenceId = expenseId;
    }

    closereceiptsPopup() {
        this.receiptsFileUploadPopup.forEach((p) => p.closePopover());
        this.referenceId = this.expenseId;
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

    disabledButton(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            this.searchExpenses(searchText);
        }
    }

    searchMerchants(enteredText, searchText) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
        } else {
            const temp = this.merchantsListCopy.filter((merchant => (merchant.merchantName.toLowerCase().indexOf(searchText) > -1)));
            this.merchantsList = temp;
        }
    }

    onMerchantBlur(value, index) {
        let details = this.merchantsListCopy.find(x => x.merchantName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            if (index != null) {
                let data = this.expenseForm.get('expenseCategories') as FormArray;
                data.at(index).get('merchantId').setValue(details.merchantId);
            } else {
                this.expenseForm.get('merchantId').setValue(details.merchantId);
            }
        } else {
            if (index != null) {
                let data = this.expenseForm.get('expenseCategories') as FormArray;
                data.at(index).get('merchantId').setValue(null);
            } else {
                this.expenseForm.get('merchantId').setValue(null);
            }
        }
    }

    onCategoryBlur(value, index) {
        let details = this.expenseCategoriesCopy.find(x => x.categoryName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            if (index != null) {
                let data = this.expenseForm.get('expenseCategories') as FormArray;
                data.at(index).get('expenseCategoryId').setValue(details.expenseCategoryId);
            } else {
                this.expenseForm.get('expenseCategoryId').setValue(details.expenseCategoryId);
            }
        } else {
            if (index != null) {
                let data = this.expenseForm.get('expenseCategories') as FormArray;
                data.at(index).get('expenseCategoryId').setValue(null);
            } else {
                this.expenseForm.get('expenseCategoryId').setValue(null);
            }
        }
    }

    onBranchBlur(value) {
        let details = this.branchListCopy.find(x => x.branchName.toString().toLowerCase().trim() == value.toString().toLowerCase().trim());
        if (details) {
            this.expenseForm.get('branchId').setValue(details.branchId);
        } else {
            this.expenseForm.get('branchId').setValue(null);
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
            this.expenseCategoriesList = temp;
        }
    }

    selectedExpense(event) {
        this.expenseForm.get('expenseName').setValue(event.option.value);
    }

    selectedMerchant(event, index) {
        if (index != null) {
            let data = this.expenseForm.get('expenseCategories') as FormArray;
            data.at(index).get("merchantId").setValue(event.option.value.merchantId);
        } else {
            this.expenseForm.get('merchantId').setValue(event.option.value.merchantId);
        }
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
        if (index != null) {
            let data = this.expenseForm.get('expenseCategories') as FormArray;
            data.at(index).get("expenseCategoryId").setValue(event.option.value.expenseCategoryId);
        } else {
            this.expenseForm.get('expenseCategoryId').setValue(event.option.value.expenseCategoryId);
        }
    }

    displayCategoryFn(category?: any): string | undefined {
        if (category != null && category.expenseCategoryId != null) {
            return category ? category.categoryName : undefined;
        } else if (this.expenseCategoriesCopy) {
            let details = this.expenseCategoriesCopy.find(x => x.expenseCategoryId == category);
            if (details) return details.categoryName;
        }
    }

    selectedBranch(event) {
        this.expenseForm.get('branchId').setValue(event.option.value.branchId);
    }

    displayBranchFn(branch?: any): string | undefined {
        if (branch != null && branch.branchId != null) {
            return branch ? branch.branchName : undefined;
        } else if (this.branchListCopy) {
            let details = this.branchListCopy.find(x => x.branchId == branch);
            if (details) return details.branchName;
        }
    }

    getExpenseFormLength() {
        return ((this.expenseForm.get('expenseCategories') as FormArray).length - 1);
    }
}