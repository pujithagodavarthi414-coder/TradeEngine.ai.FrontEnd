import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import * as auditModuleReducer from "../store/reducers/index";
import { ConductCategories, AuditCategory } from "../models/audit-category.model";
import { AuditCategoryActionTypes, LoadAuditCategoriesForConductsEditTriggered } from "../store/actions/audit-categories.actions";
import { ConductQuestionModel } from "../models/conduct-question.model";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";


@Component({
    selector: "conduct-questions-list",
    templateUrl: "./conduct-questions-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductQuestionsListComponent {
    @Output() selectedCategoryData = new EventEmitter<any>();
    @Output() selectedCategories = new EventEmitter<any>();
    @Output() questionsSelected = new EventEmitter<any>();
    @Output() categoriesSelected = new EventEmitter<any>();
    @Output() categoryQuestionsCount = new EventEmitter<any>();
    @Output() categoriesData = new EventEmitter<any>();
    @Input() unSelectCategoryId: any;
    @Input() categoryToCheck: any;
    @Input() categorySelected: any;
    @Input() checkFilterQuestions: any;
    @Input() categoryCollapse: boolean;

    @Input("selectAllNone")
    set _selectAllNone(data: any) {
        this.selectAllNone = data;
        if (this.selectAllNone) {
            if (this.conductCategoriesList.auditCategories != null && this.conductCategoriesList.auditCategories.length > 0) {
                this.categoriesData.emit(this.conductCategoriesList.auditCategories);
            }
        }
    }

    @Input("auditId")
    set _auditId(data: any) {
        this.auditId = data;
        this.loadCategoriesList();
    }

    @Input("conductId")
    set _testRunId(data: any) {
        if (data != undefined && data) {
            this.conductId = data;
            this.loadCategoriesList();
        }
        else
            this.conductId = null;
    }

    conductCategoryList$: Observable<ConductCategories>;
    anyOperationInProgress$: Observable<boolean>;

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    auditId: string;
    conductId: string;
    isCategoriesPresent: boolean = false;
    isCategoriesListPresent: boolean = false;
    conductCategoryList: any;
    conductCategoriesList: any;
    selectAllNone: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getCategoriesForConductsEditLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditCompleted),
            tap(() => {
                this.conductCategoryList$.subscribe(result => {
                    this.conductCategoriesList = result;
                    if (this.conductId != null) {
                        this.categoriesSelected.emit(this.conductCategoriesList.conductSelectedCategories);
                        this.questionsSelected.emit(this.conductCategoriesList.conductSelectedQuestions);
                    }
                    if (this.conductCategoriesList.auditCategories != null && this.conductCategoriesList.auditCategories.length > 0) {
                        this.conductCategoryList = result;
                        this.isCategoriesListPresent = true;
                        this.isCategoriesPresent = false;
                        this.selectedCategoryData.emit(this.conductCategoriesList.auditCategories[0]);
                        if (localStorage.getItem('selectedCategories') != 'undefined' && localStorage.getItem('selectedCategories') != null) {
                            let selectedCategories = JSON.parse(localStorage.getItem('selectedCategories'));
                            let selectedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
                            if (selectedCategories.indexOf(this.conductCategoriesList.auditCategories[0].auditCategoryId) != -1
                                && selectedQuestions.findIndex(x => x.auditCategoryId == this.conductCategoriesList.auditCategories[0].auditCategoryId) == -1) {
                                let selectedQuestionDetails = new ConductQuestionModel();
                                selectedQuestionDetails.auditCategoryId = this.conductCategoriesList.auditCategories[0].auditCategoryId;
                                selectedQuestionDetails.categorySelected = true;
                                selectedQuestionDetails.categoryCheckBoxClicked = true;
                                selectedQuestionDetails.unselectCategory = false;
                                selectedQuestionDetails.selectCategory = false;
                                selectedQuestionDetails.unselectAllQuestions = true;
                                this.selectedCategories.emit(selectedQuestionDetails);
                            }
                        }
                    }
                    else {
                        this.isCategoriesListPresent = false;
                        this.isCategoriesPresent = true;
                        this.selectedCategoryData.emit('none');
                        this.selectedCategories.emit(null);
                    }
                    this.conductCategoryList = result;
                })
            })
        ).subscribe();
    }

    ngOnInit() {

        this.getSoftLabelConfigurations();

    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadCategoriesList() {
        let categoriesList = new AuditCategory();
        categoriesList.auditId = this.auditId;
        categoriesList.conductId = this.conductId;
        categoriesList.isCategoriesRequired = false;
        categoriesList.includeConductQuestions = true;
        this.store.dispatch(new LoadAuditCategoriesForConductsEditTriggered(categoriesList));
        this.conductCategoryList$ = this.store.pipe(select(auditModuleReducer.getCategoriesListForConductsEdit));
    }

    getSelectedCategoryData(data) {
        this.selectedCategoryData.emit(data);
        this.cdRef.detectChanges();
    }

    getSelectedCategoryId(data) {
        this.selectedCategories.emit(data);
        this.cdRef.detectChanges();
    }

    getCategoryQuestionsCount(value) {
        this.categoryQuestionsCount.emit(value);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}