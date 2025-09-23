import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit,  Output} from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line:ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line:ordered-imports
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line:ordered-imports
import { ToastrService } from "ngx-toastr";
// tslint:disable-next-line:ordered-imports
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:ordered-imports
import { User } from "../../models/user";
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line:ordered-imports
import { WorkflowStatus } from "../../models/workflowStatus";
import { LoadUserstoryHistoryTriggered } from "../../store/actions/userstory-history.action";
import { LoadworkflowStatusTriggered } from "../../store/actions/work-flow-status.action";
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { GetAdhocUsersTriggered } from "../../store/actions/adhoc-users.action";
// tslint:disable-next-line:ordered-imports
import { AdhocWorkActionTypes, AdhocWorkStatusChangedTriggered, CreateAdhocWorkTriggered } from "../../store/actions/adhoc-work.action";
import { State } from "../../store/reducers/index";
import * as dashboardModuleReducers from "../../store/reducers/index";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-inline-editing-adhoc-userstory-component",
    templateUrl: "inline-edit-adhoc-userstory.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditAdhocUserStoryComponent extends CustomAppBaseComponent implements OnInit {
    userStory;
    @Input("userStory")
    set _userStory(data: UserStory) {
        this.userStory = data;
        this.deadlineDate = this.userStory.deadLineDate;
        this.estimatedTime = this.userStory.estimatedTime;
        this.estimatedTimeSet = this.estimatedTime;
        this.userStoryStatusId = this.userStory.userStoryStatusId;
        this.ownerUserId = this.userStory.ownerUserId;
        this.workFlowId = this.userStory.workFlowId;
    }

    isInlineEditForUserStoryStatus;
    @Input("isInlineEditForUserStoryStatus")
    set _isInlineEditForUserStoryStatus(data: boolean) {
        this.isInlineEditForUserStoryStatus = data;
        if (data) {
            const workflowStatus = new WorkflowStatus();
            workflowStatus.workFlowId = this.workFlowId;
            if (workflowStatus.workFlowId !== undefined) {
                this.workflowStatus$ = this.store.pipe(
                    select(dashboardModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
                );
                this.workflowStatus$
                    .subscribe((s) => (this.workflowStatus = s));
                if (this.workflowStatus.length <= 0) {
                    this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
                }
            }

        }
    }

    isInlineEditForUserStoryOwner;
    @Input("isInlineEditForUserStoryOwner")
    set _isInlineEditForUserStoryOwner(data: boolean) {
        this.isInlineEditForUserStoryOwner = data;
        if (data) {
            this.store.dispatch(
                new GetAdhocUsersTriggered("", false)
            );
        }

    }

    @Input("isIncludeCompletedUserStories")
    set _isIncludeCompletedUserStories(data: boolean) {
        this.isIncludeCompletedUserStories = data;
    }

    @Input("isEditFromProjects")
    set _isEditFromProjects(data: boolean) {
        if (data === false) {
            this.isEditFromProjects = false;
        } else {
            this.isEditFromProjects = true;
        }
    }

    @Input() isInlineEdit: boolean;
    @Input() isInlineEditForEstimatedTime: boolean;
    @Output() completeUserStory = new EventEmitter<string>();
    @Output() stopLoader = new EventEmitter<string>();
    @Output() workItemsLoader = new EventEmitter<string>();

    anyOperationInProgress$: Observable<boolean>;
    allUsers$: Observable<User[]>;
    userStory$: Observable<UserStory>;
    workflowStatus$: Observable<WorkflowStatus[]>;
    softLabels: SoftLabelConfigurationModel[]
    workflowStatus: WorkflowStatus[];
    isUserStoryStatus: boolean;
    deadlineDate: Date;
    estimatedTime: string;
    estimatedTimeSet: string;
    workFlowId: string;
    userStoryStatusId: string;
    ownerUserId: string;
    public ngDestroyed$ = new Subject();
    isAdhocStatusUpdate: boolean;
    isIncludeCompletedUserStories: boolean;
    isEditFromProjects = true;
    taskStatusId: string;
    selectedStatusId: string;
    validationMessage: string;
    taskStatusOrder: number;

    constructor(
                private store: Store<State>,
                private actionUpdates$: Actions,
                private adhocWorkService: AdhocWorkService,
                private toastr: ToastrService
    ) {

        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.CreateAdhocWorkCompleted),
                tap(() => {
                    this.completeUserStory.emit("");
                    this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStory.userStoryId));
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.UpdateAdhocUserStories),
                tap(() => {
                    this.userStory$ = this.store.pipe(select(dashboardModuleReducers.getUserStoryById));
                    this.userStory$.subscribe((x) => this.userStory = x);
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.anyOperationInProgress$ = this.store.pipe(
            select(dashboardModuleReducers.createAdhocUserStoryLoading)
        );
        this.allUsers$ = this.store.pipe(
            select(dashboardModuleReducers.getUserAll)
        );
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    changeDeadline() {
        this.saveUserStory();
    }

    changeEstimatedTime(estimatedTime) {
        if (estimatedTime === "null") {
            this.estimatedTimeSet = null;
        } else {
            this.estimatedTimeSet = estimatedTime;
        }
        if (this.estimatedTimeSet != null) {
            this.estimatedTime = estimatedTime;
            this.saveUserStory();
        }
    }

    getUserStoryStatusChange(event) {
        this.userStoryStatusId = event.value;
        this.isAdhocStatusUpdate = true;
        if (this.workflowStatus.length > 0) {
            this.taskStatusOrder = this.workflowStatus[0].maxOrder;
        }
        const selectedStatus = this.workflowStatus.find((x) => x.orderId === this.taskStatusOrder);
        this.selectedStatusId = selectedStatus.userStoryStatusId;

        const selectedStatusId = this.workflowStatus.find((x) => x.userStoryStatusId === this.userStoryStatusId);
        this.taskStatusId = selectedStatusId.taskStatusId;
        this.saveUserStory();

    }

    changeAssignee(event) {
        this.isAdhocStatusUpdate = false;
        this.ownerUserId = event;
        this.saveUserStory();
    }

    saveUserStory() {
        this.workItemsLoader.emit("");
        const userStory = new UserStory();
        userStory.userStoryId = this.userStory.userStoryId;
        userStory.ownerUserId = this.ownerUserId;
        userStory.userStoryStatusId = this.userStoryStatusId;
        userStory.estimatedTime = this.estimatedTimeSet;
        userStory.deadLineDate = this.deadlineDate;
        userStory.userStoryName = this.userStory.userStoryName;
        userStory.description = this.userStory.description;
        userStory.timeStamp = this.userStory.timeStamp;
        userStory.customApplicationId = this.userStory.customApplicationId;
        userStory.workFlowTaskId = this.userStory.workFlowTaskId;
        userStory.userStoryTypeId = this.userStory.userStoryTypeId;
        userStory.genericFormSubmittedId = this.userStory.genericFormSubmittedId;
        userStory.isWorkflowStatus = this.userStory.referenceTypeId ? true : null; 
        userStory.referenceId = this.userStory.referenceId; 
        userStory.referenceTypeId = this.userStory.referenceTypeId; 
        if (this.isEditFromProjects) {
            if (this.isAdhocStatusUpdate && (!this.isIncludeCompletedUserStories) && this.userStoryStatusId === this.selectedStatusId) {
                this.store.dispatch(new AdhocWorkStatusChangedTriggered(userStory))
            } else {
                this.store.dispatch(
                    new CreateAdhocWorkTriggered(userStory)
                );
            }
        } else {
            this.adhocWorkService.upsertAdhocWork(userStory).subscribe((result: any) => {
                if (result.success) {
                    this.store.dispatch(new LoadUserstoryHistoryTriggered(this.userStory.userStoryId));
                    this.completeUserStory.emit(this.userStory.userStoryId);
                } else {
                    this.stopLoader.emit("");
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                }
            });
        }
    }
}
