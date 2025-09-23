// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line:max-line-length
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, NgModuleFactory, NgModuleRef, Type, NgModuleFactoryLoader, ViewContainerRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line:ordered-imports
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { boardTypeapi } from "../../models/boardtypeApi";
import { BoardType } from "../../models/boardtypes";
import { ConsideredHours } from "../../models/consideredHours";
import { GoalModel } from "../../models/GoalModel";
import { ProjectMember } from "../../models/ProjectMember";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { ProjectSearchResult } from "../../models/ProjectSearchResult";
// tslint:disable-next-line: ordered-imports
import { LoadBoardTypesApiTriggered } from "../../store/actions/board-types-api.action";
// tslint:disable-next-line: ordered-imports
import { BoardTypesActionTypes, LoadBoardTypesTriggered } from "../../store/actions/board-types.action";
import { LoadConsideredHoursTriggered, ConsideredHoursActionTypes } from "../../store/actions/consider-hours.action";
import { CreateGoalTriggered, GoalActionTypes, CreateActiveGoalTriggered } from "../../store/actions/goal.actions";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import * as projectReducer from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { GoogleAnalyticsService } from '../../../globaldependencies/services/google-analytics.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { LoadProjectsTriggered } from '../../store/actions/project.actions';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TestSuiteList } from '../../models/testsuite';
import { LoadTestSuiteListTriggered, TestSuiteActionTypes, TestSuiteEditComponent } from "@snovasys/snova-testrepo"
import * as testRailModuleReducers from "@snovasys/snova-testrepo"
import { ProjectModulesService } from '../../services/project.modules.service';
import { ProjectGoalsService } from '../../services/goals.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from "@angular/common";
import * as moment_ from 'moment';
const moment = moment_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: "app-pm-component-goal-create",
  templateUrl: "goal-create.component.html",
  styles: [`
    @media only screen and (min-width: 1440px) {
      .goal-large {
        height: 365px;
        overflow-x: hidden !important;
      }

      .goal-small {
        height: 312px;
        overflow-x: hidden !important;
      }
      
      .goal-add-large {
        height: 300px;
        overflow-x: hidden !important;
      }

      .goal-add-small {
        height: 246px;
        overflow-x: hidden !important;
      }
      
    }
    

    @media only screen and (max-width: 1440px) {
      .goal-create-height {
        max-height: 245px;
        overflow-x: hidden !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalCreateComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("addTestSuitePopover") addTestSuitePopovers;

  projectId
  testSuitEdit: any = {};
  estimatedTimeSet: any;
  startDateValidate: boolean;
  endDateValidate: boolean;
  goalFormDisabled: boolean;
  estimatedTime: any;
  @Input("projectId")
  set setProjectId(projectId: string) {
    this.projectId = projectId;
    this.loadTestSuites();
  }

  @Input() goal: GoalModel;

  @Input()
  set setgoal(goal: GoalModel) {
    this.goal = goal;
  }

  clearCreateForm;
  @Input("clearCreateForm")
  set setclearCreateForm(clearCreateForm: boolean) {
    this.clearCreateForm = clearCreateForm;
    this.clearGoalForm();
  }
  @Input() isGoalUniquePage: boolean;
  set setisGoalUniquePage(isGoalUniquePage: boolean) {
    this.isGoalUniquePage = isGoalUniquePage;
  }
  @Input('isTestrailEnable')
  set _isTestrailEnable(data: boolean) {
    this.isTestrailEnable = data;
  }

  @Input("isActiveGoal")
  set _isActiveGoal(data: boolean) {
    this.isActiveGoal = data;
  }

  @Output() getGoalsCount = new EventEmitter<string>();
  @Output() closePopup = new EventEmitter<string>();
  @Output() submitClosePopup = new EventEmitter<string>();
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  projectMembers$: Observable<ProjectMember[]>;
  boardTypes$: Observable<BoardType[]>;
  considerHours$: Observable<ConsideredHours[]>;
  boardTypesApi$: Observable<boardTypeapi[]>;
  testSuitesList$: Observable<TestSuiteList[]>;
  testSuitesList: TestSuiteList[];
  boardTypes: BoardType[];
  considerHours: ConsideredHours[];
  boardTypesApi: boardTypeapi[];
  anyOperationInProgress$: Observable<boolean>;
  validationMessages$: Observable<string[]>;
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  projectSearchResults: ProjectSearchResult[];
  projectMembers: ProjectMember[];
  goalModel: GoalModel;
  buttonGoalText: string; // TODO: Move to constants
  buttonGoalIcon: string;
  titleGoalhead: string;
  showAPI = false;
  goalForm: FormGroup;
  selectedMember: string;
  autoCompleteOff: any;
  workFlowsList: any;
  showVersion: boolean;
  showTestSuite = false;
  isActiveGoal: boolean;
  loadAddTestSuite: boolean;
  projectLabel: string;
  goalLabel: string;
  isBoardTypeId: string;
  validationMessages: any[]; // TODO: any needs to be changed.
  public showProductivityHours: any;
  public ngDestroyed$ = new Subject();
  configurationId: string;
  editGoal: boolean;
  isTestrailEnable: boolean;
  minDate: Date = new Date();
  injector: any;
  currentUserId: string;
  companyId: string;
  boardTypeId: string;

  totalHours: any;
  isDetailsPage: boolean;
  regexPattern: string = "^[0-9]{1,3}[w][0-9]{1,3}[d][0-9]{1,3}[h]$|[0-9]{1,3}[d][0-9]{1,3}[h]$|[0-9]{1,3}[w][0-9]{1,3}[d]$|[0-9]{1,3}[w][0-9]{1,3}[h]$|[0-9]{1,3}[d]$|[0-9]{1,3}[w]$|[0-9]{1,3}[h]$";

  constructor(
    private store: Store<State>,
    private factoryResolver: ComponentFactoryResolver,
    private testRailStore: Store<testRailModuleReducers.State>,
    private actionUpdates$: Actions,
    private translateService: TranslateService,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private cdRef: ChangeDetectorRef,
    public googleAnalyticsService: GoogleAnalyticsService,
    private softLabelPipe: SoftLabelPipe,
    private ngModuleRef: NgModuleRef<any>,
    private compiler: Compiler,
    private vcr: ViewContainerRef,
    private goalService: ProjectGoalsService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    super();
    this.getSoftLabels();
    this.injector = this.vcr.injector;
    this.currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.companyId = this.cookieService.get(LocalStorageProperties.CompanyId);
    this.boardTypesApi$ = this.store.pipe(select(projectReducer.getBoardTypesApiAll),
      tap((result) => {
        if (result) {
          this.boardTypesApi = result;
          if (this.boardTypesApi && this.boardTypesApi.length == 0) {
            this.store.dispatch(new LoadBoardTypesApiTriggered());
          }
        }
      }));

    this.considerHours$ = this.store.pipe(select(projectReducer.getConsiderHoursAll),
      tap((result) => {
        if (result) {
          this.considerHours = result;
          if (this.considerHours && this.considerHours.length == 0) {
            this.store.dispatch(new LoadConsideredHoursTriggered());
          }
        }
      }));

      this.boardTypes$ = this.store.pipe(select(projectReducer.getBoardTypesAll),
      tap((result) => {
        if (result) {
          this.workFlowsList = result;
          if (this.workFlowsList && this.workFlowsList.length == 0) {
            this.store.dispatch(new LoadBoardTypesTriggered());
          } else {
            if(this.workFlowsList[0].companyId == this.companyId.toLowerCase()) {
              if (this.goal == null || this.goal == undefined) {
                let selectBoardType = this.workFlowsList.filter(items => items.boardTypeName == 'Kanban');
                this.boardTypeId = selectBoardType.length > 0 ? selectBoardType[0].boardTypeId : null;
                this.goalForm.controls["boardTypeId"].setValue(this.boardTypeId);
                if (this.boardTypeId && this.workFlowsList.length > 0)
                  this.selectConfiguration(this.boardTypeId);
              } else {
                  this.selectConfiguration(this.goal.boardTypeId);
              }
            } else {
              this.store.dispatch(new LoadBoardTypesTriggered());
            }
          }
        }
      }));

    this.projectSearchResults$ = this.store.pipe(select(projectReducer.getProjectsAll),
      tap((result) => {
        if (result) {
          this.projectSearchResults = result;
          if (this.projectSearchResults && this.projectSearchResults.length == 0) {
            const projectModel = new ProjectSearchCriteriaInputModel();
            projectModel.isArchived = false;
            this.store.dispatch(new LoadProjectsTriggered(projectModel));
          }
        }
      }));

    this.projectMembers$ = this.testRailStore.pipe(select(projectModuleReducer.getProjectMembersAll), tap((result) => {
      if (result) {
        this.projectMembers = result;
        if (this.projectMembers && this.projectMembers.length == 0) {
          this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
        } else {
          let projectId = this.projectMembers[0].projectId;
          if (projectId != this.projectId) {
            this.store.dispatch(new LoadMemberProjectsTriggered(this.projectId));
          } else {
            if (this.goal) {
              this.getAssigneeValue(this.goal.goalResponsibleUserId);
            }
          }
        }
      }
    }));

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalActionTypes.CreateGoalCompleted),
        tap(() => {
          if (this.isGoalUniquePage) {
            this.submitClosePopup.emit("");
          } else {
            this.closePopup.emit("");
          }
          this.clearGoalForm();
          this.formGroupDirective.resetForm();
        })

      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(BoardTypesActionTypes.LoadBoardTypesCompleted),
        tap(() => {
          this.boardTypes$ = this.store.pipe(select(projectReducer.getBoardTypesAll))
          this.boardTypes$.subscribe(x => this.workFlowsList = x);
          if (this.goal == null || this.goal == undefined) {
            let selectBoardType = this.workFlowsList.filter(items => items.boardTypeName == 'Kanban');
            this.boardTypeId = selectBoardType.length > 0 ? selectBoardType[0].boardTypeId : null;
            this.goalForm.controls["boardTypeId"].setValue(this.boardTypeId);
            if (this.boardTypeId && this.workFlowsList.length > 0)
              this.selectConfiguration(this.boardTypeId);
          } else {
              this.selectConfiguration(this.goal.boardTypeId);
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ConsideredHoursActionTypes.LoadConsideredHoursCompleted),
        tap(() => {
          this.considerHours$ = this.store.pipe(select(projectReducer.getConsiderHoursAll),
            tap((result) => {
              if (result) {
                this.considerHours = result;
                if (this.considerHours && this.considerHours.length > 0 && ((this.goal && !this.goal.considerEstimatedHoursId) || (!this.goal))) {
                  if (this.showProductivityHours) {
                    this.goalForm.controls["considerEstimatedHoursId"].setValue(this.considerHours[0].considerHourId);
                  }
                }
              }
            }));

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          this.projectMembers$ = this.store.pipe(
            select(projectReducer.getProjectMembersAll)
          );
          this.projectMembers$.subscribe((s) => (this.projectMembers = s));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.LoadTestSuiteCompleted),
        tap(() => {
          this.closeTestSuiteDialog();
          this.cdRef.markForCheck();
        })
      ).subscribe();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.createGoalLoading)
    );

    if (this.goal === null || this.goal === undefined) {
      this.clearGoalForm();
      let userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
      this.selectedMember = userModel.fullName;
      this.goalForm.controls["goalResponsibleUserId"].setValue(this.currentUserId);
      this.goalForm.controls["onboardProcessDate"].setValue(new Date());
      this.goalForm.controls["isToBeTracked"].setValue(true);
      this.goalForm.controls["isProductiveBoard"].setValue(true);
      this.goalForm.controls["boardTypeId"].setValue(this.boardTypeId);
      this.toggleIsProductiveBoard();
    } else {
      this.editGoalForm();
    }

  }

  loadTestSuites() {
    this.testSuitesList$ = this.testRailStore.pipe(select(testRailModuleReducers.getTestSuiteAll));
    this.testSuitesList$.subscribe((x => this.testSuitesList = x));
    if (this.testSuitesList && this.testSuitesList.length == 0) {
      const testsuite = new TestSuiteList();
      testsuite.projectId = this.projectId;
      testsuite.isArchived = false;
      this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));
    }
    else if (this.testSuitesList) {
      let projectId = this.testSuitesList[0].projectId;
      if (projectId != this.projectId) {
        const testsuite = new TestSuiteList();
        testsuite.projectId = this.projectId;
        testsuite.isArchived = false;
        this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));
      }
    }
    else {
      const testsuite = new TestSuiteList();
      testsuite.projectId = this.projectId;
      testsuite.isArchived = false;
      this.testRailStore.dispatch(new LoadTestSuiteListTriggered(testsuite));
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  clearGoalForm() {
    this.buttonGoalText = this.translateService.instant("ADD");
    this.buttonGoalIcon = "plus";
    this.titleGoalhead = this.translateService.instant("CREATEGOAL");
    this.showProductivityHours = false;
    this.showVersion = false;
    this.showTestSuite = false;
    this.editGoal = false;
    this.selectedMember = null;
    this.goalForm = new FormGroup({
      goalName: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)]) // TODO: need to come from constants.
      ),
      projectId: new FormControl(this.projectId, []),
      goalShortName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)])),
      onboardProcessDate: new FormControl("", []),
      goalResponsibleUserId: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)]) // TODO: need to come from constants.
      ),
      boardTypeId: new FormControl("", []),
      boardTypeApiId: new FormControl("", []),
      testSuiteId: new FormControl("", []),
      isProductiveBoard: new FormControl("", []),
      isToBeTracked: new FormControl("", []),
      considerEstimatedHoursId: new FormControl("", []),
      version: new FormControl("", []),
      goalId: new FormControl("", []),
      isParked: new FormControl("", []),
      isArchived: new FormControl("", []),
      isApproved: new FormControl("", []),
      isLocked: new FormControl("", []),
      goalStatusId: new FormControl("", []),
      timeStamp: new FormControl("", []),
      endDate: new FormControl("", []),
      estimatedTime: new FormControl("", []),
    });
  }

  closedialog() {
    this.formGroupDirective.resetForm();
    if (this.isGoalUniquePage) {
      this.submitClosePopup.emit("text");
    } else {
      this.closePopup.emit("");
    }
  }

  editGoalForm() {
    this.editGoal = true;
    this.buttonGoalText = this.translateService.instant("UPDATE");
    this.buttonGoalIcon = "sync";
    this.titleGoalhead = this.translateService.instant("EDITGOAL");
    this.showProductivityHours = this.goal.isProductiveBoard;
    this.configurationId = this.goal.configurationId;
    this.getAssigneeValue(this.goal.goalResponsibleUserId);
    
    this.estimatedTime = this.goal.goalEstimateTime;
    this.estimatedTimeSet = this.estimatedTime;
    
    this.goalForm = new FormGroup({
      goalId: new FormControl(this.goal.goalId, []),
      goalName: new FormControl(
        this.goal.goalName,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      projectId: new FormControl(this.goal.projectId, []),
      goalShortName: new FormControl(this.goal.goalShortName, Validators.compose([Validators.required, Validators.maxLength(250)])),
      onboardProcessDate: new FormControl(this.goal.onboardProcessDate, []),
      goalResponsibleUserId: new FormControl(
        this.goal.goalResponsibleUserId,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      boardTypeId: new FormControl(this.goal.boardTypeId, []),
      boardTypeApiId: new FormControl(this.goal.boardTypeApiId, []),
      testSuiteId: new FormControl(this.goal.testSuiteId, []),
      isProductiveBoard: new FormControl(this.goal.isProductiveBoard, []),
      isToBeTracked: new FormControl(this.goal.isToBeTracked, []),
      considerEstimatedHoursId: new FormControl(
        this.goal.considerEstimatedHoursId,
        []
      ),
      version: new FormControl(this.goal.version, []),
      isParked: new FormControl(this.goal.isParked, []),
      isArchived: new FormControl(this.goal.isArchived, []),
      isApproved: new FormControl(this.goal.isApproved, []),
      isLocked: new FormControl(this.goal.isLocked, []),
      goalStatusId: new FormControl(this.goal.goalStatusId, []),
      timeStamp: new FormControl(this.goal.timeStamp, []),
      endDate: new FormControl(this.goal.endDate, []),
      estimatedTime: new FormControl(this.estimatedTimeSet, [])
    });
    this.showAPI = false;
    this.selectConfiguration(this.goal.boardTypeId);
  }

  selectConfiguration(boardTypeId) {

    let isBugBoard = false;
    if (this.workFlowsList && this.workFlowsList.length > 0) {
      const index = this.workFlowsList.findIndex((x: { boardTypeId: any; }) => x.boardTypeId === boardTypeId);
      isBugBoard = this.workFlowsList[index].isBugBoard;
    }

    if (boardTypeId === ConstantVariables.BoardTypeIdForAPI) {
      this.showAPI = true;
      this.showVersion = false;
      this.showTestSuite = true;

    } else if (isBugBoard) {
      this.showAPI = false;
      this.showVersion = true;
      this.showTestSuite = false;

    } else {
      this.showAPI = false;
      this.showVersion = false;
      this.showTestSuite = true;
    }
    this.isBoardTypeId = boardTypeId;
  }

  getAssigneeValue(selectedEvent) {
    const projectMembers = this.projectMembers;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.find(projectMembers, function (member) {
      return member.projectMember.id === selectedEvent;
    })
    if (filteredList) {
      this.selectedMember = filteredList.projectMember.name;
      this.cdRef.detectChanges();
    }
  }

  toggleIsProductiveBoard() {
    // TODO: need a better name,
    this.showProductivityHours = !this.showProductivityHours;
    this.considerHours$.subscribe((x) => this.considerHours = x);
    if (this.showProductivityHours) {
      if (this.considerHours && this.considerHours.length > 0) {
        this.goalForm.controls["considerEstimatedHoursId"].setValue(this.considerHours[0].considerHourId);
      }
    } else {
      this.goalForm.controls["considerEstimatedHoursId"].setValue("");
    }
  }

  changeTestSuiteId(event) {
    if (event == 0) {
      this.goalForm.controls['testSuiteId'].setValue('');
    }
  }
  
  changeStartDate(){
    this.endDateValidate = false;
    this.startDateValidate = false;
    let startDate = null;
    let endDate = null;

    if(this.goalForm.value.onboardProcessDate){
      startDate = moment(moment(this.goalForm.value.onboardProcessDate).format('MM/DD/yyyy')).toDate();
    }
    if(this.goalForm.value.endDate){
      endDate = moment(moment(this.goalForm.value.endDate).format('MM/DD/yyyy')).toDate();
    }
    
    if(startDate > endDate && (startDate != null && endDate != null)){
      this.startDateValidate = true;
       this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDENDDATEMESSAGE"));
    }
    else{
      this.startDateValidate = false;
    }
  }

  changeEndDate(){
    let startDate = null;
    let endDate = null;
    this.endDateValidate = false;
    this.startDateValidate = false;
    
    if(this.goalForm.value.onboardProcessDate){
      startDate = moment(moment(this.goalForm.value.onboardProcessDate).format('MM/DD/yyyy')).toDate();
    }
    if(this.goalForm.value.endDate){
      endDate = moment(moment(this.goalForm.value.endDate).format('MM/DD/yyyy')).toDate();
    }

    if(startDate > endDate && (startDate != null && endDate != null)){
      this.endDateValidate = true;
      this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDENDDATEMESSAGE"));
    }
    else{
      this.endDateValidate = false;
    }
  }

  saveGoal() {
    // TODO: Name is pascal case. Needs to be camel case.
    this.goalModel = this.goalForm.value;
    this.goalModel.goalEstimateTime = this.estimatedTimeSet;
    this.goalModel.onboardProcessDatedeadLineDate = this.goalModel.onboardProcessDate;
    this.goalModel.onboardProcessDatedeadLine =this.covertTimeIntoUtcTime(this.goalModel.onboardProcessDate);
    this.goalModel.timeZoneOffSet = (-(new Date(this.goalModel.onboardProcessDate).getTimezoneOffset()));
    if (this.showTestSuite === false) {
      this.goalModel.testSuiteId = null;
    }
    // tslint:disable-next-line: triple-equals
    this.goalModel.isMovingToAnotherProject = (this.goalForm.get("projectId").value == this.projectId) ? false : true;
    const goalLabel = this.softLabelPipe.transform("Goal", this.softLabels);
    if (this.goalModel.goalId) {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Updated " + goalLabel + "", this.goalModel.goalName, 1);
      this.goalModel.isEdit = true;
      this.goalModel.description = this.goal.description;
    } else {
      this.googleAnalyticsService.eventEmitter(goalLabel, "Created " + goalLabel + "", this.goalModel.goalName, 1);
      this.goalModel.isEdit = false;
    }
    if (this.goal && this.goal.goalId && this.goal.boardTypeId !== this.isBoardTypeId) {
      localStorage.setItem("boardtypeChanged", "true");
    } else {
      localStorage.setItem("boardtypeChanged", "false");
    }
    if (this.isActiveGoal) {
      this.goalModel.isApproved = true;
    }

    this.goalModel.isActive = this.isActiveGoal;
    if (this.isActiveGoal) {
      this.store.dispatch(new CreateActiveGoalTriggered(this.goalModel));
    } else {
      this.store.dispatch(new CreateGoalTriggered(this.goalModel));
    }
  }

  openTestSuiteDialog(addTestSuitePopover) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'TestRepoPackageModule' });
    
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
          elementInArray.name.toLocaleLowerCase() === "Test Suite Edit".toLocaleLowerCase()
        );
        this.testSuitEdit = {};
        this.testSuitEdit.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitEdit.inputs = {
          projectId: this.projectId
        };
        this.testSuitEdit.outputs = {
          closeTestSuite: param => this.closeTestSuiteDialog()
        };

        this.loadAddTestSuite = true;
        addTestSuitePopover.openPopover();

        this.cdRef.detectChanges();
      });
  }

  closeTestSuiteDialog() {
    this.loadAddTestSuite = false;
    this.addTestSuitePopovers.forEach((p: { closePopover: () => void; }) => p.closePopover());
  }

  checkStyle() {
    if (!this.editGoal && !this.showProductivityHours)
      return 'goal-add-small';
    else if (!this.editGoal && this.showProductivityHours)
      return 'goal-add-large';
    else if (this.editGoal && !this.showProductivityHours)
      return 'goal-small';
    else if (this.editGoal && this.showProductivityHours)
      return 'goal-large';
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === 'null') {
        this.estimatedTimeSet = null;
        this.goalFormDisabled = true;
        this.cdRef.markForCheck();
    }
    else {
        this.estimatedTimeSet = estimatedTime;
        this.goalFormDisabled = false;
        this.cdRef.markForCheck();
    }
    this.goalForm.controls['estimatedTime'].setValue(this.estimatedTimeSet);
}
  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
  covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
  }
}