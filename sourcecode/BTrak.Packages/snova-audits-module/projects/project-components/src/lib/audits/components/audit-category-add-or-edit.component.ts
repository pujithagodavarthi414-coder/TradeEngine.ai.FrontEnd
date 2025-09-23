import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from "@angular/forms";

import * as auditModuleReducer from "../store/reducers/index";
import { AuditCategoryActionTypes, LoadAuditCategoryByIdTriggered, LoadAuditCategoryTriggered } from "../store/actions/audit-categories.actions";
import { AuditCategory } from "../models/audit-category.model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';

@Component({
    selector: "audit-category-add-or-edit",
    templateUrl: "./audit-category-add-or-edit.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditCategoryAddOrEditComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() closeCategory = new EventEmitter<any>();

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data)
            this.selectedAudit = data;
    }

    @Input("auditCategory")
    set _auditCategory(data: any) {
        if (data) {
            this.auditCategory = data;
        }
        else {
            this.auditCategory = null;
        }
    }

    @Input("isCategoryEdit")
    set _isCategoryEdit(data: any) {
        if (data || data == false) {
            this.isCategoryEdit = data;
            this.initializeCategoryForm();
            if (this.isCategoryEdit) {
                this.categoryForm.patchValue(this.auditCategory);
            }
            else {
                let value = (this.auditCategory != null && this.auditCategory != undefined) ? this.auditCategory.auditCategoryId : null;
                this.categoryForm.get('parentAuditCategoryId').setValue(value);
            }
        }
        else {
            this.isCategoryEdit = false;
            this.initializeCategoryForm();
            let value = (this.auditCategory != null && this.auditCategory != undefined) ? this.auditCategory.auditCategoryId : null;
            this.categoryForm.get('parentAuditCategoryId').setValue(value);
        }
    }

    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
       // powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    categoryForm: FormGroup;

    selectedAudit: any;
    auditCategory: any;

    disableCategory: boolean = false;
    isCategoryEdit: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();

        this.initializeCategoryForm();

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditCategoryLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryListCompleted),
                tap(() => {
                    this.closeAuditCategoryDialog();
                    this.disableCategory = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted),
                tap(() => {
                    this.closeAuditCategoryDialog();
                    this.disableCategory = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditCategoryActionTypes.AuditCategoryFailed),
                tap(() => {
                    this.disableCategory = false;
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    upsertCategory() {
        this.disableCategory = true;
        let auditCategoryModel = new AuditCategory();
        auditCategoryModel = this.categoryForm.value;
        auditCategoryModel.auditId = this.selectedAudit.auditId;
        this.store.dispatch(new LoadAuditCategoryTriggered(auditCategoryModel));
    }

    closeAuditCategoryDialog() {
        this.closeCategory.emit('');
    }

    checkValidation(event) {
        this.categoryForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    initializeCategoryForm() {
        this.categoryForm = new FormGroup({
            auditId: new FormControl(null, []),
            auditCategoryId: new FormControl(null, []),
            parentAuditCategoryId: new FormControl(null, []),
            auditCategoryName: new FormControl(null, Validators.compose([Validators.maxLength(150), Validators.required])),
            auditCategoryDescription: new FormControl(null, Validators.compose([Validators.maxLength(807)])),
            viewAuditCategoryDescription: new FormControl(false, []),
            timeStamp: new FormControl(null, []),
            isArchived: new FormControl(false, [])
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}