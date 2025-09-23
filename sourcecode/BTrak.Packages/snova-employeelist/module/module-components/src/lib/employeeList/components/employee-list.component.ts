import { Component, Input, ViewChildren, ViewChild, ChangeDetectorRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import * as formUtils from "formiojs/utils/formUtils.js";
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie-service';

import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

import { EmployeeListModel } from '../../employeeList/models/employee-model';
import { DesignationModel } from '../../employeeList/models/designations-model';
import { Branch } from '../../employeeList/models/branch';
import { JobCategoryModel } from '../../employeeList/models/job-category-model';
import { EmploymentStatusModel } from '../../employeeList/models/employment-status-model';
import { Currency } from '../../employeeList/models/currency';
import { RoleModel } from '../../employeeList/models/role-model';
import { JobCategorySearchModel } from '../../employeeList/models/job-category-search-model';
import { SoftLabelConfigurationModel } from '../../employeeList/models/softLabels-model';
import { TimeZoneModel } from '../../employeeList/models/time-zone';
import { ShiftTimingModel } from '../../employeeList/models/shift-timing-model';

import * as HRMState from '../../employeeList/store/reducers/index';
import * as hrManagementModuleReducer from '../../employeeList/store/reducers/index';

import { LoadJobCategoryTriggered } from '../store/actions/job-category.actions';
import { LoadShiftTimingListItemsTriggered } from '../store/actions/shift-timing.action';
import { LoadEmployeeListItemsTriggered, EmployeeListActionTypes, CreateEmployeeListItemTriggered } from '../store/actions/employee-list.action';
import { LoadTimeZoneListItemsTriggered } from '../store/actions/time-zone.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';
import { DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivityConfigurationUserModel } from '../../employeeList/models/activity-configuration-user-model';
import { CompanysettingsModel } from '../../employeeList/models/company-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { LoadCurrencyTriggered } from '../store/actions/currency.actions';
import { SoftLabelPipe } from '../../employeeList/pipes/softlabels.pipes';
import { LoadRolesTriggered } from '../store/actions/roles.action';
import { InductionWorItemDialogComponent } from './induction-work-items/induction-workitem-dialog.component';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { EmployeeListService } from '../services/employee-list.service';
import { DepartmentModel } from '../models/department-model';
import { LoadDepartmentListItemsTriggered } from "../../employeeList/store/actions/department.action";
import './../../globaldependencies/helpers/fontawesome-icons';
import { LoadDesignationListItemsTriggered } from '../store/actions/designation.action';
import { EmploymentStatusSearchModel } from '../models/employment-status-search-model';
import { LoadEmploymentStatusListItemsTriggered } from '../store/actions/employment-status.action';
import { GenericFormService } from '../services/generic-form.service';
import { CreateGenericForm } from '../models/createGenericForm';
import { Persistance } from '../models/persistance.model';
import { EmployeeFieldsModel } from '../models/employee-fields.model';
import { CustomFormFieldModel } from '../models/custom-form-field.model';


@Component({
  selector: 'app-hr-component-employeeList',
  templateUrl: `employee-list.component.html`,
  providers: [SoftLabelPipe]
})

export class EmployeeListComponent extends CustomAppBaseComponent {
  @ViewChildren("addEmployeePopover") addEmployeePopover;
  @ViewChildren("addTrackerPopover") addTrackerPopover;
  @ViewChild('myTable') table: any;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("grid") public excelGrid: GridComponent;
  @Output() downloadExcelComplete = new EventEmitter<boolean>();
  genericForm: CustomFormFieldModel;
  applicationForms: any;
  customApplicationName: any;
  isFormLoading: boolean;
  selectedform: CreateGenericForm = new CreateGenericForm();
  isCustomColumns: boolean;
  EmployeeFormKeys: any;
  employeeListData: EmployeeListModel[];
  employeeGenericListDataLoading: boolean;
  persistanceId: any;
  persistanceObject: any;
  columns = [];
  noPersist: boolean;
  initial: boolean=true;
  @ViewChild("editEmployee") editEmployee: TemplateRef<any>;
  employeeFields: any;
  employeeEditFormSourc: any;

  @Input("employeeSearchResultData")
  set employeeSearchResultData(data: EmployeeListModel) {
    this.employeeSearchResult = data;
    // this.page.size = 30;
    // this.page.pageNumber = 0;
    this.getEmployeesList();
    this.getEmployeeFields();
  }
  @Input("updatedFieldCongiguration")
  set updatedFieldCongiguration(data: boolean) {
    if(data===true){
      this.getEmployeeFields();
      this.getCustomFields();
    }
  }
  @Input("downloadCsv")
  set downloadExcel(data: boolean) {
    if(data===true){
      this.exportToCsv();
    }
  }
  @Input("downloadExcel")
  set downloadCsv(data: boolean) {
    if(data===true){
      this.exportToExcel();
    }
  }
  selectEmploymentStatusDropDownListData: EmploymentStatusModel[];
  selectDesignationDropDownListData: DesignationModel[];

  addEmployeeForm: FormGroup;
  userForm: FormGroup;
  activityForm: FormGroup;

  employeeSearchResult: EmployeeListModel;
  employeeEdit: EmployeeListModel;
  addEmployee: EmployeeListModel;
  selectRolesListData: any[];
  softLabels: SoftLabelConfigurationModel[];
  employeeListDataDetails: GridDataResult = {
    data: [],
    total: 0
  };

  // scroll: boolean;
  sortBy: string;
  sortDirection: boolean = true;
  // page = new Page();
  validationMessage: string;
  entities: any;
  userId: string = '';
  branchI: string;
  branchp: string;
  success: boolean;
  showSpinner: boolean;
  public opened: any = false;
  isActiveOnMobile: boolean = true;
  isActive: boolean = true;
  timeStamp: any;
  shiftTiming: string = '';
  minDate = new Date(1753, 0, 1);
  endDateBool: boolean = true;
  minDateForEndDate = new Date();
  isAllowSpecialCharacterForFirstName: boolean;
  isAllowSpecialCharacterForLastName: boolean;
  isVisible: boolean = false;
  allRoles: any[];
  selectedRoles: string;
  selectedBranches: any;
  pageable: boolean = false;
  isNewUser: boolean = false;
  employeeName: string;
  employeeListDataLoading: boolean;
  roleFeaturesIsInProgress$: Observable<boolean>;
  jobCategoryList$: Observable<JobCategoryModel[]>;
  upsertEmployeeInProgress$: Observable<boolean>;
  employeeListDataDetails$: Observable<EmployeeListModel[]>;
  selectRolesListData$: Observable<RoleModel[]>;
  selectedRolesListData: RoleModel[];
  employeeListDataLoading$: Observable<boolean>
  selectEmployeeShiftDropDownListData$: Observable<ShiftTimingModel[]>
  branchList$: Observable<Branch[]>;
  currencyList$: Observable<Currency[]>;
  timeZoneList$: Observable<TimeZoneModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  isMACApplicable: boolean = false;
  selectedAppUrl: string = null;
  screenshotTime: number;
  appsUrlToggle: any;
  screenshotTimeFrequency: any;
  multiplier: any;
  track: boolean;
  active: any;
  employeeId: string;
  activityTrackerUserId: string;
  atuTimeStamp: any;
  appUrlId: string;
  upsertEnableTracking: boolean = false;
  selectDepartmentDropDownListData$: Observable<DepartmentModel[]>;
  selectDepartmentDropDownListData: DepartmentModel[];
  departmentsLoading$: Observable<boolean>;
  designationsLoading$: Observable<boolean>;
  selectDesignationDropDownListData$: Observable<DesignationModel[]>;
  employmentTypeLoading$: Observable<boolean>;
  selectEmploymentStatusDropDownListData$: Observable<EmploymentStatusModel[]>;
  isRecordActivity: boolean = false;
  isMouse: boolean = false;
  isScreenshot: boolean = false;
  appsTrack: boolean = false;
  columnHeadersIgnored: any[] = [
    { title: 'Profile Image', field: "profileImage" },
    { title: 'Enable Tracking', field: "enableTracking" },
    { title: 'Action', field: "action" },
    { title: 'employeeId', field: "employeeId" },
    { title: 'fullName', field: "fullName" },
    { title: 'userId', field: "userId" },
    { title: 'maritalStatusId', field: "maritalStatusId" },
    { title: 'marriageDate', field: "marriageDate" },
    { title: 'maritalStatus', field: "maritalStatus" },
    { title: 'nationalityId', field: "nationalityId" },
    { title: 'nationality', field: "nationality" },
    { title: 'genderId', field: "genderId" },
    { title: 'gender', field: "gender" },
    { title: 'dateOfBirth', field: "dateOfBirth" },
    { title: 'smoker', field: "smoker" },
    { title: 'militaryService', field: "militaryService" },
    { title: 'nickName', field: "nickName" },
    { title: 'taxCode', field: "taxCode" },
    { title: 'branchId', field: "branchId" },
    { title: 'roleId', field: "roleId" },
    { title: 'isActive', field: "isActive" },
    { title: 'timeZoneId', field: "timeZoneId" },
    { title: 'isActiveOnMobile', field: "firstisActiveOnMobileName" },
    { title: 'registeredDateTime', field: "registeredDateTime" },
    { title: 'lastConnection', field: "lastConnection" },
    { title: 'timeStamp', field: "timeStamp" },
    { title: 'createdDateTime', field: "createdDateTime" },
    { title: 'createdByUserId', field: "createdByUserId" },
    { title: 'totalCount', field: "totalCount" },
    { title: 'isArchived', field: "isArchived" },
    { title: 'isTerminated', field: "isTerminated" },
    { title: 'departmentId', field: "departmentId" },
    { title: 'employmentStatusId', field: "employmentStatusId" },
    { title: 'designationId', field: "designationId" },
    { title: 'jobCategoryId', field: "jobCategoryId" },
    { title: 'shiftTimingId', field: "shiftTimingId" },
    { title: 'currencyId', field: "currencyId" },
    { title: 'activeFrom', field: "activeFrom" },
    { title: 'activeTo', field: "activeTo" },
    { title: 'roleIds', field: "roleIds" },
    { title: 'permittedBranchIds', field: "permittedBranchIds" },
    { title: 'businessUnitIds', field: "businessUnitIds" },
    { title: 'trackEmployee', field: "trackEmployee" },
    { title: 'activityTrackerUserId', field: "activityTrackerUserId" },
    { title: 'activityTrackerAppUrlTypeId', field: "activityTrackerAppUrlTypeId" },
    { title: 'screenShotFrequency', field: "screenShotFrequency" },
    { title: 'multiplier', field: "multiplier" },
    { title: 'isTrack', field: "isTrack" },
    { title: 'isScreenshot', field: "isScreenshot" },
    { title: 'isKeyboardTracking', field: "isKeyboardTracking" },
    { title: 'isMouseTracking', field: "isMouseTracking" },
    { title: 'atuTimeStamp', field: "atuTimeStamp" },
    { title: 'employeeShiftId', field: "employeeShiftId" },
    { title: 'formData', field: "formData" },
    { title: 'userName', field: "userName" },
    { title: 'dateOfJoining', field: "dateOfJoining" },
    { title: 'roleName', field: "roleName" },
    { title: 'timeZoneName', field: "timeZoneName" },
    { title: 'mobileNo', field: "mobileNo" },
    { title: 'isActiveOnMobile', field: "isActiveOnMobile" },
    { title: 'roleNames', field: "roleNames" },
    { title: 'permittedBranchNames', field: "permittedBranchNames" },
    { title: 'businessUnitNames', field: "businessUnitNames" },
    { title: 'macAddress', field: "macAddress" },
    { title: 'ipNumber', field: "ipNumber" },
  ];
columnHeaders: any[] = [
    { title: 'firstName', field: "firstName" },
    { title: 'surName', field: "surName" },
    { title: 'email', field: "email" },
    { title: 'employeeNumber', field: "employeeNumber" },
    { title: 'designationName', field: "designationName" },
    { title: 'employmentStatusName', field: "employmentStatusName" },
    { title: 'jobCategoryType', field: "jobCategoryType" },
    { title: 'departmentName', field: "departmentName" },
    { title: 'branchName', field: "branchName" },
    { title: 'shift', field: "shift" }
];

  public ngDestroyed$ = new Subject();

  constructor(private cookieService: CookieService, private store: Store<HRMState.State>, private actionUpdates$: Actions,
    private router: Router, private cdRef: ChangeDetectorRef, public googleAnalyticsService: GoogleAnalyticsService, private softLabelPipe: SoftLabelPipe,
    private dialog: MatDialog, private toaster: ToastrService, private employeeService: EmployeeListService, private translateService: TranslateService, private genericFormService: GenericFormService
  ) {
    super();
    this.columns = [];
    this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    // this.page.size = 30;
    // this.page.pageNumber = 0;
    this.clearForm();
    this.getCustomFields();
    //const employeeListSearchResult = new EmployeeListModel();
    //this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeListSearchResult));
    this.employeeListDataDetails$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeAll));

    this.employeeListDataDetails$.subscribe(result => {
      this.employeeListData = result;
      this.employeeListDataDetails = {
        data: result,
        total: result.length > 0 ? result[0].totalCount : 0,
      }
      if(result.length>0)
      this.makeDataSetResult(this.employeeListData);
      if ((result.length > 0 && result[0].totalCount <= this.state.take) || result.length == 0) {
        this.pageable = false;
        this.state.skip = 0;
      }
      else {
        if (result[0].totalCount <= this.state.skip)
          this.state.skip = this.state.skip - this.state.take;
        this.pageable = true;
      }
    })

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
        tap(() => {
          this.addEmployeePopover.forEach((p) => p.closePopover());
          this.clearForm();
          if (this.isNewUser) {
            this.isNewUser = false;
          }
        })
      ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    this.getSoftLabelConfigurations();
    this.getAllCompanySettings();
    if (this.canAccess_feature_CanEditOtherEmployeeDetails) {
      this.getRoles();
      this.getJobCategoryList();
      this.getShiftTimingList();
      this.getBranchList();
      this.getCurrencyList();
      this.getTimeZoneList();
      this.getDepartmentList();
      this.getDesignationList();
      this.getEmploymentStatusList();
    }

    this.employeeListDataLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeLoading));
    this.employeeListDataLoading$.subscribe(result => {
      this.employeeListDataLoading = result;
    })
    this.cdRef.detectChanges();
  }

  getAllCompanySettings() {

    var companysettingsModel = new CompanysettingsModel();
    companysettingsModel.isArchived = false;
    this.employeeService.getAllCompanySettings(companysettingsModel).subscribe((response: any) => {
      if (response.success == true && response.data.length > 0) {

        let companyResult = response.data.filter(item => item.key == "ConsiderMACAddressInEmployeeScreen");
        this.isMACApplicable = companyResult[0].value == "1" ? true : false;
      }
    });
  }

  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }

  getJobCategoryList() {
    var jobCategorySearchModel = new JobCategorySearchModel();
    jobCategorySearchModel.isArchived = false;
    //this.store.dispatch(new LoadJobCategoryTriggered(jobCategorySearchModel));
    this.jobCategoryList$ = this.store.pipe(select(hrManagementModuleReducer.getJobCategoryAll));
  }

  getShiftTimingList() {
    var shiftTimingSearchModel = new ShiftTimingModel();
    shiftTimingSearchModel.isArchived = false;
    //this.store.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
    this.selectEmployeeShiftDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getShiftTimingAll));
  }

  getBranchList() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    //this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
  }

  getRoles() {
    var roleModel = new RoleModel();
    roleModel.isArchived = false;
    //this.store.dispatch(new LoadRolesTriggered(roleModel));
    this.selectRolesListData$ = this.store.pipe(select(hrManagementModuleReducer.getRolesAll), tap(result => {
      this.selectedRolesListData = result
    }));
    this.selectRolesListData$.subscribe((roles) => (this.allRoles = roles));
  }

  getCurrencyList() {
    //this.store.dispatch(new LoadCurrencyTriggered());
    this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
  }

  getTimeZoneList() {
    var timeZoneModel = new TimeZoneModel;
    timeZoneModel.isArchived = false;
   // this.store.dispatch(new LoadTimeZoneListItemsTriggered(timeZoneModel));
    this.timeZoneList$ = this.store.pipe(select(hrManagementModuleReducer.getTimeZoneAll));
  }

  getDepartmentList() {
    var departmentSearchModel = new DepartmentModel();
    departmentSearchModel.isArchived = false;
    //this.store.dispatch(new LoadDepartmentListItemsTriggered(departmentSearchModel));
    this.selectDepartmentDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentAll));
    this.departmentsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentLoading));
  }


  getDesignationList() {
    var designationSearchModel = new DesignationModel();
    designationSearchModel.isArchived = false;
    //this.store.dispatch(new LoadDesignationListItemsTriggered(designationSearchModel));
    this.designationsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationLoading));
    this.selectDesignationDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationAll));
  }

  getEmploymentStatusList() {
    var employmentSearchModel = new EmploymentStatusSearchModel();
    employmentSearchModel.isArchived = false;
   // this.store.dispatch(new LoadEmploymentStatusListItemsTriggered(employmentSearchModel));
    this.employmentTypeLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusLoading));
    this.selectEmploymentStatusDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusAll));
  }


  editEmployeeDetails(row) {
    this.isAllowSpecialCharacterForFirstName = true;
    this.isAllowSpecialCharacterForLastName = true;
    this.isVisible = false;
    this.employeeEdit = new EmployeeListModel();
    this.employeeEdit = row;
    if(this.applicationForms.length>0){
      this.employeeEditFormSourc = JSON.parse(this.applicationForms[0].formJson);
    }else{
      this.employeeEditFormSourc = JSON.parse("{\"components\":[]}");
    }
    //this.employeeEdit.roleIds = roleIds;
    this.branchp = row.branchId;
    let dialogId = "edit-employee";
    const dialogRef = this.dialog.open(this.editEmployee, {
      height: "60%",
      width: "50%",
      id: dialogId,
      disableClose: true,
      data: { employeeEdit: this.employeeEdit, employeeFields:this.employeeFields, formPhysicalId: dialogId, formSourc: this.employeeEditFormSourc}
    });

  }

  trackEmployee(row, addTrackerPopover) {
    this.clearForm();
    // this.addProductiveAppForm.get('isApp').patchValue("1");
    if (row.trackEmployee) {
      this.activityForm.get('isTrack').patchValue(1);
      this.track = true;
    } else {
      this.activityForm.get('isTrack').patchValue(0);
      this.track = false;
    }
    // tslint:disable-next-line: max-line-length
    this.appsUrlToggle = row.activityTrackerAppUrlTypeId === ConstantVariables.Apps ? "App" : row.activityTrackerAppUrlTypeId === ConstantVariables.off ? "off" : row.activityTrackerAppUrlTypeId === ConstantVariables.Urls ? "Url" : row.activityTrackerAppUrlTypeId === ConstantVariables.AppsUrls ? "AppandUrl" : row.activityTrackerAppUrlTypeId === ConstantVariables.AppUrlsDetailed ? "AppandUrlDetailed" : "off";
    this.activityForm.get('app').patchValue(this.appsUrlToggle);
    this.selectedAppUrl = row.activityTrackerAppUrlTypeId == null ? ConstantVariables.off : row.activityTrackerAppUrlTypeId;
    this.screenshotTime = row.screenShotFrequency;
    this.screenshotTimeFrequency = row.screenShotFrequency;
    this.activityForm.get("shotTime").patchValue(this.screenshotTime);
    this.active = row.multiplier === 0 ? "0" :
      (row.multiplier === 1 ? "1" : (row.multiplier === 2 ? "2" : (row.multiplier === 3 ? "3" : null)));
    this.multiplier = row.multiplier;
    this.activityForm.get("shotFrequency").patchValue(this.active);
    this.appsTrack = row.isTrack == null ? false : row.isTrack;
    this.activityForm.get('isTracking').patchValue(this.appsTrack);
    this.isScreenshot = row.isScreenshot == null ? false : row.isScreenshot;
    this.activityForm.get('isScreenshotTracking').patchValue(this.isScreenshot);
    this.isRecordActivity = row.isKeyboardTracking == null ? false : row.isKeyboardTracking;
    this.activityForm.get('isKeyboardTracking').patchValue(this.isRecordActivity);
    this.isMouse = row.isMouseTracking == null ? false : row.isMouseTracking;
    this.activityForm.get('isMouseTracking').patchValue(this.isMouse);
    this.atuTimeStamp = row.atuTimeStamp;
    this.userId = row.userId;
    this.employeeId = row.employeeId
    this.activityTrackerUserId = row.activityTrackerUserId;
    this.changeTrack();
    addTrackerPopover.openPopover();
    this.cdRef.detectChanges();
  }

  closeTrackDialog() {
    this.clearForm();
    this.addTrackerPopover.forEach((p) => p.closePopover());
    this.cdRef.detectChanges();
  }

  changeTrack() {
    if (this.activityForm.value.isTrack) {
      this.track = true;
      this.activityForm.controls["app"].setValidators([Validators.required
      ]);
      this.activityForm.controls["shotFrequency"].setValidators([Validators.required
      ]);
    } else {
      this.track = false;
      this.activityForm.controls["app"].clearValidators();
      this.activityForm.controls["shotFrequency"].clearValidators();
    }
    this.activityForm.controls["app"].updateValueAndValidity();
    this.activityForm.controls["shotFrequency"].updateValueAndValidity();
  }

  addEmployeesForm(addEmployeePopover) {
    this.isVisible = true;
    addEmployeePopover.openPopover();
  }

  clearForm() {
    this.selectedRoles = null;
    this.track = false;
    this.userId = null;
    this.employeeId = null;
    this.activityTrackerUserId = null;
    this.multiplier = null;
    this.screenshotTimeFrequency = null;
    this.track = null;
    this.appUrlId = null;
    this.atuTimeStamp = null;
    this.employeeEdit = null,
      this.activityForm = new FormGroup({
        isTrack: new FormControl("",
          Validators.compose([
          ])
        ),
        app: new FormControl("",
          Validators.compose([
          ])
        ),
        shotFrequency: new FormControl("",
          Validators.compose([
          ])
        ),
        shotTime: new FormControl("",
          Validators.compose([
          ])
        ),
        isTracking: new FormControl("",
          Validators.compose([
          ])
        ),
        isScreenshotTracking: new FormControl("",
          Validators.compose([
          ])
        ),
        isKeyboardTracking: new FormControl("",
          Validators.compose([
          ])
        ),
        isMouseTracking: new FormControl("",
          Validators.compose([
          ])
        ),
      })
    this.endDateBool = true;
  }

  closeDialog() {
    this.clearForm();
    this.addEmployeePopover.forEach((p) => p.closePopover());
    //this.startDate();
  }

  onClickTrackAlloff() {
    this.selectedAppUrl = ConstantVariables.off;
  }

  onClickTrackAllApps() {
    this.selectedAppUrl = ConstantVariables.Apps;
  }

  onClickTrackAllAppsUrls() {
    this.selectedAppUrl = ConstantVariables.AppsUrls;
  }

  onClickTrackAllAppsUrlsDetailed() {
    this.selectedAppUrl = ConstantVariables.AppUrlsDetailed;
  }

  onClickTrackUrls() {
    this.selectedAppUrl = ConstantVariables.Urls;
  }

  onChangeScreenShotFrequency(changedValue) {
    this.screenshotTimeFrequency = this.activityForm.value.shotTime;
    this.multiplier = changedValue;
  }

  onChangeScreenShotCount() {
    this.screenshotTimeFrequency = this.activityForm.value.shotTime;
  }

  getEmployeesList() {
    const employeeListSearchResult = new EmployeeListModel();
    employeeListSearchResult.sortBy = this.sortBy;
    employeeListSearchResult.sortDirectionAsc = this.sortDirection;
    employeeListSearchResult.pageNumber = (this.state.skip / this.state.take) + 1;
    employeeListSearchResult.pageSize = this.state.take;
    employeeListSearchResult.searchText = this.employeeSearchResult.searchText;
    employeeListSearchResult.departmentId = this.employeeSearchResult.departmentId;
    employeeListSearchResult.designationId = this.employeeSearchResult.designationId;
    employeeListSearchResult.isActive = this.employeeSearchResult.isActive;
    employeeListSearchResult.branchId = this.employeeSearchResult.branchId;
    employeeListSearchResult.employmentStatusId = this.employeeSearchResult.employmentStatusId;
    employeeListSearchResult.lineManagerId = this.employeeSearchResult.lineManagerId;
    employeeListSearchResult.emailSearchText = this.employeeSearchResult.emailSearchText;
    employeeListSearchResult.entityId = this.employeeSearchResult.entityId;
    this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeListSearchResult));
  }

  upsertTracker() {
    var act = new ActivityConfigurationUserModel();
    this.upsertEnableTracking = true;
    act.userId = this.userId;
    act.employeeId = this.employeeId;
    act.id = this.activityTrackerUserId;
    act.multiplier = this.multiplier;
    act.screenshotFrequency = this.screenshotTimeFrequency;
    act.track = this.track;
    act.isTrack = this.appsTrack;
    act.isScreenshot = this.isScreenshot;
    act.isMouseTracking = this.isMouse;
    act.isKeyboardTracking = this.isRecordActivity;
    act.appUrlId = this.selectedAppUrl;
    act.timeStamp = this.atuTimeStamp;
    this.employeeService.upsertActivityTrackerUserConfiguration(act).subscribe((response: any) => {
      if (response.data) {
        this.clearForm();
        this.addTrackerPopover.forEach((p) => p.closePopover());
        this.getEmployeesList();
      } else {

      }
      this.addTrackerPopover.forEach((p) => p.closePopover());
      this.upsertEnableTracking = false;
      this.cdRef.detectChanges();
    })
  }


  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  onKey(event) {
    if (event.keyCode == 17 || event.keyCode == 32) {
      this.userForm.controls['email'].setValue(this.userForm.controls['email'].value.toString().replace(/\s/g, ''));
    }
  }

  state: State = {
    skip: 0,
    take: 500,
  };

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    }
    this.getEmployeesList();
  }

  selectedRow(e) {
    if (((this.canAccess_feature_ViewEmployeePersonalDetails || this.canAccess_feature_ViewEmployeeLicenceDetails || this.canAccess_feature_ViewEmployeeContactDetails || this.canAccess_feature_ViewEmployeeEmergencyContactDetails
      || this.canAccess_feature_ViewEmployeeDependentContactDetails || this.canAccess_feature_ViewEmployeeImmigrationDetails || this.canAccess_feature_ViewEmployeeJobDetails || this.canAccess_feature_ViewEmploymentContractDetails
      || this.canAccess_feature_ViewEmployeeSalaryDetails || this.canAccess_feature_ViewEmployeeBankDetails || this.canAccess_feature_ViewEmployeeReportToDetails || this.canAccess_feature_ViewEmployeeLanguageDetails
      || this.canAccess_feature_ViewEmployeeSkillDetails || this.canAccess_feature_ViewEmployeeWorkExperienceDetails || this.canAccess_feature_ViewEmployeeEducationDetails || this.canAccess_feature_ViewEmployeeMembershipDetails || this.canAccess_feature_ViewEmployeeShiftDetails) && this.userId == e.dataItem.userId) || this.canAccess_feature_CanEditOtherEmployeeDetails)
      this.router.navigate(["dashboard/profile", e.dataItem.userId, "hr-record"]);
  }

  getEntityDropDown() {
    let searchText = "";
    let isEmployeeList = true;
    this.employeeService.getEntityDropDown(searchText, isEmployeeList).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.entities =[];
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  detectTrackingChange(){
    if(this.activityForm.value.isTracking){
      this.appsTrack = true;
    } else {
      this.appsTrack = false;
    }
    this.cdRef.detectChanges();
  }

  detectScreenshotChange(){
    if(this.activityForm.value.isScreenshotTracking){
      this.isScreenshot = true;
    } else {
      this.isScreenshot = false;
    }
    this.cdRef.detectChanges();
  }

  changeKeyboard(){
    if(this.activityForm.value.isKeyboardTracking) {
      this.isRecordActivity = true;
    } else{
      this.isRecordActivity = false;
    }
    this.cdRef.detectChanges();
  }

  changeMouse(){
    if(this.activityForm.value.isMouseTracking) {
      this.isMouse = true;
    } else{
      this.isMouse = false;
    } 
    this.cdRef.detectChanges();
  }

  selectedMatTab(event) {
    this.employeeGenericListDataLoading = true;
    this.selectedform = this.applicationForms[event];
    this.selectedform.gridData = { data: [], total: 0 };
    this.selectedform.pageSize = 10;
    this.selectedform.skip = 0;
    this.selectedform.gridDataResult = { data: [], total: 0 };
    this.getAllKeys(this.selectedform);
  }
  getAllKeys(form) {
    this.genericFormService.getFormKeysByFormId('21455f5f-26d2-433c-80c7-a227948763ec').subscribe((genericFormKeys: any) => {
      const formAllKeys = genericFormKeys.data;
      this.EmployeeFormKeys = genericFormKeys.data;
      this.makeColumns(form, formAllKeys, []);
    });
  }
  makeColumns(form, formAllKeys, formKeys) {
    const keyColumns = [];
    const fromJson = JSON.parse(form.formJson);
    _.forEach(formAllKeys, (formKey: any) => {
      if (fromJson !== undefined && fromJson != null) {
        const formComponents = fromJson["components"];
        formUtils.eachComponent(formComponents, (column) => {
          if (column["key"] === formKey.key) {
            const title = column["label"];
            let isItSelected = true;
            if (formKeys) {
              isItSelected = _.find(formKeys, (x: any) => {
                return x["key"] === formKey.key && x.isDefault;
              }) != null;
            }
            keyColumns.push({ field: "" + formKey.key, title, hidden: false, type: "text" });
          }
        }, false);
      }
    });
    const dataResult = [];
    let appsubmitted = [];
    appsubmitted = this.employeeListData;
    appsubmitted.forEach((employee) => {
      const employeeData = JSON.parse(JSON.stringify(employee));
      const fromJson = JSON.parse(this.applicationForms[0].formJson);
      _.forEach(this.EmployeeFormKeys, (formKey: any) => {
        if (fromJson !== undefined && fromJson != null) {
          const formComponents = fromJson["components"];
          formUtils.eachComponent(formComponents, (column) => {
            if(employee.formData!=null){
              const submittedForm = JSON.parse(employee.formData)
              if(submittedForm[column["key"]] != null || submittedForm[column["key"]] != undefined){
                employeeData[column["key"]] = submittedForm[column["key"]];
              } else{
                employeeData[column["key"]] = '';
              }
            } else{
              employeeData[column["key"]] = '';
            }
          }, false);
        }
    });
    dataResult.push(employeeData);
  });
  this.employeeListDataDetails = {
    data: dataResult,
    total: dataResult.length > 0 ? dataResult[0].totalCount : 0,
  }

    form.columns = _.sortBy(keyColumns, "title");
    
    this.employeeGenericListDataLoading = false;
    this.cdRef.detectChanges();
  }
  makeDataSetResult(form) {
    this.getPersistance();
    this.genericForm = new CustomFormFieldModel();
    this.genericForm.moduleTypeId = 79;
    this.genericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericFormService.searchCustomFields(this.genericForm).subscribe((result: any) => {
      if(result){
        if(result.data.length>0){
          this.applicationForms = result.data;
          this.customApplicationName = result.data[0].customApplicationName;
          this.isCustomColumns = true;
          this.selectedMatTab(0);}
      } else{
        this.employeeGenericListDataLoading = false;
        this.cdRef.detectChanges();
      }
    });
}
getCustomFields(){
  this.genericForm = new CustomFormFieldModel();
  this.genericForm.moduleTypeId = 79;
  this.genericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
  this.genericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
  this.genericFormService.searchCustomFields(this.genericForm).subscribe((result: any) => {
    if(result){
      if(result.data.length>0){
        this.applicationForms = result.data;
        this.customApplicationName = result.data[0].customApplicationName;
        this.isCustomColumns = true;
        this.selectedMatTab(0);}else{
          this.applicationForms = [];
        }
    } else{
      this.applicationForms = [];
      this.employeeGenericListDataLoading = false;
      this.cdRef.detectChanges();
    }
  });
}
onVisibilityChange(event) {
  let columns = event.columns;
  if (columns && columns.length > 0) {
      // this.columns = [];
      for (let i = 0; i < columns.length; i++) {
          let object = {};
          object['field'] = columns[i].field;
          object['hidden'] = columns[i].hidden;
          let index = this.columns.findIndex(x => x.field == columns[i].field);
          if (index == -1)
              this.columns.push(object);
          else {
              this.columns[index].field = columns[i].field;
              this.columns[index].hidden = columns[i].hidden;
          }
      }
      this.columns = this.columns;
      this.updatePersistance();
  }
}
updatePersistance() {
  let persistance = new Persistance();
      persistance.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
      persistance.isUserLevel = true;
      persistance.persistanceJson = JSON.stringify(this.columns);
      this.genericFormService.UpsertPersistance(persistance).subscribe((response: any) => {
          if (response.success) {
              // this.persistanceId = response.data;
          }
      });
}
getPersistance() {
      let persistance = new Persistance();
      persistance.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
      persistance.isUserLevel = true;
      this.genericFormService.GetPersistance(persistance).subscribe((response: any) => {
          if (response.success) {
              if (response.data) {
                  let result = response.data;
                  let data = JSON.parse(result.persistanceJson);
                  this.setPersistanceValues(data);
              }
              else {
                this.noPersist = true;
              }
          }
          else {
          }
      });
}
setPersistanceValues(data) {
  this.columns = (data != null || data.length > 0) ? data : [];
}
checkVisibility(fieldName) {
  let index = this.columns.findIndex(x => x.field == fieldName);
  if (index != -1) {
      return this.columns[index].hidden;
  }
  else {
      return false;
  }
}
getEmployeeFields() {
  let fieldDetails = new EmployeeFieldsModel();
this.employeeService.getEmployeeFields(fieldDetails).subscribe((response: any) => {
  if (response.data) {
    this.employeeFields=response.data;
  } else {

  }
})
}
exportToExcel(){
  this.excelGrid.saveAsExcel();
  this.downloadExcelComplete.emit();
}

exportToCsv() {
  let fileName = "EmployeesListCSV.csv"
  let formKeys = [];
  if(this.selectedform.formJson){
    const fromJson = JSON.parse(this.selectedform.formJson);
    _.forEach(this.EmployeeFormKeys, (formKey: any) => {
      if (fromJson !== undefined && fromJson != null) {
        const formComponents = fromJson["components"];
        formUtils.eachComponent(formComponents, (column) => {
          if (column["key"] === formKey.key) {
            const title = column["label"];
            let isItSelected = true;
            if (formKeys) {
              isItSelected = _.find(formKeys, (x: any) => {
                return x["key"] === formKey.key && x.isDefault;
              }) != null;
            }
            this.columnHeaders.push({ field: "" + formKey.key, title});
          }
        }, false);
      }
    });
  }
  this.employeeService.ConvertDataToCSVFile(this.columnHeaders, this.employeeListDataDetails.data,
      this.columnHeadersIgnored, fileName);
  this.downloadExcelComplete.emit();
}
}