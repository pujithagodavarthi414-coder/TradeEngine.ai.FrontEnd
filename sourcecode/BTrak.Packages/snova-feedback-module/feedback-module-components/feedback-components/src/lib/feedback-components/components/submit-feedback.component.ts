import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { SubmitFeedBackTriggered, FeedBackActionTypes } from '../store/actions/feedback.action';
import * as sharedModuleReducers from '../store/reducers/index';
import { ConstantVariables } from '../helpers/constant-variables';
import { State } from '../store/reducers/index';
import { FeedBackModel } from '../models/feedbackModel';

@Component({
  selector: "app-pm-component-submit-feedback",
  templateUrl: "./submit-feedback.component.html"
})
export class FeedBackComponent implements OnInit {
  @Output() closeDialog = new EventEmitter<string>();
  @ViewChild("bugFeedBackPopover") submitBugPopover: SatPopover;
  anyOperationInProgress$: Observable<boolean>;
  defaultSmileyImage = "assets/images/smiling.png";
  defaultSadImage = "assets/images/sad.png";
  feedBackFormControl: FormControl;
  description: string;
  isValidation = false;
  isDisabled = true;
  isBugDialog: boolean;
  isFeatureDialog: boolean;
  isToShowUploadDropzone:boolean;
  public ngDestroyed$ = new Subject();
  logo:string = ConstantVariables.DefaultMainLogo;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(FeedBackActionTypes.SubmitFeedBackCompleted),
        tap(() => {
          this.closeDialog.emit("");
          this.clearForm();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.clearForm();
    this.anyOperationInProgress$ = this.store.pipe(select(sharedModuleReducers.feedBacksLoading))
  }

  clearForm() {
    this.isValidation = false;
    this.feedBackFormControl = new FormControl("", [])
  }

  closeFeedBackDialog() {
    this.closeBugFeedBacklogDialog("");
    this.closeDialog.emit("");
  }

  isButtonDisabled() {
    if (this.description) {
      this.isValidation = false;
      this.isDisabled = false;
      this.cdRef.detectChanges();
    } else {
      this.isValidation = true;
      this.isDisabled = true;
      this.cdRef.detectChanges();
    }
  }

  submitFeedBack() {
    const feedBackodel = new FeedBackModel();
    feedBackodel.description = this.description;
    this.store.dispatch(new SubmitFeedBackTriggered(feedBackodel));
  }

  openSubmitBugDialog(text) {
    this.isToShowUploadDropzone = true;
    if (text === "isBugBoard") {
      this.isBugDialog = true;
      this.isFeatureDialog = false;
    } else {
      this.isBugDialog = false;
      this.isFeatureDialog = true;
    }
    this.submitBugPopover.open();
  }

  closeBugFeedBacklogDialog(event) {
    const popover = this.submitBugPopover;
    this.isToShowUploadDropzone = false;
    if (popover) {
      popover.close();
    }
    if (event) {
      this.closeDialog.emit("");
    }
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
