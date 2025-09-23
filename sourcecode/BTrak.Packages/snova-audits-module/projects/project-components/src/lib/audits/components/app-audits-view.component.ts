import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, Output, EventEmitter, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, ViewChild, Input, ComponentFactoryResolver, Compiler } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";

import * as auditModuleReducer from "../store/reducers/index";

import * as _ from "underscore";

// import { softLabelsActionTypes } from "app/common/store/actions/soft-labels.actions";

// import { ConstantVariables } from 'app/common/constants/constant-variables';
import { AuditCompliance } from "../models/audit-compliance.model";

import { AuditActionTypes, LoadAuditRelatedCountsTriggered } from "../store/actions/audits.actions";
import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { QuestionActionTypes, LoadQuestionHistoryTriggered, LoadQuestionViewTriggered } from "../store/actions/questions.actions";
import { QuestionModel } from "../models/question.model";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
// import { SoftLabelPipe } from "../../dependencies/pipes/softlabels.pipes";

import * as $_ from 'jquery';
import { AuditModulesService } from '../services/audit.modules.service';
import { FilesElement } from '../models/file-element.model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SatPopover } from '@ncstate/sat-popover';
import { AuditService } from '../services/audits.service';
import { ToastrService } from 'ngx-toastr';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";

const $ = $_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-audits-view",
    templateUrl: "./app-audits-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditsViewComponent extends AppFeatureBaseComponent implements OnInit {
    // @ViewChildren("addAuditPopover") addComplianceAuditPopover;
    @ViewChildren("addAuditsPopover") addAuditPopover;
    @ViewChildren("addEditAuditPopover") addOrEditAuditPopover;
    @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
    @Output() closePopUp = new EventEmitter<any>();

    @Input("dashboardFilters")
    set _dashboardFilters(data: any) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    auditList$: Observable<AuditCompliance[]>;
    activeAuditsCount$: Observable<number>;
    archivedAuditsCount$: Observable<number>;
    activeAuditFoldersCount$: Observable<number>;
    archivedAuditFoldersCount$: Observable<number>;

    public ngDestroyed$ = new Subject();

    projectId: string;

    fileElement: FilesElement;

    auditFolderForm: FormGroup;

    dashboardFilters: any;
    selectedAudit: any;
    categorySelected: any;
    questionData: any;
    previewQuestionData: any;
    categoryTemporaryData: any;
    selectedQuestionFromPreview: any;
    hierarchicalCategoriesData: any;
    auditCategoryId: any;
    categoryData: any;
    applyHeight: any;
    injector: any;
    documentStoreComponent: any;
    auditDocumentId: any;

    screenWidth: number;

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
    isFromDashboard: boolean = false;
    loadDocuments: boolean = false;
    documentsModuleLoaded: boolean = false;
    disableAddEditFolder: boolean = false;
    isHierarchical: boolean;
    auditsCount: boolean = true;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private compiler : Compiler,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>, private auditService: AuditService, private toastr: ToastrService) {
        super();

        this.injector = this.vcr.injector;

        this.initializeAuditFolderForm();

        this.getSoftLabelConfigurations();

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
            if (this.projectId && this.routes.url.includes('projects'))
                this.getAuditRelatedCounts(this.projectId);
        });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditListTriggered),
                tap((result: any) => {
                    this.auditArchiveFilter = result.audit.isArchived;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
                tap((result: any) => {
                    this.closeUpsertDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories) {
                        this.hierarchicalCategoriesData = result.searchAuditCategories;
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditListCompleted),
                tap((result: any) => {
                    if (this.auditArchiveFilter) {
                        this.auditsCount = true;
                        this.cdRef.markForCheck();
                    } else if (result.searchAudits.length == 0) {
                        this.auditsCount = false;
                        this.cdRef.markForCheck();
                    } else {
                        this.auditsCount = true;
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.RefreshAuditsList),
                tap((result: any) => {
                    this.auditsCount = true;
                    this.cdRef.markForCheck();
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
                if (this.selectedQuestionFromPreview) {
                    this.upsertQuestion = false;
                    this.previewQuestion = false;
                    this.questionData = null;
                    this.selectedQuestionFromPreview = null;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

       
    }

    ngOnInit() {
        super.ngOnInit();
        this.screenWidth = window.innerWidth;
    }

    getAuditRelatedCounts(projectId) {
        this.store.dispatch(new LoadAuditRelatedCountsTriggered(projectId));
        this.activeAuditsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditsCount));
        this.archivedAuditsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditsCount));
        this.activeAuditFoldersCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditFoldersCount));
        this.archivedAuditFoldersCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditFoldersCount));
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getSelectedAuditCategoryData(data) {
        this.categorySelected = data;
        this.categoryData = null;
        this.categoryTemporaryData = null;
        this.categoryData = data;
        this.cdRef.detectChanges();
    }

    openAuditDialog(addAuditPopover) {
        this.loadAddAudit = true;
        addAuditPopover.openPopover();
    }

    openComplianceAuditDialog(addTestSuitePopover) {
        this.loadAddAudit = true;
        addTestSuitePopover.openPopover();
    }

    closeAuditDialog() {
        this.loadAddAudit = false;
        // this.addComplianceAuditPopover.forEach(p => p.closePopover());
        this.addAuditPopover.forEach(p => p.closePopover());
    }

    getSelectedAudit(data) {
        this.selectedAudit = data;
        if (data == 'empty') {
            this.categoryTemporaryData = null;
            this.categoryData = null;
            this.categoryData = null;
        }
        this.normalView();
        this.cdRef.markForCheck();
    }

    getLoadAuditRelatedData(data) {
        this.loadAuditRelatedData = data;
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
                if (this.screenWidth > 1279)
                    this.isAudit = true;
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
                if (this.screenWidth > 1279)
                    this.isAudit = true;
                this.cdRef.detectChanges();
            }
        }
    }

    loadQuestionHistory(data) {
        let model = new QuestionModel();
        model.questionId = data.questionId;
        model.isForViewHistory = true;
        this.store.dispatch(new LoadQuestionViewTriggered(model));
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

    onResize() {
        this.screenWidth = window.innerWidth;
    }

    checkSubData(categoryList, auditCategoryId) {
        for (let i = 0; i < categoryList.length; i++) {
            if (categoryList[i].auditCategoryId == auditCategoryId) {
                return categoryList[i];
            }
            else if (categoryList[i].subAuditCategories && categoryList[i].subAuditCategories.length > 0) {
                let checkSubAuditCategories = this.recursivecheckSubData(categoryList[i].subAuditCategories, auditCategoryId);
                if (checkSubAuditCategories != undefined && checkSubAuditCategories != undefined)
                    return checkSubAuditCategories;
            }
        }
    }

    recursivecheckSubData(childList, auditCategoryId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].auditCategoryId == auditCategoryId) {
                return childList[i];
            }
            else if (childList[i].subAuditCategories && childList[i].subAuditCategories.length > 0) {
                let checkSubAuditCategories = this.recursivecheckSubData(childList[i].subAuditCategories, auditCategoryId);
                if (checkSubAuditCategories != undefined && checkSubAuditCategories != undefined)
                    return checkSubAuditCategories;
            }
        }
    }

    getDocumentsView(value) {
        this.loadDocuments = true;
        this.auditDocumentId = value;
        this.loadDocumentManagementModule();
    }

    fitContent(optionalParameters: any) {
        if (optionalParameters['gridsterView']) {
            // $(optionalParameters['gridsterViewSelector'] + ' #contact-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
            var height = $(optionalParameters['gridsterViewSelector']).height();
            var counter = 0;
            if (this.applyHeight) {
                clearInterval(this.applyHeight);
            }
            this.applyHeight = setInterval(function () {
                // if (counter > 10) {
                //     clearInterval(applyHeight);
                // }
                counter++;
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audits-height').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audits-height').css('height', (height - 105) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-category-list').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-category-list').css('height', (height - 108) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-question-list').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-question-list').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-status-preview').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-audit-status-preview').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-details-preview-scroll').length > 0) {
                    // $(optionalParameters['gridsterViewSelector'] + ' .fit-content-case-details-preview-scroll').css('max-height', (height - 148) + 'px');
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-details-preview-scroll').css("cssText", `max-height: ${height - 148}px !important;`);
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').length > 0) {
                    // $(optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').css('max-height', (height - 180) + 'px');
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').css("cssText", `max-height: ${height - 180}px !important;`);
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-edit-preview').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-edit-preview').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-edit-preview-scroll').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-case-edit-preview-scroll').css('height', (height - 118) + 'px');
                    // clearInterval(applyHeight);
                }
            }, 2000);
        }
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

        var loader = this.auditModulesService["modules"];

        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

        var component = "Document Store";
        if (!module) {
            console.error("No module found for DocumentManagementPackageModule");
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
            .then(moduleFactory => {
                try {
                    const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    var allComponentsInModule = (<any>componentService).components;

                    this.ngModuleRef = moduleFactory.create(this.injector);

                    var componentDetails = allComponentsInModule.find(elementInArray =>
                        elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
                    );
                    this.documentStoreComponent = {};
                    this.documentStoreComponent.compoenent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.documentStoreComponent.inputs = {
                        fileElement: this.fileElement,
                        isComponentRefresh: true,
                        isFromAudits: true
                    };
    
                    this.documentStoreComponent.outputs = {}
                    this.documentsModuleLoaded = true;
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
                // );
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

    openAddEditFolder(addEditAuditPopover) {
        this.initializeAuditFolderForm();
        addEditAuditPopover.openPopover();
        this.cdRef.markForCheck();
    }

    addOrEditAuditFolder() {
        this.disableAddEditFolder = true;
        let auditFolderModel = new AuditCompliance();
        auditFolderModel = this.auditFolderForm.value;
        auditFolderModel.projectId = this.projectId;
        this.auditService.upsertAuditFolder(auditFolderModel).subscribe((response: any) => {
            if (response.success) {
                this.getAuditRelatedCounts(this.projectId);
            }
            else {
                this.disableAddEditFolder = false;
                this.toastr.error(response.apiResponseMessages[0].message);
                this.cdRef.markForCheck();
            }
        });
    }

    initializeAuditFolderForm() {
        this.auditFolderForm = new FormGroup({
            auditId: new FormControl(null, []),
            auditName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
            parentAuditId: new FormControl(null, []),
            timeStamp: new FormControl(null, [])
        });
    }

    closeAddEditFolder() {
        this.disableAddEditFolder = false;
        this.addOrEditAuditPopover.forEach(p => p.closePopover());
        this.initializeAuditFolderForm();
        this.cdRef.markForCheck();
    }

    navigateToProjects() {
        this.closePopUp.emit(true);
        this.routes.navigateByUrl('/projects');
    }

    public ngOnDestroy() {
        if (this.applyHeight) {
            clearInterval(this.applyHeight);
        }
        this.ngDestroyed$.next();
    }
}