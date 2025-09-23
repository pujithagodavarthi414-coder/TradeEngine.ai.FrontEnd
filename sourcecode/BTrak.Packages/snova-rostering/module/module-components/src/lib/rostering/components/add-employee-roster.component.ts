import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren, AfterViewInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { ConstantVariables } from "../models/constant-variables";
import { CompanyDetailsModel } from "../models/company-details-model";
import { CommonService } from "../services/common.service";
import { CurrencyModel } from "../models/currency-model";
import { ShiftTimingModel } from "../models/shift-timing-model";
import { WeekdayModel } from "../models/weekday-model";
import { HolidayModel } from "../models/holiday-model";
import { addDays } from "date-fns";
import { Guid } from "guid-typescript";
import * as moment_ from "moment";
import { ToastrService } from "ngx-toastr";
import { Observable, of, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import * as _ from "underscore";
import { DepartmentModel } from "../models/department-model";
import { EmployeeDetailsSearchModel } from "../models/employee-details-search-model";
import { EmployeeListModel } from "../models/employee-model";
import { EmployeeRateSheetModel } from "../models/employee-ratesheet-model";
import { RosterAdhocRequirement } from "../models/roster-adhoc-model";
import { RosterBasicRequirement } from "../models/roster-basic-model";
import { RosterPlan } from "../models/roster-create-plan-model";
import { RosterDepartmentWithShift } from "../models/roster-department-model";
import { RosterPlanSolution } from "../models/roster-plan-solution-model";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import { RosterShiftRequirement } from "../models/roster-shift-model";
import { RosterSolution } from "../models/roster-solution-model";
import { RosterWorkingDay } from "../models/roster-workday-model";
import { RosterService } from "../services/roster-service";
import { CreateEmployeeRosterPlanTriggered, EmployeeRosterActionTypes, LoadEmployeeRateSheetDetailsTriggered } from "../store/actions/roster.action";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import * as RosterState from "../store/reducers/index";
import { AutoRosterComponent } from "./auto-employee-roster.component";
import schedulerConfig from "./schedulerConfig";
import { ViewAndLoadRosterTemplate } from "./template-employee-roster.component";
import { ViewRosterPlanDetailsComponent } from "./view-employee-roster-plan-details.component";
import { RosterCommonService } from "../services/roster-common-service";
import { SelectBranch } from "../models/select-branch";
import { CookieService } from "ngx-cookie-service";
import { RosterPlanInput } from "../models/roster-plan-input-model";
import { RosterPlanBasicInput } from "../models/roster-plan-basicinput-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

const moment = moment_;
@Component({
    selector: "app-hr-component-add-roster",
    templateUrl: "add-employee-roster.component.html"
})

export class AddRosterComponent extends CustomAppBaseComponent implements OnInit, AfterViewInit {
    // @ViewChild("allUsersSelected") private allUsersSelected: MatOption;
    @ViewChildren("createPlanConfirmationPopover") createPlanConfirmationPopover;
    @ViewChild("createRosterNamePopover") createRosterNamePopover;
    @ViewChild("createPlanWithShiftPopover") createPlanWithShiftPopover;
    @ViewChild("alldepartmentsSelected") private alldepartmentsSelected: MatOption;
    @ViewChild("allEmployeesSelected") private allEmployeesSelected: MatOption;
    @ViewChild('scheduler1') scheduler;
    @ViewChild("submitPlanWithBudgetPopover") submitPlanWithBudgetPopover;

    schedulerConfig = schedulerConfig;

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
    minDateForEndDateForShift = new Date();
    minDateForEndDateForInput = new Date()
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
    selectedPlan: any;
    solutionData: SchedulerEvent[];
    filteredSolutionData: SchedulerEvent[];
    rosterShiftDetails: RosterShiftRequirement[] = [];
    rosterDepartmentDetails: RosterDepartmentWithShift[] = [];
    loggedUserDetails: any;
    company: CompanyDetailsModel;
    currencyList: CurrencyModel[];
    selectedCurrency: CurrencyModel;
    budgetCalculated: number;
    requestId: string;
    isThereAnError: boolean;
    editable: boolean = true;
    maximumStepperReached: number = 0;
    hasError: boolean;
    isTemplate: boolean;
    disableCreatePlanTrigger: boolean;
    isBryntum = true;
    isOverlay = false;
    employeeLoading$: Observable<boolean>;
    isSubmitted = false;
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
    selectedRequest: any;
    addRosterPriorInputForm: FormGroup;
    addRosterShiftInputForm: FormGroup;
    basicInfo: RosterBasicRequirement;
    rosterPlanInfo: any;
    isBudgetGiven = false;
    filterData: any;
    branchesList: any;
    priorInputData: any;
    addRosterPriorInputFormOldValue: any;

    currencyList$: Observable<CurrencyModel[]>
    shiftTimeList$: Observable<ShiftTimingModel[]>;
    employeeListDataDetails$: Observable<EmployeeListModel[]>;
    shiftwiseValueChanges$: any;
    departmentwiseValueChanges$: any;
    public ngDestroyed$ = new Subject();
    rosterPlanSolutions$: Observable<RosterPlanSolution[]>;
    rosterSolutionOutput$: Observable<any[]>;
    rosterSolutionCreationLoading$: Observable<boolean>;
    shiftDataLoading$: Observable<boolean>;

    constructor(private actionUpdates$: Actions, private formBuilder: FormBuilder,
        private rosterStore: Store<RosterState.State>, private toastr: ToastrService,
        private translateService: TranslateService,
        private commonService: CommonService,
        private routes: Router, private cookieService: CookieService,
        public dialogRef: MatDialogRef<ViewRosterPlanDetailsComponent>,
        public dialog: MatDialog, private rosterService: RosterService, private cdRef: ChangeDetectorRef,
        private rosterCommonService: RosterCommonService) {
        super();
        this.priorInputData = {};
        this.priorInputData.breakHours = 0;
        this.filteredPlansList = [];
        this.hasError = false;

        this.rosterSolutionCreationLoading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.createSolutionloading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted),
                tap(() => {
                    if (this.isSubmitted) {
                        this.selectedTabIndex = 0;
                        this.routes.navigate(["manageroster"]);
                    }
                    else {
                        this.toastr.success("", this.translateService.instant(ConstantVariables.RosterSavedSuccessfully));
                    }
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanFailed),
                tap((response: any) => {
                    if (response && response.validationMessages && response.validationMessages.length > 0) {
                        this.toastr.error("", response.validationMessages[0].message);
                    } else {
                        if (this.isSubmitted) {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterSubmitFailed));
                        }
                        else {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterSavedFailed));
                        }
                    }
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.isBudgetGiven = false;
        this.filterData = {};
        this.page.size = 100;
        this.selectedTabIndex = 0;
        this.selectedSolution = new RosterSolution();
        this.selectedSolution.solutionId = Guid.create().toString();
        this.selectedPlan = [];
        this.selectedRequest = {};
        this.requestId = Guid.create().toString();
        this.selectedRequest.requestId = this.requestId;

        this.getCurrencyList();
        this.getdepartments();
        this.getAllHolidays();
        this.getAllWeekDays();

        this.getAllBranches();
        this.getShiftTimingList();
        this.selectedSolution = undefined;
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        this.setCreatePlanForm();
        this.createShiftInputForm();
    }

    ngAfterViewInit() {
        if (this.createRosterNamePopover) {
            this.isBudgetGiven = true;
            this.createRosterNamePopover.openPopover()
        }
    }

    ngDoCheck(): void {
        if (this.createRosterNamePopover && !this.isBudgetGiven) {
            this.isBudgetGiven = true;
            this.createRosterNamePopover.openPopover()
        }
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

    getUsersList(branchId?: string) {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.branchId = branchId;
        employeeListSearchResult.sortBy = this.sortBy;
        employeeListSearchResult.sortDirectionAsc = this.sortDirection;
        employeeListSearchResult.pageNumber = this.page.pageNumber + 1;
        employeeListSearchResult.pageSize = this.page.size;
        employeeListSearchResult.isActive = true;
        this.allEmployeesSelected.deselect();
        this.employeeLoading$ = of(true);
        this.rosterService.getAllEmployees(employeeListSearchResult).subscribe((result: any) => {
            if (result && result.data) {
                this.employeeListDataDetails = result.data.sort((a, b) => a.userName.localeCompare(b.userName));
            }
            this.employeeLoading$ = of(false);
        });

        this.addRosterPriorInputForm.controls.employee.patchValue([]);
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
            if (this.company && this.company.currencyId) {
                this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
                if (!this.selectedCurrency) {
                    this.selectedCurrency = new CurrencyModel();
                    this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
                }
            } else {
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
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

    getAllBranches() {
        const selectBranch = new SelectBranch();
        this.rosterService.getAllBranches(selectBranch).subscribe((result: any) => {
            this.branchesList = result.data;
        });
    }

    setCreatePlanForm() {
        this.addRosterPriorInputForm = this.formBuilder.group({
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            rostName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])
            ),
            department: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            branchId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            employee: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            totalBudget: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.max(9999999999)
                ])
            ),
            breakHours: new FormControl("",
                Validators.compose([])
            ),
            isTemplate: new FormControl("",
                Validators.compose([
                ])
            )
        });
    }

    updateBudgetLabels(planList) {
        this.selectedPlan = planList;
        this.filteredPlansList = planList;
        this.setTotalBudget();
    }

    setTotalBudget() {
        this.budgetCalculated = this.selectedPlan.filter((x) => !x.isOverlay).reduce((s, f) => {
            return s + f.totalRate;
        }, 0);
        if (this.addRosterPriorInputForm.value.totalBudget < this.budgetCalculated) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterMaxBudget));
            return;
        }
    }

    validateSubmitPlan() {
        if (this.isBudgetGiven) {
            if (this.addRosterPriorInputForm.value.totalBudget < this.budgetCalculated) {
                this.submitPlanWithBudgetPopover.openPopover();
            } else {
                this.submitPlan(true);
            }

        } else {
            if (this.addRosterPriorInputForm.controls["rostName"].value == "") {
                this.addRosterPriorInputForm.controls["rostName"].setValidators([Validators.required]);
            } else {
                this.addRosterPriorInputForm.controls["rostName"].updateValueAndValidity();
                this.checkValidDateandName();
            }
        }
    }

    submitPlan(isSubmitted) {
        this.isSubmitted = isSubmitted;
        const rosterPlanInput = new RosterPlanInput();
        rosterPlanInput.requestId = this.requestId;
        rosterPlanInput.solution = this.selectedSolution;
        rosterPlanInput.plans = this.selectedPlan.filter((x) => !x.isOverlay);
        const basicInput = new RosterPlanBasicInput();
        basicInput.startDate = this.addRosterPriorInputForm.value.startDate;
        basicInput.endDate = this.addRosterPriorInputForm.value.endDate;
        basicInput.isTemplate = this.addRosterPriorInputForm.value.isTemplate;
        basicInput.rostName = this.addRosterPriorInputForm.value.rostName;
        basicInput.breakMins = this.addRosterPriorInputForm.value.breakHours;
        basicInput.branchId = this.addRosterPriorInputForm.value.branchId;
        basicInput.budget = this.addRosterPriorInputForm.value.totalBudget;
        basicInput.timeZone = new Date().getTimezoneOffset();
        basicInput.isSubmitted = isSubmitted;
        rosterPlanInput.basicInput = basicInput;
        this.rosterStore.dispatch(new CreateEmployeeRosterPlanTriggered(rosterPlanInput));
    }

    closecreateRostrNamePopup() {
        if (this.addRosterPriorInputFormOldValue) {
            this.addRosterPriorInputForm.patchValue(this.addRosterPriorInputFormOldValue);
        }
        this.createRosterNamePopover.closePopover();
    }

    closecreatePlanTriggerPopup() {
        this.createPlanConfirmationPopover.forEach((p) => p.closePopover());
    }

    createPlanTrigger(createPlanPopover) {
        if (this.selectedPlan.filter((x) => !x.isOverlay).length > 0) {

            createPlanPopover.openPopover();
        } else {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterSelectEmployee));
        }
    }

    previous() {
        this.routes.navigate(["manageroster"]);
    }

    autoRosterSelectionType(isAutoRoster) {
        if (isAutoRoster) {
            const dialogRef = this.dialog.open(AutoRosterComponent, {
                height: "auto",
                width: "calc(100vw- 100px)",
                disableClose: true,
                data: this.addRosterPriorInputForm.value
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result.success) {
                    if (result.data) {
                        this.requestId = result.data.requestId;
                        this.selectedSolution = result.data.solution;
                        this.selectedPlan = result.data.plans;
                        this.filteredPlansList = result.data.plans;
                        this.basicInfo = result.data.basicInfo;
                        this.addRosterPriorInputForm.controls["rostName"].setValue(this.basicInfo.rostName);
                        this.addRosterPriorInputForm.controls["startDate"].setValue(this.basicInfo.rostStartDate);
                        this.addRosterPriorInputForm.controls["endDate"].setValue(this.basicInfo.rostEndDate);
                        this.addRosterPriorInputForm.controls["totalBudget"].setValue(this.basicInfo.rostBudget);
                        this.addRosterPriorInputForm.controls["branchId"].setValue(this.basicInfo.branchId);
                        this.setTotalBudget();
                    }
                }
            });
        } else {
            const dialogRef = this.dialog.open(ViewAndLoadRosterTemplate, {
                height: "auto",
                width: "calc(100vw- 100px)",
                disableClose: true,
                data: { currency: this.selectedCurrency, dateFormat: this.dateFormat, preRequisites: this.addRosterPriorInputForm.value }
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result.success) {
                    if (result.data) {
                        this.requestId = result.data.requestId;
                        this.selectedSolution = result.data.solution;
                        this.selectedPlan = result.data.plans;
                        this.filteredPlansList = result.data.plans;
                        this.setTotalBudget();
                    }
                }
            });
        }
    }

    createShiftInputForm() {
        this.addRosterShiftInputForm = this.formBuilder.group({
            startDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            shifts: new FormControl("",
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
            )
        });
    }

    startDateChange() {
        this.minDateForEndDateForShift = this.addRosterShiftInputForm.value.startDate;
    }

    inputFormstartDateChange() {
        this.minDateForEndDateForInput = this.addRosterPriorInputForm.value.startDate;
    }

    loadPlansFromShiftTimings(createPlanWithShiftPopover) {
        this.createPlanWithShiftPopover = createPlanWithShiftPopover;
        this.createPlanWithShiftPopover.openPopover();
    }

    createPlansFromShift(isOverlay?: boolean) {
        if (this.isOverlay) {
            this.loadAllPrerequisitesForShift(isOverlay);
        }
    }

    loadAllPrerequisitesForShift(isOverlay) {
        this.shiftDataLoading$ = of(true);
        let reqObject = this.addRosterShiftInputForm.value;
        reqObject.branchId = this.addRosterPriorInputForm.value.branchId;
        reqObject.includeHolidays = this.addRosterShiftInputForm.value.includeHolidays == "No" ? false : true;
        reqObject.includeWeekends = this.addRosterShiftInputForm.value.includeWeekends == "No" ? false : true;
        if (isOverlay) {
            reqObject.startDate = this.addRosterPriorInputForm.value.startDate;
            reqObject.endDate = this.addRosterPriorInputForm.value.endDate;
            reqObject.shifts = this.shiftTimeList.map(x => x.shiftTimingId);
        }
        this.rosterService.getShiftwiseEmployeeRoster(reqObject).subscribe((response: any) => {
            this.shiftDataLoading$ = of(false);
            if (response && response.data && response.data.length > 0) {
                if (isOverlay) {
                    let shiftWisePlans = response.data.map(plan => {
                        let shiftwisePlan = Object.assign({}, plan);
                        shiftwisePlan.isOverlay = isOverlay;
                        return shiftwisePlan;
                    })
                    this.selectedPlan = [...this.selectedPlan.filter(x => this.priorInputData.employee.includes(x.employeeId)), ...shiftWisePlans];
                    this.filteredPlansList = [...this.filteredPlansList.filter(x => this.priorInputData.employee.includes(x.employeeId)), ...shiftWisePlans];
                    this.setTotalBudget();
                }
                else {
                    this.addRosterPriorInputForm.controls["startDate"].setValue(this.addRosterShiftInputForm.value.startDate);
                    this.addRosterPriorInputForm.controls["endDate"].setValue(this.addRosterShiftInputForm.value.endDate);
                    this.priorInputData = this.addRosterPriorInputForm.value;

                    this.selectedPlan = response.data.filter(x => this.priorInputData.employee.includes(x.employeeId));
                    this.filteredPlansList = response.data.filter(x => this.priorInputData.employee.includes(x.employeeId));
                    if (this.validateIfallReceived()) {
                        this.setTotalBudget();
                        this.closecreatePlanFromShiftTriggerPopup();
                    }
                }
            } else if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
                this.toastr.error("", response.apiResponseMessages[0].message);
            } else {
                this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeUnavailableInShift));
            }
        })
    }

    validateIfallReceived() {
        const distinctemployeeId = this.filteredPlansList.filter((thing, i, arr) => {
            return arr.indexOf(arr.find(t => t.employeeId === thing.employeeId)) === i;
        });
        const distinctDates = this.filteredPlansList.filter((thing, i, arr) => {
            return arr.indexOf(arr.find(t => t.planDate === thing.planDate)) === i;
        });
        if (distinctemployeeId.length == 0 || distinctDates.length == 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterTemplateALLEmployeeNotAvailable));
            return false;
        }
        let iswarning = false;
        if (this.employeeListDataDetails.length != distinctemployeeId.length) {
            iswarning = true;
        }
        let actualValues = distinctDates.length * this.employeeListDataDetails.length;
        if (actualValues > this.filteredPlansList.length) {
            iswarning = true;
        }
        if (iswarning) {
            this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterTemplateSOMEEmployeeNotAvailable));
        }
        return true;
    }

    setMaxDays() {
        this.all_days = [];
        if (this.addRosterShiftInputForm.value && this.addRosterShiftInputForm.value.includeHolidays
            && this.addRosterShiftInputForm.value.includeWeekends) {
            let refDate = this.addRosterShiftInputForm.value.startDate;
            while (refDate <= this.addRosterShiftInputForm.value.endDate) {
                let includeHoliday = true;
                let isHoliday = false;
                if (this.holidays) {
                    const holiday = this.holidays.find((x) => moment(x.date).toDate().toLocaleDateString() == moment(refDate).toDate().toLocaleDateString());
                    if (this.addRosterShiftInputForm.value.includeHolidays == "No" && holiday) {
                        includeHoliday = false;
                    }
                    if (this.addRosterShiftInputForm.value.includeHolidays == "Yes" && holiday) {
                        isHoliday = true;
                    }
                }
                if (this.weekdays && this.weekdays.length > 0) {
                    const weekend = this.weekdays.find((x) => x.isWeekend && x.weekDayId == moment(refDate).day())
                    if (this.addRosterShiftInputForm.value.includeWeekends == "No" && weekend) {
                        includeHoliday = false;
                    }
                    if (this.addRosterShiftInputForm.value.includeWeekends == "Yes" && weekend) {
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
        }
    }

    closecreatePlanFromShiftTriggerPopup() {
        this.createPlanWithShiftPopover.closePopover();
    }

    showOrHideOverlay() {
        if (this.isOverlay) {
            this.isOverlay = true;
            this.all_days = this.rosterCommonService.getDates(this.addRosterPriorInputForm.value.startDate, this.addRosterPriorInputForm.value.endDate);
            const employee = [...this.filteredEmployeeList];
            this.createPlansFromShift(true);
        } else {
            this.filteredPlansList = this.filteredPlansList.filter((x) => !x.isOverlay);
            this.isOverlay = false;
        }
    }

    filterEmployee(event) {
        console.log(event);
    }

    toggleAlldepartmentsSelected() {
        if (this.alldepartmentsSelected.selected) {
            this.addRosterPriorInputForm.controls.department.patchValue([
                ...this.departmentList.map((item) => item.departmentId),
                0
            ]);

        } else {
            this.addRosterPriorInputForm.controls.department.patchValue([]);
        }
    }

    toggleAllEmployeesSelected() {
        if (this.allEmployeesSelected.selected) {
            if (this.employeeListDataDetails
                .filter((x) => this.addRosterPriorInputForm.value.department.includes(x.departmentId) || !x.departmentId).length > 0
            ) {
                this.addRosterPriorInputForm.controls.employee.patchValue([
                    ...this.employeeListDataDetails
                        .filter((x) => this.addRosterPriorInputForm.value.department.includes(x.departmentId) || !x.departmentId)
                        .map((item) => item.employeeId),
                    0
                ]);
            } else {
                this.addRosterPriorInputForm.controls.employee.patchValue([]);
            }

        } else {
            this.addRosterPriorInputForm.controls.employee.patchValue([]);
        }
    }

    checkValidDateandName() {
        const rosterPlan = new RosterPlan();
        let rosterBasicDetails = new RosterBasicRequirement();
        rosterBasicDetails.rostName = this.addRosterPriorInputForm.value.rostName;
        rosterPlan.rosterBasicDetails = rosterBasicDetails;
        let error = false;
        let rosterName$ = this.rosterService.checkRosterName(rosterPlan);
        rosterName$
            .do((response) => {
                if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
                    error = true;
                    this.toastr.error("", this.translateService.instant(ConstantVariables.RosterNameAlreadyAvailable));
                } else {
                    error = false;
                }
            })
            .switchMap(() => {
                this.hasError = error;
                this.cdRef.detectChanges();
                if (!error) {
                    if (!this.isBudgetGiven) {
                        this.isBudgetGiven = true;
                        this.validateSubmitPlan();
                    } else {
                        this.filteredEmployeeList = this.employeeListDataDetails
                            .filter((x) => this.addRosterPriorInputForm.value.employee.includes(x.employeeId));
                        this.priorInputData = this.addRosterPriorInputForm.value;
                        if (this.selectedPlan && this.selectedPlan.length > 0) {
                            let filtered = this.selectedPlan.filter(x => this.priorInputData.employee.includes(x.employeeId));
                            if(filtered && filtered.length > 0)
                            {
                                filtered = filtered.filter(x => moment(x.planDate).toDate() >= moment(moment(this.addRosterPriorInputForm.value.startDate).toDate().toLocaleDateString()).toDate() && moment(x.planDate).toDate() <= moment(this.addRosterPriorInputForm.value.endDate).toDate());
                                this.selectedPlan = [...filtered];
                                this.filteredPlansList = [...filtered];
                                this.setTotalBudget();
                            } else{
                                this.selectedPlan = [];
                                this.filteredPlansList = [];
                                this.setTotalBudget();
                            }
                        }
                        this.createRosterNamePopover.closePopover();
                    }
                }
                return of(error);
            })
            .subscribe();
    }

    updateRosterPrerequisites() {
        this.addRosterPriorInputFormOldValue = this.addRosterPriorInputForm.value;
        this.createRosterNamePopover.openPopover();
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
    toggleScheduler(schedulerType) {
        if (this.isOverlay) {
            if (schedulerType == 2) {
                this.selectedPlan = this.selectedPlan.filter((x) => !x.isOverlay);
                this.filteredPlansList = this.filteredPlansList.filter((x) => !x.isOverlay);
            } else {
                const employee = [...this.filteredEmployeeList];
                this.createPlansFromShift(this.isOverlay)
            }
        }
    }

    cancelRosterSubmitPopover() {
        this.submitPlanWithBudgetPopover.closePopover();
    }

    departmentChange() {
        this.allEmployeesSelected.deselect();
        this.addRosterPriorInputForm.controls.employee.patchValue([]);
    }

    exportexcel() {
        this.scheduler.exportExcel();
        // this.rosterCommonService.exportEXCEL.emit(true);
    }

    exportpdf() {
        this.scheduler.exportPDF();
        // this.rosterCommonService.exportPDF.emit(true);
    }

    saveplan() {
        this.submitPlan(false);
    }
}
