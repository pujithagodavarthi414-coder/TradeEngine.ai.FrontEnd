import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import * as auditModuleReducer from "../store/reducers/index";

import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { AuditCategoryActionTypes, LoadAuditCategoriesForConductsTriggered } from "../store/actions/audit-categories.actions";
import { AuditConductCategories } from "../models/conduct-question.model";
import { AuditCategory } from "../models/audit-category.model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";


@Component({
    selector: "audit-category-list-shift",
    templateUrl: "./audit-category-list-shift.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditCategoryListShiftComponent {
    @Output() selectedCategoryData = new EventEmitter<any>();
    @Output() selectedCategories = new EventEmitter<any>();
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
            if (this.auditCategoriesList != null && this.auditCategoriesList.length > 0) {
                this.categoriesData.emit(this.auditCategoriesList);
            }
        }
    }

    @Input("auditId")
    set _auditId(data: any) {
        if (data) {
            this.auditId = data;
            this.loadCategoriesList();
        }
    }

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    auditId: string;
    isCategoriesPresent: boolean = false;
    isCategoriesListPresent: boolean = false;
    auditCategoryList = [];;
    auditCategoriesList: any;
    selectAllNone: any;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getCategoriesForConductsLoading));
        this.getSoftLabelConfigurations();
        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsCompleted),
            tap((result: any) => {
                if (result && result.searchAuditCategories) {
                    this.auditCategoriesList = result.searchAuditCategories;
                    if (this.auditCategoriesList && this.auditCategoriesList != null && this.auditCategoriesList.length > 0) {
                        this.auditCategoryList = result.searchAuditCategories;
                        this.isCategoriesListPresent = true;
                        this.isCategoriesPresent = false;
                        this.selectedCategoryData.emit(this.auditCategoriesList[0]);
                    }
                    else {
                        this.isCategoriesListPresent = false;
                        this.isCategoriesPresent = true;
                        this.selectedCategoryData.emit('none');
                    }
                    this.auditCategoryList = result.searchAuditCategories;
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        //this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadCategoriesList() {
        let categoriesList = new AuditCategory();
        categoriesList.auditId = this.auditId;
        categoriesList.includeConductQuestions = false;
        this.store.dispatch(new LoadAuditCategoriesForConductsTriggered(categoriesList));
    }

    getSelectedCategoryData(data) {
        this.selectedCategoryData.emit(data);
        this.cdRef.detectChanges();
    }

    getSelectedCategoryId(data) {
        this.selectedCategories.emit(data);
        this.cdRef.detectChanges();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}