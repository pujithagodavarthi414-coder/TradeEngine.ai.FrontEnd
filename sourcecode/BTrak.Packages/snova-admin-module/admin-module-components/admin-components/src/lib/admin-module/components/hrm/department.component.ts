import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { DepartmentModel } from '../../models/hr-models/department-model';

@Component({
    selector: "app-fm-component-department",
    templateUrl: `department.component.html`
})

export class DeapartmentComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("departmentPopup") upsertDepartmentPopover;
    @ViewChildren("deleteDepartmentPopup") deleteDepartmentPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    isThereAnError: boolean;
    validationMessage: any;
    departmentId: any;
    departmentForm: FormGroup;
    departmentModel: DepartmentModel;
    timeStamp: any;
    department: DepartmentModel[];
    isFiltersVisible: boolean;
    departmentName: any;
    temp: any;
    searchText: string;
    isDepartmentArchived: boolean;
    departmentEdit: string;

    constructor(
        private translateService: TranslateService,
        public hrManagement: HRManagementService,
        private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getdepartment();
    }

    getdepartment() {
        this.isAnyOperationIsInprogress = true;
        const departmentModel = new DepartmentModel();
        departmentModel.isArchived = this.isArchived;
        this.hrManagement.getdepartment(departmentModel).subscribe((response: any) => {
            if (response.success === true) {
                this.department = response.data;
                this.temp = this.department;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createDepartment(departmentPopup) {
        departmentPopup.openPopover();
        this.departmentEdit = this.translateService.instant("DEPARTMENT.ADDDEPARTMENTTITLE");
    }

    editDepartment(row, departmentPopup) {
        this.departmentForm.patchValue(row);
        this.departmentId = row.departmentId;
        departmentPopup.openPopover();
        this.departmentEdit = this.translateService.instant("DEPARTMENT.EDITDEPARTMENT");
        this.timeStamp = row.timeStamp;
    }

    clearForm() {
        this.departmentId = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.timeStamp = null;
        this.departmentName = null;
        this.departmentModel = null;
        this.searchText = null;
        this.departmentForm = new FormGroup({
            departmentName: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            )
        })
    }

    upsertDepartment(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let department = new DepartmentModel();
        department = this.departmentForm.value;
        department.departmentName = department.departmentName.trim();
        department.departmentId = this.departmentId;
        department.timeStamp = this.timeStamp;
        this.hrManagement.upsertDepartment(department).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertDepartmentPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getdepartment();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeupsertDepartmentPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertDepartmentPopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteDepartmentPopupOpen(row, deleteDepartmentPopup) {
        this.departmentId = row.departmentId;
        this.departmentName = row.departmentName;
        this.timeStamp = row.timeStamp;
        this.isDepartmentArchived = !this.isArchived;
        deleteDepartmentPopup.openPopover();
    }

    closeDepartmentPopup() {
        this.clearForm();
        this.deleteDepartmentPopup.forEach((p) => p.closePopover());
    }

    deleteDepartment() {
        this.isAnyOperationIsInprogress = true;
        const departmentModel = new DepartmentModel();
        departmentModel.departmentId = this.departmentId;
        departmentModel.departmentName = this.departmentName;
        departmentModel.timeStamp = this.timeStamp;
        departmentModel.isArchived = this.isDepartmentArchived;
        this.hrManagement.upsertDepartment(departmentModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteDepartmentPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getdepartment();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDepartmentPopupOpen() {
        this.clearForm();
        this.deleteDepartmentPopup.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((department) => (department.departmentName.toLowerCase().indexOf(this.searchText) > -1)));
        this.department = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
