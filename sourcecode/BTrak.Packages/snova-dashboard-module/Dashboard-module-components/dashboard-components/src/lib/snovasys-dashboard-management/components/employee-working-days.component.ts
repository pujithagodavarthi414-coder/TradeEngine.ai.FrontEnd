import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { EmployeeWorkingDays } from '../models/employee-working-days';
import { SelectBranchModel } from '../models/select-branch-model';
import { TeamMembersListModel } from '../models/line-mangaers-model';
import { SelectBranch } from '../models/select-branch';
import { Router } from '@angular/router';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { EmployeeWorkingDaysOutputModel } from '../models/employee-working-days-output.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-dashboard-component-employeeWorkingDays',
  templateUrl: 'employee-working-days.component.html'
})

export class EmployeeWorkingDaysComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;

  @Output() teamLeadData = new EventEmitter<any>();

  date: Date = new Date();
  searchText: string = '';
  count: number;
  selectedYear: number;
  selectedMonth: number;
  monthFilterActive: boolean = true;
  serchIsActive: boolean = false;
  selecteddate: string;
  isOpen: boolean = true;
  branchIsActive: boolean = false;
  anyOperationInProgress: boolean;
  employeeWorkingDaysData: any;
  employeeWorkingDays: EmployeeWorkingDays;
  employeeWorkingDaysOutputModel: EmployeeWorkingDaysOutputModel[];
  selectBranches: SelectBranchModel[];
  selectDepartments: SelectBranchModel[];
  selectDesignations: SelectBranchModel[];
  lineManager: TeamMembersListModel[];
  validationMessage: string;
  selectBranchFilterIsActive: boolean = false;
  selectDepartmentFilterIsActive: boolean = false;
  selectDesignationFilterIsActive: boolean = false;
  selectTeamleadFilterIsActive: boolean = false;
  selectLineManagerfilter: boolean = false;
  branchId: string;
  departmentId: string;
  selectBranch: any;
  regionId: any;
  isArchived: any;
  designationId: string;
  lineManagerFilter: boolean = false;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  teamLeadId: string = '00000000-0000-0000-0000-000000000000';
  gridData: GridDataResult;
  state: State = {
    skip: 0,
    take: 10
  };
  softLabels: SoftLabelConfigurationModel[];

  constructor(private hrdashboardservice: HrDashboardService,
    private datePipe: DatePipe,
    private router: Router, private toaster: ToastrService,
    private productivityDashboardService: ProductivityDashboardService,
    private cdRef: ChangeDetectorRef) {
    super();
    this.branchId = null;
    this.teamLeadId = null;
    this.designationId = null;
    this.departmentId = null;
    this.getAllBranches();
    this.getdepartment();
    this.getAllDesignations();
    this.getLineManagers();

    this.teamLeadData.emit(null);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getEntityDropDown();
    if(this.canAccess_feature_EmployeeWorkingDays) {
      this.getEmployeeWorkingDays(); 
    }
    this.getSoftLabels();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.employeeWorkingDaysData, this.state);
  }


  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    this.cdRef.markForCheck();
  }

  resetAllFilters() {
    this.date = new Date();
    this.monthFilterActive = true;
    this.serchIsActive = false;
    this.searchText = null;
    this.date = new Date();
    this.monthFilterActive = true;
    this.selectBranchFilterIsActive = false;
    this.selectDepartmentFilterIsActive = false;
    this.selectLineManagerfilter = false;
    this.selectDesignationFilterIsActive = false;
    this.selectTeamleadFilterIsActive = false;
    this.teamLeadId = null;
    this.searchText = '';
    this.teamLeadId = null;
    this.branchId = null;
    this.designationId = null;
    this.departmentId = null;
    this.selectedEntity = "";
    this.getEmployeeWorkingDays();
  }

  selectedDate(selectedDate) {
    this.date = selectedDate
    this.getEmployeeWorkingDays();
  }

  searchRecords() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    {
      this.serchIsActive = false;
      this.searchText = this.searchText.trim();
    }
    this.serchIsActive = true;
    this.getEmployeeWorkingDays()
  }
  closeSearch() {
    this.searchText = '';
    this.branchIsActive = false;
    this.getEmployeeWorkingDays()
  }
  setPage() {
    this.getEmployeeWorkingDays();
  }

  // onSort(event) {
  //   const sort = event.sorts[0];
  //   this.sortBy = sort.prop;
  //   if (sort.dir === 'asc')
  //     this.sortDirectionAsc = true;
  //   else
  //     this.sortDirectionAsc = false;
  //   this.pageNumber = 0;
  //   this.pageSize = 200;
  //   this.searchText = null;
  //   this.getEmployeeWorkingDays();
  // }

  getEmployeeWorkingDays() {
    this.anyOperationInProgress = true;
    this.employeeWorkingDays = new EmployeeWorkingDays();
    this.employeeWorkingDays.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');;
    this.employeeWorkingDays.searchText = this.searchText;
    this.employeeWorkingDays.branchId = this.branchId;
    this.employeeWorkingDays.departmentId = this.departmentId;
    this.employeeWorkingDays.designationId = this.designationId;
    this.employeeWorkingDays.teamLeadId = this.teamLeadId;
    this.employeeWorkingDays.entityId = this.selectedEntity;
    this.hrdashboardservice.GetEmployeeWorkingDays(this.employeeWorkingDays).subscribe((responseData: any) => {
      this.employeeWorkingDaysData = responseData.data;
      this.gridData = process(this.employeeWorkingDaysData, this.state);
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });

  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }
  getPreviousSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth());
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.searchText = null;
    this.getEmployeeWorkingDays();
  }

  getCurrentSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth() + 2);
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.searchText = null;
    this.getEmployeeWorkingDays();
  }

  convertStringToDateFormat(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  selectedBranchId(selectedBranchId) {
    if (selectedBranchId === "0") {
      this.selectBranchFilterIsActive = false;
      this.branchId = "";
    }
    this.selectBranchFilterIsActive = true;
    this.branchId = selectedBranchId;
    let employeeOutputModel = new EmployeeWorkingDays();
    employeeOutputModel.branchId = selectedBranchId;
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.designationId = this.designationId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.date = this.date;
    this.teamLeadData.emit(employeeOutputModel);
    this.getEmployeeWorkingDays();
  }

  selectedDepartmentId(selectedDepartmentId) {
    if (selectedDepartmentId === "0") {
      this.selectDepartmentFilterIsActive = false;
      this.departmentId = "";
    }
    this.selectDepartmentFilterIsActive = true;
    this.departmentId = selectedDepartmentId;
    let employeeOutputModel = new EmployeeWorkingDays();
    employeeOutputModel.departmentId = selectedDepartmentId;
    employeeOutputModel.date = this.date;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.designationId = this.designationId;
    employeeOutputModel.teamLeadId = this.teamLeadId;
    this.teamLeadData.emit(employeeOutputModel);
    this.getEmployeeWorkingDays();
  }

  selectedLineManagerId(selectedLineManagerId) {
    if (selectedLineManagerId === '0') {
      this.lineManagerFilter = false;
      this.teamLeadId = "";
    }
    this.lineManagerFilter = true;
    this.teamLeadId = selectedLineManagerId;
    this.getEmployeeWorkingDays();
  }

  selectedDesignationId(selectedDesignationId) {
    if (selectedDesignationId === "0") {
      this.selectDesignationFilterIsActive = false;
      this.designationId = "";
    }
    this.selectDesignationFilterIsActive = true;
    this.designationId = selectedDesignationId;
    let employeeOutputModel = new EmployeeWorkingDays();
    employeeOutputModel.designationId = selectedDesignationId;
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.date = this.date;
    this.teamLeadData.emit(employeeOutputModel);
    this.getEmployeeWorkingDays();
  }

  getAllBranches() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.departmentId = this.departmentId;
    this.selectBranch.designationId = this.designationId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getAllBranches(this.selectBranch).subscribe((result: any) => {
      this.selectBranches = result.data;
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getAllDesignations() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.departmentId = this.departmentId;
    this.selectBranch.designationId = this.designationId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getAlldesignations(this.selectBranch).subscribe((result: any) => {
      this.selectDesignations = result.data;
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getdepartment() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.departmentId = this.departmentId;
    this.selectBranch.designationId = this.designationId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getdepartment(this.selectBranch).subscribe((result: any) => {
      this.selectDepartments = result.data;
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getLineManagers() {
    let searchText = '';
    this.hrdashboardservice.getLineManagers(searchText).subscribe((result: any) => {
      this.lineManager = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityDashboardService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getEmployeeWorkingDays();
  }
}
