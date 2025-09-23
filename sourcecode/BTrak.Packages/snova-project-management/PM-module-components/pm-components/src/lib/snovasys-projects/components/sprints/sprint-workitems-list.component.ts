import { ChangeDetectionStrategy, Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import * as _ from "underscore";
import { UserStory } from "../../models/userStory";
import { Actions, ofType } from "@ngrx/effects";
import 'rxjs/add/operator/takeUntil';
import { GetSprintWorkItemTriggered, SprintWorkItemActionTypes, CreateMultipleSprintUserStoriesTriggered, ReOrderSprintUserStoriesTriggred } from "../../store/actions/sprint-userstories.action";
import { Observable, Subject, Subscription } from "rxjs";
import { SprintModel } from "../../models/sprints-model";
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { InsertAutoLogTimeTriggered } from "../../store/actions/userStory-logTime.action";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { tap, takeUntil } from 'rxjs/operators';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';


@Component({
  selector: "app-sprint-workitems-list",
  templateUrl: "sprint-workitems-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DragulaService]
})

export class SprintWorkitemsComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("sprintSearchCriteriaModel")
  set _sprintSearchCriteriaModel(data: UserStorySearchCriteriaInputModel) {
    this.sprintSearchCriteriaModel = data;
    this.selectedUserStories = [];
    if (this.sprintSearchCriteriaModel && this.sprintSearchCriteriaModel.isGoalsPage && this.sprintSearchCriteriaModel.sprintId == '00000000-0000-0000-0000-000000000000') {
      this.isVisible = true;
      this.sprintSearchCriteriaModel.pageNumber = 1;
      this.sprintSearchCriteriaModel.pageSize = 50;
    } else {
      this.sprintSearchCriteriaModel.pageNumber = 1;
      this.sprintSearchCriteriaModel.pageSize = null;
    }
    if (this.sprintSearchCriteriaModel.refreshUserStoriesCall) {
      this.store.dispatch(new GetSprintWorkItemTriggered(this.sprintSearchCriteriaModel));
    }
  }
  @Input("isBacklog")
  set _isBacklog(data: boolean) {
    this.isBacklog = data;
  }
  @Input("sprint")
  set _sprint(data: SprintModel) {
    this.sprint = data;
    this.ownerUserId = null;
    if (this.sprint) {
      if (this.sprint.isReplan && this.sprint.sprintStartDate) {
        this.isAddUserStory = true;
        this.selectedTab = "replan-goals";
        this.goalStatusId = ConstantVariables.ReplanGoalStatusId.toLowerCase();
      } else if (!this.sprint.isReplan && !this.sprint.sprintStartDate) {
        this.isAddUserStory = true;
        this.selectedTab = "backlog-goals";
        this.goalStatusId = ConstantVariables.BacklogGoalStatusId.toLowerCase();
      }
      if (this.sprint.isBugBoard) {
        this.KanbanForm = false;
      }
      if (this.sprint.isSuperAgileBoard) {
        this.isSuperagileBoard = true;
      } else {
        this.isAddUserStory = true;
        this.isSuperagileBoard = false;
      }

    }
  }
  @Input("userStoryModel")
  set _userStoryModel(data: UserStory) {
    this.userStoryModel = data;
    if (this.userStoryModel) {
      this.updateMultipleUserStoriesFromSprint(this.userStoryModel)
    }
  }

  @Input("isBoardLayOut")
  set _isBoardLayOut(data: boolean) {
    this.isBoardLayOut = data;
    if (this.isBoardLayOut && !this.isSuperagileBoard) {
      this.isAddUserStory = true;
    }
  }

  @Input("isUniquePage") isUniquePage: boolean;
  @Input("isSprintUserStories") isSprintUserStories: boolean;
  @Output() selectedUserStoryEvent = new EventEmitter<object>();
  @Output() eventClicked = new EventEmitter<boolean>();
  @Output() getReportsBoard = new EventEmitter<boolean>();
  @Output() emitReplanTypeId = new EventEmitter<string>();
  @Output() selectedUserStoriesString = new EventEmitter<boolean>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getCalenderViewClicked = new EventEmitter<boolean>();
  @Output() emitUserStoriesCount = new EventEmitter<number>();
  userStories$: Observable<UserStory[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStories: UserStory[];
  anyOperationInProgress$: Observable<boolean>;
  reOrderOperationInProgress$: Observable<boolean>;
  loadingEntityFeaturesinProgress$: Observable<boolean>;
  sprintSearchCriteriaModel: UserStorySearchCriteriaInputModel;
  userStoryModel: UserStory;
  sprint: SprintModel;
  isBoardLayOut: boolean;
  isSuperagileBoard: boolean;
  KanbanForm: boolean;
  UserstoryLoader = Array;
  UserstoryLoaderCount = 3;
  isDeadlinedisplay = true;
  isBacklog: boolean;
  selectedTab: string;
  showSubChilds: boolean;
  replanTypeId: string;
  userStoryStatusList: string;
  userStoryId: string;
  goalStatusId: string;
  selectedUserStoryId: string;
  isAddUserStory: boolean;
  isParentTasks: boolean;
  reOrderIsInProgress: Boolean;
  parentUserStoryId: string;
  isVisible: boolean;
  showCheckBox: boolean;
  userStoryChecked: boolean;
  userStoryCount: number;
  allUserStorieSelected: boolean;
  userStoriesIds: any[] = [];
  ownerUserId: string;
  selectedUserStories = [];
  orderUserStoriesList: any[] = [];
  parentUserStoryIds: any[] = [];
  public ngDestroyed$ = new Subject();
  subs = new Subscription();
  count: number;
  pageSize: number = 50;
  pageNumber: number = 1;
  pageIndex: number;
  pageSizeOptions: number[] = [50, 100, 150, 200, 250, 300];

  constructor(private store: Store<State>, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions, private dragulaService: DragulaService,
    private toastr: ToastrService, private translateService: TranslateService, private softLabelPipe: SoftLabelPipe) {
    super();
    this.handleDragulaDragAndDropActions(dragulaService);
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetSprintWorkItemCompleted),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getSprintWorkItemsAll));
          this.userStories$.subscribe((x => this.userStories = x));
          if (this.sprintSearchCriteriaModel && this.sprintSearchCriteriaModel.isGoalsPage && this.sprintSearchCriteriaModel.pageNumber === 1 && this.sprintSearchCriteriaModel.sprintId === '00000000-0000-0000-0000-000000000000') {
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
          SprintWorkItemActionTypes.ParkSprintWorkItemCompleted
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
          SprintWorkItemActionTypes.ArchiveSprintWorkItemCompleted
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
        ofType(SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted),
        tap(() => {
          this.showCheckBox = false;
          this.selectedUserStories = [];
          this.parentUserStoryIds = [];
          this.selectedUserStoriesString.emit(this.showCheckBox);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
        tap(() => {
          this.showCheckBox = false;
          this.selectedUserStories = [];
          this.parentUserStoryIds = [];
          this.selectedUserStoriesString.emit(this.showCheckBox);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.ReOrderSprintUserStoriesCompleted),
        tap(() => {
          this.orderUserStoriesList = [];
          this.parentUserStoryId = null;
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
        tap((data: any) => {
          var changedItem = data.SprintWorkItem;
          if (changedItem != undefined) {
            var index = this.userStories.findIndex(x => x.userStoryId.toLowerCase() == changedItem.userStoryId.toLowerCase());
            this.userStories[index] = changedItem;
          }
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }
  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.userStories$ = this.store.pipe(
      select(projectModuleReducer.getSprintWorkItemsAll), tap(userStoriesList => {
        this.userStories = userStoriesList
      })
    )
    this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducer.getSprintWorkItemsLoading));
    this.reOrderOperationInProgress$ = this.store.pipe(select(projectModuleReducer.reOrderWorkItemsLoading));
  }

  private handleDragulaDragAndDropActions(dragulaService: DragulaService) {
    dragulaService.createGroup("reOrderItems", {
      accepts: this.acceptDragulaCallback,
      revertOnSpill: true
    });

    this.subs.add(this.dragulaService.drag("reOrderItems")
      .subscribe(({ el }) => {
        this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
        if (this.reOrderIsInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
          this.dragulaService.find('reOrderItems').drake.cancel(true);
        }
      })
    );

    this.subs.add(this.dragulaService.drop("reOrderItems")
      .takeUntil(this.ngDestroyed$)
      .subscribe(({ name, el, target, source, sibling }) => {
        this.reOrderOperationInProgress$.subscribe(x => this.reOrderIsInProgress = x);
        if (!(this.reOrderIsInProgress)) {
          var fromUserStory = el.attributes["data-userStoryId"].nodeValue;

          var orderedListLength = target.children.length;
          this.orderUserStoriesList = [];
          for (var i = 0; i < orderedListLength; i++) {
            var userStoryId = target.children[i].attributes["data-userStoryId"].nodeValue;
            var index = this.orderUserStoriesList.indexOf(userStoryId.toLowerCase());
            if (index === -1) {
              this.orderUserStoriesList.push(userStoryId.toLowerCase());
            }
          }
          let userStoryIdsList = [];
          let orderedUserStoriesList = this.orderUserStoriesList;
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

          if (userStoryIdsList.length > 0) {
            this.parentUserStoryId = userStoryIdsList[0];
          }
          else {
            this.parentUserStoryId = null;
          }

          if (childUserStories.length === 0) {
            this.store.dispatch(new ReOrderSprintUserStoriesTriggred(this.orderUserStoriesList, this.parentUserStoryId));
          }
          else {
            this.orderUserStoriesList = [];
            this.dragulaService.find('reOrderItems').drake.cancel(true);
            this.toastr.warning(this.translateService.instant('USERSTORY.PLEASEUPDATEREORDERSUBTASKSCORRECTLY'));
            childUserStories = [];
            this.userStories = [];

          }

        }
        else if (this.reOrderIsInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
        }
        else {
          this.orderUserStoriesList = [];
          this.dragulaService.find('reOrderItems').drake.cancel(true);
          const message = this.softLabelPipe.transform(this.translateService.instant('USERSTORY.CANNOTREORDERUSERSTORIES'), this.softLabels);
          this.toastr.warning("", message);
        }
      })
    );
  }

  private acceptDragulaCallback = (el, target, source, sibling) => {
    // this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
    if (this.goalStatusId == ConstantVariables.BacklogGoalStatusId.toLowerCase() || this.goalStatusId == ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  };

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  toggleSubChilds(userStoryId) {
    if (userStoryId != this.userStoryId) {
      this.showSubChilds = true;
    }
    else {
      this.showSubChilds = !this.showSubChilds;

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

  selectedUserStoryDetails(event) {
    if (event.isEmit) {
      this.selectedUserStories = [];
      this.parentUserStoryIds = [];
      this.selectedUserStories = [];
      this.selectedUserStoriesString.emit(false);
      this.showCheckBox = false;
      this.selectedUserStoryId = event.userStory.userStoryId.toLowerCase();
      this.selectedUserStoryEvent.emit(event.userStory);
    }
  }

  highLightedSelectedUserStoryId(userStoryId) {
    if (this.selectedUserStoryId == userStoryId.toLowerCase()) {
      return true;
    } else if (this.selectedUserStories && this.selectedUserStories.length > 0) {
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

  setClassForUserStories() {
    if (this.isBacklog) {
      return "custom-box p-0 m-0 user-card mb-05"
    } else {
      return "default-board custom-box p-0 m-0 user-card"
    }
  }

  boardChange(event) {
    this.eventClicked.emit(event);
  }

  reportsBoardClicked() {
    this.getReportsBoard.emit(true);
  }

  getDocumentView(event) {
    this.getDocumentStore.emit("");
  }

  getCalenderView(event) {
    this.getCalenderViewClicked.emit(true);
  }


  filterOwnerList(ownerId) {
    this.ownerUserId = ownerId;
  }

  selectReplanType(replanTypeId) {
    this.replanTypeId = replanTypeId;
    this.emitReplanTypeId.emit(this.replanTypeId);
  }

  openNewUserStory(isVisible) {
    this.isVisible = isVisible;
  }

  updateMultipleUserStories(event) {
    this.count = 0;
    this.selectedUserStoryId = null;
    if (this.selectedUserStories && this.selectedUserStories.length > 0) {
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
    } else {
      this.selectedUserStories.push(event.userStory.userStoryId.toLowerCase());
    }

    if (this.selectedUserStories.length > 0) {
      this.showCheckBox = true;
      this.cdRef.detectChanges();
    } else {
      this.showCheckBox = false;
      this.userStoryChecked = false;
      this.cdRef.detectChanges();
    }
    this.selectedUserStoriesString.emit(this.showCheckBox);
    this.cdRef.detectChanges();
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
      selectedNewStories = this.userStories;
      if (this.userStoriesIds.length > 1) {
        if (this.ownerUserId) {
          selectedNewStories = _.filter(selectedNewStories, function (userStory) {
            var ownerUserListArray = this.ownerUserId.split(",");
            return ownerUserListArray.includes(userStory.ownerUserId);
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
    this.selectedUserStoriesString.emit(this.showCheckBox);
  }

  selectedShiftSubUserStoriesList(userStory) {
    this.userStories$.subscribe((x) => this.userStories = x);
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
        let childUserStories = [];
        let parentUserStoryIds = this.parentUserStoryIds;
        childUserStories = _.filter(this.userStories, function (userStory) {
          return parentUserStoryIds.includes(userStory.userStoryId);
        })
        if (childUserStories.length > 0) {
          selectedNewStories = childUserStories[0].subUserStoriesList;
        }

        if (this.userStoriesIds.length > 1) {
          if (this.ownerUserId) {
            selectedNewStories = _.filter(selectedNewStories, function (userStory) {
              var ownerUserListArray = this.ownerUserId.split(",");
              return ownerUserListArray.includes(userStory.ownerUserId);
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
    this.selectedUserStoriesString.emit(this.showCheckBox);
  }

  updateMultipleUserStoriesFromSprint(userStoryModel) {
    userStoryModel.UserStoryIds = this.selectedUserStories;
    userStoryModel.parentUserStoryIds = _.uniq(this.parentUserStoryIds);
    userStoryModel.isSprintUserstories = true;
    if (this.selectedUserStories.length > 0) {
      this.store.dispatch(new CreateMultipleSprintUserStoriesTriggered(userStoryModel));
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
    this.sprintSearchCriteriaModel.pageNumber = this.pageNumber;
    this.sprintSearchCriteriaModel.pageSize = this.pageSize;
    this.store.dispatch(new GetSprintWorkItemTriggered(this.sprintSearchCriteriaModel));
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy("reOrderItems");
    this.ngDestroyed$.next();
  }

  LogAction(event) {
    if (event.userStoryLogTime != undefined && event.userStoryLogTime != null)
      event.userStoryLogTime.isFromSprint = true;

    if (!event.userStoryLogTime.endTime) {
      var userStory = this.userStories.find(obj => { return (obj.startTime != null || obj.startTime != undefined) && !obj.endTime });
      if (!userStory) { userStory = this.findSubUserstoryTime(); }
      if (userStory && (event.userStoryLogTime.userStoryId != userStory.userStoryId)) {
        var userStoryLogTime = new UserStoryLogTimeModel();
        userStoryLogTime.userStoryId = userStory.userStoryId;
        userStoryLogTime.startTime = userStory.startTime;
        userStoryLogTime.endTime = new Date();
        userStoryLogTime.parentUserStoryId = userStory.parentUserStoryId;
        userStoryLogTime.isFromSprint = true;
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

  
  filterUserStoriesBySelectedStatus(userStoryStatusId) {
    if (this.sprint.sprintId == '00000000-0000-0000-0000-000000000000') {
      this.sprintSearchCriteriaModel.userStoryStatusIds = userStoryStatusId;
      this.pageNumber = 1;
      this.pageIndex = 0;
      this.pageSize = 50;
      this.sprintSearchCriteriaModel.pageNumber = this.pageNumber;
      this.sprintSearchCriteriaModel.pageSize = this.pageSize;
      this.sprintSearchCriteriaModel.isForFilters = true;
      this.sprintSearchCriteriaModel.isGoalsPage = true;
      this.store.dispatch(new GetSprintWorkItemTriggered(this.sprintSearchCriteriaModel));
    } else {
      this.userStoryStatusList = userStoryStatusId;
      this.cdRef.detectChanges();
    }
  }

}