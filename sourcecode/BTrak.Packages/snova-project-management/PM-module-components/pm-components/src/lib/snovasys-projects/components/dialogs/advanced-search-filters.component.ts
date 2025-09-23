// tslint:disable-next-line: ordered-imports
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { ArchivedGoalFilter } from "../../models/archived-goal-filter.model";
// tslint:disable-next-line: ordered-imports
import { UserGoalFilter } from "../../models/user-goal-filter.model";
// tslint:disable-next-line: ordered-imports
import { ArchiveGoalFiltersTriggered, GetGoalFiltersTriggered, GoalFiltersActionTypes } from "../../store/actions/goal-filters.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "advanced-search-dialog",
  templateUrl: "./advanced-search-filters.component.html"
})
export class AdvancedSearchFiltersComponent implements OnInit {

  @Output() closeMatDialog = new EventEmitter<string>();
  @Output() goalFilterDetailsJson = new EventEmitter<UserGoalFilter>();
  @Output() editFilters = new EventEmitter<UserGoalFilter>();
  @ViewChildren("archiveGoalPopup") archiveGoalFiltersPopUps;

  @Input("isPermissionExists")
  set _isPermissionExists(data: boolean) {
    this.isPermissionExists = data;
  }

  goalFiltersList$: Observable<UserGoalFilter[]>;
  anyOperationInProgress$: Observable<boolean>;
  archiveGoalFiltersIsInProgress$: Observable<boolean>;
  goalFilterSelected: string;
  isPermissionExists: boolean;
  goalFilterId: string;
  appliedFilterId: string;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  public ngDestroyed$ = new Subject();

  constructor(public advancedSearchDialog: MatDialogRef<AdvancedSearchFiltersComponent>,
              @Inject(MAT_DIALOG_DATA)
    public data: any,
              private store: Store<State>,
              private actionUpdates$: Actions,
              private cookieService: CookieService,
              private toastr: ToastrService,
              private translateService: TranslateService,) {

    this.isPermissionExists = this.data.isPermissionExists;
    this.goalFilterSelected = this.data.goalFilterId;
    const goalFilters = new UserGoalFilter();
    this.store.dispatch(new GetGoalFiltersTriggered(goalFilters));

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalFiltersActionTypes.ArchiveGoalFiltersCompleted),
        tap(() => {
          this.closeArchiveDialog();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.getSoftLabels();
    this.goalFiltersList$ = this.store.pipe(select(projectModuleReducers.getGoalFiltersAll));
    this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.getGoalFiltersLoading));
    this.archiveGoalFiltersIsInProgress$ = this.store.pipe(select(projectModuleReducers.archiveGoalFiltersLoading));
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  onNoClick() {
    this.closeMatDialog.emit("");
  }

  applyFilters(goalFilterDetails) {
    this.appliedFilterId = goalFilterDetails.goalFilterId;
    this.goalFilterDetailsJson.emit(goalFilterDetails);
  }

  editFilter(goalFilterDetails){
    this.editFilters.emit(goalFilterDetails);
  }

  archiveGoalFilter(goalFilter, archiveGoalPopup) {
    this.goalFilterId = goalFilter.goalFilterId;
    archiveGoalPopup.openPopover();
  }

  closeArchiveDialog() {
    this.archiveGoalFiltersPopUps.forEach((p) => p.closePopover());
  }

  IsArchivedGoalFilter() {
    if (this.goalFilterSelected !== this.goalFilterId) {
      const archivedModel = new ArchivedGoalFilter();
      archivedModel.goalFilterId = this.goalFilterId;
      archivedModel.isArchived = true;
      this.store.dispatch(new ArchiveGoalFiltersTriggered(archivedModel));
    } else {
      this.toastr.warning("", this.translateService.instant("ADVANCEDSEARCH.ARCHIVENOTPOSSIBLE"))
    }
  }

  checkIsPermissionExists(createdUserId) {
    const currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    if (currentUserId === createdUserId) {
      return true;
    } else {
      return false;
    }
  }
}
