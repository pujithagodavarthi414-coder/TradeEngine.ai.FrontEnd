import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { ConstantVariables } from "../../../globalDependencies/constants/constant-variables";
import { Observable, Subject } from "rxjs";
import { User } from "../../models/user";
import * as dashboardModuleReducer from "../../store/reducers/index";
import { UserStory } from "../../models/userStory";
import { CreateAdhocWorkTriggered, AdhocWorkActionTypes } from "../../store/actions/adhoc-work.action";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import * as _ from 'underscore';
import { TeamLeads } from "../../models/teamleads.model";
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "create-adhoc-work",
  templateUrl: "create-adhoc-work.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  // host: {
  //   "(document:click)": "closeAddUserstoryPopUp($event)"
  // }
})
export class CreateAdhocWorkComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChild("formDirective") formDirective: FormGroupDirective;

  @Input('clearCreateForm')
  set _createForm(data) {
    this.clearCreateForm = data;
    this.clearForm();
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

  @Input("workspaceDashboardId")
  set _workspaceDashboardId(data: string) {
    if (data) {
      this.workspaceDashboardId = data;
    }
  }

  @Output() closeAdhocDialog = new EventEmitter<string>();
  @Output() adhocCreation = new EventEmitter<string>();
  @Output() adhocProgress = new EventEmitter<boolean>();

  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  adHocWorkForm: FormGroup;
  viewAllAdhocWork: Boolean;
  isEditFromProjects: boolean = true;
  isClosePopUp: boolean;
  anyOperationInProgress$: Observable<boolean>;
  teamLeads$: Observable<TeamLeads[]>;
  teamLeads: TeamLeads[];
  selectedMember: string;
  clearCreateForm: boolean;
  userStory: UserStory;
  estimatedTime: any;
  isUserStoryName: boolean;
  isLengthValidation: boolean;
  public ngDestroyed$ = new Subject();
  users: User[];
  estimationTimeReset: string;
  validationMessage: string;
  workspaceDashboardId: string;
  addButtonDisable: boolean = false;
  minDate = new Date();
  isUserStoryInputVisible: boolean = false;

  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;

  constructor(private store: Store<State>, private adhocService: AdhocWorkService,
    private cdRef: ChangeDetectorRef,
    private actionUpdates$: Actions,
    private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.CreateAdhocWorkCompleted),

        tap(() => {
          this.clearForm();
          this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
          this.cdRef.detectChanges();
          this.formGroupDirective.reset();
          // this.closeAdhocWorkDialog();
        })
      )
      .subscribe();
  

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
        tap(() => {
          this.userStoryTypes$ = this.store.pipe(select(dashboardModuleReducer.getUserStoryTypesAll));
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.viewAllAdhocWork = this.canAccess_feature_ViewAllAdhocWorks;
    this.usersDropDown();
    this.searchUserStoryTypes();
    this.anyOperationInProgress$ = this.store.pipe(select(dashboardModuleReducer.createAdhocUserStoryLoading));
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  searchUserStoryTypes() {
    const userStoryType = new UserStoryTypesModel();
    userStoryType.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryType))
  }

  usersDropDown() {
    let isPermission;
    if (this.viewAllAdhocWork) {
      isPermission = "false";
    } else {
      isPermission = "true";
    }
    this.adhocService.getAdhocUsersDropDown('', isPermission).subscribe((result: any) => {
      if (result.success == true) {
        this.users = result.data;
      }
    })
  }

  clearForm() {
    this.estimatedTime = null;
    this.isUserStoryName = false;
    this.isLengthValidation = false;
    this.estimationTimeReset = "reset";
    this.cdRef.markForCheck();
    this.adHocWorkForm = new FormGroup({
      userStoryName: new FormControl("", [])
      // userStoryName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(800)]))
    });
  }

  closeAdhocWorkDialog() {
    this.formDirective.resetForm();
    this.closeAdhocDialog.emit('');
    this.estimationTimeReset = "reset";
    this.cdRef.markForCheck();
  }


  changeEstimatedTime(estimatedTime) {
    if (estimatedTime) {
      this.estimatedTime = estimatedTime;
      this.adHocWorkForm.controls['estimatedTime'].setValue(estimatedTime);

      this.adHocWorkForm.controls["estimatedTime"].clearValidators();
      this.adHocWorkForm.get("estimatedTime").updateValueAndValidity();
    }
    else {
      this.adHocWorkForm.controls['estimatedTime'].setValue('');
      this.adHocWorkForm.controls["estimatedTime"].setValidators([
        Validators.required
      ]);
      this.adHocWorkForm.get("estimatedTime").updateValueAndValidity();
    }
    if (estimatedTime == "null")
      this.addButtonDisable = true;
    else
      this.addButtonDisable = false;
  }

  getResponsiblePerson(selectedId) {
    var projectResponsiblePersons = this.users;
    var filteredList = _.find(projectResponsiblePersons, function (member) {
      return member.id == selectedId;
    })
    if (filteredList) {
      this.selectedMember = filteredList.fullName;
    }
  }

  saveAdhocUserStory() {
    if (this.isEditFromProjects) {
      this.store.dispatch(new CreateAdhocWorkTriggered(this.userStory));
    }
    else {
      this.adhocProgress.emit(true);
      this.userStory.workspaceDashboardId = this.workspaceDashboardId;
      this.adhocService.upsertAdhocWork(this.userStory).subscribe((result: any) => {
        if (result.success) {
          let id = result.data;
          this.adhocCreation.emit(id);
          this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
          this.clearForm();
        }
        else {
          this.adhocProgress.emit(false);
          this.validationMessage = result.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessage);
        }
      });
    }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  showUserstoryInput() {
    this.clearForm();
    this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
    // this.openNewUserStory.emit(this.isUserStoryInputVisible);
  }



  keyDownFunction(event) {
    this.isLengthValidation = false;
    this.isUserStoryName = false;
    this.userStory = this.adHocWorkForm.value;
    let userStoryName = this.adHocWorkForm.value.userStoryName;
    userStoryName = userStoryName.trim();
    if (userStoryName && userStoryName.length > 800) {
      this.isLengthValidation = true;
      this.cdRef.markForCheck();
    } else if (!userStoryName) {
      this.isLengthValidation = false;
      this.isUserStoryName = true;
      this.cdRef.markForCheck();
    } else {
      this.isLengthValidation = false;
      this.isUserStoryName = false;
      this.cdRef.markForCheck();
    }
    if (event.keyCode == 13) {
      if (userStoryName) {
        this.saveAdhocUserStory();
      }
    }
  }

  checkName(value) {
    if (value && value.length > 0 && value.length <= 800) {
      this.isUserStoryName = false;
      this.isLengthValidation = false;
      this.cdRef.detectChanges();
    }
    if (value && value.length > 800) {
      this.isUserStoryName = false;
      this.isLengthValidation = true;
      this.cdRef.detectChanges();
    }
  }

  // closeAddUserstoryPopUp($event){
  //   this.isUserStoryInputVisible = true;
  // }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.clearForm();
    this.isUserStoryInputVisible = false;
  }
}

