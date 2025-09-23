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
import { KP02Form } from '../../../models/kp02-form';
import { LivesManagementService } from '../../../services/lives-management.service';
import { ProgressModel } from '../../../models/progress-model';

@Component({
  selector: 'app-progress-kp2',
  templateUrl: './progress-kp2.component.html'
})

export class ProgressKPI2Component extends AppBaseComponent implements OnInit {
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

  isLoadingInProgress: boolean;
  selectedItem: any={};
  formName: string;
  isArchived: boolean = false;
  showFilter: any;
  isFilterVisible: boolean = true;
  submittedResult: any
  kpiId: any;
  dataSetId: string;
  formData: any;
  isArchiveLoading: boolean;
  selectedTab: string;
  isButtonDisabled: boolean;
  isEdit : boolean;
  progressList: any;
  isVerifyLoading: boolean;
  progressId: any;
  tempData: any;

  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private snackbar: MatSnackBar,
    private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, public livesServices: LivesManagementService) {
    super();
    this.isArchived = false;
  }

  ngOnInit() {
    // var data = {};
    // data["programFormData"] = {};
    // data["programFormData"]["programName"] = "Smile Program";
    // data["programFormData"]["phase"] = "Phase 01";
    // data["programFormData"]["location"] = "Indonesia";
    // data["programFormData"]["date"] = "August 2022 - July 2032";
    // data["programFormData"]["shf"] = "3";
    // this.progressListData.data.push(data);
    // this.progressListData.total = 1;
    this.getProgramProgress();
  }

  filterClick() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  archive() {
    this.isArchived = !this.isArchived;
    this.getProgramProgress();
  }

  uploadEventHandler(file, event) {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const formData = new FormData();
      formData.append("files", file);
    this.isLoadingInProgress = true;
    this.livesServices.importPrograProgress(formData)
        .subscribe((responseData: any) => {
            if (responseData.success) {
              this.getProgramProgress();
                this.isLoadingInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isLoadingInProgress = false;
                this.toastr.error("", responseData.apiResponseMessages[0].message);
            }
        });
      }

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
    progressData["KPIType"] = "KPI02";
    progressData.isArchived = !this.isArchived;
    this.upsertProgramProgress(progressData);
  }

  openProgressDialog() {
    this.progressId = Guid.create().toString();
    let dialogId = "app-progress-dialog";
    const dialogRef = this.dialog.open(this.progressDetailDialog, {
        minWidth: "80vw",
        minHeight: "50vh",
        maxHeight: "95vh",
        id: dialogId,
        data: {
            dialogId: dialogId,
            kpiName: 'KPI02',
            components: KP02Form,
            dataSourceId: '5AD67C04-627A-4933-A252-784407BB6012',
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
    let dialogId = "app-kpi-dialog";
    const dialogRef = this.dialog.open(this.progressDetailDialog, {
        minWidth: "80vw",
        minHeight: "50vh",
        maxHeight: "95vh",
        id: dialogId,
        data: {
            dialogId: dialogId,
            formData: this.selectedItem.formData,
            kpiName: 'KPI02',
            components: KP02Form,
            dataSourceId: '5AD67C04-627A-4933-A252-784407BB6012',
            dataSetId: this.selectedItem.dataSetId,
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
    programProgress["KPIType"] = "KPI02";
    programProgress["IsArchived"] = this.isArchived;
    this.livesServices.getProgramProgress(programProgress)
        .subscribe((responseData: any) => {
            if (responseData.success) {
                if(responseData.data.length > 0){
                    this.progressList = responseData.data;
                    this.tempData = responseData.data;
                    this.progressListData = {
                      data: this.tempData.slice(this.state.skip, this.state.take + this.state.skip),
                      total: this.tempData.length
                    };
                } else{
                  this.progressList=[];
                  this.progressListData = {
                      data: this.progressList,
                      total: this.progressList.length > 0 ? this.progressList.length : 0,
                  }
                  this.isLoadingInProgress = false;
                }
                this.isLoadingInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.progressList=[];
                this.isLoadingInProgress = false;
                this.toastr.error("", responseData.apiResponseMessages[0].message);
            }
        });
  }
  upsertProgramProgress(progressData) {
    this.isLoadingInProgress = true;
    progressData.dataSourceId = '5AD67C04-627A-4933-A252-784407BB6012';
    progressData.isNewRecord = false;
    this.livesServices.upsertProgramProgress(progressData)
        .subscribe((responseData: any) => {
            if (responseData.success) {
              this.getProgramProgress();
                this.isLoadingInProgress = false;
                this.cancelPopUp();
                this.cdRef.detectChanges();
            }
            else {
                this.isLoadingInProgress = false;
                this.toastr.error("", responseData.apiResponseMessages[0].message);
            }
        });
  }
  verifyProgressPoupOpen(popup) {
    popup.openPopover();
  }
  verifyProgress(){
    this.isVerifyLoading = true;
    var progressData = new ProgressModel();
    progressData = this.selectedItem;
    progressData.kpiType = 'KPI02';
    progressData.isVerified = true;
    this.upsertVerifyProgramProgress(progressData);
  }
  cancelVerifyPopUp() {
    this.verifyProgressPopups.forEach((p) => p.closePopover());
  }
  upsertVerifyProgramProgress(progressData) {
    this.isLoadingInProgress = true;
    progressData.dataSourceId = '44D9BA24-F183-499F-81CC-8DCE38479549';
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
