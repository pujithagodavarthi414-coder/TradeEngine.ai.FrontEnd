import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, AfterViewInit, OnInit }
  from "@angular/core";
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from "ngx-cookie-service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DashboardList } from '../../models/dashboardList';
import { WebAppUsageSearchModel } from '../../models/web-app-usage-search-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-productivity-area-component',
  templateUrl: `productivity-area.component.html`

})

export class productivityAreaComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {

  selectedTabLable: string;
  selectedTab: number = 0;
  isHavingTeam: boolean = false;
  isActive: boolean = false;
  dashboardFilter: DashboardFilterModel;
  selectedWorkspaceIdForMyProductivity: string;
  selectedWorkspaceIdForTeamProductivity: string;
  selectedWorkspaceIdForCompanyProductivity: string;
  selectedWorkspaceIdForColleaguesProductivity: string;
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  myproductivitydashboardName:string;
  companyproductivitydashboardName:string;
  myteamproductivitydashboardName:string;
  colleaguesproductivitydashboardName:string;
  branchProductivitydashboardName: any;
  selectedWorkspaceIdForBranchProductivity: any;
  constructor(
    private route: Router,
    private widgetService: WidgetService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute, private translateService: TranslateService, private cookieService: CookieService,
    private masterDataManagementService: MasterDataManagementService,) {
    super();
    this.myproductivitydashboardName=this.translateService.instant("ADMIN.MYPRODUCTIVITY");
    this.companyproductivitydashboardName=this.translateService.instant("ADMIN.COMPANYPRODUCTIVITY");
    this.myteamproductivitydashboardName=this.translateService.instant("ADMIN.MYTEAMPRODUCTIVITY");
    this.branchProductivitydashboardName=this.translateService.instant("ADMIN.BRANCHPRODUCTIVITY");
    let enableTeamDashBoard = this.cookieService.get(LocalStorageProperties.EnableTeamDashboard)
    if (enableTeamDashBoard == 'true') {
      this.isHavingTeam = true;
    }
    else if (enableTeamDashBoard == 'false') {
      this.isHavingTeam = false;
    }
  }
  ngOnInit() {
    super.ngOnInit();
    // this.getReportingPersonsExistsOrNot()
    // this.GetCustomizedDashboardIdForMyProductivity();
    // this.GetCustomizedDashboardIdMyTeamProductivity();
    // this.GetCustomizedDashboardIdForCompanyProductivity();
    // this.GetCustomizedDashboardIdForBranchProductivity();
    
    
  }
  ngAfterViewInit(): void {
    super.ngOnInit();
    this.subscribeToRouteChangeAndInitializeTheEntirePage();
  }
  subscribeToRouteChangeAndInitializeTheEntirePage() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedTabLable = params["tab"];
    });
    if (this.selectedTabLable) {
      // this.dashboardName = this.getDashboardName(this.selectedTabLable);
      this.selectedTab = this.getTabIndex(this.selectedTabLable);
      
    } else {
      this.selectedTabLable = "myproductivity";
      // this.dashboardName = this.getDashboardName(this.selectedTabLable);
      this.route.navigate(['productivity/dashboard/' + this.selectedTabLable]);
  
    }
  }
  getTabIndex(tabName: string) {
    if (this.matTabGroup != null && this.matTabGroup != undefined) {
      const matTabs = this.matTabGroup._tabs.toArray();
      let index = 0;
      for (const matTab of matTabs) {
        if (matTab.textLabel === "myproductivity" && tabName === "myproductivity") {
          if (!this.selectedWorkspaceIdForMyProductivity) {
            this.GetCustomizedDashboardIdForMyProductivity();
          }
          return index;
        }
        if (matTab.textLabel === "myteamproductivity" && tabName === "myteamproductivity") {
          if (!this.selectedWorkspaceIdForTeamProductivity) {
            this.GetCustomizedDashboardIdMyTeamProductivity();
          }
          return index;
        }
        if (matTab.textLabel === "branchproductivity" && tabName === "branchproductivity") {
          if (!this.selectedWorkspaceIdForColleaguesProductivity) {
            this.GetCustomizedDashboardIdForBranchProductivity();
          }
          return index;
        }
        if (matTab.textLabel === "companyproductivity" && tabName === "companyproductivity") {
          if (!this.selectedWorkspaceIdForCompanyProductivity) {
            this.GetCustomizedDashboardIdForCompanyProductivity();
          }
          return index;
        }
        // if (matTab.textLabel === "colleaguesproductivity" && tabName === "colleaguesproductivity") {
        //   if (!this.selectedWorkspaceIdForColleaguesProductivity) {
        //     this.GetCustomizedDashboardIdForColleaguesProductivity();
        //   }
        //   return index;
        // }       
        index++;
      }
      return index;
    }
  }
  // getDashboardName(Name: string){
  //   var name;
  //   if(Name=="myproductivity"){
  //     name =  this.translateService.instant("ADMIN.MYPRODUCTIVITY");
  //   }
  //   else if(Name=="myteamproductivity"){
  //     name =  this.translateService.instant("ADMIN.MYTEAMPRODUCTIVITY");
  //   }
  //   else if(Name=="companyproductivity"){
  //     name =  this.translateService.instant("ADMIN.COMPANYPRODUCTIVITY");
  //   }
  //   else if(Name=="colleaguesproductivity"){
  //     name =  this.translateService.instant("ADMIN.COLLEAGUESPRODUCTIVITY");
  //   }
  //   return name;
  // }
  selectedMatTab(event) {
    // this.dashboardName= this.dashboardName = this.getDashboardName(this.selectedTabLable);
    this.selectedTabLable = event.tab.textLabel
    if (event.tab.textLabel === "myproductivity") {
      if (!this.selectedWorkspaceIdForMyProductivity) {
        this.GetCustomizedDashboardIdForMyProductivity();
      }
    }
    if (event.tab.textLabel === "myteamproductivity") {
      if (!this.selectedWorkspaceIdForTeamProductivity) {
        this.GetCustomizedDashboardIdMyTeamProductivity();
      }
    }
    if (event.tab.textLabel === "branchproductivity") {
      if (!this.selectedWorkspaceIdForColleaguesProductivity) {
        this.GetCustomizedDashboardIdForBranchProductivity();
      }
    }
    if (event.tab.textLabel === "companyproductivity") {
      if (!this.selectedWorkspaceIdForCompanyProductivity) {
        this.GetCustomizedDashboardIdForCompanyProductivity();
      }
    }

    this.route.navigate(['productivity/dashboard/' + event.tab.textLabel]);
   
  }

  GetCustomizedDashboardIdForMyProductivity() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "myproductivity";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForMyProductivity = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  GetCustomizedDashboardIdMyTeamProductivity() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "myteamproductivity";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForTeamProductivity = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  GetCustomizedDashboardIdForCompanyProductivity() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "companyproductivity";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForCompanyProductivity = result.data;
        this.cdRef.detectChanges();
      }

    });
  }

  GetCustomizedDashboardIdForBranchProductivity() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "BranchProductivity";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceIdForBranchProductivity = result.data;
        this.cdRef.detectChanges();
      }

    });
  }
  // getReportingPersonsExistsOrNot() {
  //   this.masterDataManagementService.getReportingPersonsExistsOrNot().subscribe((responseData: any) => {
  //     this.isHavingTeam= responseData.data;
  //   })
  // }
}