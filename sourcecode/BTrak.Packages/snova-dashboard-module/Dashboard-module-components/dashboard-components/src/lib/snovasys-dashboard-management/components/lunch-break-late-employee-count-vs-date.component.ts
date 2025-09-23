import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LateEmployeeCountDate } from '../models/late-employee-count- vs-date';
import { SelectBranchModel } from '../models/select-branch-model';
import { LineManagersModel } from '../models/line-mangaers-model';
import { SelectBranch } from '../models/select-branch';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { LateEmployeeCountOutputModel } from '../models/late-employee-count-output.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { DepartmentModel } from '../models/department.model';
import { DesignationModel } from '../models/designation.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-lunchbreaklatecountvsdate',
  templateUrl: 'lunch-break-late-employee-count-vs-date.component.html'
})

export class LunchBreakLateEmployeeCountVsDateComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  [x: string]: any;
  selectBranches: SelectBranchModel[];
  lineManager: LineManagersModel[];
  departments: any;
  designations: any;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  dateFrom: string;
  dateTo: string;
  isOpen: boolean = true;
  isPermissionForComponent: Boolean;
  selectBranchFilterIsActive: boolean = false;
  selectDepartmentFilterIsActive: boolean = false;
  selectDesignationFilterIsActive: boolean = false;
  selectLineManagerfilter: boolean = false;
  toDateFilter: boolean = true;
  fromDateIsActive: boolean = true;
  teamLeadId: string;
  branchId: string;
  designationId: string;
  lateEmployeeOutputModel: any;
  lateEmployeeVsDate: any;
  modifiedLateEmployeeVsDateTimeOutput: any[];
  lunchBreakLateEmployeeVsDate: LateEmployeeCountOutputModel[];
  selectBranch: any;
  searchText: any;
  regionId: any;
  isArchived: any;
  validationMessage: string;
  minDate = new Date(1753, 0, 1);
  minstartdate = new Date();
  selectedEntity: string;
  entities: EntityDropDownModel[];
  softLabels: SoftLabelConfigurationModel[];
  
  constructor(
    private datePipe: DatePipe, private hrdashboardservice: HrDashboardService,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService) {
    super();
    this.getSoftLabels();
    this.teamLeadId = null;
    this.branchId = null;
    this.sixMonthsBack();
    this.getdepartment();
    this.getAllDesignations();
    this.getAllBranches();
    this.getLineManagers();
    this.getEntityDropDown();
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

  }

  ngOnInit() {
    super.ngOnInit();
    if (this.canAccess_feature_LateEmployeesCountVsDate == true) {
      this.getLateEmployeeCount();
    }
    this.getSoftLabels();
    this.teamLeadId = null;
    this.branchId = null;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.teamLeadId = null;
    this.selectBranchFilterIsActive = false;
    this.selectLineManagerfilter = false;
    this.toDateFilter = true
    this.fromDateIsActive = true;
    this.branchId = null;
    this.designationId = null;
    this.departmentId = null;
    this.fromDate = new Date();
    this.toDate = new Date();
    this.sixMonthsBack();
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = null
    employeeOutputModel.branchId = null
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }

  sixMonthsBack() {
    const day = this.fromDate.getDate();
    const month = 0 + (this.fromDate.getMonth() - 5);
    const year = this.fromDate.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
  }

  parse(value: any): Date | null {
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

  selectedLineManagerId(selectedLineManagerId) {
    if (selectedLineManagerId === "0") {
      this.selectLineManagerfilter = false;
      this.teamLeadId = "";
    }
    this.selectLineManagerfilter = true;
    this.teamLeadId = selectedLineManagerId;
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = selectedLineManagerId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.designationId = this.designationId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }
  entityValues(name) {

    this.selectBranchFilterIsActive = true;
    this.selectedEntity = name;
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.branchId = this.selectedEntity;
    employeeOutputModel.designationId = this.designationId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }

  selectedDepartmentId(departmentId) {
    if (departmentId === "0") {
      this.selectDepartmentFilterIsActive = false;
      this.departmentId = "";
    }
    this.selectDepartmentFilterIsActive = true;
    this.departmentId = departmentId;
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.designationId = this.designationId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }

  selectedDesignationId(designationId) {
    if (designationId === "0") {
      this.selectDesignationFilterIsActive = false;
      this.designationId = "";
    }
    this.selectDesignationFilterIsActive = true;
    this.designationId = designationId;
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.designationId = designationId;
    employeeOutputModel.departmentId = this.departmentId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }

  getLateEmployeeCount() {
    this.lunchBreakLateEmployeeOutputModel = new LateEmployeeCountDate();
    this.lunchBreakLateEmployeeOutputModel.dateFrom = this.dateFrom;
    this.lunchBreakLateEmployeeOutputModel.dateTo = this.dateTo;
    this.lunchBreakLateEmployeeOutputModel.teamLeadId = this.teamLeadId;
    this.lunchBreakLateEmployeeOutputModel.branchId = this.branchId;
    this.lunchBreakLateEmployeeOutputModel.designationId = this.designationId;
    this.lunchBreakLateEmployeeOutputModel.departmentId = this.departmentId;
    this.lunchBreakLateEmployeeOutputModel.entityId = this.selectedEntity;
    this.hrdashboardservice.GetLateEmployeeCount(this.lunchBreakLateEmployeeOutputModel).subscribe((result: any) => {
      
      if (result.success == true) {
        this.lunchBreakLateEmployeeVsDate = result.data;
        let modifiedLunchBreakLateEmployeeVsDateTimeOutput: any[] = [["date", "Lunch break late employee count"]];
        if (this.lunchBreakLateEmployeeVsDate.length != 0) {
          this.lunchBreakLateEmployeeVsDate.forEach(item => {
            let temp: any[] = [];
            temp.push(this.datePipe.transform(item.date, "dd-MMM-yyyy"));
            temp.push(item.lunchbreakLateCount);
            modifiedLunchBreakLateEmployeeVsDateTimeOutput.push(temp);
          });
        }
        this.modifiedLunchBreakLateEmployeeVsDateTimeOutput = modifiedLunchBreakLateEmployeeVsDateTimeOutput;
        this.changeData();
      } else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    });
  }

  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [["date", "Lunch break late employee count"]
      , ['0', 0]],
    options: {
      chartArea:{top:30,width:"90%"},
      height: 350,
      legend: 'none',
      hAxis: {
        direction: -1,
        slantedText: true,
        slantedTextAngle: 90,
        textStyle: {
          fontSize: 11
        }
      },
      vAxis: {
        gridlines: { count: 10 },
      },
    }
  }

  public error() {
  }

  changeData(): void {
    if(this.modifiedLunchBreakLateEmployeeVsDateTimeOutput !=undefined) {
      if (this.modifiedLunchBreakLateEmployeeVsDateTimeOutput.length <= 1) {
        this.columnChart.dataTable = [
          ["date", "Lunch break late employee count"],
          ['0', 0]];
          this.columnChart.component !=undefined ? this.columnChart.component.draw() : null;
      }
      else {
        this.columnChart.dataTable = this.modifiedLunchBreakLateEmployeeVsDateTimeOutput;
        this.columnChart.component.draw();
      }
    }
  }

  public changeChartType(): void {
    // forces a reference update (otherwise angular doesn't detect the change)
    this.columnChart = Object.create(this.columnChart);
    if (this.columnChart.chartType === 'ColumnChart') {
      this.columnChart.chartType = 'PieChart';
    } else {
      this.columnChart.chartType = 'ColumnChart';
    }
    this.columnChart.component.draw();
  }

  public ready() {
  }

  ngOnChanges() {
    this.changeData();
  }

  getAllBranches() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getAllBranches(this.selectBranch).subscribe((result: any) => {
      if (result.success == true) {
        this.selectBranches = result.data;
      }
    })
  }

  getLineManagers() {
    let searchText = '';
    this.hrdashboardservice.getLineManagers(searchText).subscribe((result: any) => {
      if (result.success == true) {
        this.lineManager = result.data;
      }
    })
  }


  getdepartment() {
    this.isAnyOperationIsInprogress = true;
    var departmentModel = new DepartmentModel();
    departmentModel.isArchived = false;
    this.hrdashboardservice.getdepartment(this.selectBranch).subscribe((response: any) => {
      if (response.success == true) {
        this.departments = response.data;
      }
    });
  }
  getAllDesignations() {
    this.isAnyOperationIsInprogress = true;
    var designationModel = new DesignationModel();
    designationModel.isArchived = false;
    this.hrdashboardservice.getAlldesignations(this.selectBranch).subscribe((response: any) => {
      if (response.success == true) {
        this.designations = response.data;
      }
    });
  }

  onDateFromChange(event: MatDatepickerInputEvent<Date>) {
    this.fromDateIsActive = true;
    this.fromDate = event.target.value;
    if (this.fromDate > this.toDate) {
      this.toDate = this.fromDate;
    }
    this.minstartdate = this.fromDate;
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>) {
    this.toDateFilter = true
    this.toDate = event.target.value;
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    let employeeOutputModel = new LateEmployeeCountDate();
    employeeOutputModel.teamLeadId = this.teamLeadId;
    employeeOutputModel.branchId = this.branchId;
    employeeOutputModel.dateFrom = this.dateFrom;
    employeeOutputModel.dateTo = this.dateTo;
    this.getLateEmployeeCount();
  }
  filterClick() {
    this.isOpen = !this.isOpen;
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
   // this.cdRef.markForCheck();
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === true) {
        this.entities = responseData.data;
      }
    });
  }

}
