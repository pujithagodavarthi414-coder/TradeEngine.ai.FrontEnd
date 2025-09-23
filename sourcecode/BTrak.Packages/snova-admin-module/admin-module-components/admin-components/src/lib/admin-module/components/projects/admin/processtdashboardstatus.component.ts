import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../../models/dashboardFilterModel';
import { ProjectManagementService } from '../../../services/project-management.service';
import { processDashboard } from '../../../models/projects/processDashboard';
import { SoftLabelConfigurationModel } from '../../../models/hr-models/softlabels-model';
import { SoftLabelPipe } from '../../../pipes/softlabels.pipes';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';


@Component({
  selector: "app-pm-component-processdashboardstatus",
  templateUrl: "processdashboardstatus.component.html"
})
export class ProcessDashboardStatusComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress: boolean;
  processDashboardStatus: processDashboard[];
  processDashboard: processDashboard;
  showSpinner: boolean;
  isThereAnError: boolean;
  validationmessage: string;
  processDashboardStatusForm: FormGroup;
  processDashboardStatusName: string;
  searchText: string;
  ProcessDashboarsStatusId: string;
  timeStamp: any;
  titletext: string;
  buttontext: string;
  showPlusIcon: boolean;
  showRefreshIcon: boolean;
  toastrMessage: string;
  processDashboardInProgress: boolean = false;
  @ViewChildren('createProcessStatusPopover') createProcessStatusPopovers;

  public color = "";

  constructor(private softLabelsPipe: SoftLabelPipe, private dashboardService: ProjectManagementService,
    private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
    super();
    
    
  }

  ngOnInit() {
    this.clearForm();
    this.getSoftLabelConfigurations();
    super.ngOnInit();
    this.GetAllProcessDashboardStatus();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  createProcessStatusPopup(createProcessStatusPopover) {
    createProcessStatusPopover.openPopover();
    this.cdRef.detectChanges();
  }

  GetAllProcessDashboardStatus() {
    this.processDashboardInProgress = true;
    let processdashboardstatus = new processDashboard();
    this.dashboardService
      .GetAllProcessDashboardStatus(processdashboardstatus)
      .subscribe((responseData: any) => {
        this.processDashboardInProgress = false;
        this.processDashboardStatus = responseData.data;
        this.cdRef.detectChanges();
      });

  }

  clearForm() {
    this.showSpinner = false;
    this.showPlusIcon = true;
    this.showRefreshIcon = false;
    this.color = "";
    this.anyOperationInProgress = false;
    this.ProcessDashboarsStatusId = null;
    this.isThereAnError = false;
    this.titletext = this.translateService.instant('PROCESSDASHBOARDSTATUS.CREATEPROCESSDASHBOARDSTATUS');
    this.buttontext = this.translateService.instant('PROCESSDASHBOARDSTATUS.ADD');
    this.processDashboardStatusForm = new FormGroup({
      statusShortName: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      processDashboardStatusHexaValue: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)])
      )
    });
  }

  SaveProcessDashboardStatus(formDirective: FormGroupDirective) {
    this.showSpinner = true;
    this.anyOperationInProgress = true;
    this.processDashboard = this.processDashboardStatusForm.value;
    this.processDashboard.processDashboardStatusId = this.ProcessDashboarsStatusId;
    this.processDashboard.timeStamp = this.timeStamp;
    this.processDashboard.processDashboardStatusName = this.processDashboardStatusName;
    this.dashboardService.UpsertprocessDashboardStatus(this.processDashboard).subscribe((responseData: any) => {
      this.anyOperationInProgress = false;
      this.showSpinner = false;

      if (responseData.data != null) {
        if (this.processDashboard.processDashboardStatusId === null ||
          this.processDashboard.processDashboardStatusId === undefined || this.processDashboard.processDashboardStatusId === "") {
          this.toastrMessage = this.processDashboard.statusShortName + " " + this.translateService.instant('PROCESSDASHBOARDSTATUS.PROCESSDASHBOARDSTATUSCREATEDSUCCESSFULLY');
        } else {
          this.toastrMessage = this.processDashboard.statusShortName + " " + this.translateService.instant('PROCESSDASHBOARDSTATUS.PROCESSDASHBOARDSTATUSUPDATEDSUCCESSFULLY');
        }
        this.snackbar.open(this.softLabelsPipe.transform(this.toastrMessage, this.softLabels), "", { duration: 3000 });
        formDirective.resetForm();
        this.clearForm();
        this.createProcessStatusPopovers.forEach((p) => p.closePopover());
        this.GetAllProcessDashboardStatus();
      } else {
        this.isThereAnError = true;
        this.validationmessage = responseData.apiResponseMessages[0].message;
        this.cdRef.detectChanges();
      }
    });
    this.cdRef.detectChanges();
  }

  EditProcessDashboardById(processdashboard, createProcessStatusPopover) {
    this.titletext = this.translateService.instant('PROCESSDASHBOARDSTATUS.UPDATEPROCESSDASHBOARDSTATUS');
    this.buttontext = this.translateService.instant('PROCESSDASHBOARDSTATUS.UPDATE');
    this.isThereAnError = false;
    this.showPlusIcon = false;
    this.showRefreshIcon = true;
    this.color = processdashboard.processDashboardStatusHexaValue;
    this.timeStamp = processdashboard.timeStamp;
    this.processDashboardStatusName = processdashboard.processDashboardStatusName;
    this.ProcessDashboarsStatusId = processdashboard.processDashboardStatusId;
    this.processDashboardStatusForm = new FormGroup({
      statusShortName: new FormControl(
        processdashboard.statusShortName,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      processDashboardStatusHexaValue: new FormControl(
        processdashboard.processDashboardStatusHexaValue,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
    createProcessStatusPopover.openPopover();
    this.cdRef.detectChanges();
  }

  setMyStyles({ row, column, value }): any {
    let styles = {
      'background': row.processDashboardStatusHexaValue,
    };
    return styles;
  }

  closeSearch() {
    this.searchText = '';
  }

  closeDialog(formDirective: FormGroupDirective) {
    this.clearForm();
    formDirective.resetForm();
    this.createProcessStatusPopovers.forEach((p) => p.closePopover());
  }
}
