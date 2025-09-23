import { Component, ChangeDetectorRef, Input, ViewChild, ChangeDetectionStrategy, Output, EventEmitter } from "@angular/core";
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
import { SprintModel } from "../../models/sprints-model";
import { AssigneefilterPipe } from "../../pipes/assigneeFilter.pipes";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';
import { GetSprintWorkItemTriggered } from '../../store/actions/sprint-userstories.action';
const $ = $_;

@Component({
    selector: "app-pm-component-selected-sprint-activity",
    templateUrl: "selected-sprint-activity.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class SelectedSprintActivityComponent {
    @Output() closePopUp = new EventEmitter<any>();

    @ViewChild('namePopover') namePopover: SatPopover;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.selectedEmployeeId = null;
            this.sprintId = this.dashboardFilters.sprintId;
            this.projectId = this.dashboardFilters.projectId;
            this.getSprintAcTivity();
            this.getAllEmployees();
            this.getSprintWorkItems();
            if (this.dashboardFilters.userId) {
                this.selectedEmployeesIdFind(this.dashboardFilters.userId);
            }
        }
    }

    dashboardFilters: DashboardFilterModel;
    filteredUserStories: UserStory[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    companySettingsModel$: Observable<any[]>;
    data: any;
    totalCount: number;
    isAnyOperationIsInprogress: boolean = false;
    validationMessage: string;
    sprint: SprintModel;
    sprintId: string;
    projectId: string;
    isOpen: boolean = false;
    ownerName: string;
    employeeName: string;
    selectedEmployeeId: string;
    selectEmployeeFilterIsActive: boolean = false;
    employeeList$: Observable<any[]>;
    isIncludeUserStory: boolean = false;
    isIncludeLogTime: boolean = false;
    userStories$: Observable<UserStory[]>;
    userStories: UserStory[];
    isSprintsEnable: boolean;
    companySettingsIsInProgress: boolean;
    pageSize: number = 25;
    pageNumber: number = 1;
    pageIndex: number;
    pageSizeOptions: number[] = [20, 25, 50, 100, 150, 200];

    constructor(private reportsService: GoalLevelReportsService, private toaster: ToastrService, private router: Router, private cdRef: ChangeDetectorRef, private store: Store<State>, private assigneeFilterPipe: AssigneefilterPipe) {
        this.getSoftLabels();
        this.getCompanySettings();
    }

    ngOnInit() {
        this.selectedEmployeeId = null;
        this.getSoftLabels();
        if (!this.dashboardFilters && !this.sprintId)
            this.getSprintAcTivity();
        this.getCompanySettings();
    }

    getCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel.length > 0) {
            let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
            if (sprintResult.length > 0) {
                this.isSprintsEnable = sprintResult[0].value == "1" ? true : false;
            }
        }
    }

    getSprintWorkItems() {
        this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getSprintWorkItemsAll));
        this.userStories$.subscribe(x => this.userStories = x);
        if(this.userStories.length == 0) {
            var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
            userStorySearchCriteriaModel.sprintId = this.sprintId;
            userStorySearchCriteriaModel.pageSize = 1;
            userStorySearchCriteriaModel.pageNumber = 1000;
            userStorySearchCriteriaModel.isArchived = false;
            userStorySearchCriteriaModel.isParked = false;
            this.store.dispatch(new GetSprintWorkItemTriggered(userStorySearchCriteriaModel));
        }
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getSprintAcTivity() {
         if (this.sprintId == null) {
             return;
         }
        this.isAnyOperationIsInprogress = true;
        var selectedSprintActivity = new SelectedGoalActivityModel();
        selectedSprintActivity.sprintId = this.sprintId;
        selectedSprintActivity.projectId = this.projectId;
        selectedSprintActivity.isIncludeLogTime = this.isIncludeLogTime;
        selectedSprintActivity.isIncludeUserStoryView = this.isIncludeUserStory;
        selectedSprintActivity.userId = this.selectedEmployeeId;
        selectedSprintActivity.pageNumber = this.pageNumber;
        selectedSprintActivity.pageSize = this.pageSize;
        this.reportsService.getSelectedSprintActivity(selectedSprintActivity).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
                if(this.data && this.data.length > 0) {
                    this.totalCount = this.data[0].totalCount;
                } else {
                    this.totalCount = 0;
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toaster.error(this.validationMessage);
            }

        }
        )
    }

    selectedEmployeesIdFind(employeeId) {
        this.filteredUserStories = this.assigneeFilterPipe.transform(this.userStories, "ownerName", this.userStories);
        let filteredUserStories = this.filteredUserStories;
        this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        this.selectedEmployeeId = employeeId;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.getSprintAcTivity();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.selectedEmployeeId = null;
        this.employeeName = null;
        this.selectEmployeeFilterIsActive = false;
        this.isIncludeUserStory = false;
        this.isIncludeLogTime = false;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.getSprintAcTivity();
    }

    getAllEmployees() {
        if (this.projectId) {
            this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
            this.employeeList$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
        }
    }

    selectedEmployeesId(employeeId) {
        if (employeeId == "all") {
            this.selectedEmployeeId = null;
            this.selectEmployeeFilterIsActive = false;
            this.employeeName = "";
        }
        else {
            this.selectedEmployeeId = employeeId;
            this.selectEmployeeFilterIsActive = true;
            this.filteredUserStories = this.assigneeFilterPipe.transform(this.userStories, "ownerName", this.userStories);
            let filteredUserStories = this.filteredUserStories;
            this.employeeName = filteredUserStories.find(x => x.ownerUserId == employeeId).ownerName;
        }
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.getSprintAcTivity();
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
        this.getSprintAcTivity();
      }

    clearViewFilter() {
        this.isIncludeUserStory = false;
        this.getSprintAcTivity();
    }

    clearLogTimeFilter() {
        this.isIncludeLogTime = false;
        this.getSprintAcTivity();
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.router.navigateByUrl('/projects');
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

}