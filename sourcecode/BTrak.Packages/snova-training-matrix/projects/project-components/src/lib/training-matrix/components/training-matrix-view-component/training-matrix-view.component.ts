import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChildren, Input, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy } from "@angular/core";
import { MatOption } from "@angular/material/core";
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
import { Observable, forkJoin } from "rxjs";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Dashboard } from "../../dependencies/models/dashboard";
import { SoftLabelPipe } from "../../dependencies/pipes/softlabels.pipes";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { CustomAddTrainingCourseDialogComponent } from "../add-new-training-course-component/add-new-training-course.component";
import { UserService } from "../../dependencies/services/user.Service";
import { TrainingAssignmentSearchModel } from "../../dependencies/models/training-assignment-search-model";
import * as _ from "underscore";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "custom-app-training-matrix-view",
  templateUrl: "training-matrix-view.component.html",
  styleUrls:['./training-matrix-view-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTrainingMatrixViewComponent extends CustomAppBaseComponent {
  @ViewChildren("addOrUpdateAssignmentsPopup") addOrUpdateAssignmentsPopup;
  @ViewChildren("statusPopUp") statusPopover;
  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild("addTrainingCourse") addTrainingCourse: TemplateRef<any>;
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
  assignmentCreatedDate: any;
  maxDate: any;

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
      this.dashboardName = "Training matrix";
    }
  }

  @Input('userId')
  set _userId(data: string) {
    this.userId = data;
    if(this.userId){
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
  lockColumns: boolean = false;
  @Output() change = new EventEmitter();
  roleFeaturesIsInProgress$: Observable<boolean>;
  @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  state: State = {
    skip: 0,
    take: 10
  };
  @ViewChild("allCoursesSelected") private allCoursesSelected: MatOption;
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
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    super();
    this.state = {
      skip: 0,
      take: 10
    };
  }

  ngOnInit() {
    super.ngOnInit();
    this.state = {
      skip: 0,
      take: 10
    };
    this.profilePage = this.router.url.includes("profile");
    this.activateView();
    this.clearStatusForm();
    this.maxDate = new Date();

    this.assignmentsForm = this.formBuilder.group({
      assignments: new FormControl("",
          Validators.compose([
          ])
      )
    });

    this.canAddOrUpdateAssignmentStatus = this.canAccess_feature_AddOrUpdateAssignmentStatus;
    this.canAssignOrUnAssignTrainingCourse = this.canAccess_feature_AssignOrUnassignTrainingCourse;
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

  activateView(){
    let trainingCourses = this.trainingService.getTrainingCourses();
    let users = this.userService.getUsersDropDown('');
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
    forkJoin([trainingCourses, users, trainingAssignments]).subscribe(results => {
      if(!this.state){
        this.state = localState;
      }
      if (results[0]["success"] == true) {
        this.trainingCourses = results[0]["data"];
        if(this.trainingCourses && this.trainingCourses.length > 0){
          this.lockColumns = true;
        }
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = results[0]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }

      if (results[1]["success"] == true) {
        this.users = results[1]["data"];
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = results[1]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }

      if (results[2]["success"] == true) {
        let assignMents = results[2]["data"];
        this.userAssignments = {
          data: assignMents,
          total: results[2]["data"].length > 0 ? results[2]["data"][0].totalCount : 0,
        }
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = results[2]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }
      this.cdRef.detectChanges();
      this.resultsAreInProgress = false;
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

  getUsers() {
    this.userService.getUsersDropDown('').subscribe((response: any) => {
      if (response.success == true) {
        this.users = response.data;
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

  closeSearch() {
    this.searchText = null;
    this.searchAssignments();
    this.updateTrainingAssignmentsDashboardFilter();
  }

  editTrainingAssignmentsPopupOpen(row, addOrUpdateAssignmentsPopup, course) {
    if(!this.canAssignOrUnAssignTrainingCourse){
      return;
    }
    this.selectedUserAssignments = row;
    this.selectedTrainingCourseIds = _.pluck(row.assignments, 'trainingCourseId');
    this.previousTrainingCourseIds = Object.assign([], this.selectedTrainingCourseIds);
    if(!this.selectedTrainingCourseIds){
      this.selectedTrainingCourseIds = [];
      this.previousTrainingCourseIds = [];
    }
    if(course){
      this.selectedCourseFromColumn = course;
      this.selectedTrainingCourseIds.push(course.id);
    }
    addOrUpdateAssignmentsPopup.openPopover();
  }

  openStatusPopover(assignment, statusPopover) {
    if(!this.canAddOrUpdateAssignmentStatus){
      return;
    }
    this.getAssignmentStatuses(assignment);
    statusPopover.openPopover();
  }

  closeEditTrainingAssignmentseDialog() {
    this.addOrUpdateAssignmentsPopup.forEach((p) => p.closePopover());
    this.selectedUserAssignments = null;
    this.selectedTrainingCourseIds = [];
    this.previousTrainingCourseIds = [];
    this.selectedCourseFromColumn = null;
  }

  closeStatusDialog() {
    this.statusPopover.forEach((p) => p.closePopover());
    this.selectedAssignmentId = null;
    this.selectedStatusId = null;
    this.statusGivenDate = null;
    this.assignmentCreatedDate = null;
    this.clearStatusForm();
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
            this.state = filters.state? filters.state : this.state;
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

  openCreateTrainingCourseDialog(data: any) {
    let dialogId = "custom-app-add-new-training-course";
    const dialogRef = this.dialog.open(this.addTrainingCourse, {
      width: "65%",
      hasBackdrop: true,
      panelClass: 'expense-dialog-scroll',
      direction: "ltr",
      id: dialogId,
      data: { data, formPhysicalId: dialogId },
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getTrainingCourses();
    });
  }

  searchByInput(event) {
    if (event.keyCode == 13) {
        this.searchAssignments();
    }
  }

  removeAssignment(assignment, userId){
    var assignments = {
      courseIds : [assignment.trainingCourseId],
      userIds: [userId],
      assign: false
    }
    for(var i = 0; i < this.userAssignments.data.length; i++){
      if(this.userAssignments.data[i].userId == userId){
        for(var j = 0; j < this.userAssignments.data[i].assignments.length; j++){
          if(this.userAssignments.data[i].assignments[j].assignmentId == assignment.assignmentId){
            this.userAssignments.data[i].assignments.splice(j, 1);
          }
        }
      }
    }
    this.configureAssignments(assignments, false);
  }

  configureAssignments(assignments, refresh){
    this.isAnyOperationIsInprogress = true;
    this.trainingService.AssignOrUnAssignTrainingCourse(assignments).subscribe((response: any) => {
      if (response.success == true) {
        this.isAnyOperationIsInprogress = false;
        if(refresh){
          this.toastr.success(
            "",
            this.translateService.instant("TRAININGMANAGEMENT.ASSIGNMENTSUPDATEDSUCCESSFULLY")
          );
          this.searchAssignments();
        }
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.searchAssignments();
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  configureAssignents(){
    var assignmentsNeedToRemove = [];
    var assignmentsNeedToAdd = [];
    var exists;

    //calculating assignmentsNeedToRemove
    if(this.previousTrainingCourseIds && this.previousTrainingCourseIds.length > 0){
      for(var i = 0; i < this.previousTrainingCourseIds.length; i++){
        exists = false;
        for(var j = 0; j < this.selectedTrainingCourseIds.length; j++){
          if(this.previousTrainingCourseIds[i] == this.selectedTrainingCourseIds[j]){
            exists = true;
          }
        }
        if(!exists){
          assignmentsNeedToRemove.push(this.previousTrainingCourseIds[i]);
        }
      }
    }

    //calculating assignmentsNeedToAdd
    if(this.selectedTrainingCourseIds && this.selectedTrainingCourseIds.length > 0){
      for(var i = 0; i < this.selectedTrainingCourseIds.length; i++){
        exists = false;
        for(var j = 0; j < this.previousTrainingCourseIds.length; j++){
          if(this.selectedTrainingCourseIds[i] == this.previousTrainingCourseIds[j]){
            exists = true;
          }
        }
        if(!exists){
          assignmentsNeedToAdd.push(this.selectedTrainingCourseIds[i]);
        }
      }
    }

    var refreshAfterAddingAssignments = false;
    var refreshAfterRemovingAssignments = false;
    if(assignmentsNeedToRemove && assignmentsNeedToRemove.length > 0){
      refreshAfterRemovingAssignments = true;
    }else{
      refreshAfterAddingAssignments = true;
    }

    // adding assignments
    if(assignmentsNeedToAdd && assignmentsNeedToAdd.length > 0){
      var assignments = {
        courseIds : assignmentsNeedToAdd,
        userIds: [this.selectedUserAssignments.userId],
        assign: true
      }
      this.configureAssignments(assignments, refreshAfterAddingAssignments);
    }

    // removing assignments
    if(assignmentsNeedToRemove && assignmentsNeedToRemove.length > 0){
      var assignments = {
        courseIds : assignmentsNeedToRemove,
        userIds: [this.selectedUserAssignments.userId],
        assign: false
      }
      this.configureAssignments(assignments, refreshAfterRemovingAssignments);
    }
    this.closeEditTrainingAssignmentseDialog();
  }

  toggleAllCoursesSelected(event){
    if (this.allCoursesSelected.selected) {
      if (this.trainingCourses.length === 0) {
          this.assignmentsForm.controls.assignments.patchValue([]);  
      } else {
        this.assignmentsForm.controls.assignments.patchValue([
          ...this.trainingCourses.map((item) => item.id),
          0
        ]);
      }
    }else {
      this.assignmentsForm.controls.assignments.patchValue([]);  
    }
  }

  getAssignmentStatuses(assignment){
    this.isStatusesInProgress = true;
    let assignmentStatuses = this.trainingService.getAssignmentStatuses();
    let assignmentWorkFlow = this.trainingService.getAssignmentWorkflow(assignment.assignmentId);
    forkJoin([assignmentStatuses, assignmentWorkFlow]).subscribe(results => {
      if (results[0]["success"] == true) {
        this.statuses = _.filter(results[0]["data"], function(status){return status["isSelectable"] == true;});
      }
      else {
        this.validationMessage = results[0]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }

      if (results[1]["success"] == true) {
        let assignmentWorkflow = results[1]["data"];
        let assignmentStatus = _.find(assignmentWorkflow, function(status){ return status["isExpiryStatus"] == false; });
        this.selectedAssignmentId = assignmentStatus["assignmentId"];
        this.selectedStatusId = assignmentStatus["statusId"];
        this.statusGivenDate = assignmentStatus["statusGivenDate"];
        this.assignmentCreatedDate = assignment.createdDateTime;
      }
      else {
        this.validationMessage = results[1]["apiResponseMessages"][0].message;
        this.toastr.warning("", this.validationMessage);
      }

      this.isStatusesInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  addOrUpdateAssignmentStatus(){
    this.isStatusesInProgress = true;
    // if(new Date(this.statusGivenDate).setHours(0,0,0,0) < new Date(this.assignmentCreatedDate).setHours(0,0,0,0)){
    //   this.toastr.warning(
    //     "",
    //     this.translateService.instant("TRAININGMANAGEMENT.OUTCOMECANNOTBEPAST")
    //   );
    //   this.isStatusesInProgress = false;
    //   return;
    // }
    var assignment = {
      id: this.selectedAssignmentId,
      statusId: this.statusForm.value.statusId,
      statusGivenDate: this.statusForm.value.statusGivenDate
    };
    this.trainingService.addOrUpdateAssignmentStatus(assignment).subscribe((response: any) => {
      if (response.success) {
        this.isStatusesInProgress = false;
        this.toastr.success(
          "",
          this.translateService.instant("TRAININGMANAGEMENT.OUTCOMEUPDATEDSUCCESSFULLY")
        );
        this.searchAssignments();
      } else {
        this.isStatusesInProgress = false;
        this.searchAssignments();
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.warning("", this.validationMessage);
      }
    });
  }

  assignmentsChange(){

  }

  clearStatusForm(){
    this.statusForm = new FormGroup({
      statusId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      statusGivenDate: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    })
  }

  checkAssignmentExists(dataItem, course){
    return _.find(dataItem.assignments, function(assignment){ return assignment["trainingCourseId"] == course.id}) == null;
  }

  GetCompliancePercentage(dataItem){
    if(!dataItem.assignments || dataItem.assignments.length == 0){
      return '(0%)';
    }
    return `(${Math.round((_.filter(dataItem.assignments, function(assignment){ return assignment["addsValidity"] }).length/dataItem.assignments.length) * 100)}%)`;
  }

  navigateToProfile(dataItem){
    this.router.navigate(["dashboard/profile", dataItem.userId, "hr-record"]);
  }
}