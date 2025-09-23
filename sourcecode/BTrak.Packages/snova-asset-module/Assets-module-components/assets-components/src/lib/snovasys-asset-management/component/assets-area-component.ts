import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import "../../globaldependencies/helpers/fontawesome-icons"

import { MatTabGroup } from '@angular/material/tabs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { WidgetService } from '../services/widget.service';
import { DashboardList } from '../models/dashboardList';
import * as introJs from 'intro.js/intro.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-assets-area-component',
    templateUrl: 'assets-area-component.html'
})

export class AssetsAreaComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {

    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    selectedTabLable: string;
    selectedTab: number = 0;
    selectedUserId: string;
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForAssetsReports: string;
    selectedWorkspaceIdForAssetsSettings: string;
    acessAssets:boolean;
    firstTab:string;
    introJS = new introJs();
    isStartEnable: boolean = false;

    ngOnInit() {
        super.ngOnInit();
      // this.GetCustomizedDashboardIdForAssetsReports();
      //this.GetCustomizedDashboardIdForAssetsSettings();
        this.AcessAssets();
        this.checkIntroEnable();
    }

    constructor(
        private widgetService: WidgetService,
        private activatedRoute: ActivatedRoute,
        private route: Router, private cookieService: CookieService, private TranslateService: TranslateService) {
        super();
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }
    ngAfterViewInit(): void {
        super.ngOnInit()
        this.subscribeToRouteChangeAndInitializeTheEntirePage();
        if (this.acessAssets && this.canAccess_feature_ViewListOfAssets) {
          this.introJS.setOptions({
            hidePrev: true,
              steps: [
                  {
                    element: '#assets-1',
                    intro: this.TranslateService.instant('INTROTEXT.ASSETS-1'),
                    position: 'bottom'
                  },
                  {
                    element: '#assets-2',
                    intro: this.TranslateService.instant('INTROTEXT.ASSETS-2'),
                    position: 'bottom'
                  },
                  {
                    element: '#assets-3',
                    intro: this.TranslateService.instant('INTROTEXT.ASSETS-3'),
                    position: 'left'
                  }
              ]
          });
      }
    }
  enableIntro()
  {
    //this.introStart();
    this.introJS.start();
  }
    AcessAssets(){
        if(this.canAccess_feature_AssetsAllocatedToMe || this.canAccess_feature_ViewListOfAssets ||  this.canAccess_feature_AssetHistory || this.canAccess_feature_ViewAssetsReports || this.canAccess_feature_ManageAssetsSettings){
            this.acessAssets=true
        }
        else{
            this.acessAssets=false
        }
    }
    subscribeToRouteChangeAndInitializeTheEntirePage() {
        this.activatedRoute.params.subscribe(params => {
            this.selectedTabLable = params["tab"];
        if (this.selectedTabLable) {
            this.selectedTab = this.getTabIndex(this.selectedTabLable);

        } else {
            this.selectedTabLable = this.firstTabToActivate();
            this.route.navigate(['assetmanagement/' + this.selectedTabLable]);
        }
      });
    }
    firstTabToActivate(): string {
        if(this.canAccess_feature_AssetsAllocatedToMe){
          this.firstTab="myassets"
        }
        else if(this.canAccess_feature_ViewListOfAssets){
          this.firstTab="allassets"
        }
        else if(this.canAccess_feature_AssetHistory){
          this.firstTab="assetshistoty"
        }
        else if(this.canAccess_feature_ViewAssetsReports){
          this.firstTab="assetsreports"
        }
        else if(this.canAccess_feature_ManageAssetsSettings){
          this.firstTab="assetssettings"
        }
       
        return this.firstTab
      }
      
    getTabIndex(tabName: string) {
        if (this.matTabGroup != null && this.matTabGroup != undefined) {
            const matTabs = this.matTabGroup._tabs.toArray();
            let index = 0;
            for (const matTab of matTabs) {
                if (matTab.textLabel === "myassets" && tabName === "myassets") {
                    return index;
                }
                if (matTab.textLabel === "allassets" && tabName === "allassets") {
                    return index;
                }
                if (matTab.textLabel === "assetshistoty" && tabName === "assetshistoty") {
                    return index;
                }
                if (matTab.textLabel === "assetsreports" && tabName === "assetsreports") {
                    return index;
                }
                if (matTab.textLabel === "assetssettings" && tabName === "assetssettings") {
                    return index;
                }

                index++;
            }
            return index;
        }
    }

    selectedMatTab(event) {

      if (event.tab.textLabel === "assetsreports") {
        if (!this.selectedWorkspaceIdForAssetsReports) {
          this.GetCustomizedDashboardIdForAssetsReports();
        }
      }
      if (event.tab.textLabel === "assetssettings") {
        if (!this.selectedWorkspaceIdForAssetsSettings) {
          this.GetCustomizedDashboardIdForAssetsSettings();
        }
      }
        this.route.navigate(['assetmanagement/' + event.tab.textLabel]);
    }


    GetCustomizedDashboardIdForAssetsReports() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "assetsreports";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForAssetsReports = result.data;
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
          }
        });
      }
    /*  introStart() {
        this.isStartEnable = false;
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            preserveQueryParams: true
        }
    
        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            if (this.canAccess_feature_ViewStatusReports) {
                this.route.navigate(["assetmanagement/assetshistoty"], navigationExtras);
            }
        });
    }*/

    checkIntroEnable() {
        let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
        if (intro) {
            intro.forEach(element => {
                if (element.moduleId == '26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') {
                    if (element.enableIntro == 'True') {
                        this.isStartEnable = true;
                    }
                }
            });
        }
    }
}