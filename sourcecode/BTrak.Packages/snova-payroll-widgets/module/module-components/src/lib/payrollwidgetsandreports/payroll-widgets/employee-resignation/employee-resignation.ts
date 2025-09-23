import { Component, OnInit, ViewChildren, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';
import { PayRollEmployeeResignationModel } from '../../models/PayRollEmployeeResignationModel';
import { PayRollResignationStatusModel } from '../../models/PayRollResignationStatusModel';
import { PayRollService } from '../../services/PayRollService';
import { UserModel } from '../../models/user';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';

@Component({
    selector: 'app-employee-resignation',
    templateUrl: 'employee-resignation.html'
})

export class EmployeeResignation extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteEmployeeResignationPopUp") deleteEmployeeResignationPopover;
    @ViewChildren("upsertEmployeeResignationPopUp") upsertEmployeeResignationPopover;
   

    @Input("employeeId")
    set setEmployeeId(data: string) {
        this.selectedEmployeeId = data;
        this.getAllEmployeesResignation();
    }

    employeeResignationForm: FormGroup;
    isArchivedTypes: boolean = false;
    isEmployeeResignationArchived: boolean = false;
    isThereAnError: boolean = false;
    employeeResignationId: string;
    employeeId: string;
    resignationStatusId: string;
    resignationApprovedById: string;
    resignationDate: any;
    lastDate: any;
    approvedDate: any;
    validationMessage: string;
    searchText: string;
    employeeResignation: PayRollEmployeeResignationModel;
    isAnyOperationIsInprogress: boolean = false;
    resignationStatuses: PayRollResignationStatusModel[];
    employeesResignationList: PayRollResignationStatusModel[];
    softLabels:SoftLabelConfigurationModel[];
    timeStamp: any;
    temp: any;
    statusTitle: string;
    selectedEmployeeId: any;
    

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSoftLabelConfigurations();
        this.getAllEmployeesResignation();
    }

    constructor(private translateService: TranslateService,
        private payRollService: PayRollService, private router: Router,private cdRef: ChangeDetectorRef,private softLabel : SoftLabelPipe) {
            super();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }
    

    getAllEmployeesResignation() {
        this.isAnyOperationIsInprogress = true;
        var resignationStatusModel = new PayRollEmployeeResignationModel();
        resignationStatusModel.isArchived = this.isArchivedTypes;
        resignationStatusModel.employeeId = this.selectedEmployeeId;
        this.payRollService.getAllEmployeeResignation(resignationStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = this.employeesResignationList = response.data;
                this.isAnyOperationIsInprogress = false;
            }
            if (response.success == false) {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllResignationStatus() {
        var resignationStatusModel = new PayRollResignationStatusModel();
        resignationStatusModel.isArchived = false;

        this.payRollService.getAllResignationStatus(resignationStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.resignationStatuses = response.data;
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    deleteEmployeeResignationPopUpOpen(row, deleteEmployeeResignationPopUp) {
        this.employeeResignationId = row.employeeResignationId;

        this.employeeResignationId = row.employeeResignationId;
        this.employeeId = row.employeeId;
        this.resignationStatusId = row.resignationStatusId;
        this.resignationApprovedById = row.resignationApprovedById;
        this.resignationDate = row.resignationDate;
        this.lastDate = row.lastDate;
        this.approvedDate = row.approvedDate;

        if (this.isArchivedTypes) {
            this.isEmployeeResignationArchived = row.isArchived;
        }
        else {
            this.isEmployeeResignationArchived = !row.isArchived;
        }
        this.timeStamp = row.timeStamp;
        deleteEmployeeResignationPopUp.openPopover();
    }

    closeDeleteEmployeeResignationDialog() {
        this.clearForm();
        this.deleteEmployeeResignationPopover.forEach((p) => p.closePopover());
    }

    upsertEmployeeResignation(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.employeeResignation = this.employeeResignationForm.value;
        this.employeeResignation.employeeId = this.selectedEmployeeId
        this.employeeResignation.timeStamp = this.timeStamp;

        this.payRollService.upsertEmployeeResignation(this.employeeResignation).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertEmployeeResignationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllEmployeesResignation();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });

    }


    deleteEmployeeResignation() {
        this.isAnyOperationIsInprogress = true;
        this.employeeResignation = new PayRollEmployeeResignationModel();
        this.employeeResignation.employeeResignationId = this.employeeResignationId
        this.employeeResignation.employeeId = this.employeeId
        this.employeeResignation.resignationStatusId = this.resignationStatusId
        this.employeeResignation.resignationApprovedById = this.resignationApprovedById
        this.employeeResignation.resignationDate = this.resignationDate
        this.employeeResignation.lastDate = this.lastDate
        this.employeeResignation.approvedDate = this.approvedDate
        this.employeeResignation.timeStamp = this.timeStamp;
        this.employeeResignation.isArchived = this.isEmployeeResignationArchived;
        this.payRollService.upsertEmployeeResignation(this.employeeResignation).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeeResignationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmployeesResignation();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    editEmployeeResignation(row, upsertEmployeeResignationPopUp) {
        this.employeeResignationForm.patchValue(row);
        this.employeeResignationId = row.employeeResignationId;
        this.timeStamp = row.timeStamp;
        this.statusTitle = this.softLabel.transform(this.translateService.instant('EMPLOYEERESIGNATION.EDITEMPLOYEERESIGNATION'),this.softLabels);
        upsertEmployeeResignationPopUp.openPopover();
    }

    closeUpsertEmployeeResignationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeeResignationPopover.forEach((p) => p.closePopover());
    }

    createEmployeeResignation(upsertEmployeeResignationPopUp) {
        upsertEmployeeResignationPopUp.openPopover();
        this.statusTitle = this.softLabel.transform(this.translateService.instant('EMPLOYEERESIGNATION.ADDEMPLOYEERESIGNATION'),this.softLabels);
        this.clearForm();
    }

    clearForm() {
        this.employeeResignation = null;
        this.employeeResignationId = null;
        this.timeStamp = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.employeeResignationForm = new FormGroup({
            employeeId: new FormControl(null),
            employeeResignationId: new FormControl(null),
            resignationDate: new FormControl(null),
            commentByEmployee: new FormControl(null),
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
        const temp = this.temp.filter((employeeResignation => (employeeResignation.employeeFullName.toLowerCase().indexOf(this.searchText) > -1)));
        this.employeesResignationList = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    checkValidations() {
        var resignation = this.employeeResignationForm.value;

        if (resignation.resignationDate != null && new Date(resignation.lastDate) < new Date(resignation.resignationDate)) {
            this.isAnyOperationIsInprogress = true;
            this.isThereAnError = true;
            this.validationMessage = "Resignation date should be earlier than the Last date.";

        } else {
            this.isAnyOperationIsInprogress = false;
            this.isThereAnError = false;
        }
    }
}