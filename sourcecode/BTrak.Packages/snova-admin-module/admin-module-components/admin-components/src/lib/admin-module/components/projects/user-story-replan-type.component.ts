import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { UserStoryReplanTypeModel } from '../../models/projects/user-story-repaln-type-model';
import { ProjectManagementService } from '../../services/project-management.service';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-fm-component-user-story-replan-type',
    templateUrl: `user-story-replan-type.component.html`
})

export class UserStoryReplanTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertUserStoryReplanTypePopUp") upsertUserStoryReplanTypePopover;
    @ViewChildren("deleteUserStoryReplanTypePopUp") deleteUserStoryReplanTypePopover;
    isEdit: boolean=false;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels: SoftLabelConfigurationModel[];
    userStoryReplanTypeForm: FormGroup;
    userStoryReplanTypeModel: UserStoryReplanTypeModel;
    isAnyOperationIsInprogress: boolean = false;
    userstoryReplanTypes: UserStoryReplanTypeModel[];
    isArchivedTypes: boolean = false;
    isFiltersVisible: boolean = false;
    isThereAnError: boolean;
    validationMessage: string;
    UserStoryReplanTypeId: string;
    UserStoryReplanTypeName: string;
    searchText: string;
    temp: any;
    timeStamp:any;

    constructor(private projectsService: ProjectManagementService, private snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef,private translateService: TranslateService) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        this.getSoftLabels();
        super.ngOnInit();
        this.getAllUserstoryReplanTypes();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
      }

    getAllUserstoryReplanTypes() {
        this.isAnyOperationIsInprogress = true;

        var userStoryReplanType = new UserStoryReplanTypeModel();
        userStoryReplanType.IsArchived = this.isArchivedTypes;

        this.projectsService.GettAllUserStoryReplanTypes(userStoryReplanType).subscribe((response: any) => {
            if (response.success == true) {
                this.userstoryReplanTypes = response.data;
                this.temp = this.userstoryReplanTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    createGoalReplanType(upsertUserStoryReplanTypePopUp) {
        upsertUserStoryReplanTypePopUp.openPopover();
    }

    closeUpsertUserStoryReplanTypePopup(formDirective: FormGroupDirective) {
        this.clearForm();
        formDirective.resetForm();
        this.upsertUserStoryReplanTypePopover.forEach((p) => p.closePopover());
    }

    editUserStoryReplanType(row, upsertUserStoryReplanTypePopUp) {
       this.isEdit=true;
        this.userStoryReplanTypeForm.patchValue(row);
        this.UserStoryReplanTypeId = row.userStoryReplanTypeId;
        this.timeStamp = row.timeStamp;
        upsertUserStoryReplanTypePopUp.openPopover();
    }

    upsertUserStoryReplanType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.userStoryReplanTypeModel = this.userStoryReplanTypeForm.value;
        this.userStoryReplanTypeModel.UserStoryReplanTypeId = this.UserStoryReplanTypeId;
        this.userStoryReplanTypeModel.timeStamp = this.timeStamp;

        this.projectsService.upsertUserStoryReplanType(this.userStoryReplanTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertUserStoryReplanTypePopover.forEach((p) => p.closePopover());
                this.getAllUserstoryReplanTypes();
                formDirective.resetForm();
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.UserStoryReplanTypeId = null;
        this.userStoryReplanTypeModel = null;
        this.isFiltersVisible = false;
        this.searchText = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.userStoryReplanTypeForm = new FormGroup({
            replanTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    deleteUserStoryReplanTypePopUpOpen(row, deleteUserStoryReplanTypePopUp) {
        this.UserStoryReplanTypeId = row.userStoryReplanTypeId;
        this.UserStoryReplanTypeName = row.replanTypeName;
        this.timeStamp = row.timeStamp;
        deleteUserStoryReplanTypePopUp.openPopover();
    }

    closeDeleteUserStoryReplanTypeDialog() {
        this.deleteUserStoryReplanTypePopover.forEach((p) => p.closePopover());
    }

    deleteUserStoryReplanType() {
        this.isAnyOperationIsInprogress = true;

        this.userStoryReplanTypeModel = new UserStoryReplanTypeModel();
        this.userStoryReplanTypeModel.UserStoryReplanTypeId = this.UserStoryReplanTypeId;
        this.userStoryReplanTypeModel.ReplanTypeName = this.UserStoryReplanTypeName;
        this.userStoryReplanTypeModel.timeStamp = this.timeStamp;
        this.userStoryReplanTypeModel.IsArchived = !this.isArchivedTypes;

        this.projectsService.upsertUserStoryReplanType(this.userStoryReplanTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteUserStoryReplanTypePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.getAllUserstoryReplanTypes();
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(userstoryReplanType => userstoryReplanType.replanTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.userstoryReplanTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
