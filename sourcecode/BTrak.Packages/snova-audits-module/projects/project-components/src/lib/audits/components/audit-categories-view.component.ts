import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { DragulaService } from "ng2-dragula";
import { Observable, Subject, Subscription } from 'rxjs';
// import * as auditModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { CategoryModel } from "../models/reorder-model";
import { AuditService } from "../services/audits.service";

@Component({
    selector: "audit-categories-view",
    templateUrl: "./audit-categories-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DragulaService]
})

export class AuditCategoriesViewComponent extends AppFeatureBaseComponent implements OnInit {
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
    subAuditCategories: any;
    selectedAudit: any;

    changeView: boolean = false;
    categoryCollapse: boolean;
    subs = new Subscription();
    constructor(private dragulaService: DragulaService, private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService) {
        super();
        dragulaService.createGroup("subAuditCategories", {
            revertOnSpill: true
            // removeOnSpill: true
        });
        this.subs.add(this.dragulaService.drag("subAuditCategories")
            .subscribe(({ el }) => {
                console.log(el);
            })
        );

        this.subs.add(this.dragulaService.drop("subAuditCategories")
            // .takeUntil(this.ngDestroyed$)
            .subscribe(({ name, el, target, source, sibling }) => {
                console.log(el, target);
                var orderedListLength = target.children.length;
                let orderedCaseList = [];
                for (var i = 0; i < orderedListLength; i++) {
                    var catId = target.children[i].attributes["data-subAuditCategoryId"].value;
                    orderedCaseList.push(catId.toLowerCase());
                }
                this.updateOrder(orderedCaseList);
            })
        );
    }

    ngOnInit() {
        super.ngOnInit();
    }

    updateOrder(ids) {
        let model = new CategoryModel();
        model.categoryIds = ids;
        model.isAuditElseConduct = true;
        this.auditService.reOrderCategories(model)
            .subscribe(result => {
                this.dragulaService.find('subAuditCategories').drake.cancel(true);
            })
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

    public ngOnDestroy() {
        this.dragulaService.destroy("subAuditCategories");
    }
}