import { Component, Inject, ChangeDetectorRef, ViewChildren } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { State } from "@progress/kendo-data-query";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { EmployeeGradeModel } from '../models/employee-grade.model';
import { PayRollService } from '../services/PayRollService';
import { GradeDetailsModel } from '../models/gradeDetailsmodel';

@Component({
    selector: 'app-component-grade-dialouge',
    templateUrl: `employee-grade-dialouge.component.html`
})
export class EmployeeConfigurationDialougeComponent {
    @ViewChildren("upsertGradePopUp") upsertGradePopover;
    @ViewChildren("deleteGradePopUp") deleteGradePopover;

    isArchived: boolean = false;
    gradeEdit: string;
    gradeForm: FormGroup;
    employeeGradeDetails: any;
    isAnyOperationIsInprogress: boolean = false;
    employeeId: string;
    sortBy: string;
    sortDirection: boolean = true;
    pageable: boolean = false;
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    gridDataList: GridDataResult;
    gradeId: string;
    timeStamp: string;
    grade: GradeDetailsModel;
    grades: EmployeeGradeModel[];
    employeeGradeId: string;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);

    constructor(private payRollService: PayRollService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private router: Router,
        public dialogRef: MatDialogRef<EmployeeConfigurationDialougeComponent>) {
        this.employeeGradeDetails = data.gradeList;
        if (this.employeeGradeDetails) {
            this.getEmployeeGradeDetails();
        }
    }

    ngOnInit() {
        this.clearForm();
        this.getAllGrades()
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getEmployeeGradeDetails() {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new GradeDetailsModel();
        employeeGradeModel.employeeId = this.employeeGradeDetails.employeeId;
        employeeGradeModel.sortBy = this.sortBy;
        employeeGradeModel.sortDirectionAsc = this.sortDirection;
        employeeGradeModel.pageNumber = (this.state.skip / this.state.take) + 1;
        employeeGradeModel.pageSize = this.state.take;
        employeeGradeModel.searchText = this.searchText;
        this.payRollService.getEmployeeGradeDetails(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.gridDataList = {
                    data: response.data,
                    total: response.data.length > 0 ? response.data[0].totalRecordsCount : 0,
                }
                let totalCount = response.data.length > 0 ? response.data[0].totalRecordsCount : 0;
                if (totalCount > this.state.take) {
                    this.pageable = true;
                }
                else {
                    this.pageable = false;
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getEmployeeGradeDetails();
    }

    deleteGrade() {
        this.isAnyOperationIsInprogress = true;
        this.grade.isArchived = !this.isArchived
        this.payRollService.upsertEmployeeGradeDetails(this.grade).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getEmployeeGradeDetails();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    upsertGrade(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new GradeDetailsModel();
        employeeGradeModel = this.gradeForm.value;
        employeeGradeModel.employeeGradeId = this.employeeGradeId;
        employeeGradeModel.employeeId = this.employeeGradeDetails.employeeId;
        employeeGradeModel.timeStamp = this.timeStamp;
        this.payRollService.upsertEmployeeGradeDetails(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getEmployeeGradeDetails();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    editGradePopupOpen(row, upsertGradePopUp) {
        this.gradeForm.patchValue(row);
        this.startDate();
        this.employeeGradeId = row.employeeGradeId;
        this.timeStamp = row.timeStamp;
        this.gradeEdit = this.translateService.instant('EMPLOYEEGRADE.EDITEMPLOYEEGRADE');
        upsertGradePopUp.openPopover();
    }


    deleteEmployeeGradePopUp(row, deleteGradePopUp) {
        this.grade = row;
        deleteGradePopUp.openPopover();
    }

    closePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertGradePopover.forEach((p) => p.closePopover());
    }

    closeDeleteGradeDialog() {
        this.deleteGradePopover.forEach((p) => p.closePopover());
    }

    getAllGrades() {
        var employeeGradeModel = new EmployeeGradeModel();
        employeeGradeModel.isArchived = false;
        this.payRollService.getGrades(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.grades = response.data;
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }

    clearForm() {
        this.gradeId = null;
        this.grade = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.gradeForm = new FormGroup({
            gradeId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                ])
            ),
            activeFrom: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            activeTo: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
        })
    }

    startDate() {
        if (this.gradeForm.value.activeFrom) {
            this.minDateForEndDate = this.gradeForm.value.activeFrom;
            this.endDateBool = false;
        } else {
            this.endDateBool = true;
            this.gradeForm.controls["activeTo"].setValue("");
        }
    }
    goToUserProfile(selectedUserId) {
        this.onNoClick();
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }
}