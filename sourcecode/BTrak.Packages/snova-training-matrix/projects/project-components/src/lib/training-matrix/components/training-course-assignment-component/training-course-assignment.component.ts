import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChildren, Input, ViewChild, ElementRef,TemplateRef, ChangeDetectionStrategy } from "@angular/core";
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
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Dashboard } from "../../dependencies/models/dashboard";
import { SoftLabelPipe } from "../../dependencies/pipes/softlabels.pipes";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { CustomAddTrainingCourseDialogComponent } from "../add-new-training-course-component/add-new-training-course.component";
import { UserService } from "../../dependencies/services/user.Service";
import { TrainingAssignmentSearchModel } from "../../dependencies/models/training-assignment-search-model";
import * as _ from "underscore";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: "custom-app-training-course-assignment",
  templateUrl: "training-course-assignment.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomTrainingCourseAssignmentComponent extends CustomAppBaseComponent {
  @ViewChildren("archiveTrainingCoursePopUp") archiveTrainingCoursePopover;
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
  assignmentsForm: FormGroup;

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
      this.dashboardName = "Training assignments";
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
  @Output() change = new EventEmitter();
  roleFeaturesIsInProgress$: Observable<boolean>;
  state: State = {
    skip: 0,
    take: 10,
    sort: []
  };
  @ViewChild("allCoursesSelected") private allCoursesSelected: MatOption;

  constructor(
    public dialog: MatDialog,
    private trainingService: TrainingManagementService,
    private cdRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private widgetService: WidgetService,
    private userService: UserService,
    private translateService: TranslateService,
    // sharedStore: Store<SharedState.State>,
    // private store: Store<State>,
    private softLabelPipe: SoftLabelPipe,
    private snackbar: MatSnackBar, 
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.profilePage = this.router.url.includes("profile");
    this.getTrainingCourses();
    this.getUsers();
    this.searchAssignments();

    this.assignmentsForm = this.formBuilder.group({
      assignments: new FormControl("",
          Validators.compose([
          ])
      )
    });
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
    var localState = this.state;
    this.trainingService.searchAssignments(trainingAssignmentSearchModel).subscribe((response: any) => {
      if(!this.state){
        this.state = localState;
      }
      if (response.success == true) {
        let assignMents = response.data;
        this.userAssignments = {
          data: assignMents,
          total: response.data.length > 0 ? response.data[0].totalCount : 0,
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

  getTrainingCourses() {
    this.trainingService.getTrainingCourses().subscribe((response: any) => {
      if (response.success == true) {
        this.trainingCourses = response.data;
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.cdRef.detectChanges();
    });
  }

  getUsers() {
    this.userService.getUsersDropDown('').subscribe((response: any) => {
      if (response.success == true) {
        this.users = response.data;
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
      this.cdRef.detectChanges();
    });
  }

  closeSearch() {
    this.searchText = null;
    this.searchAssignments();
    this.updateTrainingAssignmentsDashboardFilter();
  }

  editTrainingAssignmentsPopupOpen(row, archiveTrainingCoursePopUp) {
    this.selectedUserAssignments = row;
    this.selectedTrainingCourseIds = _.pluck(row.assignments, 'trainingCourseId');
    this.previousTrainingCourseIds = this.selectedTrainingCourseIds;
    console.log(this.selectedTrainingCourseIds);
    console.log(this.previousTrainingCourseIds);
    if(!this.selectedTrainingCourseIds){
      this.selectedTrainingCourseIds = [];
      this.previousTrainingCourseIds = [];
    }
    archiveTrainingCoursePopUp.openPopover();
  }

  closeEditTrainingAssignmentseDialog() {
    this.archiveTrainingCoursePopover.forEach((p) => p.closePopover());
    this.selectedUserAssignments = null;
    this.selectedTrainingCourseIds = [];
    this.previousTrainingCourseIds = []
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
      disableClose: true
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
          // _.pluck(this.trainingCourses, "id"),
          0
        ]);
      }
    }else {
      this.assignmentsForm.controls.assignments.patchValue([]);  
    }
  }

  navigateToProfile(dataItem){
    this.router.navigate(["dashboard/profile", dataItem.userId, "hr-record"]);
  }

  assignmentsChange(){

  }
}