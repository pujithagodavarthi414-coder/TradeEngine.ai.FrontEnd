// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { combineLatest, Observable, Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { map, takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
// tslint:disable-next-line: ordered-imports
import { Project } from "../../models/project";
import { ProjectType } from "../../models/projectType";
import { User } from "../../models/user";
// tslint:disable-next-line: ordered-imports
import { LoadProjectTypesTriggered } from "../../store/actions/project-types.actions";
// tslint:disable-next-line: ordered-imports
import { CreateProjectTriggered, ProjectActionTypes, ProjectEditTriggered } from "../../store/actions/project.actions";
import { LoadUsersTriggered, UserActionTypes } from "../../store/actions/users.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { ProjectTypeService } from "../../services/project-type.service";

@Component({
  selector: "app-pm-component-createproject",
  templateUrl: "createproject.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectComponent implements OnInit {
  @Input("projectId")
  set setGoalSearchCriteria(projectId: string) {
    this.projectId = projectId;
    this.store.dispatch(new ProjectEditTriggered(this.projectId));
    this.clearForm();
  }
  @Input("clearCreateForm")
  set _clearCreateForm(form: boolean) {
    this.getSoftLabelConfigurations();
  }

  @Input("isSprintsEnable")
  set _isSprintsEnable(data: boolean) {
    this.isSprintsEnable = data;
  }

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @Output() closePopup = new EventEmitter<string>();
  anyOperationInProgress$: Observable<boolean>;
  projectTypes$: Observable<ProjectType[]>;
  projectResponsiblePersons$: Observable<User[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  projectResponsiblePersons: User[];
  project$: Observable<Project>;
  regexPattern = "^[a-zA-Z]$"
  project: Project;
  projectLabel: string;
  isSprintsEnable: boolean;
  projectId: string;
  clearCreateForm: boolean;
  projectForm: FormGroup;
  selectedMember: string;
  projectNew: Project;
  buttontext: string;
  projectButtonIcon: string;
  isPatternValidation: boolean;
  isAllowSpecialCharacter: boolean;
  currentUserId: string;
  todaysDate: Date;
  projectTypes: ProjectType[] = [];

  public ngDestroyed$ = new Subject();
  constructor(
    private store: Store<State>,
    private actionUpdates$: Actions,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe,
    private cookieService: CookieService,
    private projectTypeService: ProjectTypeService
  ) {
    this.currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    var newDate = new Date();
    this.todaysDate = newDate;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.CreateProjectCompleted),
        tap(() => {
          this.closePopup.emit("");
          this.clearForm();
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        ofType(ProjectActionTypes.ProjectEditCompleted),
        tap(() => {
          this.project$ = this.store.select(projectModuleReducer.EditProjectById)
          this.project$.subscribe((project) => this.project = project);
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
          this.projectLabel = this.softLabels[0].projectLabel;
          this.editForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(UserActionTypes.LoadUsersCompleted),
        tap(() => {
          this.projectResponsiblePersons$ = this.store.pipe(
            select(projectModuleReducer.getUsersAll)
          );
          this.projectResponsiblePersons$
            .subscribe((s) => (this.projectResponsiblePersons = s));
          if (this.projectId && this.project) {
            this.getProjectResponsiblePerson(this.project.projectResponsiblePersonId);
          } else {
            this.getProjectResponsiblePerson(this.currentUserId);
          }
        })
      )
      .subscribe();
    this.getSoftLabelConfigurations();
  }
  ngOnInit(): void {
    // TODO: Pipe on multiple selects, we should be able to add other validation messages
    // tslint:disable-next-line: prefer-const
    let createProjectLoading$ = this.store.pipe(
      select(projectModuleReducer.createProjectLoading)
    );
    const getProjectByIdLoading$ = this.store.pipe(
      select(projectModuleReducer.getProjectsLoading)
    );
    this.anyOperationInProgress$ = combineLatest(
      createProjectLoading$,
      getProjectByIdLoading$

    ).pipe(
      map(
        ([
          // tslint:disable-next-line: no-shadowed-variable
          createProjectLoading$,
          // tslint:disable-next-line: no-shadowed-variable
          getProjectByIdLoading$

        ]) =>
          getProjectByIdLoading$ ||
          createProjectLoading$
      )
    );
    this.projectTypes$ = this.store.pipe(
      select(projectModuleReducer.getProjectTypesAll)
    );

    this.project$ = this.store.select(projectModuleReducer.EditProjectById);
    this.store.dispatch(new LoadUsersTriggered());
    this.getProjectTypes();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.clearForm();
      this.projectLabel = this.softLabels[0].projectLabel;
      this.cdRef.markForCheck();
    } else {
      this.clearForm();
      this.cdRef.markForCheck();
    }
  }

  getProjectTypes() {
    var projectTypes = new ProjectType();
    projectTypes.isArchived = false;
    this.projectTypeService.GetAllProjectTypes(projectTypes).subscribe((response: any) => {
      if (response.success == true) {
        this.projectTypes = response.data;
        this.cdRef.detectChanges();
      }
    });
  }

  saveProject() {
    // TODO: How to bind the toast message and close dialog
    this.projectNew = this.projectForm.value;
    this.projectNew.projectLabel = this.projectLabel;
    this.projectNew.timeZoneOffSet  = (-(new Date(this.projectForm.value.projectStartDate).getTimezoneOffset()));
    if(this.projectNew.projectId) {
      this.projectNew.isSprintsConfiguration = this.project.isSprintsConfiguration;
      this.projectNew.isDateTimeConfiguration = this.project.isDateTimeConfiguration;
    }
    this.store.dispatch(new CreateProjectTriggered(this.projectNew));
    let projectLabel = this.softLabelPipe.transform("Project", this.softLabels);

    if (this.projectForm.value.projectId != '' && this.projectForm.value.projectId != undefined)
      this.googleAnalyticsService.eventEmitter(projectLabel, "Updated " + projectLabel + "", this.projectForm.value.projectName, 1);
    else
      this.googleAnalyticsService.eventEmitter(projectLabel, "Created " + projectLabel + "", this.projectForm.value.projectName, 1);

  }

  closedialog() {
    this.formGroupDirective.resetForm();
    this.closePopup.emit("");
  }

  getProjectResponsiblePerson(responsibleId) {
    const projectResponsiblePersons = this.projectResponsiblePersons;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(projectResponsiblePersons, function (member) {
      return member.id === responsibleId;
    })
    if (filteredList) {
      this.selectedMember = filteredList.fullName;
      this.cdRef.markForCheck();
    }
  }

  editForm() {
    this.buttontext = this.translateService.instant("PROJECTS.UPDATEPROJECT");
    this.projectButtonIcon = "sync";
    this.isAllowSpecialCharacter = true;
    this.getProjectResponsiblePerson(this.project.projectResponsiblePersonId);
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        this.project.projectName,
        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.ProjectNameMaxLength250) // TODO: Shift this to constants
        ])
      ),
      projectId: new FormControl(this.project.projectId, []),
      projectResponsiblePersonId: new FormControl(
        this.project.projectResponsiblePersonId,
        Validators.compose([
          Validators.required
        ])
      ),
      timeStamp: new FormControl(this.project.timeStamp, []),
      projectStartDate: new FormControl(this.project.projectStartDate, []),
      projectEndDate: new FormControl(this.project.projectEndDate, []),
      projectTypeId: new FormControl(this.project.projectTypeId, []),

    });
    this.removeSpecialCharacter();
  }

  clearForm() {
    //this.buttontext = "Create project";
    this.selectedMember = null;
    this.isAllowSpecialCharacter = true;
    this.buttontext = this.translateService.instant("PROJECTS.ADDPROJECT");
    this.projectButtonIcon = "plus";
    if(this.currentUserId) {
      this.currentUserId =  this.currentUserId.toLowerCase();
    } else {
      this.currentUserId = null;
    }
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.ProjectNameMaxLength250)

        ])
      ),
      projectId: new FormControl("", []),
      projectResponsiblePersonId: new FormControl(this.currentUserId, Validators.compose([
        Validators.required
      ])),
      timeStamp: new FormControl("", []),
      projectStartDate: new FormControl(this.todaysDate, []),
      projectEndDate: new FormControl("", []),
      projectTypeId: new FormControl("", [])
    });
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  removeSpecialCharacter() {
    if (this.projectId && this.projectForm.value.projectName) {
      const projectName = this.projectForm.value.projectName;
      const charCode = projectName.charCodeAt(0);
      if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
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

  changeProjectStartDate(event) {
     this.todaysDate = event;
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
}
