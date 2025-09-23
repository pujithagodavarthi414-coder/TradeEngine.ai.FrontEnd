import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import * as projectModuleReducers from "../../store/reducers/index";
import { LogTimeOptionsTriggered } from "../../store/actions/logTimeOptions.action";
import { InsertLogTimeTriggered, UserStoryLogTimeActionTypes } from "../../store/actions/userStory-logTime.action";
import { State } from "../../store/reducers/index";

import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import { LogTimeOption } from "../../models/logTimeOption";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Component({
  selector: "app-pm-component-userstory-logtime",
  templateUrl: "userStoryLogTime.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryLogTimeComponent extends CustomAppBaseComponent implements OnInit {
  @Output() auditLog = new EventEmitter<any>();

  userStoryId: string;

  @Input("userStoryId")
  set UserStoryId(userStoryId: string) {
    this.userStoryId = userStoryId;
  }

  @Input("isFromAudits")
  set _isFromAudits(data: boolean) {
    if (data || data == false) {
      this.isFromAudits = data;
      this.userStoryData.userStoryId = this.userStoryId;
      this.userStoryData.isFromAudits = this.isFromAudits;
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

  public initSettings = {
    plugins: "paste lists advlist",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  logTimeOptions$: Observable<LogTimeOption[]>;
  anyOperationInProgress$: Observable<boolean>;
  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  logTimeOptionsLoading$: Observable<boolean>;
  userStoryLogTime: UserStoryLogTimeModel;
  userStoryLogTimeForm: FormGroup;
  showSetto: boolean;
  showReduceBy: boolean;
  clearLogForm: boolean;
  regexPattern: string;
  commentText: string;
  isSetTo: boolean;
  spentTime: string;
  spentTimeestimate: any;
  userStoryData = { userStoryId: null, isFromAudits: false };
  isButtonDisabled: boolean;
  disabled: boolean = true;
  isUserStoryEstimatedTime: boolean = true;
  notFromAuditReports: boolean = true;
  isFromAudits: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  @ViewChild("picker") picker;
  @ViewChild("picker1") picker1;
  @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
  public ngDestroyed$ = new Subject();

  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryLogTimeActionTypes.InsertLogTimeCompleted),
        tap(() => {
          this.clearForm();
          this.formGroupDirective.resetForm();
          this.auditLog.emit('true');
        })
      )
      .subscribe();


  }

  ngOnInit(): void {
    super.ngOnInit();
    this.clearForm();
    this.store.dispatch(new LogTimeOptionsTriggered());

    this.logTimeOptions$ = this.store.pipe(
      select(projectModuleReducers.getlogTimeOptionsAll)
    );

    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.insertLogTimeLoading)
    );

    this.anyOperationInProgressForAutoLogging$ = this.store.pipe(
      select(projectModuleReducers.insertAutoLogTimeLoading)
    );
    this.logTimeOptionsLoading$ = this.store.pipe(select(projectModuleReducers.getlogTimeOptionsLoading));
  }

  changeDateFrom(minDate) {
    this.minDate = minDate;
    this.userStoryLogTimeForm.controls['dateTo'].setValue('');
    this.cdRef.detectChanges();
  }
  clearForm() {
    this.minDate = new Date(this.minDate);
    this.minDate.setDate(this.minDate.getDate() - 14);
    this.regexPattern =
      "^[0-9]{1,2}[w][0-9]{1,3}[d][0-9]{1,2}[h]$|[0-9]{1,3}[d][0-9]{1,2}[h]$|[0-9]{1,2}[h]$";
    this.disabled = true;
    this.showSetto = false;
    this.spentTime = this.spentTimeestimate;
    this.userStoryLogTimeForm = new FormGroup({
      dateFrom: new FormControl(new Date(), Validators.compose([Validators.required])),
      dateTo: new FormControl(new Date(), Validators.compose([Validators.required])),
      logTimeOptionId: new FormControl("",
        Validators.compose([Validators.required])
      ),
      comment: new FormControl(
        "",
        Validators.compose([
          Validators.required
        ])
      ),
      spentTime: new FormControl(
        "",
      ),
      remainingTimeSetOrReducedBy: new FormControl(
        "")
    });
  }

  logTimeOptionChange(logTimeOptionId) {
    if (logTimeOptionId === ConstantVariables.logTimeOptionForSetTo) {
      this.showSetto = true;
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue('');
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].setValidators([
        Validators.required
      ]);
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    } else if (
      logTimeOptionId === ConstantVariables.logTimeOptionForReducedBy
    ) {
      this.showSetto = true;
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue('');
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].setValidators([
        Validators.required
      ]);
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    } else if (
      logTimeOptionId === ConstantVariables.logTimeOptionForExistingHours
    ) {
      this.showSetto = false;
      this.showReduceBy = false;
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue('');
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].clearValidators();
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    } else {
      this.showSetto = false;
      this.showReduceBy = false;
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue('');
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].clearValidators();
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    }
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime) {
      this.spentTimeestimate = estimatedTime;
      this.disabled = false;
      this.userStoryLogTimeForm.controls['spentTime'].setValue(estimatedTime);
      this.userStoryLogTimeForm.controls["spentTime"].clearValidators();
      this.userStoryLogTimeForm.get("spentTime").updateValueAndValidity();
    }
    else {
      this.userStoryLogTimeForm.controls['spentTime'].setValue('');
      this.userStoryLogTimeForm.controls["spentTime"].setValidators([
        Validators.required
      ]);
      this.userStoryLogTimeForm.get("spentTime").updateValueAndValidity();
    }
  }

  changeEstimatedSpentTime(estimatedTime) {
    if (estimatedTime) {
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue(estimatedTime);
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].clearValidators();
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    }
    else {
      this.userStoryLogTimeForm.controls['remainingTimeSetOrReducedBy'].setValue('');
      this.userStoryLogTimeForm.controls["remainingTimeSetOrReducedBy"].setValidators([
        Validators.required
      ]);
      this.userStoryLogTimeForm.get("remainingTimeSetOrReducedBy").updateValueAndValidity();
    }
  }

  SaveUserStoryLogTime() {
    this.userStoryLogTime = this.userStoryLogTimeForm.value;
    this.userStoryLogTime.userStoryId = this.userStoryId;
    this.userStoryLogTime.isFromAudits = this.isFromAudits;
    this.store.dispatch(new InsertLogTimeTriggered(this.userStoryLogTime));
  }

  cancelLogTime() {
    this.formGroupDirective.resetForm();
    this.clearForm();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
