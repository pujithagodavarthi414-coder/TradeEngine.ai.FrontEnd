import { Component, ChangeDetectorRef, ViewChildren } from "@angular/core";
import { PayRollService } from "../services/PayRollService";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { GradeDetailsModel } from "../models/gradeDetailsmodel";
import { State } from "@progress/kendo-data-query";
import { FormGroupDirective, FormGroup, FormControl, Validators } from "@angular/forms";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { EmployeeConfigurationDialougeComponent } from "./employee-grade-dialouge.component";
import { Router } from "@angular/router";
import { EmployeeGradeModel } from '../models/employee-grade.model';
import { SelectEmployeeDropDownListData } from '../models/selectEmployeeDropDownListData';
import { UserModel } from '../models/user';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../models/softlabels-model";

@Component({
    selector: 'app-component-grade-configuration',
    templateUrl: `employee-grade-configuration.component.html`
})

export class EmployeeGradeConfigurationComponent {

    @ViewChildren("upsertGradePopUp") upsertGradePopover;

    isAnyOperationIsInprogress: boolean = false;
    employeeGradeDetails: GradeDetailsModel[];
    grades: EmployeeGradeModel[];
    gridData: any;
    state: State = {
        skip: 0,
        take: 20,
    };
    searchText: string;
    gradeForm: FormGroup;
    employeeList: SelectEmployeeDropDownListData[];
    gridDataList: GridDataResult;
    employeeId: string;
    sortBy: string;
    sortDirection: boolean = true;
    pageable: boolean = false;
    minDateForEndDate = new Date();
    endDateBool: boolean = true;
    maxDate = new Date();
    minDate = new Date(1753, 0, 1);
    isArchived: boolean;
    softLabels:SoftLabelConfigurationModel[];

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private router: Router) { }

    ngOnInit() {
        this.clearForm();
        this.getSoftLabelConfigurations();
        this.getAllUsers();
        this.getEmployeeGradeDetails();
        this.getAllGrades()
    }
    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }
    getEmployeeGradeDetails() {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new GradeDetailsModel();
        employeeGradeModel.employeeId = this.employeeId;
        employeeGradeModel.sortBy = this.sortBy;
        employeeGradeModel.isArchived = false;
        employeeGradeModel.sortDirectionAsc = this.sortDirection;
        employeeGradeModel.pageNumber = (this.state.skip / this.state.take) + 1;
        employeeGradeModel.pageSize = this.state.take;
        employeeGradeModel.searchText = this.searchText;
        this.payRollService.getEmployeeGradeDetails(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeGradeDetails = response.data;
                this.gridDataList = {
                    data: this.employeeGradeDetails,
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

    upsertGrade(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new GradeDetailsModel();
        employeeGradeModel = this.gradeForm.value;
        this.payRollService.upsertEmployeeGradeDetails(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
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

    getAllUsers() {
        var userModel = new UserModel();
        userModel.isActive = true;
        this.payRollService.getAllUsers(userModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.employeeList = responseData.data;
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
            }
        })
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

    creatGradePopupOpen(upsertGradePopUp) {
        upsertGradePopUp.openPopover();
    }

    closePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertGradePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.gradeForm = new FormGroup({
            gradeId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            employeeId: new FormControl(null,
                Validators.compose([
                    Validators.required
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

    closeSearch() {
        this.searchText = null;
        this.getEmployeeGradeDetails();
    }

    selectedRow(row) {
        const dialogRef = this.dialog.open(EmployeeConfigurationDialougeComponent, {
            height: "70%",
            width: "70%",
            direction: 'ltr',
            data: { gradeList: row.dataItem },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getEmployeeGradeDetails();
        });
    }
    goToUserProfile(selectedUserId) {
        this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
    }
}