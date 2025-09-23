import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { AuditActionTypes } from "../store/actions/audits.actions";
import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { AuditConductActionTypes, LoadSubmitConductTriggered } from "../store/actions/conducts.actions";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionsForConductsTriggered, QuestionActionTypes } from "../store/actions/questions.actions";
import { QuestionType } from "../models/question-type.model";
import { AuditService } from "../services/audits.service";
import { ToastrService } from "ngx-toastr";
import { SatPopover } from "@ncstate/sat-popover";
import { AuditConduct } from "../models/audit-conduct.model";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditReportActionTypes } from '../store/actions/audit-report.actions';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditRating } from '../models/audit-rating.model';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "conduct-questions-list-view",
    templateUrl: "./conduct-questions-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductQuestionsListViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("conductSubmit") conductSubmitPopover: SatPopover
    @Output() questionPreview = new EventEmitter<any>();
    @Output() documents = new EventEmitter<any>();

    @Input("loadConductRelatedData")
    set _loadConductRelatedData(data: boolean) {
        if (data || data == false) {
            this.loadConductRelatedData = data;
        }
        else {
            this.loadConductRelatedData = false;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        this.tagNames = null;
        if (data && data != 'empty') {
            this.selectedConduct = data;
            this.loadConductRelatedData = true;
            this.isConductLoaded = true;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isConductArchived = false;
            else
                this.isConductArchived = true;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.canConductSubmitted == null || this.selectedConduct.canConductSubmitted == false)
                this.canConductSubmitted = false;
            else
                this.canConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
            if (this.selectedConduct.areActionsAdded == null || this.selectedConduct.areActionsAdded == false)
                this.areActionsAdded = false;
            else
                this.areActionsAdded = true;
            if (this.selectedConduct.areDocumentsUploaded == null || this.selectedConduct.areDocumentsUploaded == false)
                this.areDocumentsUploaded = false;
            else
                this.areDocumentsUploaded = true;
            this.tagsvalue(data);
        }
        else if (data == 'empty') {
            this.isConductLoaded = false;
            this.loadConductRelatedData = false;
        }
    }

    @Input("loadConductCategoryRelatedData")
    set _loadConductCategoryRelatedData(data: any) {
        if (data || data == false) {
            // this.loadConductCategoryRelatedData = data;
        }
    }

    @Input("categorySelected")
    set _categorySelected(data: any) {
        if (data) {
            this.categorySelected = data;
            this.loadConductCategoryRelatedData = true;
            this.isConductCategoryLoaded = true;
            this.filterOpen = false;
            if (this.isHierarchical) {
                this.hierarchicalCategoryData = data;
            }
            this.loadQuestions();
        }
        else if (data === null) {
            this.filterOpen = false;
            this.categorySelected = null;
            this.loadConductCategoryRelatedData = false;
            this.isConductCategoryLoaded = false;
        }
        else {
            this.filterOpen = false;
            this.categorySelected = null;
            this.isConductCategoryLoaded = false;
        }
    }

    @Input("categoryTemporaryData")
    set _categoryTemporaryData(data: any) {
        if (data) {
            this.categorySelected = data;
            this.filterOpen = false;
            this.cdRef.markForCheck();
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false) {
            this.isHierarchical = data;
            this.filterOpen = false;
        }
    }

    @Input("selectedQuestion")
    set _selectedQuestion(data: any) {
        if (data) {
            this.questionFromPreview = data;
            this.cdRef.detectChanges();
            this.handleClick(data);
        }
        else {
            this.questionFromPreview = null;
            this.cdRef.detectChanges();
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    submitOperationInProgress$: Observable<boolean>;
    questions$: Observable<QuestionModel[]>;

    public ngDestroyed$ = new Subject();

    selectedConduct: any;
    categorySelected: any;
    questionFromPreview: any;
    multipleCategoryData: any;
    selectedQuestionId: any;
    validationMessage: any;
    hierarchicalCategoryData: any;

    auditRatingForm: FormGroup;

    masterQuestionTypeList = [];
    questionTypeList = [];
    tagNames: any;
    tagValue = [];
    auditRatings = [];
    categoryName: string;
    categoryDescription: string;
    questionsCount: number = 0;
    hierarchicalOccurence: number = 0;
    isConductArchived: boolean = false;
    isConductCompleted: boolean = false;
    isConductLoaded: any;
    isHierarchical: boolean = true;
    isAuditOrNot: boolean = false;
    questionsFilter: boolean = false;
    loadHierarchicalQuestions: boolean = false;
    filterOpen: boolean = false;
    isConductSubmitted: boolean = false;
    canConductSubmitted: boolean = false;
    areActionsAdded: boolean = false;
    areDocumentsUploaded: boolean = false;
    disableSubmit: boolean = false;
    isConductCategoryLoaded: boolean = false;
    loadConductRelatedData: boolean = false;
    isConductEditable: boolean = true;
    loadConductCategoryRelatedData: any = null;
    questionsForReport: any;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private auditService: AuditService, private toastr: ToastrService, private translateService: TranslateService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.getAuditRatings();
        this.loadQuestionTypes();
        this.loadMasterQuestionTypes();

        this.initializeRatingForm();

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsForConductsLoading));
        this.submitOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getSubmitConductLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductListTriggered),
                tap(() => {
                    this.loadConductRelatedData = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadSubmitConductCompleted),
                tap(() => {
                    this.closeConductSubmitDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditConducts.length > 0) {
                        let conductData = result.searchAuditConducts[0];
                        if (this.selectedConduct && this.selectedConduct.conductId == conductData.conductId && this.isConductLoaded && this.loadConductRelatedData) {
                            this.selectedConduct = conductData;
                            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                                this.isConductSubmitted = false;
                            else
                                this.isConductSubmitted = true;
                            if (this.selectedConduct.canConductSubmitted == null || this.selectedConduct.canConductSubmitted == false)
                                this.canConductSubmitted = false;
                            else
                                this.canConductSubmitted = true;
                            if (this.selectedConduct.areActionsAdded == null || this.selectedConduct.areActionsAdded == false)
                                this.areActionsAdded = false;
                            else
                                this.areActionsAdded = true;
                             if (this.selectedConduct.areDocumentsUploaded == null || this.selectedConduct.areDocumentsUploaded == false)
                                this.areDocumentsUploaded = false;
                            else
                                this.areDocumentsUploaded = true;
                            this.cdRef.markForCheck();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
                tap((result: any) => {
                    if (result && result.auditCategory) {
                        this.loadConductCategoryRelatedData = null;
                        this.isHierarchical = true;
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
                tap((result: any) => {
                    this.multipleCategoryData = result.searchAuditCategories;
                    this.cdRef.markForCheck();
                    if (result && result.searchAuditCategories.length == 0) {
                        this.loadConductCategoryRelatedData = false;
                        this.isHierarchical = true;
                        this.cdRef.detectChanges();
                    }
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsForConductsCompleted),
            tap((result) => {
                this.loadHierarchicalQuestions = false;
                this.questionFromPreview = null;
                this.selectedQuestionId = null;
                if (this.hierarchicalOccurence == 0) {
                    if (localStorage.getItem('selectedCategoryFilter') != null) {
                        this.hierarchicalOccurence = this.hierarchicalOccurence + 1;
                        let categoryData = JSON.parse(localStorage.getItem('selectedCategoryFilter'));
                        if (!categoryData.isHierarchical) {
                            this.categoryName = categoryData.auditCategoryName;
                            this.categoryDescription = categoryData.auditCategoryDescription;
                            this.cdRef.detectChanges();
                        }
                        localStorage.removeItem('selectedCategoryFilter');
                    }
                    else {
                        this.categoryName = null;
                        this.categoryDescription = null;
                        if (this.isHierarchical && this.hierarchicalCategoryData) {
                            let categoryId = this.hierarchicalCategoryData.auditCategoryId;
                            if (this.multipleCategoryData) {
                                let categoryData = this.checkSubData(this.multipleCategoryData, categoryId);
                                this.hierarchicalCategoryData = categoryData;
                            }
                        }
                        this.cdRef.detectChanges();
                    }
                }
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionsForConductsCompleted),
                tap((result: any) => {
                    if (this.isHierarchical)
                        this.loadHierarchicalQuestions = true;
                    this.questions$ = this.store.pipe(select(auditModuleReducer.getQuestionConductAll));
                    this.questions$.subscribe(result => {
                        this.questionsCount = result.length;
                    });
                    this.hierarchicalOccurence = 0;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionViewCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions) {
                        if (this.categorySelected.auditCategoryId != result.searchQuestions[0].auditCategoryId) {

                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportTriggered),
                tap((result: any) => {
                    this.questionsForReport = null;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditReportActionTypes.LoadDetailedReportCompleted),
                tap((result: any) => {
                    if (result && result.detailedReport) {
                        let data = result.detailedReport;
                        this.questionsForReport = data.questionsForReport ? data.questionsForReport : [];
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

            this.getSoftLabelConfigurations();
        }
      
        getSoftLabelConfigurations() {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }

    ngOnInit() {
        super.ngOnInit();
    }

    getAuditRatings() {
        let rating = new AuditRating();
        rating.isArchived = false;
        this.auditService.getAuditRatings(rating).subscribe((result: any) => {
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    this.auditRatings = result.data;
                    this.cdRef.markForCheck();
                }
                else {
                    this.auditRatings = [];
                    this.cdRef.markForCheck();
                }
            }
            else {
                this.auditRatings = [];
                this.cdRef.markForCheck();
            }
        })
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

    loadMasterQuestionTypes() {
        let model = new QuestionType();
        model.isArchived = false;
        this.auditService.searchMasterQuestionTypes(model).subscribe((result: any) => {
            if (result.success) {
                this.masterQuestionTypeList = result.data;
                this.auditService.assignMasterData(this.masterQuestionTypeList);
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    loadQuestions() {
        let questionModel = new QuestionModel();
        questionModel.conductId = this.selectedConduct.conductId;
        questionModel.auditCategoryId = this.categorySelected.auditCategoryId;
        questionModel.isHierarchical = this.isHierarchical;
        questionModel.isArchived = false;
        this.store.dispatch(new LoadQuestionsForConductsTriggered(questionModel));
        this.questions$ = this.store.pipe(select(auditModuleReducer.getQuestionConductAll));
    }

    handleClick(data) {
        this.selectedQuestionId = data.questionId;
        this.cdRef.markForCheck();
    }

    upsertAuditQuestion() {
        let data = {
            questionData: null,
            upsertQuestion: true,
            previewQuestion: false
        };
        this.questionPreview.emit(data);
    }

    getQuestionStatusPreview(data) {
        this.questionPreview.emit(data);
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

    openConductSubmitPopover() {
        this.initializeRatingForm();
        this.auditRatingForm.reset();
        this.conductSubmitPopover.open();
    }

    openAuditDocuments() {
        let data = { audit: false, id: null };
        data.audit = true;
        data.id = this.selectedConduct.auditId;
        this.documents.emit(data);
    }

    openConductDocuments() {
        let data = { audit: false, id: null };
        data.audit = false;
        data.id = this.selectedConduct.conductId;
        this.documents.emit(data);
    }

    initializeRatingForm() {
        this.auditRatingForm = new FormGroup({
            auditRatingId: new FormControl(null, Validators.compose([Validators.required])),
        });
    }

    submitConduct() {
        if (!this.canConductSubmitted) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionMandatory));
        }
        else if (this.areActionsAdded) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionActionAdded));
        }
        else if(this.areDocumentsUploaded) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForDocumentsAdded))
        }
        else {
            this.disableSubmit = true;
            let conductModel = new AuditConduct();
            conductModel = this.auditRatingForm.value;
            conductModel.conductId = this.selectedConduct.conductId;
            //conductModel.questionsForReport = this.questionsForReport;
            this.store.dispatch(new LoadSubmitConductTriggered(conductModel));
        }
    }

    closeConductSubmitDialog() {
        this.disableSubmit = false;
        this.conductSubmitPopover.close();
        this.cdRef.markForCheck();
    }

    tagsvalue(data) {
        var tags = data.auditTagsModels;
        this.tagValue = [];
        this.tagNames = null
        if (tags) {
            tags.forEach(element => {
                this.tagValue.push(element.tagName)
            });
            this.tagNames = this.tagValue.toString();
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}