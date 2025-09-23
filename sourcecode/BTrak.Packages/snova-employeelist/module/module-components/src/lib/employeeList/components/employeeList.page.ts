import { Component, ViewChild, ChangeDetectorRef, ElementRef, Inject, ViewChildren, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Store, select } from "@ngrx/store";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { SatPopover } from "@ncstate/sat-popover";
import { DepartmentModel } from "../../employeeList/models/department-model";
import { EmployeeListModel } from "../../employeeList/models/employee-model";
import { EmploymentStatusModel } from "../../employeeList/models/employment-status-model";
import { EmploymentStatusSearchModel } from "../../employeeList/models/employment-status-search-model";
import { State } from "../../employeeList/store/reducers/index";
import * as hrManagementModuleReducer from '../../employeeList/store/reducers/index';
import { LoadDepartmentListItemsTriggered } from "../../employeeList/store/actions/department.action";
import { LoadDesignationListItemsTriggered } from "../../employeeList/store/actions/designation.action";
import { LoadEmploymentStatusListItemsTriggered } from "../../employeeList/store/actions/employment-status.action";
import { OverlayContainer } from "@angular/cdk/overlay";
import * as _ from "underscore";
//import moment = require("moment");
//import * as moment from "moment"
import { JobCategoryModel } from "../../employeeList/models/job-category-model";
import { JobCategorySearchModel } from "../../employeeList/models/job-category-search-model";
import { LoadJobCategoryTriggered, JobCategoryActionTypes } from "../../employeeList/store/actions/job-category.actions";
import { LoadShiftTimingListItemsTriggered, ShiftTimingListActionTypes } from "../../employeeList/store/actions/shift-timing.action";
import { LoadRolesTriggered } from "../../employeeList/store/actions/roles.action";
import { LoadTimeZoneListItemsTriggered, TimeZoneListActionTypes } from "../../employeeList/store/actions/time-zone.actions";
import { tap, takeUntil } from "rxjs/operators";
import { Actions, ofType } from "@ngrx/effects";
import { anyChanged } from "@progress/kendo-angular-grid/dist/es2015/utils";
import { LoadEmployeeListItemsTriggered, EmployeeListActionTypes } from "../../employeeList/store/actions/employee-list.action";
import { MatDialog } from "@angular/material/dialog";
import { EmployeeUploadPopupComponent } from "./employee-upload";
import * as FileSaver from 'file-saver';
import { CookieService } from "ngx-cookie-service";
import { Branch } from '../../employeeList/models/branch';
import { User } from '../../employeeList/models/induction-user-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DesignationModel } from '../../employeeList/models/designations-model';
import { BranchActionTypes, LoadBranchTriggered } from '../../employeeList/store/actions/branch.actions';
import { TimeZoneModel } from '../../employeeList/models/time-zone';
import { CurrencyActionTypes, LoadCurrencyTriggered } from '../../employeeList/store/actions/currency.actions';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../employeeList/models/softLabels-model';
import { RoleModel } from '../../employeeList/models/role-model';
import { EntityDropDownModel } from '../../employeeList/models/entity-dropdown.module';
import { ShiftTimingModel } from '../../employeeList/models/shift-timing-model';
import { Currency } from '../../employeeList/models/currency';
import { LineManagersModel } from '../../employeeList/models/line-mangaers-model';
import { PayRollTemplateModel } from '../../employeeList/models/PayRollTemplateModel';
import { EmployeeListService } from '../services/employee-list.service';
import './../../globaldependencies/helpers/fontawesome-icons';
import { InductionWorItemDialogComponent } from './induction-work-items/induction-workitem-dialog.component';
import { TranslateService } from "@ngx-translate/core";
import { GenericFormService } from "../services/generic-form.service";
import { CreateGenericForm } from "../models/createGenericForm";
import { EmployeeFieldsModel } from "../models/employee-fields.model";
import { CustomFormFieldModel } from "../models/custom-form-field.model";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
declare var require: any

@Component({
  selector: "app-hr-page-employeeList",
  templateUrl: "./employeeList.page.template.html"
})



export class EmployeeListPageComponent extends CustomAppBaseComponent {
  @ViewChild('reportToPopover') reportToPopover: SatPopover;
  @ViewChild('branchPopover') branchPopover: SatPopover;
  @ViewChild('designationPopover') designationPopover: SatPopover;
  @ViewChild('statusPopover') statusPopover: SatPopover;
  @ViewChild('departmentPopover') departmentPopover: SatPopover;
  @ViewChild("fileInput") fileInput: ElementRef;

  @ViewChildren("addEmployeePopover") addEmployeePopover;
  @ViewChild('formDialogComponent') formCreatorComponentDialog: TemplateRef<any>;

  @Inject(Window) private window: Window
  employeeSearchResultData: EmployeeListModel;
  employeeListDataDetails: EmployeeListModel[];
  softLabels: SoftLabelConfigurationModel[];
  fileToUpload: File = null;
  isOpen: boolean = true;
  selectedEmployeeId = '';
  searchEmail = '';
  searchByEmails: boolean = false;
  designation: boolean = false;
  employmentStatus: boolean = false;
  department: boolean = false;
  nameFilterIsActive: boolean = false;
  entityIsActive: boolean = false;
  lineManagerIsActive: boolean = false;
  isRemoteSoftware: boolean = false;
  selectedDepartmentId: string = '';
  selectedDesignationId: string = '';
  selectedEmploymentStatus: string = '';
  selectedLineManager: string = '';
  selectedEntityId: string = '';
  searchText: string = '';
  isArchived: boolean = false;
  validationMessage: string;
  searchLineManager: string = '';
  operationInProgress: boolean;
  branchName: string;
  lineManagerName: string;
  designationName: string;
  employeeStatusName: string;
  isActive = true;
  employeeTemplates: PayRollTemplateModel[];
  departmentName: string;
  roleFeaturesIsInProgress$: Observable<boolean>;
  loggedUserDetails: any;
  filterValue = {
    value: 'all'
  };
  public ngDestroyed$ = new Subject();
  isNewUser: boolean = false;
  employeeName: string;

  lineManager: LineManagersModel[];
  branchList$: Observable<Branch[]>;
  branchList: Branch[];
  selectUserDropDownListData$: Observable<User[]>;
  employeeDetailsList$: Observable<EmployeeListModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  employeeListDataDetails$: Observable<EmployeeListModel[]>;
  selectDepartmentDropDownListData$: Observable<DepartmentModel[]>;
  selectDepartmentDropDownListData: DepartmentModel[];
  selectDesignationDropDownListData$: Observable<DesignationModel[]>;
  selectDesignationDropDownListData: DesignationModel[];
  selectEmploymentStatusDropDownListData$: Observable<EmploymentStatusModel[]>;
  selectEmploymentStatusDropDownListData: EmploymentStatusModel[];
  entities: EntityDropDownModel[];


  uploadedData: EmployeeListModel[];
  addEmployee: EmployeeListModel;
  employeeEmailData: EmployeeListModel[];
  jobCategoryList$: Observable<JobCategoryModel[]>;
  jobCategoryList: JobCategoryModel[];
  selectRolesListData$: Observable<RoleModel[]>;
  selectedRolesListData: RoleModel[];
  employeeListDataLoading$: Observable<boolean>
  selectEmployeeShiftDropDownListData$: Observable<ShiftTimingModel[]>
  selectEmployeeShiftDropDownListData: ShiftTimingModel[]
  currencyList$: Observable<Currency[]>;
  currencyList: Currency[];
  timeZoneList$: Observable<TimeZoneModel[]>;
  timeZoneList: TimeZoneModel[];
  allRoles: any[];
  employeeList$: Observable<EmployeeListModel[]>;
  employeeList: EmployeeListModel[];
  departmentsLoading$: Observable<boolean>;
  designationsLoading$: Observable<boolean>;
  entitiesLoading: boolean;
  selectedStatusId = "Active";
  employmentTypeLoading$: Observable<boolean>;
  rolesLoading$: Observable<boolean>;
  branchesLoading$: Observable<boolean>;
  jobCategoriesLoading$: Observable<boolean>;
  shiftTimingsLoading$: Observable<boolean>;
  currenciesLoading$: Observable<boolean>;
  timeZonesLoading$: Observable<boolean>;
  popUpOpen: boolean = false;
  genericForm: CustomFormFieldModel;
  applicationForms: any;
  customApplicationName: any;
  @ViewChild("addEmployeePopup") addEmployeePopup: TemplateRef<any>;
  employeeFields: any;
  updatedFieldCongiguration: boolean=false;
  downloadExcel: boolean=false;
  addEmployeeFormSourc: any;
  downloadCsv: boolean;
  constructor(private overlayContainer: OverlayContainer, private store: Store<State>,
    private cookieService: CookieService, private toastr: ToastrService, private cdRef: ChangeDetectorRef
    , private toaster: ToastrService,
    private actionUpdates$: Actions
    , private dialog: MatDialog
    , private EmployeeService: EmployeeListService
    , private routes: Router,
    private translateService: TranslateService,
    private genericFormService: GenericFormService,
  ) {
    super();
    this.downloadExcel=false;
    this.getEmployeeFields();
    this.genericForm = new CustomFormFieldModel();
    this.genericForm.moduleTypeId = 79;
    this.genericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericFormService.searchCustomFields(this.genericForm).subscribe((result: any) => {
      if(result){
        if(result.data.length>0){
          this.applicationForms = result.data;
          this.customApplicationName = result.data[0].customApplicationName;} else{
            this.applicationForms = [];
          }
      } else{
        this.applicationForms = [];
      }
    });
    //const moments = moment;
    this.actionUpdates$
      .pipe(
        ofType(BranchActionTypes.LoadBranchCompleted),
        tap(() => {
          this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
          this.branchList$.subscribe((result) => {
            this.branchList = result;
            // if(result == null){
            //   result = [];
            // }
            //this.cookieService.set(LocalStorageProperties.Branches, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(CurrencyActionTypes.LoadCurrencyCompleted),
        tap(() => {
          this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
          this.currencyList$.subscribe((result) => {
            this.currencyList = result;
            // if(result == null){
            //   result = [];
            // }
            //this.cookieService.set(LocalStorageProperties.Currencies, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(JobCategoryActionTypes.LoadJobCategoryCompleted),
        tap(() => {
          this.jobCategoryList$ = this.store.pipe(select(hrManagementModuleReducer.getJobCategoryAll));
          this.jobCategoryList$.subscribe((result) => {
            this.jobCategoryList = result;
            // if(result == null){
            //   result = [];
            // }
            //this.cookieService.set(LocalStorageProperties.JobCategories, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(ShiftTimingListActionTypes.LoadShiftTimingListItemsCompleted),
        tap(() => {
          this.selectEmployeeShiftDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getShiftTimingAll));
          this.selectEmployeeShiftDropDownListData$.subscribe((result) => {
            this.selectEmployeeShiftDropDownListData = result;
            // if(result == null){
            //   result = [];
            // }
            //this.cookieService.set(LocalStorageProperties.ShiftTimings, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(TimeZoneListActionTypes.LoadTimeZoneListItemsCompleted),
        tap(() => {
          this.timeZoneList$ = this.store.pipe(select(hrManagementModuleReducer.getTimeZoneAll));
          this.timeZoneList$.subscribe((result) => {
            this.timeZoneList = result;
            // if(result == null){
            //   result = [];
            // }
            //this.cookieService.set(LocalStorageProperties.TimeZones, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(EmployeeListActionTypes.LoadEmployeeListItemsCompleted),
        tap(() => {
          this.employeeList$ = this.store.pipe(select(hrManagementModuleReducer.getEmployeeAll));
          this.employeeList$.subscribe((result) => (this.employeeList = result));
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
        tap(() => {
          this.addEmployeePopover.forEach((p) => p.closePopover());
          this.popUpOpen = false;
          if (this.isNewUser) {
            this.isNewUser = false;
            this.employeeName = this.EmployeeService.firstName + " " + this.EmployeeService.surName + " (" + this.EmployeeService.employeeNumber + ")";
            this.addInductionWork();
          }
        })
      ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getCompanyDetails();
    this.getSoftLabelConfigurations();
    this.getDepartmentList();
    this.getDesignationList();
    this.getEmploymentStatusList();
    this.getAllEmployees();
    this.getEntityDropDown();
    this.getAllPayRollTemplates();
    if (window.matchMedia("(max-width: 768px)").matches) {
      this.isOpen = false;
    }
    else {
      this.isOpen = true;
    }

    if (this.canAccess_feature_CanEditOtherEmployeeDetails) {
      this.getRoles();
      this.getJobCategoryList();
      this.getShiftTimingList();
      this.getBranchList();
      this.getCurrencyList();
      this.getTimeZoneList();
    }
    // this.getAllEmployeeDeatils();
  }
  // getAllEmployeeDeatils() {
  //   const employeeListSearchResult = new EmployeeListModel();
  //   this.store.dispatch(new LoadEmployeeListItemsTriggered(employeeListSearchResult));
  // }

  addInductionWork() {
    const dialogRef = this.dialog.open(InductionWorItemDialogComponent, {
      minWidth: "80vw",
      maxHeight: "80vh",
      disableClose: true,
      data: this.employeeName
    });
  }

  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }

  getBranchList() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchesLoading$ = this.store.pipe(select(hrManagementModuleReducer.getBranchLoading));
  }

  getDepartmentList() {
    var departmentSearchModel = new DepartmentModel();
    departmentSearchModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadDepartmentListItemsTriggered(departmentSearchModel));
    this.selectDepartmentDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentAll));
    this.departmentsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDepartmentLoading));
    this.selectDepartmentDropDownListData$.subscribe((result) => {
      this.selectDepartmentDropDownListData = result;
    })
  }

  getDesignationList() {
    var designationSearchModel = new DesignationModel();
    designationSearchModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadDesignationListItemsTriggered(designationSearchModel));
    this.designationsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationLoading));
    this.selectDesignationDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getDesignationAll));
    this.selectDesignationDropDownListData$.subscribe((result) => {
      this.selectDesignationDropDownListData = result;
    });
  }

  getEmploymentStatusList() {
    var employmentSearchModel = new EmploymentStatusSearchModel();
    employmentSearchModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadEmploymentStatusListItemsTriggered(employmentSearchModel));
    this.employmentTypeLoading$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusLoading));
    this.selectEmploymentStatusDropDownListData$ = this.store.pipe(select(hrManagementModuleReducer.getEmploymentStatusAll), tap(result => {
      this.selectEmploymentStatusDropDownListData = result
      // if(result == null){
      //   result = []
      // }
      //this.cookieService.set(LocalStorageProperties.EmploymentStatus, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    }));
  }

  searchByEntityId(id, event) {
    // this.selectedEntityId = id;
    // this.entityIsActive = true;
    // this.branchName = event.source.selected._element.nativeElement.innerText.trim();
    if (id == "all") {
      this.selectedEntityId = id;
      if (event == null)
        this.branchName = null;
      else
        this.branchName = event.source.selected._element.nativeElement.innerText.trim();
    }
    else {
      this.selectedEntityId = id;
      this.branchName = event.source.selected._element.nativeElement.innerText.trim();
    }
    this.getAllEmployees();
  }

  searchByActiveStatuses(active){
    if(this.selectedStatusId == active){
      this.searchByActiveStatus('Inactive');
    }
    else{
      this.searchByActiveStatus('Active');
    }

  }
  
  searchByActiveStatus(active) {
    this.selectedStatusId = active;
    if (active == "All") {
      this.isActive = null;
    }
    else if (active == "Active") {
      this.isActive = true;
    }
    else {
      this.isActive = false;
    }
    this.getAllEmployees();
  }

  getJobCategoryList() {
    var jobCategorySearchModel = new JobCategorySearchModel();
    jobCategorySearchModel.isArchived = false;
    this.store.dispatch(new LoadJobCategoryTriggered(jobCategorySearchModel));
    this.jobCategoriesLoading$ = this.store.pipe(select(hrManagementModuleReducer.getJobCategoryLoading));

  }

  getShiftTimingList() {
    var shiftTimingSearchModel = new ShiftTimingModel();
    shiftTimingSearchModel.isArchived = false;
    this.store.dispatch(new LoadShiftTimingListItemsTriggered(shiftTimingSearchModel));
    this.shiftTimingsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getShiftTimingLoading));
  }


  getRoles() {
    var roleModel = new RoleModel();
    roleModel.isArchived = false;
    this.store.dispatch(new LoadRolesTriggered(roleModel));
    this.rolesLoading$ = this.store.pipe(select(hrManagementModuleReducer.getRolesLoading));
    this.selectRolesListData$ = this.store.pipe(select(hrManagementModuleReducer.getRolesAll), tap(result => {
      this.selectedRolesListData = result;
      //this.cookieService.set(LocalStorageProperties.Roles, JSON.stringify(result), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
    }));
    this.selectRolesListData$.subscribe((roles) => (this.allRoles = roles));
  }

  getCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
    this.currenciesLoading$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyLoading));
  }

  getTimeZoneList() {
    var timeZoneModel = new TimeZoneModel;
    timeZoneModel.isArchived = false;
    this.store.dispatch(new LoadTimeZoneListItemsTriggered(timeZoneModel));
    this.timeZonesLoading$ = this.store.pipe(select(hrManagementModuleReducer.getTimeZoneLoading));
  }

  searchByDepartment(departmentId, event) {
    if (departmentId == "all") {
      this.selectedDepartmentId = departmentId;
      if (event == null)
        this.departmentName = null;
      else
        this.departmentName = event.source.selected._element.nativeElement.innerText.trim();
      this.department = false;
    }
    else {
      this.selectedDepartmentId = departmentId;
      this.departmentName = event.source.selected._element.nativeElement.innerText.trim();
      this.department = true;
    }
    // this.departmentPopover.close();
    this.getAllEmployees();
  }

  searchByDesignation(designationId, event) {
    if (designationId == "all") {
      this.selectedDesignationId = designationId;
      if (event == null)
        this.designationName = null;
      else
        this.designationName = event.source.selected._element.nativeElement.innerText.trim();
      this.designation = false;
    }
    else {
      this.selectedDesignationId = designationId;
      this.designationName = event.source.selected._element.nativeElement.innerText.trim();
      this.designation = true;
    }
    // this.designationPopover.close();
    this.getAllEmployees();
  }

  searchByEmploymentStatus(employmentStatusId, event) {
    if (employmentStatusId == "all") {
      this.selectedEmploymentStatus = employmentStatusId;
      if (event == null)
        this.employeeStatusName = null;
      else
        this.employeeStatusName = event.source.selected._element.nativeElement.innerText.trim();
      this.employmentStatus = false;
    }
    else {
      this.selectedEmploymentStatus = employmentStatusId;
      this.employeeStatusName = event.source.selected._element.nativeElement.innerText.trim();
      this.employmentStatus = true;
    }
    // this.statusPopover.close();
    this.getAllEmployees();
  }

  searchByLineManager() {
    this.operationInProgress = true;
    this.searchLineManager = this.searchLineManager.trim();
    if (this.searchLineManager) {
      this.lineManagerIsActive = true;
      this.EmployeeService.getLineManagers(this.searchLineManager).subscribe((responseData: any) => {
        this.operationInProgress = false;
        let success = responseData.success;
        if (success && this.searchLineManager) {
          this.employeeListDataDetails = responseData.data;
          // this.searchLineManager = responseData.data.userName;
          // this.searchLineManager= this.employeeListDataDetails.userName;
        }
        else {
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", this.validationMessage);
        }
      });
    }
    else {
      this.closeSearchReportTo();
    }
  }

  closeSearchReportTo() {
    this.lineManagerIsActive = false;
    this.operationInProgress = false;
    this.searchLineManager = '';
    this.employeeListDataDetails = [];
    this.selectedLineManager = '';
    this.getAllEmployees();
    return;
  }

  selectedLineManagerId(lineManagerId) {
    this.selectedLineManager = lineManagerId;
    this.searchLineManager = this.lineManagerName;
    this.getAllEmployees();
  }

  displayFn(lineManagerId) {
    if (!lineManagerId) return '';
    let lineManager = this.employeeListDataDetails.find(lineManager => lineManager.employeeId === lineManagerId);
    this.searchLineManager = lineManager.userName;
    this.lineManagerName = lineManager.userName;
    return lineManager.userName;
  }

  search() {
    if (this.searchText.length <= 0)
      this.nameFilterIsActive = false;
    else {
      this.searchText = this.searchText.trim();
      if (this.searchText.length > 0) {
        this.nameFilterIsActive = true;
      }
      else {
        this.nameFilterIsActive = false;
        return;
      }
    }
    this.getAllEmployees();
  }

  closeSearch() {
    this.searchText = '';
    this.nameFilterIsActive = false;
    this.getAllEmployees();
  }

  searchByEmail() {
    if (this.searchEmail && this.searchEmail.trim().length <= 0) return;
    if (this.searchEmail.trim() == '')
      this.searchByEmails = false;
    else
      this.searchByEmails = true;
    this.getAllEmployees();
  }

  closeEmailSearch() {
    this.searchEmail = '';
    this.searchByEmails = false;
    this.getAllEmployees();
  }

  getAllEmployees() {
    var employeeSearchResult = new EmployeeListModel();
    employeeSearchResult.departmentId = this.selectedDepartmentId == "all" ? "" : this.selectedDepartmentId;
    employeeSearchResult.designationId = this.selectedDesignationId == "all" ? "" : this.selectedDesignationId;
    employeeSearchResult.entityId = this.selectedEntityId;
    employeeSearchResult.employmentStatusId = this.selectedEmploymentStatus == "all" ? "" : this.selectedEmploymentStatus;
    employeeSearchResult.lineManagerId = this.selectedLineManager;
    employeeSearchResult.emailSearchText = this.searchEmail;
    employeeSearchResult.searchText = this.searchText;
    employeeSearchResult.userName = this.lineManagerName;
    employeeSearchResult.isActive = this.isActive;
    this.employeeSearchResultData = employeeSearchResult;
  }

  getAllPayRollTemplates() {
    var payRollTemplateModel = new PayRollTemplateModel();
    payRollTemplateModel.isArchived = false;
    this.EmployeeService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
      if (response.success == true) {
        if (response.data && response.data.length > 0) {
          this.employeeTemplates = response.data;
        }
      }
    });
  }

  resetAllFilters() {
    this.selectedDepartmentId = '';
    this.selectedDesignationId = '';
    this.selectedEntityId = '';
    this.selectedEmploymentStatus = '';
    this.selectedStatusId = "Active";
    this.isActive = true;
    this.searchEmail = '';
    this.searchText = '';
    this.selectedLineManager = '';
    this.searchLineManager = '';
    this.department = false;
    this.designation = false;
    this.entityIsActive = false;
    this.employmentStatus = false;
    this.searchByEmails = false;
    this.nameFilterIsActive = false;
    this.lineManagerIsActive = false;
    this.branchName = null;
    this.designationName = null;
    this.employeeStatusName = null;
    this.departmentName = null;
    this.getAllEmployees();
  }

  
  filterClick() {
    this.isOpen = !this.isOpen;
    if (window.matchMedia("(max-width: 768px)").matches) {
      return false;
    } else {
      return true;
    }
  }

  getEntityDropDown() {
    let searchText = "";
    this.entitiesLoading = true;
    let isEmployeeList = true;
    this.EmployeeService.getEntityDropDown(searchText, isEmployeeList).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.entities =[];
      }
      else {
        this.entities = responseData.data;
        //this.cookieService.set(LocalStorageProperties.Entities, JSON.stringify(responseData.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
      }
      this.entitiesLoading = false;
      this.cdRef.detectChanges();
    });
  }

  filter() {
    if (this.searchText || this.selectedStatusId || this.searchEmail || this.branchName || this.designationName || this.employeeStatusName || this.departmentName || this.searchLineManager) {
      return true;
    } else {
      return false;
    }
  }

  uploadEventHandler(file, event) {

    if (file != null) {
      var XLSX = require('xlsx');
      var reader = new FileReader();

      let allRolesList = this.selectedRolesListData;
      let allDesignation = this.selectDesignationDropDownListData;
      let allDepartment = this.selectDepartmentDropDownListData;
      let allCurrencyList = this.currencyList;
      let allEployeeTypes = this.selectEmploymentStatusDropDownListData;
      let allBranches = this.branchList;
      let jobCategoryList = this.jobCategoryList;
      let allEntities = this.entities;
      let allShifts = this.selectEmployeeShiftDropDownListData;
      let allTimeZone = this.timeZoneList;
      let allEmployeeDetails = this.employeeList;
      let dialog = this.dialog;
      let fileTemInput = this.fileInput;
      let employeesTemplates = this.employeeTemplates;
      let isRemoteSoftware = this.isRemoteSoftware;
      let noSuchPayrollNotFound = this.translateService.instant("HRMANAGAMENT.THEPAYROLLTEMPLATEISNOTFOUND");
      let firtNameRequired = this.translateService.instant("HRMANAGAMENT.THEFIRSTNAMEISREQUIRED");
      let lastNameRequired = this.translateService.instant("HRMANAGAMENT.THELASTNAMEISREQUIRED");
      let emailRequired = this.translateService.instant("HRMANAGAMENT.THEEMAILISREQUIRED");
      let emailFormatWrong = this.translateService.instant("HRMANAGAMENT.ENTEREDEMAILFORMATISWRONG");
      let emailAlreadyExist = this.translateService.instant("HRMANAGAMENT.EMAILISALREADYEXISTING");
      let ctcRequired = this.translateService.instant("HRMANAGAMENT.CTCREQUIRED");
      let ctcShouldBeNumeric = this.translateService.instant("HRMANAGAMENT.CTCSHOULDBEANUMERICVALUE");
      let mobileNumberRequired = this.translateService.instant("HRMANAGAMENT.THEMOBILENUMBERISREQUIRED");
      let employeeNumberRequired = this.translateService.instant("HRMANAGAMENT.THEEMPLOYEENUMBERISREQUIRED");
      let employeeNumberExists = this.translateService.instant("HRMANAGAMENT.EMPLOYEENUMBERISALREADYEXISTING");
      let noSuchPayrollTemplatesExist = this.translateService.instant("HRMANAGAMENT.THEREISNOSUCHPAYROLLTEMPLATESEXISTFORTHISCOMPANY");
      let roleRequired = this.translateService.instant("HRMANAGAMENT.THEROLEISREQUIRED");
      let noRoleExists = this.translateService.instant("HRMANAGAMENT.THEREISNOROLEWITHTHATNAME");
      let designationRequired = this.translateService.instant("HRMANAGAMENT.THEDESIGNATIONISREQUIRED");
      let designationInvalid = this.translateService.instant("HRMANAGAMENT.GIVENDESIGNATIONISINVALID");
      let departmentRequired = this.translateService.instant("HRMANAGAMENT.THEDEPARTMENTISREQUIRED");
      let departmentInvalid = this.translateService.instant("HRMANAGAMENT.GIVENDEPARTMENTISINVALID");
      let currencyRequired = this.translateService.instant("HRMANAGAMENT.THECURRENCYISREQUIRED");
      let currencyInvalid = this.translateService.instant("HRMANAGAMENT.GIVENCURRENCYISINVALID");
      let employeeTypeRequired = this.translateService.instant("HRMANAGAMENT.THEEMPLOYEETYPEISREQUIRED");
      let employeeTypeInvalid = this.translateService.instant("HRMANAGAMENT.GIVENEMPLOYEMENTTYPEISINVALID");
      let branchRequired = this.translateService.instant("HRMANAGAMENT.THEBRANCHISREQUIRED");
      let branchInvalid = this.translateService.instant("HRMANAGAMENT.GIVENBRANCHISINVALID");
      let jobCategoryRequired = this.translateService.instant("HRMANAGAMENT.THEJOBCATEGORYISREQUIRED");
      let jobCategoryInvalid = this.translateService.instant("HRMANAGAMENT.GIVENJOBCATEGORYISINVALID");
      let entityRequired = this.translateService.instant("HRMANAGAMENT.THEENTITYISREQUIRED");
      let entityExists = this.translateService.instant("HRMANAGAMENT.THEREISENTITYWITHTHATNAME");
      let joiningDateRequired = this.translateService.instant("HRMANAGAMENT.THEJOINEDDATEISREQUIRED");
      let joiningDateIncorrectFormat = this.translateService.instant("HRMANAGAMENT.JOINEDDATEISNOTCORRECTFORMAT");
      let shiftTimeNotExists = this.translateService.instant("HRMANAGAMENT.THESHIFTNAMEISNOTEXISTS");
      reader.onload = function (e: any) {

        let uploadedData = [];
        var bstr = (e != undefined && e.target != undefined) ? e.target.result : "";
        var workBook = XLSX.read(bstr, { type: 'binary' });
        var shtData = workBook.Sheets[workBook.SheetNames[0]];
        if (isRemoteSoftware) {
          var sheetData = XLSX.utils.sheet_to_json(shtData, {
            header: ["FirstName", "SurName", "Email", "Branch", "Entity", "MobileNumber", "EmployeeNumber",
              "Role", "Designation", "Currency", "EmployementType", "Shift", "JobCategory", "JoinedDate",
              "TimeZone", "Department"], raw: false, defval: ''
          });
        } else {
          var sheetData = XLSX.utils.sheet_to_json(shtData, {
            header: ["FirstName", "SurName", "Email", "Branch", "Entity", "MobileNumber", "EmployeeNumber",
              "Role", "Designation", "Currency", "EmployementType", "Shift", "JobCategory", "JoinedDate",
              "TimeZone", "Salary", "PayrollTemplate", "Department"], raw: false, defval: ''
          });
        }

        sheetData.forEach(function (item, index) {

          if (index > 0) {

            var isCurrencyValid, isDesignationValid, isRoleValid, isValidDate, isJobCategoryValid,
              isBranchValid, isEntityValid, isEmpStatusValid, isShiftValid, isTimeZoneValid, isEmailExist
              , isEmpNumberExist, isDepartmentValid;
            var isAllRolesValid = true;
            var isAllEntityValid = true;
            var errorMessage = [];
            var IsEmployeeValid = true;
            var salary = 0;

            if (item.FirstName.trim() == "") {
              errorMessage.push(firtNameRequired);
              IsEmployeeValid = false;
            }

            if (item.SurName.trim() == "") {
              errorMessage.push(lastNameRequired);
              IsEmployeeValid = false;
            }

            if (item.Email.trim() == "") {
              errorMessage.push(emailRequired);
              IsEmployeeValid = false;
            }

            if (item.Email) {
              var email = item.Email.trim();
              var expression = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
              var regex = new RegExp(expression);
              if (!email.match(regex)) {
                errorMessage.push(emailFormatWrong);
                IsEmployeeValid = false;
              }
              else {
                isEmailExist = _.filter(allEmployeeDetails, function (emp) { return emp.email.trim().toLowerCase() == item.Email.toLowerCase() }).length;
                if (isEmailExist > 0) {
                  errorMessage.push(emailAlreadyExist);
                  IsEmployeeValid = false;
                }
                else {

                  isEmailExist = _.filter(uploadedData, function (emp) { return emp.email.trim().toLowerCase() == item.Email.toLowerCase() }).length;
                  if (isEmailExist > 0) {
                    errorMessage.push(emailAlreadyExist);
                    IsEmployeeValid = false;
                  }
                }
              }
            }

            if (!isRemoteSoftware) {
              if (item.Salary == null || item.Salary.trim() == "") {
              }
              else {
                if (isNaN(Number(item.Salary.trim().replace(/,/g, "")))) {
                  errorMessage.push(ctcShouldBeNumeric);
                  IsEmployeeValid = false;
                }
                else {
                  salary = item.Salary.trim();
                }
              }
            }
            // if (item.MobileNumber.trim() == "") {
            //   errorMessage.push(mobileNumberRequired);
            //   IsEmployeeValid = false;
            // }

            if (item.EmployeeNumber.trim() == "") {
              // errorMessage.push(employeeNumberRequired);
              // IsEmployeeValid = false;
            }
            else {

              isEmpNumberExist = _.filter(allEmployeeDetails, function (emp) { 
                if(emp.employeeNumber)
                return emp.employeeNumber.trim().toLowerCase() == item.EmployeeNumber.toLowerCase() }).length;

              if (isEmpNumberExist > 0) {
                errorMessage.push(employeeNumberExists);
                IsEmployeeValid = false;
              }
              else {
                isEmpNumberExist = _.filter(uploadedData, function (emp) { 
                  if(emp.employeeNumber)
                  return emp.employeeNumber.trim().toLowerCase() == item.EmployeeNumber.toLowerCase() }).length;
                if (isEmpNumberExist > 0) {
                  errorMessage.push(employeeNumberExists);
                  IsEmployeeValid = false;
                }
              }
            }
            if (!isRemoteSoftware) {
              if (item.PayrollTemplate && item.PayrollTemplate.trim() != '') {
                if (employeesTemplates != null && employeesTemplates.length > 0) {
                  var payrollTemplate = _.find(employeesTemplates, function (template: PayRollTemplateModel) {
                    return template.payRollName.toLowerCase().trim().replace(/\s/g, '') == item.PayrollTemplate.toLowerCase().replace(/\s/g, '')
                  });
                  if (payrollTemplate) {
                    var payrollTemplateId = payrollTemplate.payRollTemplateId;
                    var payrollTemplateName = payrollTemplate.payRollName;
                  }
                  else {
                    errorMessage.push(noSuchPayrollNotFound);
                    IsEmployeeValid = false;
                  }
                } else {
                  errorMessage.push(noSuchPayrollTemplatesExist);
                  IsEmployeeValid = false;
                }
              }
            }
            var roleIdsList = [];
            if (item.Role.trim() == "") {
              errorMessage.push(roleRequired);
              IsEmployeeValid = false;
            }
            else {
              // Check for Roles
              var roles = item.Role != "" ? item.Role.split(',') : [];
              roles.forEach(roleData => {
                isRoleValid = _.find(allRolesList, function (role) {
                  return role.roleName.toLowerCase().trim().replace(/\s/g, '') == roleData.toLowerCase().replace(/\s/g, '')
                });
                if (isRoleValid == undefined) {
                  errorMessage.push(noRoleExists);
                  IsEmployeeValid = false;
                  isAllRolesValid = false;
                }
                else
                  roleIdsList.push(isRoleValid.roleId.trim());
              });
            }

            if (item.Designation.trim() == "") {
              // errorMessage.push(designationRequired);
              // IsEmployeeValid = false;
            }
            else {
              // Check for Designation
              isDesignationValid = _.find(allDesignation, function (designation) {
                return designation.designationName.toLowerCase().trim().replace(/\s/g, '') == item.Designation.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isDesignationValid == undefined) {
                errorMessage.push(designationInvalid);
                IsEmployeeValid = false;
              }
            }
            let objectKeys = Object.keys(item);
            if (objectKeys.find(x => x == "Department")) {
              if (item.Department.trim() == "") {
                // errorMessage.push(departmentRequired);
                // IsEmployeeValid = false;
              }
              else {
                //Check for Department
                isDepartmentValid = _.find(allDepartment, function (Department) {
                  return Department.departmentName.toLowerCase().trim().replace(/\s/g, '') == item.Department.toLowerCase().trim().replace(/\s/g, '')
                });
                if (isDepartmentValid == undefined) {
                  errorMessage.push(departmentInvalid);
                  IsEmployeeValid = false;
                }
              }
            }

            if (item.Currency.trim() == "") {
              // errorMessage.push(currencyRequired);
              // IsEmployeeValid = false;
            }
            else {
              // Check for currency
              isCurrencyValid = _.find(allCurrencyList, function (currency) {
                return currency.currencyName.toLowerCase().trim().replace(/\s/g, '') == item.Currency.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isCurrencyValid == undefined) {
                errorMessage.push(currencyInvalid);
                IsEmployeeValid = false;
              }
            }

            if (item.EmployementType.trim() == "") {
              // errorMessage.push(employeeTypeRequired);
              // IsEmployeeValid = false;
            }
            else {
              // Check for EmployementType
              isEmpStatusValid = _.find(allEployeeTypes, function (emp) {
                return emp.employmentStatusName.toLowerCase().trim().replace(/\s/g, '') == item.EmployementType.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isEmpStatusValid == undefined) {
                errorMessage.push(employeeTypeInvalid);
                IsEmployeeValid = false;
              }
            }

            if (item.Branch.trim() == "") {
              errorMessage.push(branchRequired);
              IsEmployeeValid = false;
            }
            else {
              // Check for Branch
              isBranchValid = _.find(allBranches, function (branch) {
                return branch.branchName.toLowerCase().trim().replace(/\s/g, '') == item.Branch.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isBranchValid == undefined) {
                errorMessage.push(branchInvalid);
                IsEmployeeValid = false;
              }
            }

            if (item.JobCategory.trim() == "") {
              // errorMessage.push(jobCategoryRequired);
              // IsEmployeeValid = false;
            }
            else {
              // Check for JobCategory
              isJobCategoryValid = _.find(jobCategoryList, function (job) {
                return job.jobCategoryName.toLowerCase().trim().replace(/\s/g, '') == item.JobCategory.toLowerCase().trim().replace(/\s/g, '')
              });
              if (isJobCategoryValid == undefined) {
                errorMessage.push(jobCategoryInvalid);
                IsEmployeeValid = false;
              }
            }
            var allEntityList = [];
            if (item.Entity.trim() == "") {
              errorMessage.push(entityRequired);
              IsEmployeeValid = false;
            }
            else {
              // Check for Entity
              var entities = item.Entity != "" ? item.Entity.split(',') : [];

              entities.forEach(entityName => {
                isEntityValid = _.find(allEntities, function (entity) {
                  return entity.name.toLowerCase().trim().replace(/\s/g, '') == entityName.toLowerCase().trim().replace(/\s/g, '')
                });
                if (isEntityValid == undefined) {
                  errorMessage.push(entityExists);
                  IsEmployeeValid = false;
                  isAllEntityValid = false;
                }
                else
                  allEntityList.push(isEntityValid.id);
              });
            }

            if (item.JoinedDate.trim() == "") {
              // errorMessage.push(joiningDateRequired);
              // IsEmployeeValid = false;
            }
            else {

              item.JoinedDate = item.JoinedDate.trim();
              // Start Date Check
              let moment = require('moment');
              isValidDate = moment(item.JoinedDate, ["DD-M-YY", "DD.M.YY", "M-DD-YY", "MM-DD-YY", "M-DD-YYYY", "D.M.YYYY", "DD.MM.YYYY", "MM-DD-YYYY", "DD-MM-YYYY", "YYYY-MM-DD", "DD-MMMM-YYYY", "DD-MM-YY", "dddd-MMMM-DD-YYYY", "dddd-DD-MMMM-YYYY"]).format("YYYY-MM-DDT00:00:00");

              if (isValidDate.toLowerCase() == "invalid date" || isValidDate.match("01-01-0") || isValidDate.match("0000-01-01")) {
                errorMessage.push(joiningDateIncorrectFormat);
                IsEmployeeValid = false;
                isValidDate = '01-01-0000T00:00:00'
              }
              item.JoinedDate = isValidDate;
            }

            isShiftValid = _.find(allShifts, function (shift) {
              return shift.shift.toLowerCase().trim().replace(/\s/g, '') == item.Shift.toLowerCase().trim().replace(/\s/g, '')
            });
            if (isShiftValid == undefined) {
              errorMessage.push(shiftTimeNotExists);
            }

            isTimeZoneValid = _.find(allTimeZone, function (timeZone) {
              return timeZone.timeZoneName.toLowerCase().trim().replace(/\s/g, '') == item.TimeZone.toLowerCase().trim().replace(/\s/g, '')
            });
            if (isTimeZoneValid == undefined) {
              errorMessage.push(" The shift name is not exists.");
            }

            var empObj = {
              isEmployeeValid: IsEmployeeValid,
              firstName: item.FirstName.trim(),
              surName: item.SurName.trim(),
              email: item.Email.trim(),
              mobileNo: item.MobileNumber.trim(),
              employeeNumber: item.EmployeeNumber.trim(),
              designationId: isDesignationValid != undefined ? isDesignationValid.designationId : "",
              departmentId: isDepartmentValid != undefined ? isDepartmentValid.departmentId : "",
              employmentStatusId: isEmpStatusValid != undefined ? isEmpStatusValid.employmentStatusId : "",
              jobCategoryId: isJobCategoryValid != undefined ? isJobCategoryValid.jobCategoryId : "",
              shiftTimingId: isShiftValid != undefined ? isShiftValid.shiftTimingId : "",
              branchId: isBranchValid != undefined ? isBranchValid.branchId : "",
              timeZoneId: isTimeZoneValid != undefined ? isTimeZoneValid.timeZoneId : "",
              currencyId: isCurrencyValid != undefined ? isCurrencyValid.currencyId : "",
              dateOfJoining: item.JoinedDate,
              isActive: true,
              payrollTemplateId: payrollTemplateId,
              payrollTemplateName: payrollTemplateName,
              salary: salary,
              isActiveOnMobile: true,
              isUpsertEmployee: true,
              roleIds: isAllRolesValid ? roleIdsList.join(',') : "",
              permittedBranches: isAllEntityValid ? allEntityList : [],
              designationName: item.Designation,
              departmentName: item.Department,
              currencyName: item.Currency.trim(),
              employmentStatusName: item.EmployementType.trim(),
              shift: item.Shift,
              branchName: item.Branch,
              jobCategoryType: item.JobCategory,
              timeZoneName: item.TimeZone,
              entityName: item.Entity,
              roleName: item.Role,
              isUpload: true,
              messages: errorMessage.join(', '),
              RowNumber: item.__rowNum__
            }
            uploadedData.push(empObj);
          }
        });

        fileTemInput.nativeElement.value = "";
        const dialogRef = dialog.open(EmployeeUploadPopupComponent, {
          width: "90%",
          direction: 'ltr',
          data: { uploadedData },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result.success) {

          }
        });


      };
      if (event.target != undefined)
        reader.readAsBinaryString(event.target.files[0]);
    }
  }

  downloadFile() {
    this.EmployeeService.employeeUploadTemplate().subscribe((response: any) => {
      var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      FileSaver.saveAs(blob, "EmployeeUploadTemplate.xlsx");
    },
      function (error) {
        this.toastr.error("Template download failed.");
      });
  }

  navigateToLeaves() {
    this.routes.navigateByUrl("leavemanagement/waitingforapproval");
  }

  getCompanyDetails() {
    var response = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
    if (response != null && response != undefined && response.industryId.toUpperCase() == '7499F5E3-0EF2-4044-B840-2411B68302F9')
      this.isRemoteSoftware = true;
  }
  searchByBranch(event, branch) {

  }

  closeDialog() {
    this.isNewUser = false;
    this.popUpOpen = false;
    this.addEmployeePopover.forEach((p) => p.closePopover());
  }

  addEmployeesForm(addEmployeePopover) {
    this.isNewUser = true;
    this.popUpOpen = true;
    this.addEmployee = new EmployeeListModel();
    this.addEmployee.formSourc = JSON.parse(this.applicationForms[0].formJson);
    addEmployeePopover.openPopover();
  }

  createOrEditForm() {
    const dialogRef = this.dialog.open(this.formCreatorComponentDialog, {
        width: "95vw",
        height: "90vh",
        maxWidth: "95vw",
        disableClose: true,
        id: "form-create-dialog",
        data: { isFromModal: true, formPhysicalId: "form-create-dialog" }
    });
    
    dialogRef.afterClosed().subscribe(() => {
      this.updatedFieldCongiguration = true;
      this.genericForm = new CustomFormFieldModel();
    this.genericForm.moduleTypeId = 79;
    this.genericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.genericFormService.searchCustomFields(this.genericForm).subscribe((result: any) => {
      if(result){
        if(result.data.length>0){
          this.applicationForms = result.data;
          this.customApplicationName = result.data[0].customApplicationName;}else{
            this.applicationForms = [];
          }
      } else{
        this.applicationForms = [];
      }
    });
      this.getEmployeeFields();
    });
  }
  addEmployeeDetails() {
    this.isNewUser = true;
    this.popUpOpen = true;
    this.addEmployee = new EmployeeListModel();
    if(this.applicationForms.length>0){
      this.addEmployeeFormSourc = JSON.parse(this.applicationForms[0].formJson);
    }else{
      this.addEmployeeFormSourc = JSON.parse("{\"components\":[]}");
    }
    let dialogId = "edit-employee";
    const dialogRef = this.dialog.open(this.addEmployeePopup, {
      height: "60%",
      width: "50%",
      id: dialogId,
      disableClose: true,
      data: { employeeEdit: this.addEmployee, employeeFields:this.employeeFields, formPhysicalId: dialogId, formSourc: this.addEmployeeFormSourc }
    });

  }
  getEmployeeFields() {
    let fieldDetails = new EmployeeFieldsModel();
  this.EmployeeService.getEmployeeFields(fieldDetails).subscribe((response: any) => {
    if (response.data) {
      this.employeeFields=response.data;
    } else {

    }
  })
}
exportToExcel(){
  this.downloadExcel = true;
  this.cdRef.detectChanges();
}
exportToCsv(){
  this.downloadCsv = true;
  this.cdRef.detectChanges();
}
downloadExcelComplete(){
  this.downloadExcel = false;
  this.downloadCsv = false;
}
}