import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import * as _ from 'underscore';
import { take, takeUntil, tap } from "rxjs/operators";

import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { LoadMemberProjectsTriggered } from "../../store/actions/project-members.actions";
import { CreateUserStoryTriggered, UserStoryActionTypes, GetUserStorySubTasksTriggered } from "../../store/actions/userStory.actions";
import { LoadUserStoryTypesTriggered } from "../../store/actions/user-story-types.action";

import { WorkflowStatus } from "../../models/workflowStatus";
import { ProjectMember } from "../../models/projectMember";
import { UserStory } from "../../models/userStory";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UpsertSprintWorkItemTriggered, SprintWorkItemActionTypes, GetSprintWorkItemSubTasksTriggered } from "../../store/actions/sprint-userstories.action";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { DatePipe } from "@angular/common";


@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-create-userstory-subtask",
    templateUrl: "userstory-subtask.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStorySubTaskComponent implements OnInit {
    @Input("userStory")
    set _userStory(data: UserStory) {
        this.userStory = data;
        this.isDateTimeConfiguration = data.isDateTimeConfiguration;
    }
    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }
    @Input("isUniquePage")
    set _isUniquePage(data: boolean) {
        this.isUniquePage = data;
    }

    @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
    @Output() closeDetailComponent = new EventEmitter<string>();
    projectMembers$: Observable<ProjectMember[]>;
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    workflowStatus: WorkflowStatus[];
    projectMembers: ProjectMember[];
    subTask: UserStory;
    userStory: UserStory;
    subTaskForm: FormGroup;
    selectedMember: string;
    estimatedTime: any;
    isDateTimeConfiguration: boolean;
    isUniquePage: boolean;
    isButtonDisabled: boolean;
    isValidation: boolean;
    isSprintUserStories: boolean;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private actionUpdates$: Actions,
        private datePipe: DatePipe) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateUserStoryCompleted),
                tap(() => {
                    this.closeDetailComponent.emit('');
                    this.clearsubTaskForm();
                    this.formGroupDirective.resetForm();
                    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
                    userStorySearchCriteria.parentUserStoryId = this.userStory.userStoryId;
                    userStorySearchCriteria.isForUserStoryoverview = true;
                    userStorySearchCriteria.isUserStoryArchived = false;
                    userStorySearchCriteria.isUserStoryParked = false;
                    userStorySearchCriteria.goalId = this.userStory.goalId;
                    this.store.dispatch(new GetUserStorySubTasksTriggered(userStorySearchCriteria));
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted),
                tap(() => {
                    this.closeDetailComponent.emit('');
                    this.clearsubTaskForm();
                    this.formGroupDirective.resetForm();
                    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
                    userStorySearchCriteria.parentUserStoryId = this.userStory.userStoryId;
                    userStorySearchCriteria.sprintId = this.userStory.sprintId;
                    userStorySearchCriteria.isForUserStoryoverview = true;
                    userStorySearchCriteria.isUserStoryArchived = false;
                    userStorySearchCriteria.isUserStoryParked = false;
                    this.store.dispatch(new GetSprintWorkItemSubTasksTriggered(userStorySearchCriteria));
                })
            )
            .subscribe();
        this.clearsubTaskForm();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
        this.projectMembers$ = this.store.pipe(
            select(projectModuleReducers.getProjectMembersAll)
        );
        this.projectMembers$
            .subscribe(s => (this.projectMembers = s));

        this.anyOperationInProgress$ = this.store.pipe(
            select(projectModuleReducers.createUserStoryLoading)
        );

        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));

    }

    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
    }

    clearsubTaskForm() {
        this.estimatedTime = null;
        this.subTaskForm = new FormGroup({
            userStoryName: new FormControl("", Validators.compose([
                Validators.required,
                Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)
                // TODO: Shift this to constants
            ])),
            estimatedTime: new FormControl("", []),
            deadLineDate: new FormControl(""),
            ownerUserId: new FormControl("", []),
            userStoryTypeId: new FormControl("", Validators.compose([
                Validators.required
            ])),
            sprintEstimatedTime: new FormControl("", [])
        })
    }

    saveSprintEstimatedTime(estimatedTime) {
        if (estimatedTime > 99) {
            this.isValidation = true;
        } else {
            this.isValidation = false;
        }
    }


    getAssigneeValue(selectedEvent) {
        var projectMembers = this.projectMembers;
        var filteredList = _.find(projectMembers, function (member) {
            return member.projectMember.id == selectedEvent;
        })
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
        }
    }

    changeEstimatedTime(estimatedTime) {
        if (estimatedTime === 'null') {
            this.estimatedTime = null;
            this.isButtonDisabled = true;
        }
        else {
            this.estimatedTime = estimatedTime;
            this.isButtonDisabled = false;
        }
        this.subTaskForm.controls['estimatedTime'].setValue(this.estimatedTime);
    }


    saveUserStorySubTask() {
        this.subTask = this.subTaskForm.value;
        this.subTask.parentUserStoryId = this.userStory.userStoryId;
        this.subTask.goalId = this.userStory.goalId;
        this.subTask.sprintId = this.userStory.sprintId;
        if(this.isDateTimeConfiguration){
          this.subTask.deadLine = this.covertTimeIntoUtcTime(this.subTask.deadLineDate);
        }
        else{
        this.subTask.deadLine = this.covertTimeIntoUtcTimes(this.subTask.deadLineDate);
        }
        this.subTask.timeZoneOffSet = (-(new Date(this.subTask.deadLineDate).getTimezoneOffset()));
        this.subTask.isUniqueDetailsPage = true;
        if (this.isSprintUserStories) {
            this.store.dispatch(new UpsertSprintWorkItemTriggered(this.subTask));
        } else {
            this.store.dispatch(new CreateUserStoryTriggered(this.subTask));
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    resetSubTaskForm() {
        this.estimatedTime = null;
        this.subTaskForm.reset();
        this.clearsubTaskForm();
        this.closeDetailComponent.emit('');
    }
    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
          return null;
    
        return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
      }
      covertTimeIntoUtcTimes(inputTime): string {
        if (inputTime == null || inputTime == "")
          return null;
    
        return this.datePipe.transform(inputTime, "yyyy-MM-dd")
      }
}  