import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { PayRollService } from '../services/PayRollService';
import { PayRollEmployeeResignationModel } from '../models/PayRollEmployeeResignationModel';
import { PayRollResignationStatusModel } from '../models/PayRollResignationStatusModel';
import { ToastrService } from 'ngx-toastr';
import { EmployeeListModel } from '../models/employee-list-model';
import * as _ from "underscore";
import { Router } from '@angular/router';
import { ExitWorItemDialogComponent } from './exit-work-items/exit-workitem-dialog.component';
import { MatDialog } from "@angular/material/dialog";


@Component({
    selector: 'app-employeeresignation',
    templateUrl: 'employeeresignation.component.html'
})

export class PayRollEmployeeResignation extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteEmployeeResignationPopUp") deleteEmployeeResignationPopover;
    @ViewChildren("upsertEmployeeResignationPopUp") upsertEmployeeResignationPopover;
    @ViewChildren("approveEmployeeResignationDetailsPopUp") approveEmployeeResignationPopover;

    employeeResignationForm: FormGroup;
    isArchivedTypes: boolean = false;
    isEmployeeResignationArchived: boolean = false;
    isThereAnError: boolean = false;
    employeeResignationId: string;
    employeeId: string;
    resignationStatusId: string;
    resignationDate: any;
    lastDate: any;
    approvedDate: any;
    validationMessage: string;
    searchText: string;
    employeeResignation: PayRollEmployeeResignationModel;
    isAnyOperationIsInprogress: boolean = false;
    resignationStatuses: PayRollResignationStatusModel[];
    employeesResignationList: PayRollEmployeeResignationModel[];
    timeStamp: any;
    temp: any;
    statusTitle: string;
    employeeListDataDetails: EmployeeListModel[];
    isApproved: boolean;
    selectedEmployees: string;
    employeesList: EmployeeListModel[];
    employeeName: string;
    

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllEmployeesResignation();
        this.getEmployeesLists();
    }

    constructor(private translateService: TranslateService,  private dialog: MatDialog,
        private payRollService: PayRollService, private toaster: ToastrService,private router: Router) { super() 
            
        }

    getAllEmployeesResignation() {
        this.isAnyOperationIsInprogress = true;
        var resignationStatusModel = new PayRollEmployeeResignationModel();
        resignationStatusModel.isArchived = this.isArchivedTypes;
        this.payRollService.getAllEmployeeResignation(resignationStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.temp = this.employeesResignationList = response.data;
                this.isAnyOperationIsInprogress = false;
            }
            if (response.success == false) {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    getEmployeesLists() {
        const employeeListSearchResult = new EmployeeListModel();
        employeeListSearchResult.sortDirectionAsc = true;
        employeeListSearchResult.isArchived = false;
        employeeListSearchResult.isActive = true;
        this.payRollService.getAllEmployees(employeeListSearchResult).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeListDataDetails = response.data;
                this.employeesList = response.data;
                this.isAnyOperationIsInprogress = false;
            }
            if (response.success == false) {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    deleteEmployeeResignationPopUpOpen(row, deleteEmployeeResignationPopUp) {
        this.employeeResignation = new PayRollEmployeeResignationModel();
        this.employeeResignation = row;

        if (this.isArchivedTypes) {
            this.isEmployeeResignationArchived = row.isArchived;
        }
        else {
            this.isEmployeeResignationArchived = !row.isArchived;
        }
        this.employeeResignation.isArchived = this.isEmployeeResignationArchived;
        deleteEmployeeResignationPopUp.openPopover();
    }

    closeDeleteEmployeeResignationDialog() {
        this.clearForm();
        this.deleteEmployeeResignationPopover.forEach((p) => p.closePopover());
    }

    upsertEmployeeResignation(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.employeeResignation = this.employeeResignationForm.value;
        this.employeeResignation.timeStamp = this.timeStamp;

        if (this.employeeResignation.resignationDate != null && new Date(this.employeeResignation.lastDate) < new Date(this.employeeResignation.resignationDate)) {
            this.toaster.error("Resignation date should be earlier than the Last date.");
        }
        else {
            this.payRollService.upsertEmployeeResignation(this.employeeResignation).subscribe((response: any) => {
                if (response.success == true) {
                    this.upsertEmployeeResignationPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getAllEmployeesResignation();
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                }
            });
        }
        this.isAnyOperationIsInprogress = false;
    }

    approveEmployeeResignationDetailsPopUpOpen(row, approveEmployeeResignationDetailsPopUp, isApproved) {
        
        this.employeeResignation = new PayRollEmployeeResignationModel();
        this.employeeResignation = row;
        this.isApproved = isApproved;
        if (isApproved == false) {
            this.employeeResignation.lastDate = null;
        }
        if (isApproved == true && this.employeeResignation.lastDate == null) {
            this.toaster.error("Lastdate is required");
        }
        else {
            this.employeeResignation.IsApproved = isApproved;
            approveEmployeeResignationDetailsPopUp.openPopover();
            this.employeeName = this.employeeResignation.employeeFullName + " (" + this.employeeResignation.employeeNumber + ")";
           }
    }

    addExitWork() {
      const dialogRef = this.dialog.open(ExitWorItemDialogComponent, {
          minWidth: "80vw",
          maxHeight: "80vh",
          disableClose: true,
          data: this.employeeName
        });
       
      }

   

    deleteEmployeeResignation() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.upsertEmployeeResignation(this.employeeResignation).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeeResignationPopover.forEach((p) => p.closePopover());
                this.approveEmployeeResignationPopover.forEach((p) => p.closePopover());
                
                if(this.employeeResignation.IsApproved == true){
                this.addExitWork();
                }
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

    archiveEmployeeResignation() {
        this.isAnyOperationIsInprogress = true;
        this.payRollService.upsertEmployeeResignation(this.employeeResignation).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeeResignationPopover.forEach((p) => p.closePopover());
                this.approveEmployeeResignationPopover.forEach((p) => p.closePopover());
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
        this.employeeResignationId = row.employeeResignationId;
        this.timeStamp = row.timeStamp;
        this.employeeResignationForm.patchValue(row);
        this.selectedEmployees = row.employeeFullName;
        this.statusTitle = this.translateService.instant('EMPLOYEERESIGNATION.EDITEMPLOYEERESIGNATION');
        upsertEmployeeResignationPopUp.openPopover();
    }

    closeApproveEmployeeResignationDialog() {
        this.isThereAnError = false;
        this.approveEmployeeResignationPopover.forEach((p) => p.closePopover());
    }

    closeUpsertEmployeeResignationPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeeResignationPopover.forEach((p) => p.closePopover());
    }

    createEmployeeResignation(upsertEmployeeResignationPopUp) {
        upsertEmployeeResignationPopUp.openPopover();
        this.statusTitle = this.translateService.instant('EMPLOYEERESIGNATION.ADDEMPLOYEERESIGNATION');

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
            approvedDate: new FormControl(null),
            resignationApprovedById: new FormControl(null),
            lastDate: new FormControl(null),
            resignationStatusId: new FormControl(null),
            commentByEmployer: new FormControl(null),
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

    getSelectedEmployees() {
        const employeeListDataDetailsList = this.employeesList;
        const employmentIds = this.employeeResignationForm.controls['employeeId'].value;

        const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
            return employmentIds.toString().includes(x.employeeId);
        })
        const employeeNames = employeeListDataDetails.map((x) => x.userName);
        this.selectedEmployees = employeeNames.toString();
    }

    goToProfile(userId) {
        this.router.navigate(["dashboard/profile", userId, "overview"]);
      }
}
