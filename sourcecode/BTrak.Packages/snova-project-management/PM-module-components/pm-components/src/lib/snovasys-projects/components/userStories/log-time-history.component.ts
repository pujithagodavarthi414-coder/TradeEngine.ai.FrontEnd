import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as ProjectState from "../../store/reducers/index";
import { Observable } from "rxjs/internal/Observable";
import { takeUntil, tap } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { Subject } from "rxjs";
import * as projectModuleReducers from '../../store/reducers/index';
import { SearchLogTimeTriggered, UserStoryLogTimeActionTypes } from "../../store/actions/userStory-logTime.action";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { UserStoryLogTimeModel } from '../../models/userStoryLogTimeModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Component({
  selector: "app-pm-component-userstory-logtime-history",
  templateUrl: "log-time-history.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryLogTimeHistoryComponent extends CustomAppBaseComponent implements OnInit {
  userStoryId: string;
  @Input("userStoryId")
  set UserStoryId(data: any) {
    if (data) {
      this.userStoryId = data.userStoryId;
      var searchSpentTimeModel = new UserStoryLogTimeModel();
      searchSpentTimeModel.userStoryId = this.userStoryId;
      searchSpentTimeModel.isFromAudits = data.isFromAudits;
      this.store.dispatch(new SearchLogTimeTriggered(searchSpentTimeModel));
    }
  }

  @Input("notFromAuditReports")
  set _notFromAuditReports(data: boolean) {
    if (data || data == false) {
      this.notFromAuditReports = data;
    }
    else {
      this.notFromAuditReports = true;
    }
  }

  userStoryLogTime = new UserStoryLogTimeModel();
  anyOperationInProgress$: Observable<boolean>;
  logTimeHistoryList$: Observable<UserStoryLogTimeModel[]>;
  logTimeHistoryList: UserStoryLogTimeModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  public ngDestroyed$ = new Subject();
  isLogTimeDetailsVisible: any;
  isFromAudits: boolean = false;
  notFromAuditReports: boolean = true;

  constructor(private actionUpdates$: Actions,
    private store: Store<ProjectState.State>) {
    super();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryLogTimeActionTypes.SearchLogTimeCompleted),
        tap(() => {
          this.logTimeHistoryList$ = this.store.pipe(select(projectModuleReducers.getUserStorylogTimeAll));
          this.logTimeHistoryList$.subscribe((result: any) => {
            this.logTimeHistoryList = result;
            if (this.logTimeHistoryList.length > 0) {
              this.isLogTimeDetailsVisible = true;
              this.userStoryLogTime.totalSpentTime = this.logTimeHistoryList[0].totalSpentTime;
              // this.userStoryLogTime.estimatedTime = this.logTimeHistoryList[0].estimatedTime;
              this.userStoryLogTime.estimatedTime = this.logTimeHistoryList[0].estimatedTime == null ? 0 : this.logTimeHistoryList[0].estimatedTime;
              this.userStoryLogTime.remainingSpentTime = this.logTimeHistoryList[0].remainingSpentTime == null ? 0 : this.logTimeHistoryList[0].remainingSpentTime;
            }
            else {
              this.isLogTimeDetailsVisible = false;
            }
          })
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.getUserStorylogTimeLoading)
    );
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }
}
