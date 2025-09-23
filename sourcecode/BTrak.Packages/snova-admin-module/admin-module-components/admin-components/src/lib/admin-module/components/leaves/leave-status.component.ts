import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { LeaveStatusModel } from '../../models/leaves-models/leave-status-model';
import { LeavesManagementService } from '../../services/leaves-management.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
  selector: 'app-fm-component-leave-status',
  templateUrl: `leave-status.component.html`
})

export class LeaveStatusComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChildren("upsertLeaveStatusPopUp") upsertLeaveStatusPopover;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  isAnyOperationIsInprogress: boolean = false;
  leaveStatuss: LeaveStatusModel[];
  leaveStatusForm: FormGroup;
  isThereAnError: boolean = false;
  leaveStatusName: string;
  leaveStatusColour: string;
  leaveStatusId: string;
  leaveStatus: LeaveStatusModel;
  validationMessage: string;
  leaveStatusDetails: LeaveStatusModel;
  timeStamp: any;
  searchText: string;
  temp: any;
  leaveStatusEdit: string;
  public color: string = "";

  constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
    private leaveStatusService: LeavesManagementService) { super(); }

  ngOnInit() {
    this.clearForm();
    super.ngOnInit();
    this.initializeForm();
    this.getAllLeaveStatuss();

  }


  initializeForm() {
    this.leaveStatusForm = new FormGroup({

      leaveStatusName: new FormControl(null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ),
      leaveStatusColour: new FormControl(null,
        Validators.compose([
        ])
      ),

    })
  }

  getAllLeaveStatuss() {
    this.isAnyOperationIsInprogress = true;
    this.leaveStatusDetails = new LeaveStatusModel();

    this.leaveStatusService.getAllLeaveStatuss(this.leaveStatusDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.leaveStatuss = response.data;
        this.temp = this.leaveStatuss;
        this.clearForm();
      }
      if (response.success == false) {
        this.isThereAnError = true;
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.cdRef.detectChanges();
    });
  }

  closeUpsertLeaveStatusPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertLeaveStatusPopover.forEach((p) => p.closePopover());
  }

  createLeaveStatusPopupOpen(upsertLeaveStatusPopUp) {
    upsertLeaveStatusPopUp.openPopover();
    this.leaveStatusEdit = this.translateService.instant('LEAVESTATUS.ADDLEAVESTATUS');
  }

  editLeaveStatusPopupOpen(row, upsertLeaveStatusPopUp) {
    this.leaveStatusForm.patchValue(row);
    this.leaveStatusId = row.leaveStatusId;
    this.timeStamp = row.timeStamp;
    this.leaveStatusColour = row.leaveStatusColour;
    this.leaveStatusEdit = this.translateService.instant('LEAVESTATUS.EDITLEAVESTATUS');
    upsertLeaveStatusPopUp.openPopover();
  }

  upsertLeaveStatus(formDirective: FormGroupDirective) {
    this.isAnyOperationIsInprogress = true;

    this.leaveStatus = this.leaveStatusForm.value;
    this.leaveStatus.leaveStatusName = this.leaveStatus.leaveStatusName.toString().trim();
    this.leaveStatus.leaveStatusId = this.leaveStatusId;
    this.leaveStatus.timeStamp = this.timeStamp;
    this.leaveStatus.leaveStatusColour = this.leaveStatus.leaveStatusColour;
    this.leaveStatusService.upsertLeaveStatus(this.leaveStatus).subscribe((response: any) => {
      if (response.success == true) {
        this.upsertLeaveStatusPopover.forEach((p) => p.closePopover());
        this.getAllLeaveStatuss();
        formDirective.resetForm();
      }
      else {
        this.isThereAnError = true;
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  clearForm() {
    this.leaveStatusName = null;
    this.leaveStatusId = null;
    this.leaveStatus = null;
    this.leaveStatusColour = null;
    this.isThereAnError = false;
    this.validationMessage = null;
    this.searchText = null;
    this.isAnyOperationIsInprogress = false;
    this.leaveStatusForm = new FormGroup({
      leaveStatusName: new FormControl(null,

        Validators.compose([
          Validators.required,
          Validators.maxLength(ConstantVariables.MaxLength)
        ])
      ),

      leaveStatusColour: new FormControl(null,
        Validators.compose([
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

    const temp = this.temp.filter(leaveStatus => leaveStatus.leaveStatusName.toLowerCase().indexOf(this.searchText) > -1);
    this.leaveStatuss = temp;
  }

  closeSearch() {
    this.filterByName(null);
  }
}
