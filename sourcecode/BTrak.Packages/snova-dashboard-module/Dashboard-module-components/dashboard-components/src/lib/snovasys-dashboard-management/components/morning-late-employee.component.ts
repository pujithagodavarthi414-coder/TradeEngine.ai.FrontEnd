import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { HrDashboardModel } from '../models/hrDashboardModel';
import { HrDashboardService } from '../services/hr-dashboard.service';
import * as commonModuleReducers from "../store/reducers/index";
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as roleState from "../store/reducers/authentication.reducers";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-dashboard-component-morningLateEmployee',
  template: `
  <!-- Morning Late Employees-->
  <div class="full-height" *ngIf="(canAccess_feature_LateEmployee)">
  <mat-card class="p-0 m-0">
    <mat-card-title class="full-width data-table-header drag-handler">
      <div fxLayout="row wrap" fxLayoutGap="0" fxLayoutAlign="end center">
      <div fxFlex class="card-title-text data-table-header p-05">{{'HRDASHBOARD.MORNINGLATEEMPLOYEE' | translate | softLabelsPipe : softLabels | titlecase}}</div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" class="ml-02">
          <button mat-icon-button matTooltip="{{'RESET' | translate}}" (click)="resetAllFilters()">
            <fa-icon class="filter mat-color-accent" icon="undo"></fa-icon>
          </button>
        </div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center">
          <button type="submit" mat-icon-button class="pull-right" (click)="filterClick()"  [matMenuTriggerFor]="filterMenu"
            matTooltip=" {{'HRMANAGAMENT.ADVANCESEARCH' | translate}}">
            <fa-icon icon="filter" class="filter mat-color-accent">
            </fa-icon>
          </button>
        </div>
        <mat-menu #filterMenu="matMenu"  class="filter-panel" (click)="$event.stopPropagation()" >
          <button mat-menu-item [ngClass]="{ 'active': selectBranchFilterIsActive }" [matMenuTriggerFor]="branchSearch" *ngIf = "entities?.length > 1">
          {{'LOGTIMEREPORT.ENTITY' | translate}}</button> 
          <button mat-menu-item [ngClass]="{ 'active': monthFilterActive }" [matMenuTriggerFor]="dateSearch">
            {{'LOGTIMEREPORT.DATE' | translate}}</button>
          <button mat-menu-item [ngClass]="{ 'active': fromDateIsActive }"
            [matMenuTriggerFor]="fromDateSearch">{{'MYPROFILE.FROMDATE' | translate}}</button>
        </mat-menu>
        <mat-menu #branchSearch="matMenu">
          <mat-card class="filter-data" (click)="$event.stopPropagation()">
            <mat-form-field>
              <mat-select placeholder="{{ 'WIDGETS.SELECTBRANCH' | translate }}"  [(ngModel)]="selectedEntity" (selectionChange)="entityValues($event.value)">
                <mat-option *ngFor="let entity of entities" [value]="entity.id">
                  {{entity.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card>
        </mat-menu>
        <mat-menu #dateSearch="matMenu">
          <mat-card class="filter-data" (click)="$event.stopPropagation()">
            <fa-icon (click)="getMorningLateEmployeeBasedOnDate('left')" style="cursor:pointer" icon="chevron-left"></fa-icon>
            <b>&nbsp;{{selectedDate | date: "MMM-yyyy"}}&nbsp;</b><span
              *ngIf="weekNumber"><b>W{{weekNumber}}&nbsp;</b></span>
            <fa-icon (click)="getMorningLateEmployeeBasedOnDate('right')" style="cursor:pointer" icon="chevron-right"></fa-icon>
          </mat-card>
        </mat-menu>
        <mat-menu #fromDateSearch="matMenu">
          <mat-card class="filter-data" (click)="$event.stopPropagation()">
            <mat-form-field class="full-width">
              <mat-label>{{'HRDASHBOARD.SELECTMONTH/WEEK' | translate}}</mat-label>
              <mat-select [(ngModel)]="selectedValue" (ngModelChange)="changeLateEmployeeFilterType()">
                <mat-option *ngFor="let filter of filters" [value]="filter.value">
                  {{filter.key | translate}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card>
        </mat-menu>
      </div>
    </mat-card-title>
  </mat-card>   
  <div class="activity-data ">
  <mat-card-content class="p-0 m-0">
      <div class="activity-data">
                <kendo-grid
                [data]="gridData"
                [scrollable]="true"
                [pageSize]="state.take"
                [skip]="state.skip"
                [sort]="state.sort"
                [filter]="state.filter"
                [sortable]="true"
                [pageable]="true"
                (dataStateChange)="dataStateChange($event)">
                  <kendo-grid-column width="150" field="fullName" title="{{'EMPLOYEEWORKINGDAYS.EMPLOYEENAME' | translate | softLabelsPipe : softLabels}}">
                  <ng-template kendoGridCellTemplate let-dataItem>
                    <app-avatar class="employee_img" *ngIf="!dataItem.profileImage"
                      [name]="dataItem.fullName | removeSpecialCharacters" [isRound]="true" size="30">
                    </app-avatar>
                    <img class="employee_img" *ngIf="dataItem.profileImage"
                      [src]="dataItem.profileImage | fetchSizedAndCachedImage: '40':''">
                    <span class="vertical-align"> {{ dataItem?.fullName }}</span>
                </ng-template>
                  </kendo-grid-column>
                  <kendo-grid-column width="150" field="daysLate" title="{{'PRODUCTIVITYDASHBOARD.DAYSLATE' | translate}}"></kendo-grid-column>
                  <kendo-grid-column width="150" field="daysWithOutPermission" title="{{'PRODUCTIVITYDASHBOARD.DAYSWITHOUTPERMISSION' | translate}}"></kendo-grid-column>
              </kendo-grid>
              <div *ngIf="anyOperationInProgress" class="k-i-loading"></div>
            </div>
        </mat-card-content>
            </div>
            </div>
<app-common-message-box *ngIf="!(canAccess_feature_LateEmployee)  && !(roleFeaturesIsInProgress$|async)"
  textToDisplay="{{ 'PERMISSIONMESSAGE' | translate }}">
</app-common-message-box>
`

})

export class MorningLateEmployeeComponent extends CustomAppBaseComponent implements OnInit {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  date: Date = new Date();
  selectedDate: string = this.date.toISOString();
  selectedYear: number;
  selectedMonth: number;
  selecteddate: string;
  monthFilterActive: boolean = true;
  monthweekfilteractive: boolean = true;
  selectedValue: string = ConstantVariables.Month;
  type: string = ConstantVariables.Month;
  weekNumber: number;
  direction: any;
  finalDate: any;
  morningLateEmployeeData: any;
  isPermissionForLateEmployee: Boolean;
  anyOperationInProgress: boolean;
  selectBranchFilterIsActive: boolean = false;
  gridData: GridDataResult;
  selectedEntity: string;
  entities: EntityDropDownModel[] = [];
  validationMessage: string;
  state: State = {
    skip: 0,
    take: 10
  };
  fromDateIsActive: boolean = true;
  isOpen: boolean = true;
  filters: any[] = [
    { value: 'Week', id: 0, key: 'WEEK' },
    { value: 'Month', id: 1, key: 'MONTH' },
  ]
  router: any;
  softLabels: SoftLabelConfigurationModel[];
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(
    private hrDashboardService: HrDashboardService, private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService, private toaster: ToastrService,
    private store: Store<roleState.State>) {
    super();
    this.getMorningLateEmployeeDetails();
    this.getSoftLabels();
  }

  ngOnInit() {
    super.ngOnInit();
    this.isPermissionForLateEmployee = this.canAccess_feature_LateEmployee;
    if (this.isPermissionForLateEmployee) {
      this.getEntityDropDown();
      this.getMorningLateEmployeeDetails();
    }
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.morningLateEmployeeData, this.state);
  }

  getMorningLateEmployeeDetails() {
    this.anyOperationInProgress = true;
    var hrDashboardModel = new HrDashboardModel;
    hrDashboardModel.type = this.type;
    this.finalDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    hrDashboardModel.Date = this.finalDate;
    hrDashboardModel.entityId = this.selectedEntity;
    hrDashboardModel.isMorningLateEmployee = true;
    if (this.selectedDate && this.type) {
      this.hrDashboardService.getLateEmployeeDetails(hrDashboardModel).subscribe((responseData: any) => {
        this.morningLateEmployeeData = responseData.data;
        this.gridData = process(this.morningLateEmployeeData, this.state);
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
    this.selectedEntity = "";
    this.selectedValue = ConstantVariables.Month;
    this.monthFilterActive = true;
    this.monthweekfilteractive = true;
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
    this.getMorningLateEmployeeDetails();
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
    } else {
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
    this.getMorningLateEmployeeDetails();
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
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
