import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ILoadedEventArgs, ChartTheme, IPointRenderEventArgs } from '@syncfusion/ej2-charts';
import { CookieService } from 'ngx-cookie-service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CumulativeWorkReport, CumulativeWorkReportSearchInputModel } from '../../models/projects/cumulativeWorkReportModel';
import { ProjectManagementService } from '../../services/project-management.service';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { TestCaseDropdownList } from '../../models/projects/testcasedropdown';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DatePipe } from "@angular/common";
@Component({
    selector: "app-cumulative-work-report",
    templateUrl: `cumulative-work-report.html`,
    encapsulation: ViewEncapsulation.None
})

export class CumulativeWorkReportComponent extends CustomAppBaseComponent implements OnInit {
    dashboardFilters: DashboardFilterModel;
    tooltip: Object;
    cumulativeWorkReport: CumulativeWorkReport[];
    Todo: any = [];
    Done: any = [];
    Inprogress: any = [];
    Pending_verification: any = [];
    Verification_completed: any = [];
    Blocked: any = [];
    barChartData: any = [];
    validationMessage: string;
    userId: string;
    projectId: string;
    selectedMember: string;
    dateFrom: Date;
    dateTo: Date;
    date: Date;
    maxDate = new Date();
    dateToMax: Date;
    isAnyOperationIsInprogress: boolean;
    palette = ["#04fefe", "#33B2FF", "#36c2c4", "#ffd966", "#8E9AAA", "#ead1dd"];
    usersList: TestCaseDropdownList[] = [];
    public marker: Object;
    barGraphVisible: boolean = false;
    singleDate: string;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        if (this.dashboardFilters.date == 'lastWeek' || this.dashboardFilters.date == 'nextWeek' || this.dashboardFilters.date == 'thisMonth' || this.dashboardFilters.date == 'lastMonth') {
            var dateFromStr = this.datePipe.transform(this.dashboardFilters.dateFrom, 'yyyy-MM-dd');
            this.dateFrom = new Date(dateFromStr);
            var dateToStr = this.datePipe.transform(this.dashboardFilters.dateTo, 'yyyy-MM-dd');
            this.dateTo = new Date(dateToStr);
        }
        else if (this.dashboardFilters.date == null && this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo) {
            var dateFromStr = this.datePipe.transform(this.dashboardFilters.dateFrom, 'yyyy-MM-dd');
            this.dateFrom = new Date(dateFromStr);
            var dateToStr = this.datePipe.transform(this.dashboardFilters.dateTo, 'yyyy-MM-dd');
            this.dateTo = new Date(dateToStr);
            // if(this.dateFrom == this.dateTo){
            //     var tempDate = new Date(this.dateFrom);
            //     tempDate.setDate(tempDate.getDate() + 1);
            //     this.dateTo = tempDate;
            // }
        }
        else {
            if(this.dashboardFilters.date){
                var dateFromStr = this.datePipe.transform(this.dashboardFilters.date, 'yyyy-MM-dd');
                this.dateFrom = new Date(dateFromStr);
                // var tempDate = new Date(this.dateFrom);
                // tempDate.setDate(tempDate.getDate() + 1);
                this.dateTo = this.dateFrom;
            }
        }
        this.userId = this.dashboardFilters.userId ? this.dashboardFilters.userId : null;
        this.projectId = this.dashboardFilters.projectId ? this.dashboardFilters.projectId : null;
    }
    public title: string
    public chartArea: Object = {
        border: {
            width: 0
        }
    };
    public width: string = '100%';
    public primaryXAxis: Object = {
        valueType: 'DateTime',
        labelFormat: 'd/MMM',
        majorGridLines: { width: 0 },
        intervalType: 'Days',
        edgeLabelPlacement: 'Shift'
    };
    public primaryYAxis: Object = {
        labelFormat: '{value}',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
    };

    public previousTarget = null;
    public radius: Object = { bottomLeft: 0, bottomRight: 0, topLeft: 10, topRight: 10 }
    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    };
    public barChartXAxis: Object = {
        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, labelStyle: { color: 'black' }
    };
    public barChartYAxis: Object = {
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 }, lineStyle: { width: 0.3 }, labelStyle: { color: 'black' }
    };
    public barMarker: Object = { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } };
    // pointRender(args: IPointRenderEventArgs): void {
    //     let materialColors: string[] = ['#00bdae', '#fe5722', '#8bc24a', '#357cd2', '#70ad47', '#e56590', '#f8b883', '#dd8abd', '#fec107', '#7bb4eb'];
    //     args.fill = materialColors[args.point.index % 10];
    // };
    public pointRender(args: IPointRenderEventArgs): void {
        let materialColors: string[] = ["#04fefe", "#33B2FF", "#36c2c4", "#ffd966", "#8E9AAA", "#ead1dd"];
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.fill = materialColors[args.point.index % 10];
    };
    public legend: Object = {
        visible: true
    }
    constructor(private projectManagementService: ProjectManagementService, private cdRef: ChangeDetectorRef, private cookieService: CookieService, private toastr: ToastrService, private datePipe: DatePipe) {
        super();
        this.tooltip = {
            enable: true
        };
        this.marker = { visible: true };
    }

    ngOnInit() {
        super.ngOnInit();
        if (!this.dashboardFilters.userId) {
            this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        else{
            this.userId = this.dashboardFilters.userId;
        }
        this.getWholeUsers();
        // this.getCumulativeWorkReport();
    }

    getCumulativeWorkReport() {
        this.isAnyOperationIsInprogress = true;
        var cumulativeWorkReportSearchInputModel = new CumulativeWorkReportSearchInputModel();
        cumulativeWorkReportSearchInputModel.dateFrom = this.dateFrom;
        cumulativeWorkReportSearchInputModel.dateTo = this.dateTo;
        cumulativeWorkReportSearchInputModel.userId = this.userId;
        cumulativeWorkReportSearchInputModel.date = this.date;
        cumulativeWorkReportSearchInputModel.projectId = this.projectId;
        this.cumulativeWorkReport = null;
        this.projectManagementService.getCumulativeWorkReport(cumulativeWorkReportSearchInputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.cumulativeWorkReport = [];
                this.Todo = [];
                this.Done = [];
                this.Inprogress = [];
                this.Pending_verification = [];
                this.Verification_completed = [];
                this.Blocked = [];
                this.barChartData = [];
                this.cumulativeWorkReport = response.data;
                if (this.cumulativeWorkReport && this.cumulativeWorkReport.length > 1) {
                    this.barGraphVisible = false;
                    this.cumulativeWorkReport.forEach(obj => {
                        this.Todo.push({ x: new Date(obj.date), y: obj.toDoStatusWorkitemsCount })
                        this.Done.push({ x: new Date(obj.date), y: obj.doneStatusWorkitemsCount })
                        this.Inprogress.push({ x: new Date(obj.date), y: obj.inprogressStatusWorkitemsCount })
                        this.Pending_verification.push({ x: new Date(obj.date), y: obj.pendingVerificationStatusWorkitemsCount })
                        this.Verification_completed.push({ x: new Date(obj.date), y: obj.verificationCompletedStatusWorkitemsCount })
                        this.Blocked.push({ x: new Date(obj.date), y: obj.blockedStatusWorkitemsCount })
                    });
                }
                else if(this.cumulativeWorkReport && this.cumulativeWorkReport.length == 1){
                    this.barGraphVisible = true;
                    this.cumulativeWorkReport.forEach(obj => {
                        this.barChartData.push({ x: 'Todo', y: obj.toDoStatusWorkitemsCount },
                                               { x: 'Inprogress', y: obj.inprogressStatusWorkitemsCount },
                                               { x: 'Pending verification', y: obj.pendingVerificationStatusWorkitemsCount },
                                               { x: 'Done', y: obj.doneStatusWorkitemsCount },
                                               { x: 'Verification completed', y: obj.verificationCompletedStatusWorkitemsCount },
                                               { x: 'Blocked', y: obj.blockedStatusWorkitemsCount })
                        this.singleDate = this.datePipe.transform( obj.date, 'dd-MM-yyyy');

                    });
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.cdRef.markForCheck();
            }
            else {
                this.cumulativeWorkReport = [];
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }
    getWholeUsers() {
        this.isAnyOperationIsInprogress = true;
        this.projectManagementService.GetAllUsers().subscribe((response: any) => {
            if (response.success) {
                this.usersList = response.data;
                this.usersList.forEach((x, i: any) => {
                    this.usersList[i].value = this.usersList[i].fullName;
                });
                this.selectedUserId(this.userId);
                this.getCumulativeWorkReport();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isAnyOperationIsInprogress = false;
            }
        })
    }
    selectedUserId(employeeId) {
        let usersList = this.usersList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.id == employeeId;
        });
        if (filteredList) {
            this.selectedMember = filteredList.value;
            this.title = 'Cumulative work report of ' + this.selectedMember;
            this.cdRef.markForCheck();
        }
    }
    selectedEmployeesId(employeeId) {
        let usersList = this.usersList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.id == employeeId;
        });
        if (filteredList) {
            this.selectedMember = filteredList.value;
            this.title = 'Cumulative work report of ' + this.selectedMember;
            this.cdRef.markForCheck();
        }
        this.userId = employeeId;
        this.getCumulativeWorkReport();
    }
    changeDeadline(from, to) {
        var maxToDate = new Date(this.dateFrom);
        maxToDate.setDate(maxToDate.getDate() + 1);
        this.dateToMax = maxToDate;
        if (from > to)
            this.dateTo = null;
        if (from != null && to != null) {
            this.getCumulativeWorkReport();
        }
    }

    changeStartline(from, to) {
        if (from != null && to != null) {
            this.getCumulativeWorkReport();
        }
    }

    resetAllFilters() {
        this.userId =this.dashboardFilters.userId ? this.dashboardFilters.userId : this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.selectedUserId(this.userId);
        if(!this.dashboardFilters.dateFrom && !this.dashboardFilters.dateTo){
            this.dateFrom = null;
            this.dateTo = null;
        }
        this.getCumulativeWorkReport();
    }
}
