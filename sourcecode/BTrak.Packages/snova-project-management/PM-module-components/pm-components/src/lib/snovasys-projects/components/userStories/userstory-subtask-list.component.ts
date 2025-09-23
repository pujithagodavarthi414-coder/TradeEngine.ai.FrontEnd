import { Component, Input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, map } from "rxjs/operators";
import { Guid } from "guid-typescript";
import { Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject, Subscription, combineLatest } from "rxjs";

import { State } from "../../store/reducers/index";
import { GetUserStorySubTasksTriggered, UserStoryActionTypes, ReOrderSubUserStoriesTriggred } from "../../store/actions/userStory.actions";
import * as projectModuleReducer from "../../store/reducers/index";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { GetSprintWorkItemSubTasksTriggered } from "../../store/actions/sprint-userstories.action";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { UserService } from '../../services/user.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { UserStoryLogTimeModel } from '../../models/userStoryLogTimeModel';
import { InsertAutoLogTimeTriggered } from '../../store/actions/userStory-logTime.action';


@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-userstory-subtasks",
    templateUrl: "userstory-subtask-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStorySubTaskListComponent implements OnInit {
    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }
    @Input('goalStatusId')
    set _goalStatusId(data: string) {
        this.goalStatusId = data;
    }
    @Input('isDraggable')
    set _isDraggable(data: boolean) {
        this.isDraggable = data;
    }

    @Input('goalId')
    set _goalId(data: string) {
        this.goalId = data;
    }

    @Input('sprintId')
    set _sprintId(data: string) {
        this.sprintId = data;
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
        this.getAllSubTasks();
    }
    @Input("userStories")
    set _userStories(data: UserStory[]) {
        this.userStories = data;
    }

    @Input('isAllGoalsPage') isAllGoalsPage: boolean;
    userStories$: Observable<UserStory[]>;
    anyOperationInProgress$: Observable<boolean>;
    reOrderOperationInProgress$: Observable<boolean>;
    anyOperationInProgressForAutoLogging$: Observable<boolean>;
    subTasks: UserStory[];
    reOrderIsInProgress: boolean;
    orderedUserStoriesList: any[];
    goalId: string;
    sprintId: string;
    userStoryId: string;
    goalStatusId: string;
    userStories: UserStory[];
    parentUserStories: UserStory[];
    selectedUserStoryId: string;
    userStorySearchCriteria: UserStorySearchCriteriaInputModel;
    userstoryLoader = Array;
    UserstoryLoaderCount: number = 4;
    includeArchive: boolean;
    includePark: boolean;
    isDraggable: boolean;
    isBoardType: boolean;
    isSprintUserStories: boolean;
    dragulaBoardUniqueId: string;
    defaultProfileImage: string = "assets/images/faces/18.png";
    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    softLabels: SoftLabelConfigurationModel[];

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    loggedUser: string;

    constructor(private store: Store<State>,
        private router: Router,
        private dragulaService: DragulaService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private userService: UserService,
        private actionUpdates$: Actions, private softLabelsPipe: SoftLabelPipe) {

        this.handleDragulaDropActions(dragulaService);
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.ReOrderSubUserStoriesCompleted),
                tap(() => {
                    this.orderedUserStoriesList = [];
                })
            )
            .subscribe();
        //this.getLoggedInUser();
    }

    handleDragulaDropActions(dragulaService: DragulaService) {
        this.dragulaBoardUniqueId = Guid.create().toString();
        dragulaService.createGroup("subTasks", {
            revertOnSpill: true
        });



        this.subs.add(this.dragulaService.drag("subTasks")
            .subscribe(({ el }) => {
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
                if (this.reOrderIsInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                    this.dragulaService.find('subTasks').drake.cancel(true);
                }
            })
        );

        this.subs.add(this.dragulaService.drop("subTasks")
            .subscribe(({ name, el, target, source, sibling }) => {
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
                if (this.isDraggable && !this.reOrderIsInProgress) {
                    var orderedListLength = target.children.length;
                    this.orderedUserStoriesList = [];
                    for (var i = 0; i < orderedListLength; i++) {
                        var userStoryId = target.children[i].attributes["data-userStoryId"].nodeValue;
                        var index = this.orderedUserStoriesList.indexOf(userStoryId.toLowerCase());
                        if (index === -1) {
                            this.orderedUserStoriesList.push(userStoryId.toLowerCase());
                        }
                    }
                    this.store.dispatch(new ReOrderSubUserStoriesTriggred(this.orderedUserStoriesList));
                }
                else if (this.reOrderIsInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                }
                else {
                    this.orderedUserStoriesList = [];
                    this.dragulaService.find('subTasks').drake.cancel(true);
                    const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.CANNOTREORDERUSERSTORIES'), this.softLabels);
                    this.toastr.warning("", message);
                }
            })
        );
    }

    ngOnInit() {
        this.getSoftLabels();
        const anyOperationInProgress$ = this.store.pipe(select(projectModuleReducer.getSubTasksLoading));
        const sprintOperationInProgress$ = this.store.pipe(select(projectModuleReducer.subTasksLoading));
        this.anyOperationInProgressForAutoLogging$ = this.store.pipe(
            select(projectModuleReducer.insertAutoLogTimeLoading)
        );

        const reOrderOperationInProgress$ = this.store.pipe(
            select(projectModuleReducer.reOrderUserStoriesLoading)
        );

        this.anyOperationInProgress$ = combineLatest(
            anyOperationInProgress$,
            sprintOperationInProgress$,
            reOrderOperationInProgress$

        ).pipe(
            map(
                ([
                    getSubTasksLoading,
                    subTasksLoading,
                    reOrderUserStoriesLoading

                ]) =>
                    getSubTasksLoading ||
                    subTasksLoading ||
                    reOrderUserStoriesLoading
            )
        );
        if (this.isSprintUserStories) {
            this.userStories$ = this.store.pipe(select(projectModuleReducer.getSprintsSubTasks));

        } else {
            this.userStories$ = this.store.pipe(select(projectModuleReducer.getSubTasksList));
        }

    }

    getAllSubTasks() {
        if (this.isSprintUserStories) {
            var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
            userStorySearchCriteria.parentUserStoryId = this.userStoryId;
            userStorySearchCriteria.sprintId = this.sprintId;
            userStorySearchCriteria.isParked = false;
            userStorySearchCriteria.isArchived = false;
            this.store.dispatch(new GetSprintWorkItemSubTasksTriggered(userStorySearchCriteria));

        } else {
            var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
            userStorySearchCriteria.parentUserStoryId = this.userStoryId;
            userStorySearchCriteria.goalId = this.goalId;
            userStorySearchCriteria.isForUserStoryoverview = true;
            userStorySearchCriteria.isUserStoryArchived = false;
            userStorySearchCriteria.isUserStoryParked = false;
            userStorySearchCriteria.sortDirectionAsc = true;
            let includePark = localStorage.getItem('includePark');
            let includeArchive = localStorage.getItem('includeArchive');
            if (includePark === 'undefined') {
                this.includePark = null;
            }
            if (includeArchive === 'undefined') {
                this.includeArchive = null;
            }
            if (includePark === 'true') {
                this.includePark = true;
            }
            if (includeArchive === 'true') {
                this.includeArchive = true;
            }
            if (includePark === 'false') {
                this.includePark = false;
            }
            if (includeArchive === 'false') {
                this.includeArchive = false;
            }

            userStorySearchCriteria.includePark = this.includePark;
            userStorySearchCriteria.includeArchive = this.includeArchive;
            this.userStorySearchCriteria = userStorySearchCriteria;
            this.store.dispatch(new GetUserStorySubTasksTriggered(userStorySearchCriteria));
        }
    }

    getLoggedInUser() {
        this.userService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
        })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    navigateToUserStoriesPage(userStory) {
        this.router.navigate([
            "projects/userstory",
            userStory.userStoryId
        ]);
    }


    LogAction(event) {
        if (!event.userStoryLogTime.endTime) {
            var userStory = this.userStories.find(obj => { return (obj.startTime != null || obj.startTime != undefined) && !obj.endTime });
            if (!userStory) { userStory = this.findSubUserstoryTime(); }
            if (userStory && (event.userStoryLogTime.userStoryId != userStory.userStoryId)) {
                var userStoryLogTime = new UserStoryLogTimeModel();
                userStoryLogTime.userStoryId = userStory.userStoryId;
                userStoryLogTime.startTime = userStory.startTime;
                userStoryLogTime.endTime = new Date();
                userStoryLogTime.goalId = this.goalId;
                userStoryLogTime.sprintId = this.sprintId;
                userStoryLogTime.parentUserStoryId = userStory.parentUserStoryId;

                this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
            }
        }
        var newUserStoryLogTime = new UserStoryLogTimeModel();
        newUserStoryLogTime = event.userStoryLogTime;
        newUserStoryLogTime.isSubTasksPage = true;
        newUserStoryLogTime.goalId = this.goalId;
        newUserStoryLogTime.sprintId = this.sprintId;
        this.store.dispatch(new InsertAutoLogTimeTriggered(newUserStoryLogTime));
    }

    findSubUserstoryTime() {
        var susy;
        this.userStories.forEach((us) => {
            if (us.subUserStoriesList) {
                return us.subUserStoriesList.forEach((sus) => {
                    if (sus.startTime && (sus.startTime != null || sus.startTime != undefined) && !sus.endTime) {
                        susy = sus;
                    }
                });
            }
        });
        return susy;
    }


    highLightSelectedUserStory(userStoryId) {
        if (this.selectedUserStoryId === userStoryId) {
            return true;
        }
        else {
            return false;
        }
    }

    highLightUserStory(userStoryId) {
        this.selectedUserStoryId = userStoryId;
    }

    selectedUserStory(event) {
        this.selectedUserStoryId = event.userStory;
    }

    public ngOnDestroy() {
        this.subs.unsubscribe();
        this.dragulaService.destroy("subTasks");
        this.ngDestroyed$.next();
    }
}