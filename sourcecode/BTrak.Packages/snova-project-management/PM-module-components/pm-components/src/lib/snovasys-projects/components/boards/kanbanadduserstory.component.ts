// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren, Type, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { Subject, combineLatest } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { takeUntil, tap, map } from "rxjs/operators";
import * as _ from "underscore";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { ProjectFeature } from "../../models/projectFeature";
import { ProjectMember } from "../../models/projectMember";
import { UserStory } from "../../models/userStory";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { LoadBugPriorityTypesTriggered } from "../../store/actions/bug-priority.action";
import { LoadFeatureProjectsTriggered } from "../../store/actions/project-features.actions";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { GetUniqueUserStoryByIdTriggered } from "../../store/actions/userStory.actions";
import * as ProjectState from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SprintModel } from "../../models/sprints-model";
import { SprintWorkItemActionTypes, UpsertSprintWorkItemTriggered, GetUniqueSprintWorkItemByIdTriggered } from "../../store/actions/sprint-userstories.action";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { TestCaseDropdownList, TestSuiteSectionEditComponent } from '@snovasys/snova-testrepo';
import * as testRailModuleReducers from "@snovasys/snova-testrepo";
import { LoadTestCaseSectionListTriggered } from '@snovasys/snova-testrepo';
import { ProjectModulesService } from '../../services/project.modules.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from "@angular/common";
import * as moment_ from 'moment';
const moment = moment_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: "app-pm-component-add-user-story",
  templateUrl: "kanbanadduserstory.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
  @media only screen and (max-width: 1440px) {
    .goal-create-height {
      max-height: 245px;
      overflow-x: hidden !important;
    }
  }
  `]
})
export class AddUserStoryComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("addSectionPopover") addSectionsPopover;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  goal;
  injector: any;
  testSuitSectionEdit: any = {};
  startDateValidate: boolean = false;
  endDateValidate: boolean = false;
  deadLineDate: Date;
  @Input("goal")
  set _goalId(data) {
    this.goal = data;
    if (this.goal) {
      this.isFromSprint = false;
      this.isDateTimeConfiguration = this.goal.isDateTimeConfiguration;
      this.store.dispatch(new LoadMemberProjectsTriggered(this.goal.projectId));
      this.setGoalParams();
    }
  }

  @Input("sprint")
  set _sprint(data: SprintModel) {
    this.sprint = data;
    if (this.sprint) {
      this.isFromSprint = true;
      this.store.dispatch(new LoadMemberProjectsTriggered(this.sprint.projectId));
      this.setSprintParams();
    }
  }

  userStory;
  @Input("userStoryId")
  set _userStoryId(data) {
    this.userStoryId = data;
    this.getSoftLabelConfigurations();
    if (!this.userStoryId) {
      this.clearForm();
    } else {
      if (this.isFromSprint) {
        this.store.dispatch(new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId));
      } else {
        this.store.dispatch(new GetUniqueUserStoryByIdTriggered(this.userStoryId));
      }
    }
  }

  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }

  @Output() closeDialog = new EventEmitter<string>();
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  projectMembers$: Observable<ProjectMember[]>;
  projectMembers: ProjectMember[];
  projectFeatures$: Observable<ProjectFeature[]>;
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  sectionsList$: Observable<TestCaseDropdownList[]>;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  anyOperationInProgress$: Observable<any>;
  userStory$: Observable<UserStory>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  KanbanUserStoryForm: FormGroup;
  userStoryTypes: UserStoryTypesModel[];
  bugUserStoryTypeModel: UserStoryTypesModel;
  userStoryTypeModel: UserStoryTypesModel;
  sprint: SprintModel;
  userStoryDetails: UserStory;
  userStoryInputTags: any[] = [];
  selectedDependencyPerson: string;
  selectedPriority: string;
  tag: string;
  assignee: string;
  KanbanForm: boolean;
  isValidation: boolean;
  isFromSprint: boolean;
  isDateTimeConfiguration: boolean;
  titleText: string;
  buttonIcon: string;
  buttonText: string;
  timeStamp: any;
  isNewUserStory: boolean;
  isPermissionForUserStory: boolean;
  estimatedTime: string;
  isForQa: boolean;
  isButtonDisabled: boolean;
  userStoryId: string;
  estimatedTimeSet: any;
  order: number;
  selectedMember: string;
  selectedBugCausedUser: string;
  testSuiteId: string;
  sectionEdit: string = ConstantVariables.SectionNotEditable;
  loadSection: boolean;
  showSectionsDropDown: boolean;
  parentUserStoryId: string;
  sectionId: string;
  goalReplanId: string;
  onBoardProcessDate: Date;
  isActiveGoalStatusId: boolean;
  backlogGoalUserStory: boolean;
  replanGoalUserStory: boolean;
  public ngDestroyed$ = new Subject();

  constructor(
    private store: Store<ProjectState.State>,
    private testRailStore: Store<testRailModuleReducers.State>,
    private actionUpdates$: Actions,
    private factoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private ngModuleRef: NgModuleRef<any>,
    private vcr: ViewContainerRef,
    private toastr: ToastrService,
    private datePipe: DatePipe, private compiler: Compiler
  ) {
    super();
    this.clearForm();
    this.searchUserStoryTypes();
    this.injector = this.vcr.injector;
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryCompleted),
        tap(() => {
          this.closeUserStoryDialog();
          this.clearForm();
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted),
        tap(() => {
          this.closeUserStoryDialog();
          this.clearForm();
          this.formGroupDirective.resetForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.GetUniqueUserStoryByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducer.getUserStoryById));
          this.userStory$.subscribe((x) => this.userStory = x);
          this.timeStamp = this.userStory.timeStamp;
          this.order = this.userStory.order;
          this.parentUserStoryId = this.userStory.parentUserStoryId;
          this.tag = this.userStory.tag;
          this.isButtonDisabled = false;
          this.getSoftLabelConfigurations();
          this.AddUserStoryForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducer.getUniqueSprintWorkItem));
          this.userStory$.subscribe((x) => this.userStory = x);
          this.timeStamp = this.userStory.timeStamp;
          this.order = this.userStory.order;
          this.parentUserStoryId = this.userStory.parentUserStoryId;
          this.tag = this.userStory.tag;
          this.isButtonDisabled = false;
          this.getSoftLabelConfigurations();
          this.AddUserStoryForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          this.projectMembers$ = this.store.pipe(
            select(projectModuleReducer.getProjectMembersAll)
          );
          this.projectMembers$
            .subscribe((s) => (this.projectMembers = s));
          if (this.userStory) {
            this.getAssigneeValue(this.userStory.ownerUserId);
            this.getBugCausedUser(this.userStory.bugCausedUserId);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
        tap(() => {
          this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll));
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.dispatch(new LoadBugPriorityTypesTriggered());
    if (!this.KanbanForm) {
      this.projectFeatures$ = this.store.pipe(
        select(projectModuleReducer.getProjectFeaturesAll)
      );

    }
    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducer.getBugPriorityAll)
    );

    const sprintOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.upsertSprintworkItemsLoading)
    );

    const anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createUserStoryLoading)
    );

    const getUserStoryByIdLoading$ = this.store.pipe(
      select(projectModuleReducer.getUniqueUserStoryById)
    );

    const sprintUserStoryIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.getUniqueSprintWorkItemsLoading)
    );

    this.anyOperationInProgress$ = combineLatest(
      getUserStoryByIdLoading$,
      sprintUserStoryIsInProgress$,
      sprintOperationInProgress$,
      anyOperationInProgress$

    ).pipe(
      map(
        ([
          getUniqueUserStoryById,
          getUniqueSprintWorkItemsLoading,
          upsertSprintworkItemsLoading,
          createuserStoryLoading

        ]) =>
          getUniqueUserStoryById ||
          getUniqueSprintWorkItemsLoading ||
          upsertSprintworkItemsLoading ||
          createuserStoryLoading
      )
    );

  }

  setSprintParams() {
    this.isFromSprint = true;
    this.onBoardProcessDate = this.sprint.sprintStartDate;
    this.store.dispatch(new LoadMemberProjectsTriggered(this.sprint.projectId));
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.sprint.projectId;
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    if (!this.sprint.isBugBoard) {
      this.KanbanForm = true;
      this.loadSections();
    } else {
      this.KanbanForm = false;
    }
    if (this.sprint.sprintStartDate && !this.sprint.isReplan) {
      this.isActiveGoalStatusId = true;
    } else if (!this.sprint.sprintStartDate) {
      this.backlogGoalUserStory = false;
    } else if (this.sprint.isReplan) {
      this.replanGoalUserStory = true;
    }
  }

  setGoalParams() {
    this.isFromSprint = false;
    this.onBoardProcessDate = this.goal.onboardProcessDate;
    this.store.dispatch(new LoadMemberProjectsTriggered(this.goal.projectId));
    const projectFeature = new ProjectFeature();
    projectFeature.projectId = this.goal.projectId;
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    if (!this.goal.isBugBoard) {
      this.KanbanForm = true;
      this.loadSections();
    } else {
      this.KanbanForm = false;
    }
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isActiveGoalStatusId = true;
    } else if (this.goal.goalStatusId === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.backlogGoalUserStory = true;
    } else if (this.goal.goalStatusId === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.replanGoalUserStory = true;
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  AddUserStoryForm() {
    this.cdRef.detectChanges();
    this.isNewUserStory = false;
    this.cdRef.detectChanges();
    this.estimatedTime = this.userStory.estimatedTime;
    this.estimatedTimeSet = this.estimatedTime;
    this.tag = this.userStory.tag;
    if (this.userStory.bugPriorityId) {
      this.changePriority(this.userStory.bugPriorityId)
    } else {
      this.selectedPriority = "Select";
    }
    this.getAssigneeValue(this.userStory.ownerUserId);
    this.getBugCausedUser(this.userStory.bugCausedUserId);
    this.changeDependancy(this.userStory.dependencyUserId);
    this.KanbanUserStoryForm.patchValue(this.userStory);
    this.KanbanUserStoryForm.controls["estimatedTime"].setValue(this.estimatedTimeSet);
    this.KanbanUserStoryForm.controls["startDate"].setValue(this.userStory.userStoryStartDate);
    this.buttonText = this.translateService.instant("UPDATE");
    if (this.KanbanForm) {
      this.titleText = this.translateService.instant("USERSTORY.EDITUSERSTORY");
    } else {
      this.titleText = this.translateService.instant("USERSTORY.EDITBUG");
    }
    this.buttonIcon = "sync";
  }

  clearForm() {
    this.buttonText = this.translateService.instant("ADD");
    this.isNewUserStory = true;
    this.selectedBugCausedUser = null;
    this.selectedMember = null;
    this.selectedPriority = null;
    if (this.KanbanForm) {
      this.titleText = this.translateService.instant("USERSTORY.ADDUSERSTORY");
    } else {
      this.titleText = this.translateService.instant("USERSTORY.ADDBUG");
    }
    this.buttonIcon = "plus";
    this.estimatedTime = "";
    this.KanbanUserStoryForm = new FormGroup({
      userStoryName: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)
          // TODO: Shift this to constants
        ])
      ),
      userStoryTypeId: new FormControl(
        "",
        Validators.compose([
          Validators.required
        ])
      ),
      bug: new FormControl("", []),
      estimatedTime: new FormControl("", []),
      versionName: new FormControl("", []),
      deadLineDate: new FormControl(""),
      ownerUserId: new FormControl("", []),
      bugCausedUserId: new FormControl("", []),
      bugPriorityId: new FormControl(""),
      projectFeatureId: new FormControl("", []),
      userStoryId: new FormControl("", []),
      userStoryStatusId: new FormControl("", []),
      testSuiteSectionId: new FormControl("", []),
      isForQa: new FormControl("", []),
      sprintEstimatedTime: new FormControl("", []),
      dependencyUserId: new FormControl("", []),
      startDate: new FormControl(""),
    });
  }

  saveSprintEstimatedTime(estimatedTime) {
    if (estimatedTime > 99) {
      this.isValidation = true;
    } else {
      this.isValidation = false;
    }
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === "null") {
      this.estimatedTimeSet = null;
      this.isButtonDisabled = true;
    }
    else {
      this.estimatedTimeSet = estimatedTime;
      this.isButtonDisabled = false;
    }
    this.KanbanUserStoryForm.controls["estimatedTime"].setValue(this.estimatedTimeSet);
  }

  changeSection(event) {
    if (event == 0) {
      this.sectionId = event;
      this.KanbanUserStoryForm.controls["testSuiteSectionId"].setValue(null);
    }
  }

  setColorForBugPriorityTypes(color) {
    const styles = {
      // tslint:disable-next-line: object-literal-key-quotes
      "color": color
    };
    return styles;
  }

  getAssigneeValue(selectedEvent) {
    if (selectedEvent == 0) {
      selectedEvent = null;
      this.KanbanUserStoryForm.controls["ownerUserId"].setValue('');
    }
    this.assignee = selectedEvent;
    const projectMembers = this.projectMembers;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(projectMembers, function (member) {
      return member.projectMember.id === selectedEvent;
    })
    if (filteredList) {
      this.selectedMember = filteredList.projectMember.name;
    }
  }

  getBugCausedUser(selectedEvent) {
    if (selectedEvent === 0) {
      selectedEvent = null;
      this.KanbanUserStoryForm.controls["bugCausedUserId"].setValue(null);
      this.selectedBugCausedUser = null;
    }
    if (selectedEvent) {
      const projectMembers = this.projectMembers;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id === selectedEvent;
      })
      if (filteredList) {
        this.selectedBugCausedUser = filteredList.projectMember.name;
        this.cdRef.detectChanges();
      }
    } else {
      this.selectedBugCausedUser = null;
    }
  }

  changeStartDate(){
    let startDate = null;
    let deadLineDate = null;
    this.endDateValidate = false;
    this.startDateValidate = false;
    
    if(this.KanbanUserStoryForm.value.startDate){
      startDate = moment(moment(this.KanbanUserStoryForm.value.startDate).format('MM/DD/yyyy')).toDate();
    }
    if(this.KanbanUserStoryForm.value.deadLineDate){
      deadLineDate = moment(moment(this.KanbanUserStoryForm.value.deadLineDate).format('MM/DD/yyyy')).toDate();
    }

    if(startDate > deadLineDate && (startDate != null && deadLineDate != null)){
      this.startDateValidate = true;
      this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
    }
    else{
      this.startDateValidate = false;
    }
  }

  changeEndDate(){
    let startDate = null;
    let deadLineDate = null;
    this.endDateValidate = false;
    this.startDateValidate = false;
    
    if(this.KanbanUserStoryForm.value.startDate){
      startDate = moment(moment(this.KanbanUserStoryForm.value.startDate).format('MM/DD/yyyy')).toDate();
    }
    if(this.KanbanUserStoryForm.value.deadLineDate){
      deadLineDate = moment(moment(this.KanbanUserStoryForm.value.deadLineDate).format('MM/DD/yyyy')).toDate();
    }

    if(startDate > deadLineDate && (startDate != null && deadLineDate != null)){
      this.endDateValidate = true;
      this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
    }
    else{
      this.endDateValidate = false;
    }
  }


  SaveUserStory() {
    this.userStoryDetails = this.KanbanUserStoryForm.value;
    this.userStoryDetails.deadLineDate = this.userStoryDetails.deadLineDate;
    if(this.isDateTimeConfiguration){
    this.userStoryDetails.deadLine =this.covertTimeIntoUtcTime(this.userStoryDetails.deadLineDate);
    }
    else{
      this.userStoryDetails.deadLine =this.covertTimeIntoUtcTimes(this.userStoryDetails.deadLineDate);
    }
    this.userStoryDetails.timeZoneOffSet = (-(new Date(this.userStoryDetails.deadLineDate).getTimezoneOffset()));
    const workItemLabel = this.softLabelPipe.transform("Work Item", this.softLabels);
    if (this.userStoryDetails.userStoryId) {
      this.googleAnalyticsService.eventEmitter(workItemLabel, "Updated " + workItemLabel + "", this.userStoryDetails.userStoryName, 1);
    } else {
      this.googleAnalyticsService.eventEmitter(workItemLabel, "Created " + workItemLabel + "", this.userStoryDetails.userStoryName, 1);
    }
    this.userStoryDetails.estimatedTime = Number(this.estimatedTimeSet);
    if (this.isFromSprint) {
      this.userStoryDetails.sprintId = this.sprint.sprintId;
      this.userStoryDetails.projectId = this.sprint.projectId;
      this.userStoryDetails.goalId = this.userStory ? this.userStory.goalId : null;
      this.userStoryDetails.isBugBoard = this.sprint.isBugBoard;
    } else {
      this.userStoryDetails.goalId = this.goal.goalId;
      this.userStoryDetails.projectId = this.goal.projectId;
      this.userStoryDetails.sprintId = this.userStory ? this.userStory.sprintId : null;
      this.userStoryDetails.isBugBoard = this.goal.isBugBoard;
    }
    this.userStoryDetails.isGoalChanged = false;
    this.userStoryDetails.testCaseId = this.userStory ? this.userStory.testCaseId : null;
    this.userStoryDetails.parentUserStoryId = this.userStory ? this.userStory.parentUserStoryId : null;
    this.userStoryDetails.oldOwnerUserId = this.userStory ? this.userStory.ownerUserId : null;
    this.userStoryDetails.description = this.userStory ? this.userStory.description : null;
    this.userStoryDetails.timeStamp = this.timeStamp;
    this.userStoryDetails.order = this.order;
    this.userStoryDetails.tag = this.userStoryInputTags.toString();
    this.userStoryDetails.parentUserStoryId = this.parentUserStoryId;
    this.userStoryDetails.userStoryStartDate = this.KanbanUserStoryForm.value.startDate;

    if (this.userStoryDetails.estimatedTime == 0) {
      this.userStoryDetails.estimatedTime = null;
    }
    if (this.replanGoalUserStory) {
      this.userStoryDetails.isReplan = true;
      this.userStoryDetails.goalReplanId = this.goalReplanId
    } else {
      this.userStoryDetails.isReplan = false;
      this.userStoryDetails.goalReplanId = null;
    }


    if (this.isFromSprint) {
      this.store.dispatch(
        new UpsertSprintWorkItemTriggered(this.userStoryDetails)
      );
    } else {
      this.store.dispatch(
        new userStoryActions.CreateUserStoryTriggered(this.userStoryDetails)
      );
    }
  }
  covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
  }
  covertTimeIntoUtcTimes(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd")
  }
  searchUserStoryTypes() {
    const userStoryType = new UserStoryTypesModel();
    userStoryType.isArchived = false;
    this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryType))
  }

  closeUserStoryDialog() {
    this.formGroupDirective.resetForm();
    this.closeDialog.emit("");
  }

  checkPermissionForUserStory() {
    if (this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {
      let featurePermissions = [];
      const data = this.goal.entityFeaturesList[0];
      if (data) {
        featurePermissions = this.goal.entityFeaturesList[0].ProjectRoleFeatures;
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForAddOrUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem;
          // tslint:disable-next-line: only-arrow-functions
          const addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.EntityFeatureId.includes(entityTypeFeatureForAddOrUpdateUserStory)
          })
          if (addOrUpdateUserStoryPermisisonsList.length > 0) {
            this.isPermissionForUserStory = true;
          }
        }
      } else {
        this.isPermissionForUserStory = false;
      }
    }
  }

  loadSections() {
    if ((this.goal && this.goal.testSuiteId && !this.isFromSprint) || (this.sprint && this.sprint.testSuiteId && this.isFromSprint)) {
      this.showSectionsDropDown = true;
      if (this.isFromSprint) {
        this.testSuiteId = this.sprint.testSuiteId;
      } else {
        this.testSuiteId = this.goal.testSuiteId;
      }
      this.testRailStore.dispatch(new LoadTestCaseSectionListTriggered(this.testSuiteId));
      this.sectionsList$ = this.testRailStore.pipe(select(testRailModuleReducers.getTestCaseSectionAll));
    } else {
      this.showSectionsDropDown = false;
    }
  }

  openSectionPopover(sectionPopover) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'TestRepoPackageModule' });

    if (!module) {
      console.error("No module found for TestRepoPackageModule");
    }

    var path = loader[module.modulePackageName];

        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
      .then((moduleFactory: NgModuleFactory<any>) => {

        const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        var componentDetails = allComponentsInModule.find(elementInArray =>
          elementInArray.name.toLocaleLowerCase() === "Test Suite Section Edit".toLocaleLowerCase()
        );
        this.testSuitSectionEdit = {};
        this.testSuitSectionEdit.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitSectionEdit.inputs = {
          testSuiteId: this.testSuiteId,
          editingSection: this.sectionEdit
        };

        this.testSuitSectionEdit.outputs = {
          // closeSection: this.closeSectionPopover()
          closeSection: param => this.closeSectionPopover()
        }

        this.loadSection = true;
        sectionPopover.openPopover();

        this.cdRef.detectChanges();
      });
  }

  closeSectionPopover() {
    this.loadSection = false;
    this.addSectionsPopover.forEach((p) => p.closePopover());
  }


  changeDependancy(event) {
    if (event === 0) {
      event = null;
      this.selectedDependencyPerson = 'Select';

    }
    if (event) {
      var projectMembers = this.projectMembers;
      var filteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == event;
      })
      if (filteredList) {
        this.selectedDependencyPerson = filteredList.projectMember.name;
      }

    }
  }

  changePriority(event) {
    let bugpriorities = [];
    this.bugPriorities$.subscribe((x => bugpriorities = x));
    if (event == 0) {
      this.selectedPriority = "Select";
      this.KanbanUserStoryForm.controls['bugPriorityId'].setValue('');
    } else {
      var filteredList = _.find(bugpriorities, function (member) {
        return member.bugPriorityId == event;
      })
      if (filteredList) {
        this.selectedPriority = filteredList.description;
      } else {
        this.selectedPriority = "Select";
      }
    }
  }

  updateProjectFeature(event) {
    if (event == 0) {
      this.KanbanUserStoryForm.controls['projectFeatureId'].setValue('');
    }
  }

  saveUserStoryTags(event) {
    this.userStoryInputTags = event;
  }



  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}
