// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { ProjectFeature } from "../../models/projectFeature";
// tslint:disable-next-line: ordered-imports
import { User } from "../../models/user";
// tslint:disable-next-line: ordered-imports
import { CreateProjectFeatureTriggered, ProjectFeaturesActionTypes } from "../../store/actions/project-features.actions";
// tslint:disable-next-line: ordered-imports
import { LoadUsersTriggered, UserActionTypes } from "../../store/actions/users.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';


@Component({
  selector: "app-pm-component-create-project-feature",
  templateUrl: "add-project-feature.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectFeatureComponent implements OnInit {
  @Input("projectId")
  set projectId(projectId: string) {
    this._projectId = projectId;
  }
  @Input("clearProjectFeatureForm")
  set _clearProjectFeatureForm(clearProjectFeatureForm: boolean) {
    this.clearProjectFeatureForm = clearProjectFeatureForm;
    this.clearForm();
  }
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @Output() closeProjectFeatureDialog = new EventEmitter<string>();
  @Output() getProjectFeaturesCount = new EventEmitter<string>();
  ProjectFeature: ProjectFeature;
  allUsers$: Observable<User[]>;
  allUsers: User[];
  private _projectId: string;
  clearProjectFeatureForm: boolean;
  projectFeatureForm: FormGroup;
  selectedMember: string;
  anyOperationInProgress$: Observable<boolean>;
  public ngDestroyed$ = new Subject();
  autoCompleteOff: any;
  isAllowSpecialCharacter: boolean;
  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted),
        tap(() => {
          this.clearForm();
          this.closeFeatureDialog();
          this.getProjectFeaturesCount.emit("");
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(UserActionTypes.LoadUsersCompleted),
        tap(() => {
          this.allUsers$ = this.store.pipe(
            select(projectModuleReducer.getUsersAll)
          );
          this.allUsers$
            .subscribe((s) => (this.allUsers = s));
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.getSoftLabels();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.CreateProjectFeaturesLoading)
    );
    this.allUsers$ = this.store.pipe(select(projectModuleReducer.getUsersAll));
    this.store.dispatch(new LoadUsersTriggered());
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  saveProjectFeature() {
    this.ProjectFeature = this.projectFeatureForm.value;
    this.ProjectFeature.projectId = this._projectId;
    this.store.dispatch(new CreateProjectFeatureTriggered(this.ProjectFeature));
  }

  getResponsiblePerson(selectedId) {
    if(selectedId == 0) {
      this.selectedMember = null;
    } else {
      const projectResponsiblePersons = this.allUsers;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.find(projectResponsiblePersons, function (member) {
        return member.id === selectedId;
      })
      if (filteredList) {
        this.selectedMember = filteredList.fullName;
      } 
    }
  }

  clearForm() {
    this.isAllowSpecialCharacter = true;
    this.projectFeatureForm = new FormGroup({
      projectFeatureName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ])
      ),
      projectFeatureResponsiblePersonId: new FormControl("", []),
      timeStamp: new FormControl("", [])
    });
  }

  omitSpecialChar(event) {
    if (event.currentTarget.selectionStart === 0) {
      let k;
      k = event.charCode;  //         k = event.keyCode;  (Both can be used)
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32 || (k >= 48 && k <= 57));
    } else {
      return true;
    }
  }

  removeSpecialCharacter() {
    if (this.projectFeatureForm.value.projectFeatureName) {
      const projectName = this.projectFeatureForm.value.projectFeatureName;
      const charCode = projectName.charCodeAt(0);
      // tslint:disable-next-line: triple-equals
      // tslint:disable-next-line: max-line-length
      // tslint:disable-next-line: triple-equals
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode == 32 ||
        (charCode >= 48 && charCode <= 57)) {
        this.isAllowSpecialCharacter = true;
        this.cdRef.detectChanges();
      } else {
        this.isAllowSpecialCharacter = false;
        this.cdRef.detectChanges();
      }

    } else {
      this.isAllowSpecialCharacter = true;
    }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
  closeFeatureDialog() {
    this.formGroupDirective.resetForm();
    this.closeProjectFeatureDialog.emit("");
  }
}
