import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { DesignationModel } from '../../models/hr-models/designation-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-designation",
    templateUrl: `designation.component.html`

})

export class DesignationComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("designationPopup") upsertDesignationPopover;
    @ViewChildren("deletedesignationPopup") deletedesignationPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    preserveWhitespaces: true;
    isAnyOperationIsInprogress = false;
    designationForm: FormGroup;
    isDesignationArchived: boolean;
    isThereAnError = false;
    isFiltersVisible: boolean;
    isArchived = false;
    designationId: string;
    validationMessage: string;
    designationName: string;
    designationModel: DesignationModel;
    designations: DesignationModel[];
    timeStamp: any;
    searchText: string;
    temp: any;
    designation: string;

    constructor(
        private hrManagement: HRManagementService, private snackbar: MatSnackBar
        , private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super();

    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllDesignations();
    }

    getAllDesignations() {
        this.isAnyOperationIsInprogress = true;
        const designationModel = new DesignationModel();
        designationModel.isArchived = this.isArchived;
        this.hrManagement.getDesignation(designationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.designations = response.data;
                this.temp = this.designations;
                if (this.searchText) {
                    this.searchOnCall(this.searchText);
                }
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createDesignation(designationPopup) {
        designationPopup.openPopover();
        this.designation = this.translateService.instant("DESIGNATION.ADDDESIGNATIONTITLE");
    }

    closeUpsertDesignationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDesignationPopover.forEach((p) => p.closePopover());
    }

    closeDeleteDesignationPopup() {
        this.clearForm();
        this.deletedesignationPopup.forEach((p) => p.closePopover());
    }

    upsertDesignation(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let designation = new DesignationModel();
        designation = this.designationForm.value;
        designation.designationName = designation.designationName.trim();
        designation.designationId = this.designationId;
        designation.timeStamp = this.timeStamp;
        this.hrManagement.upsertDesignation(designation).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertDesignationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllDesignations();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteDesignation() {
        this.isAnyOperationIsInprogress = true;
        const designationModel = new DesignationModel();
        designationModel.designationId = this.designationId;
        designationModel.designationName = this.designationName;
        designationModel.timeStamp = this.timeStamp;
        designationModel.isArchived = this.isDesignationArchived;
        this.hrManagement.upsertDesignation(designationModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deletedesignationPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllDesignations();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.designationId = null;
        this.validationMessage = null;
        this.designationName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.designationModel = null;
        this.timeStamp = null;
        this.designationForm = new FormGroup({
            designationName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    editDesignation(rowDetails, designationPopup) {
        this.designationForm.patchValue(rowDetails);
        this.designationId = rowDetails.designationId;
        this.designation = this.translateService.instant(ConstantVariables.Editdesignation);
        designationPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    deleteDesignationPopUpOpen(row, deletedesignationPopup) {
        this.designationId = row.designationId;
        this.designationName = row.designationName;
        this.timeStamp = row.timeStamp;
        this.isDesignationArchived = !this.isArchived;
        deletedesignationPopup.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(((designation) => (designation.designationName.toLowerCase().indexOf(this.searchText) > -1)));
        this.designations = temp;
    }

    searchOnCall(event) {
        if (event != null) {
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(((designation) => (designation.designationName.toLowerCase().indexOf(this.searchText) > -1)));
        this.designations = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}
