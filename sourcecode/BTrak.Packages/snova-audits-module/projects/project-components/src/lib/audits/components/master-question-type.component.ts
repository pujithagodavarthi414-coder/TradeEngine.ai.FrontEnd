import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, Input, EventEmitter, ViewChildren } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { State as KendoState } from "@progress/kendo-data-query";
import { FormControl, Validators, FormGroup } from "@angular/forms";

// import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { DashboardFilterModel } from "../dependencies/models/dashboardFilterModel";
import { QuestionType } from "../models/question-type.model";
import { AuditService } from "../services/audits.service";
import { ToastrService } from "ngx-toastr";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
// import { UpsertQuestionTypeDialogComponent } from "./upsert-question-type-dialog.component";

@Component({
    selector: "master-question-type",
    templateUrl: "./master-question-type.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MasterQuestionTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteQuestionTypePopover") deleteQuestionTypesPopover;
    @ViewChildren("upsertQuestionTypePopover") upsertQuestionTypesPopover;

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
            this.dashboardName = "Master question type";
        }
    }
    roleFeaturesIsInProgress$: Observable<boolean>;

    questionTypeList = [];
    masterQuestionTypeList = [];

    masterQuestionTypeForm: FormGroup;

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
    isEditMasterType: boolean = false;
    showFilters: boolean = false;
    isArchived: boolean = false;
    anyOperationIsInprogress: boolean = false;
    disableMasterType: boolean = false;
    deleteOperationIsInprogress: boolean = false;

    state: KendoState = {
        skip: 0,
        take: 10,
    };
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private auditService: AuditService, private toastr: ToastrService, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.loadMasterQuestionTypes();
        this.initializeMasterQuestionTypeForm();
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
        model.searchText = this.searchText;
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

    searchByInput(event, text) {
        if (event.keyCode == 13) {
            this.searchText = (text != null) ? text.trim() : null;
            this.loadMasterQuestionTypes();
        }
    }

    changeArchiveMasterQuestionTypes(value) {
        this.isArchived = value;
        this.loadMasterQuestionTypes();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.loadMasterQuestionTypes();
    }

    closeSearch() {
        this.searchText = null;
        this.loadMasterQuestionTypes();
    }

    addMasterQuestionType(upsertQuestionTypePopover) {
        this.isEditMasterType = false;
        this.initializeMasterQuestionTypeForm();
        upsertQuestionTypePopover.openPopover();
    }

    editMasterQuestionType(upsertQuestionTypePopover, dataItem) {
        this.isEditMasterType = true;
        this.initializeMasterQuestionTypeForm();
        this.masterQuestionTypeForm.patchValue(dataItem);
        upsertQuestionTypePopover.openPopover();
    }

    addOrEditAudit() {
        this.disableMasterType = true;
        let masterTypeModel = new QuestionType();
        masterTypeModel = this.masterQuestionTypeForm.value;
        this.auditService.upsertMasterQuestionType(masterTypeModel).subscribe((result: any) => {
            if (result.success) {
                this.disableMasterType = false;
                this.loadMasterQuestionTypes();
                this.closeMasterTypeDialog();
                this.cdRef.markForCheck();
            }
            else {
                this.disableMasterType = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.deleteOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    closeMasterTypeDialog() {
        this.disableMasterType = false;
        this.upsertQuestionTypesPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }

    deleteQuestionTypeItem(data, deletePopover) {
        this.deleteQuestionTypeDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeQuestionTypeAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let questionTypeModel = new QuestionType();
        questionTypeModel = Object.assign({}, this.deleteQuestionTypeDetails);
        questionTypeModel.isArchived = value;
        this.auditService.upsertMasterQuestionType(questionTypeModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteQuestionTypeDetails = null;
                this.deleteOperationIsInprogress = false;
                this.loadMasterQuestionTypes();
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

    closeDeleteQuestionTypeDialog() {
        this.deleteQuestionTypeDetails = null;
        this.deleteQuestionTypesPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }

    initializeMasterQuestionTypeForm() {
        this.masterQuestionTypeForm = new FormGroup({
            masterQuestionTypeId: new FormControl("", []),
            masterQuestionTypeName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
            masterQuestionTypeDescription: new FormControl(null, []),
            timeStamp: new FormControl(null, [])
        });
    }

    upsertMasterQuestionType() {

    }
}