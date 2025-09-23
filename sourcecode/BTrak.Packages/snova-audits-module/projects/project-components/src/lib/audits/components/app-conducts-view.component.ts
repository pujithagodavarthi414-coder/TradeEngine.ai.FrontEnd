import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, Output, EventEmitter, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, ViewChild, Input, ComponentFactoryResolver } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import * as auditModuleReducer from "../store/reducers/index";

import * as _ from "underscore";

import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
// import { softLabelsActionTypes } from "app/common/store/actions/soft-labels.actions";

// import { ConstantVariables } from 'app/common/constants/constant-variables';
import { AuditCompliance } from "../models/audit-compliance.model";
import { AuditConduct } from "../models/audit-conduct.model";

import { AuditActionTypes, LoadAuditListTriggered, LoadAuditRelatedCountsTriggered } from "../store/actions/audits.actions";
import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { AuditConductActionTypes } from "../store/actions/conducts.actions";
import { SatPopover } from "@ncstate/sat-popover";
import { QuestionType } from "../models/question-type.model";
import { AuditService } from "../services/audits.service";
import { ToastrService } from "ngx-toastr";
import { QuestionActionTypes, LoadQuestionViewTriggered, LoadConductQuestionViewTriggered } from "../store/actions/questions.actions";
import { QuestionModel } from "../models/question.model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

import * as $_ from 'jquery';
import { FilesElement } from '../models/file-element.model';
import { AuditModulesService } from '../services/audit.modules.service';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { DocumentStoreComponent } from "@snovasys/snova-document-management";

const $ = $_;

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-conducts-view",
    templateUrl: "./app-conducts-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditConductsViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren("addAuditConductsPopover") addAuditConductPopover;
    @ViewChild("addConduct") addConductPopover: SatPopover;
    @ViewChild("addAuditConduct") addAuditConductsPopover: SatPopover;
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
    activeAuditConductsCount$: Observable<number>;
    archivedAuditConductsCount$: Observable<number>;
    auditList$: Observable<AuditCompliance[]>;

    public ngDestroyed$ = new Subject();

    projectId: string;

    fileElement: FilesElement;

    dashboardFilters: any;
    selectedConduct: any;
    selectedConductData: any;
    categorySelected: any;
    selectedAudit: any;
    categoryData: any;
    categoryTemporaryData: any;
    categoryDataForAnswer: any;
    showQuestionStatusPreview: any;
    selectedQuestionFromPreview: any;
    applyHeight: any;
    injector: any;
    documentStoreComponent: any;
    auditDocumentId: any;
    conductDocumentId: any;

    questionTypeList = [];

    screenWidth: number;

    validationMessage: string;
    isHierarchical: boolean;
    loadAddAuditConduct: boolean = false;
    isAuditConduct: boolean = false;
    isConductCategories: boolean = false;
    loadConductRelatedData: boolean = false;
    isFromDashboard: boolean = false;
    loadDocuments: boolean = false;
    documentsModuleLoaded: boolean = false;
    loadConductCategoryRelatedData: any;

    constructor(private store: Store<State>, private toastr: ToastrService, private auditService: AuditService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>) {
        super();

        this.injector = this.vcr.injector;

        this.getSoftLabelConfigurations();

        if (!(this.routes.url.includes('projects'))) {
            this.isFromDashboard = true;
            this.cdRef.markForCheck();
        }
        
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
            if (this.projectId && this.routes.url.includes('projects'))
                this.getAuditRelatedCounts();
        });

        this.initializeConductForm();
        // this.getAuditRelatedCounts();
        this.getAuditList();
        this.loadQuestionTypes();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
                tap((result: any) => {
                    this.closePreviewDialog();
                    this.categoryDataForAnswer = null;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadSubmitConductCompleted),
                tap((result: any) => {
                    this.closePreviewDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionByIdCompleted),
                tap(() => {
                    // this.closePreviewDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryForAnswerByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                        let resultData = result.searchAuditCategories[0];
                        // this.categoryDataForAnswer = resultData;
                        // this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

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
                }
                else {
                    this.categoryTemporaryData = null;
                    this.cdRef.markForCheck();
                }
                this.showQuestionStatusPreview = null;
                this.selectedQuestionFromPreview = null;
                this.categoryDataForAnswer = null;
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
                        if (this.selectedConductData != 'empty' && this.selectedConductData && this.selectedConductData.conductId == conductData.conductId) {
                            this.selectedConductData = conductData;
                            this.cdRef.markForCheck();
                        }
                    }
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.screenWidth = window.innerWidth;
    }

    getAuditRelatedCounts() {
        this.store.dispatch(new LoadAuditRelatedCountsTriggered(this.projectId));
        this.activeAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditConductsCount));
        this.archivedAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditConductsCount));
    }

    getAuditList() {
        let auditModel = new AuditCompliance();
        auditModel.isArchived = false;
        auditModel.projectId = this.projectId;
        this.store.dispatch(new LoadAuditListTriggered(auditModel));
        this.auditList$ = this.store.pipe(select(auditModuleReducer.getAuditAll));
    }

    loadQuestionTypes() {
        let questionTypeModel = new QuestionType();
        questionTypeModel.isArchived = false;
        this.auditService.searchQuestionTypes(questionTypeModel).subscribe((result: any) => {
            if (result.success) {
                this.questionTypeList = result.data;
                this.auditService.assignQuestionTypeData(this.questionTypeList);
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getSelectedConductCategoryData(data) {
        this.categorySelected = data;
        this.categoryData = null;
        this.categoryTemporaryData = null;
        this.categoryData = data;
        this.cdRef.detectChanges();
    }

    getHierarchicalQuestions(data) {
        this.isHierarchical = data;
        this.cdRef.detectChanges();
    }

    openAuditConductDialog(addAuditConductPopover) {
        this.initializeConductForm();
        addAuditConductPopover.openPopover();
    }

    addConducts() {
        this.closeNewConductDialog();
        this.loadAddAuditConduct = true;
        this.addAuditConductsPopover.open();
        // (document.querySelector('.card-filter-runs') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
    }

    closeNewConductDialog() {
        this.addAuditConductPopover.forEach(p => p.closePopover());
    }

    closeAuditConductDialog() {
        this.loadAddAuditConduct = false;
        this.addAuditConductsPopover.close();
    }

    getSelectedConduct(data) {
        this.selectedConduct = data;
        this.selectedConductData = data;
        if (data == 'empty') {
            this.categorySelected = null;
            this.categoryData = null;
        }
        this.normalView();
        this.cdRef.markForCheck();
    }

    getLoadConductRelatedData(data) {
        this.loadConductRelatedData = data;
        this.cdRef.detectChanges();
    }

    getLoadConductCategoryRelatedData(data) {
        this.loadConductCategoryRelatedData = data;
        this.cdRef.detectChanges();
    }

    getQuestionStatusPreview(data) {
        if (this.showQuestionStatusPreview == undefined || this.showQuestionStatusPreview == null || data.questionData.questionId != this.showQuestionStatusPreview.questionId) {
            this.loadQuestionHistory(data.questionData);
            this.closePreviewDialog();
            this.selectedQuestionFromPreview = data.questionData;
            this.showQuestionStatusPreview = data.questionData;
            if (this.screenWidth > 1279)
                this.isAuditConduct = true;
            this.cdRef.detectChanges();
        } else if(data.hasOwnProperty('load') && data.load) {
            this.selectedQuestionFromPreview = data.questionData;
            this.showQuestionStatusPreview = data.questionData;   
            this.cdRef.detectChanges();   
        }
    }

    loadQuestionHistory(data) {
        let model = new QuestionModel();
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

    checkStatusDisabled() {
        if (this.selectedAudit.value)
            return false;
        else
            return true;
    }

    initializeConductForm() {
        this.selectedAudit = new FormControl('', [Validators.required]);
    }

    onResize() {
        this.screenWidth = window.innerWidth;
    }

    fitContent(optionalParameters: any) {
        if (optionalParameters['gridsterView']) {
            // $(optionalParameters['gridsterViewSelector'] + ' #contact-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
            var height = $(optionalParameters['gridsterViewSelector']).height();
            var counter = 0;
            this.applyHeight = setInterval(function () {
                // if (counter > 10) {
                //     clearInterval(applyHeight);
                // }
                counter++;
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conducts-height').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conducts-height').css('height', (height - 105) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-category-list').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-category-list').css('height', (height - 108) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-question-list').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-question-list').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-status-preview').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-status-preview').css('height', (height - 60) + 'px');
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').length > 0) {
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-testsuite-history-scroll').css("cssText", `max-height: ${height - 180}px !important;`);
                    // clearInterval(applyHeight);
                }
                if ($('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-question-actions-height').length > 0) {
                    // $(optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-question-actions-height').css('height', (height - 165) + 'px');
                    $('gridster-item' + optionalParameters['gridsterViewSelector'] + ' .fit-content-conduct-question-actions-height').css("cssText", `height: ${height - 165}px !important;`);
                    // clearInterval(applyHeight);
                }
            }, 2000);
        }
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

        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

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
                if (this.auditDocumentId) {
                    this.documentStoreComponent.inputs = {
                        fileElement: this.fileElement,
                        isComponentRefresh: true,
                        isFromAudits: true
                    };
                }
                else if (this.conductDocumentId) {
                    this.documentStoreComponent.inputs = {
                        fileElement: this.fileElement,
                        isComponentRefresh: true,
                        isFromConducts: true
                    };
                }
                this.documentStoreComponent.outputs = {}
                this.documentsModuleLoaded = true;
                this.cdRef.detectChanges();
            // });
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