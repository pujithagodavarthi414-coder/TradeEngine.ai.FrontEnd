import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { State as KendoState } from "@progress/kendo-data-query";
import { TranslateService } from "@ngx-translate/core";

// import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";

import { ConstantVariables } from "../dependencies/constants/constant-variables";
import { DashboardFilterModel } from "../dependencies/Models/dashboardFilterModel";
import { QuestionType } from "../models/question-type.model";
import { AuditService } from "../services/audits.service";
import { ToastrService } from "ngx-toastr";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { UpsertQuestionTypeDialogComponent } from "./upsert-question-type-dialog.component";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "question-type",
    templateUrl: "./question-type.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteQuestionTypePopover") deleteQuestionTypesPopover;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Question type";
        }
    }
    roleFeaturesIsInProgress$: Observable<boolean>;

    questionTypeList = [];
    masterQuestionTypeList = [];

    questionTypeDetails: any;
    deleteQuestionTypeDetails: any;
    take: number = 10;
    kendoRowIndex: number;
    validationMessage: string;
    searchText: string;
    sortBy: string;
    dashboardId: string;
    dashboardName: string;
    workspaceDashboardFilterId: string;
    sortDirection: boolean;
    isEditQuestionType: boolean = false;
    showFilters: boolean = false;
    isArchived: boolean = false;
    anyOperationIsInprogress: boolean = false;
    deleteOperationIsInprogress: boolean = false;

    state: KendoState = {
        skip: 0,
        take: 10,
    };
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private store: Store<State>, private translateService: TranslateService, private actionUpdates$: Actions, private auditService: AuditService, private toastr: ToastrService, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.loadMasterQuestionTypes();
        this.searchQuestionTypes();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
        // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
    }

    loadMasterQuestionTypes() {
        let model = new QuestionType();
        model.isArchived = false;
        this.auditService.searchMasterQuestionTypes(model).subscribe((result: any) => {
            if (result.success) {
                this.masterQuestionTypeList = result.data;
                this.auditService.assignMasterData(this.masterQuestionTypeList);
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    searchQuestionTypes() {
        this.anyOperationIsInprogress = true;
        let questionTypeModel = new QuestionType();
        questionTypeModel.sortBy = this.sortBy;
        questionTypeModel.sortDirectionAsc = this.sortDirection;
        questionTypeModel.searchText = this.searchText != null ? this.searchText.trim() : null;
        questionTypeModel.pageSize = this.state.take;
        questionTypeModel.pageNumber = (this.state.skip / this.state.take) + 1;
        questionTypeModel.isArchived = this.isArchived;
        this.auditService.searchQuestionTypes(questionTypeModel).subscribe((result: any) => {
            if (result.success) {
                this.questionTypeList = result.data;
                this.auditService.assignQuestionTypeData(this.questionTypeList);
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    searchByInput(event, text) {
        if (event.keyCode == 13) {
            this.searchText = (text != null) ? text.trim() : null;
            this.searchQuestionTypes();
        }
    }

    changeArchiveQuestionTypes(value) {
        this.isArchived = value;
        this.searchQuestionTypes();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.searchQuestionTypes();
    }

    closeSearch() {
        this.searchText = null;
        this.searchQuestionTypes();
    }

    addQuestionType() {
        this.questionTypeDetails = null;
        this.isEditQuestionType = false;
        this.upsertQuestionType();
        this.cdRef.markForCheck();
    }

    editQuestionType(data) {
        this.questionTypeDetails = data;
        this.isEditQuestionType = true;
        this.upsertQuestionType();
        this.cdRef.markForCheck();
    }

    upsertQuestionType() {
        const dialogRef = this.dialog.open(UpsertQuestionTypeDialogComponent, {
            maxHeight: "75%",
            width: "70%",
            direction: 'ltr',
            data: { editQuestionType: this.isEditQuestionType, questionTypeDetails: this.questionTypeDetails },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            this.isEditQuestionType = false;
            this.questionTypeDetails = null;
            if (result.success)
                this.searchQuestionTypes();
        });
    }

    deleteQuestionTypeItem(data, deletePopover) {
        this.deleteQuestionTypeDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeQuestionTypeAtIndex(value) {
        if (this.deleteQuestionTypeDetails.canQuestionTypeDeleted) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionType));
        }
        else {
            this.deleteOperationIsInprogress = true;
            let questionTypeModel = new QuestionType();
            questionTypeModel = Object.assign({}, this.deleteQuestionTypeDetails);
            questionTypeModel.isArchived = value;
            this.auditService.upsertQuestionType(questionTypeModel).subscribe((result: any) => {
                if (result.success) {
                    this.deleteQuestionTypeDetails = null;
                    this.deleteOperationIsInprogress = false;
                    this.searchQuestionTypes();
                    this.closeDeleteQuestionTypeDialog();
                    this.cdRef.markForCheck();
                }
                else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.deleteOperationIsInprogress = false;
                    this.cdRef.markForCheck();
                }
            });
        }
    }

    closeDeleteQuestionTypeDialog() {
        this.deleteQuestionTypeDetails = null;
        this.deleteQuestionTypesPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }
}