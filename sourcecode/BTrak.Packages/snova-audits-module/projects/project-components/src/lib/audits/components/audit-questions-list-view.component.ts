import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DragulaService } from "ng2-dragula";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SatPopover } from "@ncstate/sat-popover";

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";

// import { ConstantVariables } from 'app/common/constants/constant-variables';

import { AuditActionTypes, LoadAuditByIdTriggered } from "../store/actions/audits.actions";
import { AuditCategoryActionTypes, LoadCategoriesTriggered } from "../store/actions/audit-categories.actions";
import { AuditService } from "../services/audits.service";
import { QuestionType } from "../models/question-type.model";
import { ToastrService } from "ngx-toastr";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionListTriggered, QuestionActionTypes, LoadQuestionReorderTriggered, LoadMoveQuestionsTriggered } from "../store/actions/questions.actions";
import { QuestionsCopyMoveComponent } from "./questions-copy-move.component";
import { ConductQuestionModel } from "../models/conduct-question.model";
import { TestCaseDropdownList } from '../dependencies/models/testcasedropdown';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditCompliance } from '../models/audit-compliance.model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { UserService } from '../dependencies/services/user.Service';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
// import { QuestionsShiftModel } from "../models/questions-shift.model";

@Component({
    selector: "audit-questions-list-view",
    templateUrl: "./audit-questions-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService]
})

export class AuditQuestionsListViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("moveQuestionsPopover") moveQuestionPopover: SatPopover;
    @ViewChild("copyQuestionsPopover") copyQuestionPopover: SatPopover;
    @ViewChild("deleteQuestionsPopover") deleteQuestionPopover: SatPopover;
    @Output() questionPreview = new EventEmitter<any>();
    @Output() documents = new EventEmitter<any>();

    @Input("loadAuditRelatedData")
    set _loadAuditRelatedData(data: boolean) {
        if (data || data == false) {
            this.loadAuditRelatedData = data;
        }
        else {
            this.loadAuditRelatedData = false;
        }
    }

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        this.tagNames = null;
        if (data && data != 'empty') {
            this.selectedAudit = data;
            this.loadAuditRelatedData = true;
            this.isAuditLoaded = true;
            if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
            this.tagsvalue(data);
        }
        else if (data == 'empty') {
            this.isAuditLoaded = false;
            this.loadAuditRelatedData = false;
        }
    }

    @Input("loadAuditCategoryRelatedData")
    set _loadAuditCategoryRelatedData(data: any) {
        if (data || data == false) {
            // this.loadAuditCategoryRelatedData = data;
        }
    }

    @Input("categorySelected")
    set _categorySelected(data: any) {
        if (data) {
            this.categorySelected = data;
            this.loadAuditCategoryRelatedData = true;
            this.isAuditCategoryLoaded = true;
            this.filterOpen = false;
            if (this.isHierarchical) {
                this.hierarchicalCategoryData = data;
            }
            this.loadQuestions();
        }
        else if (data === null) {
            this.filterOpen = false;
            this.categorySelected = null;
            this.loadAuditCategoryRelatedData = false;
            this.isAuditCategoryLoaded = false;
        }
        else {
            this.filterOpen = false;
            this.categorySelected = null;
            this.isAuditCategoryLoaded = false;
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
            this.selectedQuestionId = null;
            this.cdRef.detectChanges();
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    reOrderOperationInProgress$: Observable<boolean>;
    moveOperationInProgress$: Observable<boolean>;
    questions$: Observable<QuestionModel[]>;
    categoryList$: Observable<TestCaseDropdownList[]>;

    public ngDestroyed$ = new Subject();
    subs = new Subscription();

    projectId: string;

    questionTypeList = [];
    questionsModel = [];
    questionsSelected = [];
    masterQuestionTypeList = [];
    rolesDropDown = [];

    moveQuestionsForm: FormGroup;

    sampleList = [
        {
            questionIdentity: 'Q123',
            questionName: 'sample',
            questionId: '1234',
            questionResult: 'sample',
            questionScore: 10,
            questionDescription: 'sample',
            questionTypeName: 'sample'
        },
        {
            questionIdentity: 'Q124',
            questionName: 'sample',
            questionId: '1234',
            questionResult: 'sample',
            questionScore: 10,
            questionDescription: 'sample',
            questionTypeName: 'sample'
        }
    ];

    selectedAudit: any;
    categorySelected: any;
    validationMessage: any;
    questionFromPreview: any;
    hierarchicalCategoryData: any;
    multipleCategoryData: any;
    selection: any;
    tagNames: any;
    tagValue = [];
    selectedQuestionId: string;
    categoryName: string;
    categoryDescription: string;
    questionsCount: number = 0;
    hierarchicalOccurence: number = 0;
    isAuditArchived: boolean = false;
    isAuditLoaded: any;
    isHierarchical: boolean = true;
    filterOpen: boolean = false;
    isAuditOrNot: boolean = true;
    loadHierarchicalQuestions: boolean = false;
    isAuditCategoryLoaded: boolean = false;
    loadAuditRelatedData: boolean = false;
    disableMoveQuestions: boolean = false;
    loadMoveQuestions: boolean = false;
    isCopy: boolean = false;
    isArchived: boolean = false;
    categorySameError: boolean = false;
    isAnyOfQuestionsSelected: boolean = false;
    isMultiQuestionsSelected: boolean = false;
    reOrderOperationInProgress: boolean = false;
    loadAuditCategoryRelatedData: any = null;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private dragulaService: DragulaService, private translateService: TranslateService, private store: Store<State>, private actionUpdates$: Actions, private auditService: AuditService, private userService: UserService, private toastr: ToastrService, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.loadQuestionTypes();
        this.loadMasterQuestionTypes();
        this.getAllRoles();

        dragulaService.createGroup("questions", {
            revertOnSpill: true
            // removeOnSpill: true
        });

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionListLoading));

        this.reOrderOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsReorderLoading));

        this.moveOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsMoveLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditListTriggered),
                tap(() => {
                    this.loadAuditRelatedData = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAudits.length > 0) {
                        let auditData = result.searchAudits[0];
                        if (this.selectedAudit && this.selectedAudit.auditId == auditData.auditId && this.isAuditLoaded && this.loadAuditRelatedData) {
                            this.selectedAudit = auditData;
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
                        if (this.loadAuditCategoryRelatedData != null) {
                            this.loadAuditCategoryRelatedData = null;
                            this.cdRef.detectChanges();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories) {
                        this.multipleCategoryData = result.searchAuditCategories;
                        if (this.hierarchicalCategoryData && this.multipleCategoryData && this.multipleCategoryData.length > 0) {
                            let categoryResult = result.searchAuditCategories;
                            let auditCategoryId = this.hierarchicalCategoryData.auditCategoryId;
                            let categoryData = this.checkSubData(categoryResult, auditCategoryId);
                            this.hierarchicalCategoryData = categoryData;
                            this.cdRef.markForCheck();
                        }
                        else if (this.multipleCategoryData == null || this.multipleCategoryData.length == 0) {
                            this.hierarchicalCategoryData = null;
                            this.isHierarchical = true;
                            this.filterOpen = false;
                            this.categorySelected = null;
                            this.loadAuditCategoryRelatedData = false;
                            this.cdRef.detectChanges();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories.length > 0) {
                        let auditCategoryData = result.searchAuditCategories[0];
                        if (this.categorySelected && this.categorySelected.auditCategoryId == auditCategoryData.auditCategoryId && this.isAuditCategoryLoaded && this.loadAuditRelatedData) {
                            this.categorySelected = auditCategoryData;
                            this.cdRef.markForCheck();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionListTriggered),
            tap((result) => {
                this.loadHierarchicalQuestions = false;
                this.questionFromPreview = null;
                this.selectedQuestionId = null;
                this.questionsSelected = [];
                this.selection = null;
                this.isMultiQuestionsSelected = false;
                this.isAnyOfQuestionsSelected = false;
                this.cdRef.markForCheck();
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
                            let categoryData = this.checkSubData(this.multipleCategoryData, categoryId);
                            this.hierarchicalCategoryData = categoryData;
                        }
                        this.cdRef.detectChanges();
                    }
                }
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionListCompleted),
                tap((result: any) => {
                    if (this.isHierarchical)
                        this.loadHierarchicalQuestions = true;
                    this.questions$ = this.store.pipe(select(auditModuleReducer.getQuestionAll));
                    this.questions$.subscribe(result => {
                        this.questionsCount = result.length;
                    });
                    // if (result && result.searchQuestions) {
                    // this.questionsCount = result.searchQuestions.length;
                    // }
                    this.hierarchicalOccurence = 0;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionReorderCompleted),
            tap(() => {
                this.dragulaService.find('questions').drake.cancel(true);
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.QuestionFailed),
            tap(() => {
                // this.dragulaService.find('questions').drake.cancel(true);
                this.categorySameError = false;
                this.disableMoveQuestions = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadMoveQuestionsCompleted),
            tap(() => {
                this.questionsSelected = [];
                this.selection = null;
                this.isMultiQuestionsSelected = false;
                this.isAnyOfQuestionsSelected = false;
                //if (this.isHierarchical) {
                this.closeCopyQuestionsPopover();
                this.loadQuestions();
                let searchAudit = new AuditCompliance();
                searchAudit.auditId = this.selectedAudit.auditId;
                searchAudit.isArchived = false;
                searchAudit.canRefreshAudit = true;
                this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
                //}
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.subs.add(this.dragulaService.drag("questions")
            .subscribe(({ el }) => {
                this.reOrderOperationInProgress$.subscribe(x => this.reOrderOperationInProgress = x);
                if (this.reOrderOperationInProgress) {
                    this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
                    this.dragulaService.find('questions').drake.cancel(true);
                }
            })
        );

        this.subs.add(this.dragulaService.drop("questions")
            // .takeUntil(this.ngDestroyed$)
            .subscribe(({ name, el, target, source, sibling }) => {
                var orderedListLength = target.children.length;
                let orderedTestCaseList = [];
                for (var i = 1; i < orderedListLength; i++) {
                    var questionId = target.children[i].attributes["data-questionid"].value;
                    orderedTestCaseList.push(questionId.toLowerCase());
                }
                this.store.dispatch(new LoadQuestionReorderTriggered(orderedTestCaseList));
            })
        );
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
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

    getAllRoles() {
        this.userService.getAllRoles().subscribe((responseData: any) => {
            if (responseData.success) {
                this.rolesDropDown = responseData.data;
                this.rolesDropDown.forEach((p) => {
                    let id = p.roleId.toLowerCase();
                    p.roleId = id;
                });
                this.auditService.assignRolesData(this.rolesDropDown);
                this.cdRef.markForCheck();
            }
        });
    }

    loadQuestions() {
        let questionModel = new QuestionModel();
        questionModel.auditCategoryId = this.categorySelected.auditCategoryId;
        questionModel.isHierarchical = this.isHierarchical;
        questionModel.isArchived = false;
        this.store.dispatch(new LoadQuestionListTriggered(questionModel));
        this.questions$ = this.store.pipe(select(auditModuleReducer.getQuestionAll), tap(result => {
            this.questionsModel = result;
        }));
    }

    handleClick(data) {
        this.selectedQuestionId = data.questionId;
        this.cdRef.markForCheck();
    }

    upsertAuditQuestion() {
        let data = {
            questionData: null,
            upsertQuestion: true,
            previewQuestion: false,
            auditCategoryId: this.categorySelected.auditCategoryId
        };
        this.questionPreview.emit(data);
    }

    getQuestionPreviewDetails(data) {
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

    copyOrMoveQuestionsDailogOpen() {
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedCategories');
        let currentCategoryIdForShift;
        if (this.categorySelected && this.categorySelected.auditCategoryId)
            currentCategoryIdForShift = this.categorySelected.auditCategoryId;
        else
            currentCategoryIdForShift = null;
        const dialogRef = this.dialog.open(QuestionsCopyMoveComponent, {
            height: '62%',
            width: '60%',
            hasBackdrop: true,
            direction: 'ltr',
            data: { auditId: this.selectedAudit.auditId, projectId: this.projectId, isHierarchical: this.isHierarchical, currentCategoryId: currentCategoryIdForShift },
            disableClose: true,
            panelClass: 'custom-modal-container'
        });
        dialogRef.afterClosed().subscribe(() => { })
    }

    getQuestionSelection(data) {
        let index = this.questionsSelected.indexOf(data);
        if (index != -1) {
            this.questionsSelected.splice(index, 1);
        }
        else {
            this.questionsSelected.push(data);
        }
        if (this.questionsSelected.length > 0)
            this.isAnyOfQuestionsSelected = true;
        else
            this.isAnyOfQuestionsSelected = false;
    }

    getQuestionsSelected(data) {
        let index = this.questionsSelected.indexOf(data);
        if (index != -1) {
            this.questionsSelected.splice(index, 1);
        }
        else {
            this.questionsSelected.push(data);
        }
        if (this.questionsSelected.length > 0)
            this.isAnyOfQuestionsSelected = true;
        else
            this.isAnyOfQuestionsSelected = false;
        this.selection = null;
    }

    changeStatus(value) {
        this.isMultiQuestionsSelected = value;
        if (value)
            this.isAnyOfQuestionsSelected = true;
        else
            this.isAnyOfQuestionsSelected = false;
        let selections = new ConductQuestionModel();
        selections.categoryCheckBoxClicked = true;
        selections.categorySelected = value;
        this.selection = selections;
    }

    openMoveQuestionsPopover() {
        this.loadMoveQuestions = true;
        this.isCopy = false;
        this.isArchived = false;
        this.clearMoveQuestionsForm();
        this.moveQuestionPopover.open();
    }

    openCopyQuestionsPopover() {
        this.loadMoveQuestions = true;
        this.isCopy = true;
        this.isArchived = false;
        this.clearMoveQuestionsForm();
        this.copyQuestionPopover.open();
    }

    openDeleteQuestionsPopover() {
        this.loadMoveQuestions = true;
        this.isCopy = false;
        this.isArchived = true;
        this.clearMoveQuestionsForm();
        this.moveQuestionsToCategory();
    }

    clearMoveQuestionsForm() {
        this.disableMoveQuestions = false;
        this.categorySameError = false;
        this.loadCategoriesList();
        this.moveQuestionsForm = new FormGroup({
            auditCategoryId: new FormControl("", Validators.compose([Validators.required]))
        });
    }

    loadCategoriesList() {
        this.store.dispatch(new LoadCategoriesTriggered(this.selectedAudit.auditId));
        this.categoryList$ = this.store.pipe(select(auditModuleReducer.getCategoriesList));
    }

    moveQuestionsToCategory() {
        this.disableMoveQuestions = true;
        let moveQuestionsModel = new QuestionModel();
        moveQuestionsModel = this.moveQuestionsForm.value;
        moveQuestionsModel.questionIds = this.questionsSelected;
        moveQuestionsModel.isHierarchical = this.isHierarchical;
        moveQuestionsModel.isCopy = this.isCopy;
        moveQuestionsModel.isArchived = this.isArchived
        moveQuestionsModel.projectId = this.projectId;
        if (this.isHierarchical == false && moveQuestionsModel.auditCategoryId.toLowerCase() == this.categorySelected.auditCategoryId.toLowerCase()) {
            this.categorySameError = true;
            this.disableMoveQuestions = false;
            this.cdRef.detectChanges();
        }
        else {
            this.categorySameError = false;
            this.store.dispatch(new LoadMoveQuestionsTriggered(moveQuestionsModel));
            // let searchAudit = new AuditCompliance();
            // searchAudit.auditId = this.selectedAudit.auditId;
            // searchAudit.isArchived = false;
            // searchAudit.canRefreshAudit = true;
            // this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
        }
        this.isAnyOfQuestionsSelected = false;
    }

    openAuditDocuments() {
        this.documents.emit(this.selectedAudit.auditId);
    }

    closeMoveQuestionsPopover() {
        this.moveQuestionPopover.close();
        this.loadMoveQuestions = false;
    }

    closeCopyQuestionsPopover() {
        this.copyQuestionPopover.close();
        this.loadMoveQuestions = false;
    }

    closeDeleteQuestionsPopover() {
        this.deleteQuestionPopover.close();
        this.loadMoveQuestions = false;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
        this.dragulaService.destroy("questions");
    }

    tagsvalue(data) {
        var tags = data.auditTagsModels;
        this.tagValue = [];
        if (tags) {
            tags.forEach(element => {
                this.tagValue.push(element.tagName)
            });
            this.tagNames = this.tagValue.toString();
        }
    }
}