import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { CreateFormGroupArgs, GridDataResult } from "@progress/kendo-angular-grid";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { process, State as KendoState } from "@progress/kendo-data-query";
import { CommonService } from "../services/common.service";
import { CurrencyModel } from "../models/currency-model";
import { ShiftTimingModel } from "../models/shift-timing-model";
import { Observable, Subject, of } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { DepartmentModel } from "../models/department-model";
import { EmployeeListModel } from "../models/employee-model";
import { RosterRequestModel } from "../models/roster-request-model";
import { RosterPlanOutputByRequestModel, DataType } from "../models/roster-request-plan-model";
import { EmployeeRosterActionTypes, GetEmployeeRosterByIdTriggered, UpdateEmployeeRosterById, UpdateEmployeeRosterTriggered, CreateEmployeeRosterPlanTriggered, ApproveEmployeeRosterTriggered, GetEmployeeRosterPlanRequestByIdTriggered, LoadEmployeeRateSheetDetailsTriggered } from "../store/actions/roster.action";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import * as RosterState from "../store/reducers/index";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import * as  _ from 'underscore';
import { RosterSolution } from "../models/roster-solution-model";
import schedulerConfig from "./schedulerConfig";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../models/constant-variables";
import { SelectBranch } from "../models/select-branch";
import { EmployeeDetailsSearchModel } from "../models/employee-details-search-model";
import { CookieService } from "ngx-cookie-service";
import { RosterPlanInput } from "../models/roster-plan-input-model";
import { RosterPlanBasicInput } from "../models/roster-plan-basicinput-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { RosterService } from '../services/roster-service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as moment_ from "moment";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewRosterPlanDetailsComponent } from './view-employee-roster-plan-details.component';
import { AutoRosterComponent } from './auto-employee-roster.component';
import { RosterBasicRequirement } from '../models/roster-basic-model';
import { ViewAndLoadRosterTemplate } from './template-employee-roster.component';
const moment = moment_;

enum PlanFiltertype {
    Employee = "employee",
    Department = "department",
    Shift = "shift"
}

@Component({
    selector: "app-hr-component-view-roster-details",
    templateUrl: `view-employee-roster-details.component.html`
})

export class ViewRosterDetailsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("createRosterNamePopover") createRosterNamePopover;
    @ViewChild('deleteRosterPopUp') deleteRosterPopUp;
    @ViewChild("createPlanConfirmationPopover") createPlanConfirmationPopover;
    @ViewChild("submitPlanWithBudgetPopover") submitPlanWithBudgetPopover;
    @ViewChild("createPlanWithShiftPopover") createPlanWithShiftPopover;

    schedulerConfig = schedulerConfig;
    isOpen: boolean = true;
    requestList: RosterRequestModel[];
    plansList: RosterPlanOutputByRequestModel[];
    page: any = {};
    actualData: SchedulerEvent[];
    plannedData: SchedulerEvent[];
    loggedUserDetails: any;
    company: any;
    dateFormat: any;
    currencyList: CurrencyModel[];
    selectedCurrency: CurrencyModel;
    totalPlanData: any;
    plannedBudget: number;
    actualBudget: number;
    displaySchduler: boolean;
    dataType = DataType.Planned;
    shiftTimeList: ShiftTimingModel[];
    departmentList: DepartmentModel[];
    filteredDepartmentList: DepartmentModel[];
    employeeListDataDetails: EmployeeListModel[];
    filteredEmployeeList: EmployeeListModel[];
    sortBy: string;
    sortDirection = false;
    formGroup: FormGroup;
    addRosterPriorInputForm: FormGroup;
    addRosterShiftInputForm: FormGroup;
    kendoState: KendoState;
    pageable: boolean;
    gridView: any;
    selectedRequest: RosterRequestModel;
    filterable = false;
    selectedSolution: RosterSolution;
    filteredPlansList: RosterPlanOutputByRequestModel[];
    searchText: string;
    editable: boolean;
    filterData: any;
    isArchived: boolean = false;
    isPlanArchived: boolean = false;
    isBryntum = true;
    requestId: string;
    isPrevLast: boolean;
    isNextLast: boolean;
    canAccess_feature_EditRoster: boolean;
    branchesList: any;
    minDateForEndDateForInput = new Date();
    requestListGridData: GridDataResult;
    saveType: any;
    basicInfo: RosterBasicRequirement;
    minDateForEndDateForShift: Date;
    zoom: number;
    minDate = new Date();

    requestList$: Observable<RosterRequestModel[]>;
    plansList$: Observable<RosterPlanOutputByRequestModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    currencyList$: Observable<CurrencyModel[]>;
    public ngDestroyed$ = new Subject();
    shiftTimeList$: Observable<ShiftTimingModel[]>;
    approvePlanloading$: Observable<boolean>;
    savePlanloading$: Observable<boolean>;
    shiftDataLoading$: Observable<boolean>;

    constructor(private actionUpdates$: Actions,
        private rosterStore: Store<RosterState.State>,
        private commonService: CommonService, private cookieService: CookieService,
        private routes: Router, private router: Router,
        private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder,
        private toastr: ToastrService, private translateService: TranslateService,
        private rosterService: RosterService,
        public dialogRef: MatDialogRef<ViewRosterPlanDetailsComponent>,
        public dialog: MatDialog) {
        super();
        // this.getfromurlparams();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.GetEmployeeRosterByIdCompleted),
                tap(() => {
                    this.displaySchduler = true;
                    this.plansList$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterPlansAll));
                    this.plansList$.subscribe((result) => {
                        this.plansList = result;
                        this.filterSolution(this.dataType);
                        if (result && result.length > 0) {
                            this.selectedSolution = new RosterSolution();
                            this.selectedSolution.solutionId = result[0].solutionId;
                        }
                    })
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdCompleted),
                tap((result: any) => {
                    this.selectedRequest = result.rosterRequest;
                    this.setCreatePlanForm();
                    this.getUsersList();
                    if (this.selectedRequest && !this.selectedRequest.previousValue) {
                        this.isPrevLast = true;
                    } else {
                        this.isPrevLast = false;
                    }
                    if (this.selectedRequest && !this.selectedRequest.nextValue) {
                        this.isNextLast = true;
                    } else {
                        this.isNextLast = false;
                    }
                    this.rosterStore.dispatch(new GetEmployeeRosterByIdTriggered(this.selectedRequest.requestId));
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted),
                tap(() => {
                    if (this.saveType == "save") {
                        this.toastr.success("", this.translateService.instant(ConstantVariables.RosterSavedSuccessfully));
                    } else {
                        this.clearFilters();
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanFailed),
                tap((result: any) => {
                    this.toastr.error("", result.validationMessages[0].message);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.ApproveEmployeeRosterCompleted),
                tap(() => {
                    this.clearFilters();
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.ApproveEmployeeRosterFailed),
                tap((result: any) => {
                    this.toastr.error("", result.validationMessages[0].message);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.UpdateEmployeeRosterCompleted),
                tap(() => {
                    this.requestList$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterRequestsAll));
                    this.requestList$.subscribe((result) => {
                        this.requestList = result;
                        this.gridView = {
                            data: this.requestList,
                            total: result[0].totalCount
                        }
                        if ((result.length > 0 && result[0].totalCount <= this.kendoState.take && this.kendoState.take <= 0)) {
                            this.pageable = false;
                        } else {
                            this.pageable = true;
                        }
                        this.requestListGridData = process(this.gridView, this.kendoState);
                    });
                })
            )
            .subscribe();
        this.approvePlanloading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.approvePlanloading));

        // this.employeeListDataDetails$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getEmployeeAll));
        // this.employeeListDataDetails$.subscribe((result: EmployeeListModel[]) => {
        //     this.employeeListDataDetails = result.sort((a, b) => a.userName.localeCompare(b.userName));
        //     this.filteredEmployeeList = result.sort((a, b) => a.userName.localeCompare(b.userName));
        // });
        // this.shiftTimeList$ = this.hrManagementstore.pipe(select(hrManagementModuleReducer.getShiftTimingAll));
        // this.shiftTimeList$.subscribe((result) => {
        //     this.shiftTimeList = result;
        // });
        // this.router.routeReuseStrategy.shouldReuseRoute = function() {
        //     return false;
        // };
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        this.filterData = {};
        this.totalPlanData = [];
        this.page.size = 5;
        this.page.pageNumber = 0;
        this.displaySchduler = false;
        this.pageable = true;
        this.editable = this.canAccess_feature_EditRoster;

        this.kendoState = {
            skip: 0,
            take: 5,
            filter: {
                logic: 'or',
                filters: []
            }
        };
        this.dateFormat = {};
        this.dateFormat.pattern = ConstantVariables.DateFormat;
        this.getCurrencyList();
        this.setCreatePlanForm();
        this.createShiftInputForm();
        this.getShiftTimingList();
        this.getdepartments();
        this.getAllBranches();
        this.getUsersList();
    }

    getAllBranches() {
        const selectBranch = new SelectBranch();
        this.rosterService.getAllBranches(selectBranch).subscribe((result: any) => {
            this.branchesList = result.data;
        });
    }

    getShiftTimingList() {
        const shiftTimingSearchModel = new ShiftTimingModel();
        shiftTimingSearchModel.isArchived = false;
        // this.hrManagementstore.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
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
                // let notKnown = new DepartmentModel();
                // notKnown.departmentName = "Not known";
                // this.departmentList.push(notKnown);
                this.filteredDepartmentList = response.data;
                // this.filteredDepartmentList.push(notKnown);
            }
        });
    }

    getUsersList() {
        if (this.selectedRequest) {
            const employeeListSearchResult = new EmployeeListModel();
            employeeListSearchResult.branchId = this.selectedRequest.branchId ? this.selectedRequest.branchId : "";
            employeeListSearchResult.sortBy = this.sortBy;
            employeeListSearchResult.sortDirectionAsc = this.sortDirection;
            employeeListSearchResult.pageNumber = 1;
            employeeListSearchResult.pageSize = 100;
            employeeListSearchResult.isActive = true;
            // this.hrManagementstore.dispatch(new LoadEmployeeListItemsTriggered(employeeListSearchResult));
            this.rosterService.getAllEmployees(employeeListSearchResult).subscribe((result: any) => {
                if (result && result.data) {
                    this.employeeListDataDetails = result.data.sort((a, b) => a.userName.localeCompare(b.userName));
                    this.filteredEmployeeList = result.data.sort((a, b) => a.userName.localeCompare(b.userName));
                }
            });
        }
    }

    getCompanyDetails() {
        //this.commonService.GetCompanyById(companyId).subscribe((response: any) => {
        this.company = this.cookieService.get(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company) {
            if (this.company.currencyId) {
                this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
                if (!this.selectedCurrency) {
                    this.selectedCurrency = new CurrencyModel();
                    this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
                }
            } else {
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
            // this.getdateFormats(this.company.dateFormatId);
        }
        // });
    }

    getdateFormats(dateFormatId: string) {
        if (dateFormatId) {
            this.commonService.GetDateFormatById(dateFormatId).subscribe((response: any) => {
                if (response.success == true) {
                    this.dateFormat = response.data;
                    this.commonService.dateFormat.emit(response.data);
                }
            });
        } else {
            this.dateFormat = {};
            this.dateFormat.pattern = ConstantVariables.DateFormat;
        }
    }

    getCurrencyList() {
        var currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;

        this.rosterService.getCurrencies(currencyModel).subscribe((response: any) => {
            this.currencyList = response.data;
            this.getCompanyDetails();
            this.getfromurlparams();
        });
    }

    getfromurlparams() {
        this.activatedRoute.queryParams.subscribe(routeParams => {
            if (routeParams.id) {
                this.getRequestData(routeParams.id);
            }
        })
    }

    getRequestData(requestId, isfromPageChange?: boolean) {
        if (isfromPageChange) {
            this.router.navigate([], {
                queryParams: { id: requestId },
                queryParamsHandling: 'merge',
                replaceUrl: true
            });
        }
        this.requestId = requestId;
        let requestObject = { requestId, pageSize: 1, pageNumber: 0 };
        this.rosterStore.dispatch(new GetEmployeeRosterPlanRequestByIdTriggered(requestObject));

        this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.loadingEmployeeRoster));
    }

    setCreatePlanForm() {
        this.addRosterPriorInputForm = this.formBuilder.group({
            startDate: new FormControl(this.selectedRequest && this.selectedRequest.requiredFromDate ? this.selectedRequest.requiredFromDate : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl(this.selectedRequest && this.selectedRequest.requiredToDate ? this.selectedRequest.requiredToDate : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            rostName: new FormControl(this.selectedRequest && this.selectedRequest.requestName ? this.selectedRequest.requestName : "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(150)
                ])
            ),
            branchId: new FormControl(this.selectedRequest && this.selectedRequest.branchId ? this.selectedRequest.branchId : "",
                Validators.compose([
                    Validators.required
                ])
            ),
            totalBudget: new FormControl(this.selectedRequest && this.selectedRequest.requiredBudget ? this.selectedRequest.requiredBudget : "",
                Validators.compose([
                    Validators.required])
            ),
            breakHours: new FormControl(this.selectedRequest && this.selectedRequest.requiredBreakMins ? this.selectedRequest.requiredBreakMins : "",
                Validators.compose([])
            ),
            isTemplate: new FormControl(this.selectedRequest && this.selectedRequest.isTemplate ? this.selectedRequest.isTemplate : false,
                Validators.compose([
                ])
            )
        });
        this.inputFormstartDateChange();
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

    updateRosterPrerequisites() {
        this.setCreatePlanForm();
        this.createRosterNamePopover.openPopover();
    }

    updateRequestValues() {
        this.selectedRequest = Object.assign({}, this.selectedRequest);
        this.selectedRequest.requiredFromDate = moment(this.addRosterPriorInputForm.value.startDate).toDate();
        this.selectedRequest.requiredToDate = moment(this.addRosterPriorInputForm.value.endDate).toDate();
        this.selectedRequest.isTemplate = this.addRosterPriorInputForm.value.isTemplate;
        this.selectedRequest.requiredBudget = this.addRosterPriorInputForm.value.totalBudget;
        this.plansList = this.plansList.filter(m => moment(m.planDate).toDate() >=  moment(moment(this.addRosterPriorInputForm.value.startDate).toDate().toLocaleDateString()).toDate() && moment(m.planDate).toDate() <= moment(this.addRosterPriorInputForm.value.endDate).toDate());
        this.filteredPlansList = [...this.plansList];
        this.setTotalBudget();
        this.closePopOver();
    }

    closePopOver() {
        this.createRosterNamePopover.closePopover();
    }

    public filterSolution(dataType: DataType, filterData?: any, filterType?: any) {
        this.dataType = dataType;
        this.totalPlanData = [];
        if ((filterData &&
            ((typeof (filterData.value) == "string" && filterData.value) ||
                (typeof (filterData.value) == "object") && filterData.value.length > 0))
            || !this.canAccess_feature_EditRoster || (this.selectedRequest && this.selectedRequest.statusName === "Approved")) {
            this.editable = false;
        } else {
            this.editable = true;
        }

        this.filteredPlansList = this.plansList.filter((dataItem) => {
            let isTrue = true;
            if (filterData) {
                if (filterData.value && filterData.value.length > 0) {
                    if (filterData.value.includes(dataItem.shiftId) || filterData.value.includes(dataItem.departmentId) ||
                        (dataType === DataType.Planned && filterData.value.includes(dataItem.plannedEmployeeId || dataItem.employeeId)) ||
                        (dataType === DataType.Actual && filterData.value.includes(dataItem.actualEmployeeId))) {
                        isTrue = true;
                    } else {
                        isTrue = false;
                    }
                }
            }

            if (dataType == DataType.Actual) {
                dataItem.actualFromTime && dataItem.actualToTime ? isTrue = true : isTrue = false;
            }
            return isTrue;
        })
        if (this.isBryntum) {
            if (filterType == PlanFiltertype.Employee) {
                if (filterData.value && filterData.value.length > 0) {
                    this.filteredEmployeeList = this.employeeListDataDetails.filter((x) => filterData.value.includes(x.employeeId))
                } else {
                    this.filteredEmployeeList = [...this.employeeListDataDetails];
                }
            } else if (filterType == PlanFiltertype.Department) {
                if (filterData.value && filterData.value.length > 0) {
                    this.filteredDepartmentList = this.departmentList.filter((x) => filterData.value.includes(x.departmentId))
                    this.filteredEmployeeList = this.employeeListDataDetails.filter((x) => filterData.value.includes(x.departmentId))
                } else {
                    this.filteredDepartmentList = [...this.departmentList];
                    this.filteredEmployeeList = [...this.employeeListDataDetails];
                }
            }
        }
        this.setTotalBudget();
    }

    setTime(dataItem: any, isStart) {
        const date = moment(dataItem.planDate);
        let endTime;
        if (!this.selectedRequest || !this.selectedRequest.requestId) {
            if (isStart) {
                if (dataItem.fromTime) {
                    endTime = moment(dataItem.fromTime, "HH:mm");
                } else {
                    endTime = moment("00:00:00", "HH:mm");
                }
            } else {
                if (dataItem.toTime) {
                    endTime = moment(dataItem.toTime, "HH:mm");
                } else {
                    endTime = moment("23:59:59", "HH:mm");
                }
            }
        } else {
            if ((this.selectedRequest && this.selectedRequest.requestId) && this.dataType == DataType.Actual) {
                if (isStart) {
                    if (dataItem.actualFromTime) {
                        endTime = moment(dataItem.actualFromTime, "HH:mm");
                    } else {
                        endTime = moment("00:00:00", "HH:mm");
                    }
                } else {
                    if (dataItem.actualToTime) {
                        endTime = moment(dataItem.actualToTime, "HH:mm");
                    } else {
                        endTime = moment("23:59:59", "HH:mm");
                    }
                }
            } else if ((this.selectedRequest && this.selectedRequest.requestId) && this.dataType == DataType.Planned) {
                if (isStart) {
                    if (dataItem.plannedFromTime || dataItem.fromTime) {
                        endTime = moment(dataItem.plannedFromTime || dataItem.fromTime, "HH:mm");
                    } else {
                        endTime = moment("00:00:00", "HH:mm");
                    }
                } else {
                    if (dataItem.plannedToTime || dataItem.toTime) {
                        endTime = moment(dataItem.plannedToTime || dataItem.toTime, "HH:mm");
                    } else {
                        endTime = moment("23:59:59", "HH:mm");
                    }
                }
            } else {
                if (isStart) {
                    if (dataItem.fromTime) {
                        endTime = moment(dataItem.fromTime, "HH:mm");
                    } else {
                        endTime = moment("00:00:00", "HH:mm");
                    }
                } else {
                    if (dataItem.toTime) {
                        endTime = moment(dataItem.toTime, "HH:mm");
                    } else {
                        endTime = moment("23:59:59", "HH:mm");
                    }
                }
            }
        }

        date.set({
            hour: endTime.get("hour"),
            minute: endTime.get("minute"),
            second: endTime.get("second")
        });
        return date;
    }

    updateBudgetLabels(plans) {
        this.plansList = plans;
        this.filteredPlansList = plans;
        this.setTotalBudget();
    }

    setTotalBudget() {
        this.plannedBudget = this.plansList.reduce((s, f) => {
            return s + (f.plannedRate || f.totalRate ? f.plannedRate || f.totalRate : 0);
        }, 0);

        this.actualBudget = this.plansList.reduce((s, f) => {
            return s + (f.actualRate ? f.actualRate : 0);
        }, 0);
    }

    public clearFilters() {
        this.displaySchduler = false;
        this.isBryntum = true;
        this.selectedRequest = null;
        this.dataType = DataType.Planned;
        this.routes.navigate(["manageroster"]);
    }

    public createFormGroup(args: CreateFormGroupArgs): FormGroup {
        const dataItem = args.dataItem;
        if (args.isNew) {
            this.formGroup = new FormGroup({
                // 'id': this.getNextId(),
                start: new FormControl(dataItem.start, Validators.required),
                end: new FormControl(dataItem.end, Validators.required),
                startTimezone: new FormControl(dataItem.startTimezone),
                endTimezone: new FormControl(dataItem.endTimezone),
                isAllDay: new FormControl(dataItem.isAllDay),
                title: new FormControl(dataItem.title),
                description: new FormControl(dataItem.description),
                employeeId: new FormControl(""),
                departmentId: new FormControl(""),
                shiftId: new FormControl("")
            });
            return this.formGroup;
        } else {
            this.formGroup = new FormGroup({
                // 'id': dataItem.id,
                start: new FormControl(dataItem.start, Validators.required),
                end: new FormControl(dataItem.end, [Validators.required]),
                startTimezone: new FormControl(dataItem.startTimezone),
                endTimezone: new FormControl(dataItem.endTimezone),
                isAllDay: new FormControl(dataItem.isAllDay),
                title: new FormControl(dataItem.title),
                description: new FormControl(dataItem.description),
                employeeId: new FormControl(dataItem.dataItem.employeeId),
                departmentId: new FormControl(dataItem.dataItem.departmentId),
                shiftId: new FormControl(dataItem.dataItem.shiftId)
            });

            return this.formGroup;
        }
    }

    filterClick() {
        if (this.displaySchduler) {
            this.isOpen = !this.isOpen;
            if (window.matchMedia("(max-width: 768px)").matches) {
                return false;
            } else {
                return true;
            }
        } else {
            this.filterable = !this.filterable;
            if (!this.filterable) {
                this.searchText = ""
            }
        }
    }

    submitPlan(saveType) {
        this.saveType = saveType;
        if (!this.plansList || (this.plansList && this.plansList.length <= 0)) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterNoPlansToProceed));
            return;
        }
        let plans: RosterPlanOutput[];
        plans = this.plansList.map((dataItem) => (
            {
                solutionId: dataItem.solutionId,
                planId: dataItem.planId,
                planDate: dataItem.planDate,
                departmentId: dataItem.departmentId,
                departmentName: dataItem.departmentName,
                shiftId: dataItem.shiftId,
                employeeId: (dataItem.employeeId || dataItem.plannedEmployeeId),
                currencyCode: dataItem.currencyCode,
                totalRate: dataItem.plannedRate || dataItem.totalRate,
                fromTime: dataItem.plannedFromTime || dataItem.fromTime,
                toTime: dataItem.plannedToTime || dataItem.toTime
            } as RosterPlanOutput
        ));

        const rosterPlanInput = new RosterPlanInput();
        const basicInput = new RosterPlanBasicInput();
        rosterPlanInput.requestId = this.selectedRequest.requestId;
        rosterPlanInput.plans = plans;
        basicInput.startDate = this.addRosterPriorInputForm.value.startDate;
        basicInput.endDate = this.addRosterPriorInputForm.value.endDate;
        basicInput.isApprove = saveType == "approve" ? true : false;
        basicInput.isSubmitted = saveType == "save" ? false : true;
        basicInput.timeZone = new Date().getTimezoneOffset();
        basicInput.budget = this.addRosterPriorInputForm.value.totalBudget;
        basicInput.branchId = this.addRosterPriorInputForm.value.branchId;
        basicInput.isTemplate = this.addRosterPriorInputForm.value.isTemplate;
        rosterPlanInput.basicInput = basicInput;
        if (saveType == "save" || saveType == "submit") {
            this.rosterStore.dispatch(new CreateEmployeeRosterPlanTriggered(rosterPlanInput));
            this.savePlanloading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.createSolutionloading));
        } else {
            this.rosterStore.dispatch(new ApproveEmployeeRosterTriggered(rosterPlanInput));
            this.approvePlanloading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.approvePlanloading));
        }
    }

    goToUserProfile(event, selectedUserId) {
        event.stopPropagation();
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    resetAllFilters() {
        this.filterData = {};
        this.filteredPlansList = [...this.plansList];
        this.filteredDepartmentList = [...this.departmentList];
        this.filteredEmployeeList = [...this.employeeListDataDetails];
    }

    toggleScheduler(toggleValue) {

    }

    getRosterDetails(event, dataItem, deleteRosterPopUp) {
        this.selectedRequest = dataItem;
        deleteRosterPopUp.openPopover();
        event.stopPropagation();
        event.preventDefault();
    }

    removeHandler() {
        let rosterPlanInput = new RosterPlanInput();
        rosterPlanInput.requestId = this.selectedRequest.requestId;
        const basicInput = new RosterPlanBasicInput();
        basicInput.isArchived = !this.isArchived;
        basicInput.timeZone = new Date().getTimezoneOffset();
        rosterPlanInput.basicInput = basicInput;
        this.isPlanArchived = true;
        this.rosterStore.dispatch(new CreateEmployeeRosterPlanTriggered(rosterPlanInput));
        this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.loadingEmployeeRoster));
    }

    onSchedulerEvents(event) {
        console.log(event);
    }

    cancelDeleteRosterPopover() {
        this.deleteRosterPopUp.closePopover();
    }

    inputFormstartDateChange() {
        this.minDateForEndDateForInput = this.addRosterPriorInputForm.value.startDate;
    }


    validateSubmitPlan() {
        if (this.addRosterPriorInputForm.value.totalBudget < this.plannedBudget) {
            this.submitPlanWithBudgetPopover.openPopover();
        } else {
            this.submitPlan('submit');
        }
    }

    createPlanTrigger(createPlanPopover) {
        if (this.plansList.length > 0) {
            createPlanPopover.openPopover();
        } else {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterSelectEmployee));
        }
    }

    closecreatePlanTriggerPopup() {
        this.createPlanConfirmationPopover.closePopover();
    }

    cancelRosterSubmitPopover() {
        this.submitPlanWithBudgetPopover.closePopover();
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

                    this.plansList = [...this.plansList, ...shiftWisePlans];
                    this.filteredPlansList = [...this.filteredPlansList, ...shiftWisePlans];
                    this.setTotalBudget();
                }
                else {
                    this.plansList = response.data;
                    this.filteredPlansList = response.data;
                    this.setTotalBudget();
                    this.closecreatePlanFromShiftTriggerPopup();
                }
            } else if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
                this.toastr.error("", response.apiResponseMessages[0].message);
            } else {
                this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeUnavailableInShift));
            }
        })
        // this.setMaxDays();
        // let shiftwiseEmployees = this.filteredEmployeeList.filter((x) => this.addRosterShiftInputForm.value.shifts.includes(x.shiftTimingId));
        // if (shiftwiseEmployees && shiftwiseEmployees.length > 0) {
        //     this.createPlansFromShift(shiftwiseEmployees);
        //     this.closecreatePlanFromShiftTriggerPopup();
        // } else {
        //     this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeUnavailableInShift));
        // }
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
                        this.plansList = result.data.plans;
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
                        this.plansList = result.data.plans;
                        this.filteredPlansList = result.data.plans;
                        this.setTotalBudget();
                    }
                }
            });
        }
    }


    startDateChange() {
        this.minDateForEndDateForShift = this.addRosterShiftInputForm.value.startDate;
    }

    loadPlansFromShiftTimings(createPlanWithShiftPopover) {
        this.createPlanWithShiftPopover = createPlanWithShiftPopover;
        this.createPlanWithShiftPopover.openPopover();
    }

    closecreatePlanFromShiftTriggerPopup() {
        this.createPlanWithShiftPopover.closePopover();
    }

    zoomin() {
        if (this.zoom > 0) {
            this.zoom = this.zoom + 1;
        } else {
            this.zoom = 1;
        }
    }

    zoomout() {
        if (this.zoom < 0) {
            this.zoom = this.zoom - 1;
        } else {
            this.zoom = -1;
        }
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}
