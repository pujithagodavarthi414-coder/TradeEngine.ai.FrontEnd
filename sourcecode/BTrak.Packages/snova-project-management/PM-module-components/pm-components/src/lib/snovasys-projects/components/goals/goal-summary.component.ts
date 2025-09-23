
// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:max-line-length
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { Store, select } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute, Router } from "@angular/router";
import { Guid } from "guid-typescript";
import { Observable, Subject } from "rxjs";
import * as _ from "underscore";
// tslint:disable-next-line: ordered-imports
import { take, tap, takeUntil } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { ofType, Actions } from "@ngrx/effects";

import { GoalActionTypes } from "../../store/actions/goal.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";

// tslint:disable-next-line: ordered-imports
import { DatePipe } from "@angular/common";
// tslint:disable-next-line:ordered-imports
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GoalModel } from "../../models/GoalModel";
import { TemplateModel } from "../../models/templates-model";
import { InsertDuplicateTemplateTriggered, TemplateActionTypes } from "../../store/actions/templates.action";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TestCase } from '@snovasys/snova-testrepo';
import * as testRailModuleReducers from "@snovasys/snova-testrepo"
import { LoadBugsByGoalIdTriggered } from '@snovasys/snova-testrepo';
import { UserStoryActionTypes } from '../../store/actions/userStory.actions';
import { UserStory } from '../../models/userStory';
import * as projectModuleReducer from "../../store/reducers/index"
@Component({
  selector: "gc-goal-summary",
  templateUrl: "goal-summary.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalSummaryComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("goal")
  set _goal(data: GoalModel) {
    this.expansionIcon = false;
    this.panelOpenState = false;
    this.goal = data;
    if (this.goal.projectId) {
      this.getEntityRolePermissions(this.goal.projectId);
    }
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isActiveGoalStatusId = true;
    } else {
      this.isActiveGoalStatusId = false;
    }
    if (this.goal.inActiveDateTime) {
      this.isArchived = true;
      this.isParked = false;
      this.isEdit = false;
      this.isArchivedGoal = this.isArchived;
      this.isParkedGoal = this.isParked;
    } else if (this.goal.parkedDateTime) {
      this.isArchived = false;
      this.isParked = true;
      this.isEdit = false;
      this.isArchivedGoal = this.isArchived;
      this.isParkedGoal = this.isParked;
    } else {
      this.isArchived = true;
      this.isParked = true;
      this.isEdit = true;
      this.isArchivedGoal = false;
      this.isParkedGoal = false;
    }

    if (this.goal.goalName === "Backlog" && this.goal.goalShortName === "Backlog") {
      this.isBacklogGoal = true;
    } else {
      this.isBacklogGoal = false;
    }
    if(this.goal.tag) {
      this.goalInputTags = this.goal.tag.split(",");
    } else {
      this.goalInputTags = [];
    }

  }
  @Input("isAllGoalsPage")
  set _isAllGoalsPage(data: boolean) {
    this.isAllGoalsPage = data;
  }
  @Input("uniqueGoalPage")
  set _uniqueGoalPage(data: boolean) {
    this.uniqueGoalPage = data;
  }

  @Input("goalSelected")
  set _goalSelected(data: boolean) {
    this.goalSelected = data;
    this.expansionIcon = false;
    this.panelOpenState = false;
  }
  @Input("userStoriesCount")
  set _userStoriesCount(data: number) {
   this.userStoriesCount = data;
  }
  @Input() isAnyOperationIsInProgress = false;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChildren("goalBugsPopover") goalBugPopover;
  @ViewChild("editgoalPopover") editgoalPopover: SatPopover;
  @ViewChild("templatePopover") templatePopover: SatPopover;
  @Output() selectGoal = new EventEmitter<GoalModel>();
  @Output() selectGoalId = new EventEmitter<string>();
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  contextMenuPosition = { x: "0px", y: "0px" };
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  goalBugs$: Observable<TestCase[]>;
  userStoriesCount: number;
  userStories$: Observable<UserStory[]>;
  userStories: UserStory[];
  anyOperationInProgress$: Observable<boolean>;
  goalTagsOperationIsInProgress$: Observable<boolean>;
  anyOperationIsInProgress$: Observable<boolean>;
  templateOperationInProgress$: Observable<boolean>;
  goalOperationInProgress$: Observable<boolean>
  featuresList: EntityRoleFeatureModel[];
  editGoalForm: boolean;
  isBacklogGoal: boolean;
  superAgileBoardTypeId: string;
  KanbanBugsBoardTypeId: string;
  selectedTab: string;
  isParked: boolean;
  goal: GoalModel;
  boardTypeTooltipText: any;
  goalSelected: boolean;
  expansionIcon: boolean;
  isAllGoalsPage: boolean
  uniqueGoalPage: boolean;
  entityFeatureIds: any[];
  boardTypeIcon: string;
  isTagsPopUp: boolean;
  isArchived: boolean;
  isEdit: boolean;
  isableToSeeMatMenu: boolean;
  boardView = BoardTypeIds.BoardViewKey;
  uniqueNumberUrl: string;
  entityFeatureIdForArchiveGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_ArchiveGoal;
  entityFeatureIdForParkGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_ParkGoal;
  entityFeatureIdForEditGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateGoal;
  entityFeatureIdForViewGoal: Guid = EntityTypeFeatureIds.EntityTypeFeature_ViewGoals;
  Arr = Array;
  num = 4;
  isArchivedGoal: boolean;
  isParkedGoal: boolean;
  // tslint:disable-next-line:ban-types
  isPermissionForEditActiveGoal: Boolean;
  // tslint:disable-next-line:ban-types
  isPermissionForEditGoal: Boolean;
  public ngDestroyed$ = new Subject();
  panelOpenState: boolean;
  projectLabel: string;
  goalLabel: string;
  isActiveGoalStatusId: boolean;
  showBugs = false;
  isGoal = true;
  templateForm: FormGroup;
  goalInputTags: string[] = [];

  constructor(
    private store: Store<State>, private translateService: TranslateService,
    private route: ActivatedRoute,
    private testRailStore: Store<testRailModuleReducers.State>,
    private router: Router,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private snackbar: MatSnackBar) {
    super();
    this.route.params.subscribe((params) => {
      this.selectedTab = params["tab"];
    });
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ArchiveGoalCompleted),
        tap(() => {
          if (this.uniqueGoalPage) {
            this.router.navigate([
              "projects/projectstatus",
              this.goal.projectId,
              "active-goals"
            ]);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ParkGoalCompleted),
        tap(() => {
          if (this.uniqueGoalPage) {
            this.router.navigate([
              "projects/projectstatus",
              this.goal.projectId,
              "active-goals"
            ]);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TemplateActionTypes.InsertDuplicateTemplateCompleted),
        tap(() => {
          this.closeTemplatePopup();
          this.router.navigate([
            "projects/projectstatus",
            this.goal.projectId,
            "templates"
          ]);
        })
      ).subscribe();

    


    // this.actionUpdates$
    //   .pipe(
    //     takeUntil(this.ngDestroyed$),
    //     ofType(TemplateActionTypes.UpsertTemplatesFailed),
    //     tap(() => {
    //       this.closeTemplatePopup();
    //     })
    //   ).subscribe();

    this.initializeTemplateForm();
  }

  ngOnInit() {
    super.ngOnInit();
    this.isPermissionForEditGoal = this.canAccess_entityType_feature_AddOrUpdateGoal;
    this.isPermissionForEditActiveGoal = this.canAccess_entityType_feature_UpdateActiveGoal
    this.isGoal = true;
    this.superAgileBoardTypeId = BoardTypeIds.SuperAgileKey;
    this.KanbanBugsBoardTypeId = BoardTypeIds.KanbanBugsKey;
    this.anyOperationInProgress$ = this.testRailStore.pipe(select(testRailModuleReducers.getBugsByGoalIdLoading));
    this.goalTagsOperationIsInProgress$ = this.store.pipe(select(projectModuleReducers.goalTagsLoading));
    this.goalOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getUniqueGoalByIdLoading));
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  editGoal() {
    this.editGoalForm = !this.editGoalForm;
  }

  closeGoalPopup() {

    this.triggers.toArray()[0].closeMenu();
    const popover = this.editgoalPopover;
    if (popover) { popover.close(); }
    this.editGoalForm = !this.editGoalForm;
  }

  getEntityRolePermissions(projectId) {
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    if (entityRolefeatures && entityRolefeatures.length > 0) {
      this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
        return role.projectId == projectId
      })
    }
  }
  backloagtranslate(name)
  {
    if (name == null || name == "")
    {
      return name;
    }
    name = name.trim();
    name = this.translateService.instant(name);
    return name;
  }

  checkPermissionsForMatMenu() {
    if (this.isAllGoalsPage && this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {

      let featurePermissions = [];
      if (this.entityRolePermisisons && this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        let entityFeatureIds: any[];
        entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForArchiveGoal = this.entityFeatureIdForArchiveGoal.toString().toLowerCase();
          const entityTypeFeatureForParkGoal = this.entityFeatureIdForParkGoal.toString().toLowerCase();
          const entityFeatureIdForEditGoal = this.entityFeatureIdForEditGoal.toString().toLowerCase();
          const entityFeatureIdForViewGoal = this.entityFeatureIdForViewGoal.toString().toLowerCase();
          const entityFeatureIdForEditActiveGoal = EntityTypeFeatureIds.EntityTypeFeature_UpdateActiveGoal.toString().toLowerCase();

          // tslint:disable-next-line: only-arrow-functions
          const archivedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveGoal)
          })
          // tslint:disable-next-line: only-arrow-functions
          const parkedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkGoal)
          })
          // tslint:disable-next-line: only-arrow-functions
          const editGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForEditGoal)
          })

          const viewGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForViewGoal)
          })

          // tslint:disable-next-line: only-arrow-functions


          // tslint:disable-next-line: triple-equals
          if (archivedGoalPermisisonsList.length > 0 || parkedGoalPermisisonsList.length > 0 ||
            // tslint:disable-next-line: triple-equals
            // tslint:disable-next-line: max-line-length
            (editGoalPermisisonsList.length > 0) || (viewGoalPermisisonsList.length > 0)) {
            return true;
          }
        }
        return false;
      }
    }
  }

  togglePermissions() {
    // tslint:disable-next-line: max-line-length
    if (this.goal.goalId.toLowerCase() === ConstantVariables.MissingFeaturesGoalId.toLowerCase() || this.goal.goalId.toLowerCase() === ConstantVariables.FeedbackBugsGoalId.toLowerCase()) {
      return false;
    } else {
      return true;
    }
  }

  checkPermissionForArchiveGoal() {
    if (this.isAllGoalsPage && this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        this.entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForArchiveGoal = this.entityFeatureIdForArchiveGoal.toString().toLowerCase();
          // tslint:disable-next-line: prefer-const
          // tslint:disable-next-line: only-arrow-functions
          const archivedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForArchiveGoal)
          })
          if (archivedGoalPermisisonsList.length) {
            return true;
          }
        }
      }
    }
  }

  checkPermissionForParkGoal() {
    if (this.isAllGoalsPage && this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        this.entityFeatureIds = featurePermissions.map((x) => x.entityFeatureId);
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForParkGoal = this.entityFeatureIdForParkGoal.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const parkedGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForParkGoal)
          })
          if (parkedGoalPermisisonsList.length) {
            return true;
          }
        }
      }
    }
  }

  checkPermissionsForEditGoal() {
    if (this.goal.goalId !== "00000000-0000-0000-0000-000000000000" && this.isAllGoalsPage) {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        if (featurePermissions.length > 0) {
          const entityFeatureIdForEditActiveGoal = EntityTypeFeatureIds.EntityTypeFeature_UpdateActiveGoal.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const entityFeatureIdForEditGoal = this.entityFeatureIdForEditGoal.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const editGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityFeatureIdForEditGoal)
          })
          if (editGoalPermisisonsList.length > 0) {
            return true;
          } else {
            return false;
          }
        }
      }
    } else if (!this.isAllGoalsPage) {
      if (this.isPermissionForEditGoal) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkPermissionsForEditActiveGoal(activePermission, inactivePermission) {
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      if (activePermission) {
        return true;
      } else {
        return false;
      }
    } else {
      if (inactivePermission) {
        return true;
      } else {
        return false;
      }
    }
  }

  setBorderColorForGoal() {
    if (this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      return "#ff141c"
    } else if (this.goal.inActiveDateTime || this.goal.parkedDateTime) {
      return "#ffffff";
    } else {
      return this.goal.goalStatusColor;
    }
  }

  closeMatMenu() {
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  boardTypeTooltip(boardTypeId) {
    if (!boardTypeId) {
      return "";
    }

    if (boardTypeId.toUpperCase() === BoardTypeIds.KanbanBugsKey) {
      this.boardTypeTooltipText = this.translateService.instant("BUGBOARD");
    }
    if (boardTypeId.toUpperCase() === BoardTypeIds.KanbanKey) {
      this.boardTypeTooltipText = this.translateService.instant("KANBAN");
    }
    if (boardTypeId.toUpperCase() === BoardTypeIds.SuperAgileKey) {
      this.boardTypeTooltipText = this.translateService.instant("SUPERAGILE");
    }
    if (boardTypeId.toUpperCase() === BoardTypeIds.ApiKey) {
      this.boardTypeTooltipText = this.translateService.instant("APIBOARD");
    }
  }

  checkTooltip(goal) {
    if(goal.boardTypeUiId == BoardTypeIds.BoardViewKey.toLowerCase()) {
      if(goal.isBugBoard) {
          return this.translateService.instant("GOALS.BOARDVIEWBUGSTOOLTIP")
      } else {
        if(goal.isSuperAgileBoard) {
          return this.translateService.instant("GOALS.LISTVIEWTOOLTIP")
        } else {
          return this.translateService.instant("GOALS.BOARDVIEWTOOLTIP")
        }
      }
    } else {
      if(goal.isBugBoard) {
         return this.translateService.instant("GOALS.LISTVIEWBUGSTOOLTIP")
      } else {
        if(goal.isSuperAgileBoard) {
          return this.translateService.instant("GOALS.LISTVIEWTOOLTIP")
        } else {
          return this.translateService.instant("GOALS.BOARDVIEWTOOLTIP")
        }
      }
    }
  }

  openContextMenu(event: MouseEvent) {
    event.preventDefault();
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      console.log(event);
      this.contextMenuPosition.x = (event.clientX) + "px";
      this.contextMenuPosition.y = (event.clientY - 30) + "px";
      contextMenu.openMenu();
    }
  }

  loadBugs() {
    const testCaseSearch = new TestCase();
    testCaseSearch.goalId = this.goal.goalId;
    // testCaseSearch.testSuiteId = this.goal.testSuiteId;
    testCaseSearch.isArchived = false;
    this.testRailStore.dispatch(new LoadBugsByGoalIdTriggered(testCaseSearch));
    this.goalBugs$ = this.store.pipe(select(testRailModuleReducers.getBugsByGoalId));
  }

  openBugsPopover(bugPopover, bugsCount) {
    if (bugsCount > 0 && this.goal.inActiveDateTime == null && this.goal.parkedDateTime == null) {
      this.loadBugs();
      this.showBugs = true;
      bugPopover.openPopover();
    }
  }

  setColorForBugPriorityTypes(color) {
    const styles = {
      // tslint:disable-next-line: object-literal-key-quotes
      "color": color
    };
    return styles;
  }

  closeBugPopover() {
    this.showBugs = false;
    this.goalBugPopover.forEach((p) => p.closePopover());
  }

  navigateToGoalDetailsPage() {
    this.router.navigate([
      "goal",
      this.goal.goalId
    ]);
  }
  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, "");
    this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/goal/" + this.goal.goalId;
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    // tslint:disable-next-line: max-line-length
    this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, "");
    this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/goal/" + this.goal.goalId;
    window.open(this.uniqueNumberUrl, "_blank");
  }

  getGoalId(goalId) {
    this.selectGoalId.emit(goalId);
  }

  openTagsPopUp() {
    this.isTagsPopUp = !this.isTagsPopUp;
  }

  closeTagsDialog() {
    this.isTagsPopUp = !this.isTagsPopUp;
    // tslint:disable-next-line: prefer-const
    let contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  click() {
    this.expansionIcon = !this.expansionIcon;
    if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      this.panelOpenState = false;
    } else {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  disabledMatEXpansion() {
    if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      return true;
    } else {
      return false;
    }
  }

  togglePanel() {
    this.expansionIcon = !this.expansionIcon;
    if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      this.panelOpenState = false;
    } else {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  makeTemplateGoal(goal) {
    let templateModel = new TemplateModel();
    templateModel = this.templateForm.value;
    templateModel.goalId = goal.goalId;
    templateModel.projectId = goal.projectId;
    // templateModel.templateResponsiblePersonId = goal.goalResponsibleUserId;
    // templateModel.onBoardProcessDate = goal.onboardProcessDate;
    this.store.dispatch(new InsertDuplicateTemplateTriggered(templateModel));
    this.templateOperationInProgress$ = this.store.pipe(select(projectModuleReducers.insertDuplicateTemplateLoading));
  }

  initializeTemplateForm() {
    this.templateForm = new FormGroup({
      templateName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)]))
    });
  }

  openTemplatePopover(goal) {
    this.initializeTemplateForm();
    this.templateForm.get("templateName").setValue(goal.goalName);
    this.templatePopover.open();
  }

  closeTemplatePopup() {
    this.triggers.toArray()[0].closeMenu();
    this.templatePopover.close();
    this.initializeTemplateForm();
  }

  configureDeadlineDateDisplay(deadLineDate, isConfigureDate) {
    if (isConfigureDate) {
      return this.datePipe.transform(deadLineDate, "dd MMM yyyy, h:mm a");
    } else {
      return this.datePipe.transform(deadLineDate, "dd MMM yyyy");
    }
  }
}
