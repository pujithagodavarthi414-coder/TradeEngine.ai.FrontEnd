import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef, Input, EventEmitter, Output, ViewEncapsulation, ViewChildren } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { UserStory } from "../../models/userStory";
import { StatusesModel } from "../../models/workflowStatusesModel";
import { ComponentModel } from "@snovasys/snova-comments";
import { Subject, Observable } from "rxjs";
import * as dashboardModuleReducers from "../../store/reducers";
import { SoftLabelConfigurationModel } from "../../../globaldependencies/models/softlabels-models";
import { WorkflowStatus } from "../../models/workflowStatus";
import { fileModel } from "../../models/fileModel";
import { User } from "../../models/user";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { Actions, ofType } from "@ngrx/effects";
import { FileSearchCriteriaInputModel } from "../../models/fileSearchCriteriaInputModel";
import { BoardTypeIds } from "../../../globaldependencies/constants/board-types";
import { GenericFormService } from "../../services/generic-form.service";
import { GenericFormSubmitted } from "../../models/generic-form-submitted.model";
import { ProjectGoalsService } from "../../services/goals.service";
import { CustomApplicationSearchModel } from "../../models/custom-application-search.model";
import { ToastrService } from "ngx-toastr";
import { SoftLabelPipe } from "../../../globaldependencies/pipes/softlabels.pipes";
import { TranslateService } from "@ngx-translate/core";
import { GetAdhocUsersTriggered } from "../../store/actions/adhoc-users.action";
import { LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { takeUntil, tap } from "rxjs/operators";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { CookieService } from "ngx-cookie-service";
import { AdhocWorkStatusChangedTriggered, CreateAdhocWorkTriggered, AdhocWorkActionTypes, GetAdhocWorkUniqueUserStoryByIdTriggered } from "../../store/actions/adhoc-work.action";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { ActivatedRoute, Router } from "@angular/router";
import { FeatureIds } from "../../../globaldependencies/constants/feature-ids";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { LoadUploadedFilesTriggered } from '@snovasys/snova-document-management';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment))

@Component({
    selector: "app-adhoc-unique-detail",
    templateUrl: "adhoc-unique-detail.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUniqueDetailComponent extends CustomAppBaseComponent implements OnInit {
    @Input("userStory")
    set _userStory(data: UserStory) {
        if (data) {
            this.dropdowns = [
                {
                    name: 'Comment',
                    value: 'Comment'
                },
                {
                    name: 'Worklog',
                    value: 'Worklog'
                },
                {
                    name: 'History',
                    value: 'History'
                }
            ];

            this.userStory = data;
            this.loadUserStoryData();
            this.getUserStoryTypes();
            this.store.dispatch(new GetAdhocWorkUniqueUserStoryByIdTriggered(this.userStory.userStoryId));
        }
    }

    @Input("isAdhocFromProjects")
    set _isAdhocFromProjects(data: boolean) {
        if (data === false) {
            this.isAdhocFromProjects = false;
        } else {
            this.isAdhocFromProjects = true;
        }
    }

    @Input("isFromUrl")
    set _isFromUrl(data: boolean) {
        if (data || data == false) {
            this.isFromUrl = data;
        } else {
            this.isFromUrl = true;
        }
    }

    @ViewChildren("FileUploadPopup") FileUploadPopup;
    @ViewChild("editUserStoryMenuPopover") editUserStoryPopUp: SatPopover;
    @ViewChild("parkUserstoryPopover") parkUserStoryPopUp: SatPopover;
    @ViewChild("archiveUserstoryPopover") archiveUserStoryPopUp: SatPopover;
    @ViewChild("userstoryTagsPopover") userStoryTagsPopUp: SatPopover;
    @ViewChild("formio") formio;
    @Output() userStoryCloseClicked = new EventEmitter<any>();
    @Output() toggleUserStory = new EventEmitter<string>();
    userStory$: Observable<UserStory>;
    teamLeads$: Observable<User[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress$: Observable<boolean>;
    loadingOperationInProgress$: Observable<boolean>;
    fileUploadIsInProgress$: Observable<boolean>;
    descriptionLoading$: Observable<boolean>;
    userStoryIsInProgress$: Observable<boolean>;
    loadingEntityFeatures$: Observable<boolean>;
    workflowStatus$: Observable<WorkflowStatus[]>;
    uploadedFiles$: Observable<fileModel[]>;
    commentsCount$: Observable<number>;
    workflowStatus: WorkflowStatus[];
    isEditFromProjects: boolean;
    userStoryId: string;
    userStory: UserStory;
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
    isTagsPopUp: boolean;
    isAdhocFromProjects = true;
    isFromUrl = true;
    timeStamp: any;
    selectedIndex = "GENERAL";
    isHistoryTab: boolean;
    filesUploaded: any;
    selectedStoreId: null;
    moduleTypeId = 4;
    referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
    questionReferenceTypeId = ConstantVariables.AuditQuestionsReferenceTypeId;
    isButtonVisible = true;
    workFlowId: string;
    userStoryTypes: UserStoryTypesModel[];
    isExtension = false;
    isFileUpload: boolean;
    minDate = new Date();
    isIncludeCompletedUserStories: boolean;
    users: User[];
    userStoryInputTags: string[] = [];
    dropdowns: any[];
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
    selectedTab: string = "History";
    formData: any = { data: {} };
    customFormInProgress: boolean;
    ShowStatus = false;
    showEstimatedTime = false;
    showDeadlineDate = false;
    isEditorVisible = false;
    descriptionSlug: string;
    userStoryStatusColor: string;
    userStoryTypeId: string;
    userStoryNameDuplicate: string;
    isEditWIName: boolean;
    isParked: boolean = true;
    isArchived: boolean = true;
    componentModel: ComponentModel = new ComponentModel();

    public initSettings = {
        plugins: "paste",
        branding: false,
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };
    public ngDestroyed$ = new Subject();
    constructor(private store: Store<State>,
        private actionUpdates$: Actions,
        private cdRef: ChangeDetectorRef,
        private genericFormService: GenericFormService,
        private goalService: ProjectGoalsService,
        private toastr: ToastrService,
        private softLabelsPipe: SoftLabelPipe,
        private translateService: TranslateService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar,
        private router: Router,) {
        super();

        this.route.params.subscribe(params => {
            this.userStoryId = params["id"];
            if (this.router.url.includes('projects')) {
                if (this.userStoryId) {
                    this.store.dispatch(new GetAdhocWorkUniqueUserStoryByIdTriggered(this.userStoryId));
                }
            }
        });

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
                    this.isEditorVisible = false;
                    this.loadUserStoryData();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdCompleted),
                tap(() => {
                    this.userStory$ = this.store.pipe(select(dashboardModuleReducers.getUniqueAdhocWork));
                    this.userStory$.subscribe((x) => this.userStory = x);
                    this.isEditorVisible = false;
                    this.workFlowId = this.userStory.workFlowId;
                    this.getWorkflowStatus();
                    this.loadUserStoryData();
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
    }
    ngOnInit() {
        super.ngOnInit();


        this.getSoftLabelConfigurations();
        this.getUserStoryTypes();
        this.getWorkflowStatus();
        this.store.dispatch(new GetAdhocUsersTriggered("", false));
        this.teamLeads$ = this.store.pipe(select(dashboardModuleReducers.getUserAll));
        this.teamLeads$.subscribe((x) => this.users = x);
        this.anyOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.createAdhocUserStoryLoading));
        this.descriptionLoading$ = this.store.pipe(select(dashboardModuleReducers.createAdhocUserStoryLoading));
        this.userStoryIsInProgress$ = this.store.pipe(select(dashboardModuleReducers.upsertTagsLoading));
        this.loadingOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.getUniqueAdhocWorkLoading));
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });

        this.dropdowns = [
            {
                name: 'Comment',
                value: 'Comment'
            },
            {
                name: 'Worklog',
                value: 'Worklog'
            },
            {
                name: 'History',
                value: 'History'
            }
        ];

    }

    loadUserStoryData() {
        this.userStoryId = this.userStory.userStoryId;
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

    showMatFormField() {
        this.userStoryNameDuplicate = this.userStoryName;
        this.isEditWIName = true;
    }


    selectchange(value) {
        this.selectedTab = value;
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
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


    getUserStoryTypes() {
        const userStoryType = new UserStoryTypesModel();
        userStoryType.isArchived = false;
        this.goalService.getAllUserStoryTypes(userStoryType).subscribe((result: any) => {
            this.userStoryTypes = result.data;
            this.loadUserStoryData();
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


    updateUserStoryName() {
        if (this.userStoryNameDuplicate) {
            this.userStoryName = this.userStoryNameDuplicate;
            this.saveUserStory();
            this.isEditWIName = false;
        }
        else {
            const message = this.softLabelsPipe.transform(this.translateService.instant('USERSTORY.PLEASEENTERUSERSTORYNAME'), this.softLabels);
            this.toastr.warning("", message);
        }
    }

    enableEditor() {
        this.isEditorVisible = !this.isEditorVisible;
    }


    handleDescriptionEvent() {
        this.saveUserStory();
    }

    descriptionReset() {
        this.description = this.userStory.description;
    }

    cancelDescription() {
        this.description = this.userStory.description;
        this.isEditorVisible = false;
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
        userStory.referenceId = this.userStory.referenceId; 
        userStory.referenceTypeId = this.userStory.referenceTypeId; 
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
        if (this.genericFormSubmittedId) {
            userStory.genericFormSubmittedId = this.genericFormSubmittedId;
        }
        if (this.workflowStatus.length > 0) {
            this.taskStatusOrder = this.workflowStatus[0].maxOrder;
        }
        const selectedStatus = this.workflowStatus.find((x) => x.orderId === this.taskStatusOrder);
        this.selectedStatusId = selectedStatus.userStoryStatusId;
        this.saveUserStory();

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


    changeDeadline() {
        this.saveUserStory();
    }

    openTagsPopUp() {
        this.isTagsPopUp = !this.isTagsPopUp;
    }

    closeTagsDialog() {
        this.isTagsPopUp = !this.isTagsPopUp;
        this.userStoryTagsPopUp.close();
        this.editUserStoryPopUp.close();
    }

    closeParkPopUp(event) {
        if (!this.isAdhocFromProjects) {
            if (event == "yes") {
                this.toggleUserStory.emit('yes');
            } else {
                this.parkUserStoryPopUp.close();
                this.editUserStoryPopUp.close();
            }
        }
    }

    closeArchivePopUp(event) {
        if (!this.isAdhocFromProjects) {
            if (event == "yes") {
                this.toggleUserStory.emit('yes');
            } else {
                this.archiveUserStoryPopUp.close();
                this.editUserStoryPopUp.close();
            }
        }
    }
}
