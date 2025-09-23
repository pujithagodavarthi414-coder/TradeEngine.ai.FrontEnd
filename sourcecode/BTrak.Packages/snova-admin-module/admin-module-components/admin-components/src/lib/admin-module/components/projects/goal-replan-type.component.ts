import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ProjectManagementService } from '../../services/project-management.service';
import { GoalReplanModel } from '../../models/projects/goalReplanModel';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';
import { ConstantVariables } from '../../helpers/constant-variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-fm-component-goal-replan-type',
    templateUrl: `goal-replan-type.component.html`
})

export class GoalReplanTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteGoalReplanTypePopUp") deleteGoalReplanTypePopover;
    @ViewChildren("upsertGoalReplanTypePopUp") upsertGoalReplanTypePopover;
    isEdit: boolean = false;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    softLabels: SoftLabelConfigurationModel[];

    goalReplanTypeForm: FormGroup;
    isFiltersVisible: boolean = false;
    isArchivedTypes: boolean = false;
    isGoalReplanTypeArchived: boolean;
    isThereAnError: boolean = false;
    goalReplanTypeId: string;
    goalReplanTypeName: string;
    validationMessage: string;
    goalReplanTye: GoalReplanModel;
    toastr: any;
    isAnyOperationIsInprogress: boolean = true;
    goalReplanTypes: GoalReplanModel[];
    searchText: string;
    temp: any;
    timeStamp: any;
    goalLabel: string;
    projectLabel: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSoftLabels();
        this.getAllGoalReplanTypes();
    }
    constructor(private projectGoalsService: ProjectManagementService, translateService: TranslateService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels.length > 0) {
            this.projectLabel = this.softLabels[0].projectLabel;
            this.goalLabel = this.softLabels[0].goalLabel;
            this.cdRef.markForCheck();
        }
    }

    getAllGoalReplanTypes() {
        this.isAnyOperationIsInprogress = true;

        var goalReplanModel = new GoalReplanModel();
        goalReplanModel.isArchived = this.isArchivedTypes;

        this.projectGoalsService.GetAllGoalReplanTypes(goalReplanModel).subscribe((response: any) => {
            if (response.success == true) {
                this.goalReplanTypes = response.data;
                this.temp = this.goalReplanTypes;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteGoalReplanTypePopUpOpen(row, deleteGoalReplanTypePopUp) {
        this.goalReplanTypeId = row.goalReplanTypeId;
        this.goalReplanTypeName = row.goalReplanTypeName;
        this.timeStamp = row.timeStamp;
        this.isGoalReplanTypeArchived = !row.isArchived;
        deleteGoalReplanTypePopUp.openPopover();
    }

    closeDeleteGoalReplanTypeDialog() {
        this.clearForm();
        this.deleteGoalReplanTypePopover.forEach((p) => p.closePopover());
    }

    upsertGoalReplanType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.goalReplanTye = this.goalReplanTypeForm.value;
        this.goalReplanTye.goalReplanTypeId = this.goalReplanTypeId;
        this.goalReplanTye.timeStamp = this.timeStamp;

        this.projectGoalsService.upsertGoalReplanType(this.goalReplanTye).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGoalReplanTypePopover.forEach((p) => p.closePopover());
                this.getAllGoalReplanTypes();
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


    deleteGoalReplanType() {
        this.isAnyOperationIsInprogress = true;

        this.goalReplanTye = new GoalReplanModel();
        this.goalReplanTye.goalReplanTypeId = this.goalReplanTypeId;
        this.goalReplanTye.goalReplanTypeName = this.goalReplanTypeName;
        this.goalReplanTye.timeStamp = this.timeStamp;
        this.goalReplanTye.isArchived = this.isGoalReplanTypeArchived;

        this.projectGoalsService.upsertGoalReplanType(this.goalReplanTye).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteGoalReplanTypePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllGoalReplanTypes();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    editGoalReplanType(row, upsertGoalReplanTypePopUp) {
        this.isEdit = true;
        this.goalReplanTypeForm.patchValue(row);
        this.goalReplanTypeId = row.goalReplanTypeId;
        this.timeStamp = row.timeStamp;
        upsertGoalReplanTypePopUp.openPopover();
    }

    closeUpsertGoalReplanTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertGoalReplanTypePopover.forEach((p) => p.closePopover());
    }

    createGoalReplanType(upsertGoalReplanTypePopUp) {
        this.isEdit = false;
        upsertGoalReplanTypePopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.goalReplanTye = null;
        this.goalReplanTypeId = null;
        this.goalReplanTye = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.timeStamp = null;
        this.goalReplanTypeForm = new FormGroup({
            goalReplanTypeName: new FormControl(null,
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

        const temp = this.temp.filter(goalReplanType => goalReplanType.goalReplanTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.goalReplanTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
