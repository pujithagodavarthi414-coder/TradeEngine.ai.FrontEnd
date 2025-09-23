import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import * as auditModuleReducer from "../store/reducers/index";

import { AuditCategory } from "../models/audit-category.model";
import { LoadAuditCategoryTriggered, AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { QuestionModel } from "../models/question.model";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';

@Component({
    selector: "audit-category-operations",
    templateUrl: "./audit-category-operations.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditCategoryOperationsComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('addCategoryPopover') addCategoriesPopover;
    @ViewChildren('editCategoryPopover') editCategoriesPopover;
    @ViewChildren('deleteCategoryPopover') deleteCategoriesPopover;

    @ViewChild("categoryName") categoryNameStatus: ElementRef;

    @Output() selectedAuditCategoryData = new EventEmitter<any>();
    @Output() changeTreeStructre = new EventEmitter<any>();
    @Output() deletedCategoryId = new EventEmitter<any>();

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data) {
            this.selectedAudit = data;
            if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
        }
    }

    @Input("auditCategory")
    set _auditCategory(data: any) {
        if (data) {
            this.auditCategory = data;
            this.questions$ = this.store.pipe(select(auditModuleReducer.getHierarchicalQuestionsFilterByCategoryId, { auditCategoryId: this.auditCategory.auditCategoryId }));
            this.questions$.subscribe(result => {
                this.questionsCount = result.length;
                this.cdRef.markForCheck();
            });
            if (this.auditCategory.subAuditCategories && this.auditCategory.subAuditCategories.length != 0)
                this.isChildsPresent = true;
            else
                this.isChildsPresent = false;
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
            if (categoryId == this.auditCategory.auditCategoryId) {
                this.isCategorySelectedOrNot = true;
                this.selectedCategoryId = this.auditCategory.auditCategoryId;
                localStorage.setItem("selectedCategoryId", this.selectedCategoryId);
            }
            else {
                this.isCategorySelectedOrNot = false;
                this.selectedCategoryId = null;
            }
        }
    }

    questions$: Observable<QuestionModel[]>;

    public ngDestroyed$ = new Subject();

    selectedAudit: any;
    auditCategory: any;

    selectedCategoryId: string;

    questionsCount: number = 0;

    isChildsPresent: boolean = false;
    treeStructure: boolean = false;
    showTitleTooltip: boolean = false;
    isEditCategory: boolean = false;
    loadCategory: boolean = false;
    isAuditArchived: boolean = false;
    disableCategoryDelete: boolean = false;
    isCategorySelectedOrNot: boolean = false;
    categoryCollapse: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService, private translateService: TranslateService, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted),
                tap(() => {
                    this.closeDeleteCategoryDialog();
                    this.disableCategoryDelete = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryDelete),
                tap(() => {
                    this.closeDeleteCategoryDialog();
                    this.disableCategoryDelete = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.AuditCategoryFailed),
                tap(() => {
                    this.disableCategoryDelete = false;
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    openCategoryPopOver(addCategoryPopover) {
        this.isEditCategory = false;
        this.loadCategory = true;
        addCategoryPopover.openPopover();
    }

    editAuditCategory(editCategoryPopover) {
        this.isEditCategory = true;
        this.loadCategory = true;
        editCategoryPopover.openPopover();
    }

    closeCategoryDialog() {
        this.loadCategory = false;
        this.addCategoriesPopover.forEach((p) => p.closePopover());
        this.editCategoriesPopover.forEach((p) => p.closePopover());
    }

    openDeleteCategoryPopOver(deleteCategoryPopover) {
        deleteCategoryPopover.openPopover();
    }

    removeCategory() {
        if (this.questionsCount > 0) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionsCount));
        }
        else {
            this.disableCategoryDelete = true;
            let auditCategoryModel = new AuditCategory();
            auditCategoryModel = Object.assign({}, this.auditCategory);
            auditCategoryModel.auditId = this.selectedAudit.auditId;
            auditCategoryModel.isArchived = true;
            this.store.dispatch(new LoadAuditCategoryTriggered(auditCategoryModel));
            this.deletedCategoryId.emit(this.auditCategory.auditCategoryId);
        }
    }

    closeDeleteCategoryDialog() {
        this.disableCategoryDelete = false;
        this.deleteCategoriesPopover.forEach((p) => p.closePopover());
    }

    getAuditQuestions() {
        this.selectedAuditCategoryData.emit(this.auditCategory);
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

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}