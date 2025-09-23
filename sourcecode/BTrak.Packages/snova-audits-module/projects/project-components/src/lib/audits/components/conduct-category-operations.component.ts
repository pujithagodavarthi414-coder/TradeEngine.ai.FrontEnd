import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

// import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
// import { AuditCategory } from "../models/audit-category.model";
// import { LoadAuditCategoryTriggered, AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";

@Component({
    selector: "conduct-category-operations",
    templateUrl: "./conduct-category-operations.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductCategoryOperationsComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("categoryName") categoryNameStatus: ElementRef;

    @Output() selectedConductCategoryData = new EventEmitter<any>();
    @Output() changeTreeStructre = new EventEmitter<any>();
    @Output() deletedCategoryId = new EventEmitter<any>();

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isConductArchived = false;
            else
                this.isConductArchived = true;
            if (this.selectedConduct.isRAG == null || this.selectedConduct.isRAG == false) {
                this.isRAG = false;
                this.inBoundPercent = null;
                this.outBoundPercent = null;
            }
            else {
                this.isRAG = true;
                this.inBoundPercent = data.inBoundPercent;
                this.outBoundPercent = data.outBoundPercent;
            }
        }
    }

    @Input("conductCategory")
    set _conductCategory(data: any) {
        if (data) {
            this.conductCategory = data;
            if (this.conductCategory.subAuditCategories && this.conductCategory.subAuditCategories.length != 0)
                this.isChildsPresent = true;
            else
                this.isChildsPresent = false;
            if (this.isRAG)
                this.checkCompliancePercent(data);
        }
    }

    @Input("categoryCollapse")
    set _categoryCollapse(data: boolean) {
        if (data || data == false) {
            this.treeStructure = data;
        }
    }

    @Input("categorySelected")
    set _categorySelected(data: any) {
        if (data) {
            let categoryId = data.auditCategoryId;
            if (categoryId == this.conductCategory.auditCategoryId) {
                this.isCategorySelectedOrNot = true;
                this.selectedCategoryId = this.conductCategory.auditCategoryId;
                localStorage.setItem("selectedCategoryId", this.selectedCategoryId);
            }
            else {
                this.isCategorySelectedOrNot = false;
                this.selectedCategoryId = null;
            }
        }
    }

    @Input("categoryDataForAnswer")
    set _categoryDataForAnswer(data: any) {
        if (data) {
            this.categoryDataForAnswer = data;
            if (data.auditCategoryId == this.conductCategory.auditCategoryId && this.isRAG)
                this.checkCompliancePercent(data);
        }
    }

    public ngDestroyed$ = new Subject();

    selectedConduct: any;
    conductCategory: any;
    categoryDataForAnswer: any;
    inBoundPercent: any;
    outBoundPercent: any;
    compliancePercent: any;

    validCount: number = 0;
    answeredCount: number = 0;

    selectedCategoryId: string;

    isRAG: boolean = false;
    isRed: boolean = false;
    isAmber: boolean = false;
    isGreen: boolean = false;
    noneAnswered: boolean = false;
    isChildsPresent: boolean = false;
    treeStructure: boolean = false;
    showTitleTooltip: boolean = false;
    isEditCategory: boolean = false;
    loadCategory: boolean = false;
    isConductArchived: boolean = false;
    disableCategoryDelete: boolean = false;
    isCategorySelectedOrNot: boolean = false;
    categoryCollapse: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    checkCompliancePercent(data) {
        if (this.conductCategory.subAuditCategories && this.conductCategory.subAuditCategories.length != 0)
            this.checkCompliance(this.conductCategory.subAuditCategories);
        let quesCount = data.questionsCount;
        let answCount = this.answeredCount + data.answeredCount;
        let unAnswCount = quesCount - answCount;
        let validCount = this.validCount + data.validAnswersCount;
        let inValidCount = answCount - validCount;
        let percent = (validCount / answCount) * 100;
        this.compliancePercent = percent.toFixed(2);
        if (answCount == 0) {
            this.noneAnswered = true;
            this.cdRef.markForCheck();
        }
        else {
            this.noneAnswered = false;
            this.cdRef.markForCheck();
        }
        if (percent <= this.inBoundPercent) {
            this.isRed = true;
            this.isAmber = false;
            this.isGreen = false;
            this.cdRef.markForCheck();
        }
        else if (percent > this.inBoundPercent && percent < this.outBoundPercent) {
            this.isRed = false;
            this.isAmber = true;
            this.isGreen = false;
            this.cdRef.markForCheck();
        }
        else if (percent >= this.outBoundPercent) {
            this.isRed = false;
            this.isAmber = false;
            this.isGreen = true;
            this.cdRef.markForCheck();
        }
    }

    getConductQuestions() {
        this.selectedConductCategoryData.emit(this.conductCategory);
    }

    showTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(false);
    }

    hideTreeView() {
        this.treeStructure = !this.treeStructure;
        this.changeTreeStructre.emit(true);
    }

    treeView() {
        this.treeStructure = !this.treeStructure;
        if (this.treeStructure)
            this.changeTreeStructre.emit(false);
        else
            this.changeTreeStructre.emit(true);
        // this.changeTreeStructre.emit(this.treeStructure);
    }

    checkTitleTooltipStatus() {
        if (this.categoryNameStatus.nativeElement.scrollWidth > this.categoryNameStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        }
        else {
            this.showTitleTooltip = false;
        }
    }

    checkCompliance(categoriesList) {
        // this.validCount = this.validCount + this.conductCategory.validAnswersCount;
        for (let i = 0; i < categoriesList.length; i++) {
            this.validCount = this.validCount + categoriesList[i].validAnswersCount;
            this.answeredCount = this.answeredCount + categoriesList[i].answeredCount;
            this.cdRef.markForCheck();
            if (categoriesList[i].subAuditCategories && categoriesList[i].subAuditCategories.length > 0) {
                this.recursiveCheckCompliance(categoriesList[i].subAuditCategories);
            }
        }
    }

    recursiveCheckCompliance(childList) {
        for (let i = 0; i < childList.length; i++) {
            this.validCount = this.validCount + childList[i].validAnswersCount;
            this.answeredCount = this.answeredCount + childList[i].answeredCount;
            this.cdRef.markForCheck();
            if (childList[i].subAuditCategories && childList[i].subAuditCategories.length > 0) {
                this.recursiveCheckCompliance(childList[i].subAuditCategories);
            }
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}