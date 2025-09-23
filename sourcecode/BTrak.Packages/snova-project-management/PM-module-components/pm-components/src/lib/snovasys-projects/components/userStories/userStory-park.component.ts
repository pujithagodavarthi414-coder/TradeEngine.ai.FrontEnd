import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import * as projectModuleReducer from "../../store/reducers/index";

import * as userStoryActions from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";

import { ParkUserStoryInputModel } from "../../models/parkedUserstoryModel";
import { UserStory } from "../../models/userStory";
import { GoalModel } from "../../models/GoalModel";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";
import { LoadUserstoryLinksTriggered } from "../../store/actions/userstory-links.action";
import { ToastrService } from "ngx-toastr";
import { ProjectGoalsService } from "../../services/goals.service";
import { SprintWorkItemActionTypes, ParkSprintWorkItemTriggred } from "../../store/actions/sprint-userstories.action";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LoadLinksCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-component-park-userStory",
  templateUrl: "userStory-park.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryParkComponent implements OnInit {

  @Input("userStory")
  set _userStory(data: UserStory) {
    this.userStory = data;
    if (this.userStory && this.userStory.userStoryParkedDateTime) {
      this.isParked = false;
    }
    else {
      this.isParked = true;
    }
  }

  userstoryUniquePage
  @Input("userstoryUniquePage")
  set _userstoryUniquePage(data: boolean) {
    this.userstoryUniquePage = data;
  }


  @Input('isSubTaskPage')
  set _isSubTaskPage(data: boolean) {
    this.isSubTasksPage = data;
  }

  @Input("isSprintUserStories")
  set _isSprintUserStories(data: boolean) {
    this.isSprintUserStories = data;
  }

  @Input("isEditFromProjects")
  set _isEditFromProjects(data: boolean) {
    if (data === false) {
      this.isEditFromProjects = false;
    }
    else {
      this.isEditFromProjects = true;
    }
  }

  @Input("isAllGoalsPage")
  set _isAllGoalsPage(data: boolean) {
    this.isAllGoalsPage = data;
  }

  @Output() submitclosePopup = new EventEmitter<string>();
  @Output() closePopup = new EventEmitter<string>();
  anyOperationInProgress$: Observable<boolean>;
  parkOperationInProgress$: Observable<boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStory: UserStory;
  isSprintUserStories: boolean;
  isParked: boolean;
  isSubTasksPage: boolean;
  isEditFromProjects: boolean = true;
  parkProgress: boolean = false;
  isAllGoalsPage: boolean;
  validationMessage: string;
  goals$: Observable<GoalModel[]>;
  updatedGoal$: Observable<GoalModel[]>;
  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private projectGoalsService: ProjectGoalsService, private toastr: ToastrService, public googleAnalyticsService: GoogleAnalyticsService, private softLabelPipe: SoftLabelPipe) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ParkUserStoryCompleted),
        tap(() => {
          this.closePopup.emit("yes");
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.ParkSprintWorkItemCompleted),
        tap(() => {
          this.closePopup.emit("yes");
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.UpsertSubTaskCompleted),
        tap(() => {
          this.closePopup.emit('');
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ParkUniqueUserStoryCompleted),
        tap(() => {
          this.submitclosePopup.emit("yes");
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ParkSubTaskUserStoryCompleted),
        tap(() => {
          this.closePopup.emit('');
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.parkUserStoryInProgress)
    );

    this.parkOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.parkSubTaskUserStoryIsInProgress)
    );
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  IsParkedUserStory() {
    this.parkProgress = true;
    this.updatedGoal$ = this.store.pipe(select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: this.userStory.goalId }));
    let goalsList: GoalModel[];
    this.updatedGoal$.subscribe((x) => goalsList = x);
    var parkInputModel = new ParkUserStoryInputModel();
    if (goalsList && goalsList.length > 0 && !goalsList[0].isBugBoard) {
      parkInputModel.parentUserStoryId = this.userStory.parentUserStoryId;
    }
    parkInputModel.userStoryId = this.userStory.userStoryId;
    parkInputModel.isParked = this.isParked;
    parkInputModel.goalId = this.userStory.goalId;
    parkInputModel.sprintId = this.userStory.sprintId;
    parkInputModel.timeStamp = this.userStory.timeStamp;
    parkInputModel.IsFromSprint = false;
    parkInputModel.parentUserStoryGoalId = this.userStory.parentUserStoryGoalId;
    parkInputModel.parentUserStoryId = this.userStory.parentUserStoryId;
    parkInputModel.isSubTasksPage = this.isSubTasksPage;
    parkInputModel.isAllGoalsPage = this.isAllGoalsPage;
    localStorage.setItem("archivedUserStory", this.userStory.userStoryId);
    if (this.isEditFromProjects) {
      if (this.userstoryUniquePage && !this.isSprintUserStories) {
        this.store.dispatch(new userStoryActions.ParkUniqueUserStoryTriggered(parkInputModel));
      }
      else if (this.isSubTasksPage && !this.isSprintUserStories) {
        this.store.dispatch(new userStoryActions.ParkSubTaskUserStoryTriggered(parkInputModel));
      } else if (this.isSprintUserStories) {
        parkInputModel.IsFromSprint = true;
        this.store.dispatch(new ParkSprintWorkItemTriggred(parkInputModel));
      }
      else {
        this.store.dispatch(new userStoryActions.ParkUserStoryTriggered(parkInputModel));
      }
    }
    else {
      this.projectGoalsService.parkUserStory(parkInputModel).subscribe((result: any) => {
        if (result.success) {
          this.parkProgress = false;
          this.closePopup.emit('yes');
        }
        else {
          this.parkProgress = false;
          this.validationMessage = result.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessage);
        }
      });
    }
    let workItemLabel = this.softLabelPipe.transform("Work Item", this.softLabels);
    if (this.isParked)
      this.googleAnalyticsService.eventEmitter(workItemLabel, "Parked " + workItemLabel + "", this.userStory.userStoryName, 1);
    else
      this.googleAnalyticsService.eventEmitter(workItemLabel, "Resumed " + workItemLabel + "", this.userStory.userStoryName, 1);

  }

  closeDialog() {
    this.closePopup.emit("no");
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
