import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { EmployeeListInput } from '../models/employee-List';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
const $ = $_;

@Component({
  selector: 'app-dashboard-component-employeeSpentTime',
  templateUrl: 'employee-spent-time.component.html'
})

export class EmployeeSpentTimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      if (this.userId !== data.userId) {
        this.userId = data.userId;
        this.getEmployeeSpentTime();
      }
    }
  }

  selectedProjectId: string = null;
  selectedGoalId: string = null;
  dashboardFilters: DashboardFilterModel;
  userId: string = null;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  dateFrom: string;
  dateTo: string;
  employeeFilterIsActive: boolean = false;
  isOpen: boolean = true;
  UserName: string = null;
  fromDateIsActive: boolean = true;
  toDateFilterActive: boolean = true;
  RoleId: string = null;
  anyOperationInProgress: boolean;
  IsUsersPage: boolean;
  employeeList: any;
  employeeSpentTime: any;
  employeeSpentTimeOutputModel: any;
  minDate = new Date(1753, 0, 1);
  minstartdate = new Date();
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[] = [];
  columnChart: GoogleChartInterface = {
    chartType: 'LineChart',
    dataTable: [["date", "spent time"],
    ['', 0]],
    options: {
      height: 800,
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
  modifiedEmployeeSpentTimeOutput: any[] = [];
  date: any;
  sortDirectionAsc: boolean;
  softLabels: SoftLabelConfigurationModel[];

  constructor(
    private hrDashboardService: HrDashboardService, private datePipe: DatePipe,
    private toaster: ToastrService, private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService) {
    super();
    this.getAllEmployees();
    this.twoMonthsBack();
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getSoftLabels();
    this.getEntityDropDown();
    this.getEmployeeSpentTime();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  twoMonthsBack() {
    const day = this.fromDate.getDate();
    const month = 0 + (this.fromDate.getMonth() - 1);
    const year = this.fromDate.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
  }

  resetAllFilters() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.userId = null;
    this.fromDateIsActive = true;
    this.employeeFilterIsActive = false;
    this.toDateFilterActive = true;
    this.selectedEntity = "";
    this.twoMonthsBack();
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    this.getEmployeeSpentTime();
  }

  selectedUser(selectedUserId) {
    if (selectedUserId === "0") {
      this.employeeFilterIsActive = false;
      this.userId = "";
    }
    this.employeeFilterIsActive = true;
    this.userId = selectedUserId;
    this.getEmployeeSpentTime();
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

  changeData(): void {
    if (this.modifiedEmployeeSpentTimeOutput.length <= 1) {
      this.columnChart.dataTable = [
        ["date", "spent time"],
        ['', 0]];
        this.columnChart.component !=undefined ? this.columnChart.component.draw() : null ;
    }
    else {
      this.columnChart.dataTable = this.modifiedEmployeeSpentTimeOutput;
      this.columnChart.component.draw();
    }
    this.anyOperationInProgress = false;
    this.cdRef.detectChanges();
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  getEmployeeSpentTime() {
    this.anyOperationInProgress = true;
    this.hrDashboardService.GetEmployeeSpentTime(this.userId, this.dateFrom, this.dateTo, this.selectedEntity).subscribe((Response: any) => {
      if (Response.success == true) {
        this.anyOperationInProgress = false;
        this.employeeSpentTime = Response.data;
        this.cdRef.detectChanges();
        let modifiedEmployeeSpentTimeOutput: any[] = [['date', 'Total time spent']];
        this.employeeSpentTime.forEach(item => {
          let temp: any[] = [];
          temp.push(this.datePipe.transform(item.date, "dd-MMM-yyyy"));
          if (item.totalTimeSpent === null)
            item.totalTimeSpent = 0;
          temp.push(item.totalTimeSpent);
          modifiedEmployeeSpentTimeOutput.push(temp);
        });
        this.modifiedEmployeeSpentTimeOutput = modifiedEmployeeSpentTimeOutput;
        this.changeData();
      } else {
        this.validationMessage = Response.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    });
  }

  getAllEmployees() {
    let employeeSpentTime = new EmployeeListInput();
    employeeSpentTime.UserId = this.userId;
    employeeSpentTime.UserName = this.UserName;
    employeeSpentTime.RoleId = this.RoleId;
    employeeSpentTime.IsUsersPage = this.IsUsersPage;
    employeeSpentTime.sortDirectionAsc = true;
    this.hrDashboardService.GetAllUsers(employeeSpentTime).subscribe((result: any) => {
      this.employeeList = result.data;
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  public error(event: ChartErrorEvent) {
  }

  public ready(event: ChartReadyEvent) {
  }

  ngOnChanges() {
    this.changeData();
  }

  onDateFromChange(event: MatDatepickerInputEvent<Date>) {
    this.fromDateIsActive = true;
    this.fromDate = event.target.value;
    if (this.fromDate > this.toDate) {
      this.toDate = this.fromDate;
    }
    this.minstartdate = this.fromDate;
    this.dateFrom = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.getEmployeeSpentTime();
  }

  onDateToChange(event: MatDatepickerInputEvent<Date>) {
    this.toDateFilterActive = true;
    this.toDate = event.target.value;
    this.dateTo = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    this.getEmployeeSpentTime();
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
    this.getEmployeeSpentTime();
  }

  fitContent(optionalParameters : any) {
    if(optionalParameters['gridsterView']) {
      $(optionalParameters['popupViewSelector'] + ' .gridster-noset #style-1').removeClass('app-height-4');
      $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset #style-1').height($(optionalParameters['gridsterViewSelector']).height());
    } else if (optionalParameters['popupView']) {
      $(optionalParameters['popupViewSelector'] + ' .gridster-noset #style-1').removeClass('app-height-4');
      $(optionalParameters['popupViewSelector'] + ' .gridster-noset #style-1').height($(optionalParameters['popupViewSelector']).height() - 150);
    } else if (optionalParameters['individualPageView']) {
      $(optionalParameters['individualPageSelector'] + ' .gridster-noset #style-1').removeClass('app-height-4');
      $(optionalParameters['individualPageSelector'] + ' .gridster-noset #style-1').height($(window).height() - 90);
    }
  }

}
