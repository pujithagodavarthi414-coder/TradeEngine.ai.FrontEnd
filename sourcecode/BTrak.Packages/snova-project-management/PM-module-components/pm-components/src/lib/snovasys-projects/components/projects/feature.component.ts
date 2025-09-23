// tslint:disable-next-line: ordered-imports
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
import { ProjectFeature } from "../../models/projectFeature";
import { User } from "../../models/user";
// tslint:disable-next-line: ordered-imports
import { ArchiveProjectFeatureTriggered, CreateProjectFeatureTriggered, LoadFeatureProjectsTriggered, ProjectFeaturesActionTypes } from "../../store/actions/project-features.actions";
import { ProjectSummaryTriggered } from "../../store/actions/project-summary.action";
// tslint:disable-next-line: ordered-imports
import { LoadUsersTriggered, UserActionTypes } from "../../store/actions/users.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: "app-pm-component-feature",
  templateUrl: "feature.component.html",
  styles: [`
    .members-component-height {
      height: calc(100vh - 215px);
    }
  `]
})

export class FeatureComponent extends AppFeatureBaseComponent implements OnInit {
  @Input("projectId")
  set _projectId(projectId: string) {
    console.log("project id" + projectId);
    this.projectId = projectId;
  }
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @ViewChildren("editFeatureComponentPopover") editFeaturePopup;
  @ViewChildren("deleteFeatureComponentPopover") deleteFeaturePopUp;
  @ViewChild("projectFeaturePopover") projectFeaturePopUp : SatPopover;
  @Output() getProjectFeaturesCount = new EventEmitter<string>();
  @Output() hideComponentButton = new EventEmitter<boolean>();
  projectFeature$: Observable<ProjectFeature[]>;
  allUsers$: Observable<User[]>;
  allUsers: User[];
  validationMessages$: Observable<string[]>;
  anyOperationInProgress$: Observable<boolean>;
  featureOperationInProgress$: Observable<boolean>;
  componentsCount$: Observable<number>;
  exceptionMessage$: Observable<any>;
  featureLoop = Array;
  featureLoaderNumber = 8;
  projectFeatureForm: FormGroup;
  ProjectFeature: ProjectFeature;
  projectFeaturedata: ProjectFeature;
  searchText: string;
  selectedMember: string;
  titletext: string;
  buttontext: string;
  buttonicon: string;
  isDeleted: boolean;
  isAllowSpecialCharacter: boolean;
  isArchived = false;
  loadprojectFeature: boolean;
  clearProjectFeatureForm: boolean;
  responsiblePersonId: string;
  projectId: string;  
  
  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
    
  public ngDestroyed$ = new Subject();

  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.clearForm();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted),
        tap(() => {
          this.closeEditFeatureComponent();
          this.formGroupDirective.resetForm();
          this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectFeaturesActionTypes.ArchiveProjectFeatureCompleted),
        tap(() => {
          this.closeDeleteDialog();
          this.store.dispatch(new ProjectSummaryTriggered(this.projectId));
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
          this.getProjectResponsiblePerson(this.responsiblePersonId);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getSoftLabels();
    this.LoadProjectFeature();
    this.allUsers$ = this.store.pipe(select(projectModuleReducer.getUsersAll));
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.CreateProjectFeaturesLoading)
    );
    this.featureOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesLoading)
    );
    this.componentsCount$ = this.store.pipe(select(projectModuleReducer.getProjectFeatureCount))

    this.store.dispatch(new LoadUsersTriggered());
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  toggleArchiveButton() {
    this.hideComponentButton.emit(this.isArchived);
  }

  LoadProjectFeature() {
    console.log(this.isArchived);
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.projectId;
    if (this.isArchived) {
      projectFeature.IsDelete = true;
    } else {
      projectFeature.IsDelete = false;
    }
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    this.projectFeature$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesAll)
    );
  }
  SaveProjectFeature() {
    this.ProjectFeature = this.projectFeatureForm.value;
    this.ProjectFeature.projectId = this.projectId;
    console.log(this.ProjectFeature);
    this.store.dispatch(new CreateProjectFeatureTriggered(this.ProjectFeature));
  }

  clearForm() {
    this.titletext = this.translateService.instant("COMPONENTS.ADDCOMPONENT");
    this.buttontext = this.translateService.instant("ADD");
    this.buttonicon = "plus";
    this.isAllowSpecialCharacter = true;
    this.projectFeatureForm = new FormGroup({
      projectFeatureName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.ProjectNameMaxLength250)
        ])
      ),
      projectFeatureResponsiblePersonId: new FormControl("", []),
      projectFeatureId: new FormControl(""),
      timeStamp: new FormControl("", [])
    });
  }

  getProjectResponsiblePerson(responsibleId) {
    if (responsibleId) {
      const projectResponsiblePersons = this.allUsers;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.find(projectResponsiblePersons, function (member) {
        return member.id === responsibleId;
      })
      if (filteredList) {
        this.selectedMember = filteredList.fullName;
      } else {
        this.selectedMember = null;
      }
    } else {
      this.selectedMember = null;
    }
  }

  EditFeature(projectFeature: ProjectFeature, editFeatureComponentPopover) {
    this.responsiblePersonId = projectFeature.projectFeatureResponsiblePerson.id;
      this.getProjectResponsiblePerson(projectFeature.projectFeatureResponsiblePerson.id);
    this.titletext = this.translateService.instant("COMPONENTS.UPDATECOMPONENT");
    this.buttontext = this.translateService.instant("UPDATE");
    this.buttonicon = "sync";
    this.ProjectFeature = projectFeature;
    this.isAllowSpecialCharacter = true;
    this.projectFeatureForm = new FormGroup({
      projectFeatureId: new FormControl(projectFeature.projectFeatureId),
      projectFeatureName: new FormControl(
        projectFeature.projectFeatureName,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      projectFeatureResponsiblePersonId: new FormControl(
        projectFeature.projectFeatureResponsiblePerson.id
      ),
      timeStamp: new FormControl(projectFeature.timeStamp, [])
    });
    editFeatureComponentPopover.openPopover();
  }

  deleteProjectFeature(projectFeature, deleteFeatureComponentPopover) {
    deleteFeatureComponentPopover.openPopover();
    this.ProjectFeature = projectFeature;
  }

  closeSearch() {
    this.searchText = "";
  }

  removeSpecialCharacter() {
    if (this.ProjectFeature.projectFeatureId && this.projectFeatureForm.value.projectFeatureName) {
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

  clearValidations() {
    this.isAllowSpecialCharacter = true;
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

  DeleteFeature() {
    this.isDeleted = true;
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.projectId;
    if (this.isArchived) {
      projectFeature.IsDelete = false;
    } else {
      projectFeature.IsDelete = true;
    }
    projectFeature.projectFeatureName = this.ProjectFeature.projectFeatureName;
    projectFeature.projectFeatureId = this.ProjectFeature.projectFeatureId;
    projectFeature.projectFeatureResponsiblePersonId = this.ProjectFeature.projectFeatureResponsiblePerson.id;
    projectFeature.timeStamp = this.ProjectFeature.timeStamp;
    this.store.dispatch(new ArchiveProjectFeatureTriggered(projectFeature));
  }

  closeDeleteDialog() {
    this.deleteFeaturePopUp.forEach((p) => p.closePopover());
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  closeEditFeatureComponent() {
    this.editFeaturePopup.forEach((p) => p.closePopover());
  }

  clearToggle(){
    this.isArchived = false;
    this.LoadProjectFeature();
  }
  
  createProjectFeature() {
    this.loadprojectFeature = true;
    this.clearProjectFeatureForm = !this.clearProjectFeatureForm;
    this.projectFeaturePopUp.open();
  }

  closeProjectFeatureDialog() {
    this.projectFeaturePopUp.close();
  }
}
