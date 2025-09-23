import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { process, State } from "@progress/kendo-data-query";
import { ProjectGoalsService } from "../../services/goals.service";
import { ToastrService } from "ngx-toastr";
import { ResourceUsageReportModel } from "../../models/resourceusagereportmodel";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { Observable } from "rxjs";
import { Project } from "../../models/project";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { LoadProjectsTriggered } from "../../store/actions/project.actions";
import * as projectModuleReducer from "../../store/reducers/index";
import { select, Store } from "@ngrx/store";
import { tap } from "rxjs/operators";
import { MatOption } from "@angular/material/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as _ from "underscore";
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { GoalModel } from "../../models/GoalModel";
import { EmployeeListModel } from "../../models/employee-model";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../../globaldependencies/models/softlabels-models";

@Component({
    selector: "app-projectreportsfilters",
    templateUrl: "projectreportsfilters.component.html"
})
export class ProjectReportsFiltersComponent {
    @ViewChild("allProjectsSelected") private allProjectsSelected: MatOption;
    @ViewChild("allGoalsSelected") private allGoalsSelected: MatOption;
    @ViewChild("allEmployeeSelected") private allEmployeeSelected: MatOption;

    goalsList: GoalModel[];
    selectedGoals: any;
    selectGoalIds: any;
    selectedUsers: any;
    goalsDataList: GoalModel[];
    reportType: number;
    isDateFilterOpen: boolean = false;

    @Input("type")
    set _type(data) {
        this.reportType = data;
    }
    @Output() getResults = new EventEmitter<any>();

    isAnyOperationIsInprogress: boolean;
    userIds: string;
    validationMessage: any;
    data: any;
    gridData: any
    projectSearchResults$: Observable<Project[]>;
    employeeListDataDetails: EmployeeListModel[];
    employeesList: EmployeeListModel[];
    softLabels: SoftLabelConfigurationModel[];

    primaryDay: string;
    primaryWeek: string;
    primaryMonth: string;
    primaryDateRange: string;
    day: boolean;
    week: boolean;
    month: boolean;
    dateRange: boolean;
    dateToday: Date;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    isNextDisable: boolean;
    isDay: number;
    dayCount: number;
    isPreviousDisable: boolean;
    type: string;
    weekDate: Date = new Date();
    selectedWeek: any;
    days: number[] = [1];
    monthDate: Date = new Date();
    selectedMonth: any;
    date: Date = new Date();
    rangeFrom: boolean;
    dispalyForward: boolean = false;
    weekNumber: number;
    projectsList: Project[];
    selectProjectIds: any;
    selectedProjects: string;
    maxDate = new Date();
    isTrailExpired: boolean = false;
    direction: any;
    minDate = new Date();
    selectFilter: FormGroup;
    minDateOnTrailExpired: Date = null;
    isOpen: boolean = true;

    constructor(private projectGoalsService: ProjectGoalsService, private toaster: ToastrService, private store: Store<State>,
        private cookieService: CookieService,) {

        var response = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
        if (response && (response.trailDays > 0 || response.noOfPurchasedLicences > 0)) {
            this.isTrailExpired = false;
        }
        else {
            this.isTrailExpired = true;
        }
        if (this.isTrailExpired) {
            var today = new Date();
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
            var month;
            var year;
            if (endDate.getDate() > today.getDate()) {
                month = today.getMonth() != 0 ? today.getMonth() - 1 : 11;
                if (month == 11) {
                    year = today.getFullYear() - 1;
                }
                year = today.getFullYear();
            }
            else {
                month = today.getMonth();
                year = today.getFullYear();
            }
            this.minDateOnTrailExpired = new Date(year, month, endDate.getDate());
        }

    }


    ngOnInit() {
        this.formValidate();
        this.loadProjects();
        this.loadGoals();
        this.getEmployeesLists();
        this.setDateFrom(this.fromDate);
        this.setDateTo(this.fromDate);
        this.dayTypeForTimeUsage('day');
    }
    filterClick() {
        this.isOpen = !this.isOpen;
      }

    formValidate() {
        this.selectedUsers= null;
        this.selectedProjects= null;
        this.selectedGoals= null;
        this.selectFilter = new FormGroup({
            projectIds: new FormControl(null,
                Validators.compose([
                ])
            ),
            goalIds: new FormControl(null,
                Validators.compose([
                ])
            ),
            userIds: new FormControl(null,
                Validators.compose([
                ])
            )
        })
    }
    dateFilterOpen(){
        this.isDateFilterOpen=true;
    }
    closeDateFilter(){
        this.isDateFilterOpen=false;
    }
    resetAllFilters(){
        this.formValidate();
        this.setDateFrom(this.fromDate);
        this.setDateTo(this.fromDate);
        this.dayTypeForTimeUsage('day');
    }

    filterStatus() {
        if ((this.fromDate && this.dateRange) || (this.toDate && this.dateRange) || (this.selectedProjects) || (this.selectedGoals) || (this.selectedUsers))
            return true;
        else
            return false;
    }

    loadProjects() {
        const projectSearchResult = new ProjectSearchCriteriaInputModel();
        projectSearchResult.isArchived = false;
        this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll),
            tap((projects) => {
                this.projectsList = projects;
            })
        );
        if (!this.projectsList || this.projectsList.length === 0) {
            this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
        }
    }

    selectProject() {
        this.getGoalsBasedOnProject();
        const projectId = this.selectFilter.value.projectIds;
        const index = projectId.indexOf(0);
        if (index > -1) {
            projectId.splice(index, 1);
        }
        const projectIds = projectId.toString();
        this.bindProjectsList(projectIds);
    }

    bindProjectsList(projectIds) {
        if (projectIds) {
            const projectsList = this.projectsList;
            // tslint:disable-next-line: only-arrow-functions
            const filteredList = _.filter(projectsList, function (project) {
                return projectIds.toString().includes(project.projectId)
            })
            if (filteredList) {
                const selectedProjects = filteredList.map((x) => ' ' + x.projectName);
                this.selectedProjects = selectedProjects.toString();
            }
        } else {
            this.selectedProjects = "";
        }
        this.functionForResults();
    }

    toggleProjectsSelected(all) {
        if (this.allProjectsSelected.selected) {
            this.allProjectsSelected.deselect();
            return false;
        }
        if (
            this.selectFilter.controls['projectIds'].value.length ===
            this.projectsList.length
        ) {
            this.allProjectsSelected.select();
        }
    }

    toggleAllProjectsSelection() {
        if (this.allProjectsSelected.selected) {
            this.selectFilter.controls.projectIds.patchValue([
                ...this.projectsList.map((item) => item.projectId),
                0
            ]);

        } else {
            this.selectFilter.controls.projectIds.patchValue([]);
        }
        this.selectProject();
    }

    loadGoals() {
        let searchGoals = new GoalSearchCriteriaApiInputModel();
        searchGoals.goalStatusId = ConstantVariables.ActiveGoalStatusId;
        this.projectGoalsService.searchGoals(searchGoals).subscribe((response: any) => {
            if (response.success) {
                if (response.data && response.data.length > 0) {
                    this.goalsDataList = response.data;
                    this.goalsList = response.data;
                }
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toaster.error(this.validationMessage);
            }
        });
    }

    getGoalsBasedOnProject() {
        if(this.selectFilter.value.projectIds.length > 0){
            this.goalsList = this.goalsDataList.filter(x => this.selectFilter.value.projectIds.toString().includes(x.projectId));
        }
        else{
            this.goalsList = this.goalsDataList;
        }

        this.selectFilter.controls.goalIds.patchValue(null);
        this.selectedGoals = null;
    }

    selectGoal() {
        const goalId = this.selectFilter.value.goalIds;
        const index = goalId.indexOf(0);
        if (index > -1) {
            goalId.splice(index, 1);
        }
        const goalIds = goalId.toString();
        this.bindgoalsList(goalIds);
    }

    bindgoalsList(goalIds) {
        if (goalIds) {
            const goalsList = this.goalsList;
            // tslint:disable-next-line: only-arrow-functions
            const filteredList = _.filter(goalsList, function (goal) {
                return goalIds.toString().includes(goal.goalId)
            })
            if (filteredList) {
                const selectedgoals = filteredList.map((x) => ' ' + x.goalName);
                this.selectedGoals = selectedgoals.toString();
            }
        } else {
            this.selectedGoals = "";
        }
        this.functionForResults();
    }

    toggleGoalsSelected(all) {
        if (this.allGoalsSelected.selected) {
            this.allGoalsSelected.deselect();
            return false;
        }
        if (
            this.selectFilter.controls['goalIds'].value.length ===
            this.goalsList.length
        ) {
            this.allGoalsSelected.select();
        }
    }

    toggleAllGoalsSelection() {
        if (this.allGoalsSelected.selected) {
            this.selectFilter.controls.goalIds.patchValue([
                ...this.goalsList.map((item) => item.goalId),
                0
            ]);

        } else {
            this.selectFilter.controls.goalIds.patchValue([]);
        }
        this.selectGoal();
    }


    getEmployeesLists() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.sortDirectionAsc = true;
        employeeListSearchResult.isArchived = false;
        employeeListSearchResult.isActive = true;
        this.projectGoalsService.getAllEmployees(employeeListSearchResult).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeListDataDetails = response.data;
                this.employeesList = response.data;
                this.isAnyOperationIsInprogress = false;
            }
            if (response.success == false) {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getSelectedEmployees() {
        const employeeListDataDetailsList = this.employeesList;
        const employmentIds = this.selectFilter.controls['userIds'].value;
        const index = employmentIds.indexOf(0);
        if (index > -1) {
            employmentIds.splice(index, 1);
        }

        const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
            return employmentIds.toString().includes(x.userId);
        })
        const employeeNames = employeeListDataDetails.map((x) => ' ' + x.userName);
        this.selectedUsers = employeeNames.toString();

        this.functionForResults();
    }

    toggleAllEmployeesSelected() {
        if (this.allEmployeeSelected.selected) {
            this.selectFilter.controls['userIds'].patchValue([
                ...this.employeesList.map((item) => item.userId),
                0
            ]);
        } else {
            this.selectFilter.controls['userIds'].patchValue([]);
        }
        this.getSelectedEmployees();
    }

    toggleEmployeePerOne() {
        if (this.allEmployeeSelected.selected) {
            this.allEmployeeSelected.deselect();
            return false;
        }
        if (this.selectFilter.controls['userIds'].value.length === this.employeesList.length) {
            this.allEmployeeSelected.select();
        }
        this.getSelectedEmployees();
    }

    getResourceUsageReport() {
        this.isAnyOperationIsInprogress = true;
        var resourceUsageReportModel = new ResourceUsageReportModel();

        if (this.selectFilter.value.projectIds) {
            resourceUsageReportModel.projectIds = this.selectFilter.value.projectIds.toString();
        }
        if (this.selectFilter.value.goalIds) {
            resourceUsageReportModel.goalIds = this.selectFilter.value.goalIds.toString();
        }
        if (this.selectFilter.value.userIds) {
            resourceUsageReportModel.userIds = this.selectFilter.value.userIds.toString();
        }

        if(resourceUsageReportModel.projectIds == ""){
            resourceUsageReportModel.projectIds = null;
        }
        if(resourceUsageReportModel.goalIds == ""){
            resourceUsageReportModel.goalIds = null;
        }
        if(resourceUsageReportModel.userIds == ""){
            resourceUsageReportModel.userIds = null;
        }
        resourceUsageReportModel.dateFrom = this.dateFrom;
        resourceUsageReportModel.dateTo = this.dateTo;
        this.getResults.emit(resourceUsageReportModel);
    }

    setDateFrom(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setDateTo(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    getWeekNumber(selectedWeek) {
        const currentDate = selectedWeek.getDate();
        const monthStartDay = (new Date(this.weekDate.getFullYear(), this.weekDate.getMonth(), 1)).getDay();
        const weekNumber = (selectedWeek.getDate() + monthStartDay) / 7;
        const week = (selectedWeek.getDate() + monthStartDay) % 7;
        this.selectedWeek = selectedWeek.toISOString();
        if (week !== 0) {
            return Math.ceil(weekNumber);
        } else {
            return weekNumber;
        }
    }


    onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToday = event.target.value;
        this.dateFrom = event.target.value;
        this.dateTo = event.target.value;
        this.setFromDate(this.dateFrom);
        this.setToDate(this.dateTo);
        this.functionForResults();
    }


    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }


    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        this.setFromDate(this.minDate);
        if (this.toDate < this.fromDate) {
            this.toDate = this.fromDate;
        }
        if (this.rangeFrom) {
            this.setDateTo(this.toDate);
        } else {
            this.setToDate(this.toDate);
        }
        this.functionForResults();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.setFromDate(this.minDate);
        this.setToDate(this.toDate);
        this.rangeFrom = false;
        this.functionForResults();
    }

    setFromDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateFrom = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));//this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
        // this.dateFrom = date;
    }

    setToDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        // day += 1;
        // newDate = day + '/' + month + '/' + year;
        // var offSet = date.getTimezoneOffset();
        // this.dateTo = new Date(Date.UTC(year, (month - 1), day, (offSet / 60), (offSet % 60), 0));//this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
        // this.dateTo = date;
    }

    getMonthBasedOnDate(direction) {
        this.direction = direction;
        var monthValue;
        if (direction === 'right') {
            const day = this.monthDate.getDate();
            const month = 0 + (this.monthDate.getMonth() + 1) + 1;
            const year = this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            this.days = Array(num).fill(num).map((x, i) => i);
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        } else {
            const day = this.monthDate.getDate();
            const month = (this.monthDate.getMonth() + 1) - 1;
            const year = 0 + this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            var num = new Date(year, month, 0).getDate();
            this.days = Array(num).fill(num).map((x, i) => i);
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        }
        if (this.dateFrom <= this.maxDate) {
            if ((this.maxDate.getMonth() + 1) == monthValue) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.functionForResults();
        }
        else {
            this.dispalyForward = false;
            this.selectedMonth = this.maxDate.toISOString();
            this.dateFrom = this.maxDate;
        }
    }


    getWeekBasedOnDate(direction) {
        this.direction = direction;
        if (direction === 'right') {
            const day = this.weekDate.getDate() + 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            let first = this.weekDate.getDate() - this.weekDate.getDay();
            let last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        } else {
            const day = this.weekDate.getDate() - 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            let newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.parse(newDate));
            var first = this.weekDate.getDate() - this.weekDate.getDay();
            var last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        }
        if (this.dateFrom <= this.maxDate) {
            if (this.dateTo >= this.maxDate) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.functionForResults();
        } else {
            this.dispalyForward = false;
            this.weekDate = this.parse(this.maxDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            this.dateFrom = this.maxDate;
        }
    }

    dayTypeForTimeUsage(clickType) {
        this.isDay = 0;
        this.dayCount = 7;
        this.isNextDisable = true;
        this.isPreviousDisable = false;
        if (clickType == "day") {
            this.primaryDay = "primary";
            this.primaryWeek = "";
            this.primaryMonth = "";
            this.primaryDateRange = "";
            this.day = true;
            this.week = false;
            this.month = false;
            this.dateRange = false;
            this.days = Array(1).fill(1).map((x, i) => i);
            this.dateToday = new Date();
            this.dateFrom = this.dateToday;
            this.dateTo = this.dateToday;
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        }
        else if (clickType == "week") {
            this.primaryDay = "";
            this.primaryWeek = "primary";
            this.primaryMonth = "";
            this.primaryDateRange = "";
            this.day = false;
            this.week = true;
            this.month = false;
            this.dateRange = false;
            this.type = "Week";
            this.days = Array(7).fill(1).map((x, i) => i);
            this.weekDate = new Date();
            var dateLocal = new Date();
            var first = this.weekDate.getDate() - this.weekDate.getDay();
            var last = first + 6;
            this.dateFrom = new Date(this.weekDate.setDate(first));
            this.dateTo = new Date(dateLocal.setDate(last));
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.weekNumber = this.getWeekNumber(this.weekDate);
        }
        else if (clickType == "month") {
            this.primaryDay = "";
            this.primaryWeek = "";
            this.primaryMonth = "primary";
            this.primaryDateRange = "";
            this.day = false;
            this.week = false;
            this.month = true;
            this.dateRange = false;
            this.type = "Month";
            const month = 0 + (this.date.getMonth() + 1);
            const year = this.date.getFullYear();
            var num = new Date(year, month, 0).getDate();
            this.days = Array(num).fill(num).map((x, i) => i);
            this.monthDate = new Date();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            this.selectedMonth = this.date.toISOString();
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
        }
        else {
            this.primaryDay = "";
            this.primaryWeek = "";
            this.primaryMonth = "";
            this.primaryDateRange = "primary";
            this.day = false;
            this.week = false;
            this.month = false;
            this.dateRange = true;
            this.fromDate = new Date();
            this.toDate = new Date();
            this.dateFrom = this.fromDate;
            this.dateTo = this.fromDate;
            this.setDateFrom(new Date());
            this.setDateTo(new Date());
            this.rangeFrom = true;
        }
        this.dispalyForward = false;
        this.functionForResults();
    }

    timeSheetDetailsForDay(clickType, buttonType) {
        this.dateToday = new Date(this.dateToday);
        if (clickType == "backward") {
            this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() - 7 : this.dateToday.getDate() - 1));
            if (buttonType == "week") {
                this.isDay = 8;
                this.dayCount = 1;
                this.isNextDisable = false;
                this.isPreviousDisable = true;
            }
        }
        else {
            this.dateToday = this.parse(this.dateToday.setDate(buttonType == "week" ? this.dateToday.getDate() + 7 : this.dateToday.getDate() + 1));
            if (buttonType == "week") {
                this.isDay = 0;
                this.dayCount = 7;
                this.isNextDisable = true;
                this.isPreviousDisable = false;
            }
        }
        if (this.dateToday <= this.maxDate) {
            if (this.maxDate.toLocaleDateString() == this.dateToday.toLocaleDateString()) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.dateFrom = this.dateToday;
            this.dateTo = this.dateToday;
            this.functionForResults();
        }
        else {
            this.dispalyForward = false;
            this.dateToday = this.maxDate;
            this.dateFrom = this.dateToday;
            this.dateTo = this.dateToday;
            this.functionForResults();
        }
    }

    previous() {
        if (this.dayCount == 7) {
            this.isNextDisable = false;
        }
        this.isDay = this.isDay + 1;
        this.dayCount = this.dayCount - 1;
        if (this.dayCount == 1) {
            this.isPreviousDisable = true;
        } else {
            this.isPreviousDisable = false;
        }
    }

    next() {
        if (this.dayCount == 1) {
            this.isPreviousDisable = false;
        }
        this.dayCount = this.dayCount + 1;
        this.isDay = this.isDay + 1;
        if (this.dayCount == 7) {
            this.isNextDisable = true;
        } else {
            this.isNextDisable = false;
        }
    }

    resetUsers() {
        this.selectFilter.controls.userIds.patchValue(null);
        this.selectedUsers = null;
        this.functionForResults();
    }

    resetProjects() {
        this.selectFilter.controls.projectIds.patchValue(null);
        this.selectedProjects = null;
        this.functionForResults();
    }

    resetGoals() {
        this.selectFilter.controls.goalIds.patchValue(null);
        this.selectedGoals = null;
        this.functionForResults();
    }

    functionForResults() {
        this.getResourceUsageReport();
    }
}
