import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { Subject } from 'rxjs';
import { ProjectManagementService } from '../../services/project-management.service';
import { ProjectType } from '../../models/projects/projectType';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-fm-component-project-type',
    templateUrl: `project-type.component.html`

})

export class ProjectTypeComponent extends CustomAppBaseComponent implements OnInit {
    softLabels: SoftLabelConfigurationModel[];
    @Input() isForDialog?: boolean = false;
    @ViewChildren("upsertProjectTypePopUp") upsertProjectTypePopover;
    @ViewChildren("deleteProjectTypePopUp") deleteProjectTypePopover;
    @ViewChildren("unarchiveProjectTypePopUp") unarchiveProjectTypePopover;
    isEdit: boolean = false;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    projectTypeForm: FormGroup;
    isThereAnError: boolean = false;
    isFiltersVisible: boolean = false;
    isAnyOperationIsInprogress: boolean = true;
    public isArchived: boolean = false;
    projectTypes: any;
    projectTypeId: string;
    projectTypeName: string;
    isProjectTypeArchived: boolean = false;
    toastr: any;
    projectType: ProjectType;
    validationMessage: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    public ngDestroyed$ = new Subject();

    constructor(private projectManagementService: ProjectManagementService, private snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef, translateService: TranslateService) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSoftLabels();
        this.getAllProjectTypes();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getAllProjectTypes() {
        this.isAnyOperationIsInprogress = true;

        var projectType = new ProjectType();
        projectType.isArchived = this.isArchived;

        this.projectManagementService.GetAllProjectTypes(projectType).subscribe((response: any) => {
            if (response.success == true) {
                this.projectTypes = response.data;
                this.temp = this.projectTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    createProjectType(upsertProjectTypePopUp) {
        this.isEdit = false;
        upsertProjectTypePopUp.openPopover();
    }

    editProjectType(row, upsertProjectTypePopUp) {
        this.isEdit = true;
        this.projectTypeForm.patchValue(row);
        this.projectTypeId = row.projectTypeId;
        this.timeStamp = row.timeStamp;
        upsertProjectTypePopUp.openPopover();
    }

    deleteProjectTypePopUpOpen(row, deleteProjectTypePopUp) {
        this.projectTypeId = row.projectTypeId;
        this.timeStamp = row.timeStamp;
        this.projectTypeName = row.projectTypeName;
        this.isProjectTypeArchived = true;
        deleteProjectTypePopUp.openPopover();
    }

    unarchiveProjectTypePopUpOpen(row, unarchiveProjectTypePopUp) {
        this.projectTypeId = row.projectTypeId;
        this.projectTypeName = row.projectTypeName;
        this.timeStamp = row.timeStamp;
        this.isProjectTypeArchived = false;
        unarchiveProjectTypePopUp.openPopover();
    }

    closeUpsertProjectTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertProjectTypePopover.forEach((p) => p.closePopover());
    }

    closeDeleteProjectTypeDialog() {
        this.clearForm();
        this.deleteProjectTypePopover.forEach((p) => p.closePopover());
    }

    closeUnarchiveProjectTypeDialog() {
        this.clearForm();
        this.unarchiveProjectTypePopover.forEach((p) => p.closePopover());
    }

    upsertProjectType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.projectType = this.projectTypeForm.value;
        this.projectType.projectTypeId = this.projectTypeId;
        this.projectType.timeStamp = this.timeStamp;

        this.projectManagementService.upsertProjectType(this.projectType).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertProjectTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllProjectTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteProjectType() {
        this.isAnyOperationIsInprogress = true;

        this.projectType = new ProjectType();
        this.projectType.projectTypeId = this.projectTypeId;
        this.projectType.projectTypeName = this.projectTypeName;
        this.projectType.isArchived = this.isProjectTypeArchived;
        this.projectType.timeStamp = this.timeStamp;

        this.projectManagementService.upsertProjectType(this.projectType).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.clearForm();
                this.getAllProjectTypes();
                if (this.isArchived) {
                    this.unarchiveProjectTypePopover.forEach((p) => p.closePopover());
                    this.snackbar.open("Project type unarchived successfully.", "ok", {
                        duration: 3000
                    });
                }
                else {
                    this.deleteProjectTypePopover.forEach((p) => p.closePopover());
                    this.snackbar.open("Project type archived successfully.", "ok", {
                        duration: 3000
                    });
                }
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    clearForm() {
        this.projectTypeName = null;
        this.projectTypeId = null;
        this.projectType = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.projectTypeForm = new FormGroup({
            projectTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.ProjectNameMaxLength250)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(projectType => (projectType.projectTypeName.toLowerCase().indexOf(this.searchText) > -1) || (projectType.projectsCount.toString().indexOf(this.searchText) > -1));
        this.projectTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
