import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChildren, Input, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy, ViewContainerRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { TrainingCourseModel } from "../../dependencies/models/training-course-model";
import { TrainingManagementService } from "../../dependencies/services/trainingmanagement.service";
import { ToastrService } from "ngx-toastr";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { WorkspaceDashboardFilterModel, SoftLabelConfigurationModel } from "../../dependencies/models/softLabels-model";
import { WidgetService } from "../../dependencies/services/widget.service";
import { ConstantVariables } from "../../dependencies/constants/constant-variables";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Dashboard } from "../../dependencies/models/dashboard";
import { SoftLabelPipe } from "../../dependencies/pipes/softlabels.pipes";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { TrainingCourseSearchModel } from "../../dependencies/models/training-course-search-model";
import { CustomAddTrainingCourseDialogComponent } from "../add-new-training-course-component/add-new-training-course.component";
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "custom-app-training-courses-view",
  templateUrl: "training-courses-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTrainingCoursesViewComponent extends CustomAppBaseComponent {
  @ViewChildren("archiveTrainingCoursePopUp") archiveTrainingCoursePopover;
  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild("addTrainingCourse") addTrainingCourse: TemplateRef<any>;
  sortDirectionStr: string;
  trainingCourses: any;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data !== undefined && data !== this.dashboardId) {
      this.dashboardId = data;
      this.getTrainingCoursesDashboardFilter();
    }
  }

  @Input("dashboardName")
  set _dashboardName(data: string) {
    if (data != null && data !== undefined) {
      this.dashboardName = data;
    } else {
      this.dashboardName = "Training courses";
    }
  }

  dashboardFilters: DashboardFilterModel;

  trainingCoursesList: any;
  isThereAnError: boolean = false;
  searchText: string = null;
  validationMessage: string = '';
  isEdit: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  updatePersistanceInprogress: boolean = false;
  isArchived: boolean = false;
  isArchiveInProgress: boolean = false;
  trainingCourseDetails = new TrainingCourseModel();
  sortBy: string;
  dashboardId: string;
  dashboardName: string;
  workspaceDashboardFilterId: string;
  changedAppName: string;
  sortDirection: boolean;
  isEditAppName: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  @Output() change = new EventEmitter();
  roleFeaturesIsInProgress$: Observable<boolean>;
  state: State = {
    skip: 0,
    take: 10,
    sort: []
  };

  constructor(
    public MatDialog: MatDialog,
    private trainingService: TrainingManagementService,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private widgetService: WidgetService,
    private translateService: TranslateService,
    private softLabelPipe: SoftLabelPipe,
    private snackbar: MatSnackBar,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.state = {
      skip: 0,
      take: 10
    };
    this.searchTrainingCourses();
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.change.emit();
      this.isEdit = !this.isEdit;
    }
  }

  onEdit(e) {
    this.isEdit = !this.isEdit;
  }

  searchTrainingCourses() {
    this.isAnyOperationIsInprogress = true;
    var trainingSearchModel = new TrainingCourseSearchModel();
    trainingSearchModel.isArchived = this.isArchived;
    trainingSearchModel.sortBy = this.sortBy;
    trainingSearchModel.sortDirectionAsc = this.sortDirection;
    trainingSearchModel.sortDirection = this.sortDirectionStr;
    trainingSearchModel.searchText = this.searchText;
    trainingSearchModel.pageSize = this.state.take;
    trainingSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;
    var localState = this.state;
    this.trainingService.searchTrainingCourses(trainingSearchModel).subscribe((response: any) => {
      if (!this.state) {
        this.state = localState;
      }
      if (response.success == true) {
        let trainingCourses = response.data;
        if (response.data != '') {
          this.trainingCourses = response.data;
        }
        this.trainingCoursesList = {
          data: trainingCourses == '' ? this.trainingCourses : trainingCourses,
          total: response.data.length > 0 ? response.data[0].totalCount : this.trainingCourses[0].totalCount,
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeSearch() {
    this.searchText = null;
    this.searchTrainingCourses();
    this.updateTrainingCourseDashboardFilter();
  }

  openCreateTrainingCourseDialog(data: any) {
    let dialogId = "custom-app-add-new-training-course";
    const dialogRef = this.MatDialog.open(this.addTrainingCourse, {
      width: "65%",
      hasBackdrop: true,
      panelClass: 'expense-dialog-scroll',
      direction: "ltr",
      id: dialogId,
      data: { data: data, formPhysicalId: dialogId },
      disableClose: true
    });

    console.log('at parent - ' + this.viewContainerRef.injector);

    dialogRef.afterClosed().subscribe(() => {
      this.searchTrainingCourses();
    });
  }

  archiveTrainingCoursePopupOpen(row, archiveExpensePopup) {
    this.trainingCourseDetails = { ...row };
    this.trainingCourseDetails.isArchived = !this.isArchived;
    archiveExpensePopup.openPopover();
  }

  closeArchiveTrainingCourseDialog() {
    this.archiveTrainingCoursePopover.forEach((p) => p.closePopover());
    this.trainingCourseDetails = null;
    this.isArchiveInProgress = false;
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
      this.sortDirectionStr = this.state.sort[0].dir;
    }
    this.searchTrainingCourses();
    this.updateTrainingCourseDashboardFilter();
  }

  archiveOrUnArchiveTrainingCourse() {
    this.isArchiveInProgress = true;
    this.trainingService.archiveOrUnArchiveTrainingCourse(this.trainingCourseDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.closeArchiveTrainingCourseDialog();
        this.searchTrainingCourses();
        this.isArchiveInProgress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.warning("", this.validationMessage);
        this.isArchiveInProgress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  searchByInput(event) {
    if (event.keyCode == 13) {
      this.searchTrainingCourses();
      this.updateTrainingCourseDashboardFilter();
    }
  }

  updateTrainingCourseDashboardFilter() {
    if (this.dashboardId) {
      this.updatePersistanceInprogress = true;
      let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
      workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
      workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
      let filters = new WorkspaceDashboardFilterModel();
      filters.searchText = this.searchText;
      filters.isArchived = this.isArchived;
      filters.state = this.state;
      workspaceDashboardFilterModel.filterJson = JSON.stringify(filters);
      this.widgetService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
        .subscribe((responseData: any) => {
          if (responseData.success) {
            this.workspaceDashboardFilterId = responseData.data;
            this.updatePersistanceInprogress = false;
            this.cdRef.detectChanges();
          } else {
            this.validationMessage = responseData.apiResponseMessages[0].message;
            this.toastr.warning("", this.validationMessage);
            this.updatePersistanceInprogress = false;
            this.cdRef.markForCheck();
          }
        });
    }
  }

  getTrainingCoursesDashboardFilter() {
    this.isAnyOperationIsInprogress = true;
    let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
    workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
    this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data && responseData.data.length > 0) {
            let dashboardFilters = responseData.data[0];
            this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
            let filters = JSON.parse(dashboardFilters.filterJson);
            this.searchText = filters.searchText == undefined ? null : filters.searchText;
            this.isArchived = filters.isArchived;
            this.state = filters.state ? filters.state : this.state;
            if (this.state.sort && this.state.sort[0]) {
              this.sortBy = this.state.sort[0].field;
              this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
            }
            this.searchTrainingCourses();
            this.cdRef.detectChanges();
          }
          else {
            this.searchTrainingCourses();
          }
        } else {
          this.searchTrainingCourses();
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.warning("", this.validationMessage);
        }
      });
  }

  editAppName() {
    if (this.dashboardId) {
      this.isEditAppName = true;
      this.changedAppName = this.dashboardName;
    }
  }

  keyUpFunction(event) {
    if (event.keyCode == 13) {
      this.updateAppName();
    }
  }

  updateAppName() {
    if (this.dashboardId) {
      if (this.changedAppName) {
        const dashBoardModel = new Dashboard();
        dashBoardModel.dashboardId = this.dashboardId;
        dashBoardModel.dashboardName = this.changedAppName;
        this.widgetService.updateDashboardName(dashBoardModel)
          .subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
              this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
              this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
              this.changedAppName = '';
              this.isEditAppName = false;
              this.cdRef.detectChanges();
            } else {
              this.validationMessage = responseData.apiResponseMessages[0].message;
              this.toastr.warning("", this.validationMessage);
            }
          });
      } else {
        const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
        this.toastr.warning("", message);
      }
    }
  }
}