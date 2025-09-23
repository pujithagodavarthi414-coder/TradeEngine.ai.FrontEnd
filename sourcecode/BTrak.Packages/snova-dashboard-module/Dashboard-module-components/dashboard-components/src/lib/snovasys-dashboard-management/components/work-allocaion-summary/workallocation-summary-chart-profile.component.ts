import { Component, OnInit, HostListener, Input, OnChanges } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent } from 'ng2-google-charts';
import { Store, select } from "@ngrx/store";
import * as commonModuleReducers from "../../store/reducers/index";
import { State } from "../../store/reducers/authentication.reducers";
import { MainDashboardService } from '../../services/maindashboard.service';
import { WorkAllocationSummary } from "../../models/workallocationsummary";
import { WorkAllocationChart } from '../../models/workallocationchart';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DrillDownUserStoryPopupComponent } from '../../containers/drilldown-userstoryPopup.page';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { DashboardService } from '../../services/dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-profile-component-workallocationsummarychart-profile',
  templateUrl: './workallocation-summary-chart-profile.component.html'
})

export class WorkAllocationSummaryChartProfileComponent extends CustomAppBaseComponent implements OnInit, OnChanges {

  @Input("dashboardFilters")
  set _dashboardFilters(info: DashboardFilterModel) {
    if (info && info !== undefined) {
      this.dashboardFilters = info;
    }
  }

  @Input("isFromDashboard")
  set _isFromDashboard(data: boolean) {
    if (data && data !== undefined) {
      this.isFromDashboard = data;
    }
  }

  isFromDashboard = true;
  dashboardFilters: DashboardFilterModel;
  workAllocationSummaryRecords: WorkAllocationChart[] = [];
  modyfiedworkAllocationSummaryRecords = [];
  width: any;
  responsive: true;
  columnChart: GoogleChartInterface;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  open = true;
  userId: string;
  roleFeaturesIsInProgress$: any;

  constructor(
    private store: Store<State>, private mainDashboardService: MainDashboardService,
    private productivityService: ProductivityDashboardService, private toaster: ToastrService,
    private dialog: MatDialog, private dashboardService: DashboardService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getLoggedInUser();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    this.modifyChart();
    this.getEntityDropDown();
  }

  ngOnChanges() {
    if (this.modyfiedworkAllocationSummaryRecords.length != 0) {
      this.changeData();
    }
  }

  modifyChart() {
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.modyfiedworkAllocationSummaryRecords,
      options: {
        height: 700,
        legend: 'none',
        width: this.width,
        hAxis: {
          direction: -1,
          slantedText: true,
          responsive: true,
          slantedTextAngle: 90,
          textStyle: {
            fontSize: 11
          }
        },
        vAxis: { gridlines: { count: 10 } },
      },
    };
  }

  error() {
  }

  select(event: ChartSelectEvent) {

    let workAllocationSummary = new WorkAllocationSummary();
    workAllocationSummary.userId = event.selectedRowValues[3];

    this.mainDashboardService.getDrillDownUserStorybyUserId(workAllocationSummary)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData != null && responseData != undefined && responseData.data != null && responseData.data != undefined && responseData.data.length > 0) {
            let dialog = this.dialog;
            let data = responseData.data;
            const dialogRef = dialog.open(DrillDownUserStoryPopupComponent, {
              width: "90%",
              direction: 'ltr',
              data: { data },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result.success) {

              }
            });
          }
        }
      });
  }

  changeData(): void {
    this.columnChart.dataTable = this.modyfiedworkAllocationSummaryRecords;
    if (this.columnChart.component)
      this.columnChart.component.draw();
  }

  getLoggedInUser() {
    this.dashboardService.getLoggedInUser().subscribe((responseData: any) => {
      this.userId = responseData.data.id;
      this.getWorkAllocationSummaryList();
    })
  }

  getWorkAllocationSummaryList() {
    let workAllocationSummary = new WorkAllocationSummary();
    workAllocationSummary.entityId = this.selectedEntity;
    workAllocationSummary.userId = this.userId;
    this.mainDashboardService.getWorkAllocationSummary(workAllocationSummary)
      .subscribe((responseData: any) => {
        if (responseData.success && responseData.data) {
          this.workAllocationSummaryRecords = responseData.data;
          let modyfiedworkAllocationSummaryRecords: any[] = [['', '', { role: 'style' }, { role: 'annotationText' }]];
          if (this.workAllocationSummaryRecords.length != 0)
            this.workAllocationSummaryRecords.forEach(function (item) {
              let temp: any[] = [];
              temp.push(item.userName);
              temp.push(item.workAllocated);
              temp.push(item.color);
              temp.push(item.userId);
              modyfiedworkAllocationSummaryRecords.push(temp);
            });
          this.modyfiedworkAllocationSummaryRecords = modyfiedworkAllocationSummaryRecords;
          if (this.columnChart)
            this.changeData();
        }
        else {
          let modyfiedworkAllocationSummaryRecords: any[] = [['', '', { role: 'style' }, { role: 'annotationText' }]];

          let temp: any[] = [];
          temp.push(null);
          temp.push(0);
          temp.push(null);
          temp.push(null);
          modyfiedworkAllocationSummaryRecords.push(temp);

          this.modyfiedworkAllocationSummaryRecords = modyfiedworkAllocationSummaryRecords;
          if (this.columnChart)
            this.changeData();
        }
      });

  }

  ready() {
  }

  @HostListener('window:resize', [])

  onResize() {
    this.width = '100%'
    this.modifyChart();
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
    this.getWorkAllocationSummaryList();
  }

  filterClick() {
    this.open = !this.open;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.getWorkAllocationSummaryList();
  }
}