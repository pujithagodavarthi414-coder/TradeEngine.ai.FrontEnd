import { Component, Input, ChangeDetectorRef, ViewChildren, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { WorkFlowTriggerService } from "../../snovasys-projects/services/workflow-trigger.service";

import { WorkflowTrigger } from '../../snovasys-projects/models/workflow-trigger.model';
import { MatDialog } from '@angular/material/dialog';
import { WorkFlowTriggerDialogComponent } from './workflow-trigger-dialog.component';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../models/softlabels-models';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ProjectService } from '../../snovasys-projects/services/projects.service';
import { Store, select } from '@ngrx/store';
import { State } from "../../snovasys-projects/store/reducers/index";
import * as projectModuleReducers from "../../snovasys-projects/store/reducers/index"
import { CreateProjectTriggered, EditProjectTriggered, ProjectActionTypes } from '../../snovasys-projects/store/actions/project.actions';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { CustomAppBaseComponent } from './componentbase';
import { Project } from '../../snovasys-projects/models/project';
@Component({
    selector: 'workflow-triggger',
    templateUrl: './workflow-trigger.component.html'
})

export class WorkFlowTriggerComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren('deleteWorkflowTriggerPopover') deleteWorkflowTriggersPopover;
    @ViewChildren("projectSettingsPopUp") projectSettingsPopOver;
    @Input("referenceId")
    set _referenceId(data: string) {
        if (data) {
            this.referenceId = data;
            this.getWorkflowTriggersByReferenceId(this.referenceId);
        }
    }

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        if (data) {
            this.referenceTypeId = data;
        }
    }

    title = 'Angular/BPMN';
    modeler;
    project: Project;
    fileToUpload: File = null;
    projectsList: any[] = [];
    workflowTriggerId: string;
    workflowId: string;
    workflowTypeId: string;
    workFlowName: string;
    referenceId: string;
    anyOperationInProgress$: Observable<boolean>
    referenceTypeId: string;
    isLoading: boolean;
    isLabelKey: string;
    validationMessage: string;
    triggerType: string;
    projectId: string;
    currentLabelKey: string;
    currentLabelResult: boolean;
    searchText: string;
    isDateTimeConfiguration: boolean;
    isSprintsConfiguration: boolean;
    workFlowType: any;
    softLabels: SoftLabelConfigurationModel[];
    triggerItems = [];
    workFlowItems = [];
    isThereAnError: boolean;
    filterConfigurations = [];
    deleteTriggerModel: WorkflowTrigger;
    workflowEdit: boolean = false;
    disableWorkFlow: boolean = false;
    triggerError: boolean = false;
    workFlowError: boolean = false;
    workFlowNameError: boolean = false;
    workFlowNameSizeError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    disableDeleteWorkflowTrigger: boolean = false;
    workflowXml: any;
    isSprintsEnable: boolean;
    public ngDestroyed$ = new Subject();

    constructor(private workFlowTriggerService: WorkFlowTriggerService, private toastr: ToastrService, private dialog: MatDialog, private cdRef: ChangeDetectorRef, private route: ActivatedRoute, private projectService: ProjectService,
        private store: Store<State>, private actionUpdates$: Actions, ) {

        super();
        this.getCompanySettings();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ProjectActionTypes.EditProjectsCompleted),
                tap((projects: any) => {
                    this.project = projects.project;
                    this.isDateTimeConfiguration = this.project.isDateTimeConfiguration;
                    this.isSprintsConfiguration = this.project.isSprintsConfiguration;
                    this.projectsList = [
                        {
                            name: 'Is Date time configuration',
                            value: this.isDateTimeConfiguration
                        },
                        {
                            name: 'Enable agile view',
                            value: this.isSprintsConfiguration
                        }
                    ]
                    if (!this.isSprintsEnable) {
                        this.projectsList = this.projectsList.filter(items => items.name != 'Enable agile view');
                    }
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
        this.route.params.subscribe((params) => {
            this.projectId = params["id"];
            this.getProjectById();
        })
        this.getSoftLabelConfigurations();
        this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.createProjectLoading))
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getCompanySettings() {
        let companySettingsModel: any[] = [];
        companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
        if (companySettingsModel && companySettingsModel.length > 0) {
            let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
            if (companyResult.length > 0) {
                this.isSprintsEnable = companyResult[0].value == "1" ? true : false;
            }
        }
    }

    getProjectById() {
        this.isLoading = true;
        this.projectService.GetProjectById(this.projectId).subscribe((x: any) => {
            this.isLoading = false;
            if (x.success) {
                this.project = x.data;
                this.isDateTimeConfiguration = this.project.isDateTimeConfiguration;
                this.isSprintsConfiguration = this.project.isSprintsConfiguration;
                this.projectsList = [
                    {
                        name: 'Is Date time configuration',
                        value: this.isDateTimeConfiguration
                    },
                    {
                        name: 'Enable agile view',
                        value: this.isSprintsConfiguration
                    }
                ]
                if (!this.isSprintsEnable) {
                    this.projectsList = this.projectsList.filter(items => items.name != 'Enable agile view');
                }
                this.cdRef.detectChanges();
            }
        })
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    editProjectSettingsPopUp(row, popUp) {
        this.isLabelKey = row.name;
        if (this.isLabelKey.includes("Is Date time")) {
            this.currentLabelKey = "datetime";
            this.currentLabelResult = row.value;
        } else {
            this.currentLabelKey = "sprints";
            this.currentLabelResult = row.value;
        }
        this.cdRef.detectChanges();
        popUp.openPopover();
    }


    getWorkflowTriggersByReferenceId(referenceId) {
        this.isAnyOperationIsInprogress = true;
        let triggerModel = new WorkflowTrigger();
        triggerModel.referenceId = referenceId;
        triggerModel.isArchived = false;
        this.workFlowTriggerService.getWorkflowsByReferenceId(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.isAnyOperationIsInprogress = false;
                this.workFlowItems = responseData.data;
                this.filterConfigurations = responseData.data;
                this.cdRef.markForCheck();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    addWorkflowTrigger() {
        const dialogRef = this.dialog.open(WorkFlowTriggerDialogComponent, {
            height: "84%",
            width: "90%",
            direction: 'ltr',
            data: { workflowEdit: false, workflowTriggerId: null, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId, triggerId: null, workflowId: null, workflowName: null, workflowXml: null },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            }
            this.cdRef.markForCheck();
        });
    }

    editWorkflowTrigger(row) {
        const dialogRef = this.dialog.open(WorkFlowTriggerDialogComponent, {
            height: "84%",
            width: "90%",
            direction: 'ltr',
            data: { workflowEdit: true, workflowTriggerId: row.workflowTriggerId, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId, triggerId: row.triggerId, workflowId: row.workflowId, workflowName: row.workflowName, workflowXml: row.workflowXml },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            }
            this.cdRef.markForCheck();
        });
    }

    deleteWorkFlowTrigger(row, deleteWorkflowTriggerPopover) {
        deleteWorkflowTriggerPopover.openPopover();
        this.deleteTriggerModel = new WorkflowTrigger();
        this.deleteTriggerModel.workflowTriggerId = row.workflowTriggerId;
        this.deleteTriggerModel.referenceId = row.referenceId;
        this.deleteTriggerModel.referenceTypeId = row.referenceTypeId;
        this.deleteTriggerModel.triggerId = row.triggerId;
        this.deleteTriggerModel.triggerName = row.triggerName;
        this.deleteTriggerModel.workflowId = row.workflowId;
        this.deleteTriggerModel.workflowName = row.workflowName;
        this.deleteTriggerModel.workflowXml = row.workflowXml;
        this.deleteTriggerModel.isArchived = true;
    }

    removeWorkflowTrigger() {
        this.disableDeleteWorkflowTrigger = true;
        this.workFlowTriggerService.upsertWorkflowTrigger(this.deleteTriggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.disableDeleteWorkflowTrigger = false;
                this.closeDeleteWorkflowTriggerPopup();
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            } else {
                this.disableDeleteWorkflowTrigger = false;
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    closeSearch() {
        this.filterByName(null);
    }

    closeDeleteWorkflowTriggerPopup() {
        this.deleteWorkflowTriggersPopover.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        let temp = this.filterConfigurations.filter(config => config.triggerName.toLowerCase().indexOf(this.searchText) > -1 ||
            config.workflowName.toLowerCase().indexOf(this.searchText) > -1);
        this.workFlowItems = temp;
    }



    sprintsConfiguration(event) {
        if (this.currentLabelKey.includes("datetime")) {
            this.isDateTimeConfiguration = event.checked;
        } else {
            this.isSprintsConfiguration = event.checked;
        }
    }

    saveProjectDetails() {
        this.isLoading = true;
        this.project.timeZoneOffSet = (-(new Date(this.project.projectStartDate).getTimezoneOffset()));
        this.project.isSprintsConfiguration = this.isSprintsConfiguration;
        this.project.isDateTimeConfiguration = this.isDateTimeConfiguration;
        this.projectService.upsertProject(this.project).subscribe((x: any) => {
            this.isLoading = false;
            this.cdRef.detectChanges();
            if (x.success) {
                this.closeUpsertCompanySettingPopup();
                this.store.dispatch(new EditProjectTriggered(this.projectId));
            } else {
                this.toastr.error("", x.apiResponseMessages[0].message)
            }
        })
    }

    closeUpsertCompanySettingPopup() {
        this.projectSettingsPopOver.forEach((p) => p.closePopover());
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}