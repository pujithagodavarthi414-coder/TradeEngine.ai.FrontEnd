import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductivityDashboardService } from '../services/productivity-dashboard.service';
import { ChartReadyEvent, } from 'ng2-google-charts';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({

  selector: 'app-dashboard-component-everyDayTargetDetails',
  template: `  
    <app-common-message-box *ngIf="!(canAccess_feature_EveryDayTargetStatus)"
      textToDisplay="{{ 'PRODUCTIVITYDASHBOARD.PERMISSION' | translate }}">
    </app-common-message-box>
    <div class="full-height">
      <div class="p-0 m-0" *ngIf="( canAccess_feature_EveryDayTargetStatus)">
        <mat-card-title class="full-width data-table-header drag-handler">
          <div fxLayout="row wrap" fxLayoutGap="0">
            <div fxFlex fxLayoutAlign="start center" class="card-title-text p-05 full-width">
              <span fxFlex="100"
                class="hide-content-overflow">{{'PRODUCTIVITYDASHBOARD.EVERYDAYTARGETDETAILS' | translate | titlecase }}</span>
            </div>

            <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" class="ml-02" *ngIf="entities?.length > 1">
              <button mat-icon-button matTooltip="{{'RESET' | translate}}" (click)="resetAllFilters()">
                <fa-icon class="filter mat-color-accent" icon="undo"></fa-icon>
              </button>
            </div>
            <div fxFlex="40px" fxFlex.xs="25px" fxLayoutAlign="end center" *ngIf="entities?.length > 1">
              <button type="submit" mat-icon-button class="pull-right" (click)="filterClick()"
                [matMenuTriggerFor]="filterMenu" matTooltip=" {{'HRMANAGAMENT.ADVANCESEARCH' | translate}}">
                <fa-icon icon="user-cog" class="filter mat-color-accent">
                </fa-icon>
              </button>
            </div>
          </div>
        </mat-card-title>
      </div>
      <mat-menu #filterMenu="matMenu" xPosition="before" class="custom-matpanel">
        <mat-card class="filter-data" (click)="$event.stopPropagation()">
          <mat-form-field (click)="$event.stopPropagation()">
            <mat-select placeholder="{{ 'WIDGETS.SELECTBRANCH' | translate }}" [(ngModel)]="selectedEntity"
              (selectionChange)="entityValues($event.value)">
              <mat-option *ngFor="let entity of entities" [value]="entity.id">
                {{entity.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card>
      </mat-menu>
      <div class="p-0 m-0 no-drag" *ngIf="( canAccess_feature_EveryDayTargetStatus)" id="style-1">
        <mat-card-title class="">
          <div class="card-title-text"></div>
          <mat-divider></mat-divider>
        </mat-card-title>
        <mat-card-content>
          <google-chart [data]="columnChart" (chartReady)="ready($event)"></google-chart>
        </mat-card-content>
      </div>
    </div>
    `,
  styles: [
    `
    path{
        fill: rgb(40,97,146) !important;
        stroke: #286192 !important;
    }
        `
  ]
})

export class EveryDayTargetDetailsComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  targetStatus: any[];
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  public seriesData: number[] = [1, 2];
  anyOperationInProgress: boolean;
  modyfiedtargetStatus: any[];
  public columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [],
    options: {
      legend: 'none'
    }
  };

  validationMessage: string;

  constructor(
    private productivityService: ProductivityDashboardService,
    private translateService: TranslateService, private toaster: ToastrService,
    private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    if (this.canAccess_feature_EveryDayTargetStatus) {
      this.getEverydayTargetStatus();
    }
  }

  public statusColor(status) {
    return status.dataItem.color;
  }

  changeData(): void {
    this.columnChart.dataTable = this.modyfiedtargetStatus;
    if (this.columnChart.component)
      this.columnChart.component.draw();
  }

  getEverydayTargetStatus() {
    this.anyOperationInProgress = true;
    this.productivityService.getEverydayTargetStatus(this.selectedEntity).subscribe((responseData: any) => {
      if (responseData.success == false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      if (responseData.data.length === 0) {
        this.targetStatus = null;
      } else {
        this.targetStatus = responseData.data;
        let modyfiedtargetStatus: any[] = [['productivityNames', 'productivityValue', { role: 'style' }]];
        this.targetStatus[0].productivityNames = this.translateService.instant(ConstantVariables.REQUIREDPRODUCTIVITY);
        this.targetStatus[1].productivityNames = this.translateService.instant(ConstantVariables.EXISTINGPRODUCTIVITY);
        this.targetStatus.forEach(function (item) {
          let temp: any[] = [];

          temp.push(item.productivityNames);
          temp.push(item.productivityValue);
          temp.push(item.color);
          modyfiedtargetStatus.push(temp);
        });
        this.modyfiedtargetStatus = modyfiedtargetStatus;
        this.changeData();

      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }
  ready(event: ChartReadyEvent) {
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
    this.getEverydayTargetStatus();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getEverydayTargetStatus();
  }

}
