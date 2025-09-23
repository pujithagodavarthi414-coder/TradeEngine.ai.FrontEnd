import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, AfterViewInit, SimpleChanges, OnChanges } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { CreateFormGroupArgs, EditMode, SlotClickEvent, EventClickEvent } from "@progress/kendo-angular-scheduler";
import { SchedulerComponent, SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { ConstantVariables } from "../models/constant-variables";
import { CommonService } from "../services/common.service";
import { EmployeeDetailsSearchModel } from "../models/employee-details-search-model";
import { ShiftWeekModel } from "../models/shift-week-model";
import { Guid } from "guid-typescript";
import { of } from "rxjs";
import * as  _ from "underscore";
import { DataType } from "../models/roster-request-plan-model";
import { DepartmentModel } from "../models/department-model";
import { ShiftTimingModel } from "../models/shift-timing-model";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { MultiSelectComponent } from "@progress/kendo-angular-dropdowns";
import { RosterService } from "../services/roster-service";
import { RosterPlan } from "../models/roster-create-plan-model";
import { RosterBasicRequirement } from "../models/roster-basic-model";
import { HolidayModel } from "../models/holiday-model";
import { WeekdayModel } from "../models/weekday-model";
import { LoadEmployeeRateSheetDetailsTriggered } from '../store/actions/roster.action';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as RosterState from "../store/reducers/index";
import * as moment_ from "moment";
import { EmployeeRateTagInput } from '../models/employee-ratetag-Input-model';
const moment = moment_;

@Component({
    selector: "app-hr-component-roster-scheduler",
    templateUrl: "roster-scheduler.component.html"
})

export class RosterSchedulerComponent extends CustomAppBaseComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChildren('editRosterPopover') editRosterPopover;
    @ViewChild('kendoScheduler', { static: true }) kendoScheduler;

    filteredEmployeeList: any;
    employeeListData: any
    formGroup: FormGroup;
    selectedPlan: any[];
    requestDetails: any;
    selectedSolution: any;
    currencyCode: any;
    sortBy: any;
    sortDirection: any;
    page: any = {};
    searchText: string;
    solutionData: any;
    isEditable: any;
    isActual: any;
    otherFilter: any;
    otherFilter2: any;
    departmentList: DepartmentModel[];
    shiftTimeList: ShiftTimingModel[];
    filteredDepartmentList: DepartmentModel[];
    filteredShiftTimeList: ShiftTimingModel[];
    selectedDate: any;
    minDate: Date;
    selectedEmployee: any;
    holidays: HolidayModel[];
    weekdays: WeekdayModel[];
    minTime: string;
    employeeRates: any;
    priorInputData: any;

    private breakMins: number

    public editedEvent: any;
    public editMode: EditMode;
    public isNew: boolean;

    @Input("schedulerData")
    set _schedulerData(data) {
        this.selectedPlan = data;
        // this.loadGridData();
    }

    @Input("selectedSolution")
    set _selectedSolution(data) {
        this.selectedSolution = data;
    }

    @Input("isActual")
    set _isActual(data) {
        this.isActual = data;
        if (this.isActual == DataType.Actual || this.requestDetails.isArchived || !this.canAccess_feature_EditRoster) {
            this.isEditable = false;
        } else {
            this.isEditable = true;
        }
        // this.loadGridData();
    }

    @Input("isEditable")
    set _isEditable(data) {
        this.isEditable = data;
    }

    @Input("requestData")
    set _requestData(data) {
        this.requestDetails = data;
        if (this.requestDetails.includeWeekends == undefined) {
            this.requestDetails.includeWeekends = true;
        }
        if (this.requestDetails.includeHolidays == undefined) {
            this.requestDetails.includeHolidays = true;
        }
        this.selectedDate = data.rostStartDate ? moment(data.rostStartDate).toDate() : moment(data.requiredFromDate).toDate();
        if (this.requestDetails && this.requestDetails.statusName === "Approved" && this.isEditable || this.requestDetails.isArchived) {
            this.isEditable = false;
        }
        // this.loadGridData();
    }

    @Input("employeeListDataDetails")
    set _employeeListDataDetails(data) {
        this.employeeListData = [];
        if (data && data.length > 0) {
            data.forEach((value, index) => {
                let employee: any = Object.assign({}, value);
                employee.fullName = value.firstName + " " + value.surName;
                this.employeeListData.push(employee);
            })
            this.filteredEmployeeList = [...this.employeeListData];
        }
    }
    get _employeeListDataDetails() {
        return this.employeeListData;
    }

    @Input("currencyCode")
    set _currencyCode(data) {
        this.currencyCode = data;
    }

    @Input("departments")
    set _departments(data) {
        this.departmentList = data;
        this.filteredDepartmentList = data;
    }

    @Input("shifts")
    set _shifts(data) {
        this.shiftTimeList = data;
        this.filteredShiftTimeList = data;
    }

    @Input("breakmins")
    set _breakMins(data) {
        if (data) {
            this.breakMins = data;
        } else {
            this.breakMins = 0;
        }
    }

    @Input("dateFormat") dateFormat: any;
    @Input("priorInputData")
    set _priorInputData(data) {
        this.priorInputData = data;
        if (data && data.startDate) {
            this.selectedDate = data.startDate.toDate();
        }
    }

    @ViewChild("employeeList") employeeList: MultiSelectComponent;
    @ViewChild("kendoScheduler", { static: true }) scheduler: any

    @Output() updateBudgetLabels = new EventEmitter<any[]>();

    constructor(private commonService: CommonService, private rosterStore: Store<RosterState.State>,
        private toastr: ToastrService, private translateService: TranslateService,
        private rosterService: RosterService) {
        super();
        this.selectedEmployee = [];
        this.isEditable = true;
        this.createFormGroup = this.createFormGroup.bind(this);
        this.selectedSolution = {};
        this.selectedSolution.solutionId = Guid.create().toString();
        this.selectedPlan = [];
        this.requestDetails = {};
        this.requestDetails.requestId = Guid.create().toString();
        this.requestDetails.includeWeekends = false;
        this.requestDetails.includeHolidays = false;
    }

    ngOnInit() {
        super.ngOnInit();
        this.page.size = 100;
        this.getAllHolidays();
        this.getAllWeekDays();
        // this.loadGridData();
        this.getEmployeeRateSheetList(null);
    }

    ngAfterViewInit() {
        if (this.priorInputData) {
            const planstartdate = this.commonService.convertUtcToLocal(this.priorInputData.startDate);
            this.selectedDate = planstartdate.toDate();
        } else {
            if (this.selectedPlan && this.selectedPlan.length > 0) {
                const planstartdate = this.commonService.convertUtcToLocal(this.setTime(this.selectedPlan[0], true));
                if (new Date(this.selectedPlan[0].planDate) < planstartdate.toDate()) {
                    planstartdate.add(-1, "days");
                }
                this.selectedDate = planstartdate.toDate();
                this.kendoScheduler.scrollToTime(planstartdate.format("HH:mm"));
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.loadGridData()
    }

    loadGridData() {
        if (this.selectedPlan && this.selectedPlan.length > 0) {
            if (this.requestDetails) {
                let groupvalues = this.groupBy(this.selectedPlan, function (item) {
                    return [item.planDate, (item.fromTime || item.plannedFromTime || item.actualFromTime), (item.toTime || item.plannedToTime || item.actualFromTime)];
                });

                this.solutionData = _.map(groupvalues, (dataItem) => {
                    let startTime = this.commonService.convertUtcToLocal(this.setTime(dataItem[0], true));
                    let endTime = this.commonService.convertUtcToLocal(this.setTime(dataItem[0], false));
                    if (startTime.hour() >= 12 && endTime.hour() <= 12 && endTime < startTime) {
                        endTime.add(1, "days");
                    } else if (endTime < startTime) {
                        if (new Date(dataItem[0].planDate) < startTime.toDate()) {
                            startTime.add(-1, "days");
                        } else {
                            endTime.add(1, "days");
                        }
                    }
                    return {
                        id: Guid.create().toString(),
                        dataItem: Object.keys(dataItem).map((dtIndex) => {
                            const item = dataItem[dtIndex];
                            return item;
                        }),
                        start: startTime.toDate(),
                        startTimezone: null,
                        end: endTime.toDate(),
                        endTimezone: null
                    } as SchedulerEvent
                });
                setTimeout(() => {
                    this.solutionData = [...this.solutionData];
                    // let planstartdate = this.commonService.convertUtcToLocal(this.setTime(this.selectedPlan[0], true));
                    // if (this.minTime != planstartdate.format("HH:mm")) {
                    //     this.kendoScheduler.scrollToTime(planstartdate.toDate());
                    //     this.minTime = planstartdate.format("HH:mm");
                    // }
                }, 100);
            }
        } else {
            const event = (): SchedulerEvent => ({
                title: "",
                start: null,
                end: null
            });
            this.solutionData = [];
            this.selectedPlan = [];
            // this.defaultTime = "09:00";
            this.kendoScheduler.scrollToTime("09:00");
        }
    }

    groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return groups;
    }

    getEmployeeRateSheetList(employeeId: string) {
        const rateSheetDetailsSearchResult = new EmployeeDetailsSearchModel();
        rateSheetDetailsSearchResult.sortBy = this.sortBy;
        rateSheetDetailsSearchResult.sortDirectionAsc = this.sortDirection;
        rateSheetDetailsSearchResult.pageNumber = this.page.pageNumber + 1;
        rateSheetDetailsSearchResult.pageSize = this.page.size;
        rateSheetDetailsSearchResult.searchText = this.searchText;
        rateSheetDetailsSearchResult.employeeId = employeeId;
        rateSheetDetailsSearchResult.isArchived = false;
        rateSheetDetailsSearchResult.employeeDetailType = "RateSheetDetails";
        this.rosterStore.dispatch(new LoadEmployeeRateSheetDetailsTriggered(rateSheetDetailsSearchResult));
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

    public createFormGroup(args: CreateFormGroupArgs): FormGroup {

        const dataItem = args.dataItem;
        this.filteredEmployeeList = this._employeeListDataDetails;
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
            this.selectedEmployee = [];
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
                employeeId: new FormControl(dataItem.dataItem.map((x) => (x.employeeId || x.actualEmployeeId || x.plannedEmployeeId))),
                departmentId: new FormControl(dataItem.dataItem.departmentId),
                shiftId: new FormControl(dataItem.dataItem.shiftId)
            });
            this.selectedEmployee = dataItem.dataItem.map((x) => (x.employeeId || x.actualEmployeeId || x.plannedEmployeeId));
            return this.formGroup;
        }
    }

    public dragEndHandler({ sender, event, start, end, isAllDay }): void {
        const value = { Start: start, End: end, IsAllDay: isAllDay };
        let startDate = (this.priorInputData && this.priorInputData.startDate.toDate().toDateString()) || this.requestDetails.requiredFromDate;
        let endDate = (this.priorInputData && this.priorInputData.endDate.toDate().toDateString()) || this.requestDetails.requiredToDate;

        if (new Date(startDate) > new Date(start.toDateString()) ||
            new Date(endDate) < new Date(start.toDateString())
        ) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterBetweenStartDateAndEndDate));
            return;
        }
        const dataItem = event.dataItem;
        let updatedPlans = [];
        let employeeIds = dataItem.dataItem.map(x => x.employeeId);
        this.latestBudget(start, end, employeeIds, (rates) => {
            dataItem.dataItem.forEach((plan, index) => {
                let rosterPlan = this.editPlan(value.Start, value.End, plan, rates);
                updatedPlans.push(rosterPlan);
            })
            this.selectedDate = new Date(value.Start);
            this.kendoScheduler.scrollToTime(moment(value.Start).format("HH:mm"));
            dataItem.dataItem = updatedPlans;
            // this.loadGridData();
            this.updateBudgetLabels.emit(this.selectedPlan);
        });

    }

    public resizeEndHandler({ sender, event, start, end }): void {
        const value = { Start: start, End: end };
        const dataItem = event.dataItem;
        let updatedPlans = [];
        let difference = moment.duration(moment(value.End).diff(moment(value.Start))).asHours();
        if (difference > 12) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterRecurringSchedule));
            return;
        } else {
            if (value.Start.getHours() >= 12 && value.End.getHours() <= 12) {
                var date = new Date(value.End);
                var newdate = new Date(date);
                value.End = new Date(newdate.setDate(newdate.getDate() + 1));
            }
            let employeeIds = dataItem.dataItem.map(x => x.employeeId);
            this.latestBudget(start, end, employeeIds, (rates) => {
                dataItem.dataItem.forEach((plan, index) => {
                    let rosterPlan = this.editPlan(value.Start, value.End, plan, rates);
                    updatedPlans.push(rosterPlan);
                })
                dataItem.dataItem = updatedPlans;
                // this.loadGridData();
                this.updateBudgetLabels.emit(this.selectedPlan);
            });
        }
    }

    public slotDblClickHandler({ start, end, isAllDay }: SlotClickEvent): void {
        if (this.isEditable) {
            this.isNew = true;
            this.editMode = EditMode.Series;
            let holidaydates = this.holidays.map((x) => new Date(x.date).toLocaleDateString());
            if (holidaydates.includes(new Date(start).toLocaleDateString())) {
                this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterSelectedHoliday));
            }
            if (this.weekdays.find((x) => x.isWeekend && x.weekDayId == moment(start).day())) {
                this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterSelectedWeekEnd));
            }

            let startDate = (this.priorInputData && this.priorInputData.startDate.toDate().toDateString()) || this.requestDetails.requiredFromDate;
            let endDate = (this.priorInputData && this.priorInputData.endDate.toDate().toDateString()) || this.requestDetails.requiredToDate;

            if (new Date(new Date(startDate).toDateString()) > new Date(start.toDateString()) ||
                new Date(new Date(endDate).toDateString()) < new Date(start.toDateString())
            ) {
                this.toastr.error("", this.translateService.instant(ConstantVariables.RosterBetweenStartDateAndEndDate));
                return;
            }
            if (this.scheduler.viewIndex == 2) {
                let timeObject = end;
                let seconds = -1
                end = new Date(timeObject.getTime() + seconds);
            }
            this.editedEvent = {
                Start: start,
                End: end,
                IsAllDay: isAllDay
            };
            this.selectedEmployee = [];
            this.editRosterPopover["_results"][0].openPopover()
        }
    }

    public eventDblClickHandler({ sender, event }: EventClickEvent): void {
        if (this.isEditable) {
            this.isNew = false;
            let dataItem = event.dataItem;
            this.editMode = EditMode.Series;
            this.editedEvent = dataItem;
            this.selectedEmployee = dataItem.dataItem.map((x) => (x.employeeId || x.actualEmployeeId || x.plannedEmployeeId));
            this.editRosterPopover["_results"][0].openPopover();
        }
    }

    public editPlan(start, end, plan, rates) {
        let planUpdate = this.selectedPlan.find((x) => x.planId == plan.planId);
        let rosterPlan: any = {};
        if (planUpdate) {
            var changedDuration = moment.duration(moment(end).diff(moment(start)));
            var plannedDuration = moment.duration(moment((planUpdate.toTime || planUpdate.plannedToTime), "HH:mm:ss").diff(moment((planUpdate.fromTime || planUpdate.plannedFromTime), "HH:mm:ss")));
            var changedMinutes = changedDuration.asMinutes();
            changedMinutes = (changedMinutes - this.breakMins) < 0 ? 0 : changedMinutes - this.breakMins;

            var plannedMinutes = plannedDuration.asMinutes();
            let budgetperminute = (planUpdate.totalRate || planUpdate.plannedRate) / plannedMinutes;

            this.selectedPlan = this.selectedPlan.filter((x) => x.planId != plan.planId);
            let rate = 0;
            let employeeRate = rates.find(x => x.employeeId == (planUpdate.employeeId || planUpdate.actualEmployeeId || planUpdate.plannedEmployeeId));
            if (employeeRate) {
                rate = employeeRate.rate;
            }
            rosterPlan.planId = planUpdate.planId;
            rosterPlan.solutionId = planUpdate.solutionId;
            rosterPlan.requestId = planUpdate.requestId;
            rosterPlan.currencyCode = planUpdate.currencyCode;
            rosterPlan.departmentId = planUpdate.departmentId;
            rosterPlan.departmentName = planUpdate.departmentName;
            rosterPlan.employeeId = planUpdate.employeeId;
            rosterPlan.planDate = this.commonService.convertToDate(start);
            rosterPlan.fromTime = this.commonService.covertTimeIntoUtcTime(start).format("HH:mm");
            rosterPlan.toTime = this.commonService.covertTimeIntoUtcTime(end).format("HH:mm");
            rosterPlan.shiftId = planUpdate.shiftId;
            rosterPlan.shiftName = planUpdate.shiftName;
            rosterPlan.totalRate = this.roundtoTwo(rate);
            rosterPlan.employeeName = planUpdate.employeeName;
            rosterPlan.employeeProfileImage = planUpdate.employeeProfileImage;

            if (this.isActual == DataType.Actual) {
                rosterPlan.actualEmployeeId = planUpdate.actualEmployeeId;
                rosterPlan.actualFromTime = this.commonService.covertTimeIntoUtcTime(start).format("HH:mm");
                rosterPlan.actualToTime = this.commonService.covertTimeIntoUtcTime(end).format("HH:mm");
                rosterPlan.actualRate = this.roundtoTwo(rate);
                rosterPlan.actualEmployeeName = planUpdate.actualEmployeeName;
                rosterPlan.actualEmployeeProfileImage = planUpdate.actualEmployeeProfileImage;
            } else {
                rosterPlan.plannedEmployeeId = planUpdate.plannedEmployeeId;
                rosterPlan.plannedFromTime = this.commonService.covertTimeIntoUtcTime(start).format("HH:mm");
                rosterPlan.plannedToTime = this.commonService.covertTimeIntoUtcTime(end).format("HH:mm");
                rosterPlan.plannedRate = this.roundtoTwo(rate);
                rosterPlan.plannedEmployeeName = planUpdate.plannedEmployeeName;
                rosterPlan.plannedEmployeeProfileImage = planUpdate.plannedEmployeeProfileImage;
            }
            this.selectedPlan.push(rosterPlan);

        }
        return rosterPlan;
    }

    public saveHandler(formValue: any): void {
        // if (formGroup.valid) {
        // const formValue = formGroup.value;
        let planId;
        let difference = moment.duration(moment(formValue.end).diff(moment(formValue.start))).asHours();
        if (difference > 24) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterRecurringSchedule));
            return;
        } else {
            let formPlans = [];
            if (formValue.dataItem) {
                formPlans = formValue.dataItem.map((item) => item.planId);
            }
            const plans = this.selectedPlan.filter((x) => new Date(x.planDate).getDate() === formValue.start.getDate() &&
                formValue.employeeId.includes(x.employeeId || x.plannedEmployeeId || x.actualEmployeeId) &&
                !formPlans.includes(x.planId));
            if (plans && plans.length > 0) {
                this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeRepeat));
                return;
            }
            let error = false;
            const employeeId = formValue.employeeId.find((x) => !this.selectedEmployee.includes(x));
            if (employeeId) {
                const rosterPlan = new RosterPlan();

                let basicdetails = new RosterBasicRequirement();
                basicdetails.rostEmployeeId = employeeId;
                basicdetails.rostStartDate = formValue.start;
                basicdetails.rostEndDate = formValue.end;
                rosterPlan.rosterBasicDetails = basicdetails;
                rosterPlan.requestId = this.requestDetails.requestId;
                this.rosterService.checkRosterName(rosterPlan)
                    .do((response) => {
                        if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
                            error = true;
                            this.toastr.error("", response.apiResponseMessages[0].message);
                        } else {
                            error = false;
                        }
                    })
                    .switchMap((response) => {
                        if (!error) {
                            this.savePlan(formValue);
                        }
                        return of(error);
                    })
                    .subscribe();
            } else {
                this.selectedEmployee = this.selectedEmployee.filter((x) => formValue.employeeId.includes(x));
                this.savePlan(formValue);
            }
        }
    }

    public savePlan(formValue) {
        this.latestBudget(formValue.start, formValue.end, formValue.employeeId, (rates) => {
            if (this.isNew) {
                if (formValue.employeeId) {
                    let selectedSubPlans: any = [];
                    let startTime = formValue.start;
                    let endTime = formValue.end;
                    if (formValue.start.getHours() >= 12 && formValue.end.getHours() <= 12) {
                        const date = new Date(formValue.end);
                        const newdate = new Date(date);
                        endTime = new Date(newdate.setDate(newdate.getDate() + 1));
                    }
                    let changedMinutes = moment.duration(moment(endTime).diff(startTime)).asMinutes();
                    changedMinutes = (changedMinutes - this.breakMins) < 0 ? 0 : changedMinutes - this.breakMins;
                    let rate = 0;
                    formValue.employeeId.forEach((value, index) => {
                        let employeeRate = rates.find(x => x.employeeId == value);
                        if (employeeRate) {
                            rate = employeeRate.rate;
                        }
                        let employee = this._employeeListDataDetails.find((x) => x.employeeId == value);
                        let newplan = this.addorUpdatePlans(null, employee, formValue, true);
                        newplan.totalRate = this.roundtoTwo(rate);
                        if (this.isActual == DataType.Actual) {
                            newplan.actualRate = this.roundtoTwo(rate);
                        } else {
                            newplan.plannedRate = this.roundtoTwo(rate);
                        }
                        selectedSubPlans.push(newplan);
                        this.selectedPlan = this.selectedPlan.concat(newplan);
                    });
                    this.editedEvent = undefined;
                    // dataItem = formValue;
                    // dataItem.dataItem = selectedSubPlans;
                }
            } else {
                let newSubPlans: any = [];
                formValue.employeeId.forEach((value, index) => {

                    const existingEmployee = formValue.dataItem.find((x) => (x.employeeId || x.plannedEmployeeId) == value);
                    const employee = this._employeeListDataDetails.find((x) => x.employeeId == value);

                    let startTime = formValue.start;
                    let endTime = formValue.end;
                    if (formValue.start.getHours() >= 12 && formValue.end.getHours() <= 12) {
                        const date = new Date(formValue.end);
                        const newdate = new Date(date);
                        endTime = new Date(newdate.setDate(newdate.getDate() + 1));
                    }
                    let changedMinutes = moment.duration(moment(endTime).diff(startTime)).asMinutes();
                    changedMinutes = (changedMinutes - this.breakMins) < 0 ? 0 : changedMinutes - this.breakMins;
                    let rate = 0;
                    let employeeRate = rates.find(x => x.employeeId == value);
                    if (employeeRate) {
                        rate = employeeRate.rate;
                    }
                    if (existingEmployee) {
                        const planUpdate = this.selectedPlan.find((x) => x.planId == existingEmployee.planId);
                        this.selectedPlan = this.selectedPlan.filter((x) => x.planId != existingEmployee.planId);
                        let plannedMinutes = moment.duration(moment(planUpdate.toTime, "HH:mm:ss")
                            .diff(moment(planUpdate.fromTime, "HH:mm:ss"))).asMinutes();
                        let budgetperminute = planUpdate.totalRate / plannedMinutes;


                        if (!rate) {
                            rate = budgetperminute * 60;
                        }

                        let rosterPlan = this.addorUpdatePlans(planUpdate, employee, formValue, false);
                        rosterPlan.totalRate = this.roundtoTwo(rate);
                        if (this.isActual == DataType.Actual) {
                            rosterPlan.actualRate = this.roundtoTwo(rate);
                        } else {
                            rosterPlan.plannedRate = this.roundtoTwo(rate);
                        }
                        newSubPlans.push(rosterPlan);
                        this.selectedPlan.push(rosterPlan);
                    } else {
                        let newplan = this.addorUpdatePlans(null, employee, formValue, true);
                        newplan.totalRate = this.roundtoTwo(rate);
                        if (this.isActual == DataType.Actual) {
                            newplan.actualRate = this.roundtoTwo(rate);
                        } else {
                            newplan.plannedRate = this.roundtoTwo(rate);
                        }
                        newSubPlans.push(newplan);
                        this.selectedPlan.push(newplan);
                    }
                    this.editedEvent = undefined;
                });
                if (formValue.dataItem) {
                    formValue.dataItem.forEach((value, index) => {
                        let employee = formValue.employeeId.find((x) => x == (value.employeeId || value.plannedEmployeeId));
                        if (!employee) {
                            this.selectedPlan = this.selectedPlan.filter((x) => x.planId != value.planId);
                        }
                    });
                    formValue.dataItem = newSubPlans;
                }
            }
            this.selectedDate = formValue.start;
            this.loadGridData();
            this.updateBudgetLabels.emit(this.selectedPlan);
            this.cancelHandler(null);
        });
    }

    public addorUpdatePlans(planUpdate: any, employee: any, formValue: any, isNew: boolean) {
        let rosterPlan: any = {};
        rosterPlan.currencyCode = isNew ? this.currencyCode : planUpdate.currencyCode;
        rosterPlan.departmentId = isNew ? (employee.departmentId ? employee.departmentId : formValue.departmentId) : planUpdate.departmentId;
        rosterPlan.departmentName = rosterPlan.departmentId ? this.departmentList.find((x) => x.departmentId == rosterPlan.departmentId).departmentName : "";
        rosterPlan.employeeId = employee.employeeId;
        rosterPlan.employeeName = employee.firstName + " " + employee.surName;
        rosterPlan.planDate = this.commonService.convertToDate(formValue.start);
        rosterPlan.planId = isNew ? Guid.create().toString() : planUpdate.planId;
        rosterPlan.shiftId = isNew ? (employee.shiftTimingId ? employee.shiftTimingId : formValue.shiftId) : planUpdate.shiftId;
        rosterPlan.solutionId = isNew || !this.selectedSolution ? Guid.create().toString() : this.selectedSolution.solutionId;
        rosterPlan.employeeProfileImage = employee.employeeProfileImage;
        rosterPlan.shiftName = isNew ? "" : planUpdate.shiftName;
        rosterPlan.fromTime = this.commonService.covertTimeIntoUtcTime(formValue.start).format("HH:mm");
        rosterPlan.toTime = this.commonService.covertTimeIntoUtcTime(formValue.end).format("HH:mm");

        if (this.isActual == DataType.Actual) {
            rosterPlan.actualFromTime = this.commonService.covertTimeIntoUtcTime(formValue.start).format("HH:mm");
            rosterPlan.actualToTime = this.commonService.covertTimeIntoUtcTime(formValue.end).format("HH:mm");
        } else {
            rosterPlan.plannedFromTime = this.commonService.covertTimeIntoUtcTime(formValue.start).format("HH:mm");
            rosterPlan.plannedToTime = this.commonService.covertTimeIntoUtcTime(formValue.end).format("HH:mm");
        }

        return rosterPlan;
    }

    public removeHandler(event: any): void {
        event.isDefaultPrevented();
        event.preventDefault();
        event.sender.confirmationDialogContainerRef.remove();
        event.sender.openRemoveConfirmationDialog().subscribe((shouldRemove) => {
            if (shouldRemove) {
                this.selectedPlan = this.selectedPlan.filter((item) => item.planId !== event.dataItem.dataItem.planId);
                event.dataItem.dataItem.forEach((value, index) => {
                    this.selectedPlan = this.selectedPlan.filter((x) => x.planId != value.planId);
                });
                this.loadGridData();
                this.updateBudgetLabels.emit(this.selectedPlan);
                this.closeEditor(event.sender);
            } else {
                this.closeEditor(event.sender);
            }
        });
    }

    public cancelHandler(event: any): void {
        this.editRosterPopover.forEach((p) => p.closePopover());
        if (event && event.sender) {
            this.closeEditor(event.sender);
        }
    }

    private closeEditor(scheduler: SchedulerComponent): void {
        scheduler.closeEvent();
        this.formGroup = undefined;
    }

    public departmentChange(department: any, formGroup): void {
        const { shiftId } = formGroup.value;
        this.filteredEmployeeList = Object.assign([], this._employeeListDataDetails.sort((n1: any, n2: any) => n2.userName - n1.userName));
        if (department) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (!x.departmentId || x.departmentId == department.departmentId)).sort((n1: any, n2: any) => n2.userName - n1.userName);
        }
        if (shiftId) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (!x.shiftTimingId || x.shiftTimingId == shiftId)).sort((n1: any, n2: any) => n2.userName - n1.userName);
        }
    }

    public shiftChange(shift: any, formGroup): void {
        this.filteredEmployeeList = Object.assign([], this._employeeListDataDetails.sort((n1: any, n2: any) => n2.userName - n1.userName));
        const { departmentId } = formGroup.value;
        if (departmentId) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (!x.departmentId || x.departmentId == departmentId));
        }
        if (shift) {
            this.filteredEmployeeList = this.filteredEmployeeList.filter((x) => (x.shiftTimingId == shift.shiftTimingId));
            this.getAllShiftWeek(shift, formGroup);
        }
    }

    public employeeChange(employee: any, formGroup) {
        const { start, end } = formGroup.value;
        let plans = this.selectedPlan.filter((x) => x.planDate.getDate() === start.getDate() && employee.includes(x.employeeId || x.plannedEmployeeId || x.actualEmployeeId))
        if (plans && plans.length > 0) {
            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEmployeeRepeat));
            return false;
        }
        // let error = false;
        // let employeeId = employee.find(x => !this.selectedEmployee.includes(x));
        // if (employeeId) {
        //     const rosterPlan = new RosterPlan();
        //     let basicdetails = new RosterBasicRequirement();
        //     basicdetails.rostEmployeeId = employeeId;
        //     basicdetails.rostStartDate = start;
        //     basicdetails.rostEndDate = end;
        //     rosterPlan.rosterBasicDetails = basicdetails;
        //     let rosterName$ = this.rosterService.checkRosterName(rosterPlan);
        //     rosterName$
        //         .do(response => {
        //             if (response && response.apiResponseMessages && response.apiResponseMessages.length > 0) {
        //                 error = true;
        //                 this.toastr.error("", response.apiResponseMessages[0].message);
        //             } else {
        //                 this.selectedEmployee.push(employeeId);
        //                 error = false;
        //             }
        //         })
        //         .switchMap((response) => {
        //             return of(error);
        //         })
        //         .subscribe();
        // } else {
        //     this.selectedEmployee = this.selectedEmployee.filter(x => !employee.includes(x));
        // }
    }

    latestBudget(start: any, end: any, employeeId: any, callback: any) {
        let employeeRateTagInput = new EmployeeRateTagInput();
        employeeRateTagInput.createdDate = start;
        employeeRateTagInput.startTime = this.commonService.covertTimeIntoUtcTime(start).format("HH:mm");
        employeeRateTagInput.endTime = this.commonService.covertTimeIntoUtcTime(end).format("HH:mm");
        employeeRateTagInput.employeeIds = employeeId;

        this.rosterService.getEmployeeRates(employeeRateTagInput)
            .do((response: any) => { })
            .switchMap((response) => {
                if (response && response.data && response.data.length > 0) {
                    this.employeeRates = response.data;
                    callback(this.employeeRates);
                }
                return of(response);
            })
            .subscribe();
    }

    getAllShiftWeek(shift, formGroup) {
        let selectedWeektiming = new ShiftWeekModel();
        selectedWeektiming.shiftTimingId = shift.shiftTimingId;
        this.rosterService.getShiftWeek(selectedWeektiming).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    const shiftWeek = response.data;
                    const shift = shiftWeek.find((x) => x.dayOfWeek.toLowerCase() == moment(formGroup.value.start).format("dddd").toLowerCase());
                    if (shift) {
                        const startDate = moment(formGroup.value.start).format('YYYY-MM-DD');
                        let starttime;
                        if (shift.startTime) {
                            starttime = this.commonService.convertUtcToLocal(shift.startTime).format("HH:mm");
                        } else {
                            starttime = ConstantVariables.DefaultStartTime;
                        }

                        let endtime;
                        if (shift.endTime) {
                            endtime = this.commonService.convertUtcToLocal(shift.endTime).format("HH:mm");
                        } else {
                            this.toastr.error("", this.translateService.instant(ConstantVariables.RosterEndTimeShouldBeValid));
                            endtime = ConstantVariables.DefaultStartTime;
                        }
                        formGroup.controls["start"].setValue(moment(startDate + " " + starttime).toDate());
                        if (moment.duration(moment(endtime).diff(moment(starttime))).asHours() < 0) {
                            formGroup.controls["end"].setValue(moment(startDate + " " + endtime).add(1, "days").toDate());
                        } else {
                            formGroup.controls["end"].setValue(moment(startDate + " " + endtime).toDate());
                        }
                    } else {
                        this.toastr.warning("", this.translateService.instant(ConstantVariables.RosterNoShiftllocated));
                    }
                }
            }
        });
    }

    setTime(dataItem: any, isStart) {
        const date = moment(dataItem.planDate).format("DD-MM-YYYY");
        let endTime;
        if (!this.requestDetails || !this.requestDetails.requestId) {
            if (isStart) {
                if (dataItem.fromTime) {
                    endTime = dataItem.fromTime;
                } else {
                    endTime = "00:00:00";
                }
            } else {
                if (dataItem.toTime) {
                    endTime = dataItem.toTime;
                } else {
                    endTime = "23:59:59";
                }
            }
        } else {
            if ((this.requestDetails && this.requestDetails.requestId) && this.isActual == DataType.Actual) {
                if (isStart) {
                    if (dataItem.actualFromTime) {
                        endTime = dataItem.actualFromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.actualToTime) {
                        endTime = dataItem.actualToTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            } else if ((this.requestDetails && this.requestDetails.requestId) && this.isActual == DataType.Planned) {
                if (isStart) {
                    if (dataItem.plannedFromTime || dataItem.fromTime) {
                        endTime = dataItem.plannedFromTime || dataItem.fromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.plannedToTime || dataItem.toTime) {
                        endTime = dataItem.plannedToTime || dataItem.toTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            } else {
                if (isStart) {
                    if (dataItem.fromTime) {
                        endTime = dataItem.fromTime;
                    } else {
                        endTime = "00:00:00";
                    }
                } else {
                    if (dataItem.toTime) {
                        endTime = dataItem.toTime;
                    } else {
                        endTime = "23:59:59";
                    }
                }
            }
        }

        return moment(date + " " + endTime, "DD-MM-YYYY HH:mm");
    }

    loadRate(empDetails) {
        if (this.requestDetails && this.requestDetails.requestId) {
            if (this.isActual == DataType.Actual) {
                return empDetails.actualRate;
            } else if (this.isActual == DataType.Planned) {
                return empDetails.plannedRate || empDetails.totalRate;
            } else {
                return empDetails.totalRate;
            }
        } else {
            return empDetails.totalRate;
        }
    }

    loadWorkHours(empDetails) {
        const startTime = this.commonService.convertUtcToLocal(this.setTime(empDetails, true));
        const endTime = this.commonService.convertUtcToLocal(this.setTime(empDetails, false));
        if (startTime.hour() >= 12 && endTime.hour() <= 12 && endTime < startTime) {
            endTime.add(1, "days");
        } else if (endTime < startTime) {
            if (empDetails.planDate < startTime) {
                startTime.add(-1, "days");
            } else {
                endTime.add(1, "days");
            }
        }
        return moment.duration(endTime.diff(startTime)).asHours();
    }

    getEmployeeImage(employeeId) {
        const employee = this.employeeListData.find((x) => x.employeeId == employeeId);
        if (employee) {
            return employee.profileImage;
        } else { return undefined; }
    }

    navigate(event) {
        if (event.action && event.action.type == "view-change") {
            if (event.action.view.name == "agenda" || !this.canAccess_feature_EditRoster) {
                this.isEditable = false;
            } else {
                if (!(this.requestDetails && this.requestDetails.statusName === "Approved")) {
                    this.isEditable = true;
                }
            }
        }
    }

    handleShiftFilter(value) {
        this.filteredShiftTimeList = this.shiftTimeList.filter((s) => s.shift.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    handleDepartmentFilter(value) {
        this.filteredDepartmentList = this.departmentList.filter((s) => s.departmentName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    onOpen(event) {
        if (this.employeeList) {
            this.employeeList.filterChange.asObservable().subscribe((x) => {
                this.filteredEmployeeList = this.employeeListData.filter((employee) => employee.userName.toLowerCase().includes(x));
            });
        }
    }

    roundtoTwo(roundingValue) {
        return Math.round((roundingValue + Number.EPSILON) * 100) / 100;
    }
}
