import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { HrDashboardModel } from '../models/hrDashboardModel';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as commonModuleReducers from "../store/reducers/index";
import * as roleState from "../store/reducers/authentication.reducers";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-dashboard-component-morningAndAfternoonLateEmployee',
  templateUrl: `morning-and-afternoon-late-employee.component.html`
})

export class MorningAndAfternoonLateEmployeeComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  date: Date = new Date();
  selectedDate: string = this.date.toISOString();
  selectedYear: number;
  selectedMonth: number;
  selecteddate: string;
  monthFilterActive: boolean = true;
  monthweekfilteractive: boolean = true;
  selectedValue: string = ConstantVariables.Month;
  type: string = ConstantVariables.Month;
  isPermissionForLateEmployee: Boolean;
  weekNumber: number;
  direction: any;
  morningAndAfternoonLateEmployeeData: any;
  anyOperationInProgress: boolean;
  finalDate: any;
  gridData: GridDataResult;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  selectBranchFilterIsActive: boolean = false;
  validationMessage: string;
  state: State = {
    skip: 0,
    take: 10
  };
  fromDateIsActive: boolean;
  isOpen: boolean = true;
  filters: any[] = [
    { value: 'Week', id: 0, key: 'WEEK' },
    { value: 'Month', id: 1, key: 'MONTH' },
  ]
  roleFeaturesIsInProgress$: Observable<boolean>;
  
  constructor(private hrDashboardService: HrDashboardService,
    private datePipe: DatePipe, private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService,
    private store: Store<roleState.State>) {
    super();
    this.getMorningAndAfterNoonLateDetails();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.isPermissionForLateEmployee = this.canAccess_feature_LateEmployee;
    if (this.isPermissionForLateEmployee) {
      this.getEntityDropDown();
      this.getMorningAndAfterNoonLateDetails();
    }
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.morningAndAfternoonLateEmployeeData, this.state);
  }

  getMorningAndAfterNoonLateDetails() {
    this.anyOperationInProgress = true;
    var hrDashboardModel = new HrDashboardModel;
    this.finalDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.selectedDate = this.finalDate;
    hrDashboardModel.type = this.type;
    hrDashboardModel.Date = this.selectedDate;
    hrDashboardModel.entityId = this.selectedEntity;
    hrDashboardModel.IsMorningAndAfterNoonLate = true;
    if (this.selectedDate && this.type) {
      this.hrDashboardService.getLateEmployeeDetails(hrDashboardModel).subscribe((responseData: any) => {
        this.morningAndAfternoonLateEmployeeData = responseData.data;
        this.gridData = process(this.morningAndAfternoonLateEmployeeData, this.state);
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      });
    }
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.date = new Date();
    this.type = ConstantVariables.Month;
    this.selectedValue = ConstantVariables.Month;
    this.monthFilterActive = true;
    this.monthweekfilteractive = true;
    this.selectedEntity = "";
    this.getDateAndMonthFilter(this.type);
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

  changeLateEmployeeFilterType() {
    this.type = this.selectedValue;
    this.getDateAndMonthFilter(this.type);
  }

  getDateAndMonthFilter(type) {
    this.monthweekfilteractive = true;
    this.type = type; if (this.type === 'Week') {
      const monthStartDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
      this.date = monthStartDay;
      this.weekNumber = this.getWeekNumber(this.date);
    } else {
      this.type = type;
      this.weekNumber = null;
    }
    this.selectedDate = moment(this.date).format("YYYY-MM-DD HH:mm Z");
    this.getMorningAndAfterNoonLateDetails();
  }

  getWeekNumber(selectedDate) {
    const currentDate = selectedDate.getDate();
    const monthStartDay = (new Date(this.date.getFullYear(), this.date.getMonth(), 1)).getDay();
    const weekNumber = (selectedDate.getDate() + monthStartDay) / 7;
    const week = (selectedDate.getDate() + monthStartDay) % 7;
    if (week !== 0) {
      return Math.ceil(weekNumber);
    } else {
      return weekNumber;
    }
  }

  getMorningLateEmployeeBasedOnDate(direction) {
    this.direction = direction;
    if (this.type === 'Month') {
      if (direction === 'left') {
        const day = this.date.getDate();
        const month = 0 + (this.date.getMonth() + 1) - 1;
        const year = this.date.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.date = this.parse(newDate);
      } else {
        const day = this.date.getDate();
        const month = (this.date.getMonth() + 1) + 1;
        const year = 0 + this.date.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.date = this.parse(newDate);
      }
    }
    else {
      if (direction === 'left') {
        const day = this.date.getDate() - 7;
        const month = 0 + (this.date.getMonth() + 1);
        const year = this.date.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.date = this.parse(newDate);
        this.weekNumber = this.getWeekNumber(this.date);
      } else {
        const day = this.date.getDate() + 7;
        const month = 0 + (this.date.getMonth() + 1);
        const year = this.date.getFullYear();
        const newDate = day + '/' + month + '/' + year;
        this.date = this.parse(newDate);
        this.weekNumber = this.getWeekNumber(this.date);
      }
    }
    this.selectedDate = moment(this.date).format("YYYY-MM-DD HH:mm Z");
    this.getMorningAndAfterNoonLateDetails();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
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
    this.selectBranchFilterIsActive = true;
    this.selectedEntity = name;
    this.getDateAndMonthFilter(this.type);
  }
}