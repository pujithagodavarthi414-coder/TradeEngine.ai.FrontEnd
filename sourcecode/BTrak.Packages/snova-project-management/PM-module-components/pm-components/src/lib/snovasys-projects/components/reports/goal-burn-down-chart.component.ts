import { Component, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from "@angular/core";
import { GoalLevelReportsService } from "../../services/reports.service";
import { ToastrService } from "ngx-toastr";
import * as d3 from 'd3';
import { BurnDownChartDetailsModel } from "../../models/burnDownChart";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { Observable } from "rxjs";
import * as projectModuleReducer from "../../store/reducers/index";
import { ProjectGoalsService } from '../../services/goals.service';
import { SprintService } from "../../services/sprints.service";
import { UserStory } from "../../models/userStory";
import { SatPopover } from "@ncstate/sat-popover";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { GoalModel } from "../../models/GoalModel";
import { SprintModel } from "../../models/sprints-model";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { tap } from "rxjs/operators";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "app-pm-component-goal-burn-down-report-charts",
  templateUrl: "goal-burn-down-chart.component.html"
})
export class GoalBurnDownChartComponent {
  @Output() closePopUp = new EventEmitter<any>();

  @ViewChild('namePopover') namePopover: SatPopover;

  @Input('goalData')
  set goalData(data: any) {
    this.goal = data;
    if (this.goal) {
      this.fromDate = this.goal.onboardProcessDate;
      this.minDateForFromDate = this.goal.onboardProcessDate;
      this.minDate = this.goal.onboardProcessDate;
      this.goalId = this.goal.goalId;
      this.projectId = this.goal.projectId;
    }
  }

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data) {
      this.dashboardId = data;
      this.dashboardId = 'd' + this.dashboardId.replace(/[-]/g, '');
    }
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;

      if (this.dashboardFilters.goalId) {
        this.isFromSprint = false;
        this.selectedGoalId = this.dashboardFilters.goalId;
        this.getGoalsList();
        this.getGoalUserStories();
      } else if (this.dashboardFilters.sprintId) {
        this.isFromSprint = true;
        this.selectedSprintId = this.dashboardFilters.sprintId;
        this.getSprintsList();
        this.getSprintUserStories();
      }

      if (this.dashboardFilters.sprintStartdate) {
        this.fromDate = this.dashboardFilters.sprintStartdate;
        this.minDateForFromDate = this.dashboardFilters.sprintStartdate;
        this.minDate = this.fromDate;
      }
      if (this.dashboardFilters.sprintEndDate) {
        this.toDate = this.dashboardFilters.sprintEndDate;
        this.maxDate = null;
      } else if (this.dashboardFilters.goalId) {
        this.maxDate = new Date();
      }
      this.selectedEmployeeId = null;
      this.getBurnDownDetails();
      this.getAllEmployees();
    }
  }



  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  goal: any;
  sprint: SprintModel;
  isFromSprint: boolean;
  minDateForFromDate: any;
  dashboardFilters: DashboardFilterModel;
  //userStories$: Observable<UserStory[]>;
  userStories: UserStory[];
  isAnyOperationIsInprogress: boolean = false;
  userStoryPoints: boolean;
  data: any;
  goalId: string;
  projectId: string;
  sprintId: string;
  ownerName: string;
  validationMessage: string;
  selectedSprintId: string;
  selectedGoalId: string;
  selectedEmployeeId: string;
  selectEmployeeFilterIsActive: boolean = false;
  isOpen: boolean = true;
  actualBurn: any;
  expectedBurn: any;
  productivity: any[] = [];
  maxProd: any;
  isVisible: boolean = false;
  goalsList: GoalModel[];
  sprintsList: SprintModel[];
  employeeList$: Observable<any[]>;
  toDate: Date;
  fromDate: Date;
  minDate: Date;
  maxDate: Date = new Date();
  employeeName: string;
  dashboardId: string;
  isApplyFilters: boolean;

  constructor(private reportsService: GoalLevelReportsService, private router: Router, private toaster: ToastrService, private store: Store<State>,
    private goalService: ProjectGoalsService,
    private sprintsService: SprintService,
    private cdRef: ChangeDetectorRef) {
    d3.select("#tooltip").remove();
  }

  ngOnInit() {
    this.getSoftLabels();
    if (!this.dashboardFilters)
      this.getBurnDownDetails();

    // this.getAllEmployees();
    /*
    if (!this.isFromSprint) {
      this.userStories$ = this.store.pipe(
        select(projectModuleReducer.getAllUserStories));
      this.userStories$.subscribe(x => this.userStories = x);

    } else {
      this.userStories$ = this.store.pipe(
        select(projectModuleReducer.getSprintWorkItemsAll),
        tap((userStories) => {
          this.userStories = userStories;
        }));

    }
    */

  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  resetToStoryPoints() {
    this.userStoryPoints = false;
    this.isApplyFilters = false;
    this.getBurnDownDetails();
  }

  getGoalsList() {
   
    var goalsModel = new GoalSearchCriteriaApiInputModel();
    goalsModel.projectId = this.dashboardFilters.projectId;
    goalsModel.goalStatus = "Active, Archived";

    this.goalService.searchGoals(goalsModel).subscribe((responseData: any) => {    
      this.goalsList = responseData.data;     
    });
  }

  getSprintsList() {
   
    var sprintsModel = new SprintModel();
    sprintsModel.projectId = this.dashboardFilters.projectId;
    sprintsModel.isBacklog = false;
    sprintsModel.allSprints = true;
    
    this.sprintsService.searchSprints(sprintsModel).subscribe((responseData: any) => {     
      this.sprintsList = responseData.data;     
    });
  }

  getSprintUserStories() {   
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.sprintId = this.selectedSprintId;
    userStorySearchCriteria.isArchived = false;
    userStorySearchCriteria.isParked = false;
    
    this.goalService.searchSprintUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
      this.userStories = responseData.data;     
    });
  }

  getGoalUserStories() {
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.goalId = this.selectedGoalId;
    userStorySearchCriteria.isUserStoryArchived = false;
    userStorySearchCriteria.isUserStoryParked = false;
    
    this.goalService.searchUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
      this.userStories = responseData.data;     
    });
  }
  
  getBurnDownDetails() {
    this.isAnyOperationIsInprogress = true;
    var burnDownChartDetails = new BurnDownChartDetailsModel();
    burnDownChartDetails.userId = this.selectedEmployeeId;
    burnDownChartDetails.goalId = this.selectedGoalId;
    burnDownChartDetails.sprintId = this.selectedSprintId;
    burnDownChartDetails.isApplyFilters = this.isApplyFilters;
   
    burnDownChartDetails.isFromSprint = this.isFromSprint;
    burnDownChartDetails.dateFrom = this.fromDate;
    burnDownChartDetails.dateTo = this.toDate;
    burnDownChartDetails.userStoryPoints = this.userStoryPoints;
    if ((this.dashboardFilters.goalId == null && !this.isFromSprint) || (this.dashboardFilters.sprintId == null && this.isFromSprint)) {
      this.isAnyOperationIsInprogress = false;
      return;
    }
    this.reportsService.getBurnDownChartDetails(burnDownChartDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.data = response.data;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
        if (this.data) {
          this.actualBurn = this.data.actualBurnDown;
          this.expectedBurn = this.data.expectedBurnDown;
          this.isVisible = true;
          this.cdRef.detectChanges();
          this.max();
        }
        this.chart();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.toaster.error(this.validationMessage);
      }

    }
    )
  }

  enableUserStoryPointsView(event) {
    this.getBurnDownDetails();
  }

  getAllEmployees() {
    if (this.dashboardFilters && this.dashboardFilters.projectId == null) {
      return;
    }
    this.store.dispatch(new LoadMemberProjectsTriggered(this.dashboardFilters.projectId));
    this.employeeList$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
  }

  selectSprintId(sprintId) {
    this.selectedEmployeeId = null;
    this.employeeName = null;
    this.fromDate = null;
    this.toDate = null;
    this.userStoryPoints = false;

    var sprint = _.find(this.sprintsList, function (s) {return s.sprintId == sprintId; });
    if(sprint){

      if (sprint.sprintStartDate) {
        this.fromDate = sprint.sprintStartDate;
        this.minDateForFromDate = sprint.sprintStartDate;
        this.minDate = this.fromDate;
      }
      if (sprint.sprintEndDate) {
        this.toDate = sprint.sprintEndDate;
        this.maxDate = null;
      }
    }
    
    this.getSprintUserStories();
    this.getBurnDownDetails();
  }

  selectGoalId(goalId) {
    this.selectedEmployeeId = null;
    this.employeeName = null;
    this.fromDate = null;
    this.toDate = null;
    this.userStoryPoints = false;

    this.getGoalUserStories();
    this.getBurnDownDetails();
  }

  selectedEmployeesId(employeeId, event) {
    if (employeeId == "all") {
      this.selectedEmployeeId = null;
      if (event == null)
        this.employeeName = null;
      else
        this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
      this.selectEmployeeFilterIsActive = false;
    }
    else {
      this.selectedEmployeeId = employeeId;
      this.employeeName = event.source.selected._element.nativeElement.innerText.trim();
      this.selectEmployeeFilterIsActive = true;
    }
    this.getBurnDownDetails();
  }

  max() {
    this.productivity = [];
    for (var i = 0; i < this.expectedBurn.length; i++) {
      this.productivity.push(this.expectedBurn[i].value);

    }
    this.maxProd = Math.max(...this.productivity);
    this.maxProd = Math.ceil(this.maxProd);
    if (this.maxProd == 0)
      this.maxProd = 1;
  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = event.target.value;
    this.minDate = this.fromDate;
    this.isApplyFilters = true;
    this.getBurnDownDetails();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.isApplyFilters = true;
    this.getBurnDownDetails();
  }

  resetAllFilters() {
    this.selectedEmployeeId = null;
    this.selectEmployeeFilterIsActive = false;
    this.userStoryPoints = false;
    this.employeeName = null;
    this.isApplyFilters = false;
    if (this.isFromSprint) {
      this.selectedSprintId = this.dashboardFilters.sprintId;
      this.fromDate = this.dashboardFilters.sprintStartdate;
      this.minDate = this.dashboardFilters.sprintEndDate;
      this.toDate = this.dashboardFilters.sprintEndDate;
      this.getSprintUserStories();
    } else {
      this.selectedGoalId = this.dashboardFilters.goalId;
      this.fromDate = null;
      this.toDate = null;
      this.minDate = this.goal ? this.goal.onboardProcessDate : null;
      this.employeeName = null;
      this.getGoalUserStories();
    }
    this.getBurnDownDetails();
  }

  public margin: any = { top: 10, right: 100, bottom: 30, left: 30 };
  public height: any = 400 - this.margin.top - this.margin.bottom;
  public svg: any;

  chart() {

    if (this.data == null) {
      d3.select("#" + this.dashboardId).select('svg').remove();
      this.isVisible = false;
      this.cdRef.detectChanges();
    }
    else {
      var dataReady = [{ name: "ExpectedBurnDown", values: this.expectedBurn, color: "#808080" }, { name: "ActualBurnDown", values: this.actualBurn, color: "#ff3300" }]

      var parseTime = d3.timeParse("%d-%b-%Y");

      var xFormat = "%d-%m-%Y";

      d3.select("#" + this.dashboardId).select('svg').remove();

      var tooltip = d3.select("#tooltip").attr("class", "toolTip");

      this.svg = d3.select("#" + this.dashboardId)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 500")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform",
          "translate(130,30)");

      var x = d3.scaleTime()
        .rangeRound([0, 400])

      x.domain(d3.extent(this.data.expectedBurnDown, function (d) { return parseTime(d['time']); }));

      this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat(xFormat)))
        .selectAll("text")
        .attr("transform", "translate(-20,10)rotate(-45)")
        .style("text-anchor", "end");

      this.svg.append("text")
        .attr("x", 180)
        .attr("y", 430)
        .style("text-anchor", "middle")
        .text("Days");

      var y = d3.scaleLinear()
        .domain([0, this.maxProd])
        .range([this.height, 0]);

      this.svg.append("g")
        .call(d3.axisLeft(y));

      if (this.isFromSprint && this.userStoryPoints) {
        this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -45)
          .attr("x", -150)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Story points");
      } else {
        this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -45)
          .attr("x", -150)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Hours");
      }

      var line = d3.line()
        .x(function (d) { return x(parseTime(d['time'])) })
        .y(function (d) { return y(d['value']) })

      this.svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", function (d) { return line(d.values) })
        .attr("stroke", function (d) { return d.color })
        .style("stroke-width", 2)
        .style("fill", "none")

      this.svg
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .style("fill", function (d) { return d.color })
        .selectAll("myPoints")
        .data(function (d) { return d.values })
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(parseTime(d.time)) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 3.5)
        .attr("stroke", "white")
        .append("title")
        .text(function (d) {
          return "Month: " + (d.time) + " " + "Hours: " + (d.value);
        })
      // .on("mousemove", function (d) {
      //   tooltip
      //     .style("left", d3.event.pageX - 50 + "px")
      //     .style("top", d3.event.pageY - 70 + "px")
      //     .style("display", "inline-block")
      //     .html(("Month: " + d.time) + "<br>" + "Hours: " + (d.value));
      // })
      // .on("mouseout", function (d) { tooltip.style("display", "none"); });

      this.svg.append("text")
        .attr("x", 500)
        .attr("y", 20)
        .style("text-anchor", "middle")
        .style("fill", "#ff3300")
        .text("Actual burn down");

      this.svg.append("text")
        .attr("x", 500)
        .attr("y", 40)
        .style("text-anchor", "middle")
        .style("fill", "#808080")
        .text("Expected burn down");
    }
  }
  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetFromDate() {
    this.fromDate = this.goal.onboardProcessDate;
    this.getBurnDownDetails();
  }

  resetToDate() {
    this.toDate = new Date();
    this.getBurnDownDetails();
  }

  navigateToProjects() {
    this.closePopUp.emit(true);
    this.router.navigateByUrl('/projects');
  }

  fitContent(optionalParameters: any){
    var interval;
    var count = 0;

    if(optionalParameters['individualPageView']){
      interval = setInterval(() => {
        try{
          if(count > 30){
            clearInterval(interval);
          }
          count++;
          if($(optionalParameters['individualPageSelector'] + ' .custom-box.style-1').length > 0) {
            $(optionalParameters['individualPageSelector'] + ' .custom-box.style-1').height($(optionalParameters['individualPageSelector']).height() - 45);
            clearInterval(interval);
          }
        }catch(err){
          clearInterval(interval);
        }
      }, 1000);
    }

    if (optionalParameters['gridsterView']) {
      interval = setInterval(() => {
        try {
          if (count > 30) {
            clearInterval(interval);
          }
          count++;
          if ($(optionalParameters['gridsterViewSelector'] + ' .custom-box.style-1').length > 0) {
              $(optionalParameters['gridsterViewSelector'] + ' .custom-box.style-1').css({"min-width": "700px" });
              $(optionalParameters['gridsterViewSelector'] + ' .custom-box.style-1').height($(optionalParameters['gridsterViewSelector']).height() - 68);
              clearInterval(interval);
          }
        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);
    }

  }


}