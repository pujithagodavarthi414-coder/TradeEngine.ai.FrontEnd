import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable } from "rxjs/internal/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ArchivedUserStoryInputModel } from "../../models/archivedUserStoryModel";
import { AdhocArchiveUserStoryTriggered, AdhocWorkActionTypes } from "../../store/actions/adhoc-work.action";
import { UserStory } from "../../models/userStory";
import * as dashboardModuleReducers from '../../store/reducers/index'
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { ToastrService } from "ngx-toastr";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "adhoc-userstory-archive",
  templateUrl: "adhoc-userstory-archive.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUserStoryArchiveComponent {

  @Input("userStoryData")
  set _userStoryId(data: any) {
    this.userStoryData = data;
  }

  isArchived;
  @Input("isArchived")
  set _isArchived(data: boolean) {
    this.isArchived = data;
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

  @Input("isUniquePage")
  set _isUniquePage(data: boolean) {
    this.isUniquePage = data;
  }

  userStoryData: any;
  @Output() closePopup = new EventEmitter<string>();

  anyOperationInProgress$: Observable<boolean>;
  public ngDestroyed$ = new Subject();

  isEditFromProjects: boolean = true;
  archiveProgress: boolean = false;
  validationMessage: string;
  isUniquePage: boolean;

  constructor(private store: Store<State>, private adhocWorkService: AdhocWorkService, private toastr: ToastrService, private actionUpdates$: Actions) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.AdhocArchiveUserStoryCompleted),
        tap(() => {
          this.closePopup.emit("yes");
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.anyOperationInProgress$ = this.store.pipe(
      select(dashboardModuleReducers.getArchiveLoading)
    );
  }

  IsArchivedUserStory() {
    var archivedUserStoryModel = new UserStory();
    archivedUserStoryModel.userStoryId = this.userStoryData.userStoryId;
    archivedUserStoryModel.isArchived = this.isArchived;
    archivedUserStoryModel.deadLineDate = this.userStoryData.deadLineDate;
    archivedUserStoryModel.estimatedTime = this.userStoryData.estimatedTime;
    archivedUserStoryModel.ownerUserId = this.userStoryData.ownerUserId;
    archivedUserStoryModel.userStoryName = this.userStoryData.userStoryName;
    archivedUserStoryModel.timeStamp = this.userStoryData.timeStamp;
    if (this.isEditFromProjects || this.isUniquePage) {
      this.store.dispatch(new AdhocArchiveUserStoryTriggered(archivedUserStoryModel));
    }
    else {
      this.archiveProgress = true;
      this.adhocWorkService.upsertAdhocWork(archivedUserStoryModel).subscribe((result: any) => {
        if (result.success) {
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
  }

  closeDialog() {
    this.closePopup.emit("no");
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
