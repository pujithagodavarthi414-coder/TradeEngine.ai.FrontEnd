import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as auditModuleReducer from "../store/reducers/index";

import { QuestionModel } from "../models/question.model";
import { QuestionActionTypes, LoadQuestionsByCategoryIdForConductsTriggered } from "../store/actions/questions.actions";
import { ConductQuestionModel } from "../models/conduct-question.model";

@Component({
    selector: "audit-select-question-view",
    templateUrl: "./audit-select-question-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditSelectQuestionViewComponent {
    @Output() selectedQuestionDetails = new EventEmitter<any>();
    @Output() selectedQuestionDetailsAllNone = new EventEmitter<any>();
    @Output() unselectCategory = new EventEmitter<any>();
    @Output() checkCategory = new EventEmitter<any>();
    @Output() categoryQuestionsData = new EventEmitter<any>();

    @Input() checkFilterQuestions: any;

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        this.selectAllNone = data;
        if (this.selectAllNone) {
            if (this.questionsForRuns != null && this.questionsForRuns.length > 0) {
                this.categoryQuestionsData.emit(this.questionsForRuns);
            }
        }
    }

    @Input("selectedCategoryData")
    set _selectedCategoryData(data: any) {
        if (data && data != 'none') {
            this.categoryData = data;
            this.selectedCategoryId = data.auditCategoryId;
            this.isCategoryDataPresent = true;
            this.isQuestionsPresent = false;
            this.loadQuestions();
        }
        if (data == 'none') {
            this.isCategoryDataPresent = false;
            this.isQuestionsPresent = true;
        }
    }

    @Input("selectedCategory")
    set _selectedCategory(data: any) {
        if (data) {
            this.selectedCategoryIdData = data;
            this.cdRef.detectChanges();
        }
    }

    @Input("auditsId")
    set _auditsId(data: any) {
        if (data) {
            this.auditId = data;
        }
    }

    questionsForRuns$: Observable<QuestionModel[]>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    questionSearch: QuestionModel;
    questionsForRuns: QuestionModel[];
    categoryData: any;
    selectedCategoryIdData: any;
    selectCases: any;
    selectAllNone: any;
    questionsCount: number = 0;
    isQuestionsPresent: boolean = false;
    isCategoryDataPresent: boolean = false;
    auditId: string;
    conductEdit: boolean = true;
    filterOpen: boolean = false;
    questionsFilter: boolean = true;
    categoryName: string;
    selectedCategoryId: string;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsByCategoryIdForConductsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
            tap(() => {
                if (localStorage.getItem('selectedCategoryFilter') != null) {
                    let categoryData = JSON.parse(localStorage.getItem('selectedCategoryFilter'));
                    this.categoryName = categoryData.auditCategoryName;
                    localStorage.removeItem('selectedCategoryFilter');
                    this.cdRef.detectChanges();
                }
                else {
                    this.categoryName = null;
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted),
            tap((result: any) => {
                if (result && result.searchQuestions) {
                    this.questionsCount = result.searchQuestions.length;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();
    }

    loadQuestions() {
        this.questionSearch = new QuestionModel();
        this.questionSearch.auditCategoryId = this.categoryData.auditCategoryId;
        this.questionSearch.isArchived = false;
        this.store.dispatch(new LoadQuestionsByCategoryIdForConductsTriggered(this.questionSearch));
        this.questionsForRuns$ = this.store.pipe(select(auditModuleReducer.getQuestionsByCategoryIdForConducts),
            tap(questions => {
                if (questions && questions.length > 0) {
                    this.questionsForRuns = questions;
                }
                else
                    this.questionsForRuns = [];
            }));
    }

    getSelectedQuestionDetails(value) {
        this.selectedQuestionDetails.emit(value);
    }

    getSelectedQuestionDetailsAllNone(value) {
        this.selectedQuestionDetailsAllNone.emit(value);
    }

    getUnselectedCategory(value) {
        this.unselectCategory.emit(value);
    }

    getSelectedCategory(value) {
        let checkSelection = new ConductQuestionModel();
        checkSelection.auditCategoryId = value;
        checkSelection.questionsSelected = this.questionsCount;
        this.checkCategory.emit(checkSelection);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
