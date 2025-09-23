import { Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { HrDashboardModel } from '../models/hrDashboardModel';
import { HrDashboardService } from '../services/hr-dashboard.service';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import '../../globaldependencies/helpers/fontawesome-icons';
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: 'app-dashboard-component-bottomFiftyPercentSpentEmployee',
  template: `
  <app-common-message-box *ngIf="!isDataLoaded" textToDisplay="{{ 'PRODUCTIVITYDASHBOARD.PERMISSION' | translate }}">
  </app-common-message-box>
  
  <mat-card class="p-0 m-0" *ngIf="isDataLoaded">
    <mat-card-title class="data-table-header drag-handler">
      <div fxLayout="row wrap" fxLayoutAlign="start center">
        <div fxFlex fxFlex.xs="100">
          <div class="card-title-text p-1">{{'HRDASHBOARD.BOTTOM50PERCENTSPENTTIME' | translate | titlecase}}
          </div>
        </div>
        <div class="mr-05 search_goalinput" fxFlex="300px" fxFlex.xs="100" fxFlexOffset.xs="20px">
          <mat-form-field fxLayoutAlign="end center" fxLayoutAlign.xs="start center">
            <input class="search_goal" matInput placeholder="{{'SEARCH' | translate}}" [(ngModel)]="searchText"
              (input)="searchRecords()">
          </mat-form-field>
          <span class="shift-timing-close SearchIconAlignment">
            <span *ngIf="!searchText">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <mat-icon *ngIf="searchText" class="icon-button mr-lg-n4" aria-hidden="false" (click)="closeSearch()"
              style="cursor:pointer">
              close</mat-icon>
          </span>
        </div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" class="ml-02" *ngIf="entities?.length > 1">
          <button mat-icon-button matTooltip="{{'RESET' | translate}}" (click)="resetAllFilters()">
            <fa-icon class="filter mat-color-accent" icon="undo"></fa-icon>
          </button>
        </div>
        <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" *ngIf="entities?.length > 1">
          <button type="submit" mat-icon-button class="pull-right" (click)="filterClick()"
            [matMenuTriggerFor]="filterMenu" matTooltip=" {{'HRMANAGAMENT.ADVANCESEARCH' | translate}}">
            <fa-icon icon="filter" class="filter mat-color-accent">
            </fa-icon>
          </button>
        </div>
      </div>
      <mat-menu #filterMenu="matMenu" class="filter-panel" (click)="$event.stopPropagation()">
        <button mat-menu-item [ngClass]="{ 'active': selectBranchFilterIsActive }" [matMenuTriggerFor]="branchSearch">
          {{'LOGTIMEREPORT.ENTITY' | translate}}</button>
        <button mat-menu-item [ngClass]="{ 'active': fromDateIsActive }"
          [matMenuTriggerFor]="fromDateSearch">{{'WORKLOGGING.DATE' | translate}}</button>
       <button mat-menu-item [ngClass]="{ 'active': dateIsActive }"
          [matMenuTriggerFor]="dateFilter">{{'MYPROFILE.FROMDATE' | translate}}</button>
       <button mat-menu-item [ngClass]="{ 'active': dateToIsActive }"
          [matMenuTriggerFor]="dateFilterTo">{{'MYPROFILE.TODATE' | translate}}</button>
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
      <mat-menu #dateFilter="matMenu">
          <mat-card class="filter-data" (click)="$event.stopPropagation()">
            <mat-form-field class="full-width">
              <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDateValue" [value]="selectedDateValue"
                (click)="picker.open()" (dateChange)="selectedDatefrom($event.value)">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </mat-card>
      </mat-menu>
      <mat-menu #dateFilterTo="matMenu">
        <mat-card class="filter-data" (click)="$event.stopPropagation()">
          <mat-form-field class="full-width">
            <input matInput [matDatepicker]="picker1" [(ngModel)]="selectedDateToValue" [value]="selectedDateToValue"
              (click)="picker1.open()" (dateChange)="selectedDateTo($event.value)">
            <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>
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
  <div fxFlex class="p-05" fxLayout="row" *ngIf="searchText || isDateToFilter || isDateFromFilter || isTypeFilter|| isEntityFilter">
      <mat-chip disableRipple matRipple class="mr-08" *ngIf="searchText">
        <b>{{'SEARCH' | translate}}:&nbsp;</b>
        {{ searchText }}
        <fa-icon icon="times" class="ml-05 mat-color-accent cursor-pointer" (click)="closeSearch()">
        </fa-icon>
      </mat-chip>
    
      <mat-chip disableRipple matRipple class="mr-08" *ngIf="isDateFromFilter">
      <b>{{'Selected date' | translate}}:&nbsp;</b>
      {{ selectedDateFromFilter }}
      <fa-icon icon="times" class="ml-05 mat-color-accent cursor-pointer" (click)="closeDateFromFilter()">
      </fa-icon>
    </mat-chip>

    <mat-chip disableRipple matRipple class="mr-08" *ngIf="isTypeFilter">
    <b>{{'Selected line manager'|translate}}:&nbsp;</b>
    {{ selectedType }}
    <fa-icon icon="times" class="ml-05 mat-color-accent cursor-pointer" (click)="closeTypeFilter()">
    </fa-icon>
  </mat-chip>
    <mat-chip disableRipple matRipple class="mr-08" *ngIf="isDateToFilter">
      <b>{{'Selected date' | translate}}:&nbsp;</b>
      {{ selectedDateToFilter }}
      <fa-icon icon="times" class="ml-05 mat-color-accent cursor-pointer" (click)="closeDateToFilter()">
      </fa-icon>
    </mat-chip>
      
      <mat-chip disableRipple matRipple class="mr-08" *ngIf="selectedEntity">
        <b>{{'Selected entity' | translate}}:&nbsp;</b>
        {{ selectedEntityName }}
        <fa-icon icon="times" class="ml-05 mat-color-accent cursor-pointer" (click)="closeEntityFilter()">
        </fa-icon>
      </mat-chip>
    </div>
  <div class="activity-data" *ngIf="isDataLoaded">
    <mat-card-content class="p-0 m-0">
      <div class="activity-data">
        <kendo-grid [data]="gridData" [scrollable]="true" [pageSize]="state.take" [skip]="state.skip"
          [sort]="state.sort" [filter]="state.filter" [sortable]="true" [pageable]="true"
          (dataStateChange)="dataStateChange($event)">
          <kendo-grid-column width="150" field="fullName" 
            title="{{'HRMANAGAMENT.NAME' | translate}}">
            <ng-template kendoGridCellTemplate let-dataItem>
                <app-avatar class="employee_img" *ngIf="!dataItem.profileImage"
                 [name]="dataItem.fullName | removeSpecialCharacters" [isRound]="true" size="30">
                </app-avatar>
                <img class="employee_img" *ngIf="dataItem.profileImage"
                  [src]="dataItem.profileImage | fetchSizedAndCachedImage: '40':''">
                  <span class="vertical-align"> {{ dataItem?.fullName }}</span>
              </ng-template></kendo-grid-column>
          <kendo-grid-column width="150" field="spentTime" title="{{'HRDASHBOARD.SPENTTIME' | translate}}"></kendo-grid-column>
        </kendo-grid>
        <div *ngIf="anyOperationInProgress" class="k-i-loading"></div>
      </div>
    </mat-card-content>
  </div>
  `
})

export class BottomFiftyPercentSpentEmployeeComponent extends CustomAppBaseComponent implements OnInit {
  selectedDateValue: any;
  selectedDateFilter: string;
  dateIsActive: boolean;
  dateToIsActive: boolean;
  selectedDateToValue: any;
  selectedEntityName: string;
  isEntityFilter: boolean;
  isDateFromFilter: boolean = false;
  isDateToFilter: boolean = false;
  selectedDateFromFilter: string;
  selectedDateToFilter: string;
  selectedType: any;
  isTypeFilter: boolean;
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

  selectedFromDate: string = this.date.toISOString();
  selectedToDate: string = this.date.toISOString();
  monthFilterActive: boolean = true;
  monthweekfilteractive: boolean = true;
  selectedValue: string = ConstantVariables.Month;
  type: string = ConstantVariables.Month;
  weekNumber: number;
  direction: any;
  bottomFiftyPercentSpentEmployeeData: any;
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
  isDataLoaded: boolean = true;

  constructor(
    private hrDashboardService: HrDashboardService, private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef, private toaster: ToastrService,
    private productivityService: ProductivityDashboardService) {
    super();
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.bottomFiftyPercentSpentEmployeeData, this.state);
  }

  getBottomFiftyPercentSpentEmployeeDetails() {
    this.anyOperationInProgress = true;
    var hrDashboardModel = new HrDashboardModel;
    this.finalDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    hrDashboardModel.SearchText = this.searchText;
    hrDashboardModel.Date = this.finalDate
    hrDashboardModel.DateFrom = this.selectedFromDate
    hrDashboardModel.DateTo = this.selectedToDate;
    hrDashboardModel.type = this.type;
    hrDashboardModel.IsMoreSpentTime = true;
    hrDashboardModel.Order = 'Bottom';
    hrDashboardModel.entityId = this.selectedEntity;
    if ((this.selectedDate && this.type) || (this.selectedToDate && this.selectedFromDate)) {
      this.hrDashboardService.getLateEmployeeDetails(hrDashboardModel).subscribe((responseData: any) => {
        if (responseData.success) {
          this.isDataLoaded = true;
          this.bottomFiftyPercentSpentEmployeeData = responseData.data;
          this.gridData = process(this.bottomFiftyPercentSpentEmployeeData, this.state);
        }
        else {
          this.isDataLoaded = false;
        }
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
    this.selectedFromDate = null;
    this.selectedToDate = null;
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
    this.selectedType = this.type;
    this.isTypeFilter=true;
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
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  getWeekNumber(selectedDate) {
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
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  searchRecords() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    {
      this.searchIsActive = false;
      this.searchText = this.searchText.trim();
    }
    this.searchIsActive = true;
    this.getBottomFiftyPercentSpentEmployeeDetails()
  }

  closeSearch() {
    this.searchText = '';
    this.getBottomFiftyPercentSpentEmployeeDetails()
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


  selectedDatefrom(selectedDate) {
    this.dateIsActive = true;
    this.selectedDateValue = selectedDate;
    this.isDateFromFilter=true;
    this.type = null;
    this.selectedDate = null;
    this.selectedDateFromFilter = this.datePipe.transform(this.selectedDateValue, 'yyyy-MM-dd');
    this.selectedFromDate = this.selectedDateFromFilter;
    if (!this.selectedToDate) {
      this.selectedToDate = this.selectedFromDate;
    }
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }
  selectedDateTo(selectedDate) {

    this.dateToIsActive = true;
    this.isDateToFilter=true;
    this.selectedDateToValue = selectedDate;
    this.selectedDateToFilter = this.datePipe.transform(this.selectedDateToValue, 'yyyy-MM-dd');
    this.selectedToDate = this.selectedDateToFilter;
    this.type = null;
    this.selectedDate = null;
    if (!this.selectedFromDate) {
      this.selectedFromDate = this.selectedToDate;
    }
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  closeDateFromFilter() {
    this.selectedDateValue = this.parse(new Date());
    this.isDateFromFilter = false;
    this.selectedFromDate = this.selectedDateValue;
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  closeDateToFilter() {
    this.selectedDateValue = this.parse(new Date());
    this.isDateToFilter = false;
    this.selectedToDate = this.selectedDateValue;
    this.getBottomFiftyPercentSpentEmployeeDetails();
  }

  entityValues(name) {
    this.isEntityFilter = true;
    this.selectBranchFilterIsActive = true;
    this.selectedEntity = name;
    let entityObj = this.entities.filter(x => x.id == name);
    this.selectedEntityName = (entityObj != undefined && entityObj != null) ? entityObj[0].name : "";
    this.getDateAndMonthFilter(this.type);
  }
  closeEntityFilter() {
    this.selectedEntity = "";
    this.isEntityFilter = false;
    this.getDateAndMonthFilter(this.type);
  }
  closeTypeFilter() {
    this.selectedType = "";
    this.isTypeFilter = false;
    this.getDateAndMonthFilter(this.type);
  }
}
