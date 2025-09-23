import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ViewChild} from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import * as _ from 'underscore';
import { take, takeUntil, tap } from "rxjs/operators";
import * as projectModuleReducers from "../../store/reducers/index";
import { LoadUserStoryTypesTriggered } from "../../store/actions/user-story-types.action";

import { WorkflowStatus } from "../../models/workflowStatus";
import { ProjectMember } from "../../models/projectMember";
import { UserStory } from "../../models/userStory";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { WorkItemActionTypes, UpsertMultipleWorkItemTriggered } from "../../store/actions/template-userstories.action";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-create-workitem",
    templateUrl: "create-workitem.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateWorkItemComponent implements OnInit {
    @Input("templateId")
    set _templateId(data: string) {
        this.templateId = data;
    }
    @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
    @Output() openNewUserStory = new EventEmitter<boolean>();
    @Output() closeDetailComponent = new EventEmitter<string>();
    projectMembers$: Observable<ProjectMember[]>;
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    workflowStatus: WorkflowStatus[];
    projectMembers: ProjectMember[];
    isUserStoryInputVisible: boolean;
    workItem: UserStory;
    userStory: UserStory;
    projectId: string;
    templateId: string;
    createUserStory: FormGroup;
    selectedMember: string;
    estimatedTime: any;
    isButtonDisabled: boolean;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<projectModuleReducers.State>,
        private actionUpdates$: Actions) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(WorkItemActionTypes.UpsertMultipleWorkItemCompleted),
                tap(() => {
                    this.closeDetailComponent.emit('');
                    this.showUserstoryInput();
                    this.formGroupDirective.resetForm();
                })
            )
            .subscribe();
        this.clearForm();
        var userStoryTypesModel = new UserStoryTypesModel();
        userStoryTypesModel.isArchived = false;
       this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))
        this.anyOperationInProgress$ = this.store.pipe(
            select(projectModuleReducers.upsertworkItemsLoading)
        );
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));

    }

    getSoftLabelConfigurations() {
       this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    clearForm() {
        this.createUserStory = new FormGroup({
            userStoryName: new FormControl("", [Validators.required]),
            userStoryTypeId: new FormControl("")
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

    saveUserStory() {

        this.workItem = this.createUserStory.value;
        this.workItem.templateId = this.templateId;
        let userStoryNamesList = this.createUserStory.value.userStoryName.split("\n");
        const userStoriesList = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < userStoryNamesList.length; i++) {
            const userStoryName = userStoryNamesList[i].trim();
            if (userStoryName) {
                userStoriesList.push(userStoryName);
            }
        }
        this.workItem.userStoryName = userStoriesList.join("\n");
        this.workItem.isFromTemplate = true;
        this.store.dispatch(new UpsertMultipleWorkItemTriggered(this.workItem));
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    resetSubTaskForm() {
        this.createUserStory.reset();
        this.clearForm();
        this.closeDetailComponent.emit('');
    }
}  