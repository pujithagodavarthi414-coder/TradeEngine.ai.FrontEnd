import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, ElementRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, Input, TemplateRef, ComponentFactoryResolver } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { AuditCompliance } from "../models/audit-compliance.model";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../store/reducers/index";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LoadAuditListTriggered, AuditActionTypes, LoadAuditTagTriggered, LoadAuditTagListTriggered, LoadAuditCloneTriggered, LoadAuditTriggered, LoadAuditByIdTriggered } from "../store/actions/audits.actions";
import * as auditModuleReducer from "../store/reducers/index";
import { tap, takeUntil } from "rxjs/operators";
import { ComponentModel } from "@snovasys/snova-comments";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionViewTriggered, QuestionActionTypes } from "../store/actions/questions.actions";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { ToastrService } from "ngx-toastr";
// import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { RecurringCronExpressionModel } from '../dependencies/models/cron-expression-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

import * as $_ from 'jquery';
import { AuditModulesService } from '../services/audit.modules.service';
import { FilesElement } from '../models/file-element.model';
import * as _ from "underscore";
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditService } from '../services/audits.service';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const $ = $_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-audit-unique-detail",
    templateUrl: "audit-unique-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditUniqueDetailComponent extends CustomAppBaseComponent implements OnInit {

    @Input("referenceId")
    set _referenceId(data: string) {
        this.auditId = data;
    }


    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("editGoalMenuPopover") editGoalMenuPopover: SatPopover;
    @ViewChild("editAuditMenuPopover") editAuditsMenuPopover: SatPopover;
    @ViewChild("addAudit") addAuditPopover: SatPopover;
    @ViewChild("customFields") customFieldsPopover: SatPopover;
    @ViewChild("addComment") addCommentPopover: SatPopover;

    @ViewChild("deleteAudit") deleteAuditPopover: SatPopover;
    @ViewChild("cloneAudit") cloneAuditPopover: SatPopover;
    @ViewChild("versionAudit") versionAuditPopover: SatPopover;
    @ViewChild("versionHistory") versionHistoryPopover: SatPopover;
    @ViewChild("auditTagsPopover") auditTagPopover: SatPopover;
    @ViewChild("auditTitle") auditTitleStatus: ElementRef;
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;

    @ViewChild("auditVersionUniqueDetail") private auditVersionUniqueDetailDialog: TemplateRef<any>;

    softLabels: SoftLabelConfigurationModel[];
    selectedAudit: any;
    auditRequiredData: any;
    auditId: string;
    projectId: string;
    auditVersionId: string;
    isArchived: any;
    componentModel: ComponentModel = new ComponentModel();
    description: any;
    isEditorVisible: boolean;
    categorySelected: any;
    questionData: any;
    previewQuestionData: any;
    categoryTemporaryData: any;
    selectedQuestionFromPreview: any;
    hierarchicalCategoriesData: any;
    auditCategoryId: any;
    categoryData: any;
    screenWidth: any;
    auditInputTags = [];
    auditTagsModels: any;
    injector: any;
    documentStoreComponent: any;
    auditDocumentId: any;

    fileElement: FilesElement;

    auditVersionForm: FormGroup;

    auditVersions = [];

    loadAddAudit: boolean = false;
    isAudit: boolean = false;
    isAuditCategories: boolean = false;
    loadAuditRelatedData: boolean = false;
    loadAuditCategoryRelatedData: any;
    auditArchiveFilter: boolean = false;
    previewQuestion: boolean = false;
    upsertQuestion: boolean = false;
    isEditQuestion: boolean = false;
    disableAddAndSave: boolean = false;
    isHierarchical: boolean;
    auditsCount: boolean = true;
    categoriesCount: number = 0;
    questionsCount: number = 0;

    tag: string;
    showTooltip: boolean = false;
    expansionIcon: boolean = false;
    panelOpenState: boolean = false;
    isEditAudit: boolean = false;
    disableAudit: boolean = false;
    disableTag: boolean = false;
    removable: boolean = true;
    visible: boolean = true;
    selectable: boolean = true;
    disableAuditDelete: boolean = false;
    disableAuditClone: boolean = false;
    disableAddVersion: boolean = false;
    loadingAuditVersions: boolean = false;
    haveAuditVersions: boolean = false;
    loadPopover: boolean = false;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    auditList$: Observable<AuditCompliance[]>;
    customTagsModel$: Observable<AuditCompliance[]>;
    customTagsModel: AuditCompliance[];

    public initSettings: any = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
       // powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        //toolbar: 'link image code'
    };

    public ngDestroyed$ = new Subject();

    loadDocuments: boolean = false;
    documentsModuleLoaded: boolean = false;
    canAccess_AddOrUpdateAudit: boolean = false;
    canAccess_CanAddAuditLevelCustomFields: boolean = false;
    canAccess_entityType_feature_CanAddAndViewAuditLevelComments: boolean = false;
    canAccess_CanCloneAudit: boolean = false;
    canAccess_ArchiveOrUnarchiveAudit: boolean = false;
    canAccess_CanAssignAuditTags: boolean = false;
    canAccess_CanCreateAuditVersion: boolean = false;
    canAccess_CanViewAuditVersions: boolean = false;
    loadingAudit: boolean;
    constructor(
        private store: Store<State>,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private actionUpdates$: Actions,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private auditService: AuditService,
        public dialog: MatDialog,
        private snackbar: MatSnackBar,
        private cookieService: CookieService, private toastr: ToastrService
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>) {
        super();

        this.injector = this.vcr.injector;

        // localStorage.setItem("goalUniquePage", "true");
        this.route.params.subscribe((params) => {
            this.auditId = params["id"];
        });
        this.getSoftLabelConfigurations();
        this.initializeAuditVersionForm();
        this.getEntityRoleFeaturesByUserId();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.AuditFailed),
                tap(() => {
                    //   this.disableAudit = false;
                    //   this.disableTag = false;
                    //   this.disableAuditDelete = false;
                    //   this.disableAuditClone = false;
                    this.loadingAudit = false;
                    this.deleteAuditPopover  ? this.deleteAuditPopover.close() : null;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditCompleted),
                tap((data) => {
                    let searchAudit = new AuditCompliance();
                    searchAudit.auditId = this.auditId;
                    // searchAudit.projectId = this.projectId;
                    //searchAudit.isArchived = false;
                    searchAudit.canRefreshAudit = true;
                    this.loadingAudit = false;
                    this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditListCompleted),
                tap((result: any) => {
                    if (result && result.searchAudits && result.searchAudits.length > 0) {
                        let data = result.searchAudits[0];
                        this.selectedAudit = result.searchAudits[0];
                        this.projectId = data.projectId;
                        this.description = this.selectedAudit.auditDescription;
                        this.categoriesCount = this.selectedAudit.auditCategoriesCount;
                        this.questionsCount = this.selectedAudit.auditQuestionsCount;
                        this.haveAuditVersions = this.selectedAudit.haveAuditVersions;
                        this.auditTagsModels = this.selectedAudit.auditTagsModels;
                        this.auditInputTags = [];
                        this.selectedAudit.auditTagsModels.forEach(x => {
                            this.auditInputTags.push(x);
                        });
                        this.cdRef.detectChanges();
                    } else if (result.searchAudits && result.searchAudits.length == 0) {
                        this.selectedAudit = new AuditCompliance();
                        this.categoriesCount = 0;
                        this.questionsCount = 0;
                        this.projectId = null;
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        // this.actionUpdates$
        //     .pipe(
        //         takeUntil(this.ngDestroyed$),
        //         ofType(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
        //         tap((result: any) => {
        //             this.closeUpsertDialog();
        //         })
        //     ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAudits && result.searchAudits.length > 0 && this.selectedAudit.auditId == result.searchAudits[0].auditId) {
                        this.categoriesCount = result.searchAudits[0].auditCategoriesCount;
                        this.questionsCount = result.searchAudits[0].auditQuestionsCount;
                        this.auditTagsModels = result.searchAudits[0].auditTagsModels;
                        this.description = result.searchAudits[0].auditDescription;
                        this.haveAuditVersions = result.searchAudits[0].haveAuditVersions;
                        this.auditInputTags = [];
                        result.searchAudits[0].auditTagsModels.forEach(x => {
                            this.auditInputTags.push(x);
                        });
                        if (this.selectedAudit.timeStamp != result.searchAudits[0].timeStamp) {
                            this.selectedAudit = result.searchAudits[0];
                        }
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionByIdTriggered),
                tap((result: any) => {
                    if (result && result.question) {
                        if (result.question.disableAddAndSave) {
                            this.disableAddAndSave = true;
                            this.cdRef.detectChanges();
                        } else {
                            this.disableAddAndSave = false;
                            this.cdRef.detectChanges();
                        }
                    }
                })
            ).subscribe();


        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionListTriggered),
            tap(() => {
                if (localStorage.getItem('selectedCategoryFilter') != null) {
                    let categoryData = JSON.parse(localStorage.getItem('selectedCategoryFilter'));
                    this.categorySelected = categoryData;
                    // let sectionDetailedData = this.checkSubData(this.hierarchicalCategoriesData, this.categorySelected.auditCategoryId);
                    let passingData = {
                        auditCategoryId: categoryData.auditCategoryId,
                        auditCategoryName: categoryData.auditCategoryName,
                        auditCategoryDescription: categoryData.auditCategoryDescription,
                        subAuditCategories: null,
                        isHierarchical: categoryData.isHierarchical
                    }
                    this.categoryTemporaryData = passingData;
                    this.cdRef.detectChanges();
                } else {
                    this.categoryTemporaryData = null;
                    this.cdRef.markForCheck();
                }
                // if (!this.selectedQuestionFromPreview) {
                //     this.upsertQuestion = false;
                //     this.previewQuestion = false;
                //     this.questionData = null;
                //     this.selectedQuestionFromPreview = null;
                //     this.cdRef.markForCheck();
                // }
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions) {
                        if (this.disableAddAndSave) {
                            let resultData = result.searchQuestions[0];
                            let data = {
                                questionData: null,
                                upsertQuestion: true,
                                previewQuestion: false,
                                auditCategoryId: resultData.auditCategoryId
                            };
                            this.getQuestionPreview(data);
                        } else {
                            this.upsertQuestion = false;
                            this.previewQuestion = true;
                            this.selectedQuestionFromPreview = result.searchQuestions[0];
                            this.questionData = result.searchQuestions[0];
                            this.cdRef.detectChanges();
                        }
                    }
                })
            ).subscribe();


        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionDeleteCompleted),
                tap((result: any) => {
                    if (result && result.questionId && (this.upsertQuestion || this.previewQuestion) && this.questionData && this.questionData.questionId == result.questionId) {
                        this.closeUpsertDialog();
                    }
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadMoveQuestionsTriggered),
            tap(() => {
                this.closeUpsertDialog();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditTagCompleted),
                tap((result: any) => {
                    if (result) {
                        this.closeTagsDialog();
                        let searchAudit = new AuditCompliance();
                        searchAudit.auditId = this.auditId;
                        // searchAudit.projectId = this.projectId;
                        //searchAudit.isArchived = false;
                        searchAudit.canRefreshAudit = true;
                        this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditCloneCompleted),
                tap((result: any) => {
                    if (result) {
                        if (this.cloneAuditPopover) {
                            this.disableAuditClone = false;
                            this.cloneAuditPopover.close();
                            if (this.editAuditsMenuPopover._open)
                                this.editAuditsMenuPopover.close();
                            this.cdRef.detectChanges();
                        }
                    }
                })
            ).subscribe();

    }

    ngOnInit() {
        super.ngOnInit();
        this.loadAuditDetails();
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    }


    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getEntityRoleFeaturesByUserId(isUnique: boolean = false, uniqueId: string = null) {
        this.auditService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
            if (features.success) {
                let entityRoles = features.data;
                localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
                this.canAccess_AddOrUpdateAudit = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAudit.toString().toLowerCase(); }) != null;
                this.canAccess_CanAddAuditLevelCustomFields = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAuditLevelCustomFields.toString().toLowerCase(); }) != null;
                this.canAccess_entityType_feature_CanAddAndViewAuditLevelComments = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewAuditLevelComments.toString().toLowerCase(); }) != null;
                this.canAccess_ArchiveOrUnarchiveAudit = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAudit.toString().toLowerCase(); }) != null;
                this.canAccess_CanCloneAudit = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanCloneAudit.toString().toLowerCase(); }) != null;
                this.canAccess_CanAssignAuditTags = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAssignAuditTags.toString().toLowerCase(); }) != null;
                this.canAccess_CanCreateAuditVersion = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanCreateAuditVersion.toString().toLowerCase(); }) != null;
                this.canAccess_CanViewAuditVersions = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanViewAuditVersions.toString().toLowerCase(); }) != null;
                this.cdRef.markForCheck();
            }
        })
    }

    enableEditor() {
        this.isEditorVisible = true;
    }

    loadAuditDetails() {
        let auditModel = new AuditCompliance();
        auditModel.auditId = this.auditId;
        auditModel.projectId = this.projectId;
        //auditModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadAuditListTriggered(auditModel));
        this.store.pipe(select(auditModuleReducer.getAuditAll)).subscribe((result) => {
            console.log(result)
        });
    }

    descriptionReset() {
        this.description = this.selectedAudit.auditDescription;
    }

    cancelDescription() {
        this.description = this.selectedAudit.auditDescription;
        this.isEditorVisible = false;
    }

    handleDescriptionEvent(event) {
        let auditModel = new AuditCompliance();
        auditModel = Object.assign({}, this.selectedAudit);
        auditModel.auditDescription = this.description;
        auditModel.projectId = this.projectId;
        this.store.dispatch(new LoadAuditTriggered(auditModel));
    }

    getLoadAuditRelatedData(data) {
        this.loadAuditRelatedData = data;
        this.cdRef.detectChanges();
    }

    getSelectedAuditCategoryData(data) {
        this.categorySelected = data;
        this.categoryData = null;
        this.categoryTemporaryData = null;
        this.categoryData = data;
        this.cdRef.detectChanges();
    }

    getLoadAuditCategoryRelatedData(data) {
        this.loadAuditCategoryRelatedData = data;
        this.cdRef.detectChanges();
    }

    getHierarchicalQuestions(data) {
        this.isHierarchical = data;
        this.cdRef.detectChanges();
    }

    getQuestionPreview(data) {
        if (data && data.upsertQuestion) {
            if (this.questionData == null || this.questionData == undefined || data.questionData == null || (data.questionData && data.questionData.questionId != this.questionData.questionId)
                || (data.questionData && data.questionData.questionId == this.questionData.questionId && this.previewQuestion)) {
                this.closeUpsertDialog();
                this.upsertQuestion = true;
                this.previewQuestion = false;
                this.selectedQuestionFromPreview = data.questionData;
                this.questionData = data.questionData;
                this.auditCategoryId = data.auditCategoryId != null ? data.auditCategoryId : null;
                this.isEditQuestion = data.questionData != null ? true : false;
                this.isAuditCategories = true;
                this.cdRef.detectChanges();
            }
        }
        else if (data && data.previewQuestion) {
            if (this.questionData == null || this.questionData == undefined || data.questionData.questionId != this.questionData.questionId
                || (data.questionData.questionId == this.questionData.questionId && this.upsertQuestion)) {
                this.loadQuestionHistory(data.questionData);
                this.closeUpsertDialog();
                this.upsertQuestion = false;
                this.previewQuestion = true;
                // let queData = new QuestionModel();
                // queData = Object.assign({}, data.questionData);
                // queData.isForViewHistory = true;
                this.questionData = data.questionData;
                this.selectedQuestionFromPreview = data.questionData;
                this.cdRef.detectChanges();
            }
        }
    }

    closeUpsertDialog() {
        this.upsertQuestion = false;
        this.isEditQuestion = false;
        this.questionData = null;
        this.previewQuestion = false;
        this.isAudit = false;
        this.isAuditCategories = false;
        this.previewQuestionData = null;
        this.categorySelected = null;
        // this.categoryData = null;
        this.selectedQuestionFromPreview = null;
        this.cdRef.detectChanges();
    }

    loadQuestionHistory(data) {
        let model = new QuestionModel();
        model.questionId = data.questionId;
        model.isForViewHistory = true;
        this.store.dispatch(new LoadQuestionViewTriggered(model));
    }


    makeEditFalse() {
        this.isEditAudit = false;
    }

    detailsOpen() {
        this.isEditAudit = true;
    }

    deleteSelectedAudit(value) {
        if (this.selectedAudit.conductsCount > 0) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForAuditError));
        } else {
            this.disableAuditDelete = true;
            this.loadingAudit = true;
            let audit = new AuditCompliance();
            audit = Object.assign({}, this.selectedAudit);
            audit.schedulingDetails = Object.assign({}, this.selectedAudit.schedulingDetails);
            audit.isArchived = value;
            if (audit.isArchived == false) {
                audit.auditUnarchive = true;
            } else {
                audit.auditUnarchive = false;
            }
            audit.projectId = this.projectId;
            this.store.dispatch(new LoadAuditTriggered(audit));
            // this.deletedCategoryId.emit(this.selectedAudit.auditId);
            this.checkTooltipStatus();
        }
    }

    auditClone() {
        this.disableAuditClone = true;
        let audit = new AuditCompliance();
        audit = Object.assign({}, this.selectedAudit);
        audit.projectId = this.projectId;
        this.store.dispatch(new LoadAuditCloneTriggered(audit));
    }

    checkTooltipStatus() {
        if (this.auditTitleStatus.nativeElement.scrollWidth > this.auditTitleStatus.nativeElement.clientWidth) {
            this.showTooltip = true;
        } else {
            this.showTooltip = false;
        }
    }

    openTagsPopUp() {
        // if (this.selectedAudit.auditTagsModels && this.selectedAudit.auditTagsModels.length > 0) {
        //     this.selectedAudit.auditTagsModels.forEach(x => {
        //         this.auditInputTags.push(x);
        //     });
        //     this.cdRef.markForCheck();
        // }
        this.auditTagPopover.open();
    }

    searchTags(tags) {
        let tagsModel = new AuditCompliance();
        tagsModel.searchText = (tags && tags.trim() != '') ? tags.trim() : null;
        let selIds = [];
        if (this.auditInputTags) {
            this.auditInputTags.forEach(x => {
                selIds.push(x.tagId);
            });
        }
        tagsModel.selectedIds = selIds.length > 0 ? selIds.toString() : null;
        this.store.dispatch(new LoadAuditTagListTriggered(tagsModel));
        this.customTagsModel$ = this.store.pipe(select(auditModuleReducer.getAuditTagList));
        this.customTagsModel$.subscribe(result => {
            this.customTagsModel = result;
            this.cdRef.markForCheck();
        });
    }

    selectedTagValue(event: any) {
        let value = event.option.value;
        let index = this.customTagsModel.findIndex(x => x.tagId == value);
        if (index != -1) {
            let data = this.customTagsModel[index];
            this.auditInputTags.push(data);
            this.tagInput.nativeElement.value = '';
            this.cdRef.markForCheck();
        }
    }

    saveAuditTags() {
        this.disableTag = true;
        let tagsModel = new AuditCompliance();
        tagsModel.auditId = this.selectedAudit.auditId;
        tagsModel.auditTagsModels = this.auditInputTags;
        tagsModel.projectId = this.projectId;
        this.store.dispatch(new LoadAuditTagTriggered(tagsModel));
    }

    checkDisableTag() {
        if (this.auditInputTags.length > 0)
            return false;
        else
            return true;
    }

    removeAuditTags(tag) {
        let index = this.auditInputTags.findIndex(x => x.tagId.toLowerCase() == tag.tagId.toLowerCase());
        if (index != -1) {
            this.auditInputTags.splice(index, 1);
            this.cdRef.markForCheck();
        }
    }

    closeTagsDialog() {
        this.disableTag = false;
        this.auditInputTags = [];
        this.customTagsModel = [];
        if (this.auditTagPopover) {
            this.auditTagPopover.close();
        }
        if (this.cloneAuditPopover) {
            this.cloneAuditPopover.close();
        }
        if (this.trigger) {
            this.trigger.closeMenu();
        }
        this.tag = null;
        this.cdRef.markForCheck();
    }

    closeAuditDialog() {
        this.loadAddAudit = false;
        this.addAuditPopover.close();
    }

    redirectPage() {
        // this.router.navigate(["audits/auditsview/0"]);
        this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/audits');
    }

    getDocumentsView(value) {
        this.loadDocuments = true;
        this.auditDocumentId = value;
        this.loadDocumentManagementModule();
    }

    normalView() {
        this.loadDocuments = false;
        this.documentsModuleLoaded = false;
        this.auditDocumentId = null;
        this.cdRef.detectChanges();
    }

    closeMenuPopover() {
        this.threeDotsPopOver.close();
    }

    openAuditVersionPopover() {
        this.initializeAuditVersionForm();
        this.versionAuditPopover.open();
        this.cdRef.markForCheck();
    }

    addAuditVersion() {
        this.disableAddVersion = true;
        let model = new AuditCompliance();
        model = this.auditVersionForm.value;
        model.auditId = this.selectedAudit.auditId;
        this.auditService.createAuditVersion(model).subscribe((response: any) => {
            if (response.success) {
                this.disableAddVersion = false;
                let searchAudit = new AuditCompliance();
                searchAudit.auditId = model.auditId;
                //searchAudit.isArchived = false;
                searchAudit.canRefreshAudit = true;
                this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
                this.closeAuditVersionPopover();
                this.snackbar.open(this.translateService.instant('TESTMANAGEMENT.MILESTONECREATEDSUCCESSFULLY'), this.translateService.instant(ConstantVariables.success), { duration: 2000 });
            }
            else {
                this.disableAddVersion = false;
                this.toastr.error(response.apiResponseMessages[0].message);
                this.cdRef.markForCheck();
            }
        });
    }

    initializeAuditVersionForm() {
        this.auditVersionForm = new FormGroup({
            auditVersionName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
            auditVersionNameDescription: new FormControl(null, [])
        });
    }

    closeAuditVersionPopover() {
        this.versionAuditPopover.close();
        // this.trigger.closeMenu();
        if (this.editAuditsMenuPopover._open)
            this.editAuditsMenuPopover.close();
        this.cdRef.detectChanges();
    }

    openAuditVersionHistoryPopover() {
        this.loadVersionHistory(this.selectedAudit.auditId);
        this.versionHistoryPopover.open();
        this.cdRef.markForCheck();
    }

    loadVersionHistory(auditId) {
        this.loadingAuditVersions = true;
        let versionModel = new AuditCompliance();
        versionModel.auditId = auditId;
        versionModel.projectId = this.projectId;
        this.auditService.getAuditRelatedVersions(versionModel).subscribe((response: any) => {
            if (response.success) {
                this.auditVersions = response.data;
                this.loadingAuditVersions = false;
                this.cdRef.markForCheck();
            }
            else {
                this.auditVersions = [];
                this.loadingAuditVersions = false;
                this.cdRef.markForCheck();
            }
        });
    }

    closeAuditVersionHistoryPopover() {
        this.versionHistoryPopover.close();
        // this.trigger.closeMenu();
        this.cdRef.markForCheck();
    }

    openAuditRelatedVersionPopover(auditId) {
        this.auditVersionId = auditId;
        this.loadPopover = true;
        let dialogId = "audit-version-unique-dialog";
        const dialogRef = this.dialog.open(this.auditVersionUniqueDetailDialog, {
            height: "90vh",
            width: "90%",
            direction: 'ltr',
            id: dialogId,
            data: { auditId: auditId, notFromAuditVersion: false, projectId: this.projectId, dialogId: dialogId },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => { });
        // this.openAuditsPagePopover.open();
    }

    openCustomFields() {
        this.auditRequiredData = Object.assign({}, this.selectedAudit);
        this.cdRef.markForCheck();
        this.customFieldsPopover.open();
    }


    openAddComment() {
        this.auditRequiredData = Object.assign({}, this.selectedAudit);
        this.cdRef.markForCheck();
        this.addCommentPopover.open();
    }

    closeCustomFieldsPopover() {
        let popover = this.customFieldsPopover;
        if (popover._open)
            popover.close();
        if (this.editAuditsMenuPopover._open)
            this.editAuditsMenuPopover.close();
        this.auditRequiredData = null;
        this.cdRef.markForCheck();
    }


    closeAddCommentPopover() {
        let popover = this.addCommentPopover;
        if (popover._open)
            popover.close();
        if (this.editAuditsMenuPopover._open)
            this.editAuditsMenuPopover.close();
        this.auditRequiredData = null;
        this.cdRef.markForCheck();
    }

    loadDocumentManagementModule() {
        let fileElement = new FilesElement();
        fileElement.folderReferenceId = this.auditDocumentId;
        fileElement.folderReferenceTypeId = ConstantVariables.AuditReferenceTypeId.toLowerCase();
        fileElement.isEnabled = true;
        this.fileElement = fileElement;

        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);

        // var modules = this.auditModulesService["modules"];

        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

        if (!module) {
            console.error("No module found for DocumentManagementPackageModule");
        }

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
        //         );
                this.documentStoreComponent = {};
                this.documentStoreComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(DocumentStoreComponent);
                this.documentStoreComponent.inputs = {
                    fileElement: this.fileElement,
                    isComponentRefresh: true,
                    isFromAudits: true
                };

                this.documentStoreComponent.outputs = {}
                this.documentsModuleLoaded = true;
                this.cdRef.detectChanges();
            // });
    }
}