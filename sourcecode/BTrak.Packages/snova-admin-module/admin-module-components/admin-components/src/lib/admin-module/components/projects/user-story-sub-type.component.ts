import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { TranslateService } from '@ngx-translate/core';
import { UserstorySubTypeModel } from '../../models/projects/user-story-sub-type-model';
import { ProjectManagementService } from '../../services/project-management.service';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-user-story-sub-type',
    templateUrl: `user-story-sub-type.component.html`
})

export class UserStorySubTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertUserstorySubTypePopUp") upsertUserstorySubTypePopover;
    @ViewChildren("archiveUserstorySubTypePopUp") archiveUserstorySubTypePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels: SoftLabelConfigurationModel[];
    userstorySubTypeForm: FormGroup;
    userStorySubTypeModel: UserstorySubTypeModel;
    isThereAnyOperationIsInProgress: boolean;
    isAnyOperationIsInprogress: boolean = false;
    isThereAnError: boolean;
    isFiltersVisible: boolean;
    isArchivedTypes: boolean = false;
    userstorySubTypes: UserstorySubTypeModel[];
    validationMessage: string;
    userstorySubTypeId: string;
    userstorySubTypeName: string;
    searchText: string;
    temp: any;
    timeStamp: any;
    editUserstory: any;

    constructor(private translateService: TranslateService, private projectsService: ProjectManagementService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.getAllUserstorySubTypes();
        this.clearForm();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getAllUserstorySubTypes() {
        this.isAnyOperationIsInprogress = true;

        var userstorySubTypes = new UserstorySubTypeModel();
        userstorySubTypes.IsArchived = this.isArchivedTypes;

        this.projectsService.SearchUserstorySubTypes(userstorySubTypes).subscribe((response: any) => {
            if (response.success == true) {
                this.userstorySubTypes = response.data;
                this.temp = this.userstorySubTypes;
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

    editUserstorySubTypePopupOpen(row, editUserstorySubTypePopup) {
        this.userstorySubTypeForm.patchValue(row);
        this.userstorySubTypeId = row.userStorySubTypeId;
        this.timeStamp = row.timeStamp;
        this.editUserstory = this.translateService.instant('USERSTORYSUBTYPE.EDITUSERSTORYSUBTYPE');
        editUserstorySubTypePopup.openPopover();
    }

    createUserstorySubTypePopupOpen(upsertUserstorySubTypePopUp) {
        upsertUserstorySubTypePopUp.openPopover();
        this.editUserstory = this.translateService.instant('USERSTORYSUBTYPE.ADDUSERSTORYSUBTYPE');
    }

    upsertUserStorySubType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.userStorySubTypeModel = this.userstorySubTypeForm.value;
        this.userStorySubTypeModel.UserStorySubTypeId = this.userstorySubTypeId;
        this.userStorySubTypeModel.timeStamp = this.timeStamp;

        this.projectsService.upsertUserstorySubTypeType(this.userStorySubTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertUserstorySubTypePopover.forEach((p) => p.closePopover());
                formDirective.resetForm();
                this.clearForm();
                this.getAllUserstorySubTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    archiveUserstorySubTypePopupOpen(row, archiveUserstorySubTypePopUp) {
        this.userstorySubTypeId = row.userStorySubTypeId;
        this.userstorySubTypeName = row.userStorySubTypeName;
        this.timeStamp = row.timeStamp;
        archiveUserstorySubTypePopUp.openPopover();
    }

    closeUpsertUserstorySubTypePopup(formDirective: FormGroupDirective) {
        this.upsertUserstorySubTypePopover.forEach((p) => p.closePopover());
        formDirective.resetForm();
        this.clearForm();
    }

    closeArchiveUserstorySubTypeDialog() {
        this.archiveUserstorySubTypePopover.forEach((p) => p.closePopover());
    }

    deleteUserstorySubType() {
        this.isAnyOperationIsInprogress = true;

        this.userStorySubTypeModel = new UserstorySubTypeModel();
        this.userStorySubTypeModel.UserStorySubTypeId = this.userstorySubTypeId;
        this.userStorySubTypeModel.UserStorySubTypeName = this.userstorySubTypeName;
        this.userStorySubTypeModel.timeStamp = this.timeStamp;
        this.userStorySubTypeModel.IsArchived = !this.isArchivedTypes;

        this.projectsService.upsertUserstorySubTypeType(this.userStorySubTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.archiveUserstorySubTypePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllUserstorySubTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.validationMessage = null;
        this.userstorySubTypeId = null;
        this.userStorySubTypeModel = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.userstorySubTypeForm = new FormGroup({
            userStorySubTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.ProjectNameMaxLength250)
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(userstorySubTypes => userstorySubTypes.userStorySubTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.userstorySubTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
