import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { Subject } from "rxjs";
import { tap, takeUntil } from "rxjs/operators";
import { LoadAuditRelatedCountsTriggered } from "@snovasys/snova-audits-module";

import * as userStoryActions from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import { UserStory } from "../../models/userStory";
import { ArchivedUserStoryInputModel } from "../../models/archivedUserStoryModel";
import { GoalModel } from "../../models/GoalModel";
import * as projectModuleReducer from "../../store/reducers/index";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";
import { LoadUserstoryLinksTriggered } from "../../store/actions/userstory-links.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { ToastrService } from "ngx-toastr";
import { ArchiveSprintWorkItemTriggred, SprintWorkItemActionTypes } from "../../store/actions/sprint-userstories.action";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LoadLinksCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-component-archive-userStory",
  templateUrl: "userStory-archive.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryArchiveComponent implements OnInit {

  @Input("userStory")
  set _userStory(data: UserStory) {
    this.userStory = data;
    if (this.userStory && this.userStory.userStoryArchivedDateTime) {
      this.isArchived = false;
    }
    else {
      this.isArchived = true;
    }
  }

  public ngDestroyed$ = new Subject();

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
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  goals$: Observable<GoalModel[]>;
  updatedGoal$: Observable<GoalModel[]>;
  anyOperationInProgress$: Observable<boolean>;
  archiveOperationInProgress$: Observable<boolean>;
  sprintOperationInProgress$: Observable<boolean>;
  userStory: UserStory;
  isArchived: boolean;
  isSubTasksPage: boolean;
  isSprintUserStories: boolean;
  isEditFromProjects: boolean = true;
  archiveProgress: boolean = false;
  isAllGoalsPage: boolean;
  validationMessage: string;

  constructor(private store: Store<State>, private projectGoalsService: ProjectGoalsService, private toastr: ToastrService, private actionUpdates$: Actions, public googleAnalyticsService: GoogleAnalyticsService, private softLabelPipe: SoftLabelPipe) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ArchiveUserStoryCompleted),
        tap(() => {
          this.closePopup.emit("yes");
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.ArchiveSprintWorkItemCompleted),
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
        ofType(userStoryActions.UserStoryActionTypes.ArchiveUniqueUserStoryCompleted),
        tap(() => {
          this.submitclosePopup.emit("yes");
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted),
        tap(() => {
          this.closePopup.emit('');
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.archiveUserStoryIsInProgress)
    );
    this.archiveOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.archiveSubTaskUserStoryIsInProgress)
    );

    this.sprintOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.archiveUserStoryLoading)
    );
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
     this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  IsArchivedUserStory() {
    this.archiveProgress = true;
    this.updatedGoal$ = this.store.pipe(select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: this.userStory.goalId }));
    let goalsList: GoalModel[];
    this.updatedGoal$.subscribe((x) => goalsList = x);
    var archivedUserStoryModel = new ArchivedUserStoryInputModel();
    if (goalsList && goalsList.length > 0 && !goalsList[0].isBugBoard) {
      archivedUserStoryModel.parentUserStoryId = this.userStory.parentUserStoryId;
    }
    archivedUserStoryModel.userStoryId = this.userStory.userStoryId;
    archivedUserStoryModel.isArchive = this.isArchived;
    archivedUserStoryModel.goalId = this.userStory.goalId;
    archivedUserStoryModel.timeStamp = this.userStory.timeStamp;
    archivedUserStoryModel.parentUserStoryGoalId = this.userStory.parentUserStoryGoalId;
    archivedUserStoryModel.IsFromSprint = false;
    archivedUserStoryModel.isSubTasksPage = this.isSubTasksPage;
    archivedUserStoryModel.sprintId = this.userStory.sprintId;
    archivedUserStoryModel.parentUserStoryId = this.userStory.parentUserStoryId;
    archivedUserStoryModel.isAllGoalsPage = this.isAllGoalsPage;
    localStorage.setItem("archivedUserStory", this.userStory.userStoryId);
    if (this.isEditFromProjects) {
      if (this.userstoryUniquePage && !this.isSprintUserStories) {
        this.store.dispatch(new userStoryActions.ArchivedUniqueUserStoryTriggered(archivedUserStoryModel));
      }
      else if (this.isSubTasksPage && !this.isSprintUserStories) {
        this.store.dispatch(new userStoryActions.ArchivedSubTaskUserStoryTriggered(archivedUserStoryModel));
      } else if (this.isSprintUserStories) {
        archivedUserStoryModel.IsFromSprint = true;
        this.store.dispatch(new ArchiveSprintWorkItemTriggred(archivedUserStoryModel));
      }
      else {
        this.store.dispatch(new userStoryActions.ArchivedUserStoryTriggered(archivedUserStoryModel));
      }
    }
    else {
      this.projectGoalsService.archiveUserStory(archivedUserStoryModel).subscribe((result: any) => {
        if (result.success) {
          this.store.dispatch(new LoadAuditRelatedCountsTriggered(this.userStory.projectId));
          this.archiveProgress = false;
          this.closePopup.emit('yes');
        }
        else {
          this.archiveProgress = false;
          this.validationMessage = result.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessage);
        }
      });
    }

    let workItemLabel = this.softLabelPipe.transform("Work Item", this.softLabels);

    this.googleAnalyticsService.eventEmitter(workItemLabel, "Archived " + workItemLabel + "", this.userStory.userStoryName, 1);
  }


  closeDialog() {
    this.closePopup.emit("no");
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
