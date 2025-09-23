import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { DailyLogTimeReport } from '../models/dailyLogTimeReportData';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { LineManagersModel } from '../models/line-mangaers-model';
import { SelectBranch } from '../models/select-branch';
import { SelectBranchModel } from '../models/select-branch-model';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-dashboard-component-dailylogtimereport',
  templateUrl: './daily-log-time-report.component.html'
})

export class DailyLogTimeReportComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  lineManager: LineManagersModel[];
  selectBranches: SelectBranchModel[];
  softLabels: SoftLabelConfigurationModel[];
  dailyLogReport: any;
  selectBranch: SelectBranch;
  isOpen: boolean = true;
  branchFilterIsActive: boolean = false;
  dateIsActive: boolean = true;
  lineManagerFilter: boolean = false;
  dailyLogTimeInputReport: DailyLogTimeReport;
  branchId: string = '00000000-0000-0000-0000-000000000000';
  teamLeadId: string = null;
  lineManagerId: string = '00000000-0000-0000-0000-000000000000';
  selectedDateValue: Date = new Date();
  searchText: string;
  regionId: string;
  isArchived: boolean;
  pageLoad: boolean;
  date: any;
  anyOperationInProgress: boolean;
  preDate: any;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  gridData: GridDataResult;
  state: State = {
    skip: 0,
    take: 10
  };
  searchIsActive: boolean = false;
  isEntityFilter : boolean = false;
  selectedLineManagerName : string;
  selectedEntityName : string;
  selectedDateFilter : any;
  isDateFilter : boolean = false;
  constructor(
    private hrdashboardservice: HrDashboardService, private datePipe: DatePipe,
    private toaster: ToastrService, private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService) {
    super();
    this.previDate();
  }

  previDate() {
    const day = this.selectedDateValue.getDate() - 1;
    const month = 0 + (this.selectedDateValue.getMonth() + 1);
    const year = this.selectedDateValue.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.selectedDateValue = this.parse(newDate);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getDailyLogTimeReport();
    this.getLineManagers();
    this.getAllBranches();
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
    this.getEntityDropDown();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.dailyLogReport, this.state);
  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      var newDate = new Date(year, month, date);
      return newDate;
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  selectedDate(selectedDate) {
    this.dateIsActive = true;
    this.selectedDateValue = selectedDate;
    this.isDateFilter = true;
    this.selectedDateFilter = this.datePipe.transform(this.selectedDateValue, 'yyyy-MM-dd');
    this.getDailyLogTimeReport();
  }

  selectedBranchId(selectedBranchId) {
    if (selectedBranchId === "0") {
      this.branchFilterIsActive = false;
      this.branchId = "";
    }
    this.branchFilterIsActive = true;
    this.branchId = selectedBranchId;
    this.getDailyLogTimeReport();
  }

  selectedLineManagerId(selectedLineManagerId) {
    if (selectedLineManagerId === '0') {
      this.lineManagerFilter = false;
      this.lineManagerId = "";
    }
    this.lineManagerFilter = true;
    this.lineManagerId = selectedLineManagerId;
    let lineManagerObj = this.lineManager.filter(x=> x.userId == selectedLineManagerId);
    this.selectedLineManagerName = (lineManagerObj !=undefined && lineManagerObj !=null) ? lineManagerObj[0].userName : "";
    this.getDailyLogTimeReport();
  }

  selectedPageLoad(selectedPageLoad) {
    this.teamLeadId = selectedPageLoad;
    this.getDailyLogTimeReport();
  }

  getDailyLogTimeReport() {
    this.anyOperationInProgress = true;
    this.dailyLogTimeInputReport = new DailyLogTimeReport();
    this.date = this.datePipe.transform(this.selectedDateValue, 'yyyy-MM-dd');
    this.dailyLogTimeInputReport.searchText = this.searchText;
    this.dailyLogTimeInputReport.selectedDate = this.date;
    this.dailyLogTimeInputReport.branchId = this.branchId;
    this.dailyLogTimeInputReport.lineManagerId = this.lineManagerId;
    this.dailyLogTimeInputReport.pageLoad = this.pageLoad;
    this.dailyLogTimeInputReport.entityId = this.selectedEntity;
    this.hrdashboardservice.getDailyLogTimeReport(this.dailyLogTimeInputReport).subscribe((result: any) => {
      this.dailyLogReport = result.data;
      this.gridData = process(this.dailyLogReport, this.state);
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.lineManagerId = null;
    this.branchId = null;
    this.dateIsActive = true;
    this.branchFilterIsActive = false;
    this.searchText = '';
    this.lineManagerFilter = false;
    const presentDate = new Date();
    const day = presentDate.getDate() - 1;
    const month = 0 + (presentDate.getMonth() + 1);
    const year = presentDate.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.selectedDateValue = this.parse(newDate);
    this.isDateFilter=false;
    this.getDailyLogTimeReport();
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

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  selectedsearchText(selectedsearchText) {
    this.searchText = selectedsearchText;
    this.getAllBranches();
  }

  selectedregionId(selectedregionId) {
    this.regionId = selectedregionId;
    this.getAllBranches();
  }

  selectedisArchived(selectedisArchived) {
    this.isArchived = selectedisArchived;
    this.getAllBranches();
  }

  getAllBranches() {
    this.selectBranch = new SelectBranch();
    this.selectBranch.branchId = this.branchId;
    this.selectBranch.searchText = this.searchText;
    this.selectBranch.regionId = this.regionId;
    this.selectBranch.isArchived = this.isArchived;
    this.hrdashboardservice.getAllBranches(this.selectBranch).subscribe((result: any) => {
      this.selectBranches = result.data;
    })
  }

  searchRecords() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    {
      this.searchIsActive = false;
      this.searchText = this.searchText.trim();
    }
    this.searchIsActive = true;
    this.getDailyLogTimeReport()
  }

  closeSearch() {
    this.searchText = '';
    this.getDailyLogTimeReport();

  }

  closeEntityFilter() {
    this.selectedEntity = "";
    this.isEntityFilter = false;
    this.getDailyLogTimeReport();
  }

  closeLineManagerFilter() {
    this.lineManagerFilter = false;
    this.lineManagerId = "";
    this.getDailyLogTimeReport();
  }

  closeDateFilter() {
    this.selectedDateValue = this.parse(new Date());
    this.isDateFilter=false;
    this.getDailyLogTimeReport();
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
    this.isEntityFilter = true ;
    this.selectedEntity = name;
    let entityObj = this.entities.filter(x=> x.id == name);
    this.selectedEntityName = (entityObj !=undefined && entityObj !=null) ? entityObj[0].name : "";
    this.getDailyLogTimeReport();
  }

}
