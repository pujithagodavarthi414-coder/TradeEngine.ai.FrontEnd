import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, ViewChildren, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { AuditCategory } from "../models/audit-category.model";
import { LoadAuditCategoryListTriggered, AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { AuditActionTypes } from "../store/actions/audits.actions";
import { AuditConductActionTypes } from "../store/actions/conducts.actions";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionsForConductsTriggered } from "../store/actions/questions.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "conduct-category-list-view",
    templateUrl: "./conduct-category-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductCategoryListViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() selectedConductCategoryData = new EventEmitter<any>();
    @Output() loadConductCategoryRelatedData = new EventEmitter<any>();
    @Output() hierarchicalQuestions = new EventEmitter<any>();
    @Input() categorySelected: any;
    @Input() categoryDataForAnswer: any;

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data && data != 'empty') {
            this.selectedConduct = data;
            this.isConductSelected = true;
            this.loadConductRelatedData = true;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isConductArchived = false;
            else
                this.isConductArchived = true;
            if (!this.selectedConduct.isFromUnique)
                this.loadConductCategoryList(this.selectedConduct);
        }
        else if (data == 'empty') {
            this.isConductSelected = false;
            this.loadConductRelatedData = false;
        }
    }

    @Input("loadConductRelatedData")
    set _loadAuditRelatedData(data: boolean) {
        if (data || data == false) {
            this.loadConductRelatedData = data;
        }
        else {
            this.loadConductRelatedData = false;
        }
    }

    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    selectedConduct: any;
    isConductSelected: any;

    conductCategoryList = [];

    categoryOccurance: number = 0;
    deletedCategoryId: string;
    isArchived: boolean = false;
    isCategoriesPresent: boolean = true;
    loadConductCategory: boolean = false;
    expandAll: boolean;
    isConductArchived: boolean = false;
    loadConductRelatedData: boolean = false;
    categoryFilter: string = '2';
    softLabels: SoftLabelConfigurationModel[];
    categories: any;
    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
                tap(() => {
                    this.categoryFilter = '2';
                    this.categoryOccurance = 0;
                    this.deletedCategoryId = null;
                    localStorage.removeItem("selectedCategoryFilter");
                    localStorage.removeItem("selectedCategoryId");
                })
            ).subscribe();

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
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories) {
                        this.categoryOccurance = this.categoryOccurance + 1;
                        if (this.categoryOccurance <= 1 && result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                            this.conductCategoryList = result.searchAuditCategories;
                            this.isCategoriesPresent = true;
                            this.selectedConductCategoryData.emit(this.conductCategoryList[0]);
                            this.cdRef.markForCheck();
                        }
                        if (result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                            this.conductCategoryList = result.searchAuditCategories;
                            this.isCategoriesPresent = true;
                            this.cdRef.detectChanges();
                        }
                        else {
                            this.conductCategoryList = [];
                            this.isCategoriesPresent = false;
                            this.selectedConductCategoryData.emit(null);
                        }
                        if (this.conductCategoryList && this.conductCategoryList.length > 0 && this.conductCategoryList.length <= 5) {
                            this.expandAll = true;
                            this.cdRef.markForCheck();
                        }
                        else {
                            this.expandAll = false;
                            this.cdRef.markForCheck();
                        }
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

    onChangeCategoryFilter(value) {
        if (this.conductCategoryList && this.conductCategoryList.length > 0 && this.isConductSelected) {
            localStorage.removeItem('selectedCategoryFilter');
            let selCategoryId = localStorage.getItem("selectedCategoryId");
            let questionSearch = new QuestionModel();
            questionSearch.auditCategoryId = selCategoryId;
            questionSearch.isArchived = false;
            if (value == '1') {
                questionSearch.conductId = this.selectedConduct.conductId;
                questionSearch.isHierarchical = false;
                questionSearch.isFilter = false;
                this.hierarchicalQuestions.emit(false);
                this.store.dispatch(new LoadQuestionsForConductsTriggered(questionSearch));
            }
            else if (value == '2') {
                questionSearch.isHierarchical = true;
                this.hierarchicalQuestions.emit(true);
            }
            if (value == '2') {
                let categoryData = this.findIndexCategorydata(this.conductCategoryList, selCategoryId);
                let passingData = {
                    auditCategoryId: categoryData.auditCategoryId,
                    auditCategoryName: categoryData.auditCategoryName,
                    auditCategoryDescription: categoryData.auditCategoryDescription,
                    subAuditCategories: categoryData.subAuditCategories,
                    isHierarchical: true
                }
                this.selectedConductCategoryData.emit(passingData);
                this.cdRef.detectChanges();
            }
        }
    }

    loadConductCategoryList(audit) {
        let auditCategoryModel = new AuditCategory();
        auditCategoryModel.auditId = audit.auditId;
        auditCategoryModel.conductId = audit.conductId;
        auditCategoryModel.isArchived = false;
        if (audit.isIncludeAllQuestions)
            auditCategoryModel.isCategoriesRequired = false;
        else
            auditCategoryModel.isCategoriesRequired = true;
        this.store.dispatch(new LoadAuditCategoryListTriggered(auditCategoryModel));
    }

    getSelectedConductCategoryData(data) {
        this.selectedConductCategoryData.emit(data);
    }

    getDeletedCategoryId(data) {
        this.deletedCategoryId = data;
    }

    findIndexCategorydata(categoriesList, auditCategoryId) {
        for (let i = 0; i < categoriesList.length; i++) {
            if (categoriesList[i].auditCategoryId == auditCategoryId) {
                return categoriesList[i];
            }
            else if (categoriesList[i].subAuditCategories && categoriesList[i].subAuditCategories.length > 0) {
                let checkSubSections = this.recursiveFindIndexSectiondata(categoriesList[i].subAuditCategories, auditCategoryId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    recursiveFindIndexSectiondata(childList, auditCategoryId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].auditCategoryId == auditCategoryId) {
                return childList[i];
            }
            else if (childList[i].subAuditCategories && childList[i].subAuditCategories.length > 0) {
                let checkSubSections = this.recursiveFindIndexSectiondata(childList[i].subAuditCategories, auditCategoryId);
                if (checkSubSections != undefined && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}