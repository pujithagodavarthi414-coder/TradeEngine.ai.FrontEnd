import { Component, OnInit, EventEmitter, Output, ViewChildren, Inject } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, AbstractControl } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ofType, Actions } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { SchedulerComponent, SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { ConstantVariables } from "../models/constant-variables";
import { CommonService } from "../services/common.service";
import { CurrencyModel } from "../models/currency-model";
import { ShiftTimingModel } from "../models/shift-timing-model";
import { WeekdayModel } from "../models/weekday-model";
import { HolidayModel } from "../models/holiday-model";
import { addDays } from "date-fns";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject, from, of } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { DepartmentModel } from "../models/department-model";
import { EmployeeListModel } from "../models/employee-model";
import { RosterAdhocRequirement } from "../models/roster-adhoc-model";
import { RosterPlan } from "../models/roster-create-plan-model";
import { RosterDepartmentWithShift } from "../models/roster-department-model";
import { RosterPlanSolution } from "../models/roster-plan-solution-model";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import { RosterShiftRequirement } from "../models/roster-shift-model";
import { RosterSolution } from "../models/roster-solution-model";
import { RosterWorkingDay } from "../models/roster-workday-model";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import * as RosterState from "../store/reducers/index";
import { CreateEmployeeRosterSolutionTriggered, EmployeeRosterActionTypes, CreateEmployeeRosterPlanTriggered, GetEmployeeRosterByIdTriggered, GetRosterSolutionsByIdTriggered, LoadEmployeeRateSheetDetailsTriggered } from "../store/actions/roster.action";
import { ShiftWeekModel } from "../models/shift-week-model";
import { ActivatedRoute } from "@angular/router";
import * as _ from 'underscore';
import { ViewRosterPlanDetailsComponent } from "./view-employee-roster-plan-details.component";
import { Dictionary } from "@ngrx/entity";
import { RosterService } from "../services/roster-service";
import { SelectBranch } from "../models/select-branch";
import { CookieService } from "ngx-cookie-service";
import { RosterPlanInput } from "../models/roster-plan-input-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as moment_ from "moment";
import schedulerConfig from "./schedulerConfig";
const moment = moment_;

export enum SolutionFiltertype {
    Date = "date",
    Department = "department",
    Shift = "shift"
}

export interface RosterPlanName {
    rostName: string;
    totalBudget: number;
    startDate: Date;
    endDate: Date;
    branchId: string;
}

@Component({
    selector: "app-hr-component-auto-roster",
    templateUrl: "auto-employee-roster.component.html"
})

export class AutoRosterComponent extends CustomAppBaseComponent implements OnInit {
    // @ViewChild("allUsersSelected") private allUsersSelected: MatOption;
    @ViewChildren('updatePlanPopover') updatePlanPopover;

    schedulerConfig = schedulerConfig;
    addRosterFormStep1: FormGroup;
    addRosterFormStep2: FormGroup;
    addRosterFormStep3: FormGroup;
    addRosterFormStep4: FormGroup;
    addRosterFormStep5: FormGroup;
    addRosterFormStep6: FormGroup;
    selectedTabIndex: number;
    shiftTimeList: ShiftTimingModel[];
    departmentList: DepartmentModel[];
    departmentsWithShift: RosterDepartmentWithShift[];
    selectedComponentId: any;
    employeeListDataDetails: EmployeeListModel[];
    filteredEmployeeList: EmployeeListModel[];
    selectedUser: any;
    selectedShifts: RosterShiftRequirement[];
    adhocRequirement: RosterAdhocRequirement[];
    minDateForEndDate = new Date();
    minDateForAdhoc = new Date();
    minDate = new Date();
    maxDateForAdhoc = new Date();
    searchText = "";
    sortBy: string;
    dataItem: any;
    sortDirection = true;
    timeStamp: any;
    profileImage: string;
    page: any = {};
    employeeSearchResult: EmployeeListModel;
    rosterPlanSolutions: RosterPlanSolution[];
    selected = [];
    selectedSolution: RosterSolution;
    selectedPlan: RosterPlanOutput[];
    solutionData: SchedulerEvent[];
    filteredSolutionData: SchedulerEvent[];
    rosterShiftDetails: RosterShiftRequirement[] = [];
    rosterDepartmentDetails: RosterDepartmentWithShift[] = [];
    loggedUserDetails: any;
    company: any;
    currencyList: CurrencyModel[];
    selectedCurrency: CurrencyModel;
    totalBudget: number;
    requestId: string;
    isThereAnError: boolean;
    editable: boolean;
    maximumStepperReached: number = 0;
    hasError: boolean;
    filterData: any;
    disableUpdatePlanTrigger: boolean;
    branchesList: SelectBranch[];
    filterTypeDate = SolutionFiltertype.Date;
    filterTypeShift = SolutionFiltertype.Shift;
    filterTypeDepartment = SolutionFiltertype.Department;

    // Dictionaries
    totalEmployee = new Map<any, any>();
    all_shifts = new Map<any, any>();
    all_department = new Map<any, any>();
    all_adhoc = new Map<any, any>();
    all_days: RosterWorkingDay[];
    holidays: HolidayModel[];
    weekdays: WeekdayModel[];
    totalDiff: number;
    dateFormat: any;
    timeFormat: any;
    public formGroup: FormGroup;
    canAccess_feature_AddEmployeeRoster: Boolean;
    rosterSolutionOutput: any[];
    validationMessage: any;
    filteredPlansList: RosterPlanOutput[];
    rosterPlanName: RosterPlanName;

    currencyList$: Observable<CurrencyModel[]>
    shiftTimeList$: Observable<ShiftTimingModel[]>;
    employeeListDataDetails$: Observable<EmployeeListModel[]>;
    shiftwiseValueChanges$: any;
    departmentwiseValueChanges$: any;
    public ngDestroyed$ = new Subject();
    rosterPlanSolutions$: Observable<RosterPlanSolution[]>;
    rosterSolutionOutput$: Observable<any[]>;
    rosterSolutionCreationLoading$: Observable<boolean>;
    selectedEmployeeList: any = [];

    @Output() closePopup = new EventEmitter<any>();

    constructor(private actionUpdates$: Actions, private formBuilder: FormBuilder,
        private rosterStore: Store<RosterState.State>, private toastr: ToastrService,
        private translateService: TranslateService,
        private commonService: CommonService, private toaster: ToastrService, private cookieService: CookieService,
        private activatedRoute: ActivatedRoute, public dialogRef: MatDialogRef<AutoRosterComponent>,
        public dialog: MatDialog, private rosterService: RosterService,
        @Inject(MAT_DIALOG_DATA) public data: RosterPlanName) {
        super();
        if (data && data.rostName) {
            this.rosterPlanName = data;
        }
        this.getfromurlparams();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.GetRosterSolutionsByIdCompleted),
                tap(() => {
                    this.rosterSolutionOutput$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterSolutionOutputAll));
                    this.rosterSolutionOutput$.subscribe((result) => {
                        this.rosterSolutionOutput = result;
                    })
                })
            )
            .subscribe()

        this.rosterSolutionCreationLoading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.createSolutionloading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterSolutionCompleted),
                tap(() => {
                    this.rosterPlanSolutions$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterSolutionsAll));
                    this.rosterPlanSolutions$.subscribe((result) => {
                        this.rosterPlanSolutions = result;
                        this.validationMessage = undefined;
                        this.isThereAnError = false;
                        if (this.rosterPlanSolutions.length > 0) {
                            this.requestId = this.rosterPlanSolutions[0].requestId;
                        }
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterSolutionFailed),
                tap(() => {
                    let validationMessages$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.createSolutionErrors));
                    validationMessages$.subscribe((result) => {
                        this.isThereAnError = true;
                        this.validationMessage = this.translateService.instant(result[0].message);
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted),
                tap(() => {
                    this.selectedTabIndex = 0;
                    this.closePopup.emit(true);
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.filterData = {};
        this.page.size = 100;
        this.clearRosterForm();
        this.selectedTabIndex = 0;
        this.getCurrencyList();
        this.getAllBranches();
        this.getdepartments();
        this.getAllHolidays();
        this.getAllWeekDays();
        this.getShiftTimingList();
        this.getUsersList();
        this.selectedSolution = undefined;
        this.selectedPlan = [];
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;

    }

    getShiftTimingList() {
        const shiftTimingSearchModel = new ShiftTimingModel();
        shiftTimingSearchModel.isArchived = false;
        this.rosterService
            .getAllShiftTimings(shiftTimingSearchModel)
            .subscribe((shifts: any) => {
                this.shiftTimeList = shifts.data;
            })
    }

    getdepartments() {
        const departmentModel = new DepartmentModel();
        departmentModel.isArchived = false;
        this.rosterService.getdepartment(departmentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.departmentList = response.data;
            }
        });
    }

    getAllBranches() {
        const selectBranch = new SelectBranch();
        this.rosterService.getAllBranches(selectBranch).subscribe((result: any) => {
            this.branchesList = result.data;
        });
    }

    getUsersList() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.branchId = this.rosterPlanName.branchId;
        employeeListSearchResult.sortBy = this.sortBy;
        employeeListSearchResult.sortDirectionAsc = this.sortDirection;
        employeeListSearchResult.pageNumber = this.page.pageNumber + 1;
        employeeListSearchResult.pageSize = this.page.size;
        employeeListSearchResult.isActive = true;
        this.rosterService.getAllEmployees(employeeListSearchResult).subscribe((result: any) => {
            if (result && result.data) {
                this.employeeListDataDetails = result.data.sort((a, b) => a.userName.localeCompare(b.userName));
            }
        });
    }

    getAllHolidays() {
        const isArchived = false;
        const holidaysModel = new HolidayModel();
        holidaysModel.isArchived = isArchived;

        this.rosterService.getAllHolidays(holidaysModel).subscribe((response: any) => {
            if (response.success == true) {
                this.holidays = response.data;
            }
        });
    }

    getAllWeekDays() {
        const isArchived = false;
        const weekDayModel = new WeekdayModel();
        weekDayModel.isArchived = isArchived;

        this.rosterService.getAllWeekDays(weekDayModel).subscribe((response: any) => {
            if (response.success == true) {
                this.weekdays = response.data;
            }
        });
    }

    getCurrencyList() {
        var currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;

        this.rosterService.getCurrencies(currencyModel).subscribe((response: any) => {
            this.currencyList = response.data;
            this.getCompanyDetails();
        });
    }

    getCompanyDetails() {
        this.company = this.cookieService.get(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company) {
            this.getdateFormats(this.company.dateFormatId);
            this.getTimeFormats(this.company.timeFormatId);
            this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
            if (!this.selectedCurrency) {
                this.selectedCurrency = new CurrencyModel();
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
        } else {
            this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        }
    }

    getdateFormats(dateFormatId: string) {
        if (dateFormatId) {
            this.commonService.GetDateFormatById(dateFormatId).subscribe((response: any) => {
                if (response.success == true) {
                    this.dateFormat = response.data;
                }
            });
        } else {
            this.dateFormat = {};
            this.dateFormat.pattern = ConstantVariables.DateFormat;
        }

    }

    getTimeFormats(timeFormatId: string) {
        if (timeFormatId) {
            this.commonService.GetTimeFormatById(timeFormatId).subscribe((response: any) => {
                if (response.success == true) {
                    this.timeFormat = response.data;
                }
            });
        } else {
            this.timeFormat = {};
            this.timeFormat.pattern = ConstantVariables.DateFormat;
        }
    }

    clearRosterForm() {
        this.addRosterFormStep1 = this.formBuilder.group({
            rostName: new FormControl(this.rosterPlanName && this.rosterPlanName.rostName ? this.rosterPlanName.rostName : "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])
            ),
            rostStartDate: new FormControl(this.rosterPlanName && this.rosterPlanName.startDate ? this.rosterPlanName.startDate : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            rostEndDate: new FormControl(this.rosterPlanName && this.rosterPlanName.endDate ? this.rosterPlanName.endDate : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            rostBudget: new FormControl(this.rosterPlanName && this.rosterPlanName.totalBudget ? this.rosterPlanName.totalBudget : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            branchId: new FormControl(this.rosterPlanName && this.rosterPlanName.branchId ? this.rosterPlanName.branchId : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            rostEmployeeRequired: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            includeHolidays: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            includeWeekends: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            rostMaxWorkDays: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            rostMaxWorkHours: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.max(24)
                ])
            )
        });
        this.addRosterFormStep2 = this.formBuilder.group({
            shiftWise: this.formBuilder.array([this.addShiftFormGroup()])
        });
        this.addRosterFormStep3 = this.formBuilder.group({
            departmentWise: this.formBuilder.array([this.addDepartmentFormGroup()])
        });
        this.addRosterFormStep4 = this.formBuilder.group({
            adHoc: this.formBuilder.array([this.adHocRequirement()])
        });
        this.addRosterFormStep5 = new FormGroup({});
        this.addRosterFormStep6 = this.formBuilder.group({
            employeeShift: new FormControl(null),
            employeeDepartment: new FormControl(null),
            employeeId: new FormControl(null)
        });
    }

    addShiftFormGroup() {
        return this.formBuilder.group({
            shiftName: new FormControl({ value: "", disabled: true }),
            shiftId: new FormControl(""),
            noOfEmployeeRequired: new FormControl(""),
            employeeSpecifcation: new FormControl([])
        })
    }

    addDepartmentFormGroup() {
        return this.formBuilder.group({
            departmentName: new FormControl({ value: "", disabled: true }),
            departmentId: new FormControl(""),
            shiftName: new FormControl({ value: "", disabled: true }),
            shiftId: new FormControl(""),
            noOfEmployeeRequired: new FormControl(""),
            employeeSpecifcation: new FormControl([])
        })
    }

    adHocRequirement() {
        return this.formBuilder.group({
            reqDate: new FormControl(""),
            fromTime: new FormControl(""),
            toTime: new FormControl(""),
            noOfEmployeeRequired: new FormControl(""),
            employeeSpecifcation: new FormControl([])
        })
    }

    startDate() {
        if (this.addRosterFormStep1.value.rostStartDate) {
            this.minDateForEndDate = this.addRosterFormStep1.value.rostStartDate;
        } else {
            this.addRosterFormStep1.controls["rostEndDate"].setValue("");
        }
    }

    setMaxDays() {
        this.all_days = [];
        if (this.addRosterFormStep1.value && this.addRosterFormStep1.value.includeHolidays
            && this.addRosterFormStep1.value.includeWeekends) {
            let refDate = this.commonService.convertUtcToLocal(moment(this.addRosterFormStep1.value.rostStartDate)).toDate();
            while (refDate <= this.commonService.convertUtcToLocal(moment(this.addRosterFormStep1.value.rostEndDate)).toDate()) {
                let includeHoliday = true;
                let isHoliday = false;
                if (this.holidays) {
                    const holiday = this.holidays.find((x) => moment(x.date).toDate().toLocaleDateString() == moment(refDate).toDate().toLocaleDateString());
                    if (this.addRosterFormStep1.value.includeHolidays == "No" && holiday) {
                        includeHoliday = false;
                    }
                    if (this.addRosterFormStep1.value.includeHolidays == "Yes" && holiday) {
                        isHoliday = true;
                    }
                }
                if (this.weekdays && this.weekdays.length > 0) {
                    const weekend = this.weekdays.find((x) => x.isWeekend && x.weekDayId == moment(refDate).day())
                    if (this.addRosterFormStep1.value.includeWeekends == "No" && weekend) {
                        includeHoliday = false;
                    }
                    if (this.addRosterFormStep1.value.includeWeekends == "Yes" && weekend) {
                        isHoliday = true;
                    }
                }
                if (includeHoliday) {
                    const workingDay = new RosterWorkingDay();
                    workingDay.reqDate = refDate;
                    workingDay.IsHoliday = isHoliday;
                    this.all_days.push(workingDay);
                }
                refDate = addDays(refDate, 1);
            }
            this.totalDiff = this.all_days.length;
            if (this.totalDiff == 0) {
                this.toastr.error("", this.translateService.instant(ConstantVariables.RosterPlanDateOtherThanHolidays));
            } else {
                this.addRosterFormStep1.controls["rostMaxWorkDays"].setValidators([Validators.max(this.totalDiff)]);
            }
        }
    }

    createRoster() {
        const adhocList: RosterAdhocRequirement[] = [];

        if (this.addRosterFormStep4.value.adHoc && this.addRosterFormStep4.value.adHoc.length > 0) {
            this.addRosterFormStep4.value.adHoc.forEach((value, index) => {
                const adhoc = new RosterAdhocRequirement();
                adhoc.reqDate = value.reqDate;
                adhoc.reqFromTime = value.fromTime;
                adhoc.reqToTime = value.toTime;
                adhoc.noOfEmployeeRequired = value.noOfEmployeeRequired;
                adhoc.employeeSpecifcation = value.employeeSpecifcation ? value.employeeSpecifcation.map((x) => x.employeeId) : [];
                adhocList.push(adhoc);
            });
        };

        this.rosterShiftDetails = [];
        this.selectedShifts.forEach((value, index) => {
            const shift = new RosterShiftRequirement();
            shift.shiftId = value.shiftId;
            shift.shiftName = value.shiftName;
            shift.noOfEmployeeRequired = value.noOfEmployeeRequired ? value.noOfEmployeeRequired : (value.employeeSpecifcation ? value.employeeSpecifcation.length : 0);
            shift.employeeSpecifcation = value.employeeSpecifcation ? value.employeeSpecifcation.map((x) => x.employeeId) : [];
            this.rosterShiftDetails.push(shift);
        });

        this.rosterDepartmentDetails = [];
        this.departmentsWithShift.forEach((value, index) => {
            if (value.noOfEmployeeRequired > 0) {
                const department = new RosterDepartmentWithShift();
                department.departmentId = value.departmentId;
                department.departmentName = value.departmentName;
                department.shiftId = value.shiftId;
                department.shiftName = value.shiftName;
                department.noOfEmployeeRequired = value.noOfEmployeeRequired ? value.noOfEmployeeRequired : (value.employeeSpecifcation ? value.employeeSpecifcation.length : 0);
                department.employeeSpecifcation = value.employeeSpecifcation ? value.employeeSpecifcation.map((x) => x.employeeId) : [];
                this.rosterDepartmentDetails.push(department);
            }
        });

        const rosterPlan = new RosterPlan();
        rosterPlan.requestId = this.requestId;
        rosterPlan.rosterBasicDetails = Object.assign({}, this.addRosterFormStep1.value);
        rosterPlan.rosterBasicDetails.includeHolidays = this.addRosterFormStep1.value.includeHolidays == "Yes" ? true : false;
        rosterPlan.rosterBasicDetails.includeWeekends = this.addRosterFormStep1.value.includeWeekends == "Yes" ? true : false;
        rosterPlan.rosterShiftDetails = this.rosterShiftDetails;
        rosterPlan.rosterDepartmentDetails = this.rosterDepartmentDetails;
        rosterPlan.rosterAdhocRequirement = adhocList;
        rosterPlan.workingdays = this.all_days;
        rosterPlan.timeZone = new Date().getTimezoneOffset();
        this.rosterStore.dispatch(new CreateEmployeeRosterSolutionTriggered(rosterPlan));
        this.rosterSolutionCreationLoading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.createSolutionloading));
    }

    selectedTabIndexChange() {
        this.validationMessage = undefined;
        this.isThereAnError = false;
        if (this.validateTabIndex()) {
            if (this.selectedTabIndex == 2) {
                this.selectedTabIndex = this.selectedTabIndex + 2;
            }
            else {
                this.selectedTabIndex = this.selectedTabIndex + 1;
            }
            if (this.maximumStepperReached < this.selectedTabIndex) {
                this.maximumStepperReached = this.selectedTabIndex;
            }
            this.loadFormByTabIndex(false);
        }
    }

    previous() {
        if (this.selectedTabIndex == 0) {
            this.dialogRef.close({ success: null });
        } else {
            if (this.selectedTabIndex == 4) {
                this.selectedTabIndex = this.selectedTabIndex - 2;
            } else {
                this.selectedTabIndex = this.selectedTabIndex - 1;
            }
            this.loadFormByTabIndex(true);
        }
    }

    loadFormByTabIndex(isReverse: boolean) {
        switch (this.selectedTabIndex) {
            case 0: break;
            case 1:
                if (this.shiftTimeList && this.shiftTimeList.length > 0) {
                    const formArray = this.addRosterFormStep2.get("shiftWise") as FormArray;
                    while (formArray.length > 0) {
                        formArray.removeAt(0);
                    }

                    if (!this.selectedShifts) {
                        this.selectedShifts = [];
                    }
                    this.shiftTimeList.forEach((value, index) => {
                        const selectedShift = this.selectedShifts.find((x) => x.shiftId == value.shiftTimingId);
                        const formGrp = this.formBuilder.group({
                            shiftName: value.shift,
                            shiftId: value.shiftTimingId,
                            noOfEmployeeRequired: new FormControl(selectedShift ? selectedShift.noOfEmployeeRequired : ""),
                            employeeSpecifcation: new FormControl(selectedShift ? selectedShift.employeeSpecifcation : [])
                        });
                        formArray.push(formGrp);
                    });
                }
                break;
            case 2:
                if (this.departmentList && this.departmentList.length > 1) {
                    if (!this.departmentsWithShift || this.departmentsWithShift.length <= 0) {
                        this.departmentsWithShift = [];
                        if (this.selectedShifts.length > 0) {
                            this.selectedShifts.forEach((shift, index) => {
                                this.departmentList.forEach((department) => {
                                    const departmentWithShift = new RosterDepartmentWithShift();
                                    departmentWithShift.departmentId = department.departmentId;
                                    departmentWithShift.departmentName = department.departmentName;
                                    departmentWithShift.shiftId = shift.shiftId;
                                    departmentWithShift.shiftName = shift.shiftName;
                                    departmentWithShift.employeeSpecifcation = shift.employeeSpecifcation ? shift.employeeSpecifcation.filter(x => x.departmentId == department.departmentId).map((x) => x.employeeId) : [];
                                    if (departmentWithShift.employeeSpecifcation && departmentWithShift.employeeSpecifcation.length > 0)
                                        departmentWithShift.noOfEmployeeRequired = departmentWithShift.employeeSpecifcation.length
                                    this.departmentsWithShift.push(departmentWithShift);
                                });
                            })
                        } else {
                            this.departmentList.forEach((department) => {
                                const departmentWithShift = new RosterDepartmentWithShift();
                                departmentWithShift.departmentId = department.departmentId;
                                departmentWithShift.departmentName = department.departmentName;
                                departmentWithShift.shiftId = "";
                                departmentWithShift.shiftName = "";
                                this.departmentsWithShift.push(departmentWithShift);
                            });
                        }
                    }
                    this.step2ChangeShift();
                }
                this.minDateForAdhoc = this.addRosterFormStep1.value.rostStartDate;
                this.maxDateForAdhoc = this.addRosterFormStep1.value.rostEndDate;
                break;
            case 3:

                break;
            case 4:
                if (!isReverse)
                    this.createRoster();
                break;
        }
    }

    validateTabIndex() {
        const shiftWiseArray = this.addRosterFormStep2.get("shiftWise") as FormArray;
        const reqEmployee = this.addRosterFormStep1.get("rostEmployeeRequired").value;
        let totalEmployee = 0;
        switch (this.selectedTabIndex) {
            case 0:
                if (reqEmployee <= 0) {
                    this.toastr.error("", this.translateService.instant(ConstantVariables.RosterMaxEmployee));
                    return false;
                }
                break;
            case 1:
                if (shiftWiseArray.length > 0) {
                    let isNegativeValue = false;
                    this.selectedShifts = [];
                    shiftWiseArray.value.forEach((value, index) => {
                        if (value.noOfEmployeeRequired > 0 || value.employeeSpecifcation.length > 0) {
                            if (!value.noOfEmployeeRequired && value.employeeSpecifcation.length > 0) {
                                value.noOfEmployeeRequired = value.employeeSpecifcation.length;
                            }
                            this.selectedShifts.push(value);
                        } else if (value.noOfEmployeeRequired < 0) {
                            isNegativeValue = true;
                        }
                        if (value.employeeSpecifcation.length > 0) {
                            totalEmployee += value.employeeSpecifcation.length;
                        }
                        else {
                            totalEmployee += value.noOfEmployeeRequired ? parseInt(value.noOfEmployeeRequired, 10) : 0;
                        }
                    });
                    if (isNegativeValue) {
                        this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterEmployeeCountGreaterThanZero));
                    }

                    if (totalEmployee > 0 && (totalEmployee > reqEmployee || totalEmployee < reqEmployee)) {
                        this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeCountMismatch));
                        return false;
                    }
                }
                break;
            case 2:
                if (this.departmentsWithShift.length > 0) {
                    if (this.selectedShifts.length > 0) {
                        let noError = true;
                        let isNegativeValue = false;
                        this.selectedShifts.forEach((shift, index) => {
                            totalEmployee = 0;
                            this.departmentsWithShift.filter((x) => x.shiftId == shift.shiftId).forEach((value, index) => {
                                if (value.noOfEmployeeRequired && value.noOfEmployeeRequired < 0 && !isNegativeValue)
                                    isNegativeValue = true;
                                totalEmployee += !value.noOfEmployeeRequired || value.noOfEmployeeRequired < 0 ? 0 : value.noOfEmployeeRequired;
                            });

                            if (totalEmployee > 0 && (totalEmployee > shift.noOfEmployeeRequired || totalEmployee < shift.noOfEmployeeRequired)) {
                                this.toastr.warning(shift.shiftName, this.translateService.instant(ConstantVariables.RosterEmployeeCountMismatch));
                                noError = false;
                                return;
                            }
                        })
                        if (isNegativeValue) {
                            this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterEmployeeCountGreaterThanZero));
                            noError = false;
                            return;
                        }
                        return noError;
                    } else {
                        let isNegativeValue = false;
                        totalEmployee = 0;
                        this.departmentsWithShift.forEach((value, index) => {
                            if (value.noOfEmployeeRequired && value.noOfEmployeeRequired < 0 && !isNegativeValue)
                                isNegativeValue = true;
                            totalEmployee += !value.noOfEmployeeRequired || value.noOfEmployeeRequired < 0 ? 0 : value.noOfEmployeeRequired;
                        });
                        if (totalEmployee > 0 && (totalEmployee > reqEmployee || totalEmployee < reqEmployee)) {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeCountMismatch));
                            return false;
                        }
                        if (isNegativeValue) {
                            this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterEmployeeCountGreaterThanZero));
                            return false;
                        }
                    }
                }
                break;
            case 3:

                break;
            case 4:
                this.setTotalBudget();
                break;
        }

        return true;
    }

    async checkValidDateandName() {
        const rosterPlan = new RosterPlan();
        rosterPlan.rosterBasicDetails = this.addRosterFormStep1.value;
        if (this.addRosterFormStep1.value.rostStartDate && this.addRosterFormStep1.value.rostEndDate) {
            let error = false;
            let rosterName$ = this.rosterService.checkRosterName(rosterPlan);
            rosterName$
                .do(response => {
                    if (response && response.data) {
                        error = true;
                        this.toastr.error("", this.translateService.instant(ConstantVariables.RosterNameAlreadyAvailable));
                        this.addRosterFormStep1.controls["rostName"].setErrors({ 'invalid': true, 'valid': false });
                        this.addRosterFormStep1.controls["rostName"].updateValueAndValidity();
                    } else {
                        error = false;
                        this.addRosterFormStep1.controls["rostName"].updateValueAndValidity();
                    }
                })
                .switchMap((response) => {
                    this.hasError = error;
                    this.setMaxDays();
                    return of(error);
                })
                .subscribe();
        }
    }

    addNewRequirement() {
        const formArray = this.addRosterFormStep4.get("adHoc") as FormArray;
        formArray.push(this.adHocRequirement());
    }

    step2ChangeShift() {
        const formArray = this.addRosterFormStep3.get("departmentWise") as FormArray;
        while (formArray.length > 0) {
            formArray.removeAt(0);
        }

        this.departmentsWithShift.forEach((value, index) => {
            var employee = this.employeeListDataDetails.filter((x) => x.departmentId == value.departmentId);
            employee = employee.filter((x) => x.shiftTimingId == value.shiftId);
            var emp = [];
            if (employee.length == 0) {
                emp = [];
            } else {
                emp = employee.map((item) => item.employeeId);
            }
            formArray.push(
                this.formBuilder.group({
                    departmentName: value.departmentName,
                    departmentId: value.departmentId,
                    shiftId: value.shiftId,
                    shiftName: value.shiftName,
                    noOfEmployeeRequired: value.noOfEmployeeRequired,
                    employeeSpecifcation: new FormControl(value.employeeSpecifcation)
                })
            )
        });

        const formArray1 = this.addRosterFormStep3.get("departmentWise") as FormArray;
        this.departmentsWithShift.forEach((value, index) => {
            var employee = this.employeeListDataDetails.filter((x) => x.departmentId == value.departmentId);
            employee = employee.filter((x) => x.shiftTimingId == value.shiftId);
            var emp = [];
            if (employee.length == 0) {
                emp = [];
                formArray1.at(index).get("employeeSpecifcation").patchValue([]);
            } else {
                var user = [];
                emp = employee.map((item) => item.employeeId);
                this.selectedEmployeeList.map((e) => {
                    emp.map((u) => {
                        if (u.includes(e)) {
                            user.push(u);
                        }
                    })
                });
                if (user && user.length > 0) {
                    formArray1.at(index).get("noOfEmployeeRequired").patchValue(user.length);
                    formArray1.at(index).get("employeeSpecifcation").patchValue([...user]);
                }
            }
        });
    }

    employeeRequiredChanged(i) {
        if (this.selectedTabIndex == 1) {
            const controls = this.addRosterFormStep2.controls["shiftWise"] as FormArray;
            const selectedObject = controls.at(i).value;
            if (this.selectedShifts && this.selectedShifts.length == 0) {
                this.selectedShifts.push(selectedObject);
            } else {
                const shift = this.selectedShifts.find((x) => x.shiftId == selectedObject.shiftId);
                if (shift) {
                    shift.noOfEmployeeRequired = selectedObject.noOfEmployeeRequired;
                    this.departmentsWithShift = [];
                }
            }
        } else if (this.selectedTabIndex == 2) {
            const controls = this.addRosterFormStep3.controls["departmentWise"] as FormArray;
            const selectedObject = controls.at(i).value;
            const departmentWithShift = this.departmentsWithShift.find((x) => x.shiftId == selectedObject.shiftId
                && x.departmentId == selectedObject.departmentId);
            if (departmentWithShift) {
                departmentWithShift.noOfEmployeeRequired = selectedObject.noOfEmployeeRequired;
            }
        }
    }

    employeeSpecificationChanged(i) {
        if (this.selectedTabIndex == 1) {
            const controls = this.addRosterFormStep2.controls["shiftWise"] as FormArray;
            const selectedObject = controls.at(i).value;
            if (this.selectedShifts && this.selectedShifts.length == 0) {
                selectedObject.noOfEmployeeRequired = selectedObject.noOfEmployeeRequired + 1;
                this.selectedShifts.push(selectedObject);
            } else {
                const shift = this.selectedShifts.find((x) => x.shiftId == selectedObject.shiftId);
                if (shift) {
                    shift.employeeSpecifcation = selectedObject.employeeSpecifcation;
                    shift.noOfEmployeeRequired = selectedObject.noOfEmployeeRequired ? selectedObject.noOfEmployeeRequired : selectedObject.employeeSpecifcation.length;
                    this.departmentsWithShift = [];
                }
            }
            this.selectedEmployeeList = [];
            for (let j: any = 0; j < controls.length; j++) {
                var selected = controls.at(j).value.employeeSpecifcation;
                selected.forEach((k, l) => {
                    this.selectedEmployeeList.push(k.employeeId);
                })
            }
        } else if (this.selectedTabIndex == 2) {
            const controls = this.addRosterFormStep3.controls["departmentWise"] as FormArray;
            const selectedObject = controls.at(i).value;
            const selectedControl = controls.at(i);
            const departmentWithShift = this.departmentsWithShift.find((x) => x.shiftId == selectedObject.shiftId
                && x.departmentId == selectedObject.departmentId);
            if (departmentWithShift) {
                departmentWithShift.employeeSpecifcation = selectedObject.employeeSpecifcation;
                selectedObject.noOfEmployeeRequired = selectedObject.employeeSpecifcation.length;
                departmentWithShift.noOfEmployeeRequired = selectedObject.noOfEmployeeRequired;
                if (!selectedObject.noOfEmployeeRequired || selectedObject.noOfEmployeeRequired == "") {
                    selectedControl.get("noOfEmployeeRequired").setErrors(Validators.required);
                }
            }
        }
    }

    checkMaxDays() {
        if (this.addRosterFormStep1.controls["rostMaxWorkDays"].value > this.totalDiff) {
            this.addRosterFormStep1.controls["rostMaxWorkDays"].setErrors(Validators.max);
            this.addRosterFormStep1.controls["rostMaxWorkDays"].updateValueAndValidity();
        }
    }

    checkMaxHours() {
        if (this.addRosterFormStep1.get("rostMaxWorkHours").value > 24) {
            this.addRosterFormStep1.get("rostMaxWorkHours").setErrors(Validators.max);
            this.addRosterFormStep1.controls["rostMaxWorkDays"].updateValueAndValidity();
        }
    }

    highlightSolution(plansolution: RosterPlanSolution, index) {
        this.selectedSolution = undefined;
        this.selectedPlan = [];
        this.selected.forEach((value, i) => {
            this.selected[i] = false;
        })
        this.selected[index] = !this.selected[index];
        if (this.selected[index]) {
            this.selectedSolution = plansolution.solution;
            this.selectedPlan = plansolution.plans;
            this.filterSolution();
        }
    }

    public clearFilters() {
        this.addRosterFormStep6 = new FormGroup({
            employeeShift: new FormControl(null),
            employeeDepartment: new FormControl(null),
            employeeId: new FormControl(null)
        });
    }

    public departmentChange(department: any, formGroup): void {
        if (department) {
            this.filteredEmployeeList = this.employeeListDataDetails.filter((x) => x.departmentId == department.departmentId);
        } else {
            this.filteredEmployeeList = this.employeeListDataDetails;
        }
    }

    public shiftChange(shift: any, formGroup): void {
        if (shift) {
            this.getAllShiftWeek(shift, formGroup);
        }
    }

    getAllShiftWeek(shift, formGroup) {
        let selectedWeektiming = new ShiftWeekModel();
        selectedWeektiming.shiftTimingId = shift.shiftTimingId;
        this.rosterService.getShiftWeek(selectedWeektiming).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    const shiftWeek = response.data;
                    const shift = shiftWeek.find((x) => x.dayOfWeek == moment(formGroup.value.start).format("dddd"));
                    if (shift) {
                        const startDate = new Date(formGroup.value.start).toISOString().split("T").shift();
                        let starttime;
                        if (shift.startTime) {
                            starttime = shift.startTime;
                        } else {
                            starttime = ConstantVariables.DefaultStartTime;
                        }

                        let endDate = moment(formGroup.value.end);
                        let endtime;
                        if (shift.endTime) {
                            endtime = shift.endTime;
                        } else {
                            endtime = moment.duration(starttime).add(this.addRosterFormStep1.value.rostMaxWorkHours, "hours");
                        }

                        formGroup.controls["start"].setValue(moment(startDate + " " + starttime).toDate());
                        // tslint:disable-next-line: max-line-length
                        formGroup.controls["end"].setValue(moment(startDate + " " + endtime.get("hours") + ":" + endtime.get("m")).toDate());
                    }
                }
            }
        });
    }

    private closeEditor(scheduler: SchedulerComponent): void {
        scheduler.closeEvent();
        this.formGroup = undefined;
    }

    updateBudgetLabels(planList) {
        this.selectedPlan = planList;
        this.setTotalBudget();
    }

    setTotalBudget() {
        this.totalBudget = this.selectedPlan.reduce((s, f) => {
            return s + f.totalRate;
        }, 0);
    }

    submitPlan() {
        let rosterPlanInput = new RosterPlanInput();
        rosterPlanInput.requestId = this.requestId;
        rosterPlanInput.solution = this.selectedSolution;
        let updatedPlans: RosterPlanOutput[] = [];
        if (this.selectedPlan && this.selectedPlan.length > 0) {
            let updatedPlan: RosterPlanOutput;
            this.selectedPlan.forEach((value, index) => {
                updatedPlan = Object.assign({}, value);
                updatedPlan.fromTime = this.commonService.covertTimeIntoUtcTime(value.fromTime).format("HH:mm");
                updatedPlan.toTime = this.commonService.covertTimeIntoUtcTime(value.toTime).format("HH:mm");
                updatedPlans.push(updatedPlan);
            });
        }
        rosterPlanInput.plans = updatedPlans;
        this.rosterStore.dispatch(new CreateEmployeeRosterPlanTriggered(rosterPlanInput));
    }

    getfromurlparams() {
        this.activatedRoute.queryParams.subscribe(routeParams => {
            this.requestId = routeParams.id;
            if (routeParams.id) {

                this.rosterStore.dispatch(new GetRosterSolutionsByIdTriggered(this.requestId));
            }
        })
    }

    removeAdHocRecord(index) {
        (this.addRosterFormStep4.get("adHoc") as FormArray).removeAt(index);
    }

    showRosterDetails(plansolution: RosterPlanSolution) {
        const dialogRef = this.dialog.open(ViewRosterPlanDetailsComponent, {
            height: 'auto',
            width: '700px',
            disableClose: true,
            data: { solution: plansolution ? plansolution : "", currency: this.selectedCurrency, dateFormat: this.dateFormat }
        });
    }

    getDatewiseEmployeeCount(solution: RosterPlanSolution, filterType: SolutionFiltertype) {
        let total: number = 0;
        let groupCount: number = 0;
        let groupdata: Dictionary<RosterPlanOutput[]>;
        let returnValue = 0;
        switch (filterType) {
            case SolutionFiltertype.Date:
                groupdata = _.groupBy(solution.plans, "planDate");
                groupCount = Object.keys(groupdata).length;

                // tslint:disable-next-line: forin
                for (let key in groupdata) {
                    let plans = groupdata[key];
                    total += plans.length;
                }
                returnValue = total / groupCount;
                break;
            case SolutionFiltertype.Department:
                groupdata = _.groupBy(solution.plans, "departmentId");
                groupCount = Object.keys(groupdata).length;

                // tslint:disable-next-line: forin
                for (let key in groupdata) {
                    let plans = groupdata[key];
                    total += plans.length;
                }
                returnValue = this.rosterDepartmentDetails.length > 0 ? total / (this.all_days.length) : 0;
                break;
            case SolutionFiltertype.Shift:
                groupdata = _.groupBy(solution.plans, "shiftId");
                groupCount = Object.keys(groupdata).length;

                // tslint:disable-next-line: forin
                for (let key in groupdata) {
                    let plans = groupdata[key];
                    total += plans.length;
                }
                returnValue = this.selectedShifts.length > 0 ? total / (this.all_days.length) : 0;
                break;
        }
        return Math.round(returnValue * 100 + Number.EPSILON) / 100;
    }

    public filterSolution(filterData?: any) {
        if (filterData) {
            this.editable = false;
        } else {
            this.editable = true;
        }
        this.filteredPlansList = this.selectedPlan.filter((dataItem) => {
            let isTrue = true;
            if (filterData) {
                if (filterData.value) {
                    if (dataItem.shiftId == filterData.value || dataItem.departmentId == filterData.value || dataItem.employeeId == filterData.value) {
                        isTrue = true;
                    } else {
                        isTrue = false;
                    }
                }
            }
            return isTrue;
        })
        this.setTotalBudget();
    }

    tabClick(index) {
        if (index > this.selectedTabIndex) {
            return false;
        } else {
            this.selectedTabIndex = index
            this.loadFormByTabIndex(true);
        }
    }

    resetAllFilters() {
        this.filterData = {};
        this.filteredPlansList = [...this.selectedPlan];
    }

    closeDialog(isSuccess) {
        this.disableUpdatePlanTrigger = true;
        this.dialogRef.close({ success: isSuccess, data: { solution: this.selectedSolution, plans: this.selectedPlan, requestId: this.requestId, basicInfo: this.addRosterFormStep1.value } });
        this.closeUpdatePlanTriggerPopup();
    }

    closeUpdatePlanTriggerPopup() {
        this.updatePlanPopover.forEach((p) => p.closePopover());
    }

    updatePlanTrigger(updatePlanPopover) {
        updatePlanPopover.openPopover();
    }

    getControls(frmGrp: FormGroup, key: string): AbstractControl[] {
        return (frmGrp.controls[key] as FormArray).controls;
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}
