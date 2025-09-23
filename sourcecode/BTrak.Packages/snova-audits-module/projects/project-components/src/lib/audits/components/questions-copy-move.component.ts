import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject, of } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
// import { softLabelsActionTypes } from "app/common/store/actions/soft-labels.actions";

import { State } from "../store/reducers/index";
import * as auditModuleReducer from "../store/reducers/index";

import { ConstantVariables } from '../dependencies/constants/constant-variables';

import { AuditCompliance } from '../models/audit-compliance.model';
import { TestCaseDropdownList } from '../dependencies/models/testcasedropdown';
import { LoadCategoriesTriggered, AuditCategoryActionTypes } from '../store/actions/audit-categories.actions';
import { QuestionActionTypes, LoadCopyOrMoveQuestionsTriggered } from '../store/actions/questions.actions';
import { QuestionsShiftModel } from '../models/questions-shift.model';
// import { TestCaseRunDetails } from 'app/views/testrail/models/testcaserundetails';
import { ConductQuestionModel } from '../models/conduct-question.model';
import { LoadAuditListTriggered } from '../store/actions/audits.actions';
import { AuditService } from '../services/audits.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'questions-copy-move',
    templateUrl: './questions-copy-move.component.html',
})

export class QuestionsCopyMoveComponent {
    auditList$: Observable<AuditCompliance[]>;
    categoryList$: Observable<TestCaseDropdownList[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    public ngDestroyed$ = new Subject();

    projectId: string;
    auditId: string;

    selectedQuestions = [];
    selectedCategories = [];
    categoryQuestionsCounts = [];
    selectedAudit: any;
    selectedOptionForCopying: any;
    selectedCategoryForAppending: any;
    selectAllNone: any;
    categoryData: any;
    selectedCategoryIdData: any;
    unselectCategoryId: any;
    categoryToCheck: any;
    filteredQuestionsData: any;
    searchText: string;
    categorySelected: string;
    currentCategoryId: string;
    unselectQuestionsCount: number = 0;
    specificQuestionsSelected: number = 0;

    isCopy: boolean = false;
    disableShift: boolean = false;
    showSelectAllNone: boolean = false;
    isHierarchical: boolean = false;
    isLinear: boolean = false;
    removeStorage: boolean = false;
    specificQuestionsIncluded: boolean = false;
    expandAll: boolean = false;

    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions,
        private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef,
        public dialogRef: MatDialogRef<QuestionsCopyMoveComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
        public dialog: MatDialog, private auditService: AuditService) {

        this.searchText = this.data.auditId;
        this.projectId = this.data.projectId;
        this.currentCategoryId = this.data.currentCategoryId;
        this.isHierarchical = this.data.isHierarchical;
        this.getSoftLabelConfigurations();
        this.initializeAuditQuestionsCopyMoveForm();
        this.loadCategories(this.searchText);
        let auditModel = new AuditCompliance();
        auditModel.projectId = this.projectId;
        auditModel.isArchived = false;
        auditModel.isForFilter = true;
        // this.store.dispatch(new LoadAuditListTriggered(auditModel));
        this.auditService.searchAuditCompliances(auditModel).subscribe((result: any) => {
            this.auditList$ = of(result.data);
        });
        // this.auditList$ = this.store.pipe(select(auditModuleReducer.getAuditAll));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadCopyOrMoveQuestionsCompleted),
            tap(() => {
                this.disableShift = false;
                this.cancelShiftingQuestions();
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsTriggered),
            tap(() => {
                this.showSelectAllNone = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsCompleted),
            tap(() => {
                this.selectAllNone = null;
                this.showSelectAllNone = true;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
            tap(() => {
                this.unselectCategoryId = null;
                this.categoryData = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted),
            tap(() => {
                this.unselectCategoryId = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByFilterForConductsCompleted),
            tap((result: any) => {
                if (result && result.searchQuestions) {
                    this.selectedQuestions = [];
                    this.selectedCategories = [];
                    let filteredQuestions = [];
                    filteredQuestions = result.searchQuestions;
                    filteredQuestions.forEach(x => {
                        this.selectedQuestions.push(x);
                        if (x.isChecked && this.selectedCategories.indexOf(x.auditCategoryId) == -1)
                            this.selectedCategories.push(x.auditCategoryId);
                    });
                    if (this.selectedCategories.length > 0)
                        localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
                    localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
                    this.filteredQuestionsData = this.selectedQuestions;
                    this.categoryToCheck = null;
                    this.unselectCategoryId = null;
                    this.selectAllNone = null;
                    this.cdRef.markForCheck();
                }
                else if (result.searchQuestions.length == 0) {
                    this.selectAllNone = false;
                    this.selectedQuestions = [];
                    localStorage.removeItem('selectedQuestions');
                    this.selectedCategories = [];
                    localStorage.removeItem('selectedCategories');
                    this.filteredQuestionsData = [];
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.QuestionFailed),
            tap(() => {
                this.disableShift = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();
    }

    ngOnInit() {
       // this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadCategoryQuestions(auditId) {
        this.auditId = auditId;
    }

    loadCategories(auditId) {
        this.store.dispatch(new LoadCategoriesTriggered(auditId));
        this.categoryList$ = this.store.pipe(select(auditModuleReducer.getCategoriesList));
    }

    copyQuestions() {
        this.disableShift = true;
        this.isCopy = true;
        this.copyOrMoveCases();
    }

    moveQuestions() {
        this.disableShift = true;
        this.isCopy = false;
        this.copyOrMoveCases();
    }

    copyOrMoveCases() {
        if (this.selectedQuestions.length > 0 || this.selectedCategories.length > 0) {
            this.checkForDuplicateCategoryQuestions();
            let copyOrMoveQuestions = new QuestionsShiftModel();
            copyOrMoveQuestions.auditId = this.searchText;
            copyOrMoveQuestions.projectId = this.projectId;
            copyOrMoveQuestions.sourceAuditId = this.selectedAudit.value;
            copyOrMoveQuestions.questionsList = this.selectedQuestions;
            copyOrMoveQuestions.selectedCategories = this.selectedCategories;
            copyOrMoveQuestions.isHierarchical = this.isHierarchical;
            copyOrMoveQuestions.isCopy = this.isCopy;
            if (this.selectedOptionForCopying.value == '1') {
                copyOrMoveQuestions.isQuestionsOnly = true;
                copyOrMoveQuestions.isAllParents = false;
            }
            else if (this.selectedOptionForCopying.value == '2') {
                copyOrMoveQuestions.isQuestionsOnly = false;
                copyOrMoveQuestions.isAllParents = true;
            }
            copyOrMoveQuestions.appendToCategoryId = this.selectedCategoryForAppending.value == '' ? null : this.selectedCategoryForAppending.value;
            copyOrMoveQuestions.currentCategoryId = this.currentCategoryId;
            this.store.dispatch(new LoadCopyOrMoveQuestionsTriggered(copyOrMoveQuestions));
        }
        else {
            this.toastr.warning("", this.translateService.instant(ConstantVariables.WarningMessageForSelectAtleastOneQuestion));
            this.disableShift = false;
        }
    }

    checkForDuplicateCategoryQuestions() {
        this.selectedCategories.forEach(x => {
            this.removeQuestionsByCategoryId(x);
        });
    }

    getSelectedCategoryData(data) {
        this.categoryData = data;
        this.categorySelected = data.auditCategoryId;
        this.cdRef.markForCheck();
    }

    getSelectedCategoryId(value) {
        if (value && value.selectCategory) {
            this.selectedCategories.push(value.auditCategoryId);
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.categoryToCheck = null;
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectAllQuestions) {
            this.removeQuestionsByCategoryId(value.auditCategoryId);
            this.selectedCategoryIdData = value;
            this.unselectCategoryId = null;
            this.categoryToCheck = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.categoriesAllNone) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            if (index == -1) {
                this.selectedCategories.push(value.auditCategoryId);
                this.categoryToCheck = null;
            }
            else {
                this.selectedCategories.splice(index, 1);
                this.removeQuestionsByCategoryId(value.auditCategoryId);
            }
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.unselectCategoryId = null;
            this.cdRef.detectChanges();
        }
        if (value && (value.unselectAllQuestions == undefined || value.unselectAllQuestions == false) && value.categoryCheckBoxClicked) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            if (index == -1) {
                this.selectedCategories.push(value.auditCategoryId);
                this.categoryToCheck = null;
            }
            else {
                this.selectedCategories.splice(index, 1);
                this.removeQuestionsByCategoryId(value.auditCategoryId);
            }
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.selectedCategoryIdData = value;
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        else {
            this.selectedCategoryIdData = value;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectCategory) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            this.selectedCategories.splice(index, 1);
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
    }

    removeQuestionsByCategoryId(auditCategoryId) {
        let i = -1;
        while ((i = this.selectedQuestions.findIndex(x => x.auditCategoryId == auditCategoryId)) != -1) {
            let index = this.selectedQuestions.findIndex(x => x.auditCategoryId == auditCategoryId);
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
    }

    selectingAll() {
        if (this.showSelectAllNone) {
            this.selectAllNone = true;
            this.cdRef.markForCheck();
        }
    }

    selectingNone() {
        if (this.showSelectAllNone) {
            this.selectAllNone = false;
            this.selectedQuestions = [];
            this.selectedCategories = [];
            this.cdRef.markForCheck();
        }
    }

    getCategoriesData(data) {
        this.selectedCategories = [];
        for (let i = 0; i < data.length; i++) {
            this.selectedCategories.push(data[i].auditCategoryId);
            if (data[i].subAuditCategories && data[i].subAuditCategories.length > 0) {
                this.recursiveSelectCategories(data[i].subAuditCategories);
            }
        }
        localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    }

    recursiveSelectCategories(subCategoriesList) {
        for (let i = 0; i < subCategoriesList.length; i++) {
            this.selectedCategories.push(subCategoriesList[i].auditCategoryId);
            if (subCategoriesList[i].subAuditCategories && subCategoriesList[i].subAuditCategories.length > 0) {
                this.recursiveSelectCategories(subCategoriesList[i].subAuditCategories);
            }
        }
    }

    getCategoryQuestionsData(data) {
        this.selectedQuestions = [];
        for (let i = 0; i < data.length; i++) {
            let selectedQuestionDetails = new ConductQuestionModel();
            selectedQuestionDetails.questionId = data[i].questionId;
            selectedQuestionDetails.auditCategoryId = data[i].auditCategoryId;
            this.selectedQuestions.push(selectedQuestionDetails);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
    }

    getListOfQuestions(value) {
        let index = this.selectedQuestions.findIndex(x => x.questionId == value.questionId);
        if (index == -1) {
            this.selectedQuestions.push(value);
        }
        else {
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
        this.unselectCategoryId = null;
        this.selectAllNone = null;
        this.cdRef.detectChanges();
    }

    getListOfQuestionsAllNone(value) {
        let index = this.selectedQuestions.findIndex(x => x.questionId == value.questionId);
        if (index == -1) {
            this.selectedQuestions.push(value);
        }
        else {
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
        this.unselectCategoryId = null;
        this.cdRef.detectChanges();
    }

    getUnselectedCategory(value) {
        this.unselectCategoryId = value;
        this.cdRef.detectChanges();
    }

    getCategoryTocheck(value) {
        this.categoryToCheck = value;
        this.cdRef.detectChanges();
    }

    checkStatusDisabled() {
        if (this.selectedAudit.value)
            return false;
        else
            return true;
    }

    initializeAuditQuestionsCopyMoveForm() {
        this.selectedAudit = new FormControl('', []);
        this.selectedOptionForCopying = new FormControl('2', []);
        this.selectedCategoryForAppending = new FormControl('', []);
    }

    cancelShiftingQuestions() {
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedCategories');
        this.selectedQuestions = [];
        this.selectedCategories = [];
        this.categoryQuestionsCounts = [];
        this.cdRef.markForCheck();
        this.onClose();
    }

    onClose() {
        this.dialogRef.close();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}