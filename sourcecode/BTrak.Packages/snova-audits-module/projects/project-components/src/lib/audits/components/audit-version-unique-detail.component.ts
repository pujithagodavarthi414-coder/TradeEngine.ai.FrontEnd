import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, ElementRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, Output, EventEmitter, Input, ComponentFactoryResolver } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { AuditCompliance } from "../models/audit-compliance.model";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../store/reducers/index";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LoadAuditListTriggered, AuditActionTypes, LoadAuditTagTriggered, LoadAuditTagListTriggered, LoadAuditCloneTriggered, LoadAuditTriggered, LoadAuditVersionListTriggered } from "../store/actions/audits.actions";
import * as auditModuleReducer from "../store/reducers/index";
import { tap, takeUntil } from "rxjs/operators";
import { ComponentModel } from "@snovasys/snova-comments";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionViewTriggered, QuestionActionTypes } from "../store/actions/questions.actions";
import { MatMenuTrigger } from "@angular/material/menu";
import { SatPopover } from "@ncstate/sat-popover";
import { ToastrService } from "ngx-toastr";
// import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { RecurringCronExpressionModel } from '../dependencies/models/cron-expression-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

import * as $_ from 'jquery';
import { AuditModulesService } from '../services/audit.modules.service';
import { FilesElement } from '../models/file-element.model';
import * as _ from "underscore";
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditService } from '../services/audits.service';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";

const $ = $_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-version-audit-unique-detail",
    templateUrl: "audit-version-unique-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .version-unique-page-height {
                height: calc(100vh - 150px) !important;
                max-height: calc(100vh - 150px) !important;
                overflow-x: hidden  !important;
            }
        `
    ]
})
export class AuditVersionUniqueDetailComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("editGoalMenuPopover") editGoalMenuPopover: SatPopover;
    @ViewChild("editAuditMenuPopover") editAuditsMenuPopover: SatPopover;
    @ViewChild("cloneAudit") cloneAuditPopover: SatPopover;
    @ViewChild("auditTitle") auditTitleStatus: ElementRef;

    @Output() closePopover = new EventEmitter<any>();

    @Input("auditId")
    set _conductId(data: string) {
        if (data) {
            this.auditId = data;
            this.isPopover = true;
            this.cdRef.markForCheck();
        }
    }

    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.projectId = data;
        }
    }

    @Input("notFromAuditVersion")
    set _notFromAuditVersion(data: boolean) {
        if (data || data == false) {
            this.notFromAuditVersion = data;
            this.cdRef.markForCheck();
        }
        else {
            this.notFromAuditVersion = true;
        }
    }

    anyOperationInProgress$: Observable<boolean>;

    softLabels: SoftLabelConfigurationModel[];
    selectedAudit: any;
    auditId: string;
    projectId: string;
    isArchived = false;
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
    notFromAuditVersion: boolean = true;
    disableAuditDelete: boolean = false;
    disableAuditClone: boolean = false;
    isPopover: boolean = false;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    auditList$: Observable<AuditCompliance[]>;
    customTagsModel$: Observable<AuditCompliance[]>;
    customTagsModel: AuditCompliance[];

    public ngDestroyed$ = new Subject();

    loadDocuments: boolean = false;
    documentsModuleLoaded: boolean = false;
    canAccess_AddOrUpdateAudit: boolean = false;
    canAccess_CanCloneAudit: boolean = false;
    canAccess_ArchiveOrUnarchiveAudit: boolean = false;
    canAccess_CanAssignAuditTags: boolean = false;

    constructor(
        private store: Store<State>,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private actionUpdates$: Actions,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private auditService: AuditService,
        private cookieService: CookieService, private toastr: ToastrService
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>,
        private softLabelsPipe: SoftLabelPipe) {
        super();

        this.injector = this.vcr.injector;
        this.getSoftLabelConfigurations();
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditVersionsListLoading));

        this.getEntityRoleFeaturesByUserId();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditVersionListCompleted),
                tap((result: any) => {
                    if (result && result.searchAudits && result.searchAudits.length > 0) {
                        let data = result.searchAudits[0];
                        this.selectedAudit = result.searchAudits[0];
                        // this.projectId = data.projectId;
                        this.description = this.selectedAudit.auditDescription;
                        this.categoriesCount = this.selectedAudit.auditCategoriesCount;
                        this.questionsCount = this.selectedAudit.auditQuestionsCount;
                        this.auditTagsModels = this.selectedAudit.auditTagsModels;
                        this.auditInputTags = [];
                        this.selectedAudit.auditTagsModels.forEach(x => {
                            this.auditInputTags.push(x);
                        });
                        this.cdRef.markForCheck();
                    } else if (result.searchAudits && result.searchAudits.length == 0) {
                        this.selectedAudit = new AuditCompliance();
                        this.categoriesCount = 0;
                        this.questionsCount = 0;
                        // this.projectId = null;
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();


        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadVersionQuestionListTriggered),
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
                ofType(AuditActionTypes.LoadAuditCloneCompleted),
                tap((result: any) => {
                    if (result) {
                        if (this.cloneAuditPopover._open) {
                            this.disableAuditClone = false;
                            this.cloneAuditPopover.close();
                            if (this.editAuditsMenuPopover._open)
                                this.editAuditsMenuPopover.close();
                            this.closePopover.emit('');
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
                this.canAccess_ArchiveOrUnarchiveAudit = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_ArchiveOrUnarchiveAudit.toString().toLowerCase(); }) != null;
                this.canAccess_CanCloneAudit = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanCloneAudit.toString().toLowerCase(); }) != null;
                this.canAccess_CanAssignAuditTags = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAssignAuditTags.toString().toLowerCase(); }) != null;
                this.cdRef.markForCheck();
            }
        })
    }

    enableEditor() {
        this.isEditorVisible = true;
    }

    loadAuditDetails() {
        let auditModel = new AuditCompliance();
        // auditModel.auditId = this.auditId;
        auditModel.auditVersionId = this.auditId;
        auditModel.projectId = this.projectId;
        auditModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadAuditVersionListTriggered(auditModel));
        this.store.pipe(select(auditModuleReducer.getAuditVersionsList)).subscribe((result) => {
            console.log(result)
        });
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
        if (data && data.previewQuestion) {
            if (this.questionData == null || this.questionData == undefined || data.questionData.questionId != this.questionData.questionId
                || (data.questionData.questionId == this.questionData.questionId && this.upsertQuestion)) {
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

    getDocumentsView(value) {
        this.loadDocuments = true;
        this.auditDocumentId = value;
        // this.loadDocumentManagementModule();
    }

    normalView() {
        this.loadDocuments = false;
        this.documentsModuleLoaded = false;
        this.auditDocumentId = null;
        this.cdRef.detectChanges();
    }

    closeSatPopover(): void {
        this.closePopover.emit(true);
    }
}