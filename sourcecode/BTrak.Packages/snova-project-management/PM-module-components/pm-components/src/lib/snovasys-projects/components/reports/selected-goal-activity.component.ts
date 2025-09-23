import { Component, ChangeDetectorRef, Input, ViewChild, EventEmitter, Output } from "@angular/core";
import { GoalLevelReportsService } from "../../services/reports.service";
import { ToastrService } from "ngx-toastr";
import { SelectedGoalActivityModel } from "../../models/selectedGoalActivityModel";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { Observable } from "rxjs";
import { UserStory } from "../../models/userStory";
import { SatPopover } from "@ncstate/sat-popover";
import { AssigneefilterPipe } from "../../pipes/assigneeFilter.pipes";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/projects.service';
import { ProjectSearchCriteriaInputModel } from '../../models/ProjectSearchCriteriaInputModel';
import { ProjectSearchResult } from '../../models/ProjectSearchResult';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import * as $_ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
const $ = $_;

@Component({
  selector: "app-pm-component-selected-goal-activity",
  templateUrl: "selected-goal-activity.component.html"
})

export class SelectedGoalActivityComponent {
  @Output() closePopUp = new EventEmitter<any>();

  @ViewChild('namePopover') namePopover: SatPopover;
  selectedEmployeeIdFromProfile: string;
  dashboardFiltersFromProfileData: DashboardFilterModel = null;
  

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.selectedEmployeeId = null;
      this.goalId = this.dashboardFilters.goalId;
      this.projectId = this.dashboardFilters.projectId;
      if (this.projectId && !this.goalId) {
        this.isFromProjectActivity = true;
      }
      if (this.dashboardFilters.userId) {
        this.selectedEmployeesIdFind(this.dashboardFilters.userId);
      }
      this.getGoalAcTivity();
    }
  }

  @Input("isFromUserActivity")
  set _isFromUserActivity(data: boolean) {
    this.isFromUserActivity = data;
  }

  @Input("userId")
  set _userId(data: string) {
    this.selectedEmployeeId = data;
    if (this.selectedEmployeeIdFromProfile) {
      this.selectedEmployeeId = this.selectedEmployeeIdFromProfile;
    }
  }
  @Input("dashboardFiltersFromProfile")
  set _dashboardFiltersFromProfile(data: DashboardFilterModel) {
    this.dashboardFiltersFromProfileData = data;
    if (this.dashboardFiltersFromProfileData) {
      this.selectedEmployeeIdFromProfile = data.userId;
      if (this.selectedEmployeeIdFromProfile) {
        this.selectedEmployeeId = this.selectedEmployeeIdFromProfile;
      }
      else {
        this.selectedEmployeeId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
      }
      this.fromDate = this.dashboardFiltersFromProfileData.dateFrom ? new Date(this.dashboardFiltersFromProfileData.dateFrom) : new Date(this.dashboardFiltersFromProfileData.date);
      this.toDate = this.dashboardFiltersFromProfileData.dateTo ? new Date(this.dashboardFiltersFromProfileData.dateTo) : new Date(this.dashboardFiltersFromProfileData.date);

    }
    this.getGoalAcTivity();
  }


  @Input("isFromActivity")
  set _isFromActivity(data: boolean) {
    this.isFromActivity = data;
    if (this.isFromActivity) {
      this.selectedEmployeeId = this.selectedEmployeeIdFromProfile;
      this.getGoalAcTivity();
      this.searchProjects();
      this.getAllUsers();
    }
  }



  dashboardFilters: DashboardFilterModel;
  filteredUserStories: UserStory[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  usersList: User[];
  isAnyOperationIsInprogress: boolean = false;
  data: any;
  validationMessage: string;
  goal: any;
  isFromUserActivity: boolean;
  userId: string;
  isOpen: boolean = true;
  goalId: string = null;
  projectId: string = null;
  ownerName: string;
  selectedEmployeeId: string;
  selectEmployeeFilterIsActive: boolean = false;
  isFromActivity: boolean;
  employeeList$: Observable<any[]>;
  employeeList: any[];
  pageSize: number = 25;
  pageNumber: number = 1;
  pageIndex: number;
  pageSizeOptions: number[] = [20, 25, 50, 100, 150, 200];
  isIncludeUserStory: boolean = false;
  isIncludeLogTime: boolean = false;
  projectsList: ProjectSearchResult[];
  userStories$: Observable<UserStory[]>;
  userStories: UserStory[];
  isFromProjectActivity: boolean;
  totalCount: number = 0;
  employeeName: string;
  projectName: string;
  appInProductivity: number = -1;
  selectedProjectId: string;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  maxDate = new Date();
  fromMinDate = new Date();
  currentUserTimeZoneName: string;
  currentUserTimeZoneOffset: string;
  currentUserTimeZoneAbbr: string;

  constructor(private reportsService: GoalLevelReportsService, private router: Router, private toaster: ToastrService, private cdRef: ChangeDetectorRef, private assigneeFilterPipe: AssigneefilterPipe,
    private projectService: ProjectService,
    private store: Store<State>, private userService: UserService, private cookieService: CookieService) {
      this.getUserDetails();
  }

  ngOnInit() {
    var today = new Date();
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    this.fromMinDate = endDate;
    var todayDate = new Date();
    var endDate = new Date(today.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 6);
    this.fromDate = endDate;
    this.toDate = new Date();
    if (this.dashboardFiltersFromProfileData && (this.dashboardFiltersFromProfileData.dateFrom || this.dashboardFiltersFromProfileData.date)) {
      this.fromDate = this.dashboardFiltersFromProfileData.dateFrom ? new Date(this.dashboardFiltersFromProfileData.dateFrom) : new Date(this.dashboardFiltersFromProfileData.date);
    }
    this.getSoftLabels();
    this.getAllEmployees();
    this.userStories$ = this.store.pipe(
      select(projectModuleReducer.getAllUserStories));
    this.userStories$.subscribe(x => this.userStories = x);
    this.selectedEmployeeId = "";
    if (!this.goalId && !this.isFromActivity) {
      this.getGoalAcTivity();
    }
    var temp = this.router.url.split("/");
    this.appInProductivity = temp.findIndex(x => x === "myproductivity");
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getUserDetails() {
    var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    this.currentUserTimeZoneName = userModel.currentTimeZoneName;
    this.currentUserTimeZoneOffset = userModel.currentTimeZoneOffset;
    this.currentUserTimeZoneAbbr = userModel.currentTimeZoneAbbr;
  }

  searchProjects() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.projectService.searchProjects(projectSearchResult).subscribe((x: any) => {
      if (x.success) {
        this.projectsList = x.data;
      }
    })
  }

  getAllUsers() {
    this.userService.GetAllUsers().subscribe((x: any) => {
      if (x.success) {
        this.usersList = x.data;
      }
    })
  }

  getGoalAcTivity() {
    if (this.goalId == null && this.projectId == null && !this.isFromActivity) {
      return;
    }
    this.isAnyOperationIsInprogress = true;
    var selectedGoalActivity = new SelectedGoalActivityModel();
    selectedGoalActivity.goalId = this.goalId;
    selectedGoalActivity.projectId = this.projectId;
    selectedGoalActivity.isIncludeLogTime = this.isIncludeLogTime;
    selectedGoalActivity.isIncludeUserStoryView = this.isIncludeUserStory;
    selectedGoalActivity.userId = this.selectedEmployeeId;
    selectedGoalActivity.isFromActivity = this.isFromActivity;
    selectedGoalActivity.pageNumber = this.pageNumber;
    selectedGoalActivity.pageSize = this.pageSize;

    //if(!this.goalId && !this.isFromUserActivity) {
    if (this.dashboardFiltersFromProfileData) {
      if (this.dashboardFiltersFromProfileData.dateFrom && this.dashboardFiltersFromProfileData.dateTo) {
        this.fromDate = new Date(this.dashboardFiltersFromProfileData.dateFrom)
        this.toDate = new Date(this.dashboardFiltersFromProfileData.dateTo)
      }
      else if (this.dashboardFiltersFromProfileData.date) {
        this.fromDate = new Date(this.dashboardFiltersFromProfileData.date);
        this.toDate = new Date(this.dashboardFiltersFromProfileData.date);
      }
      else {
        var today = new Date();
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        this.fromDate = endDate;
        this.toDate = new Date();
      }
    }
    selectedGoalActivity.dateFrom = this.fromDate;
    selectedGoalActivity.dateTo = this.toDate;
    //}
    this.reportsService.getSelectedGoalActivity(selectedGoalActivity).subscribe((response: any) => {
      if (response.success == true) {
        this.data = response.data;
        if (this.data && this.data.length > 0) {
          this.totalCount = this.data[0].totalCount;
        } else {
          this.totalCount = 0;
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.toaster.error(this.validationMessage);
      }

    }
    )
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  selectedProjects(projectId, event) {
    if (projectId == 0 || projectId == 'all') {
      this.projectId = null;
      this.projectName = null;
      this.selectedProjectId = null;
    } else {
      this.projectId = projectId;
      this.projectName = event.source.selected._element.nativeElement.innerText.trim();
    }
    this.pageNumber = 1;
    this.pageIndex = 0;
    this.pageSize = 25;
    this.getGoalAcTivity();
  }

  resetAllFilters() {
    this.isIncludeUserStory = false;
    this.isIncludeLogTime = false;
    if (this.isFromActivity) {
      this.projectId = null;
      this.selectedProjectId = null;
    }
    this.pageNumber = 1;
    this.pageIndex = 0;
    this.pageSize = 25;
    this.employeeName = null;
    if (this.isFromUserActivity) {
      this.selectedEmployeeId = this.userId;
    } else {
      this.selectedEmployeeId = null;
      this.selectEmployeeFilterIsActive = false;
    }
    var today = new Date();
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    this.fromDate = endDate;
    this.toDate = new Date();
    this.getGoalAcTivity();
  }

  getAllEmployees() {
    if (this.goalId == null && this.projectId == null) {
      return;
    }
    this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
    this.employeeList$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
    this.employeeList$.subscribe((x => this.employeeList = x));
  }

  selectedEmployeesId(employeeId, event) {
    this.filteredUserStories = this.assigneeFilterPipe.transform(this.userStories, "ownerName", this.userStories);
    let usersList = this.usersList;
    let employeeList = this.employeeList;
    let filteredUserStories = this.filteredUserStories;
    if (employeeId == 0) {
      this.selectedEmployeeId = null;
      if (event == null)
        this.employeeName = null;
      else
        if (this.isFromActivity) {
          this.employeeName = usersList.find(x => x.id == employeeId).fullName;
        } else if (this.isFromProjectActivity) {
          this.employeeName = employeeList.find(x => x.projectMember.id == employeeId).projectMember.name;
        } else {
          this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        }
      this.selectEmployeeFilterIsActive = false;
    }
    else {
      if (this.isFromActivity) {
        if (employeeId != 'all') {
          this.employeeName = usersList.find(x => x.id == employeeId).fullName;
        } else {
          this.employeeName = null;
        }
      } else if (this.isFromProjectActivity) {
        if (employeeId != 'all') {
          this.employeeName = employeeList.find(x => x.projectMember.id == employeeId).projectMember.name;
        } else {
          this.employeeName = null;
        }
      }
      else {
        if (employeeId != 'all') {
          this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        } else {
          this.employeeName = null;
        }
      }
      this.selectedEmployeeId = employeeId;
      this.selectEmployeeFilterIsActive = true;
    }
    this.pageNumber = 1;
    this.pageIndex = 0;
    this.pageSize = 25;
    //this.namePopover.close();
    this.getGoalAcTivity();
  }

  selectedUser(employeeId, event) {
    let usersList = this.usersList;
    if (employeeId == 0) {
      this.selectedEmployeeId = null;
      if (event == null)
        this.employeeName = null;
      else
        this.employeeName = usersList.find(x => x.id == employeeId).fullName;
      this.selectEmployeeFilterIsActive = false;
    }
    else {
      this.employeeName = usersList.find(x => x.id == employeeId).fullName;
      this.selectedEmployeeId = employeeId;
      this.selectEmployeeFilterIsActive = true;
    }
    this.pageNumber = 1;
    this.pageIndex = 0;
    this.pageSize = 25;
    //this.namePopover.close();
    this.getGoalAcTivity();
  }

  selectedEmployeesIdFind(employeeId) {
    this.filteredUserStories = this.assigneeFilterPipe.transform(this.userStories, "ownerName", this.userStories);
    let filteredUserStories = this.filteredUserStories;
    this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
    this.selectedEmployeeId = employeeId;
    //this.namePopover.close();
    this.getGoalAcTivity();
  }

  setPageEvent(pageEvent) {
    if (pageEvent.pageSize != this.pageSize) {
      this.pageNumber = 1;
      this.pageIndex = 0;
    }
    else {
      this.pageNumber = pageEvent.pageIndex + 1;
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    this.getGoalAcTivity();
  }

  clearViewFilter(value) {
    this.isIncludeUserStory = !value;
    this.getGoalAcTivity();
  }

  clearLogTimeFilter(value) {
    this.isIncludeLogTime = !value;
    this.getGoalAcTivity();
  }

  navigateToProjects() {
    this.closePopUp.emit(true);
    this.router.navigateByUrl('/projects');
  }

  setClassForActivity() {
    if (this.goalId) {
      return "no-drag goal-activity filter-height" // goal-activity individual Page View
    } else if (this.isFromActivity) {
      return ""                     // project-activity page            
    } else {
      return "no-drag goal-activity" // widget gridsterView
    }
  }

  setStyles() {
    let styles;
    if (this.goalId) {
      styles = {
        "height": 'calc(90vh - 10px)'
      };
      return styles;
    } else {
      return ''
    }
  }

  fitContent(optionalParameters: any) {
    var interval;
    var count = 0;

    if (optionalParameters['individualPageView']) {
      interval = setInterval(() => {
        try {
          if (count > 30) {
            clearInterval(interval);
          }
          count++;
          if ($(optionalParameters['individualPageSelector'] + ' .goal-activity').length > 0) {
            $(optionalParameters['individualPageSelector'] + ' .goal-activity').height($(optionalParameters['individualPageSelector']).height() - 100);
            clearInterval(interval);
          }
        } catch (err) {
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
          if ($(optionalParameters['gridsterViewSelector'] + ' .goal-activity').length > 0) {
            $(optionalParameters['gridsterViewSelector'] + ' .goal-activity').height($(optionalParameters['gridsterViewSelector']).height() - 150);
            clearInterval(interval);
          }
        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);
    }

  } // fitContent

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = event.target.value;
    this.getGoalAcTivity();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.getGoalAcTivity();
  }

  clearFromDate() {
    var today = new Date();
    var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    this.fromDate = endDate;
    this.getGoalAcTivity();
  }

  clearToDate() {
    this.toDate = new Date();
    this.getGoalAcTivity();
  }
}