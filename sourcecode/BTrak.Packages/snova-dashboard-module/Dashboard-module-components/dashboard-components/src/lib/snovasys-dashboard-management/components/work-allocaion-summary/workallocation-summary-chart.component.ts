import { Component, OnInit, HostListener, Input, ChangeDetectorRef, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartSelectEvent } from 'ng2-google-charts';
import { Store, select } from "@ngrx/store";
import * as commonModuleReducers from "../../store/reducers/index";
import { State } from "../../store/reducers/branch.reducers";
import { MainDashboardService } from '../../services/maindashboard.service';
import { WorkAllocationSummary } from "../../models/workallocationsummary";
import { WorkAllocationChart } from '../../models/workallocationchart';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityDropDownModel } from '../../models/entity-dropdown.model';
import { ProductivityDashboardService } from '../../services/productivity-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DrillDownUserStoryPopupComponent } from '../../containers/drilldown-userstoryPopup.page';
import { Observable } from 'rxjs';
import * as workspaceModuleReducer from "../../store/reducers/index";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { WorkspaceList } from '../../models/workspace-list.model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { LoadWorkspacesListTriggered } from '../../store/actions/Workspacelist.action';
import * as $_ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
const $ = $_;

@Component({
  selector: 'app-profile-component-workallocationsummarychart',
  templateUrl: 'workallocation-summary-chart.component.html'
})

export class WorkAllocationSummaryChartComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild("drillDownUserStoryPopupComponent1", { static: true }) drillDownUserStoryPopupComponent: TemplateRef<any>;

  @Output() closePopUp = new EventEmitter<any>();
  selectedUserId: string;
  isMySelfOnlyRequired: boolean;
  isAll: boolean = true;
  isMyself: boolean = true;
  isReportedOnly: boolean = true;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.selectedUserId = this.dashboardFilters.userId;
      if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
        this.isMySelfOnlyRequired = true;
      }
      else {
        this.isMySelfOnlyRequired = false;
      }
      this.cdRef.detectChanges();
      this.ngOnInit()
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
  selectedFilterValue: string = "all";
  all: boolean = true;
  reportingOnly: boolean = false;
  myself: boolean = false;
  selectedWorkspaceId: string;
  workspaces: WorkspaceList[];
  workspacesList$: Observable<WorkspaceList[]>;
  defaultFilterValue: string;
  disableDropDown: boolean = false;
  workSpaceList: WorkspaceList;
  notFromProfile: boolean = true;

  initChart() {
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.modyfiedworkAllocationSummaryRecords,
      options: {
        width: this.notFromProfile ? 1500 : this.width,
        height: 700,
        bar: { groupWidth: "50%" },
        //explorer: { maxZoomOut: 16 }, // default: 4
        legend: 'none',

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

  roleFeaturesIsInProgress$: any;

  constructor(
    private store: Store<State>, private mainDashboardService: MainDashboardService, private productivityService: ProductivityDashboardService, private toaster: ToastrService, private cookieService: CookieService,
    private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private cdRef: ChangeDetectorRef, private routes: Router) {
    super();
    this.route.params.subscribe((params) => {
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedWorkspaceId = params["id"];
      }
    });
    if (this.router.url.includes('profile')) {
      this.notFromProfile = false;
      this.cdRef.markForCheck();
    }
    this.workspacesList$ = this.store.pipe(select(workspaceModuleReducer.getWorkspaceAll));
    this.workspacesList$.subscribe((s) => {
      this.workspaces = s;
      const index = this.workspaces.findIndex((p) => p.workspaceId == this.selectedWorkspaceId);
      if (index > -1) {
        if (this.workspaces[index].workspaceName == "Administrator Dashboard") {
          this.selectedFilterValue = "all";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = true;
          this.reportingOnly = false;
          this.myself = false;
          this.disableDropDown = false;
        }
        else if (this.workspaces[index].workspaceName == "Manager Dashboard") {
          this.selectedFilterValue = "reportingOnly";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = false;
          this.reportingOnly = true;
          this.myself = false;
          this.disableDropDown = false;
        }
        else if (this.workspaces[index].workspaceName == "User Dashboard") {
          this.selectedFilterValue = "mySelf";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = false;
          this.reportingOnly = false;
          this.myself = true;
          this.disableDropDown = true;
        }
      }
      if (this.routes.url.includes('/dashboard/myproductivity')) {
        this.selectedFilterValue = "mySelf";
        this.defaultFilterValue = this.selectedFilterValue;
        this.all = false;
        this.reportingOnly = false;
        this.myself = true;
        this.disableDropDown = true;
        this.isAll = false;
        this.isMyself = true;
        this.isReportedOnly = false;
        // this.cdRef.markForCheck();
        // this.changeFilterValue("mySelf");
      }
      else {
        this.selectedFilterValue = "all";
        this.defaultFilterValue = this.selectedFilterValue;
        this.all = true;
        this.reportingOnly = false;
        this.myself = false;
        this.disableDropDown = true;
        this.isAll = true;
        this.isMyself = true;
        this.isReportedOnly = true;
        // this.cdRef.markForCheck();
        // this.getWorkAllocationSummaryList();
      }
    })
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.canAccess_feature_WorkAllocationSummary) {
      this.getWorkAllocationSummaryList();
    }
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    this.initChart();
    this.getEntityDropDown();

    this.workSpaceList = new WorkspaceList();
    this.workSpaceList.workspaceId = "null";
    this.workSpaceList.isHidden = false;
    this.store.dispatch(new LoadWorkspacesListTriggered(this.workSpaceList));

  }


  changeFilterValue(value) {
    if (value == "all") {
      this.selectedFilterValue = "all";
      this.all = true;
      this.reportingOnly = false;
      this.myself = false;
    }
    else if (value == "reportingOnly") {
      this.selectedFilterValue = "reportingOnly";
      this.all = false;
      this.reportingOnly = true;
      this.myself = false;
    }
    else if (value == "mySelf") {
      this.selectedFilterValue = "mySelf";
      this.all = false;
      this.reportingOnly = false;
      this.myself = true;
    }
    this.getWorkAllocationSummaryList();
  }

  ngOnChanges() {
    if (this.modyfiedworkAllocationSummaryRecords.length != 0) {
      this.changeData();
    }
  }

  error() {
  }

  select(event: ChartSelectEvent) {
    let dialogId = "app-profile-component-drilldownuserstoryPopup12";
    let workAllocationSummary = new WorkAllocationSummary();
    workAllocationSummary.userId = event.selectedRowValues[3];
    workAllocationSummary.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';

    this.mainDashboardService.getDrillDownUserStorybyUserId(workAllocationSummary)
      .subscribe((responseData: any) => {

        if (responseData.success) {
          if (responseData != null && responseData != undefined && responseData.data != null && responseData.data != undefined && responseData.data.length > 0) {

            let dialog = this.dialog;
            let data = responseData.data;

            const dialogRef = dialog.open(this.drillDownUserStoryPopupComponent, {
              width: "90%",
              direction: 'ltr',
              data: { data, formPhysicalId: dialogId, isFromEmployeeIndex: false },
              disableClose: true,
              id: dialogId
            });
            dialogRef.afterClosed().subscribe((result) => {
              // if (result.success) {

              // }
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

  getWorkAllocationSummaryList() {
    let workAllocationSummary = new WorkAllocationSummary();
    if (this.router.url.includes("profile") && this.router.url.split("/")[3]) {
      workAllocationSummary.userId = this.router.url.split("/")[3];
    }
    workAllocationSummary.entityId = this.selectedEntity;
    workAllocationSummary.isAll = this.notFromProfile ? this.all : false;
    workAllocationSummary.isReportingOnly = this.notFromProfile ? this.reportingOnly : false;
    workAllocationSummary.isMyself = this.notFromProfile ? this.myself : workAllocationSummary.userId ? false : true;
    workAllocationSummary.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
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
    this.initChart();
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
    this.selectedFilterValue = "all";
    if (this.defaultFilterValue) {
      this.changeFilterValue(this.defaultFilterValue);
    } else {
      this.changeFilterValue("all");
    }
    this.getWorkAllocationSummaryList();
  }

  closeCurrentDialog() {
    this.closePopUp.emit(true);
  }

  fitContent(optionalParameters: any) {

    var interval;
    var count = 0;

    if (optionalParameters['gridsterView']) {

      interval = setInterval(() => {
        try {

          if (count > 30) {
            clearInterval(interval);
          }

          count++;

          if ($(optionalParameters['gridsterViewSelector'] + ' .google-chart-height').length > 0) {

            var appHeight = $(optionalParameters['gridsterViewSelector']).height();
            var contentHeight = appHeight - 45;
            $(optionalParameters['gridsterViewSelector'] + ' .google-chart-height').height(contentHeight);

            clearInterval(interval);
          }

        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);

    }

  }


}