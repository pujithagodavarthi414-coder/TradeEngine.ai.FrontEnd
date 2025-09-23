import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { BoardTypeIds } from "../../../globalDependencies/constants/board-types";
import { SoftLabelConfigurationModel } from "../../../globaldependencies/models/softlabels-models";
import { CustomApplicationSearchModel } from "../../models/custom-application-search.model";
import { GenericFormSubmitted } from "../../models/generic-form-submitted.model";
import { GenericFormService } from "../../services/generic-form.service";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import { ConstantVariables } from "../../../globalDependencies/constants/constant-variables";
import { LoadCommentsCountTriggered } from "../../store/actions/comments.actions";
import { fileModel } from "../../models/fileModel";
import { FileSearchCriteriaInputModel } from "../../models/fileSearchCriteriaInputModel";
import { User } from "../../models/user";
import { UserStory } from "../../models/userStory";
import { WorkflowStatus } from "../../models/workflowStatus";
import { FileService } from "../../services/file.service";
import { ProjectGoalsService } from "../../services/goals.service";
import { LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { GetAdhocUsersTriggered } from "../../store/actions/adhoc-users.action";
import { AdhocWorkActionTypes, AdhocWorkStatusChangedTriggered, CreateAdhocWorkTriggered } from "../../store/actions/adhoc-work.action";
import { State } from "../../store/reducers/index";
import * as dashboardModuleReducers from "../../store/reducers/index"
import { CookieService } from 'ngx-cookie-service';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LoadUploadedFilesTriggered } from '@snovasys/snova-document-management';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  selector: "adhoc-userstory-detail",
  templateUrl: "adhoc-userstory-detail.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUserStoryDetailComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild("formio") formio;
  @ViewChild("showAssignee") showAssignee;
  profileImage: string;
  position: any;
  userStory;
  @Input("userStory")
  set _userStory(data: UserStory) {
    if (data) {
      if (this.tabstrip) {
        Promise.resolve(null).then(() => this.tabstrip.selectTab(0));
      }
      this.userStory = data;
      this.isEditUserStory = true;
      this.userStoryStatusId = this.userStory.userStoryStatusId;
      this.userStoryName = this.userStory.userStoryName;
      this.assignee = this.userStory.ownerUserId;
      this.estimatedTime = this.userStory.estimatedTime;
      this.estimatedTimeSet = this.estimatedTime;
      this.deadlineDate = this.userStory.deadLineDate;
      this.timeStamp = this.userStory.timeStamp;
      this.description = this.userStory.description;
      this.workFlowId = this.userStory.workFlowId;
      this.isFillForm = this.userStory.isFillForm;
      this.userStoryTypeId = this.userStory.userStoryTypeId;
      this.isLogTimeRequired = this.userStory.isLogTimeRequired;
      if (this.userStory.tag) {
        this.userStoryInputTags = this.userStory.tag.split(",");
        this.cdRef.detectChanges();
      } else {
        this.userStoryInputTags = [];
      }
      // this.customApplicationId = this.userStory.customApplicationId;
      if (this.userStory.customApplicationId && this.userStory.isFillForm && this.userStory.formId == null) {
        this.getCustomApplicationById(this.userStory.customApplicationId);
      } else if (this.userStory.formId != null) {
        this.getGenericFormById(this.userStory.formId);
      }
      if (this.userStory.genericFormSubmittedId) {
        this.getFormSubmittedDataById(this.userStory.genericFormSubmittedId);
      }
      if (this.userStory.taskStatusId.toLowerCase() === BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase()
        || this.userStory.taskStatusId.toLowerCase() === BoardTypeIds.DoneTaskStatusId.toLowerCase()) {
       
        this.userStoryStatusChecked = true;
      } else {
        
        this.userStoryStatusChecked = false;
      }
      this.store.dispatch(new LoadCommentsCountTriggered(this.userStory.userStoryId));
      this.getUserStoryTypes();
    }
  }

  @Input("isIncludeCompletedUserStories")
  set _isIncludeCompletedUserStories(data: boolean) {
    this.isIncludeCompletedUserStories = data;
  }

  @Input("isAdhocFromProjects")
  set _isAdhocFromProjects(data: boolean) {
    if (data === false) {
      this.isAdhocFromProjects = false;
    } else {
      this.isAdhocFromProjects = true;
    }
  }

  @ViewChild("tabstrip") public tabstrip: TabStripComponent;
  @ViewChildren("FileUploadPopup") FileUploadPopup;
  @Output() userStoryCloseClicked = new EventEmitter<any>();
  userStory$: Observable<UserStory>;
  teamLeads$: Observable<User[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  fileUploadIsInProgress$: Observable<boolean>;
  workflowStatus$: Observable<WorkflowStatus[]>;
  uploadedFiles$: Observable<fileModel[]>;
  commentsCount$: Observable<number>;
  workflowStatus: WorkflowStatus[];
  defaultProfileImage = "assets/images/faces/18.png"
  userStoryStatusId: string;
  assignee: string;
  estimatedTime: any;
  deadlineDate: Date;
  userStoryName: string;
  userStoryStatusChecked: boolean;
  description: string;
  isLogTimeRequired: boolean;
  isQaRequired: boolean;
  isEditUserStory: boolean;
  isAdhocFromProjects = true;
  timeStamp: any;
  selectedIndex = "GENERAL";
  isHistoryTab: boolean;
  filesUploaded: any;
  selectedStoreId: null;
  moduleTypeId = 4;
  referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
  isButtonVisible = true;
  workFlowId: string;

  userStoryTypes: UserStoryTypesModel[];
  isExtension = false;
  isFileUpload: boolean;
  minDate = new Date();
  isIncludeCompletedUserStories: boolean;
  users: User[];
  userStoryInputTags: string[] = [];
  selectedMember: string;
  taskStatusOrder: number;
  selectedStatusId: string;
  estimatedTimeSet: any;
  isFillForm: boolean;
  gettingCustomApplicationFormInProgress: boolean;
  validationMessage: string;
  customApplicationByIdData: any;
  formSrc: any;
  submittedData: any;
  genericFormDetails: any;
  genericFormSubmittedId: string;
  formData: any = { data: {} };
  customFormInProgress: boolean;
  ShowStatus = false;
  showEstimatedTime = false;
  showDeadlineDate = false;
  isEditorVisible = false;
  userStoryStatusColor: string;
  userStoryTypeId: string;
  componentModel: ComponentModel = new ComponentModel();

  public ngDestroyed$ = new Subject();

  public initSettings = {
    plugins: "paste",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  constructor(private store: Store<State>,
    private actionUpdates$: Actions,
    private goalService: ProjectGoalsService,
    private cdRef: ChangeDetectorRef,
    private genericFormService: GenericFormService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar,
    private cookieService: CookieService
  ) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.UpdateAdhocUserStories),
        tap(() => {
          this.userStory$ = this.store.pipe(select(dashboardModuleReducers.getAdhocUserStoryById));
          this.userStory$.subscribe((x) => this.userStory = x);
          this.isEditUserStory = true;
          this.userStoryStatusId = this.userStory.userStoryStatusId;
          this.userStoryName = this.userStory.userStoryName;
          this.assignee = this.userStory.ownerUserId;
          this.estimatedTime = this.userStory.estimatedTime;
          this.estimatedTimeSet = this.estimatedTime;
          this.deadlineDate = this.userStory.deadLineDate;
          this.timeStamp = this.userStory.timeStamp;
          this.description = this.userStory.description;
          this.timeStamp = this.userStory.timeStamp;
          if (this.userStory.tag) {
            this.userStoryInputTags = this.userStory.tag.split(",");
            this.cdRef.detectChanges();
          } else {
            this.userStoryInputTags = [];
          }
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.AdhocWorkStatusChangedCompleted),
        tap(() => {
          this.userStoryCloseClicked.emit();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.CreateAdhocWorkFailed),
        tap(() => {
          this.userStoryStatusId = this.userStory.userStoryStatusId;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted),
        tap(() => {
          this.userStory$ = this.store.pipe(select(dashboardModuleReducers.getAdhocUserStoryById));
          this.userStory$.subscribe((x) => this.userStory = x);
          
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          const workflowStatus = new WorkflowStatus();
          workflowStatus.workFlowId = this.workFlowId;
          if (workflowStatus.workFlowId) {
            this.workflowStatus$ = this.store.pipe(
              select(dashboardModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
            );
            this.workflowStatus$
              .subscribe((s) => (this.workflowStatus = s));

          }
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.store.dispatch(new GetAdhocUsersTriggered("", false));
    this.teamLeads$ = this.store.pipe(select(dashboardModuleReducers.getUserAll));
    this.teamLeads$.subscribe((x) => this.users = x);
    this.getWorkflowStatus();
    // this.uploadedFiles$ = this.store.pipe(
    //   select(commonModuleReducers.getUploadFilesListAll)
    // );
    this.anyOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.createAdhocUserStoryLoading));
    this.commentsCount$ = this.store.pipe(select(dashboardModuleReducers.getCommentsCount));
    //this.fileUploadIsInProgress$ = this.store.pipe(select(dashboardModuleReducers.getFileUploadLoading));

    // setting component model to pass default variable values
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  getWorkflowStatus() {
    const workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = this.workFlowId;
    if (workflowStatus.workFlowId) {
      this.workflowStatus$ = this.store.pipe(
        select(dashboardModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
      );
      this.workflowStatus$
        .subscribe((s) => (this.workflowStatus = s));
      if (this.workflowStatus.length <= 0) {
        this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
      }
    }
  }

  getUserStoryTypes() {
    const userStoryType = new UserStoryTypesModel();
    userStoryType.isArchived = false;
    this.goalService.getAllUserStoryTypes(userStoryType).subscribe((result: any) => {
      this.userStoryTypes = result.data;
    });
  }

  changeUserStoryType(userStoryTypeId) {
    this.userStoryTypeId = userStoryTypeId;
    this.saveUserStory();
  }

  saveUserStory() {
    const userStory = new UserStory();
    userStory.userStoryId = this.userStory.userStoryId;
    userStory.ownerUserId = this.assignee;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.deadLineDate = this.deadlineDate;
    userStory.userStoryName = this.userStoryName;
    userStory.timeStamp = this.timeStamp;
    userStory.description = this.description;
    userStory.workFlowTaskId = this.userStory.workFlowTaskId;
    userStory.userStoryTypeId = this.userStoryTypeId;
    userStory.userStoryStatusColor = this.userStory.userStoryStatusColor;
    userStory.isWorkflowStatus = this.userStory.referenceTypeId ? true : null;
    if (this.userStory.customApplicationId) {
      userStory.customApplicationId = this.userStory.customApplicationId;
    }
    if (this.userStory.formId) {
      userStory.formId = this.userStory.formId;
    }
    if (this.userStory.isFillForm) {
      userStory.isFillForm = this.userStory.isFillForm;
    }
    if (this.genericFormSubmittedId) {
      userStory.genericFormSubmittedId = this.genericFormSubmittedId;
    }
    this.store.dispatch(
      new CreateAdhocWorkTriggered(userStory)
    );
  }

  closeUserStoryDetailWindow() {
    this.userStory = null;
    this.userStoryCloseClicked.emit();
  }

  getUserStoryStatusChange(event) {
    const userStory = new UserStory();
    userStory.userStoryId = this.userStory.userStoryId;
    userStory.ownerUserId = this.assignee;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.deadLineDate = this.deadlineDate;
    userStory.userStoryName = this.userStoryName;
    userStory.timeStamp = this.timeStamp;
    userStory.description = this.description;
    userStory.workFlowTaskId = this.userStory.workFlowTaskId;
    userStory.userStoryTypeId = this.userStoryTypeId;
    userStory.tag = this.userStory.tag;
    userStory.isWorkflowStatus = this.userStory.referenceTypeId ? true : null;
    if (this.genericFormSubmittedId) {
      userStory.genericFormSubmittedId = this.genericFormSubmittedId;
    }
    if (this.workflowStatus.length > 0) {
      this.taskStatusOrder = this.workflowStatus[0].maxOrder;
    }
    const selectedStatus = this.workflowStatus.find((x) => x.orderId === this.taskStatusOrder);
    this.selectedStatusId = selectedStatus.userStoryStatusId;
    if (!this.isIncludeCompletedUserStories && this.userStoryStatusId === this.selectedStatusId) {
      this.store.dispatch(
        new AdhocWorkStatusChangedTriggered(userStory)
      );
    } else {
      this.saveUserStory();
    }
  }

  changeAssignee(event) {
    this.assignee = event;
    this.saveUserStory();
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === "null") {
      this.estimatedTimeSet = null;
    } else {
      this.estimatedTimeSet = estimatedTime;
    }
    if (this.estimatedTimeSet != null) {
      this.estimatedTimeSet = estimatedTime;
      this.saveUserStory();
    }
  }

  showMatFormField() {
    this.isEditUserStory = false;
  }

  updateUserStoryName() {
    this.saveUserStory();
  }

  changeDeadline() {
    console.log(this.deadlineDate);
    // tslint:disable-next-line:prefer-const
    let date = new Date(this.deadlineDate);
    this.saveUserStory();
  }

  enableEditor() {
    this.isEditorVisible = true;
  }

  handleDescriptionEvent(event) {
    this.saveDescription();
    this.isEditorVisible = false;
  }

  saveDescription() {
    this.saveUserStory();
  }

  openFileUpload() {
    this.isFileUpload = false;
    this.isExtension = false;
  }

  public onTabSelect(tabIndex) {
    console.log(tabIndex);

  }

  getResponsiblePerson(selectedId) {
    const projectResponsiblePersons = this.users;
    // tslint:disable-next-line:only-arrow-functions
    const filteredList = _.find(projectResponsiblePersons, function (member) {
      return member.id === selectedId;
    })
    if (filteredList) {
      this.selectedMember = filteredList.fullName;
    }
  }

  getCustomApplicationById(applicationId) {
    const customApplicationSearchModel = new CustomApplicationSearchModel();
    customApplicationSearchModel.customApplicationId = applicationId;
    this.gettingCustomApplicationFormInProgress = true;
    this.genericFormService.getCustomApplication(customApplicationSearchModel)
      .subscribe((responseData: any) => {
        const success = responseData.success;
        this.gettingCustomApplicationFormInProgress = false;
        if (success) {
          if (responseData.data) {
            this.customApplicationByIdData = responseData.data[0];
            this.formSrc = JSON.parse(this.customApplicationByIdData.formJson)
          }
        } else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
        }
      });
  }

  getGenericFormById(formId) {
    this.gettingCustomApplicationFormInProgress = true;
    this.genericFormService.GetGenericFormById(formId)
      .subscribe((responseData: any) => {
        const success = responseData.success;
        this.gettingCustomApplicationFormInProgress = false;
        if (success) {
          if (responseData.data) {
            this.customApplicationByIdData = responseData.data[0];
            this.customApplicationByIdData["formId"] = this.customApplicationByIdData.id;
            this.formSrc = JSON.parse(this.customApplicationByIdData.formJson)
          }
        } else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
        }
      });
  }

  onSubmit() {
    console.log(this.formio.formio.data);
    this.submittedData = this.formio.formio.data;
    this.submitForm();
  }

  submitForm() {
    this.customFormInProgress = true;
    const genericForm = new GenericFormSubmitted();
    genericForm.formJson = JSON.stringify(this.submittedData);
    genericForm.customApplicationId = this.customApplicationByIdData.customApplicationId;
    genericForm.formId = this.customApplicationByIdData.formId;
    if (this.userStory.genericFormSubmittedId) {
      genericForm.genericFormSubmittedId = this.userStory.genericFormSubmittedId;
      genericForm.timeStamp = this.genericFormDetails.timeStamp;
    }
    this.genericFormService.submitGenericApplication(genericForm).subscribe((result: any) => {
      this.customFormInProgress = false;
      if (result.success === true) {
        // tslint:disable-next-line: max-line-length
        this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
        this.genericFormSubmittedId = result.data;
        this.saveUserStory();
      } else {
        const validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
    })
  }

  getFormSubmittedDataById(genericFormSubmittedId) {
    const genericFormData = new GenericFormSubmitted();
    genericFormData.genericFormSubmittedId = genericFormSubmittedId;
    genericFormData.isArchived = false;
    this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
      this.genericFormDetails = responses.data[0];
      const genericFormDetails = responses.data[0].formJson;
      this.formData.data = JSON.parse(genericFormDetails);
    });
  }
  openStatus() {
    this.ShowStatus = !this.ShowStatus;
  }

  openEstimatedTime() {
    this.showEstimatedTime = !this.showEstimatedTime;
  }
  openDeadlineDate() {
    this.showDeadlineDate = !this.showDeadlineDate;
  }

  openFileUploadPopover(FileUploadPopup) {
    FileUploadPopup.openPopover();
  }

  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
  }

  openAssignee() {
    this.showAssignee.open();
  }

  changeWorkItemStatus(event) {
    if (event.checked) {
      this.userStoryStatusId = this.workflowStatus[1].userStoryStatusId;
    } else {
      this.userStoryStatusId = this.workflowStatus[0].userStoryStatusId;
    }
    this.getUserStoryStatusChange(null);
  }

}
