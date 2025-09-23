import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, NgModuleFactoryLoader, Inject, ViewContainerRef, NgModuleRef } from "@angular/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { MatDialog } from "@angular/material/dialog";
import {  MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardList } from '../../models/dashboard-list.model';
import { DragedWidget } from '../../models/draged-widget.model';
import { ProfileAppDialogComponent } from './app-dialog.component';
import * as introJs from 'intro.js/intro.js';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { TeamMembersList } from "../../models/teammemberslistmodel";
@Component({
  selector: "app-dashboard-component-hr-record",
  templateUrl: "hr-record.component.html"
})

export class HrRecordComponent extends CustomAppBaseComponent {
  @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver: SatPopover;
  reloadDashboard: string = null;
  selectedApps: DragedWidget;
  appTagSearchText = "Users";
  selectedWorkspaceId: string;
  validationMessage: string;
  dashboardFilter: DashboardFilterModel;
  widget: boolean = true;
  selectedAppForListView: any;
  listView: boolean = true;
  introJS = new introJs();
  multiPage: string = null;
  userId: string = '';
  isHrModuleAccess: boolean = false;
  isCanteenModuleAccess: boolean = false;
  isProjectModuleAccess: boolean = false;
  isAssertModuleAccess: boolean = false;
  isTimeSheetModuleAccess: boolean = false;
  isDocumentModuleAccess: boolean = false;
  teamMembersList: TeamMembersList[]= [];

  constructor(
    public dialog: MatDialog,
    private dashboardService: DashboardService,
    private cdref: ChangeDetectorRef,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private snackbar: MatSnackBar,private router: Router,private route: ActivatedRoute,private cookieService: CookieService
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      if (!this.multiPage) {
          this.multiPage = params['multipage'];
      }
  });
  }

  ngOnInit() {
    super.ngOnInit();
    this.GetCustomizedDashboardId();
    this.getTeamMembers();
  }
  ngAfterViewInit() {
    this.introJS.setOptions({
      steps: [
        {
          element: '#hr-1',
          intro: this.translateService.instant('INTROTEXT.HR-1'),
          position: 'bottom'
        },
        {
          element: '#hr-2',
          intro: this.translateService.instant('INTROTEXT.HR-2'),
          position: 'bottom'
        },
        {
          element: '#hr-3',
          intro: this.translateService.instant('INTROTEXT.HR-3'),
          position: 'bottom'
        },
      ]
    });
  }
  GetCustomizedDashboardId() {
    this.dashboardFilter = new DashboardFilterModel();
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "Profile";
    this.dashboardService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceId = result.data;
        if (this.multiPage == "true") {
          this.introStart();
          this.multiPage = null;
      }
      }
    });
  }

  openAppsSettings(isfromdashboards) {
    const dialogRef = this.dialog.open(ProfileAppDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: this.appTagSearchText }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app:any) => {
      this.selectedApps = app;
      this.selectedAppForListView = app;
      this.cdref.detectChanges();
    });
  }

  saveAsDefaultPersistance() {
    this.dashboardService.SetAsDefaultDashboardPersistance(this.selectedWorkspaceId).subscribe((response: any) => {
      if (response.success === true) {
        this.snackbar.open(this.translateService.instant("APP.DASHBOARDPUBLISHEDSUCCESSFULLY"), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.filterthreeDotsPopOver.close();
    });
  }

  resetToDefaultDashboardPersistance() {
    this.dashboardService.ResetToDefaultDashboardPersistance(this.selectedWorkspaceId).subscribe((response: any) => {
      if (response.success === true) {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.filterthreeDotsPopOver.close();
    });
  }

  refreshDashboard() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
    this.filterthreeDotsPopOver.close();
  }
  public async introStart() {
    await this.delay(2000);
    const navigationExtras: NavigationExtras = {
      queryParams: { multipage: true },
      queryParamsHandling: 'merge',
      //preserveQueryParams: true
    }

    this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
      this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId).toString().toLowerCase();
      let userModules = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModules));
           if (this.isProjectModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3926f534-ede8-4c47-8a44-bfdd2b7f76db') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/user-stories"], navigationExtras);
            }
            else if (this.isCanteenModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('573ec90c-3a0b-4ed8-a744-978f3a16cbe5') && x.isActive).length > 0) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/canteen-purchases"], navigationExtras);
            }
            else if (this.canAccess_feature_ManageInductionWork && (this.isHrModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/induction-work"], navigationExtras);
            }
           else if (this.canAccess_feature_ManageExitWork && (this.isHrModuleAccess = userModules.filter(x =>
              x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                  this.router.navigate(["dashboard/profile/" + this.userId + "/exit-work"], navigationExtras);
          }
            else if (this.canAccess_feature_CanEditOtherEmployeeDetails && (this.isDocumentModuleAccess =userModules.filter(x =>
                x.moduleId.toLowerCase().includes('68b12c14-5489-4f7d-83f9-340730874eb7') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/signature-inviations"], navigationExtras);
            } 
            else if (this.canAccess_feature_AssignAssetsToEmployee && (this.isAssertModuleAccess = userModules.filter(x =>
                x.moduleId.toLowerCase().includes('26b9d4a9-5ac7-47d0-ab1f-0d6aaa9ec904') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/assets"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/timesheet-audit"], navigationExtras);
            }
            else if (this.canAccess_feature_ViewHistoricalTimesheet && (this.isTimeSheetModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('a941d345-4cc8-4cf2-829a-aca177ca30cf') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/view-time-sheet"], navigationExtras);
            }
            else if (this.canAccess_feature_CanAccessPerformance && (this.isHrModuleAccess = userModules.filter(x => 
                x.moduleId.toLowerCase().includes('3ff89b1f-9856-477d-af3c-40cf20d552fc') && x.isActive).length > 0)) {
                    this.router.navigate(["dashboard/profile/" + this.userId + "/performance"], navigationExtras);
            }
    });
  }
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  getTeamMembers(){
    var teamMemberModel;
    if (this.canAccess_feature_ViewActivityReportsForAllEmployee) {
        teamMemberModel = {
            isAllUsers: true
        }
    }
    else {
        teamMemberModel = {
            isAllUsers: false
        }
    }
    teamMemberModel.isArchived = false;
    this.dashboardService.getTeamLeadsList(teamMemberModel).subscribe((response:any) =>{
        if(response.success == true){
            this.teamMembersList = response.data;
            this.cdref.detectChanges();
        }
    })
  }
  
  openMenu(){

  }
}
