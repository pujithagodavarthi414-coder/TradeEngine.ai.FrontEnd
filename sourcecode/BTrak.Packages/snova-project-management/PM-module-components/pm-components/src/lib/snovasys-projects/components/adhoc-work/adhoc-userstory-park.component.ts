import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable } from "rxjs/internal/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { ParkUserStoryInputModel } from "../../models/parkedUserstoryModel";
import { AdhocParkUserStoryTriggered, AdhocWorkActionTypes } from "../../store/actions/adhoc-work.action";
import * as dashboardModuleReducers from '../../store/reducers/index'
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { ProjectGoalsService } from "../../services/goals.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "adhoc-userstory-park",
  templateUrl: "adhoc-userstory-park.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUserStoryParkComponent implements OnInit {
  userStoryId;
  @Input("userStoryId")
  set _userStoryId(data: string) {
    this.userStoryId = data;
  }

  isParked;
  @Input("isParked")
  set _isParked(data: boolean) {
    this.isParked = data;
  }

  timeStamp
  @Input("timeStamp")
  set _timeStamp(data: any) {
    this.timeStamp = data;
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

  @Output() closePopup = new EventEmitter<string>();
  anyOperationInProgress$: Observable<boolean>;
  public ngDestroyed$ = new Subject();

  isEditFromProjects: boolean = true;
  parkProgress: boolean = false;
  validationMessage: string;
  isUniquePage: boolean;

  constructor(private store: Store<State>, private projectGoalsService: ProjectGoalsService, private toastr: ToastrService, private actionUpdates$: Actions) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.AdhocParkUserStoryCompleted),
        tap(() => {
          this.closePopup.emit("yes");
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.anyOperationInProgress$ = this.store.pipe(
      select(dashboardModuleReducers.getAdhocParkLoading)
    );
  }

  IsParkedUserStory() {
    var parkInputModel = new ParkUserStoryInputModel();
    parkInputModel.userStoryId = this.userStoryId;
    parkInputModel.isParked = this.isParked;
    parkInputModel.timeStamp = this.timeStamp;
    if (this.isEditFromProjects || this.isUniquePage) {
      this.store.dispatch(new AdhocParkUserStoryTriggered(parkInputModel));
    }
    else {
      this.parkProgress = true;
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
  }

  closeDialog() {
    this.closePopup.emit("no");
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
