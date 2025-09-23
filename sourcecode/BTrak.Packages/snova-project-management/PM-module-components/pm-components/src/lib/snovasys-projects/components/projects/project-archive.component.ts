// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ArchivedProjectInputModel } from "../../models/archivedProjectInputModel";
import { ArchiveProjectTriggered, ProjectActionTypes } from "../../store/actions/project.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Component({
  selector: "app-pm-component-project-archive",
  templateUrl: "project-archive.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveProjectComponent implements OnInit {
  @Input("projectId")
  set _projectId(data: string) {
    this.projectId = data;
    this.getSoftLabelConfigurations();
  }

  @Input("isArchived")
  set _isArchived(data: boolean) {
    this.isArchived = data;
  }

  @Input("timeStamp")
  set _timeStamp(data: any) {
    this.timeStamp = data;
  }
  @Input() projectLabel: string;

  @Input("projectName")
  set _projectName(data: string) {
    this.projectName = data;
  }

  @Output() closeArchiveDialog = new EventEmitter<string>();
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  projectId: string;
  isArchived: boolean;
  timeStamp: any;
  projectName: string;

  constructor(private store: Store<State>,
              private actionUpdates$: Actions
              ,public googleAnalyticsService: GoogleAnalyticsService,
              private softLabelPipe: SoftLabelPipe) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.ArchiveProjectCompleted),
        tap(() => {
          this.closeArchiveDialog.emit("");
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createProjectLoading)
    );
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
    }
  }


  archiveProject() {
    // tslint:disable-next-line: prefer-const
    let archivedProjectModel = new ArchivedProjectInputModel();
    archivedProjectModel.projectId = this.projectId;
    archivedProjectModel.timeStamp = this.timeStamp;
    archivedProjectModel.projectLabel = this.projectLabel;
    let projectLabel = this.softLabelPipe.transform("Project",this.softLabels);
    if (this.isArchived === true) {
      archivedProjectModel.isArchive = false;
      this.googleAnalyticsService.eventEmitter(projectLabel, "Unarchived "+projectLabel+"", this.projectName, 1);       
    } else if (this.isArchived === false) {
      archivedProjectModel.isArchive = true;
      this.googleAnalyticsService.eventEmitter(projectLabel, "Archived "+projectLabel+"", this.projectName, 1);       
    }
    this.store.dispatch(new ArchiveProjectTriggered(archivedProjectModel))
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  closeDialog() {
    this.closeArchiveDialog.emit("");
  }
}
