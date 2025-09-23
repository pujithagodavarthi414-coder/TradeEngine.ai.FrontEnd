import { Component, EventEmitter, Inject, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Currency } from '../../models/currency';
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { State } from "../../store/reducers/index";
import { EmployeeRateSheetModel } from "../../models/employee-ratesheet-model";
import { CreateEmployeeRateSheetDetailsTriggered, EmployeeRateSheetDetailsActionTypes, UpdateEmployeeRateSheetDetailsTriggered, UpdateEmployeeRateSheetDetailsCompleted } from "../../store/actions/employee-ratesheet-details.actions";
import { GetRateSheetForTriggered, RateSheetForDetailsActionTypes } from "../../store/actions/ratesheetfor-actions";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import { EmployeeRateSheetInsertModel } from "../../models/employee-ratesheet-insert-model";
import { UserService } from "../../services/user.Service";
import { CurrencyModel } from '../../models/currency-model';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { LoadCurrencyTriggered } from '../../store/actions/currency.actions';
import { Page } from '../../models/Page';
import { RateSheetForModel } from '../../models/ratesheet-for-model';
import { RateSheetModel } from '../../models/ratesheet-model';
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CompanyDetailsModel } from '../../models/company-details-model';
import { CompanyFormats } from '../../models/company-formats';
import '../../../globaldependencies/helpers/fontawesome-icons';

// tslint:disable-next-line: interface-name
export interface DialogData {
    employeeId: string;
    editRateSheetData: EmployeeRateSheetModel;
    isPermission: boolean;
}

@Component({
    selector: "app-hr-component-add-ratesheet-details",
    templateUrl: "add-ratesheet-details.component.html"
})

export class AddRateSheetDetailsComponent extends CustomAppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();

    @ViewChild("rateSheetFormDirective") rateSheetFormDirective: FormGroupDirective;

    employeeRateSheetId: string;
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetForm: FormGroup;
    rateSheetForList: RateSheetForModel[];
    isIndividual: boolean;
    rateSheetInsertDetails: any;
    rows = [];
    isEditable = {};
    page = new Page();
    currencyList: CurrencyModel[];
    selectedRateSheet: RateSheetModel[];
    loggedUserDetails: any;
    company: CompanyDetailsModel;
    selectedCurrency: CurrencyModel;
    checked: number = 0;
    showColumn: boolean;

    currencyList$: Observable<Currency[]>
    rateSheetForList$: Observable<RateSheetForModel[]>
    upsertEmployeeRateSheetDetailsInProgress$: Observable<boolean>
    public ngDestroyed$ = new Subject();
    isAnyOperationIsInprogress: boolean;
    totalCount: number;
    rateSheetData$: Observable<RateSheetModel[]>;

    // tslint:disable-next-line: max-line-length
    constructor(private cookieService: CookieService, private actionUpdates$: Actions,
        private store: Store<State>, public dialogRef: MatDialogRef<AddRateSheetDetailsComponent>, private userService: UserService,
        private toastr: ToastrService, private translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, public hrManagementService: HRManagementService,
        private cdRef: ChangeDetectorRef) {
        super();
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = CompanyFormats.CurrencyCode;
        if(this.data.editRateSheetData) {
            this.employeeRateSheetId = this.data.editRateSheetData.employeeRateSheetId;
        }
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsCompleted),
                tap(() => {
                    this.closePopover();
                    this.onNoClick();
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsFailed),
                tap((response: any) => {
                    if (response && response.validationMessages && response.validationMessages.length > 0) {
                        this.toastr.error("", response.validationMessages[0].message);
                        this.cdRef.detectChanges();
                    }
                })
            )
            .subscribe();

        // tslint:disable-next-line: max-line-length
        this.upsertEmployeeRateSheetDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeRateSheetDetailLoading));

        // this.rateSheetForList$ = this.store.pipe(select(hrManagementModuleReducer.getRateSheetForDetailsAll));
        // this.rateSheetForList$.subscribe((result) => {
        //     this.rateSheetForList = result;
        // });
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsCompleted),
                tap((result: any) => {
                    this.closePopover();
                    this.onNoClick();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(RateSheetForDetailsActionTypes.GetRateSheetForCompleted),
                tap((result: any) => {
                    this.rateSheetForList = result.rateSheetForDetails;
                    this.closePopover();
                    if (this.data.editRateSheetData) {
                        this.rateSheetForm();
                        this.employeeRateSheetForm.patchValue(this.data.editRateSheetData);
                        this.employeeRateSheetId = this.data.editRateSheetData.employeeRateSheetId;
                        this.setValidator(null);
                    }

                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.rateSheetForm();
        super.ngOnInit();
        this.rateSheetInsertDetails = new EmployeeRateSheetInsertModel();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe((result) => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // });
        // this.canAccess_feature_ManageEmployeeRatesheet$.subscribe((result) => {
        //     this.canAccess_feature_ManageEmployeeRatesheet = result;
        // });
        if ((this.canAccess_feature_ManageEmployeeRatesheet) ||
            this.canAccess_feature_CanEditOtherEmployeeDetails) {
            this.getCurrencyList();
            this.getRateSheetFor();
        }

        this.getLoggedInUser();
        this.page.pageNumber = 0;
        this.page.size = 5;
        this.getAllRateSheets();
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getAllRateSheets();
    }

    getLoggedInUser() {
        this.userService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUserDetails = responseData.data;
            this.getCompanyDetails(this.loggedUserDetails.companyId);
        });
    }

    getCompanyDetails(companyId: string) {
        //this.commonService.GetCompanyById(companyId).subscribe((response: any) => {
        this.company = this.cookieService.check(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company && this.company.currencyId) {
            this.selectedCurrency = this.currencyList.find((x) => x.sysCurrencyId == this.company.currencyId);
            if (this.selectedCurrency) {
                this.rateSheetInsertDetails.rateSheetCurrencyId = this.selectedCurrency.currencyId;
            } else {
                this.selectedCurrency = new CurrencyModel();
                this.selectedCurrency.currencyCode = CompanyFormats.CurrencyCode;
            }
        }
        if (this.selectedCurrency && !this.selectedCurrency.currencyId) {
            this.selectedCurrency = this.currencyList.find((x) => x.currencyCode == CompanyFormats.CurrencyCode);
            if (this.selectedCurrency) {
                this.rateSheetInsertDetails.rateSheetCurrencyId = this.selectedCurrency.currencyId;
            }
            this.selectedCurrency.currencyCode = CompanyFormats.CurrencyCode;
        }
        //});
    }

    ngAfterViewInit() {
        (document.querySelector(".mat-dialog-padding") as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    // Save row
    save(row, rowIndex) {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex]
        row.isSelected = true;
    }

    // Delete row
    delete(row, rowIndex) {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex]
    }

    getCurrencyList() {
        let currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;

        this.hrManagementService.getCurrencies(currencyModel).subscribe((response: any) => {
            this.currencyList = response.data;
        });

        this.store.dispatch(new LoadCurrencyTriggered());
        this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
        this.currencyList$.subscribe((currency) => {
            console.log(currency);
        });
    }

    getAllRateSheets() {
        this.isAnyOperationIsInprogress = true;
        const rateSheetModel = new RateSheetModel();
        rateSheetModel.isArchived = false;
        rateSheetModel.pageNumber = this.page.pageNumber + 1;
        rateSheetModel.pageSize = this.page.size;
        this.rateSheetData$ = this.hrManagementService.getAllRateSheets(rateSheetModel) as Observable<RateSheetModel[]>;
        this.rateSheetData$.subscribe((response: any) => {
            if (response.success == true && response.data && response.data.length > 0) {
                this.rateSheetInsertDetails.rateSheetDetails = response.data;
                this.isAnyOperationIsInprogress = false;
                this.totalCount = response.data[0].totalCount
            } else {
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closePopover() {
        if (this.rateSheetFormDirective) {
            this.rateSheetFormDirective.resetForm();
            if (this.employeeRateSheetId) {
                this.employeeRateSheetForm.patchValue(this.data.editRateSheetData);
            } else {
                this.rateSheetForm();
            }
        }
        this.closePopup.emit("");
    }

    rateSheetForm() {
        this.employeeRateSheetForm = new FormGroup({
            rateSheetName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            rateSheetForId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            rateSheetStartDate: new FormControl(null),
            rateSheetEndDate: new FormControl(null),
            rateSheetCurrencyId: new FormControl(null),
            ratePerHour: new FormControl(null),
            ratePerHourMon: new FormControl(null),
            ratePerHourTue: new FormControl(null),
            ratePerHourWed: new FormControl(null),
            ratePerHourThu: new FormControl(null),
            ratePerHourFri: new FormControl(null),
            ratePerHourSat: new FormControl(null),
            ratePerHourSun: new FormControl(null)
        });
    }

    getRateSheetFor() {
        this.store.dispatch(new GetRateSheetForTriggered(new RateSheetForModel()));
    }

    saveEmployeeRateSheetDetails(isInsert: boolean) {

        if (isInsert) {
            if (new Date(this.rateSheetInsertDetails.rateSheetEndDate.toDate().toDateString()) < new Date(new Date().toDateString())) {
                let validationMessage = this.translateService.instant("RATESHEET.PLEASEENTERVALIDENDDATE");
                this.toastr.error(validationMessage);
                return;
            }
            if (this.rateSheetInsertDetails.rateSheetDetails.filter((x) => x.isSelected).length > 0) {
                let ratesheetInsertData = Object.assign({}, this.rateSheetInsertDetails);
                ratesheetInsertData.rateSheetEmployeeId = this.data.employeeId;
                ratesheetInsertData.rateSheetDetails = this.rateSheetInsertDetails.rateSheetDetails.filter((x) => x.isSelected);

                this.store.dispatch(new CreateEmployeeRateSheetDetailsTriggered(ratesheetInsertData));
                this.upsertEmployeeRateSheetDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeRateSheetDetailLoading));
            } else {
                let validationMessage = this.translateService.instant("RATESHEET.PLEASESELECTONERATESHEET");
                this.toastr.error(validationMessage);
            }
        } else {
            if (new Date(this.employeeRateSheetForm.value.rateSheetEndDate) < new Date(new Date().toDateString())) {
                let validationMessage = this.translateService.instant("RATESHEET.PLEASEENTERVALIDENDDATE");
                this.toastr.error(validationMessage);
                return;
            }
            let employeeRateSheetDetails = new EmployeeRateSheetModel();
            employeeRateSheetDetails = this.employeeRateSheetForm.value;
            employeeRateSheetDetails.rateSheetEmployeeId = this.data.employeeId;
            employeeRateSheetDetails.rateSheetId = this.data.editRateSheetData.rateSheetId;
            employeeRateSheetDetails.isArchived = false;
            if (this.employeeRateSheetId) {
                employeeRateSheetDetails.employeeRateSheetId = this.employeeRateSheetId;
                employeeRateSheetDetails.timeStamp = this.data.editRateSheetData.timeStamp;
            }
            this.store.dispatch(new UpdateEmployeeRateSheetDetailsTriggered(employeeRateSheetDetails));
            // tslint:disable-next-line: max-line-length
            this.upsertEmployeeRateSheetDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeRateSheetDetailLoading));
        }
    }

    onNoClick(): void {
        if (this.rateSheetFormDirective) {
            this.rateSheetFormDirective.resetForm();
        }
        this.dialogRef.close();
    }

    setValidator(inputVal) {
        if (!inputVal) {
            if (this.employeeRateSheetForm.get("ratePerHour").value) {
                this.isIndividual = false;
            }
        } else {
            if (this.employeeRateSheetForm.get("ratePerHour").value) {
                this.isIndividual = false;
            } else {
                this.isIndividual = true;
            }
        }
        if (this.employeeRateSheetForm.get("ratePerHourMon").value && this.employeeRateSheetForm.get("ratePerHourTue").value
            && this.employeeRateSheetForm.get("ratePerHourWed").value && this.employeeRateSheetForm.get("ratePerHourThu").value
            && this.employeeRateSheetForm.get("ratePerHourFri").value && this.employeeRateSheetForm.get("ratePerHourSat").value
            && this.employeeRateSheetForm.get("ratePerHourSun").value && !inputVal) {
            this.isIndividual = true;
        }
    }

    onCheckChange(event) {
        if (this.rateSheetInsertDetails && this.rateSheetInsertDetails.rateSheetDetails) {
            this.checked = this.rateSheetInsertDetails.rateSheetDetails.filter((x) => x.isSelected).length;
        } else {
            this.checked = 0;
        }
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}
