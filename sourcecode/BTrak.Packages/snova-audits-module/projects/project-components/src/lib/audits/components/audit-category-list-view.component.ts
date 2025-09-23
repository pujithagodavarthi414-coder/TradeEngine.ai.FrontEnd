import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, ViewChildren, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as auditModuleReducer from "../store/reducers/index";
import { AuditCategory } from "../models/audit-category.model";
import { LoadAuditCategoryListTriggered, AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { AuditActionTypes } from "../store/actions/audits.actions";
import { QuestionModel } from "../models/question.model";
import { LoadQuestionListTriggered } from "../store/actions/questions.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { DragulaService } from "ng2-dragula";
import { CategoryModel } from "../models/reorder-model";
import { AuditService } from "../services/audits.service";

@Component({
    selector: "audit-category-list-view",
    templateUrl: "./audit-category-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService]
})

export class AuditCategoryListViewComponent extends AppFeatureBaseComponent implements OnInit {
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

    @Input("loadAuditRelatedData")
    set _loadAuditRelatedData(data: boolean) {
        if (data || data == false) {
            this.loadAuditRelatedData = data;
        }
        else {
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
    subs = new Subscription();
    categories: any;
    constructor(private dragulaService: DragulaService, private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService) {
        super();

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditCategoryListLoading));
        dragulaService.createGroup("categories", {
            revertOnSpill: true
        // removeOnSpill: true
    });
        this.subs.add(this.dragulaService.drag("categories")
        .subscribe(({ el }) => {
            console.log(el);
        })
    );

this.subs.add(this.dragulaService.drop("categories")
    // .takeUntil(this.ngDestroyed$)
    .subscribe(({ name, el, target, source, sibling }) => {
        console.log(el, target);
        var orderedListLength = target.children.length;
        let orderedCaseList = [];
        for (var i = 0; i < orderedListLength; i++) {
            var catId = target.children[i].attributes["data-auditCategoryId"].value;
            orderedCaseList.push(catId.toLowerCase());
        }
        this.updateOrder(orderedCaseList);
    })
);
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
            this.cdRef.markForCheck();
        })
    ).subscribe();

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
        ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
        tap((result: any) => {
            if (result && result.searchAuditCategories) {
                this.categoryOccurance = this.categoryOccurance + 1;
                if (this.categoryOccurance > 1 && result.searchAuditCategories && result.searchAuditCategories.length > 0 && this.deletedCategoryId) {
                    let selCategoryId = localStorage.getItem("selectedCategoryId");
                    if (selCategoryId != this.deletedCategoryId) {
                        let sectionSub = this.checkSubData(this.auditCategoryList, this.deletedCategoryId);
                        if (sectionSub != undefined && sectionSub != null && sectionSub.length > 0) {
                            let checkRefresh = this.checkDeleteRefresh(sectionSub, selCategoryId);
                            if (checkRefresh && checkRefresh != undefined) {
                                this.auditCategoryList = result.searchAuditCategories;
                                this.selectedAuditCategoryData.emit(this.auditCategoryList[0]);
                            }
                        }
                    }
                    else if (selCategoryId == this.deletedCategoryId) {
                        this.auditCategoryList = result.searchAuditCategories;
                        this.selectedAuditCategoryData.emit(this.auditCategoryList[0]);
                    }
                }
                if (this.categoryOccurance <= 1 && result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                    this.auditCategoryList = result.searchAuditCategories;
                    this.isCategoriesPresent = true;
                    this.selectedAuditCategoryData.emit(this.auditCategoryList[0]);
                }
                if (result.searchAuditCategories && result.searchAuditCategories.length > 0) {
                    this.auditCategoryList = result.searchAuditCategories;
                    this.isCategoriesPresent = true;
                }
                else {
                    this.auditCategoryList = [];
                    this.isCategoriesPresent = false;
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

updateOrder(ids) {
    let model = new CategoryModel();
    model.categoryIds = ids;
    model.isAuditElseConduct = true;
    this.auditService.reOrderCategories(model)
        .subscribe(result => { this.dragulaService.find('categories').drake.cancel(true); })
}

onChangeCategoryFilter(value) {
    if (this.auditCategoryList && this.auditCategoryList.length > 0 && this.isAuditSelected) {
        localStorage.removeItem('selectedCategoryFilter');
        let selCategoryId = localStorage.getItem("selectedCategoryId");
        let questionSearch = new QuestionModel();
        questionSearch.auditCategoryId = selCategoryId;
        questionSearch.isArchived = false;
        if (value == '1') {
            questionSearch.isHierarchical = false;
            questionSearch.isFilter = false;
            this.hierarchicalQuestions.emit(false);
            this.store.dispatch(new LoadQuestionListTriggered(questionSearch));
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

openCategoryPopover(addCategoryPopover) {
    this.loadAuditCategory = true;
    addCategoryPopover.openPopover();
}

closeCategoryPopover() {
    this.loadAuditCategory = false;
    this.addCategoriesPopover.forEach((p) => p.closePopover());
}

loadAuditCategoryList(audit) {
    let auditCategoryModel = new AuditCategory();
    auditCategoryModel.auditId = audit.auditId;
    auditCategoryModel.isArchived = false;
    this.store.dispatch(new LoadAuditCategoryListTriggered(auditCategoryModel));
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

checkDeleteRefresh(categoriesList, deletedCategoryId) {
    for (let i = 0; i < categoriesList.length; i++) {
        if (categoriesList[i].auditCategoryId == deletedCategoryId) {
            return true;
        }
        else if (categoriesList[i].subAuditCategories && categoriesList[i].subAuditCategories.length > 0) {
            let checkDelete = this.recursivecheckDeleteRefresh(categoriesList[i].subAuditCategories, deletedCategoryId);
            if (checkDelete != null && checkDelete != undefined)
                return true;
        }
    }
}

recursivecheckDeleteRefresh(childList, deletedCategoryId) {
    for (let i = 0; i < childList.length; i++) {
        if (childList[i].auditCategoryId == deletedCategoryId) {
            return true;
        }
        else if (childList[i].subAuditCategories && childList[i].subAuditCategories.length > 0) {
            let checkDelete = this.recursivecheckDeleteRefresh(childList[i].subAuditCategories, deletedCategoryId);
            if (checkDelete != null && checkDelete != undefined)
                return true;
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
    this.dragulaService.destroy("categories");
}
}