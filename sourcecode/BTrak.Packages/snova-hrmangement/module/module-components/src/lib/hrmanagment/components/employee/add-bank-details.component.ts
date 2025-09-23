import { Component, Output, EventEmitter, Input, ViewChildren, ViewChild } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { CreateEmployeeBankDetailsTriggered, EmployeeBankDetailsActionTypes, RefreshEmployeeBankDetailsList, LoadEmployeeBankDetailsTriggered, GetEmployeeBankDetailsByIdTriggered } from "../../store/actions/employee-bank-details.actions";
import { EmployeeBankDetailsModel } from "../../models/employee-bank-details-model";
import { MatDialog } from "@angular/material/dialog";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { BankModel } from '../../models/bankmodel';
import { ToastrService } from 'ngx-toastr';
import { HRManagementService } from '../../services/hr-management.service';
import { CountryModel } from '../../models/countries-model';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
@Component({
    selector: "app-hr-component-add-bank-details",
    templateUrl: "add-bank-details.component.html"
})

export class AddBankDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("upsertBankPopUp") upsertBankPopover;
    countries: any;
    upsertBankIsInprogress: boolean;
    isThereAnError: boolean;
    
    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editBankDetails")
    set editBankDetails(data: EmployeeBankDetailsModel) {
        
        if (!data) {
            this.employeeBankDetails = null;
            this.employeeBankDetailsId = null;
            this.BankDetailsForm();
        } else {
            this.employeeBankDetails = data;
            this.employeeBankDetailsId = data.employeeBankId;
            this.employeeBankDetailsForm.patchValue(data);
        }
    }
    @Output() closePopup = new EventEmitter<string>();

    validationMessage: any;
    employeeBankDetailsForm: FormGroup;
    formId: FormGroupDirective;
    Bank: EmployeeBankDetailsModel;
    employeeBankDetails: EmployeeBankDetailsModel;
    maxDate = new Date();
    minDateForCommenceDate = new Date();
    selectedBankLevelId: string = "";
    selectedSubscriptionPaidByOptionsId: string = "";
    selectedBankId: string = "";
    selectedCurrencyId: string = "";
    employeeId: string;
    employeeBankDetailsId: string = "";
    commenceDate: boolean = true;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    minDate = new Date(1753, 0, 1);
    bankForm: FormGroup;
    upsertEmployeeBankDetailsInProgress$: Observable<boolean>;
    employeeBankDetailsList$: Observable<EmployeeBankDetailsModel[]>;
    bankList: BankModel[] = [];
    public ngDestroyed$ = new Subject();
    moduleTypeId = 1;
    bankModel: BankModel;

    constructor(private actionUpdates$: Actions, private store: Store<State>,private toastr: ToastrService,private hrManagementService: HRManagementService) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsCompleted),
                tap(() => {
                    this.BankDetailsForm();
                    this.closePopover(this.formId);
                })
            )
            .subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeBankDetailsActionTypes.UpdateEmployeeBankDetailsById),
                tap(() => {
                    this.BankDetailsForm();
                    this.closePopover(this.formId);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsCompleted),
                tap(() => {
                    this.employeeBankDetailsList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeBankDetailsAll))
                    this.employeeBankDetailsList$.subscribe((result) => {
                        this.maxDate = result.length > 0 ? result[0].effectiveFrom : null;
                    });
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.BankDetailsForm();
        this.clearBankForm();
        this.getCountries();
        this.getAllBanks();
    }

    clearBankForm() {
        this.bankForm = new FormGroup({
            bankName: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    BankDetailsForm() {
        this.employeeBankDetailsForm = new FormGroup({
            ifscCode: new FormControl("",
                Validators.compose([
                    Validators.pattern("^[A-Za-z]{4}[0-9]{7}$")
                ])
            ),
            accountNumber: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ),
            accountName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            buildingSocietyRollNumber: new FormControl("",
                Validators.compose([
                    Validators.maxLength(50)
                ])
            ),
            bankId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            branchName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            effectiveFrom: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(20)
                ])
            ),
            effectiveTo: new FormControl("",
            )
        });
    }

    saveEmployeeBankDetails(formDirective: FormGroupDirective) {
        let employeeBankDetails = new EmployeeBankDetailsModel();
        employeeBankDetails = this.employeeBankDetailsForm.value;
        employeeBankDetails.employeeId = this.employeeId;
        employeeBankDetails.isArchived = false;
        if (this.employeeBankDetailsId) {
            employeeBankDetails.employeeBankId = this.employeeBankDetails.employeeBankId;
            employeeBankDetails.timeStamp = this.employeeBankDetails.timeStamp;
        }

        this.store.dispatch(new CreateEmployeeBankDetailsTriggered(employeeBankDetails));
        this.upsertEmployeeBankDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeBankDetailLoading));
        this.formId = formDirective
        // if(employeeBankDetails.employeeBankId){
        //     this.store.dispatch(new GetEmployeeBankDetailsByIdTriggered(employeeBankDetails.employeeBankId))
        // }
    }

    closePopover(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.employeeBankDetailsId) {
            this.employeeBankDetailsForm.patchValue(this.employeeBankDetails);
        } else {
            this.BankDetailsForm();
        }
        this.closePopup.emit("");
    }

    startDate() {
        if (this.employeeBankDetailsForm.value.effectiveFrom) {
            this.minDateForEndDate = this.employeeBankDetailsForm.value.effectiveFrom;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.employeeBankDetailsForm.controls["effectiveTo"].setValue("");
        }
    }
    
    getAllBanks() {
        var bankModel = new BankModel();
        bankModel.isArchived = false;
        bankModel.isApp = false;
        bankModel.employeeId = this.employeeId;
        this.hrManagementService.getAllBanks(bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.bankList = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    createBankPopupOpen(upsertBankPopUp) {
        upsertBankPopUp.openPopover();
    }

    closeUpsertBankPopUp(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearBankForm();
        this.upsertBankPopover.closePopover();
    }

    getCountries() {
        var companymodel = new CountryModel();
        companymodel.isArchived = false;
        this.hrManagementService.getCountries(companymodel).subscribe((response: any) => {
            if (response.success == true) {
                this.countries = response.data;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    upsertBank(formDirective: FormGroupDirective) {
        this.upsertBankIsInprogress = true;
        this.bankModel = this.bankForm.value;
        this.hrManagementService.upsertBank(this.bankModel).subscribe((response: any) => {
            if (response.success == true) {
                this.getAllBanks();
                this.closeUpsertBankPopUp(formDirective);
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
        this.upsertBankIsInprogress = false;
    }
}
