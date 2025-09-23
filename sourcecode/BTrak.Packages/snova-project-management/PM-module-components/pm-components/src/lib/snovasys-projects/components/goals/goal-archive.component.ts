// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
// tslint:disable-next-line: ordered-imports
import { GoalActionTypes, ArchiveGoalTriggered } from "../../store/actions/goal.actions";

import { ArchiveGoalInputModel } from "../../models/ArchiveGoalInputModel";
import { GoalModel } from "../../models/GoalModel";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-component-goal-archive",
  templateUrl: "goal-archive.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalArchiveComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("archivePopover") archivegoalPopover: SatPopover;
  anyOperationInProgress: boolean;

  @Input() goalId: string;
  set setgoal(goalId: string) {
    this.goalId = goalId;
  }
  @Input() projectId: string;
  set setproject(projectId: string) {
    this.projectId = projectId;
  }
  @Input() isArchived: boolean;
  set setisArchived(isArchived: boolean) {
    this.isArchived = isArchived;
  }
  @Input() timeStamp: boolean;
  set settimeStamp(timeStamp: boolean) {
    this.timeStamp = timeStamp;
  }
  @Input() isGoalUniquePage: boolean;
  set setisGoalUniquePage(isGoalUniquePage: boolean) {
    this.isGoalUniquePage = isGoalUniquePage;
  }
  @Input() goalName: string;
  set setGoalName(goalName: string) {
    this.goalName = goalName;
  }

  @Output() closePopup = new EventEmitter<string>();
  @Output() submitClosePopup = new EventEmitter<string>();
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  goals$: Observable<GoalModel[]>;
  updatedGoal$: Observable<GoalModel[]>;
  exceptionMessage$: Observable<string>;
  validationMessages$: Observable<string[]>;
  exceptionMessage: any;
  filteredGoalIds = [];
  validationMessages: any[];
  tab: string;
  projectLabel: string;
  goalLabel: string;
  public ngDestroyed$ = new Subject();
  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe
  ) {
    this.route.params.subscribe((params) => {
      this.tab = params["tab"];
    });

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ArchiveGoalCompleted),
        tap(() => {
          this.closePopup.emit("");
          this.closeDialog();
          // this.resetGoals();
          if (this.isGoalUniquePage) {
            this.submitClosePopup.emit("");
          } else {
            this.closePopup.emit("");
          }
        })
      )
      .subscribe();

    this.goals$ = this.store.pipe(select(projectModuleReducer.getgoalsAll));
    this.goals$.subscribe((result) => {
      const goals = result;
      this.filteredGoalIds = [];
      if (goals.length > 0) {
        goals.forEach((x) => {
          this.filteredGoalIds.push(x.goalId);
        })
        this.cdRef.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.archiveGoalLoading)
    );
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

  archiveGoal() {
    this.updatedGoal$ = this.store.pipe(select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: this.goalId }));
    let goalsList: GoalModel[];
    this.updatedGoal$.subscribe((x) => goalsList = x);
    const archivedGoalModel = new ArchiveGoalInputModel();
    archivedGoalModel.goalId = this.goalId;
    archivedGoalModel.multipleGoalIds = this.filteredGoalIds.length > 0 ? this.filteredGoalIds.toString() : null;
    if(goalsList.length > 0) {
      archivedGoalModel.timeStamp = goalsList[0].timeStamp;
    }
    else {
      archivedGoalModel.timeStamp = this.timeStamp;
    }
    archivedGoalModel.isUniquePage = this.isGoalUniquePage;
    archivedGoalModel.projectId = this.projectId;
   
    const goalLabel = this.softLabelPipe.transform("Goal", this.softLabels);
    if (this.isArchived === true) {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Unarchive " + goalLabel + "", this.goalName, 1);
      archivedGoalModel.archive = false;
    } else {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Archive " + goalLabel + "", this.goalName, 1);
      archivedGoalModel.archive = true;
    }
    this.store.dispatch(new ArchiveGoalTriggered(archivedGoalModel));
  }

  closeDialog() {
    this.closePopup.emit("");
    const popover = this.archivegoalPopover;
    if (popover) { popover.close(); }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
