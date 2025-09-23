import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DashboardList } from '../models/dashboardList';
import { WidgetService } from '../services/widget.service';

@Component({
    selector: 'app-hr-area-component',
    templateUrl: 'hr-area-component.html'
})
export class HrAreaComponent extends CustomAppBaseComponent implements OnInit, AfterViewInit{
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    selectedTab: number = 0;
    dashboardFilter: DashboardFilterModel;
    selectedTabLable:string;
    selectedWorkspaceIdForHrSettings:string;
    selectedWorkspaceIdForLeaveSettings:string;
    selectedWorkspaceIdForPayroleSettings:string;

    constructor(
        private widgetService: WidgetService,
        private activatedRoute: ActivatedRoute,
        public route: Router, private cookieService: CookieService) {
        super();
        // this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }
    ngOnInit() {
        super.ngOnInit();
        this.GetCustomizedDashboardIdForHrSettings();
        this.GetCustomizedDashboardIdForLeaveSettings();
        this.GetCustomizedDashboardIdForPayroleSettings();
       
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
            this.selectedTabLable = "employeelist";
            this.route.navigate(['hrmanagment/' + this.selectedTabLable]);
        }
    }

    getTabIndex(tabName: string) {
      if (this.matTabGroup != null && this.matTabGroup != undefined) {
          const matTabs = this.matTabGroup._tabs.toArray();
          let index = 0;
          for (const matTab of matTabs) {
              if (matTab.textLabel === "employeelist" && tabName === "employeelist") {
                  return index;
              }
              if (matTab.textLabel === "documents" && tabName === "documents") {
                  return index;
              }
              if (matTab.textLabel === "leaves" && tabName === "leaves") {
                  return index;
              }
              if (matTab.textLabel === "payroll" && tabName === "payroll") {
                  return index;
              }
              if (matTab.textLabel === "hrsettings" && tabName === "hrsettings") {
                if (!this.selectedWorkspaceIdForHrSettings) {
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
              if (matTab.textLabel === "payrolesettings" && tabName === "payrolesettings") {
                if (!this.selectedWorkspaceIdForPayroleSettings) {
                  this.GetCustomizedDashboardIdForPayroleSettings();
                }
                  return index;
              }
              index++;
          }
          return index;
      }
  }

   
    selectedMatTab(event) {
        
        this.route.navigate(['hrmanagment/'+ event.tab.textLabel]);
    }

    GetCustomizedDashboardIdForHrSettings() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "hrSettings";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForHrSettings = result.data;
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
          }
        });
      }
    GetCustomizedDashboardIdForPayroleSettings() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "payrolesettings";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForPayroleSettings = result.data;
          }
        });
      }

}