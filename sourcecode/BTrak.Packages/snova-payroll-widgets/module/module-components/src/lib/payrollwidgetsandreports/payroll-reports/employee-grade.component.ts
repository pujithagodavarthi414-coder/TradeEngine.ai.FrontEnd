import { Component, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { State, process } from "@progress/kendo-data-query";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { PayRollService } from '../services/PayRollService';
import { EmployeeGradeModel } from '../models/employee-grade.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelPipe } from "../pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../models/softlabels-model";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: 'app-component-grade',
    templateUrl: `employee-grade.component.html`

})
export class EmployeeGradeComponent {
    @ViewChildren("upsertGradePopUp") upsertGradePopover;
    @ViewChildren("deleteGradePopUp") deleteGradePopover;

    isArchived: boolean = false;
    gradeEdit: string;
    gradeForm: FormGroup;
    isAnyOperationIsInprogress: boolean;
    searchText: string;
    gradeId: string;
    timeStamp: string;
    grade: EmployeeGradeModel;
    grades: EmployeeGradeModel[];
    softLabels:SoftLabelConfigurationModel[];
    temp: any;
    state: State = {
        skip: 0,
        take: 20,
    };
    gradesList: any;

    constructor(private payRollService: PayRollService, public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef,
        private toasterService: ToastrService, private translateService: TranslateService,private softLabel: SoftLabelPipe) {

    }

    ngOnInit() {
        this.clearForm();
        this.getAllGrades();
        this.getSoftLabelConfigurations();
    }
    
    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }
    
    getAllGrades() {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new EmployeeGradeModel();
        employeeGradeModel.isArchived = this.isArchived;
        this.payRollService.getGrades(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.grades = response.data;
                this.gradesList = process(this.grades, this.state);
                this.temp = this.grades;
                this.clearForm();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toasterService.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    upsertGrade(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        var employeeGradeModel = new EmployeeGradeModel();
        employeeGradeModel = this.gradeForm.value;
        employeeGradeModel.gradeId = this.gradeId;
        employeeGradeModel.timeStamp = this.timeStamp;
        employeeGradeModel.isArchived = this.isArchived
        this.payRollService.upsertGrades(employeeGradeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllGrades();
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toasterService.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteGrade() {
        this.isAnyOperationIsInprogress = true;
        this.grade.isArchived = !this.isArchived
        this.payRollService.upsertGrades(this.grade).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertGradePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllGrades();
            }
            else {
                this.toasterService.error(response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    editGradePopupOpen(row, upsertGradePopUp) {
        this.gradeForm.patchValue(row);
        this.gradeId = row.gradeId;
        this.timeStamp = row.timeStamp;
        this.gradeEdit = this.softLabel.transform(this.translateService.instant('EMPLOYEEGRADE.EDITEMPLOYEEGRADE'),this.softLabels);
        upsertGradePopUp.openPopover();
    }

    creatGradePopupOpen(upsertGradePopUp) {
        upsertGradePopUp.openPopover();
        this.gradeEdit = this.softLabel.transform(this.translateService.instant('EMPLOYEEGRADE.ADDEMPLOYEEGRADE'),this.softLabels);
    }

    closePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertGradePopover.forEach((p) => p.closePopover());
    }

    deleteEmployeeGradePopUp(row, deleteGradePopUp) {
        this.grade = row;
        this.gradeId = row.gradeId;
        this.timeStamp = row.timeStamp;
        deleteGradePopUp.openPopover();
    }

    closeDeleteGradeDialog() {
        this.deleteGradePopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.gradeId = null;
        this.grade = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.gradeForm = new FormGroup({
            gradeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            gradeOrder: new FormControl(null,
                Validators.compose([
                    Validators.required
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

        const temp = this.temp.filter((grade => (grade.gradeName.toLowerCase().indexOf(this.searchText) > -1) || (grade.gradeOrder.toString().toLowerCase().indexOf(this.searchText) > -1)));
        this.gradesList = process(temp, this.state);
        this.cdRef.detectChanges();
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gradesList = process(this.grades, this.state);
    }

    closeSearch() {
        this.filterByName(null);
    }
}