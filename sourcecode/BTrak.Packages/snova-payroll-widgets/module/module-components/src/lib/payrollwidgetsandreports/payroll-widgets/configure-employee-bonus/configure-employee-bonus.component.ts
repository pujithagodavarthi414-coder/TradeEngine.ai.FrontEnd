import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { PayRollService } from '../../services/PayRollService';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeBonus } from '../../models/employee-bonus';
import { PayRollComponentModel } from '../../models/PayRollComponentModel';
import { ToastrService } from 'ngx-toastr';
import * as moment_ from 'moment';
const moment = moment_;
import { EmployeeModel } from '../../models/employee-model';
import { EmployeeListModel } from '../../models/employee-list-model';
import * as _ from "underscore";
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';

@Component({
  selector: 'app-configure-employee-bonus',
  templateUrl: './configure-employee-bonus.component.html',
  styleUrls: ['./configure-employee-bonus.component.scss']
})
export class ConfigureEmployeeBonusComponent extends CustomAppBaseComponent implements OnInit {

  @Input("selectedEmployeeId")
  set selectedEmployeeId(data: string) {
    if(this.router.url.includes("dashboard/profile/")){
      this.bonusEmployeeId = data;
    }
    this.getEmployeesBonus();
  }
  
  @ViewChildren("upsertPayGradePopUp") upsertPayGradePopover;
  @ViewChildren("deletePayGradePopUp") deletePayGradePopover;
  @ViewChildren("approveBonusPopUp") approveBonusPopover;
  @ViewChild("allEmployeeSelected") private allEmployeeSelected: MatOption;

  ngOnInit() {
    this.clearForm();
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.getAllEmployees();
    this.getPayRollComponents();

    if(this.router.url.includes("dashboard/profile/")){
      this.disableEmployeeBonusDropDown = true;
    }
    else{
      this.disableEmployeeBonusDropDown = false;
    }
    this.getEmployeesBonus();
  }

  constructor(private payRollService: PayRollService,
    private translateService: TranslateService, private cdRef: ChangeDetectorRef, private toastr: ToastrService,
    private router: Router) {
    super();
  }
  payGradeForm: FormGroup;
  isThereAnError: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  isFiltersVisible: boolean;
  isArchived: boolean = false;
  employeesBonus: EmployeeBonus[];
  payGradeName: string;
  payGradeId: string;
  employeeBonus: EmployeeBonus;
  validationMessage: string;
  searchText: string;
  temp: any;
  timeStamp: any;
  isPayGradeArchived: boolean = false;
  payGradeEdit: string;
  employeesDropDown: EmployeeModel[];
  isNew: boolean = true;
  isApproved: boolean;
  payRollComponents: PayRollComponentModel[];
  generatedDate: Date;
  employeesList: EmployeeModel[];
  selectedEmployees: string;
  selectedEmployee: string;
  bonusEmployeeId: string;
  disableEmployeeBonusDropDown: boolean = false;
  softLabels:SoftLabelConfigurationModel[];

  
  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }



  getPayRollComponents() {
    var payRollComponentModel = new PayRollComponentModel();
    payRollComponentModel.isArchived = false;
    payRollComponentModel.isVisible = true;

    this.payRollService.getAllPayRollComponents(payRollComponentModel).subscribe((response: any) => {
      if (response.success == true) {
        this.payRollComponents = response.data;
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  getEmployeesBonus() {
    this.isAnyOperationIsInprogress = true;
    if(this.bonusEmployeeId == undefined)
    this.bonusEmployeeId = null;
    this.payRollService.getEmployeesBonus(this.bonusEmployeeId).subscribe((response: any) => {
      if (response.success == true) {
        this.isThereAnError = false;
        this.employeesBonus = response.data;

        this.temp = this.employeesBonus;
        this.filterSlabs();
        this.clearForm();
        this.cdRef.detectChanges();

      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  filterSlabs() {
    this.employeesBonus = this.temp.filter(slab => slab.isArchived == this.isArchived);
  }

  closeUpsertEmployeeBonussPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertPayGradePopover.forEach((p) => p.closePopover());
  }

  closeDeleteEmployeeBonusDialog() {
    this.isThereAnError = false;
    this.deletePayGradePopover.forEach((p) => p.closePopover());
  }

  closeDeleteApproveBonusDialog() {
    this.isThereAnError = false;
    this.approveBonusPopover.forEach((p) => p.closePopover());
  }
  createEmployeeBonusPopupOpen(upsertPayGradePopUp) {
    this.isNew = true;
    this.payGradeEdit = this.translateService.instant("EMPLOYEEBONUS.ADDEMPLOYEEBONUS");
    this.cdRef.detectChanges();
    upsertPayGradePopUp.openPopover();
  }

  editEmployeeBonusPopupOpen(row, upsertPayGradePopUp) {
    this.isNew = false;
    this.payGradeForm.patchValue(row);
    this.payGradeId = row.id;
    this.employeeBonus = row;
    this.selectedEmployee = row.employeeName;

    this.payGradeEdit = this.translateService.instant("EMPLOYEEBONUS.EDITEMPLOYEEBONUS");
    upsertPayGradePopUp.openPopover();
  }

  deleteEmployeeBonusPopUpOpen(row, deletePayGradePopUp) {
    this.employeeBonus = row;

    this.employeeBonus.IsArchived = !row.isArchived;

    deletePayGradePopUp.openPopover();
  }

  approveBonusPopUpOpen(row, approveBonusPopUp) {
    this.employeeBonus = row;
    this.isApproved = row.isApproved;
    this.employeeBonus.IsApproved = !row.isApproved;

    approveBonusPopUp.openPopover();
  }

  upsertEmployeeBonus(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;
    this.employeeBonus = this.payGradeForm.value;
    this.employeeBonus.Id = this.payGradeId;
    if(this.disableEmployeeBonusDropDown == true && this.employeeBonus.Id == null){
      this.employeeBonus.employeeIds.push (this.bonusEmployeeId);
    }

    if (this.employeeBonus.type == 0) {
      this.employeeBonus.percentage = null;
      this.employeeBonus.Bonus = this.employeeBonus.value;
      this.employeeBonus.isCtcType = false;
      this.employeeBonus.payRollComponentId = null;
    }
    if (this.employeeBonus.type == 1) {
      this.employeeBonus.Bonus = null;
      this.employeeBonus.percentage = this.employeeBonus.value;
    }

    if (this.employeeBonus.amountType == 0) {
      this.employeeBonus.isCtcType = false;
    }
    if (this.employeeBonus.amountType == 1) {
      this.employeeBonus.isCtcType = true;
      this.employeeBonus.payRollComponentId = null;
    }

    if (this.employeeBonus.type == 1 && this.employeeBonus.amountType == null) {
      this.toastr.error("", this.translateService.instant("EMPLOYEEACCOUNTDETAILS.AMOUNTTYPEISREQUIRED"));
    }
    else if (this.employeeBonus.amountType == 0 && this.employeeBonus.payRollComponentId == null) {
      this.toastr.error("", this.translateService.instant("EMPLOYEEACCOUNTDETAILS.PAYROLLCOMPONENTISREQUIRED"));
    }
    else if (this.employeeBonus.percentage > 100) {
      this.toastr.error("", this.translateService.instant("EMPLOYEEACCOUNTDETAILS.PERCENTAGEVALIDATION"));
    }
    else {
      this.payRollService.upsertEmployeeBonus(this.employeeBonus).subscribe((response: any) => {
        if (response.success == true) {
          this.upsertPayGradePopover.forEach((p) => p.closePopover());
          this.clearForm();
          formDirective.resetForm();
          this.getEmployeesBonus();
        }
        else {
          this.isThereAnError = true;
          this.validationMessage = response.apiResponseMessages[0].message;
        }
        this.isAnyOperationIsInprogress = false;
      });
    }
  }

  deleteEmployeeBonus() {
    this.isAnyOperationIsInprogress = true;

    this.payRollService.upsertEmployeeBonus(this.employeeBonus).subscribe((response: any) => {
      if (response.success == true) {
        this.isAnyOperationIsInprogress = false;
        this.deletePayGradePopover.forEach((p) => p.closePopover());
        this.approveBonusPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.getEmployeesBonus();
      }
      else {
        this.isAnyOperationIsInprogress = false;
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  clearForm() {
    this.payGradeName = null;
    this.payGradeId = null;
    this.employeeBonus = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.timeStamp = null;
    this.searchText = null;
    this.isAnyOperationIsInprogress = false;
    this.payGradeForm = new FormGroup({
      value: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      employeeIds: new FormControl([],
        Validators.compose([
        ])
      ),
      employeeId: new FormControl(null,
        Validators.compose([
        ])
      ),
      employeeName: new FormControl(null,
        Validators.compose([
        ])
      ),
      employeeNumber: new FormControl(null,
        Validators.compose([
        ])
      ),
      amountType: new FormControl(null, []
      ),
      type: new FormControl(null, []
      ),
      payRollComponentId: new FormControl(null, []
      ),
      generatedDate: new FormControl(null, []
      ),
    })
  }
  getAllEmployees() {
    this.payRollService.getEmployees().subscribe((responseData: any) => {
      this.employeesDropDown = responseData.data;
      this.employeesList = responseData.data;
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

    const temp = this.temp.filter((bonus => (((bonus.bonus != null && bonus.bonus.toString().toLowerCase().indexOf(this.searchText) > -1)
      || (bonus.employeeName.toString().toLowerCase().indexOf(this.searchText) > -1) || (bonus.employeeNumber.toString().toLowerCase().indexOf(this.searchText) > -1)
      || (bonus.percentage != null && bonus.percentage.toString().toLowerCase().indexOf(this.searchText) > -1)
      || (bonus.payRollComponentName != null && bonus.payRollComponentName.toString().toLowerCase().indexOf(this.searchText) > -1)
      || (bonus.generatedDate == null ? null : moment(bonus.generatedDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.searchText) > -1)
      || (('yes'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? bonus.isCtcType == true :
        ('no'.indexOf(this.searchText.toString().toLowerCase()) > -1) ? bonus.isCtcType != true : null))) && bonus.isArchived == this.isArchived));
    this.employeesBonus = temp;
  }

  closeSearch() {
    this.searchText = "";
    this.filterByName(null);
  }

  changeType(value) {
    if (value == 0) {
      this.payGradeForm.controls['amountType'].setValue(null);
      this.payGradeForm.controls['payRollComponentId'].setValue(null);
      this.payGradeForm.controls['isCtcType'].setValue(false);
    }
  }
  changeAmountType(value) {
    if (value == 1) {
      this.payGradeForm.controls['payRollComponentId'].setValue(null);
    }
    else {
      this.payGradeForm.controls['isCtcType'].setValue(false);
    }
  }

  getSelectedEmployees() {
    const employeeListDataDetailsList = this.employeesList;
    const employmentIds = this.payGradeForm.controls['employeeIds'].value;
    const index = employmentIds.indexOf(0);
    if (index > -1) {
      employmentIds.splice(index, 1);
    }

    const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
      return employmentIds.toString().includes(x.employeeId);
    })
    const employeeNames = employeeListDataDetails.map((x) => x.nickName);
    this.selectedEmployees = employeeNames.toString();
  }

  toggleAllEmployeesSelected() {
    if (this.allEmployeeSelected.selected) {
      this.payGradeForm.controls['employeeIds'].patchValue([
        ...this.employeesList.map((item) => item.employeeId),
        0
      ]);
    } else {
      this.payGradeForm.controls['employeeIds'].patchValue([]);
    }
    this.getSelectedEmployees();
  }

  toggleEmployeePerOne() {
    if (this.allEmployeeSelected.selected) {
      this.allEmployeeSelected.deselect();
      return false;
    }
    if (this.payGradeForm.controls['employeeIds'].value.length === this.employeesList.length) {
      this.allEmployeeSelected.select();
    }
    this.getSelectedEmployees();
  }

  getSelectedEmployee() {
    const employeeListDataDetailsList = this.employeesList;
    const employmentIds = this.payGradeForm.controls['employeeId'].value;

    const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
      return employmentIds.toString().includes(x.employeeId);
    })
    const employeeNames = employeeListDataDetails.map((x) => x.nickName);
    this.selectedEmployee = employeeNames.toString();
  }

  goToProfile(userId) {
    this.router.navigate(["dashboard/profile", userId, "overview"]);
  }
}
