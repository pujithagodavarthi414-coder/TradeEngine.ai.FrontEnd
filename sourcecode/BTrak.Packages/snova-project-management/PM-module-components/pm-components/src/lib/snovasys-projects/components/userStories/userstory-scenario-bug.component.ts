import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectFeature } from '../../models/projectFeature';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { UserStory } from '../../models/userStory';
import { GoalModel } from '../../models/GoalModel';
import { GoalSearchCriteriaApiInputModel } from '../../models/goalSearchInput';
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';
import { LoadBugPriorityTypesTriggered } from '../../store/actions/bug-priority.action';
import { UserStoryActionTypes, CreateBugForUserStoryTriggered, CreateBugForTestCaseStatusTriggered } from '../../store/actions/userStory.actions';
import { Search } from '../../store/actions/goal.actions';
import * as _ from 'underscore';
import { SprintModel } from '../../models/sprints-model';
import { SprintService } from '../../services/sprints.service';
import { ProjectGoalsService } from '../../services/goals.service';
import { UserstoryTypeModel } from '../../models/user-story-type-model';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { LoadTestRunUsersListTriggered, TestRunUsersActionTypes } from '../../store/actions/testrunusers.actions';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'userstory-scenario-bug',
    templateUrl: 'userstory-scenario-bug.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryScenarioBugComponent {
    @Output() closeBug = new EventEmitter<any>();
    @Input("isBugFromTestRail")
    set _isBugFromTestRail(data: boolean) {
        if (data || data == false)
            this.isBugFromTestRail = data;
    }
    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data) {
            this.userStoryData = data;
            this.initializeBugForm();
            this.userStoryScenarioBugForm.patchValue({
                ownerUserId: this.userStoryData.ownerUserId
            });
            this.projectId = this.userStoryData.projectId;
            this.loadRequiredData(this.userStoryData.projectId);
        }
    }
    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.projectId = data;
            this.loadRequiredData(this.projectId);
        }
    }
    @Input("caseData")
    set _caseData(data: any) {
        if (data) {
            this.caseData = data;
            this.initializeBugForm();
        }
    }
    @Input("isBugFromUserStory")
    set _isBugFromUserStory(data: boolean) {
        if (data || data == false)
            this.isBugFromUserStory = data;
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
        this.initializeBugForm();
        this.setValidationsForUserStoryForm();
            this.loadSprints();
            this.loadGoals();
        
    }
    @Input("isGoalsPage")
    set _isGoalsPage(data: boolean) {
        this.isGoalsPage = data;
    }
    goalsList: GoalModel[] = [];
    userStoryTypes: UserstoryTypeModel[];
    projectFeatures$: Observable<ProjectFeature[]>;
    bugPriorities$: Observable<BugPriorityDropDownData[]>;
    usersList$: Observable<TestCaseDropdownList[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    sprints: SprintModel[] = [];
    userStoryInputTags: any[] = [];
    public ngDestroyed$ = new Subject();
    userStoryScenarioBugForm: FormGroup;
    caseData: any;
    userStoryData: any;
    usersList: any;
    isValidation: boolean;
    estimatedTime: string;
    projectId: string;
    selectedMember: string;
    bugBoardId: string = "true";
    bugFormDisabled: boolean = false;
    isSprintUserStories: boolean;
    isGoalsPage: boolean;
    isBugFromTestRail: boolean = false;
    isBugFromUserStory: boolean = false;
    userStoryId: string;
    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
        private sprintsService: SprintService,private goalsService: ProjectGoalsService,  private datePipe: DatePipe, private masterDataProjectsService: MasterDataManagementService) {
        this.searchUserStoryTypes();
        this.projectFeatures$ = this.store.pipe(select(projectModuleReducer.getProjectFeaturesAll));
        this.bugPriorities$ = this.store.pipe(select(projectModuleReducer.getBugPriorityAll));
        this.usersList$ = this.store.pipe(select(projectModuleReducer.getTestRunUserAll));
        
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateBugForUserStoryCompleted),
                tap(() => {
                    this.bugFormDisabled = false;
                    this.closeBug.emit('');
                    this.initializeBugForm();
                    this.cdRef.markForCheck();
                })
            ).subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateBugForTestCaseStatusCompleted),
                tap(() => {
                    this.bugFormDisabled = false;
                    this.closeBug.emit('');
                    this.initializeBugForm();
                    this.cdRef.markForCheck();
                })
            ).subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestRunUsersActionTypes.LoadTestRunUsersListCompleted),
                tap(() => {
                    this.usersList$ = this.store.pipe(select(projectModuleReducer.getTestRunUserAll));
                    this.usersList$.subscribe(result => {
                        this.usersList = result;
                        this.getAssigneeValue(this.userStoryData.ownerUserId);
                        this.cdRef.markForCheck();
                    });
                })
             ).subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateUserStoryFailed),
                tap(() => {
                    this.bugFormDisabled = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }
    ngOnInit() {
        this.getSoftLabelConfigurations();
    }
    getSoftLabelConfigurations() {
       this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
    }
    loadRequiredData(projectId) {
        let projectFeature = new ProjectFeature();
        projectFeature.projectId = projectId;
        projectFeature.IsDelete = false;
        this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
        this.store.dispatch(new LoadBugPriorityTypesTriggered());
        this.store.dispatch(new LoadTestRunUsersListTriggered(projectId));
    }
    loadGoals() {
        let searchGoals = new GoalSearchCriteriaApiInputModel();
        searchGoals.projectId = this.projectId;
        searchGoals.goalStatusId = ConstantVariables.ActiveGoalStatusId;
        this.goalsService.searchGoals(searchGoals).subscribe((response: any) => {
            this.goalsList = response.data;
            this.cdRef.detectChanges();

        })
    }

    loadSprints() {
        var sprintsModel = new SprintModel();
        sprintsModel.isBacklog = false;
        sprintsModel.projectId = this.projectId;
        this.sprintsService.searchSprints(sprintsModel).subscribe((response: any) => {
            this.sprints = response.data;
        })

    }
    getAssigneeValue(selectedEvent) {
        let usersList = this.usersList;
        let filteredList = _.find(usersList, function (item: any) {
            return item.id == selectedEvent;
        });
        if (filteredList) {
            this.selectedMember = filteredList.value;
            this.cdRef.markForCheck();
        }
    }
    changeEstimatedTime(estimatedTime) {
        if (estimatedTime === 'null') {
            this.estimatedTime = null;
            this.bugFormDisabled = true;
            this.cdRef.markForCheck();
        }
        else {
            this.estimatedTime = estimatedTime;
            this.bugFormDisabled = false;
            this.cdRef.markForCheck();
        }
        this.userStoryScenarioBugForm.controls['estimatedTime'].setValue(this.estimatedTime);
    }
    addBugToUserStory() {
        this.bugFormDisabled = true;
        let userStoryDetails = new UserStory();
        var selectUserStoryType = this.userStoryTypes.find(x => x.isBug == true);
        userStoryDetails = this.userStoryScenarioBugForm.value;
        userStoryDetails.deadLineDate =userStoryDetails.deadLineDate;
         userStoryDetails.deadLine =this.covertTimeIntoUtcTime(userStoryDetails.deadLineDate);
       userStoryDetails.timeZoneOffSet = (-(new Date(userStoryDetails.deadLineDate).getTimezoneOffset()));
        userStoryDetails.projectId = this.projectId;
        if (!this.isBugFromTestRail) {
            userStoryDetails.goalIdForBug = this.userStoryData.goalId;
            userStoryDetails.parentUserStoryId =  this.userStoryData.userStoryId;
            userStoryDetails.bugCausedUserId = this.userStoryData.ownerUserId;
            userStoryDetails.isChildUserStory = this.userStoryData.parentUserStoryId;
        }
        else
            userStoryDetails.bugCausedUserId = userStoryDetails.ownerUserId;
        if (this.caseData !=undefined && this.caseData.length > 0) {
            userStoryDetails.testCaseId = this.isBugFromUserStory ? null : this.caseData[0].testCaseId;
            userStoryDetails.testRunId = this.isBugFromUserStory ? null : this.caseData[0].testRunId;
        } else {
            userStoryDetails.testCaseId = this.isBugFromUserStory ? null : this.caseData.testCaseId;
            userStoryDetails.testRunId = this.isBugFromUserStory ? null : this.caseData.testRunId;
        }
        userStoryDetails.userStoryTypeId = selectUserStoryType.userStoryTypeId;
        userStoryDetails.estimatedTime = Number(this.estimatedTime);
        userStoryDetails.isFromSprint = this.isSprintUserStories;
        userStoryDetails.isFromBugs = true;
        userStoryDetails.isGoalsPage = this.isGoalsPage;
        userStoryDetails.tag = this.userStoryInputTags.toString();
        if (!this.isBugFromTestRail)
            this.store.dispatch(new CreateBugForUserStoryTriggered(userStoryDetails));
        else
            this.store.dispatch(new CreateBugForTestCaseStatusTriggered(userStoryDetails));
    }
    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }
    closeUserStoryDialog() {
        this.closeBug.emit('');
    }
    initializeBugForm() {
        this.selectedMember = null;
        this.userStoryScenarioBugForm = new FormGroup({
            userStoryName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)])),
            estimatedTime: new FormControl("", []),
            versionName: new FormControl("", []),
            deadLineDate: new FormControl(""),
            ownerUserId: new FormControl("", Validators.compose([Validators.required])),
            goalId: new FormControl("", []),
            bugPriorityId: new FormControl("", Validators.compose([Validators.required])),
            projectFeatureId: new FormControl("", []),
            isForQa: new FormControl(false, []),
            sprintId: new FormControl("", []),
            sprintEstimatedTime: new FormControl("",[])
        });
    }
    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
          return null;
    
        // var dateNow = new Date(inputTime);
        // var timeSplit = inputTime.toString().split(":");
        // dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
        return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
      }
    saveEstimatedTime(estimatedTime) {
        if(estimatedTime > 99) {
            this.isValidation = true;
        } else {
            this.isValidation = false;
        }
    }

    setValidationsForUserStoryForm() {
        if (this.isSprintUserStories) {
            this.userStoryScenarioBugForm.controls["goalId"].clearValidators();
            this.userStoryScenarioBugForm.get("goalId").updateValueAndValidity();
            this.userStoryScenarioBugForm.controls["sprintId"].setValidators([
                Validators.required
            ]);
            this.userStoryScenarioBugForm.get("sprintId").updateValueAndValidity();

        } else {
            this.userStoryScenarioBugForm.controls["sprintId"].clearValidators();
            this.userStoryScenarioBugForm.get("sprintId").updateValueAndValidity();
            this.userStoryScenarioBugForm.controls["goalId"].setValidators([
                Validators.required
            ]);
            this.userStoryScenarioBugForm.get("goalId").updateValueAndValidity();
        }
    }
    searchUserStoryTypes() {
        var userStoryTypeModel = new UserstoryTypeModel();
        userStoryTypeModel.isArchived = false;
        this.masterDataProjectsService.SearchUserStoryTypes(userStoryTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userStoryTypes = response.data;
             }
         });
    }

    saveUserStoryTags(event) {
        this.userStoryInputTags = event;
      }
    
    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}




