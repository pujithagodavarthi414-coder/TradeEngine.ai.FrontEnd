import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import "../../globaldependencies/helpers/fontawesome-icons"


import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppBaseComponent } from './componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DashboardList } from '../Models/dashboardList';
import { WidgetService } from '../services/widget.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
    selector: 'app-expense-area-component',
    templateUrl: 'expenses-area.component.html'
})

export class ExpenseAreaComponent extends AppBaseComponent implements AfterViewInit, OnInit {

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    selectedTabLable:string;
    selectedTab: number = 0;
    selectedUserId: string;
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForExpenseSettings:string;
    selectedWorkspaceIdForExpenseReports:string;
    canAcessMyExpense:boolean = false;
    canAcessPendingExpense:boolean = false;
    canAcessApprovedExpense:boolean = false;
    canAcessAllExpense:boolean = false;
    canAssetsAccess:boolean = false;
    permissionCount: number = 0;
    ngOnInit() {
        super.ngOnInit();
        this.getPermissionsForMyAssets();
        this.getPermissionsForPendingAssets();
        this.getPermissionsForApprovedAssets();
        this.getPermissionsForAllAssets();
        // this.GetCustomizedDashboardIdForExpenseReports();
        // this.GetCustomizedDashboardIdForExpenseSettings();
    }

    constructor(
        private widgetService: WidgetService,
        private activatedRoute: ActivatedRoute,
        private route: Router, private cookieService: CookieService, private cdRef: ChangeDetectorRef) {
        super();
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
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
            this.selectedTabLable = "myexpenses";
            this.route.navigate(['expenses/expenses-area/' + this.selectedTabLable]);
        }
    }

    getPermissionsForMyAssets() {
      this.widgetService.getExpenseTabsBasedOnUser("My Expenses").subscribe((responseData: any) => {
        this.canAcessMyExpense= responseData.data;
        this.permissionCount = this.permissionCount + 1;
        if(!this.canAssetsAccess && this.canAcessMyExpense){
          this.canAssetsAccess = true;
        }
      })
    }
    getPermissionsForPendingAssets() {
      this.widgetService.getExpenseTabsBasedOnUser("Pending expenses").subscribe((responseData: any) => {
        this.canAcessPendingExpense= responseData.data;
        this.permissionCount = this.permissionCount + 1;
        if(!this.canAssetsAccess && this.canAcessPendingExpense){
          this.canAssetsAccess = true;
        }
      })
    }
    getPermissionsForApprovedAssets() {
      this.widgetService.getExpenseTabsBasedOnUser("Approved expenses").subscribe((responseData: any) => {
        this.canAcessApprovedExpense= responseData.data;
        this.permissionCount = this.permissionCount + 1;
        if(!this.canAssetsAccess && this.canAcessApprovedExpense){
          this.canAssetsAccess = true;
        }
      })
    }
    getPermissionsForAllAssets() {
      this.widgetService.getExpenseTabsBasedOnUser("All Expenses").subscribe((responseData: any) => {
        this.canAcessAllExpense= responseData.data;
        this.permissionCount = this.permissionCount + 1;
        if(!this.canAssetsAccess && this.canAcessAllExpense){
          this.canAssetsAccess = true;
        }
      })
    }


    getTabIndex(tabName: string) {
      if (this.matTabGroup != null && this.matTabGroup != undefined) {
          const matTabs = this.matTabGroup._tabs.toArray();
          let index = 0;
          for (const matTab of matTabs) {
              if (matTab.textLabel === "myexpenses" && tabName === "myexpenses") {
                  return index;
              }
              if (matTab.textLabel === "pendingexpenses" && tabName === "pendingexpenses") {
                  return index;
              }
              if (matTab.textLabel === "approvedexpenses" && tabName === "approvedexpenses") {
                  return index;
              }
              if (matTab.textLabel === "allexpenses" && tabName === "allexpenses") {
                  return index;
              }
              if (matTab.textLabel === "expensesreports" && tabName === "expensesreports") {
                  return index;
              }
              if (matTab.textLabel === "expensesettings" && tabName === "expensesettings") {
                  return index;
              }
             
              // if (matTab.textLabel === "reports" && tabName === "reports") {
              //     // if (!this.selectedWorkspaceId) {
              //     //     this.GetCustomizedDashboardId();
              //     // }
              //     return index;
              // }
              index++;
          }
          return index;
      }
  }

    selectedMatTab(event) {
      if (event.tab.textLabel === "expensesettings") {
        if (!this.selectedWorkspaceIdForExpenseSettings) {
          this.GetCustomizedDashboardIdForExpenseSettings();
        }
      }
      if (event.tab.textLabel === "expensesreports") {
        if (!this.selectedWorkspaceIdForExpenseReports) {
          this.GetCustomizedDashboardIdForExpenseReports();
        }
      }
        this.route.navigate(['expenses/expenses-area/' + event.tab.textLabel]);
    }


    GetCustomizedDashboardIdForExpenseSettings() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "expensesettings";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForExpenseSettings = result.data;
          }
        });
      }
      GetCustomizedDashboardIdForExpenseReports() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "expensereports";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForExpenseReports = result.data;
          }
        });
      }

  getPermission() {
    if (this.permissionCount == 4) {
      this.selectedTab = this.getTabIndex(this.selectedTabLable);
      return true;
    }
    else {
      return false;
    }
  }
}