import { Component, Output, EventEmitter, Inject, ViewChild } from "@angular/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { PayGradeModel } from "../../models/pay-grade-model";
import { PayFrequencyModel } from "../../models/pay-frequency-model";
import { Currency } from '../../models/currency';
import { PaymentMethodModel } from "../../models/payment-method-model";
import { EmployeeSalaryDetailsModel } from "../../models/employee-salary-details-model";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import * as fileReducer from "@snovasys/snova-file-uploader";

import { LoadPayGradeTriggered } from "../../store/actions/pay-grade.actions";
import { LoadPayFrequencyTriggered } from "../../store/actions/pay-frequency.actions";
import { LoadPaymentMethodTriggered } from "../../store/actions/payment-method.actions";
import { EmployeeSalaryDetailsActionTypes, CreateEmployeeSalaryDetailsTriggered } from "../../store/actions/employee-salary-details.actions";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LoadCurrencyTriggered } from '../../store/actions/currency.actions';
import { EmployeeService } from '../../services/employee-service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { TakeHomeAmountDialog } from './takehomeamount-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { TaxCalculationTypeModel } from '../../models/taxcalculationtypemodel';

// tslint:disable-next-line: interface-name
export interface DialogData {
    employeeId: string;
    editSalaryDetailsData: EmployeeSalaryDetailsModel;
    isPermission: boolean;
    employeeSalaryDetailsList: EmployeeSalaryDetailsModel[];
}

@Component({
    selector: "app-hr-component-add-salary-details",
    templateUrl: "add-salary-details.component.html"
})


export class AddSalaryDetailsComponent extends CustomAppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();

    @ViewChild("formDirective") formDirective: FormGroupDirective;


    employeeSalaryDetails: EmployeeSalaryDetailsModel;

    employeeSalaryDetailsForm: FormGroup;

    isAccessPayRollTemplate: Boolean;


    minDateForEndDate = new Date();
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    selectedCurrencyId: string = "";
    selectedPayGradeId: string = "";
    employeeSalaryDetailsId: string = "";
    selectedPayFrequencyId: string = "";
    selectedPaymentMethodId: string = "";
    endDateBool: boolean = true;
    moduleTypeId = 1;
    referenceTypeId = ConstantVariables.SalaryReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isFileExist: boolean;
    employeeTemplates: any[];
    currencyList$: Observable<Currency[]>
    selectPayFrequencyListData$: Observable<PayFrequencyModel[]>
    selectPaymentMethodListData$: Observable<PaymentMethodModel[]>
    selectPayGradeListData$: Observable<PayGradeModel[]>
    upsertEmployeeSalaryDetailsInProgress$: Observable<boolean>
    anyOperationInProgress$: Observable<boolean>;
    public ngDestroyed$ = new Subject();
    netPayLimit: number = 0;
    isDatesvalid: boolean = true;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    validationMessage: string;
    isShow: boolean;
    empSalaryDetailsId: string;
    isToUploadFiles: boolean = false;
    taxCalculationTypes: TaxCalculationTypeModel[];

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions,
        private employeeService: EmployeeService,
        private store: Store<State>, public dialogRef: MatDialogRef<AddSalaryDetailsComponent>, public dialog: MatDialog,
        private toastr: ToastrService,
        private translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted),
                tap((result: any) => {
                    if (result.employeeSalaryDetailId) {
                        this.empSalaryDetailsId = result.employeeSalaryDetailId;
                        this.isShow = true;
                        if (this.isAccessPayRollTemplate) {
                            this.changeTemplate();
                        }
                        else {
                            this.closeFilePopup();
                        }
                    }
                    this.store.pipe(select(hrManagementModuleReducer.getEmployeeSalaryDetailsIdOfUpsertSalaryDetails)).subscribe(result => {
                        this.employeeSalaryDetailsId = result;
                    });
                    this.isToUploadFiles = true;
                })
            )
            .subscribe();

        const upsertingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.createFileLoading));
        const uploadingFilesInProgress$: Observable<boolean> = this.store.pipe(select(fileReducer.getFileUploadLoading));

        this.anyOperationInProgress$ = combineLatest(
            uploadingFilesInProgress$,
            upsertingFilesInProgress$
        ).pipe(map(
            ([
                uploadingFilesInProgress,
                upsertingFilesInProgress
            ]) =>
                uploadingFilesInProgress ||
                upsertingFilesInProgress
        ));
    }

    ngOnInit() {
        super.ngOnInit();
        this.salaryDetailsForm();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeSalaryDetails$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeSalaryDetails = result;
        // })
        // this.canAccess_feature_ConfigureEmployeePayrollTemplates$.subscribe(result => {
        //     this.isAccessPayRollTemplate = result;
        // })
        this.isAccessPayRollTemplate = this.canAccess_feature_ConfigureEmployeePayrollTemplates;
        if ((this.canAccess_feature_AddOrUpdateEmployeeSalaryDetails && this.data.isPermission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getCurrencyList();
            this.getPayGradeList();
            this.getPayFrequencyList();
            this.getPaymentMethodList();
            this.getPayrolltemplates();
            this.getTaxCalculationTypes();
        }
        if (this.data.editSalaryDetailsData) {
            this.salaryDetailsForm();
            this.employeeSalaryDetailsForm.patchValue(this.data.editSalaryDetailsData);
            this.setNetPayMaxValue();
            this.employeeSalaryDetailsId = this.data.editSalaryDetailsData.employeeSalaryDetailId;
            this.empSalaryDetailsId = this.data.editSalaryDetailsData.employeeSalaryDetailId;
            this.startDate();
            this.isShow = false;
            this.changeTemplate();
        }
    }

    ngAfterViewInit() {
        (document.querySelector(".mat-dialog-padding") as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    filesExist(event) {
        this.isFileExist = event;
    }

    closeFilePopup() {
        this.salaryDetailsForm();
        this.closePopover();
        this.onNoClick();
    }

    getCurrencyList() {
        this.store.dispatch(new LoadCurrencyTriggered());
        this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
    }

    getPayGradeList() {
        const payGradeModel = new PayGradeModel();
        payGradeModel.isArchived = false;
        this.store.dispatch(new LoadPayGradeTriggered(payGradeModel));
        this.selectPayGradeListData$ = this.store.pipe(select(hrManagementModuleReducer.getPayGradeAll));
    }

    getPayFrequencyList() {
        const payFrequencyModel = new PayFrequencyModel();
        payFrequencyModel.isArchived = false;
        this.store.dispatch(new LoadPayFrequencyTriggered(payFrequencyModel));
        this.selectPayFrequencyListData$ = this.store.pipe(select(hrManagementModuleReducer.getPayFrequencyAll));
    }

    getPayrolltemplates() {
        this.employeeService.getEmployeesPayTemplates().subscribe((responseData: any) => {
            this.employeeTemplates = responseData.data;
            this.employeeTemplates = this.employeeTemplates.filter(template => (template.employeeId == this.data.employeeId));
        })
    }

    getPaymentMethodList() {
        const paymentMethodModel = new PaymentMethodModel();
        paymentMethodModel.isArchived = false;
        this.store.dispatch(new LoadPaymentMethodTriggered(paymentMethodModel));
        this.selectPaymentMethodListData$ = this.store.pipe(select(hrManagementModuleReducer.getPaymentMethodAll));
    }

    getTaxCalculationTypes() {
        this.isAnyOperationIsInprogress = true;
        var taxCalculationTypeModel = new TaxCalculationTypeModel();
        taxCalculationTypeModel.isArchived = false;
        taxCalculationTypeModel.employeeId = this.data.employeeId;
        this.employeeService.getTaxCalculationTypes(taxCalculationTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.taxCalculationTypes = response.data;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }
    
    onNoClick(): void {
        this.formDirective.resetForm();
        this.dialogRef.close();
    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeSalaryDetailsId && this.data.editSalaryDetailsData) {
            this.employeeSalaryDetailsForm.patchValue(this.data.editSalaryDetailsData);
            this.startDate();
        } else {
            this.salaryDetailsForm();
        }
        this.closePopup.emit("");
    }

    setNetPayMaxValue() {
        this.netPayLimit = this.employeeSalaryDetailsForm.get('amount').value;
        console.log(this.netPayLimit);
        this.employeeSalaryDetailsForm.controls["netPayAmount"].setValidators([Validators.max(this.netPayLimit)]);

        this.employeeSalaryDetailsForm.get("netPayAmount").updateValueAndValidity();
    }

    salaryDetailsForm() {
        console.log(this.netPayLimit);
        this.employeeSalaryDetailsForm = new FormGroup({
            payGradeId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            salaryComponent: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                ])
            ),
            payFrequencyId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            paymentMethodId: new FormControl("",
                Validators.compose([

                ])
            ),
            currencyId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            amount: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.max(9999999999999),
                    Validators.min(0)
                ])
            ),
            netPayAmount: new FormControl("",
                Validators.compose([
                    Validators.max(9999999999998),
                    Validators.min(0)
                ])
            ),
            comments: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)
                ])
            ),
            payrollTemplateId: new FormControl(null,
            ),
            takeHomeAmount: new FormControl(null,
            ),
            taxCalculationTypeId: new FormControl(null,
            ),
        });
        this.endDateBool = true;
    }

    startDate() {
        if (this.employeeSalaryDetailsForm.value.startDate) {
            this.minDateForEndDate = this.employeeSalaryDetailsForm.value.startDate;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeSalaryDetailsForm.controls["endDate"].setValue("");
        }
    }

    saveEmployeeSalaryDetails() {
        this.isToUploadFiles = false;
        let employeeSalaryDetails = new EmployeeSalaryDetailsModel();
        employeeSalaryDetails = this.employeeSalaryDetailsForm.value;
        employeeSalaryDetails.employeeId = this.data.employeeId;
        employeeSalaryDetails.isArchived = false;
        if (this.employeeSalaryDetailsId) {
            employeeSalaryDetails.employeeSalaryDetailId = this.employeeSalaryDetailsId;
            employeeSalaryDetails.timeStamp = this.data.editSalaryDetailsData.timeStamp;
        }
        else {
            this.isShow = true;
        }
        this.store.dispatch(new CreateEmployeeSalaryDetailsTriggered(employeeSalaryDetails));
        this.upsertEmployeeSalaryDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeSalaryDetailLoading));
    }

    checkDateRangesForTemplates() {
        var startDate = new Date(this.employeeSalaryDetailsForm.get('startDate').value);
        var endDate = new Date(this.employeeSalaryDetailsForm.get('endDate').value);
        if(startDate ! = null){
        var result = this.data.employeeSalaryDetailsList.filter(salary => ((new Date(salary.startDate) <= startDate && (endDate != null ? new Date(salary.endDate) >= startDate : true)) || (endDate != null && new Date(salary.startDate) <= endDate && new Date(salary.endDate) >= endDate)));
        if (result.length > 0) {
            this.isDatesvalid = false;

        } else {
            this.isDatesvalid = true;
        }
      }
    }

    changeTemplate() {
        this.isAnyOperationIsInprogress = true;
        if (this.empSalaryDetailsId) {
            this.employeeService.getTakeHomeAmount(this.empSalaryDetailsId).subscribe((response: any) => {
                if (response.data == null) {
                    response.data = 0
                }
                if (response.success == true) {
                    if (response.data != null) {
                        this.employeeSalaryDetailsForm.get("takeHomeAmount").setValue(response.data)
                    }
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error(this.translateService.instant("PAYROLL.CONTACTADMINISTRATORMESSAGE"));
                    this.isAnyOperationIsInprogress = false;
                }
                if (this.isShow) {
                    this.isShow = false;
                    this.openTakeHomeAmountDialog(response.data);
                }
            });
        }
    }
    openTakeHomeAmountDialog(takeHomeAmount): void {
        const dialogRef = this.dialog.open(TakeHomeAmountDialog, {
            disableClose: true,
            data: { takeHomeAmount: takeHomeAmount }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.closeFilePopup();
            console.log('The dialog was closed');
        });
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}