import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
// import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

// import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { CategoryModel } from "../models/reorder-model";

@Component({
    selector: "conduct-categories-view",
    templateUrl: "./conduct-categories-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductCategoriesViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() selectedConductCategoryData = new EventEmitter<any>();
    @Output() deletedCategoryId = new EventEmitter<any>();

    @Input() conductCategory: any;
    @Input() categorySelected: any;
    @Input() categoryDataForAnswer: any;

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data)
            this.selectedConduct = data;
    }

    @Input("categoryCollapse")
    set _categoryCollapse(data: boolean) {
        if (data || data == false) {
            this.categoryCollapse = data;
            if (data == false)
                this.changeView = true;
            else
                this.changeView = false;
        }
    }

    selectedConduct: any;
    subAuditCategories: any;
    changeView: boolean = false;
    categoryCollapse: boolean;
    constructor(private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getSelectedConductCategoryData(data) {
        this.selectedConductCategoryData.emit(data);
    }

    getStructure(value) {
        this.changeView = value;
        this.cdRef.detectChanges();
    }

    getDeletedCategoryId(value) {
        this.deletedCategoryId.emit(value);
    }

    public ngOnDestroy() {
    }
}