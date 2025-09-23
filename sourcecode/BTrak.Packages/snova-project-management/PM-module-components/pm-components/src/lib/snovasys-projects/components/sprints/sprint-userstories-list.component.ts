import { ChangeDetectionStrategy, Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { GoalModel } from "../../models/GoalModel";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SearchUserStories, SearchAllUserStories, UserStoryActionTypes, GetUserStoryByIdTriggered } from "../../store/actions/userStory.actions";
import { Observable, Subject, Subscription } from "rxjs";
import { UserStory } from "../../models/userStory";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { SprintModel } from "../../models/sprints-model";
import { GetSprintsTriggered, SprintActionTypes, GetMoreSprintsTriggered } from "../../store/actions/sprints.action";
import { Project } from "../../models/project";
import { DragulaService } from "ng2-dragula";
import { MoveGoalUserStoryToSprintTriggered, SprintWorkItemActionTypes } from "../../store/actions/sprint-userstories.action";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
@Component({
    selector: "app-sprint-userstories-list",
    templateUrl: "sprint-userstories-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SprintUserStoriesComponent extends AppFeatureBaseComponent implements OnInit {
    @Input("goal")
    set _goal(goal: GoalModel) {
        this.goal = goal;
    }
    @Input("isSprintsEnable")
    set _isSprintsEnable(data: boolean) {
        this.isSprintsEnable = data;
    }
    @Input("userStorySearchCriteria")
    set _userStorySearchCriteria(data: UserStorySearchCriteriaInputModel) {
        this.userStorySearchCriteria = data;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.pageSize = 500;
        this.userStorySearchCriteria.sortBy = "Order";
        this.userStorySearchCriteria.sortDirectionAsc = true;

        var sprintModel = new SprintModel();
        sprintModel.projectId = this.userStorySearchCriteria.projectId;
        sprintModel.isBacklog = true;
        sprintModel.pageNumber = 1;
        sprintModel.pageSize = 500;
        this.sprintModel = sprintModel;
        if (this.userStorySearchCriteria.refreshUserStoriesCall) {
            this.store.dispatch(new GetSprintsTriggered(this.sprintModel));
            this.store.dispatch(
                new SearchUserStories(this.userStorySearchCriteria)
            );
        }

    }
    @Input("isGoalsPage")
    set _isGoalsPage(data: boolean) {
        this.isGoalsPage = data;

    }
    @Output() selectUserStory = new EventEmitter<UserStory>();
    @ViewChild("scrollMe") private myScrollContainer: ElementRef;
    @ViewChild("sprintsScroll") private sprintScrollContainer: ElementRef;
    userStories$: Observable<UserStory[]>;
    sprints$: Observable<SprintModel[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    sprintModel$: Observable<SprintModel>;
    project$: Observable<Project>;
    project: Project;
    anyOperationInProgress$: Observable<boolean>;
    loadingEntityFeaturesinProgress$: Observable<boolean>;
    sprintsOperationInProgress$: Observable<boolean>;
    sprintUserStoryIsInProgress$: Observable<boolean>;
    sprintUserStoryMovingIsInProgress$: Observable<boolean>;
    upsertSprintIsInProgress$: Observable<boolean>;
    isPermissionForDragWorkitems: Boolean;
    userStories: UserStory[];
    sprints: SprintModel[];
    isGoalsPage: boolean;
    userStorySearchCriteria: UserStorySearchCriteriaInputModel;
    sprintSearchCriteriaModel: UserStorySearchCriteriaInputModel;
    userStoryModel: UserStory = null;
    sprintModel: SprintModel;
    newSprint: SprintModel;
    goal: GoalModel;
    sprintId: string;
    boardTypeId: string;
    searchText: string;
    searchTags: string;
    userStoryTypeIds: string;
    goalReplanId: string;
    goalName: string;
    ownerUserIds: string; 
    userStoryBoardTypeId: string;
    selectedDropId: string;
    selectedDetails: UserStory;
    userStoryCount: number;
    sprintsCount: number;
    selectedUserStoryId: string;
    userStoryId: string;
    UserstoryLoader = Array;
    UserstoryLoaderCount = 3;
    highLightSprintId: string;
    userStoryChecked: boolean;
    isDeadlinedispaly = true;
    refreshUserStories: boolean;
    isArchivedGoal: boolean;
    allUserStorieSelected: boolean;
    showSubChilds: boolean;
    isVisible: boolean;
    isSprintsEnable: boolean;
    showUserStories: boolean;
    showHeader: boolean;
    orderByName: string;
    throttle = 0;
    scrollDistance = 0;
    sprintScrollThrottle = 0;
    sprintScrollDistance = 0;
    selectedTab: string;
    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    constructor(private store: Store<State>, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions,
        private dragulaService: DragulaService, private toastr: ToastrService, private translateService: TranslateService, private softLabelspipe: SoftLabelPipe) {
        super();
        this.handleDragulaDropActions(dragulaService);
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.SearchUserStoriesComplete),
                tap(() => {
                    this.userStories$ = this.store.pipe(
                        select(projectModuleReducer.getAllUserStories));
                    this.userStories$.subscribe((x) => this.userStories = x);
                    this.sortUserStories('Order');
                    if (this.userStories.length > 0) {
                        this.userStoryCount = this.userStories[0].totalCount;
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.GetSprintsCompleted),
                tap(() => {
                    this.sprints$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprints$.subscribe((x) => this.sprints = x);
                    this.refreshUserStories = false;
                    if (this.sprints.length > 0) {
                        this.sprintsCount = this.sprints[0].totalCount;
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.RefreshSprintsList),
                tap(() => {
                    this.sprints$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprints$.subscribe((x) => this.sprints = x);
                    this.sprintModel$ = this.store.pipe(select(projectModuleReducer.getSprintById));
                    this.sprintModel$.subscribe((x) => this.newSprint = x);
                    this.sprintsCount = this.sprintsCount + 1;
                    this.refreshUserStories = true;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.UpdateSprintsField),
                tap(() => {
                    this.sprints$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
                    this.sprints$.subscribe((x) => this.sprints = x);
                    this.sprintsCount = this.sprintsCount - 1;
                    if(this.sprintModel$) {
                        this.sprintModel$.subscribe((x) => this.sprintModel = x);
                    }
                    if (localStorage.getItem("boardtypeChanged")) {
                        localStorage.removeItem("boardtypeChanged");
                        this.refreshUserStories = true;
                    } else {
                        this.refreshUserStories = false;
                    }
                    
                    this.sprintSearchCriteriaModel.refreshUserStoriesCall = this.refreshUserStories;
                })
            )
            .subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.GetSprintsByIdCompleted),
                tap(() => {
                    if(this.sprintSearchCriteriaModel) {
                        if (localStorage.getItem("boardtypeChanged")) {
                            localStorage.removeItem("boardtypeChanged");
                            this.refreshUserStories = true;
                        } else {
                            this.refreshUserStories = false;
                        }
                        this.sprintSearchCriteriaModel.refreshUserStoriesCall = this.refreshUserStories;
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.ArchiveSprintsCompleted),
                tap(() => {
                    this.sprintModel$ = this.store.pipe(select(projectModuleReducer.getSprintById));
                    this.sprintModel$.subscribe((x) => this.newSprint = x);
                    this.refreshUserStories = false;
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted),
                tap(() => {
                    this.selectedDropId = null;
                    this.dragulaService.find('sprintUserStories').drake.cancel(true);
                    this.userStories = [];
                    var dragDrop = document.querySelector(".custom-dragdrop >:not(.custom-drag-items-text)") as HTMLElement
                    if (dragDrop) {
                        dragDrop.innerHTML = "";
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.MoveGoalUserStoryToSprintFailed),
                tap(() => {
                    this.selectedDropId = null;
                    this.userStories = [];
                    this.store.dispatch(new GetUserStoryByIdTriggered(this.selectedDropId));

                })
            )
            .subscribe();
    }

    private handleDragulaDropActions(dragulaService: DragulaService) {
        dragulaService.createGroup("sprintUserStories", {
            accepts: this.acceptDragulaCallback,
            revertOnSpill: true
        });

        this.subs.add(dragulaService.dropModel("sprintUserStories")
            .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
                const toGoalId = target.attributes["data-goalId"].nodeValue;
                this.selectedDropId = el.attributes["data-userStoryId"].nodeValue;
                this.userStoryBoardTypeId = this.userStories.find(x => x.userStoryId == this.selectedDropId).boardTypeId;
                if (toGoalId === this.sprintId && this.boardTypeId === this.userStoryBoardTypeId) {
                    this.store.dispatch(new MoveGoalUserStoryToSprintTriggered(this.selectedDropId, this.sprintId, false))
                } else {
                    this.selectedDropId = null;
                    this.toastr.warning('', this.softLabelspipe.transform(this.translateService.instant('SPRINTS.PLEASESELECTPROPERBOARDTYPE'), this.softLabels));
                    this.dragulaService.find('sprintUserStories').drake.cancel(true);
                }
            })
        );
        this.subs.add(dragulaService.removeModel("sprintUserStories")
            .subscribe(({ el, source, item, sourceModel }) => {
            })
        );
    }

    private acceptDragulaCallback = (el, target, source, sibling) => {
        // this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
        const fromGoalId = el.attributes["data-goalId"].nodeValue;
        const toGoalId = target.attributes["data-goalId"].nodeValue;
        if (fromGoalId != toGoalId && toGoalId && fromGoalId && this.sprintId == toGoalId && this.isPermissionForDragWorkitems) {
            return true
        } else {
            return false;
        }
    };

    ngOnInit() {
        super.ngOnInit();
        this.sprints$ = this.store.pipe(select(projectModuleReducer.getSprintsAll));
        this.project$ = this.store.select(projectModuleReducer.EditProjectById);
        this.isPermissionForDragWorkitems =  this.canAccess_entityType_feature_CanMoveGoalWorkitemIntoSprints;
        this.project$.subscribe((x) => this.project = x);
        this.getSoftLabelConfigurations();
        this.anyOperationInProgress$ = this.store.pipe(
            select(projectModuleReducer.userStoriesLoading)
        );
        this.sprintsOperationInProgress$ = this.store.pipe(select(projectModuleReducer.getSprintsLoading));
        this.sprintUserStoryIsInProgress$ = this.store.pipe(select(projectModuleReducer.getUniqueSprintWorkItemsLoading));
        this.upsertSprintIsInProgress$ = this.store.pipe(select(projectModuleReducer.upsertSprintsLoading));
        this.sprintUserStoryMovingIsInProgress$ = this.store.pipe(select(projectModuleReducer.loadingUserStorySprint));
    }

    getSoftLabelConfigurations() {
       this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    highLightSelectedUserStory(userStoryId) {
        if (this.selectedUserStoryId === userStoryId) {
            return true;
        }
        else {
            return false;
        }
    }

    sortUserStories(orderByName) {
        this.orderByName = orderByName;
        if (this.orderByName == "Deadlinedate") {
          //this.sortBy = 'deadLineDate';
          return this.userStories.sort((a, b) => {
            return <any>new Date(a.deadLineDate) - <any>new Date(b.deadLineDate);
          });
        }
        else if (this.orderByName == "Order") {
          //this.sortBy = 'order';
          return this.userStories.sort((a, b) => {
            return b.order - a.order
          });
        }
    
        this.cdRef.detectChanges();
      }
    selectedSprintUserStoryEvent(userStoryId) { 
        if (userStoryId != this.userStoryId) {
            this.showSubChilds = true;
        }
        else {
            this.showSubChilds = !this.showSubChilds;;
        }
        this.userStoryId = userStoryId;


        this.cdRef.detectChanges();
    }

    deSelectChildEvents(event) {
        if (this.userStoryId) {
            this.userStoryId = null;
        }
    }

    
  openNewUserStory(isVisible) {
    this.isVisible = isVisible;
  }


    checkisTreeStructureEnabled(userStoryId) {
        if (this.userStoryId === userStoryId) {
            return false;
        }
        else {
            return true;
        }
    }

    selectedUserStory(event) {
        this.selectedUserStoryId = event.userStory.userStoryId;
        if (event.isEmit) {
            this.selectedDetails = null;
            this.showHeader = false;
            this.selectUserStory.emit(event.userStory);
        }
    }


    onScrollDown() {
     
            let element = this.myScrollContainer.nativeElement;
            let userStoriesLatestFetchedCount = this.userStories.length;
            let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
            if (atBottom && (userStoriesLatestFetchedCount != this.userStoryCount)) {
                this.userStorySearchCriteria.pageNumber = (this.userStorySearchCriteria.pageNumber + 1);
                this.store.dispatch(
                    new SearchAllUserStories(this.userStorySearchCriteria)
                );
            }
        
    }

    onSprintsScrollDown() {
        let element = this.sprintScrollContainer.nativeElement;
        let sprintsLatestFetchedCount = this.sprints.length;
        let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        if (atBottom && (sprintsLatestFetchedCount != this.sprintsCount)) {
            this.sprintModel.pageNumber = (this.sprintModel.pageNumber + 1);
            this.store.dispatch(
                new GetMoreSprintsTriggered(this.sprintModel)
            );
        }
    }

    toggleTreeStructure(sprintId) {
        this.showHeader = false;
        
        if (sprintId != this.sprintId) {
            this.refreshUserStories = true;
            this.showUserStories = true;
            this.sprintId = sprintId;
            this.selectedDetails = null;
            this.getSprintUserStories();
        }
        else {
            this.showUserStories = !this.showUserStories;
            if (this.showUserStories) {
                this.refreshUserStories = true;
            } else {
                this.refreshUserStories = false;
            }
            this.sprintId = sprintId;

        }
        this.cdRef.detectChanges();
    }

    checkisTreeStructureEnabledForSprints(sprint) {
        if (this.sprintId === sprint.sprintId) {
            this.boardTypeId = sprint.boardTypeId;
            return true;
        } else {
            return false;
        }
    }

    selectedSprintId(sprintId) {
        this.highLightSprintId = sprintId;
    }

    highLightSprintSelected(sprintId) {
        if (this.highLightSprintId === sprintId) {
            return true;
        } else {
            return false;
        }
    }

    getSprintUserStories() {
        var sprintSearchCriteria = new UserStorySearchCriteriaInputModel();
        sprintSearchCriteria.sprintId = this.sprintId;
        sprintSearchCriteria.isArchived = false;
        sprintSearchCriteria.isParked = false;
        sprintSearchCriteria.refreshUserStoriesCall = this.refreshUserStories;
        this.sprintSearchCriteriaModel = sprintSearchCriteria;
    }

    searchUserStoriesWithName(searchText) {
        this.searchText = searchText;
        this.userStorySearchCriteria.userStoryName = this.searchText;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.isForFilters = true;
        this.store.dispatch(new SearchUserStories(this.userStorySearchCriteria));
    }

    searchUserStoriesBasedOnGoalName(searchText) {
        this.goalName = searchText;
        this.userStorySearchCriteria.goalName = this.goalName;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.isForFilters = true;
        this.store.dispatch(new SearchUserStories(this.userStorySearchCriteria));
    }

    searchUserStoriesBasedOnTags(searchText) {
        this.searchTags = searchText;
        this.userStorySearchCriteria.userStoryTags = this.searchTags;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.isForFilters = true;
        this.store.dispatch(new SearchUserStories(this.userStorySearchCriteria));
    }

    selectedOwnerUserId(searchText) {
        this.ownerUserIds = searchText;
        this.userStorySearchCriteria.ownerUserIds = this.ownerUserIds;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.isForFilters = true;
        this.store.dispatch(new SearchUserStories(this.userStorySearchCriteria));
    }

    selectedUserStoryTypeList(searchText) {
        this.userStoryTypeIds = searchText;
        this.userStorySearchCriteria.userStoryTypeIds = this.userStoryTypeIds;
        this.userStorySearchCriteria.pageNumber = 1;
        this.userStorySearchCriteria.isForFilters = true;
        this.store.dispatch(new SearchUserStories(this.userStorySearchCriteria));
    }

    selectedUserStoryEvent(event) {
        this.selectedDetails = event;
        this.selectedUserStoryId = null;
        this.selectUserStory.emit(null);
        this.selectUserStory.emit(this.selectedDetails);
        this.cdRef.detectChanges();
    }

    userStoryCloseClicked() {
        this.selectedDetails = null;
    }

    changeSprintListHeight() {
        let styles;
        if (this.selectedDetails) {
            styles = {
                "max-height": "100vh"
            }
        } else {
            styles = {
                "max-height": "300px"
            }
        }

        return styles;
    }

    showHeaderDetails(event) {
        this.showHeader = event;
    }

    saveMultipleUserStoriesEvent(userstoryModel) {
        this.userStoryModel = userstoryModel;
    }

    public ngOnDestroy() {
        this.subs.unsubscribe();
        this.dragulaService.destroy("sprintUserStories");
        this.ngDestroyed$.next();
    }
} 