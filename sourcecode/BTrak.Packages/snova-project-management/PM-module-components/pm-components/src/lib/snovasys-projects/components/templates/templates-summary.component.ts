import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, QueryList, ViewChildren, ViewChild, ChangeDetectorRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { Store, select } from "@ngrx/store";
import { TemplateModel } from "../../models/templates-model";

import * as projectModuleReducers from "../../store/reducers/index";
import { Observable, Subject } from "rxjs";
import { State } from "../../store/reducers/index";
import { InsertGoalTemplateTriggered, TemplateActionTypes, ArchiveTemplatesTriggered } from "../../store/actions/templates.action";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { MatMenuTrigger } from "@angular/material/menu";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-templates-summary",
    templateUrl: "templates-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TemplatesSummaryComponent implements OnInit {
    @Input('templateModel')
    set _templateModel(data: TemplateModel) {
        this.templateModel = data;
    }
    @Input('templateSelected')
    set _templateSelected(data: boolean) {
        this.templateSelected = data;
    }
    @ViewChild("templatePopover") templatePopUp: SatPopover;
    @ViewChild("editTemplatePopover") editTemplatePopUp: SatPopover;
    @ViewChild("deleteTemplatePopover") deleteTemplatePopUp: SatPopover;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    templateOperationInProgress$: Observable<boolean>;
    templateArchiveOperationInProgress$: Observable<boolean>;
    templateModel: TemplateModel;
    templateSelected: boolean;
    projectId: string;
    clearCreateForm: boolean;
    contextMenuPosition = { x: "0px", y: "0px" };
    panelOpenState: boolean = false;
    isEdit: boolean;
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions, private router: Router) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TemplateActionTypes.InsertGoalTemplateCompleted),
                tap(() => {
                    this.router.navigate([
                        "projects/projectstatus",
                        this.templateModel.projectId,
                        "active-goals"
                    ]);

                })
            )
            .subscribe();

            this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TemplateActionTypes.ArchiveTemplatesCompleted),
                tap(() => {
                  this.closeArchivePopup();
                })
            )
            .subscribe();
    }
    ngOnInit() {
        this.getSoftLabels();
        this.templateOperationInProgress$ = this.store.pipe(select(projectModuleReducers.insertGoalTemplateLoading));
        this.templateArchiveOperationInProgress$ = this.store.pipe(select(projectModuleReducers.deleteTemplateLoading));
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    makeTemplateGoal() {
        this.store.dispatch(new InsertGoalTemplateTriggered(this.templateModel.templateId));
    }

    deleteTemplate() {
        var templateModel = new TemplateModel();
        templateModel.templateId = this.templateModel.templateId;
        templateModel.timeStamp = this.templateModel.timeStamp;
        templateModel.isArchived = true;
        templateModel.projectId = this.templateModel.projectId;
        this.store.dispatch(new ArchiveTemplatesTriggered(templateModel));
    }

    openEditTemplate() {
        this.isEdit = !this.isEdit;
    }

    closeTemplatePopup() {
        this.templatePopUp.close();
        this.triggers.toArray()[0].closeMenu();
    }

    closeTemplateDialog() {
        this.isEdit = !this.isEdit;
        this.editTemplatePopUp.close();
        this.triggers.toArray()[0].closeMenu();
    }

    closeArchivePopup() {
        this.deleteTemplatePopUp.close();
        this.triggers.toArray()[0].closeMenu();
    }

    openContextMenu(event: MouseEvent) {
        event.preventDefault();
        const contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            console.log(event);
            this.contextMenuPosition.x = (event.clientX) + "px";
            this.contextMenuPosition.y = (event.clientY - 30) + "px";
            contextMenu.openMenu();
        }
    }
}