import { Component, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProjectManagementService } from '../../services/project-management.service';
import { UserStoryStatusModel } from '../../models/projects/user-story-status-model';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';

@Component({
  selector: "app-pm-component-userstorystatus",
  templateUrl: "user-story-status.component.html"
})

export class UserStoryStatusComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress: boolean;
  isArchived: boolean;
  userStoryStatuses: UserStoryStatusModel[];
  taskStatuses: any;
  temp: any;
  userStoryStatus: UserStoryStatusModel;
  isThereAnError: boolean;
  validationmessage: string;
  userStoryStatusForm: FormGroup;
  userStoryStatusName: string;
  userStoryStatusId: string;
  taskStatusId: string;
  timeStamp: any;
  titletext: string;
  buttontext: string;
  searchText: string;
  validationMessage: string
  public color = "";
  processDashboardInProgress: boolean = false;
  canAccess_feature_ManageWorkItemStatus: Boolean;

  @ViewChildren('createUserStoryStatusPopover') createProcessStatusPopovers;
  @ViewChildren('deleteUserStoryStatusPopover') deleteUserStoryStatusPopover;

  constructor(
    private projectService: ProjectManagementService,
    private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
    super();
    
    
  }

  ngOnInit() {
    super.ngOnInit();
    this.clearForm();
    this.getSoftLabels();
    this.SearchTaskStatuses();
    this.getAllUserStoryStatuses();
    // this.canAccess_feature_ManageWorkItemStatus$.subscribe((x)=>{
    //   this.canAccess_feature_ManageWorkItemStatus = x;
    //   if( this.canAccess_feature_ManageWorkItemStatus) {
    //     this.getAllUserStoryStatuses();
    //   }
    // })
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  createProcessStatusPopup(createProcessStatusPopover) {
    createProcessStatusPopover.openPopover();
  }

  SearchTaskStatuses() {
    this.projectService.SearchTaskStatuses()
      .subscribe((responseData: any) => {
        this.taskStatuses = responseData.data;
        this.cdRef.detectChanges();
      });

  }

  getAllUserStoryStatuses() {
    this.processDashboardInProgress = true;
    let processdashboardstatus = new UserStoryStatusModel();
    processdashboardstatus.IsArchived = this.isArchived;
    this.projectService.SearchUserstoryStatuses(processdashboardstatus)
      .subscribe((responseData: any) => {
        this.processDashboardInProgress = false;
        this.userStoryStatuses = responseData.data;
        this.temp = this.userStoryStatuses;
        this.cdRef.detectChanges();
      });
  }

  clearForm() {
    this.color = "";
    this.anyOperationInProgress = false;
    this.userStoryStatusId = null;
    this.isThereAnError = false;
    this.titletext = this.translateService.instant('USERSTORYSTATUS.ADDUSERSTORYSTATUSTITLE');
    this.buttontext = this.translateService.instant('USERSTORYSTATUS.ADD');
    this.userStoryStatusForm = new FormGroup({
      userStoryStatusName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)])),
      userStoryStatusColor: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)])),
      taskStatusId: new FormControl("", Validators.required)
    });
  }

  SaveProcessDashboardStatus(formDirective: FormGroupDirective) {
    this.anyOperationInProgress = true;
    this.userStoryStatus = this.userStoryStatusForm.value;
    this.userStoryStatus.userStoryStatusId = this.userStoryStatusId;
    this.userStoryStatus.timeStamp = this.timeStamp;
    this.projectService
      .upsertUserstoryStatus(this.userStoryStatus)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          this.isThereAnError = false;
          formDirective.resetForm();
          this.clearForm();
          this.createProcessStatusPopovers.forEach((p) => p.closePopover());
          this.getAllUserStoryStatuses();
        }
        else {
          this.isThereAnError = true;
          this.validationMessage = responseData.apiResponseMessages[0].message;
          //    this.validationMessage = responseData.apiResponseMessages[0].message;
          //   this.toastr.error(this.validationMessage);
          this.anyOperationInProgress = false;

        }
        this.cdRef.detectChanges();
      });
  }

  EditProcessDashboardById(row, createProcessStatusPopover) {
    this.titletext = this.translateService.instant('USERSTORYSTATUS.EDITUSERSTORYSTATUSTITLE');
    this.buttontext = this.translateService.instant('USERSTORYSTATUS.EDIT');
    this.isThereAnError = false;
    this.timeStamp = row.timeStamp;
    this.userStoryStatusId = row.userStoryStatusId;
    this.userStoryStatusForm.patchValue(row);
    createProcessStatusPopover.openPopover();
  }

  deleteUserStoryStatusPopUpOpen(row, deleteGoalReplanTypePopUp) {
    this.userStoryStatusId = row.userStoryStatusId;
    this.userStoryStatusName = row.userStoryStatusName;
    this.color = row.userStoryStatusColor;
    this.taskStatusId = row.taskStatusId;
    this.timeStamp = row.timeStamp;
    deleteGoalReplanTypePopUp.openPopover();
  }

  closeDeleteUserStoryStatusDialog() {
    this.clearForm();
    this.deleteUserStoryStatusPopover.forEach((p) => p.closePopover());
  }

  deleteUserStoryStatuses() {
    this.anyOperationInProgress = true;

    this.userStoryStatus = new UserStoryStatusModel();
    this.userStoryStatus.userStoryStatusId = this.userStoryStatusId;
    this.userStoryStatus.userStoryStatusName = this.userStoryStatusName;
    this.userStoryStatus.timeStamp = this.timeStamp;
    this.userStoryStatus.taskStatusId = this.taskStatusId;
    this.userStoryStatus.userStoryStatusColor = this.color;
    this.userStoryStatus.IsArchived = !this.isArchived;

    this.projectService.upsertUserstoryStatus(this.userStoryStatus).subscribe((response: any) => {
      if (response.success == true) {
        this.deleteUserStoryStatusPopover.forEach((p) => p.closePopover());
        this.isThereAnError = false;
        this.clearForm();
        this.getAllUserStoryStatuses();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      }
    });
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }

    const temp = this.temp.filter(userStoryStatus => (userStoryStatus.userStoryStatusName.toLowerCase().indexOf(this.searchText) > -1) || (userStoryStatus.taskStatusName.toLowerCase().toString().indexOf(this.searchText) > -1));
    this.userStoryStatuses = temp;
  }

  closeSearch() {
    this.filterByName(null);
  }

  closeDialog(formDirective: FormGroupDirective) {
    this.clearForm();
    formDirective.resetForm();
    this.createProcessStatusPopovers.forEach((p) => p.closePopover());
  }
}
