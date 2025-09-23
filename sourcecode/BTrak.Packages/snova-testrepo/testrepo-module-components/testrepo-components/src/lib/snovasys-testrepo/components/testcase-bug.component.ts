import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { State } from '../store/reducers/index';
import * as testRailModuleReducer from "../store/reducers/index";
import * as _ from 'underscore';
import { LoadTestRunUsersListTriggered, TestRunUsersActionTypes } from '../store/actions/testrunusers.actions';
import { SprintService } from '../services/sprints.service';
import { GoalModel } from '../models/GoalModel';
import { UserstoryTypeModel } from '../models/user-story-type-model';
import { ProjectFeature } from '../models/projectFeature';
import { BugPriorityDropDownData } from '../models/bugPriorityDropDown';
import { TestCaseDropdownList } from '../models/testcasedropdown';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SprintModel } from '../models/sprints-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { GoalSearchCriteriaApiInputModel } from '../models/goalSearchInput';
import { ConstantVariables } from '../constants/constant-variables';
import { UserStory } from '../models/userStory';
import { TestRailService } from '../services/testrail.service';
import { ToastrService } from 'ngx-toastr';
import { MatChipInputEvent } from '@angular/material/chips';
import { CustomTagsModel } from '../models/custom-tags-model';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
@Component({
    selector: 'testcase-scenario-bug',
    templateUrl: 'testcase-bug.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCaseScenarioBugComponent {
    @Output() closeBug = new EventEmitter<any>();

    @Input("isBugFromTestRail")
    set _isBugFromTestRail(data: boolean) {
        if (data || data == false)
            this.isBugFromTestRail = data;
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
        this.loadGoals();
    }
    @ViewChild('tagInput') tagInput: ElementRef;
    goalsList: GoalModel[] = [];
    userStoryTypes: UserstoryTypeModel[];
    projectFeatures: ProjectFeature[];
    bugPriorities: BugPriorityDropDownData[];
    usersList$: Observable<TestCaseDropdownList[]>;
    softLabels: SoftLabelConfigurationModel[];
    customTagsModel: CustomTagsModel[];
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
    validationMessage: string;
    bugBoardId: string = "true";
    bugFormDisabled: boolean = false;
    isSprintUserStories: boolean;
    isBugFromTestRail: boolean = false;
    isBugFromUserStory: boolean = false;
    addOnBlur = true;
    removable = true;
    visible: boolean = true;
    selectable: boolean = true;
    count: number;
    isLoading: boolean;
    tag: string;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(private store: Store<State>, private actionUpdates$: Actions, private testRailService: TestRailService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private sprintsService: SprintService) {
        this.searchUserStoryTypes();
        this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));

        // this.actionUpdates$
        //     .pipe(
        //         takeUntil(this.ngDestroyed$),
        //         ofType(UserStoryActionTypes.CreateBugForTestCaseStatusCompleted),
        //         tap(() => {
        //             this.bugFormDisabled = false;
        //             this.closeBug.emit('yes');
        //             this.initializeBugForm();
        //             this.cdRef.markForCheck();
        //         })
        //     ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestRunUsersActionTypes.LoadTestRunUsersListCompleted),
                tap(() => {
                    this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
                    this.usersList$.subscribe(result => {
                        this.usersList = result;
                        // this.getAssigneeValue(this.userStoryData.ownerUserId);
                        this.cdRef.markForCheck();
                    });
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
        // this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
        // this.store.dispatch(new LoadBugPriorityTypesTriggered());
        this.store.dispatch(new LoadTestRunUsersListTriggered(projectId));
        this.loadFeatureProjects(projectFeature);
        this.loadBugPriorities();
    }

    loadFeatureProjects(projectFeature) {
        this.sprintsService.GetAllProjectFeatures(projectFeature).subscribe((response: any) => {
            this.projectFeatures = response.data;
            this.cdRef.detectChanges();
        })
    }

    loadBugPriorities() {
        let model = new BugPriorityDropDownData();
        model.isArchived = false;
        this.sprintsService.GetAllBugPriporities(model).subscribe((response: any) => {
            this.bugPriorities = response.data;
            this.cdRef.detectChanges();
        })
    }

    loadGoals() {
        let searchGoals = new GoalSearchCriteriaApiInputModel();
        searchGoals.projectId = this.projectId;
        searchGoals.goalStatusId = ConstantVariables.ActiveGoalStatusId;
        this.sprintsService.searchGoals(searchGoals).subscribe((response: any) => {
            this.goalsList = response.data;
            this.cdRef.detectChanges();
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
        userStoryDetails.projectId = this.projectId;
        userStoryDetails.bugCausedUserId = userStoryDetails.ownerUserId;
        if (this.caseData != undefined && this.caseData.length > 0) {
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
        userStoryDetails.tag = this.userStoryInputTags.toString();
        // this.store.dispatch(new CreateBugForTestCaseStatusTriggered(userStoryDetails));
        this.testRailService.UpsertUserStory(userStoryDetails).subscribe((result: any) => {
            if (result.success) {
                this.bugFormDisabled = false;
                this.userStoryInputTags = [];
                this.closeBug.emit('yes');
                this.initializeBugForm();
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.bugFormDisabled = false;
                this.cdRef.markForCheck();
            }
        })
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    closeUserStoryDialog() {
        this.closeBug.emit('no');
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
            sprintEstimatedTime: new FormControl("", [])
        });
    }

    saveEstimatedTime(estimatedTime) {
        if (estimatedTime > 99) {
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
        this.sprintsService.SearchUserStoryTypes(userStoryTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.userStoryTypes = response.data;
            }
        });
    }

    removeProjectTags(tag) {
        const index = this.userStoryInputTags.indexOf(tag);
        if (index >= 0) {
            this.userStoryInputTags.splice(index, 1);

        }
        if (this.userStoryInputTags.length === 0) {
            this.count = 1;
        }
      
    }

    disabledButton(enteredText, tags) {
        if (enteredText === "Space") {
            this.count = 0;
            this.cdRef.detectChanges();
        } else {
            if (((enteredText === "Enter" || enteredText === "Comma") && tags)) {
                this.count = 1;
            } else {
                this.isLoading = true;
               this.sprintsService.searchCustomTags(enteredText).subscribe((x: any) => {
                this.isLoading = false;
                   this.customTagsModel = x.data;
                   this.cdRef.detectChanges();
               })
                if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                    this.count = 0;
                } else {
                    this.count = 1;
                }
            }
        }
    }

    addUserStoryTags(event: MatChipInputEvent) {
        if (event.value.trim()) {
            const inputTags = event.input;
            const userStoryTags = event.value.trim();
            if (userStoryTags) {
                this.userStoryInputTags.push(userStoryTags);
                this.count++;
            } else {
                this.count = 0;
            }
            if (inputTags) {
                inputTags.value = " ";
            }
        } else {
            this.count = 0;
        }

    }

    selectedTagValue(event) {
        this.userStoryInputTags.push(event.option.value);
        this.tagInput.nativeElement.value = '';
        this.count = 1;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}




