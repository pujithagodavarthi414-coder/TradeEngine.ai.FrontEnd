import { Component, ChangeDetectorRef, Input, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import * as d3 from 'd3';

import { TestRailService } from "../services/testrail.service";
import { SplitBarReport } from "../models/workDoneReport";
import { TestCaseDropdownList } from "../models/testcasedropdown";

import { TranslateService } from "@ngx-translate/core";

import * as _ from 'underscore';
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { QaProductivityPopUp } from "../containers/qaproductivitypopup.page";
import { ConstantVariables } from '../constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { ProjectService } from '../services/projects.service';
import { ProjectSearchCriteriaInputModel } from '../models/ProjectSearchCriteriaInputModel';
import { ProjectSearchResult } from '../models/ProjectSearchResult';
import { DashboardFilterModel } from "../models/dashboardfilter.model";

@Component({
    selector: 'app-testrail-charts-view',
    templateUrl: 'charts-view.component.html'
})

export class ChartsViewComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("QaProductivityPopUp") QaProductivityPopUp: TemplateRef<any>;
    @Output() closePopUp = new EventEmitter<any>();

    public data = [
        {
            dateName: '10-Oct-2019',
            productivity: 10
        },
        {
            dateName: '11-Oct-2019',
            productivity: 12
        },
        {
            dateName: '12-Oct-2019',
            productivity: 9.5
        },
        {
            dateName: '13-Oct-2019',
            productivity: 10
        },
        {
            dateName: '14-Oct-2019',
            productivity: 8.5
        }
    ];
    public dataFromDB = [
        {
            dateName: '10-Oct-2019',
            originalSpentTime: 13.5,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '2,3,2,0,1,0,2,1,2'
        },
        {
            dateName: '11-Oct-2019',
            originalSpentTime: 10,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '1,2,1,0,1,0,2,1,2'
        },
        {
            dateName: '12-Oct-2019',
            originalSpentTime: 12,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '2,1,3,0,1,0,2,1,2'
        },
        {
            dateName: '13-Oct-2019',
            originalSpentTime: 10.5,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '0,1,3,0,1,0,2,1,2'
        },
        {
            dateName: '14-Oct-2019',
            originalSpentTime: 9.5,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '1,1,2,0,1,0,2,1,1'
        },
        {
            dateName: '15-Oct-2019',
            originalSpentTime: 12.5,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '0,1,2,0,1,0,2,1,2'
        },
        {
            dateName: '16-Oct-2019',
            originalSpentTime: 10.5,
            configurationName: 'TestCaseCreatedOrUpdated,TestSuiteCreatedOrUpdated,TestRunCreatedOrUpdated,TestCaseStatusChanged,BugsCreated,MilestoneCreatedOrUpdated,TestRepoReportCreatedOrUpdated,TestCaseView,TestSuiteSectionCreatedOrUpdated',
            configurationTime: '1,0,2,0,1,0,2,1,2'
        }
    ];
    public myData: any = [
        {
            dateName: '10-Oct-2019',
            originalSpentTime: '8',
            TestCaseCreatedOrUpdated: '2',
            TestSuiteCreatedOrUpdated: '3',
            TestRunCreatedOrUpdated: '4',
            TestCaseStatusChanged: '1',
            BugsCreated: '1',
            MilestoneCreatedOrUpdated: '1',
            TestRepoReportCreatedOrUpdated: '1',
            TestCaseView: '1',
            TestSuiteSectionCreatedOrUpdated: '1'
        },
        {
            dateName: '11-Oct-2019',
            originalSpentTime: '8',
            TestCaseCreatedOrUpdated: '1',
            TestSuiteCreatedOrUpdated: '2',
            TestRunCreatedOrUpdated: '3',
            TestCaseStatusChanged: '1',
            BugsCreated: '1',
            MilestoneCreatedOrUpdated: '1',
            TestRepoReportCreatedOrUpdated: '1',
            TestCaseView: '1',
            TestSuiteSectionCreatedOrUpdated: '1'
        },
        {
            dateName: '12-Oct-2019',
            originalSpentTime: '8',
            TestCaseCreatedOrUpdated: '2',
            TestSuiteCreatedOrUpdated: '1',
            TestRunCreatedOrUpdated: '3',
            TestCaseStatusChanged: '1',
            BugsCreated: '1',
            MilestoneCreatedOrUpdated: '1',
            TestRepoReportCreatedOrUpdated: '1',
            TestCaseView: '1',
            TestSuiteSectionCreatedOrUpdated: '1'
        },
        {
            dateName: '13-Oct-2019',
            originalSpentTime: '8',
            TestCaseCreatedOrUpdated: '0',
            TestSuiteCreatedOrUpdated: '1',
            TestRunCreatedOrUpdated: '3',
            TestCaseStatusChanged: '1',
            BugsCreated: '1',
            MilestoneCreatedOrUpdated: '1',
            TestRepoReportCreatedOrUpdated: '1',
            TestCaseView: '1',
            TestSuiteSectionCreatedOrUpdated: '1'
        },
        {
            dateName: '14-Oct-2019',
            originalSpentTime: '8',
            TestCaseCreatedOrUpdated: '3',
            TestSuiteCreatedOrUpdated: '1',
            TestRunCreatedOrUpdated: '2',
            TestCaseStatusChanged: '1',
            BugsCreated: '1',
            MilestoneCreatedOrUpdated: '1',
            TestRepoReportCreatedOrUpdated: '1',
            TestCaseView: '1',
            TestSuiteSectionCreatedOrUpdated: '1'
        }
    ];

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            if (this.dashboardFilters.projectId) {
                this.isProject = true;
            }
            if (this.dashboardFilters.userId) {
                this.selectedUserId = this.dashboardFilters.userId;
            }
            // if(this.dashboardFilters.date == 'lastWeek' || this.dashboardFilters.date == 'nextWeek' || this.dashboardFilters.date == 'thisMonth' || this.dashboardFilters.date == 'lastMonth'){
            //     this.isDateFilter = true;
            //     this.dateFilter = '';
            //     this.dateTo = this.dashboardFilters.dateTo;
            //     this.dateFrom = this.dashboardFilters.dateFrom;
            // }
            if (this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo) {
                this.isDateFilter = true;
                this.dateFilter = '';
                this.dateTo = this.dashboardFilters.dateTo;
                this.dateFrom = this.dashboardFilters.dateFrom;
            } else {
                this.isDateFilter = true;
                this.dateFilter = '';
                this.dateFrom = this.dashboardFilters.date ? this.dashboardFilters.date : null;
                this.dateTo = this.dashboardFilters.date ? this.dashboardFilters.date : null;
            }
            this.getWholeUsers();
        }
    }

    dashboardFilters: DashboardFilterModel;
    public myData1: any = [];
    public configurations = [];
    usersList: TestCaseDropdownList[] = [];
    employeeList: any;
    maxProd = 13;
    productivity: any;
    projectId: string;
    selectedMember: string;
    selectedUserId: string;
    validationMessage: string;
    selectedEmployeeId: string;
    dateFilter: string = 'Last7days';
    dateFrom: string;
    dateTo: string;
    // maxDate = Date.now();
    maxDate = new Date();
    dateFilterIsActive: boolean = false;
    isDateFilter: boolean = false;
    selectEmployeeFilterIsActive: boolean = false;
    isOpen: boolean = true;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    projectSearchResults$: Observable<ProjectSearchResult[]>;
    projectSearchResults = [];
    selectedProjectId: string;
    isEmployeeDropDownVisible: boolean = false;
    isProjectsExists: boolean = false;
    isProject: boolean = false;
    firstEmployee: string;
    firstProject: string;
    selectedEntity: string;
    entities = [];
    projectText: string = 'Project';
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isDailogOpened: boolean = false;
    isFromMyProductivity: boolean = false;

    constructor(private route: ActivatedRoute,
        private cookieService: CookieService, private actionUpdates$: Actions, private toastr: ToastrService,
        public softLabelPipe: SoftLabelPipe, private testRailService: TestRailService, private translateService: TranslateService,
        private datePipe: DatePipe, private cdRef: ChangeDetectorRef, private projectService: ProjectService, private routes: Router,
        private dialog: MatDialog) {

        super();
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        // this.actionUpdates$
        //     .pipe(
        //         ofType(ProjectActionTypes.LoadProjectsCompleted),
        //         tap(() => {
        //             this.projectSearchResults$ = this.store.pipe(select(projectModuleReducer.getProjectsAll), tap(result => {
        //                 if (result.length > 0) {
        //                     this.firstProject = result[0].projectId;
        //                     this.selectedProjectId = result[0].projectId;
        //                     this.searchByProject(this.selectedProjectId);
        //                 }
        //                 else {
        //                     this.isProjectsExists = true;
        //                 }
        //             }));
        //         })
        //     )
        //     .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        if (!this.selectedUserId) {
            this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        if (this.routes.url.includes('/dashboard/myproductivity')) {
            this.isFromMyProductivity = true;
        }
        this.selectedEmployeeId = this.selectedUserId;
        this.getEntityDropDown();
        this.getAllProjectsByFilterContext();
        // this.loadReport()
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getAllProjectsByFilterContext() {
        const projectSearchResult = new ProjectSearchCriteriaInputModel();
        projectSearchResult.isArchived = this.isArchived;
        // this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
        this.projectService.searchProjects(projectSearchResult).subscribe((response: any) => {
            if (response.success == true) {
                if (response.data && response.data.length > 0) {
                    let data = response.data;
                    this.projectSearchResults = response.data;
                    if (!this.isProject) {
                        this.firstProject = data[0].projectId;
                        this.selectedProjectId = data[0].projectId;
                    }
                    else if (this.isProject) {
                        this.firstProject = this.dashboardFilters.projectId;
                        this.selectedProjectId = this.dashboardFilters.projectId;
                    }
                    this.searchByProject(this.selectedProjectId);
                }
                else {
                    this.projectSearchResults = [];
                    this.isProjectsExists = true;
                    this.cdRef.markForCheck();
                }
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isEmployeeDropDownVisible = false;
                this.cdRef.markForCheck();
            }
        })
    }


    searchByProject(projectId) {
        this.selectedProjectId = projectId;
        // this.departmentPopover.close();
        this.isEmployeeDropDownVisible = false;
        if (projectId != '0')
            this.getAllUsers();
        else
            this.getWholeUsers();
    }

    getWholeUsers() {
        this.testRailService.GetAllUsers().subscribe((response: any) => {
            if (response.success) {
                this.usersList = response.data;
                this.usersList.forEach((x, i: any) => {
                    // this.usersList[i].id = this.usersList[i].userId;
                    this.usersList[i].value = this.usersList[i].fullName;
                });
                if (this.isFromMyProductivity) {
                    this.isEmployeeDropDownVisible = false;
                }
                else {
                    this.isEmployeeDropDownVisible = true;
                }
                this.selectedEmployeesId(this.selectedEmployeeId);
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isEmployeeDropDownVisible = false;
            }
        })
    }

    getAllUsers() {
        this.testRailService.GetUsers(this.selectedProjectId).subscribe((response: any) => {
            if (response.success == true) {
                this.usersList = response.data;
                if (this.usersList != null) {
                    this.firstEmployee = this.usersList[0].id;
                    //this.selectedEmployeeId = this.usersList[0].id;
                    this.selectedEmployeesId(this.selectedEmployeeId);
                }
                if (this.isFromMyProductivity) {
                    this.isEmployeeDropDownVisible = false;
                }
                else {
                    this.isEmployeeDropDownVisible = true;
                }
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.isEmployeeDropDownVisible = false;
            }
        })
    }

    loadReport() {
        this.isAnyOperationIsInprogress = true;
        let report = new SplitBarReport();
        report.createdOn = this.dateFilter;
        report.dateFrom = this.dateFrom != '' ? this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd') : this.dateFrom;
        report.dateTo = this.dateTo != '' ? this.datePipe.transform(this.dateTo, 'yyyy-MM-dd') : this.dateTo;
        // report.dateFrom = this.dateFrom;
        // report.dateTo = this.dateTo;
        report.userId = this.selectedEmployeeId ? this.selectedEmployeeId : this.selectedUserId;
        report.entityId = this.selectedEntity;
        report.isDateFilter = this.isDateFilter;
        // report.projectId = (this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : '';
        if (this.selectedProjectId == '0')
            report.projectId = null;
        else
            report.projectId = this.selectedProjectId;
        this.testRailService.GetTestTeamStatusReporting(report).subscribe((response: any) => {
            if (response.success == true) {
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.convertDataToD3Format(response.data);
                this.createChart();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.toastr.error(this.validationMessage);
            }
        });
    }

    changeDeadline(from, to) {
        this.dateFilter = '';
        if (from > to)
            this.dateTo = '';
        if (from != '' && to != '') {
            this.isDateFilter = true;
            this.loadReport();
        }
    }

    changeStartline(from, to) {
        this.dateFilter = '';
        if (from != '' && to != '') {
            this.isDateFilter = true;
            this.loadReport();
        }
    }

    closeDateFilter() {
        this.dateFrom = '';
        this.dateTo = '';
        this.isDateFilter = false;
        this.dateFilter = 'Last7days';
        this.loadReport();
    }

    public margin: any = { top: 30, right: 30, bottom: 70, left: 60 };
    public width: any = 460 - this.margin.left - this.margin.right;
    public height: any = 400 - this.margin.top - this.margin.bottom;
    public svg: any;

    convertDataToD3Format(data) {
        var dataSet = data;
        var maxProdValue = [];
        this.myData1 = [];
        if (dataSet && dataSet.length > 0) {
            dataSet.forEach(x => {
                var obj = {};
                var names = x.configurationName.split(',');
                var values = x.configurationTime.split(',');
                var maxValues = 0;
                obj['dateName'] = x.dateName;
                obj['originalSpentTime'] = x.originalSpentTime;
                obj['bugsCountText'] = x.bugsCountText;
                obj['p0BugsCount'] = x.p0BugsCount;
                obj['p1BugsCount'] = x.p1BugsCount;
                obj['p2BugsCount'] = x.p2BugsCount;
                obj['p3BugsCount'] = x.p3BugsCount;
                obj['userId'] = x.userId;
                names.forEach((y, i) => {
                    obj[y] = values[i];
                    // maxProdValue.push(parseFloat(values[i]));
                    maxValues = maxValues + parseFloat(values[i]);
                });
                maxProdValue.push(maxValues);
                maxProdValue.push(x.originalSpentTime);
                this.myData1.push(obj);
            });
            this.configurations = dataSet[0].configurationName.split(',');
            this.maxProd = Math.max(...maxProdValue);
            if (this.maxProd == 0)
                this.maxProd = 1;
        }
        else
            this.maxProd = 1;
    }

    createChart() {
        let sample = this;
        var color = d3.scaleOrdinal()
            .domain(this.configurations)
            //.range(['#C7EFCF','#FE5F55','#EEF5DB']);
            .range(['blue', '#d2691e', 'orange', '#6554c0', 'red', '#ff5630', '#00b8d9', '#04fe02', '#757575']);

        var stackedData = d3.stack()
            .keys(this.configurations)
            (this.myData1)

        d3.select("#chart").select('svg').remove();
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 360 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var tooltip = d3.select("#toolTip")
            .style("position", "absolute")
            .style("border-radius", "6px")
            .style("border", "1px solid black")
            .style("padding", "8px")
            .style("background", "#eef5db")
            .style("display", "none");

        var tooltip1 = d3.select("#toolTip1")
            .style("position", "absolute")
            .style("border-radius", "6px")
            .style("border", "1px solid black")
            .style("padding", "8px")
            .style("background", "#eef5db")
            .style("display", "none");

        var svg = d3.select("#chart")
            .classed("svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 900 400")
            .classed("svg-content-responsive", true)
            .append("g")
            .attr("transform",
                "translate(280,30)")
            .attr('cursor', 'pointer');

        var x = d3.scaleBand()
            .range([0, width])
            .domain(this.myData1.map(function (d) { return d.dateName; }))
            .padding(0.4);

        svg.append("g")
            .attr("transform", "translate(0,200)")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "8");

        svg.append("text")
            .attr("x", 135)
            .attr("y", 270)
            .style("text-anchor", "middle")
            .text("Time period");

        // Right side text
        svg.append("text")
            .attr("x", 365)
            .attr("y", 35)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            .text("Original spent time")
            .attr("fill", "green");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 50)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            .text("Test case created/updated")
            .attr("fill", "blue");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 65)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            // .text("Test suite created/updated")
            .text(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ScenarioCreatedOrUpdated), this.softLabels))
            .attr("fill", "#d2691e");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 80)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            // .text("Test run created/updated")
            .text(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.RunCreatedOrUpdated), this.softLabels))
            .attr("fill", "orange");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 95)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            .text("Test case status updated")
            .attr("fill", "#6554c0");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 110)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            .text("Bugs created/updated")
            .attr("fill", "red");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 125)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            // .text("Milestone created/updated")
            .text(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.VersionCreatedOrUpdated), this.softLabels))
            .attr("fill", "#ff5630");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 140)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            // .text("Report created/updated")
            .text(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ReportCreatedOrUpdated), this.softLabels))
            .attr("fill", "#00b8d9");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 155)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            .text("Test case viewed")
            .attr("fill", "#04fe02");
        // Right side text
        svg.append("text")
            .attr("x", 362)
            .attr("y", 170)
            .style("text-anchor", "middle")
            .style("font-size", "8")
            // .text("Testsuite section created/updated")
            .text(this.softLabelPipe.transform(this.translateService.instant(ConstantVariables.ScenarioSectionCreatedOrUpdated), this.softLabels))
            .attr("fill", "#757575");

        var y = d3.scaleLinear()
            .domain([0, this.maxProd])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -105)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Effective spent time (hr)");

        svg.selectAll("mybar")
            .data(this.myData1)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d['dateName']); })
            .attr("y", function (d) { return y(0); })
            .attr("width", x.bandwidth() / 2)
            .attr("height", function (d) { return height - y(0); })
            .attr("fill", "green")

        // Tooltip
        svg.selectAll("rect")
            .data(this.myData1)
            .on("click", function (event: any) {

                sample.getUserStorybyUserId(event);
            })
            .on("mousemove", function (d) {
                tooltip
                    .style("left", d3.event.pageX + 20 + "px")
                    .style("top", d3.event.pageY - 80 + "px")
                    .style("display", "inline-block")
                    .html("Original spent time: " + (d['originalSpentTime']) + " hours");
            })
            .on("mouseout", function (d) { tooltip.style("display", "none"); });

        svg.selectAll("rect")
            //.transition()
            //.duration(800)
            .attr("y", function (d) { return y(d['originalSpentTime']); })
            .attr("height", function (d) { return height - y(d['originalSpentTime']); })
        //.delay(function (d, i) { return (i * 100) })

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            var groupName = d3.select(this.parentNode).datum()['key'];
            var subgroupName = sample.softLabelPipe.transform(groupName, sample.softLabels);
            var subgroupValue = d.data[groupName];
            if (subgroupName == " Bugs created") {
                tooltip1
                    .html(subgroupName + ": " + subgroupValue + " hours<br>P0's: " + d.data["p0BugsCount"] + ", P1's: " + d.data["p1BugsCount"] + ", P2's: " + d.data["p2BugsCount"] + ", P3's: " + d.data["p3BugsCount"])
                    .style("display", "inline-block")
            }
            else {
                tooltip1
                    .html(subgroupName + ": " + subgroupValue + " hours")
                    .style("display", "inline-block")
            }
        }
        var mousemove = function (d) {
            tooltip1
                .style("left", d3.event.pageX + 20 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", d3.event.pageY - 80 + "px")
        }
        var mouseleave = function (d) {
            tooltip1
                .style("display", "none")
        }

        // Show the bars			
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) {
                //console.log(d);
                return color(d.key).toString();
            })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function (d) {
                //console.log(d);
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d: any) {
                //console.log(d);
                return x(d.data.dateName);
            })
            .attr("y", function (d) {
                //console.log(d);
                return y(d[1]);
            })
            .attr("height", function (d) {
                //console.log(d);
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth() / 2)
            //.attr("stroke", "grey")
            .attr("transform",
                "translate(" + (x.bandwidth() / 2 + 0.5) + ",0)")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", function (event: any) {

                // var groupName = d3.select(this.parentNode).datum()['key'];                
                // var subgroupValue = event.data[groupName];

                if (event != null && event != undefined && event.data != null && event.data != undefined)
                    sample.getUserStorybyUserId(event.data);
            })
    }

    selectedEmployeesId(employeeId) {
        let usersList = this.usersList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.id == employeeId;
        });
        if (filteredList) {
            this.selectedMember = filteredList.value;
            this.cdRef.markForCheck();
        }
        this.selectedEmployeeId = employeeId;
        this.selectEmployeeFilterIsActive = true;
        this.dateFilter = (this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo) || this.dashboardFilters.date ? '' : 'Last7days';
        this.dateFrom = this.dashboardFilters.dateFrom ? this.dashboardFilters.dateFrom : this.dashboardFilters.date ? this.dashboardFilters.date : '';
        this.dateTo = this.dashboardFilters.dateTo ? this.dashboardFilters.dateTo : this.dashboardFilters.date ? this.dashboardFilters.date : '';
        this.loadReport();
    }

    selectedDuplicateEmployeesId(employeeId) {
        let usersList = this.usersList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.id == employeeId;
        });
        if (filteredList) {
            this.selectedMember = filteredList.value;
            this.cdRef.markForCheck();
        }
        this.selectedEmployeeId = employeeId;
        this.cdRef.markForCheck();
    }

    onChangeDateFilter(value) {
        this.dateFilterIsActive = true;
        this.dateFilter = value;
        this.dateFrom = '';
        this.dateTo = '';
        this.loadReport();
    }

    resetAllFilters() {
        this.selectedDuplicateEmployeesId(this.selectedEmployeeId);
        this.dateFilter = 'Last7days';
        this.dateFrom = '';
        this.dateTo = '';
        this.isDateFilter = false;
        this.dateFilterIsActive = false;
        this.selectEmployeeFilterIsActive = false;
        this.selectedProjectId = this.firstProject;
        this.selectedEntity = "";
        this.loadReport();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    getEntityDropDown() {
        let searchText = "";
        this.projectService.getEntityDropDown(searchText).subscribe((responseData: any) => {
            if (responseData.success === false) {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            else {
                this.entities = responseData.data;
            }
        });
    }

    entityValues(name) {
        this.selectedEntity = name;
        this.loadReport();
    }

    getUserStorybyUserId(data) {

        if (this.isDailogOpened)
            return;

        if (data != null && data != undefined) {

            this.isAnyOperationIsInprogress = true;
            let report = new SplitBarReport();
            report.selectedDate = data.dateName;
            report.isDateFilter = this.isDateFilter;
            // if (!this.isDateFilter) {
            //     report.selectedDate = data.dateName;
            //     report.isDateFilter = this.isDateFilter;
            // }
            // else {
            //     report.selectedDate = data.dateName;
            //     report.dateFrom = this.dateFrom;
            //     report.dateTo = this.dateTo;
            //     report.isDateFilter = this.isDateFilter;
            // }
            if (this.selectedProjectId == '0')
                report.projectId = null;
            else
                report.projectId = this.selectedProjectId;
            report.userId = data.userId;

            this.testRailService.GetTestTeamStatusReportingProjectWise(report).subscribe((response: any) => {
                if (response.success == true) {
                    if (response.data != null && response.data != undefined && response.data.length > 0) {

                        let resData = [];

                        response.data.forEach(item => {

                            let obj = {};

                            obj["projectName"] = item.projectName;
                            obj["projectId"] = item.projectId;
                            obj["originalSpentTime"] = item.originalSpentTime;

                            let configName = item.configurationName.split(',');
                            let values = item.configurationTime.split(',');
                            let testCounts = item.testCasesCount.split(',');

                            configName.forEach((y, i) => {

                                if (y.trim().match("Test case created or updated")) {
                                    obj["testCaseCreatedUpdated"] = values[i];
                                    obj["testCaseCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Scenario created or updated")) {
                                    obj["scenarioCreatedUpdated"] = values[i];
                                    obj["scenarioCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Run created or updated")) {
                                    obj["runCreatedUpdated"] = values[i];
                                    obj["runCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Test case status")) {
                                    obj["testCaseStatusUpdated"] = values[i];
                                    obj["testCaseStatusUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Bugs created")) {
                                    obj["bugsCreatedUpdated"] = values[i];
                                    obj["bugsCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Version created or updated")) {
                                    obj["versionCreatedUpdated"] = values[i];
                                    obj["versionCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Test report created or updated")) {
                                    obj["testReportCreatedUpdated"] = values[i];
                                    obj["testReportCreatedUpdatedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Test case viewed")) {
                                    obj["testCaseViewed"] = values[i];
                                    obj["testCaseViewedCount"] = testCounts[i];
                                }

                                if (y.trim().match("Scenario section created or updated")) {
                                    obj["scenarioSectionCreatedUpdated"] = values[i];
                                    obj["scenarioSectionCreatedUpdatedCount"] = testCounts[i];
                                }
                            });


                            // if ((Number(obj["scenarioSectionCreatedUpdated"]) > 0 || Number(obj["testCaseViewed"]) > 0 || Number(obj["testReportCreatedUpdated"]) > 0 ||
                            //     Number(obj["versionCreatedUpdated"]) > 0 || Number(obj["bugsCreatedUpdated"]) > 0 || Number(obj["testCaseStatusUpdated"]) > 0 ||
                            //     Number(obj["runCreatedUpdated"]) > 0 || Number(obj["scenarioCreatedUpdated"]) > 0 || Number(obj["testCaseCreatedUpdated"]) > 0) ||
                            //     (Number(obj["scenarioSectionCreatedUpdatedCount"]) > 0 || Number(obj["testCaseViewedCount"]) > 0 || Number(obj["testReportCreatedUpdatedCount"]) > 0 ||
                            //         Number(obj["versionCreatedUpdatedCount"]) > 0 || Number(obj["bugsCreatedUpdatedCount"]) > 0 || Number(obj["testCaseStatusUpdatedCount"]) > 0 ||
                            //         Number(obj["runCreatedUpdatedCount"]) > 0 || Number(obj["scenarioCreatedUpdatedCount"]) > 0 || Number(obj["testCaseCreatedUpdatedCount"]) > 0)) {
                            resData.push(obj);
                            //}
                        });

                        let dialog = this.dialog;
                        let dialogId = "app-testrail-page-qaproductivitypopup";

                        if (!this.isDailogOpened) {
                            const dialogRef = dialog.open(this.QaProductivityPopUp, {
                                width: "72%",
                                direction: 'ltr',
                                data: { resData, formPhysicalId: dialogId },
                                id: dialogId,
                                disableClose: true
                            });
                            dialogRef.afterClosed().subscribe((result) => {
                                // if (result.success) {

                                // }
                                this.isDailogOpened = false;
                            });

                            this.isDailogOpened = true;
                        }
                    }
                }
                else {

                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
                this.isAnyOperationIsInprogress = false;
            });
        }
    }

    closeCurrentDialog() {
        this.closePopUp.emit(true);
    }
}