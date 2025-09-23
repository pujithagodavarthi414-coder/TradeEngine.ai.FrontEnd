// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
// tslint:disable-next-line: ordered-imports
import { processDashboard } from "../../models/processDashboard";
import { ProjectMember } from "../../models/projectMember";
// tslint:disable-next-line: ordered-imports
import * as GoalActions from "../../store/actions/goal.actions";
import { GoalActionTypes } from "../../store/actions/goal.actions";
import { LoadProcessDashboardStatusTriggered } from "../../store/actions/process-dashboard-status.action";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { GoalOrderPipe } from "../../pipes/goal-order.pipes";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SortByGoalPipe } from '../../pipes/sortComparator.pipes';

@Component({
  selector: "gc-goal-list",
  templateUrl: "goal-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onClick($event)"
  }
})

export class GoalListComponent extends AppFeatureBaseComponent implements OnInit {
  userId: string;
  isFiltersVisible = false;
  @Input("goalSearchCriteria")
  set setGoalSearchCriteria(goalSearchCriteria: GoalSearchCriteriaInputModel) {
    this.goalSearchCriteria = goalSearchCriteria;
    this.goalStatusId = this.goalSearchCriteria.goalStatusId;
    if (this.goalStatusId && this.goalStatusId.toLowerCase() == ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
    if (!goalSearchCriteria.isFromSubquery) {
      if (goalSearchCriteria) {
        if (this.projectId !== goalSearchCriteria.projectId) {
          this.searchText = null;
          this.selectedColor = null;
          this.isSelected = [];
          this.isSelectedMembers = [];
          this.selectedResponsiblePersonlist = [];
          this.goalResponsiblePerson = null;
        }
        this.projectId = goalSearchCriteria.projectId;
        this.searchText = null;
        this.goalListOccurence = 0;
        if (this.goalSearchCriteria.projectId && !this.goalSearchCriteria.isGoalsPage && !this.goalSearchCriteria.isAdvancedSearch) {
          this.store.dispatch(new LoadMemberProjectsTriggered(this.goalSearchCriteria.projectId));
        }
        if (this.goalSearchCriteria.isGoalsPage) {
          localStorage.setItem("allgoals", "true");
          this.store.dispatch(new GoalActions.SearchAllGoals(this.goalSearchCriteria));
        } else if (!this.goalSearchCriteria.isGoalsPage) {
          localStorage.setItem("allgoals", "false");
          this.store.dispatch(new GoalActions.Search(this.goalSearchCriteria));
        }
      }
    }
  }

  @Input("Ids")
  set _Ids(Ids) {
    if (Ids) {
      this.Ids = Ids;
      this.fromCustomApp = true;
      let goalSearchCriteriaTemp = new GoalSearchCriteriaInputModel();
      goalSearchCriteriaTemp.goalIds = this.Ids;
      this.store.dispatch(new GoalActions.Search(goalSearchCriteriaTemp));
    }
  }

  @Input('isTestrailEnable')
  set _isTestrailEnable(data: boolean) {
    this.isTestrailEnable = data;
  }

  @Input("isGoalsFiltersVisible")
  set _isFiltersVisible(data: boolean) {
    if (data || data == false) {
      this.isGoalsFiltersVisible = data;
    }
  }
  @Input("userStoriesCount")
  set _userStoriesCount(data: number) {
   this.userStoriesCount = data;
  }

  @Input() selectedGoalId: string;
  @Input() uniquegoalpage: boolean;
  // tslint:disable-next-line: ban-types
  @Output() selectGoal = new EventEmitter<Object>();
  @Output() clearGoalSelection = new EventEmitter<GoalModel>();
  @Output() getAllGoalsCount = new EventEmitter<number>();
  @Output() changeUserStoryGoal = new EventEmitter<string>();
  @ViewChildren("addGoalPopover") addGoalPopovers;
  goals$: Observable<GoalModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  goals: GoalModel[] = [];
  Ids: string;
  userStoriesCount: number;
  showDropdown: boolean;
  fromCustomApp: boolean = false;
  isGoalsFiltersVisible: boolean = false;
  isTestrailEnable: boolean;
  processDashboardStatus$: Observable<processDashboard[]>;
  anyOperationInProgress$: Observable<boolean>;
  projectMembers$: Observable<ProjectMember[]>;
  searchText: string = null;
  selectedGoalModel: GoalModel;
  selectedGoalStatusColor = [];
  isSelected: any[] = [];
  isSelectedMembers: any[] = [];
  selectedResponsiblePersonlist: any = [];
  goalResponsiblePerson: string;
  searchGoalTags: string;
  selectedColor: string;
  projectId: string;
  showUsersList: boolean;
  showColoursList: boolean;
  divActivate: boolean;
  goalListOccurence = 0;
  goalsCount = 0;
  titleText: string;
  goalSearchCriteria: GoalSearchCriteriaInputModel;
  public ngDestroyed$ = new Subject();
  refreshUserStoriesCall = true;
  updatedGoal$: Observable<GoalModel>;
  updatedGoal: GoalModel;
  selectedTab: string;
  isSameGoal: boolean;
  isProcessDashboardStatusColor: boolean;
  goalStatusId: string;
  isAscending = true;
  sortBy: any;
  sortFilter: string;
  projectLabel: string;
  goalLabel: string;
  isGoalsRefresh: boolean;
  openGoalForm = false;
  clearCreateForm = true;
  colorList: any;

  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private _el: ElementRef,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private goalOrderPipe: GoalOrderPipe
  ) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.SearchComplete),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe(x => this.goals = x);
          this.isGoalsRefresh = false;
          //this.goalSearchCriteria.sortBy = null;
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.RefreshGoalsList),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe(x => this.goals = x);
          this.isGoalsRefresh = true;
          this.refreshUserStoriesCall = true;
          this.goalListOccurence = 0;
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.UpdateGoalList),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe(x => this.goals = x);
          this.isGoalsRefresh = false;
          this.refreshUserStoriesCall = false;
          if (localStorage.getItem("isUniquePage")) {
            localStorage.removeItem("isUniquePage");
            return;
          }
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.GetGoalDetailsByMultipleGoalIdsCompleted),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe(x => this.goals = x);
          this.isGoalsRefresh = false;
          this.refreshUserStoriesCall = false;
          if (localStorage.getItem("isUniquePage")) {
            localStorage.removeItem("isUniquePage");
            return;
          }
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.ArchiveGoalCompleted),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe(x => this.goals = x);
          this.isGoalsRefresh = false;
          this.goalListOccurence = 0;
          this.refreshUserStoriesCall = false;
          localStorage.removeItem("goalDetails");
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.ParkGoalCompleted),
        tap(() => {
          this.goals$ = this.store.pipe(
            select(projectModuleReducer.getgoalsAll))
          this.goals$.subscribe((x) => this.goals = x);
          this.goalListOccurence = 0;
          this.isGoalsRefresh = false;
          this.refreshUserStoriesCall = false;
          localStorage.removeItem("goalDetails");
          this.getGoalDetails(this.goals);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          this.projectMembers$ = this.store.pipe(
            select(projectModuleReducer.getProjectMembersAll)
          );
        })
      )
      .subscribe();
    this.route.params.subscribe((params) => {
      this.selectedTab = params["tab"];
      if (this.selectedTab === "replan-goals" || this.selectedTab === "parked-goals" || this.selectedTab === "archived-goals") {
        this.isProcessDashboardStatusColor = false;
      } else {
        this.isProcessDashboardStatusColor = true;
      }
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.store.dispatch(new LoadProcessDashboardStatusTriggered());
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.goalsLoadingInProgress)
    );
    this.processDashboardStatus$ = this.store.pipe(
      select(projectModuleReducer.getProcessDashboardStatusAll)
    );
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  getGoalDetails(goals) {
    this.goals = goals;
    if (this.goalStatusId && this.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.goals = this.goalOrderPipe.transform(this.goals, this.goalSearchCriteria);
    }
    if (this.goalSearchCriteria && !this.goalSearchCriteria.isGoalsPage && this.selectedTab !== "backlog-goals") {
      this.goals = this.goals.sort((a, b) => {
        return (new Date(b.updatedDateTime) as any) - (new Date(a.updatedDateTime) as any);
      });
    }

    this.getAllGoalsCount.emit(this.goals.length);
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActions.GoalActionTypes.SearchComplete),
        tap(() => {
          this.goalListOccurence = 0;
        })
      )
      .subscribe();
    if (localStorage.getItem("goalDetails")) {
      localStorage.removeItem("goalDetails");
      this.refreshUserStoriesCall = false;
      this.goalListOccurence = 1;
    } else if (localStorage.getItem("goalEdit")) {
      this.refreshUserStoriesCall = false;
      this.goalListOccurence = 1;
    } else {
      this.goalListOccurence = 0;
      this.refreshUserStoriesCall = true;
    }
    this.goalListOccurence = this.goalListOccurence + 1;
    if (localStorage.getItem("isUniquePage")) {
      localStorage.removeItem("isUniquePage");
      this.goalListOccurence = 0;
      this.refreshUserStoriesCall = false;
    }
    if (this.goals.length > 0) {
      if (this.goalListOccurence <= 1) {
        this.refreshUserStoriesCall = true;
      } else {
        this.refreshUserStoriesCall = false;
      }
      if (this.refreshUserStoriesCall) {

        if (this.isGoalsRefresh) {
          this.selectedGoalId = this.goals[1].goalId;
          this.selectedGoalModel = this.goals[1];
          this.selectGoal.emit({ goal: this.goals[1], checked: this.refreshUserStoriesCall });
        } else {
          this.selectedGoalId = this.goals[0].goalId;
          this.selectedGoalModel = this.goals[0];
          this.selectGoal.emit({ goal: this.goals[0], checked: this.refreshUserStoriesCall });
        }
      } else {
        this.updatedGoal$ = this.store.pipe(select(projectModuleReducer.getUpdatedGoal));
        this.updatedGoal$.subscribe((x) => this.updatedGoal = x);
        if (this.updatedGoal) {
          if (this.updatedGoal.goalId === this.selectedGoalModel.goalId) {
            this.selectedGoalModel = this.updatedGoal;
            this.isSameGoal = true;
          } else {
            this.isSameGoal = false;
          }
          if ((localStorage.getItem("goalEdit"))) {
            if ((localStorage.getItem("boardtypeChanged") === "true")) {
              localStorage.removeItem("boardtypeChanged");
              localStorage.removeItem("goalEdit");
              if (this.isSameGoal) {
                this.refreshUserStoriesCall = true;
              } else {
                this.refreshUserStoriesCall = false;
              }
            } else {
              this.refreshUserStoriesCall = false;
              localStorage.removeItem("boardtypeChanged");
              localStorage.removeItem("goalEdit");
            }
            this.selectGoal.emit({ goal: this.selectedGoalModel, checked: this.refreshUserStoriesCall });
            // tslint:disable-next-line: max-line-length
          } else if ((localStorage.getItem("boardtypeChanged") === "false") && (localStorage.getItem("bugToGoalAdded") === null) || (localStorage.getItem("bugToGoalAdded") === undefined)) {
            localStorage.removeItem("boardtypeChanged");
          } else {
            localStorage.removeItem("bugToGoalAdded");
          }
        } else if (this.goalSearchCriteria.isGoalsPage) {
        }
        else {
          this.selectedGoalModel = this.goals[0];
          this.selectedGoalId = this.goals[0].goalId;
          this.selectGoal.emit({ goal: this.goals[0], checked: true });
        }
      }
    } else {
      this.clearGoalSelection.emit();
    }
  }
  closeSearch() {
    this.searchText = null;
  }

  setMyStyles(color) {
    // tslint:disable-next-line:prefer-const
    let styles = {
      "background-color": color

    };
    return styles;
  }

  selectGoalStatusColor(goalStatus) {
    const index = this.selectedGoalStatusColor.indexOf(goalStatus);
    if (index > -1) {
      this.selectedGoalStatusColor.splice(index, 1);
    } else {
      this.selectedGoalStatusColor.push(goalStatus);
    }
    this.selectedColor = this.selectedGoalStatusColor.toString();
    this.colorList = this.selectedGoalStatusColor;
    if (this.selectedGoalStatusColor.length == 0) {
      this.colorList = undefined;
    }
  }
  handleClickOnGoalSummaryComponent(selectedGoalModel: GoalModel) {
    this.selectedGoalModel = selectedGoalModel;
    this.selectedGoalId = selectedGoalModel.goalId;
    this.selectGoal.emit({ goal: selectedGoalModel, checked: true });
  }
  toggleUsers() {
    this.showUsersList = !this.showUsersList;
  }
  toggleColours() {
    this.showColoursList = !this.showColoursList;
  }
  clickEvent(event) {
    this.divActivate = !this.divActivate;
    this.toggleUsers();
    this.toggleColours();
  }
  GetAssigne(userId, isChecked, selectedIndex) {
    if (isChecked) {
      this.selectedResponsiblePersonlist.push(userId);
      this.isSelected[selectedIndex] = true;
    } else {
      const index = this.selectedResponsiblePersonlist.indexOf(userId);
      this.selectedResponsiblePersonlist.splice(index, 1);
      this.isSelected[selectedIndex] = false;
    }
    this.goalResponsiblePerson = this.selectedResponsiblePersonlist.toString();
  }
  onChangePermission(event) {
    const goalSearchCriteriaInputModel = new GoalSearchCriteriaInputModel();
    goalSearchCriteriaInputModel.projectId = this.goalSearchCriteria.projectId;
    goalSearchCriteriaInputModel.goalStatusId = this.goalSearchCriteria.goalStatusId;
    goalSearchCriteriaInputModel.userStoryStatusId = this.goalSearchCriteria.userStoryStatusId;
    goalSearchCriteriaInputModel.isArchived = this.goalSearchCriteria.isArchived;
    goalSearchCriteriaInputModel.isParked = this.goalSearchCriteria.isParked;
    goalSearchCriteriaInputModel.isGoalsPage = this.goalSearchCriteria.isGoalsPage;
    this.sortBy = event.value;
    if (this.sortBy === 0) {
      goalSearchCriteriaInputModel.sortBy = "GoalShortName";
    } else {
      goalSearchCriteriaInputModel.sortBy = "OnBoardProcessDate";
    }
    this.sortFilter = goalSearchCriteriaInputModel.sortBy;
    goalSearchCriteriaInputModel.sortDirectionAsc = this.isAscending;
    this.goalSearchCriteria = goalSearchCriteriaInputModel;
  }

  getAllGoalsByFilterContext() {
    const goalSearchCriteriaInputModel = new GoalSearchCriteriaInputModel();
    goalSearchCriteriaInputModel.projectId = this.goalSearchCriteria.projectId;
    goalSearchCriteriaInputModel.goalStatusId = this.goalSearchCriteria.goalStatusId;
    goalSearchCriteriaInputModel.userStoryStatusId = this.goalSearchCriteria.userStoryStatusId;
    goalSearchCriteriaInputModel.isArchived = this.goalSearchCriteria.isArchived;
    goalSearchCriteriaInputModel.isParked = this.goalSearchCriteria.isParked;
    goalSearchCriteriaInputModel.sortDirectionAsc = this.isAscending;
    goalSearchCriteriaInputModel.sortBy = this.sortFilter;
    goalSearchCriteriaInputModel.isGoalsPage = this.goalSearchCriteria.isGoalsPage;
    this.goalSearchCriteria = goalSearchCriteriaInputModel;
  }
  showFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  getSelectedMember(userId, selectedIndex) {
    const index = this.selectedResponsiblePersonlist.indexOf(userId);
    if (index > -1) {
      this.selectedResponsiblePersonlist.splice(index, 1);
      this.isSelectedMembers[selectedIndex] = false;
    } else {
      this.selectedResponsiblePersonlist.push(userId);
      this.isSelectedMembers[selectedIndex] = true;
    }
    this.goalResponsiblePerson = this.selectedResponsiblePersonlist.toString();
  }
  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
  closeAssigneeDropdown() {
    this.showUsersList = false;
  }
  onClick(event) {
    if (!this._el.nativeElement.contains(event.target)) {
      this.closeAssigneeDropdown();
    }
  }
  selectedGoal(goalId) {
    this.changeUserStoryGoal.emit(goalId);
  }
  closeGoalSearch() {
    this.searchGoalTags = null;
  }

  resetAllFilters() {

    this.searchText = null;
    this.sortBy = null;
    this.isAscending = true;
    this.searchGoalTags = null;
    this.selectedColor = null;
    this.isSelectedMembers = [];
    this.selectedGoalStatusColor = [];
    this.selectedResponsiblePersonlist = [];
    this.isSelected = [];
    this.goalResponsiblePerson = null;
    this.colorList = undefined;
  }

  clearGoalForm() {
    this.openGoalForm = !this.openGoalForm;
    this.clearCreateForm = !this.clearCreateForm;
  }

  closeGoalDialog() {
    this.openGoalForm = !this.openGoalForm;
    this.addGoalPopovers.forEach((p: { closePopover: () => void; }) => p.closePopover());
  }

  setHeights() {
    if (!this.isGoalsFiltersVisible && this.goalSearchCriteria && this.goalSearchCriteria.isGoalsPage) {
      let styles = {
        height: 'calc(100vh - 226px)'
      }
      return styles;
    }
    else if (this.isGoalsFiltersVisible && this.goalSearchCriteria && this.goalSearchCriteria.isGoalsPage) {
      let styles = {
        height: 'calc(100vh - 250px)'
      }
      return styles;
    }
  }
}