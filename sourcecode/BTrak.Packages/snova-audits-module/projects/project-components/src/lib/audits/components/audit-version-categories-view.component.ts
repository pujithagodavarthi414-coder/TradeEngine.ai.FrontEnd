import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';

// import * as auditModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';

@Component({
    selector: "audit-version-categories-view",
    templateUrl: "./audit-version-categories-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditVersionCategoriesViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() selectedAuditCategoryData = new EventEmitter<any>();
    @Output() deletedCategoryId = new EventEmitter<any>();

    @Input() auditCategory: any;

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data)
            this.selectedAudit = data;
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

    @Input() categorySelected: any;

    selectedAudit: any;

    changeView: boolean = false;
    categoryCollapse: boolean;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getSelectedAuditCategoryData(data) {
        this.selectedAuditCategoryData.emit(data);
    }

    getStructure(value) {
        this.changeView = value;
        this.cdRef.detectChanges();
    }

    getDeletedCategoryId(value) {
        this.deletedCategoryId.emit(value);
    }
}