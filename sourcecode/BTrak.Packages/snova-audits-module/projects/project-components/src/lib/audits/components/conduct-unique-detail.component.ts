import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, Inject, OnChanges, EventEmitter, Output, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, ViewChild, ElementRef, ComponentFactoryResolver } from "@angular/core";
// import { AppFeatureBaseComponent } from "app/shared/components/featurecomponentbase";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { Subject, Observable } from "rxjs";
import { AuditCompliance } from "../models/audit-compliance.model";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { State } from "../store/reducers/index";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import * as auditModuleReducer from "../store/reducers/index";
import { tap, takeUntil } from "rxjs/operators";
// import { environment } from "environments/environment";
import { ComponentModel } from "@snovasys/snova-comments";
import { LoadAuditConductListTriggered, AuditConductActionTypes, LoadAuditConductByIdTriggered } from "../store/actions/conducts.actions";
import { AuditConduct } from "../models/audit-conduct.model";
import { QuestionActionTypes, LoadConductQuestionViewTriggered } from "../store/actions/questions.actions";
import { QuestionModel } from "../models/question.model";
// import { AppFeatureBaseComponent } from '../dependencies/components/featurecomponentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

import * as _ from "underscore";

import * as $_ from 'jquery';
import { AuditModulesService } from '../services/audit.modules.service';
import { FilesElement } from '../models/file-element.model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SatPopover } from '@ncstate/sat-popover';
import { AuditService } from '../services/audits.service';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { LoadConductTagListTriggered, LoadConductTagTriggered } from '../store/actions/audits.actions';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";

const $ = $_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-conduct-unique-detail",
    templateUrl: "conduct-unique-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductUniqueDetailComponent implements OnInit, OnChanges {
    @Input("referenceId")
    set _referenceId(data: string) {
        this.conductId = data;
    }

    @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
    @ViewChild("editAuditMenuPopover") editAuditsMenuPopover: SatPopover;
    @ViewChild("auditTagsPopover") auditTagPopover: SatPopover;
    @ViewChild("customFields") customFieldsPopover: SatPopover;
    @ViewChild("addComment") addCommentPopover: SatPopover;
    @ViewChild('tagInput') tagInput: ElementRef;

    tagsOperationInProgress$: Observable<boolean>;
    tagOperationInProgress$: Observable<boolean>;
    conductOperationInProgress$: Observable<boolean>;
    customTagsModel$: Observable<AuditCompliance[]>;

    softLabels: SoftLabelConfigurationModel[];
    selectedConduct: any;
    conductRequiredData: any;

    conductId: string;
    projectId: string;
    tag: string;
    isArchived = false;
    componentModel: ComponentModel = new ComponentModel();
    categorySelected: any;
    categoryTemporaryData: any;
    showQuestionStatusPreview: any;
    selectedQuestionFromPreview: any;
    selectedConductData: any;
    categoryData: any;
    description: any;
    injector: any;
    documentStoreComponent: any;
    auditDocumentId: any;
    conductDocumentId: any;

    conductInputTags = [];
    auditTagsModels = [];
    conductTagsModels = [];

    customTagsModel: AuditCompliance[];

    fileElement: FilesElement;

    isHierarchical: boolean;
    loadAddAuditConduct: boolean = false;
    isAuditConduct: boolean = false;
    isConductCategories: boolean = false;
    loadConductRelatedData: boolean = false;
    loadConductCategoryRelatedData: any;
    isEditorVisible = false;
    screenWidth: number;
    isPopover: boolean = false;
    compliancePercent: any;
    isRed: boolean = false;
    isAmber: boolean = false;
    isGreen: boolean = false;
    loadDocuments: boolean = false;
    documentsModuleLoaded: boolean = false;
    disableTag: boolean = false;
    haveCustomFields: boolean = false;
    removable: boolean = true;
    selectable: boolean = true;

    canAccess_CanAssignConductTags: boolean = false;
    canAccess_CanAnswerConductLevelCustomFields: boolean = false;
    canAccess_entityType_feature_CanAddAndViewConductLevelComments: boolean = false;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    conductList$: Observable<AuditConduct[]>;
    public ngDestroyed$ = new Subject();

    public initSettings = {
        plugins: "powerpaste,lists advlist",
        branding: false,
        powerpaste_allow_local_images: true,
        powerpaste_word_import: 'prompt',
        powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    @Input("conductId")
    set _conductId(data) {
        this.conductId = data;
        this.isPopover = true;
        this.cdRef.detectChanges();
    }

    @Output() closePopover = new EventEmitter<any>();

    constructor(
        private store: Store<State>,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private actionUpdates$: Actions,
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private cookieService: CookieService,
        private auditModulesService: AuditModulesService,
        private auditService: AuditService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>) {
        // super(sharedStore);

        this.injector = this.vcr.injector;

        this.route.params.subscribe((params) => {
            if (params && params["id"]) {
                this.isPopover = false;
                this.conductId = params["id"];
            }
        });
        this.getSoftLabelConfigurations();
        this.conductOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditConductLoading));
        this.tagsOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getConductTagListLoading));
        this.tagOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertConductTagLoading));

        this.getEntityRoleFeaturesByUserId();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsForConductsTriggered),
            tap(() => {
                if (localStorage.getItem('selectedCategoryFilter') != null) {
                    let categoryData = JSON.parse(localStorage.getItem('selectedCategoryFilter'));
                    this.categorySelected = categoryData;
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
                this.showQuestionStatusPreview = null;
                this.selectedQuestionFromPreview = null;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditConducts.length > 0) {
                        let conductData = result.searchAuditConducts[0];
                        if (this.selectedConductData && this.selectedConductData.conductId == conductData.conductId) {
                            this.selectedConductData = conductData;
                            this.auditTagsModels = this.selectedConductData.auditTagsModels;
                            this.conductTagsModels = this.selectedConductData.conductTagsModels;
                            this.haveCustomFields = this.selectedConductData.haveCustomFields;
                            this.cdRef.markForCheck();
                        }
                        this.closeTagsDialog();
                        if (this.selectedConduct.conductId == conductData.conductId) {
                            this.selectedConduct = conductData;
                            this.selectedConduct.isFromUnique = true;
                            this.updatePercentageTags();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductListCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditConducts && result.searchAuditConducts.length > 0) {
                        let data = result.searchAuditConducts[0];
                        this.selectedConduct = result.searchAuditConducts[0];
                        this.projectId = data.projectId;
                        this.selectedConductData = result.searchAuditConducts[0];
                        this.description = this.selectedConduct.auditConductDescription;
                        this.auditTagsModels = this.selectedConduct.auditTagsModels;
                        this.conductTagsModels = this.selectedConduct.conductTagsModels;
                        this.haveCustomFields = this.selectedConduct.haveCustomFields;
                        this.loadConductRelatedData = true;
                        this.updatePercentageTags();
                    } else if (result.searchAuditConducts && result.searchAuditConducts.length == 0) {
                        this.selectedConduct = new AuditConduct();
                        this.loadConductRelatedData = false;
                        this.projectId = null;
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionViewCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions && result.searchQuestions.length > 0) {
                        this.closePreviewDialog();
                        this.selectedQuestionFromPreview = result.searchQuestions[0];
                        this.showQuestionStatusPreview = result.searchQuestions[0];
                        this.isAuditConduct = true;
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionCompleted),
                tap((result: any) => {
                    this.closePreviewDialog();
                })
            ).subscribe();
    }

    ngOnInit() {
        // super.ngOnInit();
        //this.getSoftLabelConfigurations();
        this.loadConductDetails();
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
    }

    ngOnChanges() {
        this.loadConductDetails();
    }

    openAddComment() {
        this.conductRequiredData = Object.assign({}, this.selectedConduct);
        this.cdRef.markForCheck();
        this.addCommentPopover.open();
      }



    getEntityRoleFeaturesByUserId(isUnique: boolean = false, uniqueId: string = null) {
        this.auditService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
            if (features.success) {
                let entityRoles = features.data;
                localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
                this.canAccess_CanAssignConductTags = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAssignConductTags.toString().toLowerCase(); }) != null;
                this.canAccess_CanAnswerConductLevelCustomFields = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAnswerConductLevelCustomFields.toString().toLowerCase(); }) != null;
                this.canAccess_entityType_feature_CanAddAndViewConductLevelComments = _.find(entityRoles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAndViewConductQuestionLevelComments.toString().toLowerCase(); }) != null;
                this.cdRef.markForCheck();
            }
        })
    }

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadConductDetails() {
        let auditConductModel = new AuditConduct();
        auditConductModel.conductId = this.conductId;
        auditConductModel.projectId = this.projectId;
        //auditConductModel.isArchived = this.isArchived;
        this.store.dispatch(new LoadAuditConductListTriggered(auditConductModel));
    }

    getSelectedConductCategoryData(data) {
        this.categorySelected = data;
        this.categoryData = null;
        this.categoryTemporaryData = null;
        this.categoryData = data;
        this.cdRef.detectChanges();
    }

    getLoadConductCategoryRelatedData(data) {
        this.loadConductCategoryRelatedData = data;
        this.cdRef.detectChanges();
    }

    getHierarchicalQuestions(data) {
        this.isHierarchical = data;
        this.cdRef.detectChanges();
    }

    enableEditor() {
        this.isEditorVisible = true;
    }

    descriptionReset() {
        this.description = this.selectedConduct.auditConductDescription;
    }
    cancelDescription() {
        this.description = this.selectedConduct.auditConductDescription;
        this.isEditorVisible = false;
    }

    getQuestionStatusPreview(data) {
        this.loadRelatedConduct();
        if (this.showQuestionStatusPreview == undefined || this.showQuestionStatusPreview == null || data.questionData.questionId != this.showQuestionStatusPreview.questionId) {
            this.loadQuestionHistory(data.questionData);
            // this.closePreviewDialog();
            // this.selectedQuestionFromPreview = data.questionData;
            // this.showQuestionStatusPreview = data.questionData;
            // if (this.screenWidth > 1279) {
            //     this.isAuditConduct = true;
            // }
            // this.cdRef.detectChanges();
        }
    }

    loadRelatedConduct() {
        let searchAudit = new AuditConduct();
        searchAudit.conductId = this.selectedConduct.conductId;
        //searchAudit.isArchived = false;
        searchAudit.canRefreshConduct = true;
        this.store.dispatch(new LoadAuditConductByIdTriggered(searchAudit));
    }

    loadQuestionHistory(data) {
        const model = new QuestionModel();
        model.questionId = data.questionId;
        model.conductId = data.conductId;
        model.isForViewHistory = true;
        this.store.dispatch(new LoadConductQuestionViewTriggered(model));
    }

    closePreviewDialog() {
        this.isAuditConduct = false;
        this.isConductCategories = false;
        this.showQuestionStatusPreview = null;
        this.selectedQuestionFromPreview = null;
        this.cdRef.detectChanges();
    }

    closeSatPopover(): void {
        this.closePopover.emit(true);
    }

    redirectPage() {
        // this.router.navigate(["audits/auditsview/1"]);
        this.router.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
    }

    updatePercentageTags() {
        let quesCount = this.selectedConduct.questionsCount;
        let answCount = this.selectedConduct.answeredCount;
        let unAnswCount = quesCount - answCount;
        let validCount = this.selectedConduct.validAnswersCount;
        let inValidCount = answCount - validCount;
        let percent = (validCount / answCount) * 100;
        this.compliancePercent = percent.toFixed(2);
        if (percent <= this.selectedConduct.inBoundPercent) {
            this.isRed = true;
            this.isAmber = false;
            this.isGreen = false;
            this.cdRef.markForCheck();
        } else if (percent > this.selectedConduct.inBoundPercent && percent < this.selectedConduct.outBoundPercent) {
            this.isRed = false;
            this.isAmber = true;
            this.isGreen = false;
            this.cdRef.markForCheck();
        } else if (percent >= this.selectedConduct.outBoundPercent) {
            this.isRed = false;
            this.isAmber = false;
            this.isGreen = true;
            this.cdRef.markForCheck();
        }
        this.cdRef.detectChanges();
    }

    getDocumentsView(value) {
        this.loadDocuments = true;
        if (value && value.audit) {
            this.auditDocumentId = value.id;
            this.conductDocumentId = null;
        }
        else if (value && !value.audit) {
            this.conductDocumentId = value.id;
            this.auditDocumentId = null;
        }
        this.loadDocumentManagementModule();
    }

    normalView() {
        this.loadDocuments = false;
        this.documentsModuleLoaded = false;
        this.auditDocumentId = null;
        this.conductDocumentId = null;
        this.cdRef.detectChanges();
    }

    closeMenuPopover() {
        this.threeDotsPopOver.close();
    }

    openTagsPopUp() {
        if (this.selectedConduct.conductTagsModels && this.selectedConduct.conductTagsModels.length > 0) {
            this.selectedConduct.conductTagsModels.forEach(x => {
                this.conductInputTags.push(x);
            });
            this.cdRef.markForCheck();
        }
        this.auditTagPopover.open();
    }

    searchTags(tags) {
        let tagsModel = new AuditCompliance();
        tagsModel.searchText = (tags && tags.trim() != '') ? tags.trim() : null;
        let selIds = [];
        if (this.conductInputTags) {
            this.conductInputTags.forEach(x => {
                selIds.push(x.tagId);
            });
        }
        tagsModel.selectedIds = selIds.length > 0 ? selIds.toString() : null;
        this.store.dispatch(new LoadConductTagListTriggered(tagsModel));
        this.customTagsModel$ = this.store.pipe(select(auditModuleReducer.getConductTagList));
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
            this.conductInputTags.push(data);
            this.tagInput.nativeElement.value = '';
            this.cdRef.markForCheck();
        }
    }

    saveAuditTags() {
        this.disableTag = true;
        let tagsModel = new AuditCompliance();
        tagsModel.auditId = this.selectedConduct.auditId;
        tagsModel.conductId = this.selectedConduct.conductId;
        tagsModel.auditTagsModels = this.conductInputTags;
        tagsModel.projectId = this.projectId;
        this.store.dispatch(new LoadConductTagTriggered(tagsModel));
    }

    checkDisableTag() {
        if (this.conductInputTags.length > 0)
            return false;
        else
            return true;
    }

    removeAuditTags(tag) {
        let index = this.conductInputTags.findIndex(x => x.tagId.toLowerCase() == tag.tagId.toLowerCase());
        if (index != -1) {
            this.conductInputTags.splice(index, 1);
            this.cdRef.markForCheck();
        }
    }

    closeTagsDialog() {
        this.disableTag = false;
        this.conductInputTags = [];
        this.customTagsModel = [];
        this.tagInput.nativeElement.value = '';
        if (this.auditTagPopover._open)
            this.auditTagPopover.close();
        if (this.editAuditsMenuPopover._open)
            this.editAuditsMenuPopover.close();
        this.tag = null;
        this.conductRequiredData = null;
        this.cdRef.detectChanges();
    }

    openCustomFields() {
        this.conductRequiredData = Object.assign({}, this.selectedConduct);
        this.cdRef.markForCheck();
        this.customFieldsPopover.open();
    }

    closeCustomFieldsPopover() {
        let popover = this.customFieldsPopover;
        if (popover._open)
            popover.close();
        this.conductRequiredData = null;
        this.cdRef.markForCheck();
    }

    closeAddCommentPopover() {
        let popover = this.addCommentPopover;
        if (popover._open)
          popover.close();
        if (this.editAuditsMenuPopover._open)
          this.editAuditsMenuPopover.close();
        this.conductRequiredData = null;
        this.cdRef.markForCheck();
      }

    loadDocumentManagementModule() {
        let fileElement = new FilesElement();
        if (this.auditDocumentId) {
            fileElement.folderReferenceId = this.auditDocumentId;
            fileElement.folderReferenceTypeId = ConstantVariables.AuditReferenceTypeId.toLowerCase();
        }
        else if (this.conductDocumentId) {
            fileElement.folderReferenceId = this.conductDocumentId;
            fileElement.folderReferenceTypeId = ConstantVariables.ConductReferenceTypeId.toLowerCase();
        }
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
        // //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
                // );
                this.documentStoreComponent = {};
                this.documentStoreComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(DocumentStoreComponent);
                this.documentStoreComponent.inputs = {
                    fileElement: this.fileElement,
                    isComponentRefresh: true,
                    isFromConductUnique: true
                };

                this.documentStoreComponent.outputs = {}
                this.documentsModuleLoaded = true;
                this.cdRef.detectChanges();
            // });
    }
}