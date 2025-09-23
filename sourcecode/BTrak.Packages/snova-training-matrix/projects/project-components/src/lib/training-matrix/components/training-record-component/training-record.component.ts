import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChildren, Input, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
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
import { forkJoin } from "rxjs";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Dashboard } from "../../dependencies/models/dashboard";
import { SoftLabelPipe } from "../../dependencies/pipes/softlabels.pipes";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { UserService } from "../../dependencies/services/user.Service";
import { TrainingAssignmentSearchModel } from "../../dependencies/models/training-assignment-search-model";
import * as _ from "underscore";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "custom-app-training-record",
  templateUrl: "training-record.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTrainingRecordViewComponent extends CustomAppBaseComponent {
  @ViewChildren("addOrUpdateAssignmentsPopup") addOrUpdateAssignmentsPopup;
  @ViewChildren("statusPopUp") statusPopover;
  @ViewChild('tagInput') tagInput: ElementRef;
  sortDirectionStr: string;
  trainingCourses: any;
  users: any;
  userAssignments: any;
  userId: string;
  userIds: string[];
  selectedUserAssignments: any;
  selectedTrainingCourseIds: string[];
  previousTrainingCourseIds: string[];
  profilePage: boolean;
  statuses: any;
  selectedAssignmentId: string;
  selectedStatusId: string;
  statusGivenDate: Date;
  selectedCourseFromColumn: any;
  isStatusesInProgress: boolean;
  canAddOrUpdateAssignmentStatus: Boolean;
  canAssignOrUnAssignTrainingCourse: Boolean;
  lockColumns: boolean = false;

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
      this.getTrainingAssignmentDashboardFilter();
    }
  }

  @Input("dashboardName")
  set _dashboardName(data: string) {
    if (data != null && data !== undefined) {
      this.dashboardName = data;
    } else {
      this.dashboardName = "Training record";
    }
  }

  @Input('userId')
  set _userId(data: string) {
    this.userId = data;
    if (this.userId) {
      this.userIds = [];
      this.userIds.push(this.userId);
    }
  }

  dashboardFilters: DashboardFilterModel;

  trainingCoursesList: any;
  isThereAnError: boolean = false;
  removable = true;
  selectable: boolean = true;
  searchText: string;
  validationMessage: string = '';
  isEdit: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  updatePersistanceInprogress: boolean = false;
  isArchived: boolean = false;
  isHistoryVisible: boolean = false;
  isUpsertExpenseInprogress: boolean = false;
  pdfOrMailOperationIsInprogress: boolean = false;
  trainingCourseDetails = new TrainingCourseModel();
  selectedExpenseDetails: any;
  sortBy: string;
  dashboardId: string;
  dashboardName: string;
  workspaceDashboardFilterId: string;
  changedAppName: string;
  kendoRowIndex: number;
  count = 0;
  sortDirection: boolean = true;
  isEditAppName: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  @Output() change = new EventEmitter();
  state: State = {
    skip: 0,
    take: 10,
  };
  resultsAreInProgress: boolean = false;
  assignmentsForm: FormGroup;
  statusForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingManagementService,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private widgetService: WidgetService,
    private userService: UserService,
    private translateService: TranslateService,
    private softLabelPipe: SoftLabelPipe,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.profilePage = this.router.url.includes("profile");
    this.activateView();
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

  activateView() {
    let trainingCourses = this.trainingService.getTrainingCourses();
    var trainingAssignmentSearchModel = new TrainingAssignmentSearchModel();
    trainingAssignmentSearchModel.isArchived = this.isArchived;
    trainingAssignmentSearchModel.sortBy = this.sortBy;
    trainingAssignmentSearchModel.userIds = this.profilePage ? this.userIds : undefined;
    trainingAssignmentSearchModel.sortDirectionAsc = this.sortDirection;
    trainingAssignmentSearchModel.sortDirection = this.sortDirectionStr;
    trainingAssignmentSearchModel.searchText = this.searchText;
    trainingAssignmentSearchModel.pageSize = this.state.take;
    trainingAssignmentSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;
    let trainingAssignments = this.trainingService.searchAssignments(trainingAssignmentSearchModel);
    var localState = this.state;
    this.resultsAreInProgress = true;
    forkJoin([trainingCourses, trainingAssignments]).subscribe(results => {
      if (!this.state) {
        this.state = localState;
      }
      if (results[0]["success"] == true) {
        this.trainingCourses = results[0]["data"];
        if (this.trainingCourses && this.trainingCourses.length > 0) {
          this.lockColumns = true;
        }
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = results[0]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }

      if (results[1]["success"] == true) {
        let assignMents = results[1]["data"];
        this.userAssignments = {
          data: assignMents,
          total: results[1]["data"].length > 0 ? results[1]["data"][0].totalCount : 0,
        }
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = results[1]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }
      this.resultsAreInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  searchAssignments() {
    this.isAnyOperationIsInprogress = true;
    var trainingAssignmentSearchModel = new TrainingAssignmentSearchModel();
    trainingAssignmentSearchModel.isArchived = this.isArchived;
    trainingAssignmentSearchModel.sortBy = this.sortBy;
    trainingAssignmentSearchModel.userIds = this.profilePage ? this.userIds : undefined;
    trainingAssignmentSearchModel.sortDirectionAsc = this.sortDirection;
    trainingAssignmentSearchModel.sortDirection = this.sortDirectionStr;
    trainingAssignmentSearchModel.searchText = this.searchText;
    trainingAssignmentSearchModel.pageSize = this.state.take;
    trainingAssignmentSearchModel.pageNumber = (this.state.skip / this.state.take) + 1;

    this.trainingService.searchAssignments(trainingAssignmentSearchModel).subscribe((response: any) => {
      if (response.success == true) {
        let assignMents = response.data;
        this.userAssignments = {
          data: assignMents,
          total: response.data.length > 0 ? response.data[0].totalCount : 0,
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }

  getTrainingCourses() {
    this.trainingService.getTrainingCourses().subscribe((response: any) => {
      if (response.success == true) {
        this.trainingCourses = response.data;
        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
      this.sortDirectionStr = this.state.sort[0].dir;
    }
    this.searchAssignments();
    this.updateTrainingAssignmentsDashboardFilter();
  }

  updateTrainingAssignmentsDashboardFilter() {
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
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          } else {
            this.validationMessage = responseData.apiResponseMessages[0].message;
            this.toastr.warning("", this.validationMessage);
            this.updatePersistanceInprogress = false;
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
          }
        });
    }
  }

  getTrainingAssignmentDashboardFilter() {
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
            this.state = filters.state;
            if (this.state.sort && this.state.sort[0]) {
              this.sortBy = this.state.sort[0].field;
              this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
            }
            this.searchAssignments();
            this.cdRef.detectChanges();
          }
          else {
            this.searchAssignments();
          }
        } else {
          this.searchAssignments();
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

  assignmentsChange() {

  }

  checkAssignmentExists(dataItem, course) {
    return _.find(dataItem.assignments, function (assignment) { return assignment["trainingCourseId"] == course.id }) == null;
  }

  GetCompliancePercentage(dataItem) {
    if (!dataItem.assignments || dataItem.assignments.length == 0) {
      return '(0%)';
    }
    return `(${Math.round((_.filter(dataItem.assignments, function (assignment) { return assignment["addsValidity"] }).length / dataItem.assignments.length) * 100)}%)`;
  }
}