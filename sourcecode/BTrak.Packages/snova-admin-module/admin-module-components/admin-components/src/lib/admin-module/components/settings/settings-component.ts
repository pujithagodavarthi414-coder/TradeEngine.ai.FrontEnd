import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, AfterViewInit, OnInit }
  from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router } from '@angular/router';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DashboardList } from '../../models/dashboardList';
import { SoftLabelConfigurationModel } from "../../models/hr-models/softlabels-model";
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-settings-component',
  templateUrl: `settings-component.html`

})

export class settingsComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  firstTab:string;
  selectedTabLable: string;
  selectedTab: number = 0;
  selectedUserId: string;
  dashboardFilter: DashboardFilterModel;
  selectedWorkspaceIdForSystemSettings: string;
  selectedWorkspaceIdForHRSettings: string;
  selectedWorkspaceIdForTimeSheetSettings: string;
  selectedWorkspaceIdForprojecttSettings: string;
  selectedWorkspaceIdForPayrollSettings: string;
  selectedWorkspaceIdForLeaveSettings: string;
  selectedWorkspaceIdForAssetsSettings: string;
  selectedWorkspaceIdForAuditSettings: string;
  selectedWorkspaceIdForRosterSettings: string;
  selectedWorkspaceIdForStatusReports: string;
  selectedWorkspaceIdForAppBuilder: string;
  selectedWorkspaceIdForExpenseSettings: string;
  selectedWorkspaceIdForInvoiceSettings: string;
  No_Access_ForAllSettingsTabs: boolean;
  softLabels: SoftLabelConfigurationModel[];
  constructor(
    private route: Router,
    private widgetService: WidgetService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,) {
    super();
    this.getSoftLabels();
  }
  ngOnInit() {
    super.ngOnInit();
    // this.GetCustomizedDashboardIdForSystemSettings();
    // this.GetCustomizedDashboardIdForHrSettings();
    // this.GetCustomizedDashboardIdForTimeSheetSettings();
    // this.GetCustomizedDashboardIdForprojectSettings();
    // this.GetCustomizedDashboardIdForpayroleSettings();
    // this.GetCustomizedDashboardIdForLeaveSettings();
    // this.GetCustomizedDashboardIdForAssetsSettings();
    // this.GetCustomizedDashboardIdForAuditSettings();
    // this.GetCustomizedDashboardIdForRosterSettings();
    // this.GetCustomizedDashboardIdForStatusReports();
    // this.GetCustomizedDashboardIdForAppBuilder();
    // this.GetCustomizedDashboardIdForExpenseSettings();
    // this.GetCustomizedDashboardIdForInvoiceSettings();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
}
  ngAfterViewInit(): void {
    super.ngOnInit()
    this.subscribeToRouteChangeAndInitializeTheEntirePage();
  }
  subscribeToRouteChangeAndInitializeTheEntirePage() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedTabLable = params["tab"];
    });
    if (this.selectedTabLable) {
      this.selectedTab = this.getTabIndex(this.selectedTabLable);

    } else {
      this.selectedTabLable = this.firstTabToActivate();
      this.route.navigate(['settings/' + this.selectedTabLable]);
    }
  }
  firstTabToActivate(): string {
    if(this.canAccess_feature_ProjectSettings){
      this.firstTab="projectsettings"
    }
    else if(this.canAccess_feature_TimesheetSettings){
      this.firstTab="timesheetsettings"
    }
    else if(this.canAccess_feature_HRSettings){
      this.firstTab="hrsettings"
    }
    else if(this.canAccess_feature_LeaveSettings){
      this.firstTab="leavesettings"
    }
    else if(this.canAccess_feature_PayrollSettings){
      this.firstTab="payrollsettings"
    }
    else if(this.canAccess_feature_SystemSettings){
      this.firstTab="systemsettings"
    }
    else if(this.canAccess_feature_AssetsSettings){
      this.firstTab="assetssettings"
    }
    else if(this.canAccess_feature_AuditsSettings){
      this.firstTab="auditssettings"
    }
    else if(this.canAccess_feature_RosterSettings){
      this.firstTab="rostersettings"
    }
    else if(this.canAccess_feature_StatusReports){
      this.firstTab="statusreports"
    }
    else if(this.canAccess_feature_AppBuilder){
      this.firstTab="appbuilder"
    }
    else if(this.canAccess_feature_ManageExpenseSettings){
      this.firstTab="expensesettings"
    }
    else if(this.canAccess_feature_ManageInvoiceSettings){
      this.firstTab="invoicesettings"
    }
    return this.firstTab
  }
  


  getTabIndex(tabName: string) {
    if (this.matTabGroup != null && this.matTabGroup != undefined) {
      const matTabs = this.matTabGroup._tabs.toArray();
      let index = 0;
      for (const matTab of matTabs) {
        if (matTab.textLabel === "projectsettings" && tabName === "projectsettings") {
          if (!this.selectedWorkspaceIdForprojecttSettings) {
            this.GetCustomizedDashboardIdForprojectSettings();
          }
          return index;
        }
        if (matTab.textLabel === "timesheetsettings" && tabName === "timesheetsettings") {
          if (!this.selectedWorkspaceIdForTimeSheetSettings) {
            this.GetCustomizedDashboardIdForTimeSheetSettings();
          }
          return index;
        }
        if (matTab.textLabel === "hrsettings" && tabName === "hrsettings") {
          if (!this.selectedWorkspaceIdForHRSettings) {
            this.GetCustomizedDashboardIdForHrSettings();
          }
          return index;
        }
        if (matTab.textLabel === "leavesettings" && tabName === "leavesettings") {
          if (!this.selectedWorkspaceIdForLeaveSettings) {
            this.GetCustomizedDashboardIdForLeaveSettings();
          }
          return index;
        }
        if (matTab.textLabel === "payrollsettings" && tabName === "payrollsettings") {
          if (!this.selectedWorkspaceIdForPayrollSettings) {
            this.GetCustomizedDashboardIdForpayroleSettings();
          }
          return index;
        }
        if (matTab.textLabel === "systemsettings" && tabName === "systemsettings") {
          if (!this.selectedWorkspaceIdForSystemSettings) {
            this.GetCustomizedDashboardIdForSystemSettings();
          }
          return index;
        }
        if (matTab.textLabel === "assetssettings" && tabName === "assetssettings") {
          if (!this.selectedWorkspaceIdForAssetsSettings) {
            this.GetCustomizedDashboardIdForAssetsSettings();
          }
          return index;
        }
        if (matTab.textLabel === "auditssettings" && tabName === "auditssettings") {
          if (!this.selectedWorkspaceIdForAuditSettings) {
            this.GetCustomizedDashboardIdForAuditSettings();
          }
          return index;
        }
        if (matTab.textLabel === "rostersettings" && tabName === "rostersettings") {
          if (!this.selectedWorkspaceIdForRosterSettings) {
            this.GetCustomizedDashboardIdForRosterSettings();
          }
          return index;
        }
        if (matTab.textLabel === "statusreports" && tabName === "statusreports") {
          if (!this.selectedWorkspaceIdForStatusReports) {
            this.GetCustomizedDashboardIdForStatusReports();
          }
          return index;
        }
        if (matTab.textLabel === "appbuilder" && tabName === "appbuilder") {
          if (!this.selectedWorkspaceIdForAppBuilder) {
            this.GetCustomizedDashboardIdForAppBuilder();
          }
          return index;
        }
        if (matTab.textLabel === "rolesettings" && tabName === "rolesettings") {
          return index;
        }
        if (matTab.textLabel === "expensesettings" && tabName === "expensesettings") {
          if (!this.selectedWorkspaceIdForExpenseSettings) {
            this.GetCustomizedDashboardIdForExpenseSettings();
          }
          return index;
        }
        if (matTab.textLabel === "invoicesettings" && tabName === "invoicesettings") {
          if (!this.selectedWorkspaceIdForInvoiceSettings) {
            this.GetCustomizedDashboardIdForInvoiceSettings();
          }
          return index;
        }
        index++;
      }
      return index;
    }
  }



  GetCustomizedDashboardIdForSystemSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "SystemSettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForSystemSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  GetCustomizedDashboardIdForHrSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "hrSettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForHRSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  GetCustomizedDashboardIdForTimeSheetSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "timesheetsettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForTimeSheetSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForprojectSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "projectsettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForprojecttSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForpayroleSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "payrolesettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForPayrollSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  GetCustomizedDashboardIdForLeaveSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "leavesettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForLeaveSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForAssetsSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "assetssettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForAssetsSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForAuditSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "auditssettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForAuditSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForRosterSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "rostersettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForRosterSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForStatusReports() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "StatusReports";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForStatusReports = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForAppBuilder() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "AppBuilder";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForAppBuilder = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForExpenseSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "expensesettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForExpenseSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForInvoiceSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "invoicesettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForInvoiceSettings = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  selectedMatTab(event) {
    if (event.tab.textLabel === "projectsettings") {
      if (!this.selectedWorkspaceIdForprojecttSettings) {
        this.GetCustomizedDashboardIdForprojectSettings();
      }
    }
    if (event.tab.textLabel === "timesheetsettings") {
      if (!this.selectedWorkspaceIdForTimeSheetSettings) {
        this.GetCustomizedDashboardIdForTimeSheetSettings();
      }
    }
    if (event.tab.textLabel === "hrsettings") {
      if (!this.selectedWorkspaceIdForHRSettings) {
        this.GetCustomizedDashboardIdForHrSettings();
      }
    }
    if (event.tab.textLabel === "leavesettings") {
      if (!this.selectedWorkspaceIdForLeaveSettings) {
        this.GetCustomizedDashboardIdForLeaveSettings();
      }
    }
    if (event.tab.textLabel === "payrollsettings") {
      if (!this.selectedWorkspaceIdForPayrollSettings) {
        this.GetCustomizedDashboardIdForpayroleSettings();
      }
    }
    if (event.tab.textLabel === "systemsettings") {
      if (!this.selectedWorkspaceIdForSystemSettings) {
        this.GetCustomizedDashboardIdForSystemSettings();
      }
    }
    if (event.tab.textLabel === "assetssettings") {
      if (!this.selectedWorkspaceIdForAssetsSettings) {
        this.GetCustomizedDashboardIdForAssetsSettings();
      }
    }
    if (event.tab.textLabel === "auditssettings") {
      if (!this.selectedWorkspaceIdForAuditSettings) {
        this.GetCustomizedDashboardIdForAuditSettings();
      }
    }
    if (event.tab.textLabel === "rostersettings") {
      if (!this.selectedWorkspaceIdForRosterSettings) {
        this.GetCustomizedDashboardIdForRosterSettings();
      }
    }
    if (event.tab.textLabel === "statusreports") {
      if (!this.selectedWorkspaceIdForStatusReports) {
        this.GetCustomizedDashboardIdForStatusReports();
      }
    }
    if (event.tab.textLabel === "appbuilder") {
      if (!this.selectedWorkspaceIdForAppBuilder) {
        this.GetCustomizedDashboardIdForAppBuilder();
      }
    }
    if (event.tab.textLabel === "rolesettings") {
    }
    if (event.tab.textLabel === "expensesettings") {
      if (!this.selectedWorkspaceIdForExpenseSettings) {
        this.GetCustomizedDashboardIdForExpenseSettings();
      }
    }
    if (event.tab.textLabel === "invoicesettings") {
      if (!this.selectedWorkspaceIdForInvoiceSettings) {
        this.GetCustomizedDashboardIdForInvoiceSettings();
      }
    }
    this.route.navigate(['settings/' + event.tab.textLabel]);
  }
}
