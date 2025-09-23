
import { Component, OnInit, NgModuleRef, ViewContainerRef, Type, ViewChild, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DashboardList } from '../Models/dashboardList';
import { WidgetService } from '../services/widget.service';
import { MatTabGroup } from '@angular/material/tabs';
import { SoftLabelConfigurationModel } from "../../globaldependencies/models/softlabels-models";

@Component({
  selector: 'app-projects-area',
  templateUrl: 'projects-area.component.html'
})

export class ProjectsAreaComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  selectedTab: number = 0;
  selectedTabLable: string;
  selectedUserId: string;
  softLabels: SoftLabelConfigurationModel[];

  changeRoute: boolean = false;
  selectedWorkspaceIdForprojectSettings: string;
  selectedWorkspaceIdForprojectReports: string;
  dashboardFilter: DashboardFilterModel;
  isAuditsEnable: boolean;
  fromAuditMenu: boolean;

  ngOnInit() {
    super.ngOnInit();
    //this.GetCustomizedDashboardIdForprojectSettings();
    //this.GetCustomizedDashboardIdForprojectReports();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }

  constructor(
    private widgetService: WidgetService,
    private activatedRoute: ActivatedRoute,
    public route: Router, private cookieService: CookieService, private cdRef: ChangeDetectorRef) {
    super();
    this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.getCompanySettings();
    this.activatedRoute.fragment
      .subscribe(f => {
        if (f == 'audit') {
          this.fromAuditMenu = true;
        }
      });
  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let auditResult = companySettingsModel.filter(item => item.key.trim() == "EnableAuditManagement");
      if (auditResult.length > 0) {
        this.isAuditsEnable = auditResult[0].value == "1" ? true : false;
        this.cdRef.markForCheck();
      }
    }
  }

  ngAfterViewInit(): void {
    super.ngOnInit()
    this.subscribeToRouteChangeAndInitializeTheEntirePage();
  }
  subscribeToRouteChangeAndInitializeTheEntirePage() {
    this.activatedRoute.params.subscribe(params => {
      if (this.route.url.includes("/audit")) {
        this.fromAuditMenu = true;
      }
      this.selectedTabLable = params["tab"];
    });
    if (this.selectedTabLable) {
      this.selectedTab = this.getTabIndex(this.selectedTabLable);

    } else {
      this.selectedTabLable = "allprojects";
      if (this.fromAuditMenu) {
        this.route.navigate(['projects/area/' + this.selectedTabLable + '/audit']);
      }
      else
        this.route.navigate(['projects/area/' + this.selectedTabLable]);
    }
  }

  getTabIndex(tabName: string) {
    if (this.matTabGroup != null && this.matTabGroup != undefined) {
      const matTabs = this.matTabGroup._tabs.toArray();
      let index = 0;
      for (const matTab of matTabs) {
        if (matTab.textLabel === "allprojects" && tabName === "allprojects") {
          return index;
        }
        if (matTab.textLabel === "allgoals" && tabName === "allgoals") {
          return index;
        }
        if (matTab.textLabel === "projectactivity" && tabName === "projectactivity") {
          return index;
        }
        if (matTab.textLabel === "projectroles" && tabName === "projectroles") {
          return index;
        }
        if (matTab.textLabel === "projectreports" && tabName === "projectreports") {
          if (!this.selectedWorkspaceIdForprojectReports) {
            this.GetCustomizedDashboardIdForprojectReports();
          }
          return index;
        }
        if (matTab.textLabel === "projectsettings" && tabName === "projectsettings") {
          if (!this.selectedWorkspaceIdForprojectSettings) {
            this.GetCustomizedDashboardIdForprojectSettings();
          }
          return index;
        }

        index++;
      }
      return index;
    }
  }

  selectedMatTab(event) {
    if (event.tab.textLabel === "projectsettings") {
      if (!this.selectedWorkspaceIdForprojectSettings) {
        this.GetCustomizedDashboardIdForprojectSettings();
      }
    }
    if (event.tab.textLabel === "projectreports") {
      if (!this.selectedWorkspaceIdForprojectReports) {
        this.GetCustomizedDashboardIdForprojectReports();
      }
    }
    if (this.fromAuditMenu) {
      this.route.navigateByUrl("projects/area/" + event.tab.textLabel + "/audit");
      //this.route.navigate(['projects/area/' + event.tab.textLabel + '/audit']);
    } else
      this.route.navigateByUrl("projects/area/" + event.tab.textLabel);
    //this.route.navigate(['projects/area/' + event.tab.textLabel]);
  }

  GetCustomizedDashboardIdForprojectSettings() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "projectsettings";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForprojectSettings = result.data;
      }
    });
  }
  GetCustomizedDashboardIdForprojectReports() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "projectreports";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForprojectReports = result.data;
      }
    });
  }

}