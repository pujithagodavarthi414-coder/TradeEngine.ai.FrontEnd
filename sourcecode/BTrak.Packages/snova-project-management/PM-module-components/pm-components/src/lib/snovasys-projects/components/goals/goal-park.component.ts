// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";

// tslint:disable-next-line: ordered-imports
import { GoalActionTypes } from "../../store/actions/goal.actions";
import * as GoalActions from "../../store/actions/goal.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";

import { GoalModel } from "../../models/GoalModel";
import { ParkGoalInputModel } from "../../models/ParkGoalInputModel";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-component-goal-park",
  templateUrl: "goal-park.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalParkComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() goal: GoalModel;

  @Input() goalId: string;
  set setgoal(goalId: string) {
    this.goalId = goalId;
  }
  @Input() projectId: string;
  set setproject(projectId: string) {
    this.projectId = projectId;
  }
  @Input() isParked: boolean;
  set setisParked(isParked: boolean) {
    this.isParked = isParked;
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
  @ViewChild("parkPopover") parkgoalPopover: SatPopover;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  tab: string;
  projectLabel: string;
  goalLabel: string;
  public ngDestroyed$ = new Subject();
  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe
  ) {

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.ParkGoalCompleted),
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

    this.route.params.subscribe((params) => {
      this.tab = params["tab"];
    });
  }
  ngOnInit(): void {
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.parkGoalLoading)
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

  ParkGoal() {
    const parkedGoalModel = new ParkGoalInputModel();
    parkedGoalModel.goalId = this.goalId;
    parkedGoalModel.timeStamp = this.timeStamp;
    parkedGoalModel.projectId = this.projectId;
    parkedGoalModel.isUniquePage = this.isGoalUniquePage;
    const goalLabel = this.softLabelPipe.transform("Goal", this.softLabels);
    if (this.isParked === true) {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Resumed " + goalLabel + "", this.goalName, 1);
      parkedGoalModel.park = false;
    } else {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Parked " + goalLabel + "", this.goalName, 1);
      parkedGoalModel.park = true;
    }
    this.store.dispatch(new GoalActions.ParkGoalTriggered(parkedGoalModel));

  }

  closeDialog() {
    this.closePopup.emit("");
    const popover = this.parkgoalPopover;
    if (popover) { popover.close(); }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
