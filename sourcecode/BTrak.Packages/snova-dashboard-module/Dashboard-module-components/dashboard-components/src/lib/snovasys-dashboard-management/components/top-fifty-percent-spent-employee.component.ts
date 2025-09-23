import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { HrDashboardModel } from '../models/hrDashboardModel';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { Store, select } from '@ngrx/store';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as commonModuleReducers from "../store/reducers/index";
import * as roleState from "../store/reducers/authentication.reducers";
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-dashboard-component-topFiftyPercentSpentEmployee',
  template: `
<div class="full-height" *ngIf="(canAccess_feature_LateEmployee)">
  <mat-card class="p-0 m-0">
    <mat-card-title class="data-table-header drag-handler">
      <div fxLayout="row wrap" fxLayoutAlign="start center">
        <div fxFlex fxFlex.xs="100">
          <div class="card-title-text p-1">{{'HRDASHBOARD.TOP50PERCENTSPENTTIME' | translate | titlecase}}
          </div>
        </div>
        <div class="mr-05 search_goalinput" fxFlex="300px" fxFlex.xs="100" fxFlexOffset.xs="20px">
          <mat-form-field fxLayoutAlign="end center" fxLayoutAlign.xs="start center">
            <input class="search_goal" matInput placeholder="{{'SEARCH' | translate}}" [(ngModel)]="searchText"
              (input)="searchRecords()">
          </mat-form-field>
          <span class="shift-timing-close SearchIconAlignment">
            <span *ngIf="!searchText">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <mat-icon *ngIf="searchText" class="icon-button mr-lg-n4" aria-hidden="false" (click)="closeSearch()"
              style="cursor:pointer">
              close</mat-icon>
          </span>
        </div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" class="ml-02">
          <button mat-icon-button matTooltip="{{'RESET' | translate}}" (click)="resetAllFilters()">
            <fa-icon class="filter mat-color-accent" icon="undo"></fa-icon>
          </button>
        </div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center">
          <button type="submit" mat-icon-button class="pull-right" (click)="filterClick()"
            [matMenuTriggerFor]="filterMenu" matTooltip=" {{'HRMANAGAMENT.ADVANCESEARCH' | translate}}">
            <fa-icon icon="filter" class="filter mat-color-accent">
            </fa-icon>
          </button>
        </div>
      </div>
      <mat-menu #filterMenu="matMenu" class="filter-panel" (click)="$event.stopPropagation()">
        <button mat-menu-item [ngClass]="{ 'active': selectBranchFilterIsActive }" [matMenuTriggerFor]="branchSearch"
          *ngIf="entities?.length > 1">
          {{'LOGTIMEREPORT.ENTITY' | translate}}</button>
        <button mat-menu-item [ngClass]="{ 'active': monthFilterActive }" [matMenuTriggerFor]="dateSearch">
          {{'LOGTIMEREPORT.DATE' | translate}}</button>
        <button mat-menu-item [ngClass]="{ 'active': fromDateIsActive }"
          [matMenuTriggerFor]="fromDateSearch">{{'MYPROFILE.FROMDATE' | translate}}</button>
      </mat-menu>
      <mat-menu #branchSearch="matMenu">
        <mat-card class="filter-data" (click)="$event.stopPropagation()">
          <mat-form-field>
            <mat-select placeholder="{{ 'WIDGETS.SELECTBRANCH' | translate }}" [(ngModel)]="selectedEntity"
              (selectionChange)="entityValues($event.value)">
              <mat-option *ngFor="let entity of entities" [value]="entity.id">
                {{entity.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card>
      </mat-menu>
      <mat-menu #dateSearch="matMenu">
        <mat-card class="filter-data" (click)="$event.stopPropagation()">
          <fa-icon (click)="getMorningLateEmployeeBasedOnDate('left')" style="cursor:pointer" icon="chevron-left">
          </fa-icon>
          <b>&nbsp;{{selectedDate | date: "MMM-yyyy"}}&nbsp;</b><span
            *ngIf="weekNumber"><b>W{{weekNumber}}&nbsp;</b></span>
          <fa-icon (click)="getMorningLateEmployeeBasedOnDate('right')" style="cursor:pointer" icon="chevron-right">
          </fa-icon>
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
    </mat-card-title>
  </mat-card>
  <div class="activity-data">
    <mat-card-content class="p-0 m-0">
      <div class="activity-data">
        <kendo-grid [data]="gridData" [scrollable]="true" [pageSize]="state.take" [skip]="state.skip"
          [sort]="state.sort" [filter]="state.filter" [sortable]="true" [pageable]="true"
          (dataStateChange)="dataStateChange($event)">
          <kendo-grid-column width="200" field="fullName" 
            title="{{'HRMANAGAMENT.NAME' | translate}}">
            <ng-template kendoGridCellTemplate let-dataItem>
              <app-avatar class="employee_img" *ngIf="!dataItem.profileImage"
                [name]="dataItem.fullName | removeSpecialCharacters" [isRound]="true" size="30">
              </app-avatar>
              <img class="employee_img" *ngIf="dataItem.profileImage"
                [src]="dataItem.profileImage | fetchSizedAndCachedImage: '40':''">
                <span class="vertical-align"> {{ dataItem?.fullName }}</span>
              </ng-template>
            </kendo-grid-column>
          <kendo-grid-column width="200" field="spentTime" title="{{'HRDASHBOARD.SPENTTIME' | translate}}"></kendo-grid-column>
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

export class TopFiftyPercentSpentEmployeeComponent extends CustomAppBaseComponent implements OnInit {

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
  isPermissionForLateEmployee: Boolean;
  selectedValue: string = ConstantVariables.Month;
  type: string = ConstantVariables.Month;
  weekNumber: number;
  direction: any;
  TopFiftyPercentSpentEmployeeData: any;
  anyOperationInProgress: boolean;
  finalDate: any;
  gridData: GridDataResult;
  selectBranchFilterIsActive: boolean = false;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  validationMessage: string;
  state: State = {
    skip: 0,
    take: 10
  };
  isOpen: boolean = true;
  filters: any[] = [
    { value: 'Week', id: 0, key: 'WEEK' },
    { value: 'Month', id: 1, key: 'MONTH' },
  ];
  fromDateIsActive: boolean = true;
  searchText: string = '';
  searchIsActive: boolean = false;
  router: any;
  roleFeaturesIsInProgress$: Observable<boolean>;

  constructor(
    private hrDashboardService: HrDashboardService, private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef,
    private productivityService: ProductivityDashboardService,
    private toaster: ToastrService, private store: Store<roleState.State>) {
    super();
    this.getTopFiftyPercentSpentEmployeeDetails();
  }

  ngOnInit() {
    super.ngOnInit();
    this.isPermissionForLateEmployee = this.canAccess_feature_LateEmployee;
    if (this.isPermissionForLateEmployee) {
      this.getEntityDropDown();
      this.getTopFiftyPercentSpentEmployeeDetails();
    }
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.TopFiftyPercentSpentEmployeeData, this.state);
  }

  getTopFiftyPercentSpentEmployeeDetails() {
    this.anyOperationInProgress = true;
    var hrDashboardModel = new HrDashboardModel;
    this.finalDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    hrDashboardModel.SearchText = this.searchText;
    hrDashboardModel.Date = this.finalDate
    hrDashboardModel.type = this.type;
    hrDashboardModel.IsMoreSpentTime = true;
    hrDashboardModel.Order = 'Top';
    hrDashboardModel.entityId = this.selectedEntity;
    if (this.selectedDate && this.type) {
      this.hrDashboardService.getLateEmployeeDetails(hrDashboardModel).subscribe((responseData: any) => {
        this.TopFiftyPercentSpentEmployeeData = responseData.data;
        this.gridData = process(this.TopFiftyPercentSpentEmployeeData, this.state);
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
    this.searchText = null;
    this.searchText = '';
    this.searchIsActive = false;
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
    this.getTopFiftyPercentSpentEmployeeDetails();
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
    this.getTopFiftyPercentSpentEmployeeDetails();
  }

  searchRecords() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    {
      this.searchIsActive = false;
      this.searchText = this.searchText.trim();
    }
    this.searchIsActive = true;
    this.getTopFiftyPercentSpentEmployeeDetails()
  }

  closeSearch() {
    this.searchText = '';
    this.getTopFiftyPercentSpentEmployeeDetails()
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
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
