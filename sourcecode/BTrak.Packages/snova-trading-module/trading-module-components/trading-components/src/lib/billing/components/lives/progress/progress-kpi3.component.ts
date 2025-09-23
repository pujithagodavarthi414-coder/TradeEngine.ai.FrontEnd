import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor, State } from "@progress/kendo-data-query";
import { MatMenuTrigger } from "@angular/material/menu";
import { Guid } from "guid-typescript";
import { KP03Form } from '../../../models/kp03-form';
import { LivesManagementService } from '../../../services/lives-management.service';
import { ProgressModel } from '../../../models/progress-model';
import { ProgramModel } from '../../../models/programs-model';

@Component({
  selector: 'app-progress-kpi3',
  templateUrl: './progress-kpi3.component.html'
})

export class ProgressKPI3Component extends AppBaseComponent implements OnInit {
  @ViewChild("menuTrigger") trigger: MatMenuTrigger;
  @ViewChildren("archiveBudgetPopup") archiveBudgetPopUps;
  @ViewChildren("verifyProgressPopup") verifyProgressPopups;
  @ViewChild("AddProgressDialogComponent") progressDetailDialog: TemplateRef<any>;

  progressListData: GridDataResult = {
    data: [],
    total: 0
  };

  state: State = {
    skip: 0,
    take: 10,
  };
  progressList: any = [];
  isLoadingInProgress: boolean;
  selectedItem: any = {};
  formName: string;
  isArchived: boolean;
  showFilter: any;
  programId: string;
  isFilterVisible: boolean = true;
  submittedResult: any
  kpiId: any;
  dataSetId: string;
  formData: any;
  isArchiveLoading: boolean;
  selectedTab: string;
  isButtonDisabled: boolean;
  isEdit: boolean;
  progressId: any;
  isVerifyLoading: boolean;
  programDetails: any = [];
  tempData: any;

  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private snackbar: MatSnackBar,
    private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, public livesServices: LivesManagementService) {
    super();

  }

  ngOnInit() {
    // var data = {};
    // data["programFormData"] = {};
    // data["programFormData"]["programName"] = "Smile Program";
    // data["programFormData"]["phase"] = "Phase 01";
    // data["programFormData"]["location"] = "Indonesia";
    // data["programFormData"]["date"] = "August 2022 - July 2032";
    // data["programFormData"]["numberOfTimesFBB"] = "3";
    // data["programFormData"]["quantityOfFBB"] = "3";
    // this.progressListData.data.push(data);
    // this.progressListData.total = 1;
    this.getProgramProgress();
    this.getPrograms();
  }

  filterClick() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  archive() {
    this.isArchived = !this.isArchived;
    this.getProgramProgress();
    this.getPrograms();
  }

  uploadEventHandler(file, event) {

  }

  openOptionsMenu(dataItem) {
    this.selectedItem = dataItem;
    // this.trigger.openMenu();
  }

  closePopup() {
    this.trigger.closeMenu();
  }

  selectedRow(event) {

  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    let progressList = this.progressList;
    if (this.state.sort) {
      progressList = orderBy(this.progressList, this.state.sort);
    }
    this.progressListData = {
      data: progressList.slice(this.state.skip, this.state.take + this.state.skip),
      total: this.progressList.length
    }
  }

  cancelPopUp() {
    this.archiveBudgetPopUps.forEach((p) => p.closePopover());
  }

  archivePopUpOpen(popup) {
    popup.openPopover();
  }

  deleteProgress() {
    var progressData = new ProgressModel();
    progressData = this.selectedItem;
    progressData["KPIType"] = "KPI03";
    progressData.isArchived = !this.isArchived;
    this.isArchiveLoading = true;
    this.upsertProgramProgress(progressData);
  }

  openProgressDialog() {
    this.progressId = Guid.create().toString();
    let dialogId = "app-dialog-progress";
    const dialogRef = this.dialog.open(this.progressDetailDialog, {
      minWidth: "80vw",
      minHeight: "50vh",
      maxHeight: "95vh",
      id: dialogId,
      data: {
        dialogId: dialogId,
        kpiName: 'KPI03',
        components: KP03Form,
        dataSourceId: "32012a3b-0dae-4a24-b844-d627fdf7e53e",
        programId: this.programId,
        dataSetId: this.progressId,
        isVerified: false,
        isNewRecord: true
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getProgramProgress();
        this.toastr.success("", 'Progress added');
      } else if (result.formData) {
        this.submittedResult = result;
        this.toastr.success("", 'Progress added');
      }
      this.submittedResult = null;
    });
  }

  editProgressPoup() {
    this.progressId = this.selectedItem.dataSetId;
    let dialogId = "app-dialog-progress";
    const dialogRef = this.dialog.open(this.progressDetailDialog, {
      minWidth: "80vw",
      minHeight: "50vh",
      maxHeight: "95vh",
      id: dialogId,
      data: {
        dialogId: dialogId,
        formData: this.selectedItem.formData,
        kpiName: 'KPI03',
        components: KP03Form,
        dataSourceId: "32012a3b-0dae-4a24-b844-d627fdf7e53e",
        programId: this.programId,
        dataSetId: this.progressId,
        isVerified: this.selectedItem.isVerified,
        isNewRecord: false
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getProgramProgress();
        this.toastr.success("", "Progress updated");
      } else if (result.formData) {
        this.toastr.success("", "Progress updated");
      }
    });
  }

  getProgramProgress() {
    this.isLoadingInProgress = true;
    var programProgress = {};
    programProgress["KPIType"] = "KPI03";
    programProgress["IsArchived"] = this.isArchived;
    this.livesServices.getProgramProgress(programProgress)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data.length > 0) {
            this.progressList = responseData.data;
            this.tempData = responseData.data;
            this.progressListData = {
              data: this.tempData.slice(this.state.skip, this.state.take + this.state.skip),
              total: this.tempData.length
            };
          } else {
            this.progressList = [];
            this.isLoadingInProgress = false;
          }
          this.isLoadingInProgress = false;
          this.cdRef.detectChanges();
        }
        else {
          this.progressList = [];
          this.isLoadingInProgress = false;
          this.toastr.error("", responseData.apiResponseMessages[0].message);
        }
      });
  }
  upsertProgramProgress(progressData) {
    progressData.dataSourceId = '33a4e826-8c5c-4c7d-81c5-81bf4b2dae6f';
    progressData.isNewRecord = false;
    this.livesServices.upsertProgramProgress(progressData)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          this.getProgramProgress();
          this.isLoadingInProgress = false;
          this.isVerifyLoading = false;
          this.isArchiveLoading = false;
          this.cancelPopUp();
          this.cdRef.detectChanges();
        }
        else {
          this.isLoadingInProgress = false;
          this.isVerifyLoading = false;
          this.isArchiveLoading = false;
          this.toastr.error("", responseData.apiResponseMessages[0].message);
        }
      });
  }

  getPrograms() {
    var programModel = new ProgramModel();
    programModel.isArchived = this.isArchived;
    this.livesServices.getPrograms(programModel).subscribe((response: any) => {
      if (response.success) {
        this.programDetails = response.data;
        this.programId = this.programDetails[0].programId;
      } else {
        this.programDetails = [];
        this.programId = null;
      }
    });
  }
  verifyProgressPoupOpen(popup) {
    popup.openPopover();
  }
  verifyProgress() {
    this.isVerifyLoading = true;
    var progressData = new ProgressModel();
    progressData = this.selectedItem;
    progressData.isVerified = true;
    progressData.kpiType = 'KPI03';
    this.upsertVerifyProgramProgress(progressData);
  }
  cancelVerifyPopUp() {
    this.verifyProgressPopups.forEach((p) => p.closePopover());
  }
  upsertVerifyProgramProgress(progressData) {
    this.isLoadingInProgress = true;
    progressData.dataSourceId = '33a4e826-8c5c-4c7d-81c5-81bf4b2dae6f';
    progressData.isNewRecord = false;
    this.livesServices.upsertProgramProgress(progressData)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          this.getProgramProgress();
          this.isLoadingInProgress = false;
          this.isVerifyLoading = false;
          this.cancelVerifyPopUp();
          this.cdRef.detectChanges();
        }
        else {
          this.isLoadingInProgress = false;
          this.isVerifyLoading = false;
          this.toastr.error("", responseData.apiResponseMessages[0].message);
        }
      });
  }

}
