import { Component, OnInit, ViewChildren } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { CreateFormGroupArgs, GridDataResult, PageChangeEvent, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { SaveEvent, SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { process, State as KendoState } from "@progress/kendo-data-query";
import { CommonService } from "../services/common.service";
import { CurrencyModel } from "../models/currency-model";
import { ShiftTimingModel } from "../models/shift-timing-model";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { DepartmentModel } from "../models/department-model";
import { EmployeeListModel } from "../models/employee-model";
import { RosterRequestModel } from "../models/roster-request-model";
import { RosterPlanOutputByRequestModel, DataType } from "../models/roster-request-plan-model";
import { EmployeeRosterActionTypes, GetEmployeeRosterByIdTriggered, LoadEmployeeRosterPlansTriggered, UpdateEmployeeRosterById, UpdateEmployeeRosterTriggered, CreateEmployeeRosterPlanTriggered, ApproveEmployeeRosterTriggered } from "../store/actions/roster.action";
import * as rosterManagementModuleReducer from "../store/reducers/index";
import * as RosterState from "../store/reducers/index";
import { RosterPlanOutput } from "../models/roster-planoutput-model";
import * as _ from 'underscore';
import { RosterSolution } from "../models/roster-solution-model";
import { CookieService } from "ngx-cookie-service";
import { RosterPlanInput } from "../models/roster-plan-input-model";
import { RosterPlanBasicInput } from "../models/roster-plan-basicinput-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ConstantVariables } from '../models/constant-variables';
import { RosterService } from '../services/roster-service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as moment_ from "moment";
const moment = moment_;

@Component({
    selector: "app-hr-component-view-roster",
    templateUrl: `view-employee-roster.component.html`
})

export class ViewRosterComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteRosterPopUp") deleteRosterPopUp;

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
    employeeListDataDetails: EmployeeListModel[];
    sortBy: string;
    sortDirection = false;
    formGroup: FormGroup;
    kendoState: KendoState;
    pageable: boolean;
    gridView: any;
    selectedRequest: any;
    filterable = false;
    selectedSolution: RosterSolution;
    filteredPlansList: RosterPlanOutputByRequestModel[];
    searchText: string;
    editable: boolean;
    filterData: any;
    isArchived: boolean = false;
    isPlanArchived: boolean = false;
    isBryntum = true;
    canAccess_feature_EditRoster: boolean;

    requestListGridData: GridDataResult;

    requestList$: Observable<RosterRequestModel[]>;
    plansList$: Observable<RosterPlanOutputByRequestModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    currencyList$: Observable<CurrencyModel[]>;
    public ngDestroyed$ = new Subject();
    shiftTimeList$: Observable<ShiftTimingModel[]>;
    employeeListDataDetails$: Observable<EmployeeListModel[]>;
    approvePlanloading$: Observable<boolean>;

    constructor(private actionUpdates$: Actions, private rosterStore: Store<RosterState.State>,
        private commonService: CommonService, private cookieService: CookieService,
        private routes: Router, private router: Router,
        private rosterService: RosterService) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.LoadEmployeeRosterPlansCompleted),
                tap(() => {
                    this.requestList$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.getRosterRequestsAll));
                    this.requestList$.subscribe((result) => {
                        if (result) {
                            this.requestList = result;
                            this.gridView = {
                                data: this.requestList,
                                total: result.length > 0 ? result[0].totalCount : 0,
                            }
                            if (result.length > 0 && result[0].totalCount > 10) {
                                this.pageable = true;
                            } else {
                                this.pageable = false;
                            }
                            // this.requestListGridData = process(this.gridView, this.kendoState);
                        }
                    });
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted),
                tap(() => {
                    this.cancelRosterPopover();
                    this.clearFilters();
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
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedCurrency = new CurrencyModel();
        this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        this.filterData = {};
        this.totalPlanData = [];
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.displaySchduler = false;
        this.pageable = true;
        this.editable = true;
        this.kendoState = {
            skip: 0,
            take: 10,
            filter: {
                logic: 'or',
                filters: []
            }
        };
        this.dateFormat = {};
        this.dateFormat.pattern = ConstantVariables.DateFormat;

        this.getCurrencyList();
        this.getShiftTimingList();
        this.getdepartments();
        this.getUsersList();
    }

    getShiftTimingList() {
        const shiftTimingSearchModel = new ShiftTimingModel();
        shiftTimingSearchModel.isArchived = false;
        this.rosterService
            .getAllShiftTimings(shiftTimingSearchModel)
            .subscribe((shifts: any) => {
                this.shiftTimeList = shifts.data;
            })

        // this.hrManagementstore.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
    }

    getdepartments() {
        const departmentModel = new DepartmentModel();
        departmentModel.isArchived = false;
    }

    getUsersList() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.sortBy = this.sortBy;
        employeeListSearchResult.sortDirectionAsc = this.sortDirection;
        employeeListSearchResult.pageNumber = 1;
        employeeListSearchResult.pageSize = 100;
        employeeListSearchResult.isActive = true;
        this.rosterService.getAllEmployees(employeeListSearchResult).subscribe((result: any) => {
            if (result && result.data) {
                this.employeeListDataDetails = result.data.sort((a, b) => a.userName.localeCompare(b.userName));
            }
        });
    }

    getCompanyDetails() {
        this.company = this.cookieService.get(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company) {
            // this.getdateFormats(this.company.dateFormatId);
            if (this.company.currencyId) {
                this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
                if (!this.selectedCurrency) {
                    this.selectedCurrency = new CurrencyModel();
                    this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
                }
            } else {
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
            
        }
        this.getRequestList();
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
        });
    }

    getRequestList() {
        let requestId = "";
        let rosterPlan: any = {};
        rosterPlan.pageSize = this.kendoState.take;
        rosterPlan.pageNumber = this.kendoState.skip;
        rosterPlan.OrderByField = this.sortBy;
        rosterPlan.OrderByDirection = this.sortDirection;
        rosterPlan.searchText = this.searchText;
        rosterPlan.isArchived = this.isArchived;

        this.rosterStore.dispatch(new LoadEmployeeRosterPlansTriggered(rosterPlan));
        this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.loadingEmployeeRoster));
    }

    getArchiveAndUnarchived() {
        this.kendoState.skip = 0;
        this.getRequestList();
    }

    getRosterDetails(event, dataItem, deleteRosterPopUp) {
        this.selectedRequest = dataItem;
        deleteRosterPopUp.openPopover();
        event.stopPropagation();
        event.preventDefault();
    }

    cancelRosterPopover() {
        if (!this.displaySchduler)
            this.selectedRequest = {};
        this.deleteRosterPopUp.forEach((p) => p.closePopover());
        if (this.isPlanArchived) {
            this.isPlanArchived = false;
            this.getRequestList();
        }
    }

    onSelect(selected) {
        if (!this.isArchived) {
            this.selectedRequest = selected.dataItem;
            if (this.selectedRequest.statusName == "Drafted") {
                this.routes.navigate(["manageroster/createroster"], { queryParams: { id: this.selectedRequest.requestId } });
            }
            if (this.selectedRequest.statusName != "Drafted") {
                this.routes.navigate(["manageroster/updateroster"], { queryParams: { id: this.selectedRequest.requestId } });
            }
        }
    }

    removeHandler() {
        const rosterplanInput = new RosterPlanInput();
        const basicInput = new RosterPlanBasicInput();
        rosterplanInput.requestId = this.selectedRequest.requestId;
        basicInput.isArchived = !this.isArchived;
        basicInput.timeZone = new Date().getTimezoneOffset();
        rosterplanInput.basicInput = basicInput;

        this.isPlanArchived = true;
        this.rosterStore.dispatch(new CreateEmployeeRosterPlanTriggered(rosterplanInput));
        this.anyOperationInProgress$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.loadingEmployeeRoster));
    }

    pageChange(event: PageChangeEvent) {
        this.kendoState.skip = event.skip;
        this.getRequestList();
    }

    public filterSolution(dataType: DataType, filterData?: any) {
        this.dataType = dataType;
        this.totalPlanData = [];
        if (filterData) {
            this.editable = false;
        } else {
            this.editable = true;
        }
        this.filteredPlansList = this.plansList.filter((dataItem) => {
            let isTrue = true;
            if (filterData) {
                if (filterData.value && filterData.value.length > 0) {
                    if (filterData.value.includes(dataItem.shiftId) || filterData.value.includes(dataItem.departmentId) ||
                        (dataType === DataType.Planned && filterData.value.includes(dataItem.plannedEmployeeId)) ||
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
                    if (dataItem.plannedFromTime) {
                        endTime = moment(dataItem.plannedFromTime, "HH:mm");
                    } else {
                        endTime = moment("00:00:00", "HH:mm");
                    }
                } else {
                    if (dataItem.plannedToTime) {
                        endTime = moment(dataItem.plannedToTime, "HH:mm");
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
            return s + (f.plannedRate ? f.plannedRate : 0);
        }, 0);

        this.actualBudget = this.plansList.reduce((s, f) => {
            return s + (f.actualRate ? f.actualRate : 0);
        }, 0);
    }

    public clearFilters() {
        this.displaySchduler = false;
        this.isBryntum = true;
        this.selectedRequest = {};
        this.dataType = DataType.Planned;
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

    addRoster() {
        this.routes.navigate(["manageroster/createroster"]);
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.kendoState = state;
        if (this.kendoState.sort[0]) {
            this.sortBy = this.kendoState.sort[0].field;
            this.sortDirection = this.kendoState.sort[0].dir == "asc" ? true : false;
        }
        if (this.kendoState.filter.filters[0]) {
            this.searchText = JSON.stringify(this.kendoState.filter.filters);
        } else {
            this.searchText = ""
        }
        this.getRequestList();
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

    onApprove() {
        let plans: RosterPlanOutput[];
        plans = this.plansList.map((dataItem) => (
            {
                solutionId: dataItem.solutionId,
                planId: dataItem.planId,
                planDate: dataItem.planDate,
                departmentId: dataItem.departmentId,
                shiftId: dataItem.shiftId,
                employeeId: (dataItem.employeeId || dataItem.plannedEmployeeId),
                currencyCode: dataItem.currencyCode,
                totalRate: dataItem.plannedRate,
                fromTime: dataItem.plannedFromTime,
                toTime: dataItem.plannedToTime
            } as RosterPlanOutput
        ));

        let rosterplanInput = new RosterPlanInput();
        rosterplanInput.requestId = this.selectedRequest.requestId;
        rosterplanInput.plans = plans;
        rosterplanInput.basicInput.isApprove = true;

        this.rosterStore.dispatch(new ApproveEmployeeRosterTriggered(rosterplanInput));
        this.approvePlanloading$ = this.rosterStore.pipe(select(rosterManagementModuleReducer.approvePlanloading));
    }

    goToUserProfile(event, selectedUserId) {
        event.stopPropagation();
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }

    resetAllFilters() {
        this.filterData = {};
        this.filteredPlansList = [...this.plansList];
    }

    refreshGridData() {
        this.kendoState.skip = 0;
        this.filterable = false;
        this.searchText = "";
        this.kendoState.filter.filters = [];
        this.getRequestList();
    }

    toggleScheduler(toggleValue) {

    }

    onSchedulerEvents(event) {
        console.log(event);
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
}
