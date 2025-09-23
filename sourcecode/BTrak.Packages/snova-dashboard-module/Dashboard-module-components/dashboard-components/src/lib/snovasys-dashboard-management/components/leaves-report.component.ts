import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { Moment } from "moment";
import { OWL_DATE_TIME_FORMATS, OwlDateTimeComponent, OwlDateTimeFormats } from "ng-pick-datetime";
import { ToastrService } from "ngx-toastr";
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { LeaveReportInputModel } from "../models/leave-report.model";
import { LeavesReport } from "../models/leavesReport.model";
import { HrDashboardService } from "../services/hr-dashboard.service";
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as _moment from 'moment';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: "MM/YYYY",
  fullPickerInput: "l LT",
  datePickerInput: "MM/YYYY",
  timePickerInput: "LT",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY"
};

@Component({
  selector: "app-dashboard-component-leavesReport",
  templateUrl: "./leaves-report.component.html",
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
  ]
})

export class LeavesReportComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  searchLeaves: string;
  Year: number;
  branchId: string = null;
  count: number;
  leavesReport: LeavesReport;
  leaveReportData: any;
  anyOperationInProgress: boolean;
  selectEmployeeDropDownListDataDetails: any[];
  employeeId: any;
  employeeDetailType: any;
  employeelist: any;
  leaveReportInput: LeaveReportInputModel;
  validationMessage: string;
  gridData: GridDataResult;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  state: State = {
    skip: 0,
    take: 10
  };
  softLabels: SoftLabelConfigurationModel[];
  pageNumber: number;
  pageSize: number;
  public date = new FormControl(moment());

  constructor(private hrDashboardService: HrDashboardService, private router: Router,
    private cdRef: ChangeDetectorRef, private toaster: ToastrService,
    private productivityService: ProductivityDashboardService) {
    super();
    const date = new Date();
    this.Year = date.getFullYear();
  }

  ngOnInit() {
    super.ngOnInit();
    this.pageNumber = 0;
    this.pageSize = 100;
    this.getSoftLabelConfigurations();
    this.getEntityDropDown();
    this.getLeavesReport();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.leaveReportData, this.state);
  }

  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
}

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: any, datepicker: any) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  getPreviousSelectedDate() {
    this.Year = this.leavesReport.Year - 1;
    this.getLeavesReport();
  }

  getFutureSelectedDate() {
    this.Year = this.leavesReport.Year + 1;
    this.getLeavesReport();
  }

  searchLeaveReports() {
    if (this.searchLeaves && this.searchLeaves.trim().length <= 0) { return; }
    this.searchLeaves = this.searchLeaves.trim();
    this.getLeavesReport();
  }

  closeSearch() {
    this.searchLeaves = null;
    this.getLeavesReport();
  }
  setPage() {
    this.getLeavesReport();
  }

  // onSort(event) {
  //   const sort = event.sorts[0];
  //   this.sortBy = sort.prop;
  //   if (sort.dir === 'asc')
  //     this.sortDirectionAsc = true;
  //   else
  //     this.sortDirectionAsc = false;
  //   this.pageNumber = 0;
  //   this.pageSize = 100;
  //   this.searchLeaves = null;
  //   this.getLeavesReport();
  // }

  getAllEmployees() {
    const leaveReportInput = new LeaveReportInputModel();
    leaveReportInput.employeeId = this.employeeId;
    leaveReportInput.employeeDetailType = this.employeeDetailType;
    this.hrDashboardService.GetAllEmployees(this.leaveReportInput).subscribe((result: any) => {
      this.employeelist = result.data;
      if (result.success === false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.cdRef.detectChanges();
      }
    })
  }

  getLeavesReport() {
    this.leavesReport = new LeavesReport();
    this.leavesReport.Year = this.Year;
    this.leavesReport.branchId = this.branchId;
    this.leavesReport.SearchText = this.searchLeaves;
    this.leavesReport.entityId = this.selectedEntity;
    this.anyOperationInProgress = true;
    this.hrDashboardService.GetLeavesReport(this.leavesReport).subscribe((responseData: any) => {
      this.leaveReportData = responseData.data;
      this.gridData = process(this.leaveReportData, this.state);
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  goToProfile(url) {
    this.router.navigateByUrl("dashboard/profile/" + url);
  }
  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
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
    this.getLeavesReport();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getLeavesReport();
  }
}
