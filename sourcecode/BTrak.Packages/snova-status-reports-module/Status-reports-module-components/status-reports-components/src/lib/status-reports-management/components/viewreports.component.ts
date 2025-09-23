import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { StatusReporting } from '../models/statusReporting';
import { CookieService } from 'ngx-cookie-service';
import "../../globaldependencies/helpers/fontawesome-icons"
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { MatTabGroup } from '@angular/material/tabs';
import * as introJs from 'intro.js/intro.js';
import { StatusreportService } from '../services/statusreport.service';
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DashboardList } from '../models/dashboardList';
import { WidgetService } from '../services/widget.service';



@Component({
    selector: 'app-dashboard-component-viewreports',
    templateUrl: './viewreports.component.html'
})

export class ViewreportsComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {
    Arr = Array;
    num: number = 8;
    selectedUserId: string;
    pageNumber: number = 1;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [20, 40, 60, 80];

    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    selectedTabLable: string;
    selectedTab: number = 0;
    introJS = new introJs();
    isStartEnable: boolean = false;
    validationMessage: any;
    statusReports: boolean;
    anyOperationInProgress: boolean = false;
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForStatusReports:string;

    @Input('statusReports') set _statusReports(value: any) {
        this.statusReports = value;
        if (this.statusReports) {
            this.pageNumber = 1;
        }
    }

    statusReport: StatusReporting;
    statusReportsDetails: any[] = [];

    ngOnInit() {
        super.ngOnInit();
        this.checkIntroEnable();
    }
   
    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router, private cookieService: CookieService, private toaster: ToastrService, private statusreportService: StatusreportService, private translateService: TranslateService,private widgetService: WidgetService) {
        super();
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }
    ngAfterViewInit(): void {
        super.ngOnInit()
        this.subscribeToRouteChangeAndInitializeTheEntirePage();
        if (this.canAccess_feature_ViewStatusReports) {
            this.introJS.setOptions({
                hidePrev: true,
                steps: [
                    {
                        element: '#sr-1',
                        intro: this.translateService.instant('INTROTEXT.SR-1'),
                        position: 'bottom'
                    },
                    {
                      element: '#sr-3',
                      intro: this.translateService.instant('INTROTEXT.SR-3'),
                      position: 'bottom'
                    }
                   
                ]
            });
        }
    }
    enableIntro()
    {
    //   this.statusreportService.upsertIntroDetails()
    //       .subscribe((responseData: any) => {
    //         if (responseData.success == false) {
    //           this.validationMessage = responseData.apiResponseMessages[0].message;
    //           this.anyOperationInProgress = false;
    //           this.toaster.error(this.validationMessage);
    //         }
    //         else if (responseData.success == true) {
    //           this.isStartEnable = true;
              this.introStart();
        //     }
        //   });
    }
    subscribeToRouteChangeAndInitializeTheEntirePage() {
        this.activatedRoute.params.subscribe(params => {
            this.selectedTabLable = params["tab"];
            if (this.selectedTabLable) {
                this.selectedTab = this.getTabIndex(this.selectedTabLable);

            } else {
                this.selectedTabLable = "reportsassignedtome";
                this.route.navigate(['statusreports/view-reports/' + this.selectedTabLable]);
            }
        });
    }

    getTabIndex(tabName: string) {
        if (this.matTabGroup != null && this.matTabGroup != undefined) {
            const matTabs = this.matTabGroup._tabs.toArray();
            let index = 0;
            for (const matTab of matTabs) {
                if (matTab.textLabel === "reportsassignedtome" && tabName === "reportsassignedtome") {
                    return index;
                }
                if (matTab.textLabel === "submittedreports" && tabName === "submittedreports") {
                    return index;
                }
                if (matTab.textLabel === "statusreportssettings" && tabName === "statusreportssettings") {
                    return index;
                }
                index++;
            }
            return index;
        }
    }


    selectedMatTab(event) {
        if (event.tab.textLabel === "statusreportssettings") {
            if (!this.selectedWorkspaceIdForStatusReports) {
              this.GetCustomizedDashboardIdForStatusReports();
            }
          }
        this.route.navigate(['statusreports/view-reports/' + event.tab.textLabel]);
    }

    navigatetoConfig() {
        this.route.navigate(['statusreports/status-report-configuration']);
    }
    introStart() {
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            //preserveQueryParams: true
        }
    
        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            if (this.canAccess_feature_ViewStatusReports) {
                this.route.navigate(["statusreports/view-reports/submittedreports"], navigationExtras);
            }
        });
    }

    checkIntroEnable() {
        let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
        if (intro) {
            intro.forEach(element => {
                if (element.moduleId == '9b2b922b-ef24-420f-aece-5df01e2ffc7f') {
                    if (element.enableIntro == 'True') {
                        this.isStartEnable = true;
                    }
                }
            });
        }
    }

    GetCustomizedDashboardIdForStatusReports() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "StatusReports";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceIdForStatusReports = result.data;
          }

        });
      }
}