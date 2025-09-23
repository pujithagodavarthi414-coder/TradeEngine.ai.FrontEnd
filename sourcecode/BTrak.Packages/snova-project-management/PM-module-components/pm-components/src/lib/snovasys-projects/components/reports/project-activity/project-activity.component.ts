
import { Component, ChangeDetectorRef, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import {State} from "../../../store/reducers/index"
import { UserStory } from '../../../models/userStory';
import { SprintModel } from '../../../models/sprints-model';
import { GoalLevelReportsService } from '../../../services/reports.service';
import { AssigneefilterPipe } from '../../../pipes/assigneeFilter.pipes';
import { SelectedGoalActivityModel } from '../../../models/selectedGoalActivityModel';
import { DashboardFilterModel } from '../../../models/dashboardFilterModel';
import { LoadMemberProjectsTriggered } from '../../../store/actions/project-members.actions';
import * as projectModuleReducer from "../../../store/reducers/index";
import { EmployeeListModel } from '../../../models/employee-model';
import { ProjectService } from '../../../services/projects.service';

import {SoftLabelConfigurationModel} from "../../../../globaldependencies/models/softlabels-models";
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
@Component({
    selector: "app-pm-page-projectstatus",
    templateUrl: "project-activity.component.html"
})
export class ProjectActivityComponent {
    validationMessage: string;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
            this.selectedEmployeeId = this.dashboardFilters.userId;
            this.sprintId = this.dashboardFilters.sprintId;
            this.goalId = this.dashboardFilters.goalId;
            this.projectId = this.dashboardFilters.projectId;
            if (this.projectId) {
                this.getAllProjectEmployees(this.projectId);
            }
            else {
                this.getAllEmployees();
            }
            this.getProjectAcTivity();
        }
    }

    dashboardFilters: DashboardFilterModel;
    projectId: string;
    selectedEmployeeId: string;
    sprintId: string;
    data: any[];
    isIncludeUserStory: boolean = false;
    isIncludeLogTime: boolean = false;
    isAnyOperationIsInprogress: boolean;
    goalId: string;
    selectEmployeeFilterIsActive: boolean = false;
    filteredUserStories: UserStory[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    sprint: SprintModel;
    isOpen: boolean = false;
    ownerName: string;
    employeeName: string;
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: any;
    employeeList$: Observable<any[]>;
    employeeList: any[];
    userStories$: Observable<UserStory[]>;
    userStories: UserStory[];
    isAnyOperationInProgress = false;
    constructor(private reportsService: GoalLevelReportsService, private toaster: ToastrService, private cdRef: ChangeDetectorRef,
        private assigneeFilterPipe: AssigneefilterPipe, private store: Store<State>, private projectService: ProjectService) {

    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
       this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
    getFilteredAssetComments(event) {

    }

    getProjectAcTivity() {
        this.isAnyOperationIsInprogress = true;
        var selectedSprintActivity = new SelectedGoalActivityModel();
        selectedSprintActivity.sprintId = this.sprintId;
        selectedSprintActivity.goalId = this.goalId;
        selectedSprintActivity.projectId = this.projectId;
        selectedSprintActivity.isIncludeLogTime = this.isIncludeLogTime;
        selectedSprintActivity.isIncludeUserStoryView = this.isIncludeUserStory;
        selectedSprintActivity.userId = this.selectedEmployeeId;
        this.reportsService.getSelectedSprintActivity(selectedSprintActivity).subscribe((response: any) => {
            if (response.success == true) {
                this.data = response.data;
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

    profilePage(event) {
        
    }

    getAllEmployees() {
        this.employeeList = [];
        var employeeSearchResult = new EmployeeListModel();
        employeeSearchResult.isArchived = false;
        employeeSearchResult.sortDirectionAsc = true;
        this.projectService.getAllEmployees(employeeSearchResult).subscribe((x: any)=> {
            this.employeeList = x;
        })
        if (this.employeeList) {
            this.filter();
        }
    }

    getAllProjectEmployees(p) {
        this.employeeList = [];
        this.store.dispatch(new LoadMemberProjectsTriggered(p));
        this.employeeList$ = this.store.pipe(select(projectModuleReducer.getProjectMembersAll));
        this.employeeList$.subscribe((x) => {
            this.employeeList = x;
        })
        if (this.employeeList) {
            this.filter();
        }
    }

    filter() {
        this.employeeList = this.employeeList;
    }
    resetAllFilters() {
        this.selectedEmployeeId = '';
        this.selectEmployeeFilterIsActive = false;
        this.isIncludeUserStory = false;
        this.isIncludeLogTime = false;
        this.getProjectAcTivity();
    }

    selectedEmployeesId(employeeId) {
        if (employeeId == "all") {
            this.selectedEmployeeId = "";
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
        this.getProjectAcTivity();
    }

    clearViewFilter() {
        this.isIncludeUserStory = false;
        this.getProjectAcTivity();
    }

    clearLogTimeFilter() {
        this.isIncludeLogTime = false;
        this.getProjectAcTivity();
    }

    getSprintAcTivity(){

    }

    filterClick() {

    }
}