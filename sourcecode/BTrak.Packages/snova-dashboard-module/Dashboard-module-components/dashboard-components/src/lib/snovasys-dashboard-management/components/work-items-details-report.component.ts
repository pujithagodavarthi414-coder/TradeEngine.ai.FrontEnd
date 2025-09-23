import { Component, ChangeDetectorRef, Output, EventEmitter, Input, TemplateRef, ViewChild } from "@angular/core";
import { MyProfileService } from "../services/myProfile.service";
import { HistoricalWorkReportModel } from "../models/historicalWorkReport";
import { Router } from "@angular/router";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { LineManagersModel } from '../models/line-mangaers-model';
import { ToastrService } from "ngx-toastr";
import { HrDashboardService } from "../services/hr-dashboard.service";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { LoadBoardTypesTriggered } from "../store/actions/board-types.actions";
import { LoadUserStoryTypesTriggered } from "../store/actions/user-story-types.action";
import * as projectReducer from "../store/reducers/index";
import { Branch } from "../models/branch";
import { LoadBranchTriggered } from "../store/actions/branch.actions";
import * as assetModuleReducer from '../store/reducers/index';
import * as projectModuleReducer from "../store/reducers/index";
import { TranslateService } from "@ngx-translate/core";
import { TeamLeadsService } from "../services/teamleads.service";
import { Project } from '../models/project.model';
import { BoardType } from '../models/board-type.model';
import { UserDropDownModel } from '../models/user-dropdown.model';
import { UserStoryTypesModel } from '../models/userstory-types.model';
import { BugPriorityDropDownData } from '../models/bug-priority-dropdown-data.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { DashboardService } from '../services/dashboard.service';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import '../../globaldependencies/helpers/fontawesome-icons';
import { Persistance } from '../models/persistance.model';

@Component({
  selector: 'app-work-items-details-report',
  templateUrl: 'work-items-details-report.component.html',
})

export class WorkItemsAnalysisReportComponent {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialogWorkItem", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
  Offset: string;

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data != null && data !== undefined && data !== this.persistanceId) {
      this.persistanceId = data;
    }
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: any) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  columns = [];

  dashboardFilters: any;
  isAnyOperationIsInprogress: boolean = false;
  historicalWork: any;
  validationMessage: string;
  selectedUserId: string;
  persistanceId: string;
  persistanceObject: any;
  sortDirection: boolean;
  searchText: string = '';
  sortBy: string;
  fromDate: Date = new Date();
  isOpen: boolean = false;
  toDate: Date = new Date();
  minDateForEndDate = new Date();
  dateFilterIsActive: boolean = true;
  lineManager: LineManagersModel[];
  selectLineManagerfilter: boolean = false;
  teamLeadId: string;
  projectSearchResults$: Observable<Project[]>;
  projectsList: Project[];
  projectId: string;
  selectedProjectfilter: boolean = false;
  public ngDestroyed$ = new Subject();
  boardTypes$: Observable<BoardType[]>;
  selectBoardTypefilter: boolean = false;
  boardTypeId: string;
  searchByGoal: boolean = false;
  searchGoalText: string;
  searchByUserStory: boolean = false;
  searchUserStoryText: string;
  selectedUserfilter: boolean = false;
  UsersList: UserDropDownModel[];
  selectedUser: string;
  maxDate = new Date();
  branchList$: Observable<Branch[]>;
  branchId: string;
  searchByBranch: boolean = false;
  selectedVerifiedUserfilter: boolean = false;
  selectedVerifiedUser: string;
  selectedVerifiedUserId: string;
  verifiedDate: Date;
  isWorkItemInRed: boolean = false;
  isGoalInRed: boolean = false;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryPriorities: BugPriorityDropDownData[];
  userStoryTypeId: string;
  selectUserStoryTypefilter: boolean = false;
  userStoryPriorityId: string;
  selectUserStoryPriorityfilter: boolean = false;
  pageable: boolean = false;
  isFromProjects: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  employeeList: any;

  state: State = {
    skip: 0,
    take: 20,
  };

  constructor(private profileService: MyProfileService, private router: Router,
    private cdRef: ChangeDetectorRef, private store: Store<State>,
    private hrdashboardservice: HrDashboardService, private toaster: ToastrService,
    private teamLeadsService: TeamLeadsService,
    private dashboardService: DashboardService, public dialog: MatDialog,
    private translateService: TranslateService
  ) {
    if (this.router.url.includes('projects')) {
      this.isFromProjects = true;
    }
  }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    this.oneMonthBack();
    this.getUsers();
    this.getTeamMembers();
    this.loadProjectsList();
    this.getLineManagers();
    this.getPersistance();
    // this.getWorkItemsDetailsReport();
    this.getBoardTypes();
    this.getAllBranches();
    this.getUserStoryTypes();
    this.getAllUserStoryPriorities();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getBoardTypes() {
    this.store.dispatch(new LoadBoardTypesTriggered());
    this.boardTypes$ = this.store.pipe(select(projectReducer.getBoardTypesAll));
  }

  getUserStoryTypes() {
    var userStoryTypesModel = new UserStoryTypesModel();
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))
    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll));
  }

  getAllUserStoryPriorities() {
    var data = new BugPriorityDropDownData();
    this.dashboardService.GetAllBugPriporities(data).subscribe((response: any) => {
      if (response.success == true) {
        this.userStoryPriorities = response.data;
      }
      if (response.success == false) {
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  getAllBranches() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(assetModuleReducer.getBranchAll));
  }

  getWorkItemsDetailsReport() {
    this.isAnyOperationIsInprogress = true;
    var historicalWorkReportModel = new HistoricalWorkReportModel();
    historicalWorkReportModel.userId = this.selectedUserId;
    historicalWorkReportModel.projectId = this.projectId ? this.projectId : ((this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : null);
    // historicalWorkReportModel.projectId = (this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : this.projectId;
    historicalWorkReportModel.BranchId = this.branchId;
    historicalWorkReportModel.VerifiedBy = this.selectedVerifiedUserId;
    historicalWorkReportModel.VerifiedOn = this.verifiedDate;
    historicalWorkReportModel.IsGoalDealyed = this.isGoalInRed;
    historicalWorkReportModel.IsUserStoryDealyed = this.isWorkItemInRed;
    historicalWorkReportModel.GoalSearchText = this.searchGoalText;
    historicalWorkReportModel.UserStorySearchText = this.searchUserStoryText;
    historicalWorkReportModel.UserStoryTypeId = this.userStoryTypeId;
    historicalWorkReportModel.UserStoryPriorityId = this.userStoryPriorityId;
    historicalWorkReportModel.sortBy = this.sortBy;
    historicalWorkReportModel.sortDirectionAsc = this.sortDirection;
    historicalWorkReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
    historicalWorkReportModel.pageSize = this.state.take;

    historicalWorkReportModel.state = this.state;
    historicalWorkReportModel.columns = this.columns;
    this.persistanceObject = historicalWorkReportModel;
    this.updatePersistance();

    this.profileService.getWorkItemsDetailsReport(historicalWorkReportModel).subscribe((response: any) => {
      if (response.success == true) {
        this.historicalWork = {
          data: response.data,
          total: response.data.length > 0 ? response.data[0].totalCount : 0,
        }
        if (this.historicalWork.total > this.state.take) {
          this.pageable = true;
        }
        else {
          this.pageable = false;
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });

  }
  oneMonthBack() {
    const day = this.fromDate.getDate();
    const month = 0 + (this.fromDate.getMonth() - 0);
    const year = this.fromDate.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
    console.log(this.fromDate);
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

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.selectedUserId = null;
    this.selectedUser = null;
    this.projectId = null;
    this.branchId = null;
    this.searchGoalText = null
    this.searchUserStoryText = null
    this.verifiedDate = null
    this.selectedVerifiedUserId = null
    this.selectedVerifiedUser = null;
    this.isWorkItemInRed = false
    this.isGoalInRed = false
    this.userStoryTypeId = null;
    this.userStoryPriorityId = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.oneMonthBack();
    this.getWorkItemsDetailsReport();
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
    this.getWorkItemsDetailsReport();
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
            this.getWorkItemsDetailsReport();
          }
          else {
            this.getWorkItemsDetailsReport();
          }
        }
        else {
          this.getWorkItemsDetailsReport();
        }
      });
    }
    else {
      this.getWorkItemsDetailsReport();
    }
  }

  setPersistanceValues(data) {
    this.state = data.state;
    this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
    // this.selectedUserId = data.userId;
    this.branchId = data.BranchId;
    this.selectedVerifiedUserId = data.VerifiedBy;
    this.verifiedDate = data.VerifiedOn;
    this.isGoalInRed = data.IsGoalDealyed;
    this.isWorkItemInRed = data.IsUserStoryDealyed;
    this.searchGoalText = data.GoalSearchText;
    this.searchUserStoryText = data.UserStorySearchText;
    this.userStoryTypeId = data.UserStoryTypeId;
    this.userStoryPriorityId = data.UserStoryPriorityId;
    // this.projectId = data.projectId;
    // this.projectId = (this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : data.projectId;
    if (!this.isFromProjects)
      this.projectId = data.projectId;
    this.cdRef.detectChanges();
  }

  selectedLineManagerId(selectedLineManagerId) {
    if (selectedLineManagerId === '0') {
      this.selectLineManagerfilter = false;
      this.teamLeadId = "";
    }
    this.selectLineManagerfilter = true;
    this.teamLeadId = selectedLineManagerId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectedProjectId(selectedProjectId) {
    if (selectedProjectId === '0') {
      this.selectedProjectfilter = false;
      this.projectId = null;
    }
    this.selectedProjectfilter = true;
    this.projectId = selectedProjectId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectedBoardTypeId(boardTypeId) {
    if (boardTypeId === '0') {
      this.selectBoardTypefilter = false;
      this.boardTypeId = "";
    }
    this.selectBoardTypefilter = true;
    this.boardTypeId = boardTypeId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectedUserStoryTypeId(userStoryTypeId) {
    if (userStoryTypeId === '0') {
      this.selectUserStoryTypefilter = false;
      this.userStoryTypeId = "";
    }
    this.selectBoardTypefilter = true;
    this.userStoryTypeId = userStoryTypeId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectedUserStoryPriorityId(userStoryPriorityId) {
    if (userStoryPriorityId === '0') {
      this.selectUserStoryPriorityfilter = false;
      this.userStoryPriorityId = "";
    }
    this.selectBoardTypefilter = true;
    this.userStoryPriorityId = userStoryPriorityId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectedBranch(BranchId) {
    if (BranchId == "all") {
      this.branchId = "";
      this.searchByBranch = false;
    }
    else {
      this.branchId = BranchId;
      this.searchByBranch = true;
    }
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }


  dateVerifiedChanged(event: MatDatepickerInputEvent<Date>) {
    this.verifiedDate = event.target.value;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  searchGoal() {
    if (this.searchGoalText.trim() == '')
      this.searchByGoal = false;
    else
      if (this.searchGoalText.length > 0)
        this.searchGoalText = this.searchGoalText.trim();
    this.searchByGoal = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectUser(selecteduserId) {
    if (selecteduserId === '0') {
      this.selectedUserfilter = false;
      this.selectedUser = "";
    }
    this.selectedUserfilter = true;
    this.selectedUser = selecteduserId;
    this.selectedUserId = selecteduserId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  selectVerifiedUser(userId) {
    if (userId === '0') {
      this.selectedVerifiedUserfilter = false;
      this.selectedVerifiedUser = "";
    }
    this.selectedVerifiedUserfilter = true;
    this.selectedVerifiedUser = userId;
    this.selectedVerifiedUserId = userId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  searchUserStory() {
    if (this.searchUserStoryText.trim() == '')
      this.searchByUserStory = false;
    else
      if (this.searchUserStoryText.length > 0)
        this.searchUserStoryText = this.searchUserStoryText.trim();
    this.searchByUserStory = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getWorkItemsDetailsReport();
  }

  loadProjectsList() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.dashboardService.searchProjects(projectSearchResult).subscribe((result: any) => {
      this.projectsList = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getLineManagers() {
    let searchText = '';
    this.hrdashboardservice.getMyTeamManagers(searchText, true).subscribe((result: any) => {
      this.lineManager = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getTeamMembers() {
    this.teamLeadsService.getTeamLeadsList().subscribe((response: any) => {
      if (response.success == true) {
        this.employeeList = response.data;
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })

  }

  getUsers() {
    let searchText = '';
    this.dashboardService.getUsersDropDown(searchText).subscribe((result: any) => {
      this.UsersList = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  navigateToUserStoriesPage(event) {
    if (event.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (event.goalInactiveDateTime || event.goalParkedDateTime) {
      if (event.goalInactiveDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
      }
      else if (event.goalParkedDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
      }
    }
    else if (event.sprintInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.SPRINTARCHIVED"));
    }
    else if (event.inactiveDateTime == null && event.parkedDateTime == null) {
      if (event) {
        // if (event.sprintId) {
        //   this.closePopUp.emit(true);
        //   event.isSprintUserStory = true;
        //   this.router.navigate([
        //     "projects/sprint-workitem",
        //     event.userStoryId
        //   ]);
        // } else {
        //   this.closePopUp.emit(true);
        //   this.router.navigate([
        //     "projects/workitem",
        //     event.userStoryId
        //   ]);
        // }
        let dialogId = "unique-userstory-dialog-work-item";
        const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
          height: "90vh",
          width: "70%",
          direction: 'ltr',
          id: dialogId,
          data: { userStory: { isSprintUserStory: event.sprintId ? true : false, userStoryId: event.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: event.sprintId ? true : false },
          disableClose: true,
          panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result.redirection) {
            this.closePopUp.emit(true);
          }
          if (result.success == 'yes') {
            this.getWorkItemsDetailsReport();
          }
        });

      }
    }
    else if (event.inactiveDateTime) {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsArchived));
    }
    else if (event.parkedDateTime) {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsParked));
    }
  }

  navigateToGoalDetailsPage(goal) {
    if (goal.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (goal.goalParkedDateTime == null && goal.goalInactiveDateTime == null) {
      this.closePopUp.emit(true);
      this.router.navigate([
        "projects/goal",
        goal.goalId
      ]);
    }
    else if (goal.goalParkedDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
    }
    else if (goal.goalInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
    }
  }

  navigateToProjectDetailsPage(project) {
    if (project.projectInactiveDateTime == null) {
      this.closePopUp.emit(true);
      this.router.navigate([
        "projects/projectstatus/" + project.projectId + "/active-goals"
      ]);
    }
    else if (project.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
  }

  navigateToSprintDetailsPage(sprint) {
    this.closePopUp.emit(true);
    this.router.navigate([
      "projects/sprint",
      sprint.sprintId
    ]);
  }

  navigateToUserProfile(userid) {
    this.closePopUp.emit(true);
    this.router.navigate(["dashboard/profile", userid, "overview"]);
  }
}