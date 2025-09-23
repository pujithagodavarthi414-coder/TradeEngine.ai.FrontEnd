// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line: ordered-imports
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
// tslint:disable-next-line: ordered-imports
import { CreateMultipleUserStoriesSplitTriggered, GetUserStorySubTasksTriggered, UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { MatInput } from "@angular/material/input";
import { SprintWorkItemActionTypes, UpsertMultipleSprintWorkItemTriggered } from "../../store/actions/sprint-userstories.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-create-userstory",
    templateUrl: "create-user-story.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserStoryComponent implements OnInit {
    @Input("goalId")
    set _goalId(data: string) {
        this.goalId = data;
        this.errorMessage = false;

    }
    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }
    @Input("goalReplanId")
    set _goalReplanId(data: string) {
        this.goalReplanId = data;
    }
    @Input("isBugBoard")
    set _isBugBoard(data: boolean) {
        this.isBugBoard = data;
    }
    @Input("sprintId")
    set _sprintId(data: string) {
        this.sprintId = data;
    }
    @Input("isBacklog")
    set _isBacklog(data: boolean) {
        this.isBacklog = data;
    }
    @Input("goalStatusId")
    set _goalStatusId(data: string) {
        this.goalStatusId = data;
        if (this.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
            this.isNewUserStoryInReplan = false;
        } else if (this.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
            this.isNewUserStoryInReplan = true;
        }
    }
    @Output() openNewUserStory = new EventEmitter<boolean>();
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    @ViewChild("txtArea") textAreaFocus: MatInput;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    addOperationInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;
    userStoryTypes: UserStoryTypesModel[];
    bugUserStoryTypeModel: UserStoryTypesModel;
    userStoryTypeModel: UserStoryTypesModel;
    goalStatusId: string;
    userStoryId: string;
    goalId: string;
    sprintId: string;
    isBacklog: boolean;
    userStoryTypeId: string;
    validationMessage: string;
    userStoryNamesList = [];
    userStoryName: string;
    isUserStoryInputVisible: boolean;
    errorMessage: boolean;
    createUserStory: FormGroup;
    isRequired: boolean;
    selectedTab: string;
    goalReplanId: string;
    isNewUserStoryInReplan: boolean;
    isBugBoard: boolean;
    public ngDestroyed$ = new Subject();
    constructor(private store: Store<State>,
        private actionUpdates$: Actions,
        public googleAnalyticsService: GoogleAnalyticsService,
        private softLabelPipe: SoftLabelPipe) {
        this.getSoftLabelConfigurations();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted),
                tap(() => {
                    this.clearForm();
                    this.userStoryNamesList = [];
                    this.userStoryName = "";
                    this.isRequired = false;
                    this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
                    this.openNewUserStory.emit(this.isUserStoryInputVisible);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemCompleted),
                tap(() => {
                    this.clearForm();
                    this.userStoryNamesList = [];
                    this.userStoryName = "";
                    this.isRequired = false;
                    if(!this.isBacklog) {
                        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
                        this.openNewUserStory.emit(this.isUserStoryInputVisible);
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.UpsertSubTaskCompleted),
                tap(() => {
                    this.clearForm();
                    this.userStoryNamesList = [];
                    this.userStoryName = "";
                    this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
                })
            )
            .subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
                tap(() => {
                    this.clearForm();
                    this.userStoryNamesList = [];
                    this.userStoryName = "";
                    this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateMultipleUserStoriesSplitFailed),
                tap(() => {
                    this.userStoryNamesList = [];
                })
            )
            .subscribe();
    }
    ngOnInit() {

        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll));
        this.addOperationInProgress$ = this.store.pipe(
            select(projectModuleReducer.createMultipleUserStoriesLoading)
        );
        this.anyOperationInProgress$ = this.store.pipe(
            select(projectModuleReducer.upsertSprintworkItemsLoading)
        );
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    clearForm() {
        this.createUserStory = new FormGroup({
            userStoryName: new FormControl("", [Validators.required])
        });
    }


    showUserstoryInput() {
        this.clearForm();
        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
        this.openNewUserStory.emit(this.isUserStoryInputVisible);
    }

    CancelUserstoryInput() {
        this.clearForm();
        this.formGroupDirective.reset();
        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
        this.openNewUserStory.emit(this.isUserStoryInputVisible);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    addUserStoryFormDisabled() {
        if (this.userStoryName) {
            return false;
        } else {
            return true;
        }
    }

    getUserStoryTypeId(event) {
        this.userStoryTypeId = event;
    }

    saveUserStory() {

        // tslint:disable-next-line: prefer-const
        let userStoryNamesList = this.createUserStory.value.userStoryName.split("\n");
        const userStoriesList = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < userStoryNamesList.length; i++) {
            const userStoryName = userStoryNamesList[i].trim();
            if (userStoryName) {
                userStoriesList.push(userStoryName);
            }
        }
        const userStory = this.createUserStory.value;
        this.userStoryName = userStoriesList.join("\n");
        // tslint:disable-next-line:prefer-const
        let userStoryModel = new UserStory();
        userStoryModel.goalId = this.goalId;
        userStoryModel.parentUserStoryId = this.userStoryId;
        userStoryModel.sprintId = this.sprintId;
        userStoryModel.isBacklog = this.isBacklog;

        let workItemLabel = this.softLabelPipe.transform("Work Item", this.softLabels);
        if (this.userStoryId) {
            this.googleAnalyticsService.eventEmitter(workItemLabel, "Updated " + workItemLabel + "", this.userStoryName, 1);

        } else {

            this.googleAnalyticsService.eventEmitter(workItemLabel, "Created " + workItemLabel + "", this.userStoryName, 1);
        }
        userStoryModel.userStoryName = this.userStoryName;
        if (!this.isNewUserStoryInReplan) {
            userStoryModel.isReplan = false;
            userStoryModel.goalReplanId = null;
        } else {
            userStoryModel.isReplan = true;
            userStoryModel.goalReplanId = this.goalReplanId
        }
        if (this.sprintId) {
            userStoryModel.isFromSprint = true;
            this.store.dispatch(
                new UpsertMultipleSprintWorkItemTriggered(
                    userStoryModel
                )
            );
        } else {
            userStoryModel.isFromSprint = false;
            this.store.dispatch(
                new CreateMultipleUserStoriesSplitTriggered(
                    userStoryModel
                )
            );
        }
    }
}
