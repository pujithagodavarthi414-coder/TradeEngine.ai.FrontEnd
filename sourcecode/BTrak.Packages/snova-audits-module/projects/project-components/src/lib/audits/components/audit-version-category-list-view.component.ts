import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, ViewChildren, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as auditModuleReducer from "../store/reducers/index";
import { AuditCategory } from "../models/audit-category.model";
import { LoadAuditCategoryListTriggered, AuditCategoryActionTypes, LoadAuditVersionCategoryListTriggered } from "../store/actions/audit-categories.actions";
import { AuditActionTypes } from "../store/actions/audits.actions";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionListTriggered, LoadVersionQuestionListTriggered } from "../store/actions/questions.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

@Component({
    selector: "audit-version-category-list-view",
    templateUrl: "./audit-version-category-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditVersionCategoryListViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('addCategoryPopover') addCategoriesPopover;
    @Output() selectedAuditCategoryData = new EventEmitter<any>();
    @Output() loadAuditCategoryRelatedData = new EventEmitter<any>();
    @Output() hierarchicalQuestions = new EventEmitter<any>();
    @Input() categorySelected: any;

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data && data != 'empty') {
            this.selectedAudit = data;
            this.isAuditSelected = true;
            this.loadAuditRelatedData = true;
            if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
            this.loadAuditCategoryList(this.selectedAudit);
        }
        else if (data == 'empty') {
            this.isAuditSelected = false;
            this.loadAuditRelatedData = false;
        }
    }

    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    selectedAudit: any;
    isAuditSelected: any;

    auditCategoryList = [];

    categoryOccurance: number = 0;
    deletedCategoryId: string;
    isArchived: boolean = false;
    isCategoriesPresent: boolean = true;
    loadAuditCategory: boolean = false;
    expandAll: boolean;
    isAuditArchived: boolean = false;
    loadAuditRelatedData: boolean = false;
    categoryFilter: string = '2';
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditVersionCategoryListLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditVersionCategoryListTriggered),
                tap(() => {
                    this.categoryFilter = '2';
                    this.categoryOccurance = 0;
                    this.deletedCategoryId = null;
                    localStorage.removeItem("selectedCategoryFilter");
                    localStorage.removeItem("selectedCategoryId");
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditVersionListTriggered),
                tap(() => {
                    this.loadAuditRelatedData = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditVersionCategoryListCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditCategories) {
                        this.categoryOccurance = this.categoryOccurance + 1;
                        if (this.categoryOccurance <= 1 && result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                            this.isCategoriesPresent = true;
                            this.auditCategoryList = result.searchAuditCategories;
                            this.selectedAuditCategoryData.emit(this.auditCategoryList[0]);
                        }
                        if (result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                            this.isCategoriesPresent = true;
                            this.auditCategoryList = result.searchAuditCategories;
                            this.cdRef.detectChanges();
                        }
                        else {
                            this.isCategoriesPresent = false;
                            this.auditCategoryList = [];
                            this.selectedAuditCategoryData.emit(null);
                        }
                        if (this.auditCategoryList && this.auditCategoryList.length > 0 && this.auditCategoryList.length <= 5) {
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
        if (this.auditCategoryList && this.auditCategoryList.length > 0 && this.isAuditSelected) {
            localStorage.removeItem('selectedCategoryFilter');
            let selCategoryId = localStorage.getItem("selectedCategoryId");
            let questionSearch = new QuestionModel();
            questionSearch.auditCategoryId = selCategoryId;
            questionSearch.auditVersionId = this.selectedAudit.auditVersionId;
            questionSearch.isArchived = false;
            if (value == '1') {
                questionSearch.isHierarchical = false;
                questionSearch.isFilter = false;
                this.hierarchicalQuestions.emit(false);
                this.store.dispatch(new LoadVersionQuestionListTriggered(questionSearch));
            }
            else if (value == '2') {
                questionSearch.isHierarchical = true;
                this.hierarchicalQuestions.emit(true);
            }
            if (value == '2') {
                let categoryData = this.findIndexCategorydata(this.auditCategoryList, selCategoryId);
                let passingData = {
                    auditCategoryId: categoryData.auditCategoryId,
                    auditCategoryName: categoryData.auditCategoryName,
                    auditCategoryDescription: categoryData.auditCategoryDescription,
                    subAuditCategories: categoryData.subAuditCategories,
                    isHierarchical: true
                }
                this.selectedAuditCategoryData.emit(passingData);
                this.cdRef.detectChanges();
            }
        }
    }

    loadAuditCategoryList(audit) {
        let auditCategoryModel = new AuditCategory();
        // auditCategoryModel.auditId = audit.auditId;
        auditCategoryModel.auditVersionId = audit.auditVersionId;
        auditCategoryModel.isArchived = false;
        this.store.dispatch(new LoadAuditVersionCategoryListTriggered(auditCategoryModel));
    }

    getSelectedAuditCategoryData(data) {
        this.selectedAuditCategoryData.emit(data);
    }

    getDeletedCategoryId(data) {
        this.deletedCategoryId = data;
    }

    checkSubData(categoriesList, deletedCategoryId) {
        for (let i = 0; i < categoriesList.length; i++) {
            if (categoriesList[i].auditCategoryId == deletedCategoryId) {
                return categoriesList[i].subAuditCategories;
            }
            else if (categoriesList[i].subAuditCategories && categoriesList[i].subAuditCategories.length > 0) {
                let checkSubSections = this.recursivecheckSubData(categoriesList[i].subAuditCategories, deletedCategoryId);
                if (checkSubSections != null && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
    }

    recursivecheckSubData(childList, deletedCategoryId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].auditCategoryId == deletedCategoryId) {
                return childList[i].subAuditCategories;
            }
            else if (childList[i].subAuditCategories && childList[i].subAuditCategories.length > 0) {
                let checkSubSections = this.recursivecheckSubData(childList[i].subAuditCategories, deletedCategoryId);
                if (checkSubSections != null && checkSubSections != undefined)
                    return checkSubSections;
            }
        }
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