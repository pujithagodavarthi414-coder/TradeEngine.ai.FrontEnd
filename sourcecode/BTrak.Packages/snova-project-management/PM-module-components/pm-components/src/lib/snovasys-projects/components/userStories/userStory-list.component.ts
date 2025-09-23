import { Component, Input, Output, EventEmitter, ViewChild, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatMenuTrigger } from "@angular/material/menu";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil, take } from "rxjs/operators";
import { FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { DragulaService } from "ng2-dragula";
import { State } from "../../store/reducers/index";

import * as userStoryActions from "../../store/actions/userStory.actions";
import * as projectModuleReducer from "../../store/reducers/index";
import { GoalModel } from "../../models/GoalModel";

import { ReOrderUserStoriesTriggred } from "../../store/actions/userStory.actions";

import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { WorkflowStatus } from "../../models/workflowStatus";
import { InsertLogTimeTriggered, UserStoryLogTimeActionTypes, InsertAutoLogTimeTriggered } from "../../store/actions/userStory-logTime.action";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { UserService } from '../../services/user.service';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { UserstoryTypeModel } from '../../models/user-story-type-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "gc-userstory-list",
  templateUrl: "userStory-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DragulaService]
})
export class UserStoryListComponent extends AppFeatureBaseComponent implements OnInit {
  goalUniqueDetailPage: boolean;
  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  @Input("goal")
  set _goal(goal: GoalModel) {
    this.goal = goal;
    this.isBugBoard = this.goal.isBugBoard;
    this.checkViewUserStoryPermission();
    //this.loadWorkflowStatus(this.goal.workflowId);
    if (this.goal.inActiveDateTime || this.goal.parkedDateTime) {
      this.isArchivedGoal = true;
    }
    else {
      this.isArchivedGoal = false;
    }
    this.selectedUserStories = [];
    this.userStoriesIds = [];
    if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase() || this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()
    ) {
      this.isDraggable = true;
    }
    else {
      this.isDraggable = false;
    }
  }

  @Input("userStorySearchCriteria")
  set setUserSearchCriteria(
    userStorySearchCriteria: UserStorySearchCriteriaInputModel
  ) {
    this.ownerUserList = null;
    this.searchText = null;
    this.userStoryStatusList = null;
    this.isUserStoryInputVisible = false;
    this.userStoryName = "";
    this.bugPriorityIdList = null;
    this.userStoryId = null;
    this.componentList = null;
    this.versionNamesearchText = null;
    this.userStoryTypeIds = null;
    this.searchTags = null;
    this.userStoryNamesList = [];
    this.userStorySearchCriteria = userStorySearchCriteria;
    if (this.userStorySearchCriteria.isGoalsPage && this.userStorySearchCriteria.goalId == '00000000-0000-0000-0000-000000000000') {
      this.isVisible = true;
      this.userStorySearchCriteria.pageNumber = 1;
      this.userStorySearchCriteria.pageSize = 50;
    }
    else {
      this.userStorySearchCriteria.pageNumber = 1;
      this.userStorySearchCriteria.pageSize = null;
    }
    if (this.userStorySearchCriteria.isGoalsPage) {
      this.isGoalsPage = true;
    }
    else {
      this.isGoalsPage = false;
    }
    this.checkViewUserStoryPermission();
    if (userStorySearchCriteria && this.userStorySearchCriteria.refreshUserStoriesCall) {
      this.store.dispatch(
        new userStoryActions.SearchUserStories(this.userStorySearchCriteria)
      );
      this.refreshUserStoriesCall = true;
    } else if (!userStorySearchCriteria) {
      this.store.dispatch(new userStoryActions.ClearUserStories());
      this.refreshUserStoriesCall = true;
    }
    if (this.goal) {
      if (this.goal.isSuperAgileBoard) {
        if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase() || this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
          this.isAddUserStory = true;
        } else {
          this.isAddUserStory = false;
        }
        this.isSuperagileBoard = true;
      } else {
        this.isSuperagileBoard = false;
        this.isAddUserStory = true;
      }
    }
  }

  @Input('isTheBoardLayoutKanban')
  set _isTheBoardLayoutKanban(data: boolean) {
    this.isTheBoardLayoutKanban = data;
    if (!this.isTheBoardLayoutKanban && !this.isSuperagileBoard) {
      this.isAddUserStory = true;
    }
  }

  @Input('goalUniqueDetailPage')
  set _goalUniqueDetailPage(data: boolean) {
    this.goalUniqueDetailPage = data;
  }

  @Input('selectedTab')
  set _selectedTab(data: string) {
    this.selectedTab = data;
  }

  @Input('selectedUserStoryId')
  set _selectedUserStoryId(data: string) {
    this.selectedUserStoryId = data;
  }

  @Input("isGoalsFiltersVisible")
  set _isFiltersVisible(data: boolean) {
    if (data || data == false) {
      this.isGoalsFiltersVisible = data;
    }
  }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Output() selectUserStory = new EventEmitter<UserStory>();
  @Output() eventClicked = new EventEmitter<any>();
  @Output() getGoalReplanId = new EventEmitter<string>();
  @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
  @Output() getGoalCalenderView = new EventEmitter<string>();
  @Output() updateUserStoryGoal = new EventEmitter<UserStory>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getGoalEmployeeTaskBoard = new EventEmitter<any>();
  @Output() emitUserStoriesCount = new EventEmitter<any>();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  validationMessage$: Observable<string[]>;
  userStories$: Observable<UserStory[]>;
  anyOperationInProgress$: Observable<boolean>;
  addOperationInProgress$: Observable<boolean>;
  reOrderOperationInProgress$: Observable<boolean>;
  loadingEntityFeaturesinProgress$: Observable<boolean>;
  updateUserStoryGoalIsInProgress$: Observable<boolean>;
  canMoveUserStoryFromOneGoalToAnother: Boolean;
  userStoriesCount$: Observable<number>;
  subUserStories: UserStory[];
  goal: GoalModel;
  userStoryTypeId: string;
  isSuperagileBoard: boolean;
  KanbanForm: boolean;
  isBugBoard: boolean;
  isFilterApplies: boolean;
  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  userStoriesIds = [];
  parentUserStoryIds = [];
  isErrorMessageForDependencyPerson: boolean;
  isErrorMessageForOwner: boolean;
  isPermisisontoChangeGoal: boolean;
  reOrderIsInProgress: boolean;
  allUserStorieSelected: boolean = false;
  isGoalsFiltersVisible: boolean = false;
  isTheBoardLayoutKanban: boolean;
  isPermissionForViewStories: boolean;
  isPermissionForAddUserStory: boolean;
  selectedUserStoryId: string;
  userStoryName: string = '';
  projectId: string;
  selectedTab: string;
  sortBy: string;
  validationMessage: string;
  errorMessage: boolean;
  selectedUserStories = [];
  checkedUserStories: any[];
  userStoryChecked: boolean;
  isArchivedGoal: boolean;
  showCheckBox: boolean;
  searchText: string;
  userChecked: boolean;
  userStories: UserStory[];
  orderedUserStoriesList: string[];
  userStoryForm: FormGroup;
  tab: string;
  userStoryCount: number;
  userStoryNamesList: any[] = [];
  userStory: UserStory;
  UserstoryLoader = Array;
  UserstoryLoaderCount: number = 3;
  isUserStoryInputVisible: boolean = false;
  isAddUserStory: boolean;
  isDraggable: boolean;
  count: number = 0;
  goalReplanId: string;
  userStoryStatusList: string;
  componentList: string;
  ownerUserList: string;
  bugPriorityIdList: string;
  versionNamesearchText: string;
  userStoryTypeIds: string;
  searchTags: string;
  userStoryId: string;
  refreshUserStoriesCall: boolean = true;
  isReportsPage: boolean = false;
  isCalenderView: boolean = false;
  isEmployeeTaskBoardPage: boolean = false;
  throttle = 0;
  scrollDistance = 0;
  orderByName: string;
  isParentTasks: boolean;
  parentUserStoryId: string;
  showSubChilds: boolean;
  Storyfocused: boolean;
  isVisible: boolean;
  public ngDestroyed$ = new Subject();
  subs = new Subscription();
  userStoryTypes: UserstoryTypeModel[];
  bugUserStoryTypeModel: UserstoryTypeModel;
  userStoryTypeModel: UserstoryTypeModel;
  isDeadlinedispaly: boolean = true;
  isGoalsPage: boolean;
  loggedUser: string;
  pageSize: number = 50;
  pageNumber: number = 1;
  pageIndex: number;
  pageSizeOptions: number[] = [50, 100, 150, 200, 250, 300];
  superAgile: string = "agile";

  constructor(
    private store: Store<State>,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private dragulaService: DragulaService,
    private translateService: TranslateService,
    private softLabelsPipe: SoftLabelPipe,
    private userService: UserService
  ) {
    super();
    //  this.sharedStore.dispatch(new CompanyWorkItemStartFunctionalityRequired());
    //this.getLoggedInUser();
    this.getSoftLabelConfigurations();
    dragulaService.createGroup("userStories", {
      revertOnSpill: true
      // removeOnSpill: true
    });

    this.projectId = this.route.snapshot.params["id"];



    this.subs.add(this.dragulaService.drag("userStories")
      .subscribe(({ el }) => {
        this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
        if (this.reOrderIsInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
          this.dragulaService.find('userStories').drake.cancel(true);
        }
      })
    );

    this.subs.add(this.dragulaService.drop("userStories")
      .takeUntil(this.ngDestroyed$)
      .subscribe(({ name, el, target, source, sibling }) => {
        this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
        if (this.isDraggable && !(this.reOrderIsInProgress)) {
          var fromUserStory = el.attributes["data-userStoryId"].nodeValue;

          var orderedListLength = target.children.length;
          this.orderedUserStoriesList = [];
          for (var i = 0; i < orderedListLength; i++) {
            var userStoryId = target.children[i].attributes["data-userStoryId"].nodeValue;
            var index = this.orderedUserStoriesList.indexOf(userStoryId.toLowerCase());
            if (index === -1) {
              this.orderedUserStoriesList.push(userStoryId.toLowerCase());
            }
          }
          let userStoryIdsList = [];
          let orderedUserStoriesList = this.orderedUserStoriesList;
          let filteredChildUserStories = [];
          let userStories = this.userStories;
          let childUserStories = _.filter(userStories, function (s) {
            return s && s.parentUserStoryId != null;
          });

          userStories.forEach((userStory) => {
            console.log(userStory);
            let subUserStories = userStory.subUserStoriesList;
            if (subUserStories) {
              filteredChildUserStories = _.filter(subUserStories, function (s) {
                return orderedUserStoriesList.includes(s.userStoryId.toLowerCase());
              })
              if (filteredChildUserStories.length > 0) {
                filteredChildUserStories.forEach((userStory) => {
                  userStoryIdsList.push(userStory.parentUserStoryId.toLowerCase());
                })
              }
            }
          })

          if (childUserStories.length === 0) {
            this.store.dispatch(new ReOrderUserStoriesTriggred(this.orderedUserStoriesList, this.parentUserStoryId));
          }
          else {
            this.orderedUserStoriesList = [];
            this.dragulaService.find('userStories').drake.cancel(true);
            this.toastr.warning(this.translateService.instant('USERSTORY.PLEASEUPDATEREORDERSUBTASKSCORRECTLY'));
            childUserStories = [];
            this.userStories = [];

          }

          if (userStoryIdsList.length > 0) {
            this.parentUserStoryId = userStoryIdsList[0];
          }
          else {
            this.parentUserStoryId = null;
          }
        }
        else if (this.reOrderIsInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
        }
        else {
          this.orderedUserStoriesList = [];
          this.dragulaService.find('userStories').drake.cancel(true);
          const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.CANNOTREORDERUSERSTORIES'), this.softLabels);
          this.toastr.warning("", message);
        }
      })
    );

    this.subs.add(this.dragulaService.removeModel("userStories")
      .takeUntil(this.ngDestroyed$)
      .subscribe(({ el, container, source }) => {
        var userStoryModel = new UserStory();
        this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
        let userStories = this.userStories;
        let userStoryId = this.userStoryId
        let filteredList = _.filter(userStories, function (s) {
          return s.userStoryId === userStoryId;
        })
        if (filteredList.length > 0) {
          userStoryModel.userStoryId = this.userStoryId;
          userStoryModel.userStoryName = filteredList[0].userStoryName;
          userStoryModel.timeStamp = filteredList[0].timeStamp;
          userStoryModel.userStoryUniqueName = filteredList[0].userStoryUniqueName;
          userStoryModel.oldGoalId = this.goal.goalId;
        }
        else {
          var userStoriesList = userStories.filter(function (userStory) {
            return userStory.subUserStories != null
          })
          let filteredChildUserStories = [];
          userStoriesList.forEach((subTasks) => {
            let subUserStories = subTasks.subUserStoriesList;
            if (subUserStories.length > 0) {
              filteredChildUserStories = filteredChildUserStories.concat(_.filter(subUserStories, function (s) {
                return s.userStoryId.toLowerCase() === userStoryId.toLowerCase();
              }))
            }
          })
          if (filteredChildUserStories.length > 0) {
            this.userStoryId = filteredChildUserStories[0].parentUserStoryId;
            userStoryModel.userStoryId = el.attributes["data-userStoryId"].nodeValue;
            userStoryModel.userStoryName = filteredChildUserStories[0].userStoryName;
            userStoryModel.timeStamp = filteredChildUserStories[0].timeStamp;
            userStoryModel.userStoryUniqueName = filteredChildUserStories[0].userStoryUniqueName;
            userStoryModel.oldGoalId = this.goal.goalId;
            userStoryModel.parentUserStoryId = filteredChildUserStories[0].parentUserStoryId;
          }
        }
        if (this.canMoveUserStoryFromOneGoalToAnother || this.isPermisisontoChangeGoal) {
          this.updateUserStoryGoal.emit(userStoryModel);
        }
        else {
          this.dragulaService.find('userStories').drake.cancel(true);
          this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
        }
      })
    );

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ReOrderUserStoriesCompleted),
        tap(() => {
          this.orderedUserStoriesList = [];
          this.dragulaService.find('userStories').drake.cancel(true);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateMultipleUserStories),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories));
          this.userStories$.subscribe((x => this.userStories = x));
         
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.RefreshMultipleUserStoriesList),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories));
          this.userStories$.subscribe((x => this.userStories = x));
         
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryCompletedWithInPlaceUpdate),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories));
          this.userStories$.subscribe((x => this.userStories = x));
        
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpdateSingleUserStoryForBugsCompleted),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories));
          this.userStories$.subscribe((x => this.userStories = x));
          
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpsertSubTaskCompleted),
        tap(() => {
          this.orderedUserStoriesList = [];
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.SearchUserStoriesComplete),
        tap(() => {

          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories));
          this.userStories$.subscribe((x => this.userStories = x));
          if (this.userStorySearchCriteria.isGoalsPage && this.userStorySearchCriteria.pageNumber === 1 && this.userStorySearchCriteria.goalId === '00000000-0000-0000-0000-000000000000') {
            if (this.userStories.length > 0) {
              this.userStoryCount = this.userStories[0].totalCount;
            } else {
              this.userStoryCount = 0;
            }
            this.emitUserStoriesCount.emit(this.userStoryCount);
          }
        })


      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          userStoryActions.UserStoryActionTypes
            .CreateMultipleUserStoriesCompleted
        ),
        tap(() => {
          this.userStoryChecked = false;
          this.showCheckBox = false;
          this.allUserStorieSelected = false;
          this.selectedUserStories = [];
          this.userStoriesIds = [];
          this.parentUserStoryIds = [];
          this.count = 0;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          userStoryActions.UserStoryActionTypes
            .AmendUserStoriesDeadlineCompleted
        ),
        tap(() => {
          this.userStoryChecked = false;
          this.showCheckBox = false;
          this.allUserStorieSelected = false;
          this.selectedUserStories = [];
          this.parentUserStoryIds = [];
          this.count = 0;
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          userStoryActions.UserStoryActionTypes
            .ParkUserStoryCompleted
        ),
        tap(() => {
          this.userStoryCount = this.userStories[0].totalCount - 1;
          this.emitUserStoriesCount.emit(this.userStoryCount);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(
          userStoryActions.UserStoryActionTypes
            .ArchiveUserStoryCompleted
        ),
        tap(() => {
          this.userStoryCount = this.userStories[0].totalCount - 1;
          this.emitUserStoriesCount.emit(this.userStoryCount);
        })
      )
      .subscribe();

    // this.actionUpdates$
    // .pipe(
    //   takeUntil(this.ngDestroyed$),
    //   ofType(MyWorkActionTypes.LoadMyWorkUserStoryByIdCompleted),
    //   tap(() => {
    //     //this.getUserStoriesList();
    //     this.userStories$ = this.store.pipe(select(projectModuleReducer.getAllUserStories));
    //     this.userStories$.subscribe(userStory => this.userStories = userStory);  
    //     this.updateUserStoryGoalIsInProgress$ = this.store.pipe(
    //       select(commonModuleReducers.updateUserStoryGoalInProgress));   
    //       this.cdRef.markForCheck();
    //       this.cdRef.detectChanges();
    //   })
    // )
    // .subscribe();
  }

  private acceptDragulaCallback = (el, target, source, sibling) => {
    this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);

    var canAccept = this.isDraggable && !this.reOrderIsInProgress
    return canAccept;
  };

  ngOnInit() {
    super.ngOnInit();
    this.canMoveUserStoryFromOneGoalToAnother = this.canAccess_entityType_feature_CanMoveWorkItemToAnotherGoal;

    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.userStoriesLoading)
    );
    this.reOrderOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.reOrderUserStoriesLoading)
    );
    // this.loadingEntityFeaturesinProgress$ = this.store.pipe(select(sharedModuleReducers.getEntityFeaturesLoading))



    this.updateUserStoryGoalIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.updateUserStoryGoalInProgress)
    );
    this.anyOperationInProgressForAutoLogging$ = this.store.pipe(
      select(projectModuleReducer.insertAutoLogTimeLoading)
    );

  }

  // getLoggedInUser() {
  //   this.userService.getLoggedInUser().subscribe((responseData: any) => {
  //     this.loggedUser = responseData.data.id;
  //   })
  // }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getUserStoryCount() {
    this.userStoryCount = this.userStoryCount - 1;
    this.emitUserStoriesCount.emit(this.userStoryCount);
  }



  selectedUserStory(event) {
    if (this.selectedUserStories.length > 0) {
      this.selectedUserStories = [];
      this.parentUserStoryIds = [];
      this.showCheckBox = false;
      this.userStoryChecked = false;
    }
    this.userStoriesIds = [];
    this.parentUserStoryIds = [];
    this.selectedUserStoryId = event.userStory.userStoryId;
    if (event.isEmit) {
      this.selectUserStory.emit(event.userStory);
    }
  }

  ClickAfterEvent(event) {
    if (this.isBugBoard && !event) {
      this.isAddUserStory = true;
    }
    this.eventClicked.emit(event);
  }

  goalReplanStarted(event) {
    this.goalReplanId = event;
    this.getGoalReplanId.emit(event);
  }

  onScrollDown() {
    if (this.userStorySearchCriteria.isGoalsPage && this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      let element = this.myScrollContainer.nativeElement;
      let userStoriesLatestFetchedCount = this.userStories.length;
      let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      if (atBottom && (userStoriesLatestFetchedCount != this.userStoryCount)) {
        this.userStorySearchCriteria.pageNumber = (this.userStorySearchCriteria.pageNumber + 1);
        this.store.dispatch(
          new userStoryActions.SearchAllUserStories(this.userStorySearchCriteria)
        );
      }
    }
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
    this.userStorySearchCriteria.pageNumber = this.pageNumber;
    this.userStorySearchCriteria.pageSize = this.pageSize;
    this.store.dispatch(
      new userStoryActions.SearchUserStories(this.userStorySearchCriteria)
    );
  }


  selectedShiftUserStoriesList(userStory) {
    if (this.parentUserStoryIds.length > 0) {
      this.selectedUserStories = [];
      this.parentUserStoryIds = [];
      this.userStoriesIds = [];
      this.showCheckBox = false;
      this.isParentTasks = true;
    }
    else {
      this.isParentTasks = true;
      this.userStoriesIds.push(userStory.userStoryId);
      this.userStoryChecked = true;
      this.allUserStorieSelected = true;
      this.showCheckBox = true;
      this.selectedUserStoryId = null;
      let selectedNewStories = [];
      let searchUserStoryText = this.searchText;
      let userStoryStatusList = this.userStoryStatusList;
      let ownerUserList = this.ownerUserList;
      let userStoryTypeIds = this.userStoryTypeIds;
      selectedNewStories = this.userStories;
      if (this.userStoriesIds.length > 1) {
        if (this.searchText) {
          selectedNewStories = _.filter(selectedNewStories, function (userStory) {
            return userStory.userStoryName.toLowerCase().includes(searchUserStoryText.toLowerCase())
          });
        }
        if (this.userStoryStatusList) {
          selectedNewStories = _.filter(selectedNewStories, function (userStory) {
            var userStoryStatusListArray = userStoryStatusList.split(",");
            return userStoryStatusListArray.includes(userStory.userStoryStatusId);
          })
        }
        if (this.ownerUserList) {
          selectedNewStories = _.filter(selectedNewStories, function (userStory) {
            var ownerUserListArray = ownerUserList.split(",");
            return ownerUserListArray.includes(userStory.ownerUserId);
          })
        }
        if (this.userStoryTypeIds) {
          selectedNewStories = _.filter(selectedNewStories, function (userStory) {
            var userStoryTypeIdsArray = userStoryTypeIds.split(",");
            return userStoryTypeIdsArray.includes(userStory.userStoryTypeId);
          })
        }
        if (this.searchTags) {
          selectedNewStories = selectedNewStories.filter((x: any) => {
            if (x.tag) {
              return x.tag.toLowerCase().includes(this.searchTags.toLowerCase().trim())
            }
          })
        }
        let userStoryIdsList = [];
        selectedNewStories.forEach((userStory) => {
          userStoryIdsList.push(userStory.userStoryId.toLowerCase());
        })
        var startingIndex = userStoryIdsList.indexOf(this.userStoriesIds[0]);
        let endingUserStory = this.userStoriesIds.slice(-1).pop();
        var endingIndex = userStoryIdsList.indexOf(endingUserStory);
        let selectedUserStories = userStoryIdsList;
        if (startingIndex < endingIndex) {
          this.selectedUserStories = selectedUserStories.slice(startingIndex, endingIndex + 1);
        }
        else {
          this.selectedUserStories = selectedUserStories.slice(endingIndex, startingIndex + 1);
        }
      }
      else if (this.userStoriesIds.length == 1) {
        this.selectedUserStories = this.userStoriesIds;
      }
    }

  }

  selectedShiftSubUserStoriesList(userStory) {
    this.userStoriesIds.push(userStory.userStoryId.toLowerCase());
    if ((this.parentUserStoryIds.length > 0 && userStory.parentUserStoryId.toLowerCase() != this.parentUserStoryIds[0]) || this.isParentTasks) {
      this.selectedUserStories = [];
      this.parentUserStoryIds = [];
      this.userStoriesIds = [];
      this.showCheckBox = false;
      this.isParentTasks = false;
    }
    else {
      this.isParentTasks = false;
      if (userStory.parentUserStoryId) {
        this.parentUserStoryIds.push(userStory.parentUserStoryId.toLowerCase());
        this.showCheckBox = true;
        this.allUserStorieSelected = true;
        this.selectedUserStoryId = null;
        let selectedNewStories = [];
        let searchUserStoryText = this.searchText;
        let userStoryStatusList = this.userStoryStatusList;
        let ownerUserList = this.ownerUserList;
        let userStoryTypeIds = this.userStoryTypeIds;
        let childUserStories = [];
        let parentUserStoryIds = this.parentUserStoryIds;
        childUserStories = _.filter(this.userStories, function (userStory) {
          return parentUserStoryIds.includes(userStory.userStoryId);
        })
        if (childUserStories.length > 0) {
          selectedNewStories = childUserStories[0].subUserStoriesList;
        }

        if (this.userStoriesIds.length > 1) {
          if (this.searchText) {
            selectedNewStories = _.filter(selectedNewStories, function (userStory) {
              return userStory.userStoryName.toLowerCase().includes(searchUserStoryText.toLowerCase())
            });
          }
          if (this.userStoryStatusList) {
            selectedNewStories = _.filter(selectedNewStories, function (userStory) {
              var userStoryStatusListArray = userStoryStatusList.split(",");
              return userStoryStatusListArray.includes(userStory.userStoryStatusId);
            })
          }
          if (this.ownerUserList) {
            selectedNewStories = _.filter(selectedNewStories, function (userStory) {
              var ownerUserListArray = ownerUserList.split(",");
              return ownerUserListArray.includes(userStory.ownerUserId);
            })
          }
          if (this.userStoryTypeIds) {
            selectedNewStories = _.filter(selectedNewStories, function (userStory) {
              var userStoryTypeIdsArray = userStoryTypeIds.split(",");
              return userStoryTypeIdsArray.includes(userStory.userStoryTypeId);
            })
          }
          if (this.searchTags) {
            selectedNewStories = selectedNewStories.filter((x: any) => {
              if (x.tag) {
                return x.tag.toLowerCase().includes(this.searchTags.toLowerCase().trim())
              }
            })
          }
          let userStoryIdsList = [];
          selectedNewStories.forEach((userStory) => {
            userStoryIdsList.push(userStory.userStoryId.toLowerCase());
          })
          var startingIndex = userStoryIdsList.indexOf(this.userStoriesIds[0]);
          let endingUserStory = this.userStoriesIds.slice(-1).pop();
          var endingIndex = userStoryIdsList.indexOf(endingUserStory);
          let selectedUserStories = userStoryIdsList;
          if (startingIndex < endingIndex) {
            this.selectedUserStories = selectedUserStories.slice(startingIndex, endingIndex + 1);
          }
          else {
            this.selectedUserStories = selectedUserStories.slice(endingIndex, startingIndex + 1);
          }
        }
        else if (this.userStoriesIds.length == 1) {
          this.selectedUserStories = this.userStoriesIds;
        }
      }
    }

  }


  searchUserStoriesBasedOnUserStoryName(searchText) {
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.isFilterApplies = true;
      this.userStorySearchCriteria.userStoryName = searchText;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.userStorySearchCriteria.pageNumber = this.pageNumber;
      this.userStorySearchCriteria.pageSize = this.pageSize;
      this.userStorySearchCriteria.isForFilters = true;
      this.userStorySearchCriteria.isGoalsPage = true;
      this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
    } else {
      this.searchText = searchText;
      this.cdRef.detectChanges();
    }
  }

  searchUserStoriesBasedOnVersionName(versionNamesearchText) {
    this.versionNamesearchText = versionNamesearchText;
    this.cdRef.detectChanges();
  }

  searchUserStoriesBasedOnTags(searchTags) {
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.isFilterApplies = true;
      this.userStorySearchCriteria.userStoryTags = searchTags;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.userStorySearchCriteria.pageNumber = this.pageNumber;
      this.userStorySearchCriteria.pageSize = this.pageSize;
      this.userStorySearchCriteria.isForFilters = true;
      this.userStorySearchCriteria.isGoalsPage = true;
      this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
    } else {
      this.searchTags = searchTags;
      this.cdRef.detectChanges();
    }
  }

  filterUserStoriesBySelectedUserStoryType(userStoryTypeIds) {
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.isFilterApplies = true;
      this.userStorySearchCriteria.userStoryTypeIds = userStoryTypeIds;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.userStorySearchCriteria.pageNumber = this.pageNumber;
      this.userStorySearchCriteria.pageSize = this.pageSize;
      this.userStorySearchCriteria.isForFilters = true;
      this.userStorySearchCriteria.isGoalsPage = true;
      this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
    } else {
      this.userStoryTypeIds = userStoryTypeIds;
      this.cdRef.detectChanges();
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

  filterUserStoriesBySelectedStatus(userStoryStatusId) {
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.userStorySearchCriteria.userStoryStatusIds = userStoryStatusId;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.userStorySearchCriteria.pageNumber = this.pageNumber;
      this.userStorySearchCriteria.pageSize = this.pageSize;
      this.userStorySearchCriteria.isForFilters = true;
      this.userStorySearchCriteria.isGoalsPage = true;
      this.isFilterApplies = true;
      this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
    } else {
      this.userStoryStatusList = userStoryStatusId;
      this.cdRef.detectChanges();
    }
  }

  filterUserStoriesBySelectedComponent(projectFeatureId) {
    this.componentList = projectFeatureId;
  }

  InsertMultipleUserStories() {

  }

  filterUserStoriesByAssignee(ownerUserId) {
    if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
      this.userStorySearchCriteria.ownerUserIds = ownerUserId;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.userStorySearchCriteria.pageNumber = this.pageNumber;
      this.userStorySearchCriteria.pageSize = this.pageSize;
      this.userStorySearchCriteria.isForFilters = true;
      this.userStorySearchCriteria.isGoalsPage = true;
      this.userStorySearchCriteria.ownerUserIds = ownerUserId;
      this.isFilterApplies = true;
      this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
    } else {
      this.ownerUserList = ownerUserId;
      this.cdRef.detectChanges();
    }
  }

  filterUserStoriesByBugPriorities(bugPriorityId) {
    this.bugPriorityIdList = bugPriorityId;
  }

  updateMultipleUserStories(event) {
    this.selectedUserStoryId = null;
    this.count = 0;
    let index = this.selectedUserStories.indexOf(event.userStory.userStoryId.toLowerCase());
    if (index == -1) {
      this.selectedUserStories.push(event.userStory.userStoryId.toLowerCase());
      if (event.userStory.parentUserStoryId) {
        this.parentUserStoryIds.push(event.userStory.parentUserStoryId);
      }
    }
    else {
      this.selectedUserStories.splice(index, 1);

    }

    if (this.selectedUserStories.length > 0) {
      this.showCheckBox = true;
      this.cdRef.detectChanges();
    } else {
      this.showCheckBox = false;
      this.userStoryChecked = false;
      this.cdRef.detectChanges();
    }
    if (this.selectedUserStories.length == this.userStories.length) {
      this.allUserStorieSelected = true;
    }
    else {
      this.allUserStorieSelected = false;
    }
    this.cdRef.detectChanges();
  }


  saveTransitionForMultipleUserStories(userStoryModel) {
    let userStories = [];
    let UserStoriesList = this.userStories;
    var selectedUserStories = this.selectedUserStories;
    userStories = _.filter(this.userStories, function (userStory) {

      var userStoryStatusListArray = selectedUserStories.join(",");
      return userStoryStatusListArray.includes(userStory.userStoryId);
    })
    this.SaveMultipleUserStories(userStoryModel);
  }

  SaveMultipleUserStories(userStoryModel) {
    userStoryModel.ProjectId = this.projectId;
    userStoryModel.UserStoryIds = this.selectedUserStories;
    userStoryModel.goalId = this.goal.goalId;
    userStoryModel.parentUserStoryIds = _.uniq(this.parentUserStoryIds);
    this.store.dispatch(
      new userStoryActions.CreateMultipleUserStoriestriggered(userStoryModel)
    );
  }

  amendUserStoryDeadlineEvent(userStoryModel) {
    userStoryModel.userStoryIds = this.selectedUserStories;
    userStoryModel.amendBy = true;
    userStoryModel.goalId = this.goal.goalId;
    this.store.dispatch(
      new userStoryActions.AmendUserStoryDeadlineTriggered(userStoryModel)
    );
  }



  selectedEvent(userStoryId) {
    if (userStoryId != this.userStoryId) {
      this.showSubChilds = true;
    }
    else {
      this.showSubChilds = !this.showSubChilds;;
    }
    this.userStoryId = userStoryId;

    this.cdRef.detectChanges();
  }

  checkisTreeStructureEnabled(userStoryId) {
    if (this.userStoryId === userStoryId) {
      return false;
    }
    else {
      return true;
    }
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
        userStoryLogTime.parentUserStoryId = userStory.parentUserStoryId;
        this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
      }
    }
    this.store.dispatch(new InsertAutoLogTimeTriggered(event.userStoryLogTime));
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


  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy("userStories");
    this.ngDestroyed$.next();
  }

  checkViewUserStoryPermission() {
    if (this.goal) {
      if (this.goal.goalId != '00000000-0000-0000-0000-000000000000') {
        let projectId = this.goal.projectId;
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        if (entityRolefeatures) {
          this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId
          })
          let featurePermissions = [];
          if (this.entityRolePermisisons.length > 0) {
            featurePermissions = this.entityRolePermisisons;
            if (featurePermissions.length > 0) {
              let entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
              var viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
                return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
              })
              if (viewUserStoryPermisisonsList.length > 0) {
                this.isPermissionForViewStories = true;
              }
              else {
                this.isPermissionForViewStories = false;
              }

              // Userstory goal permissions
              let entityTypeFeatureForUserStoryGoal = EntityTypeFeatureIds.EntityTypeFeature_CanMoveWorkItemToAnotherGoal.toString().toLowerCase();
              var userStoryChangeGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
                return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryGoal)
              })
              if (userStoryChangeGoalPermisisonsList.length > 0) {
                this.isPermisisontoChangeGoal = true;
              }
              else {
                this.isPermisisontoChangeGoal = false;
              }

              // Userstory add permissions
              let entityTypeFeatureForAddUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem.toString().toLowerCase();
              var userStoryAddPermisisonsList = _.filter(featurePermissions, function (permission) {
                return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddUserStory)
              })
              if (userStoryAddPermisisonsList.length > 0) {
                this.isPermissionForAddUserStory = true;
              }
              else {
                this.isPermissionForAddUserStory = false;
              }
            }
          }
        }
      }
      else if (this.goal.goalId == '00000000-0000-0000-0000-000000000000') {
        this.isPermissionForViewStories = true;
        this.cdRef.detectChanges();
      }
    }
  }



  //ReportsList
  getChartDetails(event) {
    this.getGoalRelatedBurnDownCharts.emit('');
  }

  getCalanderView(event) {
    this.getGoalCalenderView.emit('');
  }

  getDocumentView(event) {
    this.getDocumentStore.emit('');
  }

  getEmployeeTaskBoard(event) {
    this.getGoalEmployeeTaskBoard.emit('');
  }

  highLightUserStory(userStoryId) {
    this.selectedUserStoryId = userStoryId;
    if (userStoryId) {
      this.selectedUserStories = [];
      this.parentUserStoryIds = [];
      this.userStoriesIds = [];
      this.showCheckBox = false;
    }
  }

  highLightSelectedUserStory(userStoryId) {
    if (this.selectedUserStoryId === userStoryId) {
      return true;
    }
    else if (this.selectedUserStories.length > 0) {
      if (this.selectedUserStories.toString().includes(userStoryId.toLowerCase())) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  openNewUserStory(isVisible) {
    this.isVisible = isVisible;
  }

  displaydeadlines($event) {
    this.isDeadlinedispaly = !this.isDeadlinedispaly
  }

  setHeights() {
    if (!this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage) {
      let styles;
      if (this.isVisible) {
        styles = {
          'height': 'unset',
          'max-height': 'calc(100vh - 408px)'
        }
      }
      else {
        styles = {
          'height': 'unset',
          'max-height': 'calc(100vh - 228px)'
        }
      }
      return styles;
    }
    else if (this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage) {
      let styles;
      if (this.isVisible) {
        styles = {
          'height': 'unset',
          'max-height': 'calc(100vh - 408px)'
        }
      }
      else {
        styles = {
          'height': 'unset',
          'max-height': 'calc(100vh - 290px)'
        }
      }
      return styles;
    }
  }
}