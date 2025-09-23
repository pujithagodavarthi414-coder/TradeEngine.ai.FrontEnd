import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Store, select } from "@ngrx/store";

import { State } from "../store/reducers/index";

import * as auditModuleReducer from "../store/reducers/index";

import { QuestionModel } from "../models/question.model";
import { TestCaseDropdownList } from "../dependencies/models/testcasedropdown";
import { QuestionActionTypes, LoadQuestionListTriggered, LoadQuestionsByFilterForConductsTriggered, LoadQuestionsForConductsTriggered, LoadVersionQuestionListTriggered } from "../store/actions/questions.actions";
import { LoadCategoriesTriggered, LoadVersionCategoriesTriggered } from "../store/actions/audit-categories.actions";
import { AuditService } from "../services/audits.service";
import { AuditCategory } from "../models/audit-category.model";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "questions-filter",
    templateUrl: "./questions-filter.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionsFilterComponent {
    @Input("isAudit")
    set _isAudit(data: boolean) {
        this.isAudit = data;
    }

    @Input("isQuestionsFilter")
    set _isQuestionsFilter(data: boolean) {
        if (data || data == false) {
            this.isQuestionsFilter = data;
        }
    }

    @Input("auditId")
    set _auditId(data: string) {
        if (data) {
            this.auditId = data;
            this.clearFilters();
            this.loadCategories();
        }
    }

    @Input("conductId")
    set _conductId(data: string) {
        if (data) {
            this.conductId = data;
            this.clearFilters();
        }
    }

    @Input("selectedCategoryData")
    set _selectedCategoryData(data: any) {
        this.categoryData = data;
    }

    @Input("conductEdit")
    set _conductEdit(data: boolean) {
        if (data || data == false) {
            this.isConductEdit = data;
            this.clearFilters();
            this.loadCategories();
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false)
            this.isHierarchical = data;
    }

    @Input("isAuditVersion")
    set _isAuditVersion(data: any) {
        if (data) {
            this.auditVersionId = data;
            this.isAuditVersion = true;
            this.clearFilters();
            this.loadVersionCategories();
        }
        else {
            this.auditVersionId = null;
            this.isAuditVersion = false;
        }
    }

    categoriesList$: Observable<TestCaseDropdownList[]>;
    anyOperationInProgress$: Observable<boolean>;

    dropDownList: TestCaseDropdownList;

    questionSearch: QuestionModel;
    questions: QuestionModel;

    masterQuestionTypeList = [];
    questionTypeList = [];

    public ngDestroyed$ = new Subject();

    projectId: string;
    auditId: string;
    conductId: string;
    auditVersionId: string;
    isConductEdit: boolean = false;
    categoryData: any;
    filterCount: number = 0;
    selectedCategoryName: string;
    selectedCategoryDescription: string;
    isOpen: boolean = true;
    disableFilter: boolean = false;
    displayFilters: boolean = false;
    isAuditVersion: boolean;
    isAudit: boolean;
    isQuestionsFilter: boolean;
    isHierarchical: boolean;
    filterCall: boolean;

    createdOnFilter: string;
    createdByFilter = [];
    questionTypeFilter = [];
    categoryFilter: string;
    templateFilter = [];
    searchText: string;
    updatedOnFilter: string;
    updatedByFilter = [];
    sortByFilter: string;
    statusFilter = [];

    createdOnSearch: string;
    createdBySearch = [];
    questionTypeSearch = [];
    categorySearch: string;
    templateSearch = [];
    searchTextSearch: string;
    updatedOnSearch: string;
    updatedBySearch = [];
    statusSearch = [];
    softLabels: SoftLabelConfigurationModel[];
    constructor(private route: ActivatedRoute, private auditService: AuditService, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionsByFilterForConductsLoading));


        this.auditService.getQuestionTypeData().subscribe(data => {
            if (data) {
                this.questionTypeList = data;
                this.auditService.getMasterData().subscribe(data => {
                    if (data) {
                        let masterTypes = data.map(type => {
                            let object = Object.assign({}, type);
                            object.questionTypeId = type.masterQuestionTypeId;
                            object.questionTypeName = type.masterQuestionTypeName;
                            return object;
                        })
                        this.questionTypeList = [...this.questionTypeList, ...masterTypes];
                        // this.masterQuestionTypeList = data;
                    }
                });
            }
        });

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionListCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadVersionQuestionListCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionsForConductsCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadQuestionsByFilterForConductsCompleted),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.QuestionFailed),
                tap(() => {
                    this.disableFilter = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
            this.getSoftLabelConfigurations();
        }
      
        getSoftLabelConfigurations() {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    loadCategories() {
        if (this.isAudit || this.isAudit == false || this.isConductEdit || this.isConductEdit == false) {
            this.store.dispatch(new LoadCategoriesTriggered(this.auditId));
            this.categoriesList$ = this.store.pipe(select(auditModuleReducer.getCategoriesList));
        }
    }

    loadVersionCategories() {
        this.store.dispatch(new LoadVersionCategoriesTriggered(this.auditVersionId));
        this.categoriesList$ = this.store.pipe(select(auditModuleReducer.getVersionCategoriesList));
    }

    applyQuestionsFilter() {
        this.disableFilter = true;
        this.questionSearch = new QuestionModel();
        if (this.isQuestionsFilter)
            this.questionSearch.auditId = this.auditId;
        this.questionSearch.createdOn = this.createdOnFilter;
        if (!this.isQuestionsFilter)
            this.questionSearch.auditCategoryId = this.categoryData;
        if (this.isHierarchical)
            this.questionSearch.isHierarchical = true;
        else
            this.questionSearch.isHierarchical = false;
        if (this.categoryFilter) {
            // this.questionSearch.isHierarchical = false;
            this.questionSearch.auditCategoryId = this.categoryFilter;
            if (!this.isQuestionsFilter) {
                let categoryFilter = new AuditCategory();
                categoryFilter.auditCategoryName = this.selectedCategoryName;
                categoryFilter.auditCategoryDescription = this.selectedCategoryDescription;
                categoryFilter.auditCategoryId = this.categoryFilter;
                categoryFilter.isHierarchical = this.isHierarchical;
                this.categoryData = this.categoryFilter;
                localStorage.setItem('selectedCategoryFilter', JSON.stringify(categoryFilter));
            }
        }
        this.questionSearch.searchText = (this.searchText && this.searchText != '') ? this.searchText.trim() : null;
        this.questionSearch.updatedOn = this.updatedOnFilter;
        this.questionSearch.createdOn = this.createdOnFilter;
        this.questionSearch.questionTypeFilter = this.questionTypeFilter;
        this.questionSearch.sortBy = this.sortByFilter;
        this.questionSearch.isFilter = true;
        this.questionSearch.isArchived = false;
        if (this.isAudit)
            this.store.dispatch(new LoadQuestionListTriggered(this.questionSearch));
        else if (this.isConductEdit) {
            this.questionSearch.clearFilter = false;
            this.store.dispatch(new LoadQuestionsByFilterForConductsTriggered(this.questionSearch));
        }
        else if (this.isAuditVersion) {
            this.questionSearch.auditVersionId = this.auditVersionId;
            this.store.dispatch(new LoadVersionQuestionListTriggered(this.questionSearch));
        }
        else {
            this.questionSearch.conductId = this.conductId;
            this.store.dispatch(new LoadQuestionsForConductsTriggered(this.questionSearch));
        }
    }

    checkFilterEnabled() {
        this.checkFilterEnabledExceptSortBy();
        if (this.createdOnFilter || this.categoryFilter || this.searchText || this.updatedOnFilter || this.sortByFilter || this.questionTypeFilter.length > 0) {
            return false;
        }
        else
            return true;
    }

    checkFilterEnabledExceptSortBy() {
        if (this.createdOnFilter || this.categoryFilter || this.searchText || this.updatedOnFilter || this.questionTypeFilter.length > 0) {
            this.displayFilters = true;
        }
        else
            this.displayFilters = false;
    }

    clearFilters() {
        this.displayFilters = false;
        this.createdOnFilter = null;
        this.createdByFilter = [];
        this.questionTypeFilter = [];
        this.categoryFilter = null;
        this.templateFilter = [];
        this.searchText = null;
        this.updatedOnFilter = null;
        this.updatedByFilter = [];
        this.sortByFilter = null;
        this.statusFilter = [];
        this.createdOnSearch = null;
        this.createdBySearch = [];
        this.questionTypeSearch = [];
        this.categorySearch = null;
        this.templateSearch = [];
        this.searchTextSearch = null;
        this.updatedOnSearch = null;
        this.updatedBySearch = [];
        this.statusSearch = [];
    }

    getQuestions() {
        this.disableFilter = true;
        this.questions = new QuestionModel();
        this.questions.auditCategoryId = this.categoryData;
        if (this.isHierarchical)
            this.questions.isHierarchical = true;
        else
            this.questions.isHierarchical = false;
        if (this.isAudit)
            this.store.dispatch(new LoadQuestionListTriggered(this.questions));
        else if (this.isConductEdit) {
            this.questions.clearFilter = true;
            this.store.dispatch(new LoadQuestionsByFilterForConductsTriggered(this.questions));
        }
        else if (this.isAuditVersion) {
            this.questionSearch.auditVersionId = this.auditVersionId;
            this.store.dispatch(new LoadVersionQuestionListTriggered(this.questionSearch));
        }
        else {
            this.questions.conductId = this.conductId;
            this.store.dispatch(new LoadQuestionsForConductsTriggered(this.questions));
        }
    }

    onChangeCreatedOn(event: any) {
        this.createdOnSearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    onChangeQuestionType(event: any) {
        this.questionTypeSearch = [];
        let value = event.source.selected.length;
        for (let i = 0; i < value; i++) {
            this.questionTypeSearch.push(event.source.selected[i]._element.nativeElement.innerText.trim());
        }
    }

    onChangeCategory(event: any) {
        this.categorySearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    onChangeUpdatedOn(event: any) {
        this.updatedOnSearch = event.source.selected._element.nativeElement.innerText.trim();
    }

    getCategoryFilterdata(event: any, categoryData) {
        if (event.source.selected) {
            this.selectedCategoryName = categoryData.value;
            this.selectedCategoryDescription = categoryData.description;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    clearCreatedOnSearch() {
        let count = this.checkFiltersCount();
        if (count > 1) {
            this.createdOnSearch = null;
            this.createdOnFilter = null;
            this.applyQuestionsFilter();
        }
        else if (count == 1) {
            this.clearFilters();
            this.getQuestions();
        }
    }

    clearQuestionTypeSearch() {
        let count = this.checkFiltersCount();
        if (count > 1) {
            this.questionTypeFilter = [];
            this.questionTypeSearch = [];
            this.applyQuestionsFilter();
        }
        else if (count == 1) {
            this.clearFilters();
            this.getQuestions();
        }
    }

    clearCategorySearch() {
        let count = this.checkFiltersCount();
        if (count > 1) {
            this.categoryFilter = null;
            this.categorySearch = null;
            this.applyQuestionsFilter();
        }
        else if (count == 1) {
            this.clearFilters();
            this.getQuestions();
        }
    }

    closeSearch() {
        let count = this.checkFiltersCount();
        if (count > 1) {
            this.searchText = null;
            this.applyQuestionsFilter();
        }
        else if (count == 1) {
            this.clearFilters();
            this.getQuestions();
        }
    }

    clearUpdatedOnsearch() {
        let count = this.checkFiltersCount();
        if (count > 1) {
            this.updatedOnSearch = null;
            this.updatedOnFilter = null;
            this.applyQuestionsFilter();
        }
        else if (count == 1) {
            this.clearFilters();
            this.getQuestions();
        }
    }

    checkFiltersCount() {
        let count = 0;
        if (this.createdOnFilter)
            count = count + 1;
        if (this.questionTypeFilter.length > 0)
            count = count + 1;
        if (this.categoryFilter)
            count = count + 1;
        if (this.searchText)
            count = count + 1;
        if (this.updatedOnFilter)
            count = count + 1;
        return count;
    }
}