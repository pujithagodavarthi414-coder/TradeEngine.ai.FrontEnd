import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as commonModuleReducers from "../store/reducers/index";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { State } from "../store/reducers/authentication.reducers";
import { EmployeeIndexData } from '../models/employeeIndexData';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardModel } from '../models/productivityDashboardModel';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DrillDownUserStoryPopupComponent } from "../containers/drilldown-userstoryPopup.page";
import * as workspaceModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { WorkspaceList } from '../models/workspace-list.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { State as KendoState } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Persistance } from '../models/persistance.model';
import { DashboardService } from '../services/dashboard.service';
import { ILoadedEventArgs, ChartComponent, ChartTheme, IPointRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import * as $_ from 'jquery';
import { event } from "d3";
const $ = $_;
const moment = moment_;

@Component({
        selector: "app-dashboard-component-employeeIndex",
        templateUrl: "./employee-index.component.html"
})

export class EmployeeIndexComponent extends CustomAppBaseComponent implements OnInit {
        @ViewChild("drillDownUserStoryPopupComponent", { static: true }) drillDownUserStoryPopupComponent: TemplateRef<any>;
        @ViewChild("excelExport1", { static: true }) public excelExport1: any;
        @ViewChild('detailedView', { static: true }) detailedView: TemplateRef<any>;

        @Input("dashboardId")
        set _dashboardId(data: string) {
                if (data != null && data !== undefined && data !== this.persistanceId) {
                        this.persistanceId = data;
                }
        }

        @Input("dashboardFilters")
        set _dashboardFilters(data: DashboardFilterModel) {
                if (data && data !== undefined) {
                        this.dashboardFilters = data;
                        this.projectId = this.dashboardFilters.projectId;
                        if (this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo) {
                                this.dateFrom = new Date(this.dashboardFilters.dateFrom);
                                this.dateTo = new Date(this.dashboardFilters.dateTo);
                                this.dateFilterType('daterange');
                        } else {
                                this.dateFrom = this.dashboardFilters.date ? new Date(this.dashboardFilters.date) : null;
                                this.dateTo = this.dashboardFilters.date ? new Date(this.dashboardFilters.date) : null;
                                this.dateFilterType('daterange');
                        }
                }
        }

        fromCustomApp: boolean = false;
        Ids: string;

        @Input("Ids")
        set _Ids(Ids) {
                this.fromCustomApp = true;
                this.Ids = Ids;
        }

        @Output() closePopUp = new EventEmitter<any>();

        columns = [];

        dashboardFilters: DashboardFilterModel;

        date: Date = new Date();
        selectedDate: string = this.date.toISOString();

        @ViewChild('roundcol')
        public chart: ChartComponent;
        public execute: boolean = false;
        public count: number = 0;
        public primaryXAxis: Object = {
                valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, labelRotation: '-75',
                labelPosition: 'Outside', labelStyle: { color: '#000000' }
        };
        public primaryYAxis: Object = {
                minimum: 0, maximum: 150, interval: 50, majorGridLines: { width: 0.5 },
                majorTickLines: { width: 1 }, lineStyle: { width: 0.5 }, labelStyle: { color: '#000000' }
        };
        public radius: Object = { bottomLeft: 0, bottomRight: 0, topLeft: 10, topRight: 10 }
        public title: string;
        public tooltip: Object = {
                enable: true
        };
        public legend: Object = {
                visible: true
        }
        public chartArea: Object = {
                border: {
                        width: 0
                }
        };
        public width: string = '100%';
        isDetailedView: boolean = false;
        weekDate: Date = new Date();
        monthDate: Date = new Date();
        dateFrom: Date = new Date();
        fromDate: Date = new Date();
        toDate: Date = new Date();
        dateTo: Date = new Date();
        dateToday: Date = new Date();
        rangeDate: Date = new Date();
        selectedWeek: string = this.date.toISOString();
        selectedMonth: string = this.date.toISOString();
        dateFromSelected: Date;
        dateToSelected: Date;
        maxDate = new Date();
        minDate = new Date();
        weekNumber: number;
        days: number[] = [1];
        direction: any;
        type: string = ConstantVariables.Month;
        primaryWeek: string;
        primaryMonth: string = "primary";
        primaryDateRange: string;
        day: boolean = true;
        week: boolean;
        month: boolean;
        dateRange: boolean;
        rangeFrom: boolean;
        dispalyForward: boolean = false;
        dateFrom2: Date = new Date();
        /* DAY / WEEK / MONTH FILTER */

        selectedFilter = { value: "Week", id: 0 };
        searchProductivity: any;
        totalElements: number;
        projectId: string;
        persistanceId: string;
        persistanceObject: any;
        pageNumber = 0;
        anyOperationInProgress = true;
        pageSize = 100;
        sortBy: string = null;
        sortDirectionAsc = false;
        searchText: string = null;
        employeeIndex: any;
        getProductivityIndex: any;
        getSelectedDateEvent: any;
        searchProductivityRecords: any;
        roleFeaturesIsInProgress$: Observable<boolean>;
        validationMessage: string;
        totalCount = 0;
        isOpen = true;
        sortByFilterIsActive = true;
        dateFilterIsActive = true;
        searchIsActive: boolean;
        scrollbarH = false;
        softLabels: SoftLabelConfigurationModel[];
        selectedEntity: string;
        entities: EntityDropDownModel[];
        employeeIndexUserStories: any;
        isDailogOpened: boolean = false;
        selectedFilterValue: string = "all";
        all: boolean = true;
        reportingOnly: boolean = false;
        sortDirection: boolean = false;
        pageable: boolean = false;
        myself: boolean = false;
        selectedWorkspaceId: string;
        workspaces: WorkspaceList[];
        workspacesList$: Observable<WorkspaceList[]>;
        defaultFilterValue: string;
        disableDropDown: boolean = false;
        data: any;
        indexType: any;
        userId: string;
        loading: boolean;
        excelDrillDownLoading: boolean;

        state: KendoState = {
                skip: 0,
                take: 20,
        };

        detailedViewData: any;

        constructor(
                private store: Store<State>,
                private productivityService: ProductivityDashboardService,
                private router: Router, private toaster: ToastrService,
                private cdRef: ChangeDetectorRef,
                private dashboardService: DashboardService,
                private dialog: MatDialog
                , public dialogRef: MatDialogRef<DrillDownUserStoryPopupComponent>, private route: ActivatedRoute) {
                super();
                this.route.params.subscribe((params) => {
                        if (params["id"] != null && params["id"] !== undefined) {
                                this.selectedWorkspaceId = params["id"];
                        }
                });
                this.workspacesList$ = this.store.pipe(select(workspaceModuleReducer.getWorkspaceAll));
                this.workspaces = JSON.parse(localStorage.getItem('Dashboards'));
                let index;
                if (this.workspaces && this.workspaces.length > 0) {
                        index = this.workspaces.findIndex((p) => p.workspaceId == this.selectedWorkspaceId);
                }
                else {
                        index = -1;
                }
                if (index > -1) {
                        if (this.workspaces[index].workspaceName == "Administrator Dashboard") {
                                this.selectedFilterValue = "all";
                                this.defaultFilterValue = this.selectedFilterValue;
                                this.all = true;
                                this.reportingOnly = false;
                                this.myself = false;
                                this.disableDropDown = false;
                        }
                        else if (this.workspaces[index].workspaceName == "Manager Dashboard") {
                                this.selectedFilterValue = "reportingOnly";
                                this.defaultFilterValue = this.selectedFilterValue;
                                this.all = false;
                                this.reportingOnly = true;
                                this.myself = false;
                                this.disableDropDown = false;
                        }
                        else if (this.workspaces[index].workspaceName == "User Dashboard") {
                                this.selectedFilterValue = "mySelf";
                                this.defaultFilterValue = this.selectedFilterValue;
                                this.all = false;
                                this.reportingOnly = false;
                                this.myself = true;
                                this.disableDropDown = true;
                        }
                }
        }

        ngOnInit() {
                super.ngOnInit();
                this.getEntityDropDown();
                if (this.canAccess_feature_EmployeeIndex && !(this.dashboardFilters.dateFrom || this.dashboardFilters.dateTo ||  this.dashboardFilters.date)) {
                        this.dateFilterType('month');
                } else {
                        this.dateFilterType('daterange');
                }
                this.getSoftLabels();
                this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
        }

        pointRender(args: IPointRenderEventArgs): void {
                let materialColors: string[] = ['#00bdae', '#fe5722', '#8bc24a', '#357cd2', '#70ad47', '#e56590', '#f8b883', '#dd8abd', '#fec107', '#7bb4eb'];
                args.fill = materialColors[args.point.index % 10];
        };

        load(args: ILoadedEventArgs): void {
                let selectedTheme: string = location.hash.split('/')[1];
                selectedTheme = selectedTheme ? selectedTheme : 'Material';
                args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
        };

        changeFilterValue(value) {
                if (value == "all") {
                        this.selectedFilterValue = "all";
                        this.all = true;
                        this.reportingOnly = false;
                        this.myself = false;
                }
                else if (value == "reportingOnly") {
                        this.selectedFilterValue = "reportingOnly";
                        this.all = false;
                        this.reportingOnly = true;
                        this.myself = false;
                }
                else if (value == "mySelf") {
                        this.selectedFilterValue = "mySelf";
                        this.all = false;
                        this.reportingOnly = false;
                        this.myself = true;
                }
                if (this.isDetailedView) {
                        this.state.skip = 0;
                        this.state.take = 20;
                } else {
                        this.state.skip = 0;
                        this.state.take = 1000;
                }
                this.getAllProductivityIndexForDevelopers();
        }

        changeDuplicateFilterValue(value) {
                if (value == "all") {
                        this.selectedFilterValue = "all";
                        this.all = true;
                        this.reportingOnly = false;
                        this.myself = false;
                }
                else if (value == "reportingOnly") {
                        this.selectedFilterValue = "reportingOnly";
                        this.all = false;
                        this.reportingOnly = true;
                        this.myself = false;
                }
                else if (value == "mySelf") {
                        this.selectedFilterValue = "mySelf";
                        this.all = false;
                        this.reportingOnly = false;
                        this.myself = true;
                }
        }

        getSoftLabels() {
                this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
                this.cdRef.markForCheck();
        }

        dateFilterType(clickType) {
                if (clickType == "week") {
                        this.primaryWeek = "primary";
                        this.primaryMonth = "";
                        this.primaryDateRange = "";
                        this.day = false;
                        this.week = true;
                        this.month = false;
                        this.dateRange = false;
                        this.type = "Week";
                        this.days = Array(7).fill(1).map((x, i) => i);
                        this.weekDate = new Date(this.dateFrom2);
                        var dateLocal = new Date(this.dateFrom2);
                        var first = this.weekDate.getDate() - this.weekDate.getDay();
                        var last = first + 6;
                        this.dateFrom = new Date(this.weekDate.setDate(first));
                        this.dateTo = new Date(dateLocal.setDate(last));
                        this.setDateFrom(this.dateFrom);
                        this.setDateTo(this.dateTo);
                        this.weekNumber = this.getWeekNumber(this.weekDate);
                }
                else if (clickType == "month") {
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
                        this.primaryWeek = "";
                        this.primaryMonth = "";
                        this.primaryDateRange = "primary";
                        this.day = false;
                        this.week = false;
                        this.month = false;
                        this.dateRange = true;
                        this.setDateFrom(this.dateFrom);
                        this.setDateTo(this.dateTo);

                        this.rangeFrom = true;
                }
                this.dispalyForward = false;
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.state.take = 1000;
                        this.sortBy = 'productivityIndex';
                        this.sortDirection = false;
                        this.getAllProductivityIndexForDevelopers();
                }
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

                this.setDateFrom(this.dateFrom);
                this.setDateTo(this.dateTo);
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.state.take = 1000;
                        this.sortBy = 'productivityIndex';
                        this.sortDirection = false;
                        this.getAllProductivityIndexForDevelopers();
                }
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
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.state.take = 1000;
                        this.sortBy = 'productivityIndex';
                        this.sortDirection = false;
                        this.getAllProductivityIndexForDevelopers();
                }

        }

        dateToChanged(event: MatDatepickerInputEvent<Date>) {
                this.toDate = event.target.value;
                this.setToDate(this.toDate);
                this.rangeFrom = false;
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.state.take = 1000;
                        this.sortBy = 'productivityIndex';
                        this.sortDirection = false;
                        this.getAllProductivityIndexForDevelopers();
                }
        }

        setFromDate(date) {
                var day = date._i["date"];
                const month = 0 + (date._i["month"] + 1);
                const year = date._i["year"];
                var newDate = day + '/' + month + '/' + year;
                this.fromDate = this.parse(newDate);
                this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
        }

        setToDate(date) {
                var day = date._i["date"];
                const month = 0 + (date._i["month"] + 1);
                const year = date._i["year"];
                var newDate = day + '/' + month + '/' + year;
                this.toDate = this.parse(newDate);
                this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
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

                this.setDateFrom(this.dateFrom);
                this.setDateTo(this.dateTo);
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.state.take = 1000;
                        this.sortBy = 'productivityIndex';
                        this.sortDirection = false;
                        this.getAllProductivityIndexForDevelopers();
                }
        }

        onVisibilityChange(event) {
                let columns = event.columns;
                if (columns && columns.length > 0) {
                        // this.columns = [];
                        for (let i = 0; i < columns.length; i++) {
                                let object = {};
                                object['field'] = columns[i].field;
                                object['hidden'] = columns[i].hidden;
                                let index = this.columns.findIndex(x => x.field == columns[i].field);
                                if (index == -1)
                                        this.columns.push(object);
                                else {
                                        this.columns[index].field = columns[i].field;
                                        this.columns[index].hidden = columns[i].hidden;
                                }
                        }
                        this.persistanceObject.columns = this.columns;
                        this.updatePersistance();
                }
        }

        checkVisibility(fieldName) {
                let index = this.columns.findIndex(x => x.field == fieldName);
                if (index != -1) {
                        return this.columns[index].hidden;
                }
                else {
                        return false;
                }
        }

        dataStateChange(state: DataStateChangeEvent): void {
                this.state = state;
                if (this.state.sort[0]) {
                        this.sortBy = this.state.sort[0].field;
                        this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
                }
                this.getAllProductivityIndexForDevelopers();
        }

        updatePersistance() {
                let persistance = new Persistance();
                if (this.persistanceId) {
                        persistance.referenceId = this.persistanceId;
                        persistance.isUserLevel = true;
                        persistance.persistanceJson = JSON.stringify(this.persistanceObject);
                        this.dashboardService.UpsertPersistance(persistance).subscribe((response: any) => {
                                if (response.success) {
                                        // this.persistanceId = response.data;
                                }
                        });
                }
        }

        getPersistance() {
                if (this.persistanceId) {
                        let persistance = new Persistance();
                        persistance.referenceId = this.persistanceId;
                        persistance.isUserLevel = true;
                        this.dashboardService.GetPersistance(persistance).subscribe((response: any) => {
                                if (response.success) {
                                        if (response.data) {
                                                let result = response.data;
                                                let data = JSON.parse(result.persistanceJson);
                                                this.setPersistanceValues(data);
                                                this.getAllProductivityIndexForDevelopers();
                                        }
                                        else {
                                                this.getAllProductivityIndexForDevelopers();
                                        }
                                }
                                else {
                                        this.getAllProductivityIndexForDevelopers();
                                }
                        });
                }
                else {
                        this.getAllProductivityIndexForDevelopers();
                }
        }

        setPersistanceValues(data) {
                this.state = data.state;
                this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
                this.type = this.type;
                this.selectedDate = data.selectedDate;
                this.searchText = data.searchText;
                this.selectedEntity = data.entityId;
                this.all = data.isAll;
                this.reportingOnly = data.isReportingOnly;
                this.fromCustomApp = data.isFromDrilldown;
                this.myself = data.isMyself;
                // this.projectId = data.projectId;
                this.cdRef.detectChanges();
        }

        onSort(event) {
                const sort = event.sorts[0];
                this.sortBy = sort.prop;
                this.pageNumber = 0;
                if (sort.dir === "asc") {
                        this.sortDirectionAsc = true;
                } else {
                        this.sortDirectionAsc = false;
                }
                this.getAllProductivityIndexForDevelopers();
        }

        setPage(data) {
                this.searchText = this.searchText;
                this.pageNumber = data.offset;
                this.pageSize = 100;
                this.getAllProductivityIndexForDevelopers();
        }

        parse(value: any): Date | null {
                if ((typeof value === "string") && (value.indexOf("/") > -1)) {
                        // tslint:disable-next-line: quotemark
                        const str = value.split('/');
                        const year = Number(str[2]);
                        const month = Number(str[1]) - 1;
                        const date = Number(str[0]);
                        return new Date(year, month, date);
                } else if ((typeof value === "string") && value === "") {
                        return new Date();
                }
                const timestamp = typeof value === "number" ? value : Date.parse(value);
                return isNaN(timestamp) ? null : new Date(timestamp);
        }

        searchRecords() {
                if (this.searchText) {
                        this.searchIsActive = true;
                } else {
                        this.searchIsActive = false;
                }
                if (this.searchText && this.searchText.trim().length <= 0) { return; }
                this.searchText = this.searchText.trim();
                this.state.skip = 0;
                this.state.take = 20;
                this.getAllProductivityIndexForDevelopers();
        }

        closeSearch() {
                this.searchText = "";
                this.searchIsActive = false;
                this.state.skip = 0;
                this.state.take = 20;
                this.getAllProductivityIndexForDevelopers();
        }

        filterClick() {
                this.isOpen = !this.isOpen;
        }

        resetAllFilters() {
                this.date = new Date();
                this.selectedDate = this.date.toISOString();
                this.searchIsActive = false;
                this.searchText = "";
                this.selectedEntity = "";
                this.selectedFilterValue = "all";
                this.state.skip = 0;
                this.state.take = 20;
                if (this.defaultFilterValue) {
                        this.changeDuplicateFilterValue(this.defaultFilterValue);
                } else {
                        this.changeDuplicateFilterValue("all");
                }
                if (this.isDetailedView) {
                        this.getPersistance();
                } else {
                        this.dateFilterType('month')
                }
                // this.getAllProductivityIndexForDevelopers();
        }

        getAllProductivityIndexForDevelopers() {
                if (!this.isDetailedView) {
                this.employeeIndex = [];
                }
                else {
                        this.detailedViewData = [];
                }
                this.totalCount = null;
                this.anyOperationInProgress = true;
                this.type = this.type;
                this.selectedDate = moment(this.date).format("YYYY-MM-DD");
                const productivityDashboard = new ProductivityDashboardModel();
                // productivityDashboard.type = this.type;
                // productivityDashboard.selectedDate = this.selectedDate;
                // productivityDashboard.pageSize = this.pageSize;
                // productivityDashboard.pageNumber = this.pageNumber + 1;
                productivityDashboard.pageNumber = (this.state.skip / this.state.take) + 1;
                productivityDashboard.pageSize = this.state.take;
                productivityDashboard.sortBy = this.sortBy;
                productivityDashboard.sortDirectionAsc = this.sortDirection;
                productivityDashboard.searchText = this.searchText;
                productivityDashboard.entityId = this.selectedEntity;
                productivityDashboard.isAll = this.all;
                productivityDashboard.isReportingOnly = this.reportingOnly;
                productivityDashboard.isFromDrilldown = this.fromCustomApp;
                productivityDashboard.isMyself = this.myself;
                productivityDashboard.projectId = this.projectId ? this.projectId : null;
                productivityDashboard.dateFrom = this.dateFrom;
                productivityDashboard.dateTo = this.dateTo;
                this.fromCustomApp ? productivityDashboard.ownerUserId = this.Ids : null;

                productivityDashboard.state = this.state;
                productivityDashboard.columns = this.columns;
                this.persistanceObject = productivityDashboard;
                this.updatePersistance();

                this.productivityService.getProductivityIndexForDevelopers(productivityDashboard).subscribe((responseData: any) => {

                        if (responseData.success === false) {
                                this.validationMessage = responseData.apiResponseMessages[0].message;
                                this.toaster.error(this.validationMessage);
                        }
                        if (responseData.data.length === 0) {
                                this.employeeIndex = [];
                                this.totalCount = 0;
                                this.primaryYAxis = {
                                        minimum: 0, maximum: 150, interval: 50, majorGridLines: { width: 0.5 },
                                        majorTickLines: { width: 1 }, lineStyle: { width: 0.5 }, labelStyle: { color: '#000000' }
                                };
                                this.employeeIndex = {
                                        data: [],
                                        total: 0,
                                }
                                this.detailedViewData = {
                                        data: [],
                                        total: 0,  
                                }
                        }
                        else {
                                // this.employeeIndex = responseData.data;
                                if (!this.isDetailedView) {
                                        this.employeeIndex = {
                                                data: responseData.data,
                                                total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                                        }
                                        this.detailedViewData = this.employeeIndex;
                                }
                                else {
                                        this.detailedViewData = null;
                                        this.detailedViewData = {
                                                data: responseData.data,
                                                total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                                        }
                                }
                                
                                // if (this.employeeIndex.total > this.state.take) {
                                //         this.pageable = true;
                                // }
                                // else {
                                //         this.pageable = false;
                                // }
                                this.scrollbarH = true;
                                if(!this.isDetailedView) {
                                        var maxindex = Math.max.apply(Math, responseData.data.map(function (o) { return o.productivityIndex; }));
                                        this.primaryYAxis = {
                                                minimum: 0, maximum: maxindex + 20, interval: 50, majorGridLines: { width: 0.5 },
                                                majorTickLines: { width: 1 }, lineStyle: { width: 0.5 }, labelStyle: { color: '#000000' }
                                        };
                                }
                        }
                        this.anyOperationInProgress = false;
                        this.cdRef.detectChanges();
                });
        }

        exportToExcel(): void {
                this.loading = true;
                this.cdRef.detectChanges();
                this.selectedDate = moment(this.date).format("YYYY-MM-DD");
                const productivityDashboard = new ProductivityDashboardModel();
                productivityDashboard.type = this.type;
                productivityDashboard.selectedDate = this.selectedDate;
                productivityDashboard.pageNumber = null;
                productivityDashboard.pageSize = null;
                productivityDashboard.sortBy = this.sortBy;
                productivityDashboard.sortDirectionAsc = this.sortDirection;
                productivityDashboard.searchText = this.searchText;
                productivityDashboard.entityId = this.selectedEntity;
                productivityDashboard.isAll = this.all;
                productivityDashboard.isReportingOnly = this.reportingOnly;
                productivityDashboard.isFromDrilldown = this.fromCustomApp;
                productivityDashboard.isMyself = this.myself;
                productivityDashboard.projectId = this.projectId ? this.projectId : null;
                this.fromCustomApp ? productivityDashboard.ownerUserId = this.Ids : null;
                productivityDashboard.state = this.state;
                productivityDashboard.columns = this.columns;
                this.productivityService.getProductivityIndexForDevelopers(productivityDashboard).subscribe((responseData: any) => {
                        if (responseData.success == true) {
                                this.data = responseData.data;
                                this.cdRef.detectChanges();
                                Promise.all([this.excelExport1.workbookOptions()]).then((workbooks) => {
                                        this.excelExport1.fileName = "employee-index " + this.selectedDate + ".xlsx";
                                        this.excelExport1.save(workbooks[0]);
                                });
                                this.loading = false;
                                this.cdRef.detectChanges();
                        }
                        else {
                                this.validationMessage = responseData.apiResponseMessages[0].message;
                                this.toaster.error(this.validationMessage);
                                this.loading = false;
                                this.cdRef.detectChanges();
                        }
                });
        }

        goToProfile(url) {
                this.router.navigateByUrl("dashboard/profile/" + url);
                this.closePopUp.emit(true);
        }

        getEntityDropDown() {
                let searchText = "";
                this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
                        if (responseData.success === false) {
                                this.validationMessage = responseData.apiResponseMessages[0].message;
                                this.toaster.error(this.validationMessage);
                        }
                        else {
                                this.entities = responseData.data;
                        }
                });
        }

        entityValues(name) {
                this.selectedEntity = name;
                if (this.isDetailedView) {
                        this.state.skip = 0;
                        this.state.take = 20;
                } else {
                        this.state.skip = 0;
                        this.state.take = 1000;
                }
                this.getAllProductivityIndexForDevelopers();
        }

        openUserStoriesDailog(row, indexType) {
                let dialogId = "app-profile-component-drilldownuserstoryPopup";
                if (this.isDailogOpened)
                        return;
                const productivityDashboard = new ProductivityDashboardModel();
                productivityDashboard.type = this.type;
                productivityDashboard.selectedDate = this.selectedDate;
                productivityDashboard.indexType = indexType;
                this.indexType = indexType;

                productivityDashboard.ownerUserId = row.userId;
                this.userId = row.userId;
                productivityDashboard.projectId = this.projectId ? this.projectId : null;
                this.productivityService.getProductivityIndexUserStoriesForDevelopers(productivityDashboard).subscribe((responseData: any) => {
                        if (responseData.success === false) {
                                this.validationMessage = responseData.apiResponseMessages[0].message;
                                this.toaster.error(this.validationMessage);
                        }
                        else {
                                let data = responseData.data;
                                let dialog = this.dialog;
                                let isGrpIndex = indexType == 'GrpIndex';
                                if (!this.isDailogOpened) {
                                        const dialogRef = dialog.open(this.drillDownUserStoryPopupComponent, {
                                                width: "90%",
                                                direction: 'ltr',
                                                data: { data: data, isGrpIndex: isGrpIndex, formPhysicalId: dialogId, isFromEmployeeIndex: true },
                                                disableClose: true,
                                                id: dialogId
                                        });
                                        dialogRef.afterClosed().subscribe((result) => {
                                                // if (result.success) {

                                                // }
                                                this.isDailogOpened = false;
                                        });
                                        this.isDailogOpened = true;
                                }
                        }
                        this.anyOperationInProgress = false;
                        this.cdRef.detectChanges();
                });
        }

        exportDrillDownExcel() {
                this.excelDrillDownLoading = true;
                const productivityDashboard = new ProductivityDashboardModel();
                productivityDashboard.type = this.type;
                productivityDashboard.selectedDate = this.selectedDate;
                productivityDashboard.indexType = this.indexType;
                productivityDashboard.ownerUserId = this.userId;
                productivityDashboard.projectId = this.projectId ? this.projectId : null;
                this.productivityService.GetProduvtivityIndexDrillDownExcelTemplate(productivityDashboard).subscribe((responseData: any) => {
                        if (responseData.success === false) {
                                this.validationMessage = responseData.apiResponseMessages[0].message;
                                this.toaster.error(this.validationMessage);
                                this.excelDrillDownLoading = false;
                        }
                        else {
                                let filePath = responseData.data;
                                //this.downloadExcel = false;
                                this.cdRef.detectChanges();
                                if (filePath.blobUrl) {
                                        const parts = filePath.blobUrl.split(".");
                                        const fileExtension = parts.pop();

                                        if (fileExtension == 'pdf') {
                                        } else {
                                                const downloadLink = document.createElement("a");
                                                downloadLink.href = filePath.blobUrl;
                                                downloadLink.download = filePath.fileName
                                                downloadLink.click();
                                        }
                                }
                                this.excelDrillDownLoading = false;

                        }
                        this.cdRef.detectChanges();
                });
        }

        closeCurrentDialog() {
                this.closePopUp.emit(true);
        }

        openDetailedView() {
                let dialogId = 'detailedView'
                const dialogRef = this.dialog.open(this.detailedView, {
                        maxHeight: "85vh",
                        width: "70%",
                        id: dialogId,
                        data: { employeeIndex: this.detailedViewData, dialogId: dialogId,columns : this.columns, type: this.type, selectedDate: this.selectedDate }
                });
                dialogRef.afterClosed().subscribe((result) => {
                        this.isDetailedView = false;
                        this.cdRef.detectChanges();
                });
        }

}