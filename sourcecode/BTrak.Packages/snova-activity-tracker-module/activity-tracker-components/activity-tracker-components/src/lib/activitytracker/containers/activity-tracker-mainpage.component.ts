import { AfterViewInit, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, OnInit, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SatPopover } from '@ncstate/sat-popover';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from "underscore";
import { TimeUsageService } from '../services/time-usage.service';
import { DashboardFilterModel } from '../models/dashboard.filter.model';
import { DashboardList } from '../models/dashboard-list.model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { ActivityConfigurationStateModel } from '../models/activity-configuration-state-model';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentModel } from "../models/department-model";
import { CustomAppsListViewComponent } from "@snovasys/snova-widget-module";
import { ActivityTrackerModuleService } from "../services/activitytracker.module.services";


@Component({
    selector: "app-fm-containers-page-activitydashboard",
    templateUrl: "activity-tracker-mainpage.component.html"
})
export class ActivityDashboardPageComponent extends CustomAppBaseComponent implements AfterViewInit, OnInit {

    @ViewChild(MatTabGroup, { static: true }) matTabGroup: MatTabGroup;
    @ViewChild("threeDotMenuPopover", { static: true }) threeDotsPopOver: SatPopover;

    componentLoded = false;
    selectedTab: string;
    selectedTabIndex: number;
    injector: any;
    dashboard: any;
    outputs: any;
    selectedWorkspaceId = null;
    selectedApps = null;
    reloadDashboard = null;
    trackerChange: string = null;
    listView = true;
    inputs: any;
    dynamicComponent: any;
    dynamicComponentLoaded = false;
    isLoading = false;
    tracking = true;
    timeStamp: string;
    id: string;
    enableBasicTracking: boolean = false;
    trackingStateChanged: boolean = false;
    isRecording: boolean = false;
    isTeamMembersTrackerEnabled: boolean = false;
    isActive: boolean = false;
    startIntrojs: boolean = false;
    isStartEnable: boolean = false;
    teamDashboard: boolean = false;
    employeesDropDown: any = [];
    branchesList: any[] = [];
    rolesDropDown: any[] = [];
    departmentList: DepartmentModel[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private activityTrackerService: ActivityTrackerService,
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private toastr: ToastrService,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private cdRef: ChangeDetectorRef,
        private timeUsageService: TimeUsageService,
        private cookieService: CookieService,
        private ngModuleRef: NgModuleRef<any>,
        private compiler:Compiler,
        private activityTrackerModuleService :ActivityTrackerModuleService,) {
       
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.injector = this.vcr.injector;
        this.getEmployees();
        this.getTeamMembers();
        this.getActTrackerRecorder();
        this.getAllEmployees();
        this.getEmployees();
        this.getAllBranches();
        this.getAllRoles();
        this.getdepartments();
        if (this.canAccess_feature_ManageActivityConfig)
            this.getActivityTrackerConfigurationState();
        this.checkIntroEnable();
    }

    ngAfterViewInit(): void {
        super.ngOnInit()
        this.subscribeToRouteChangeAndInitializeTheEntirePage();
    }

    subscribeToRouteChangeAndInitializeTheEntirePage() {
        this.route.params.subscribe((params) => {
            this.selectedTab = params["tab"];
            if (this.selectedTab) {
                if (this.selectedTab == 'configuration' || this.selectedTab == 'modeconfiguration' || this.selectedTab == 'productiveapps' || this.selectedTab == 'usermanagement' || this.selectedTab == 'configurationHistory' || this.selectedTab == 'detailedusage') {
                    this.selectedTabIndex = 0;
                    if (this.selectedTab == 'productiveapps') {
                        this.loadComponent('ActivityTrackerWidgetPackageModule', 'Productivity apps');
                    }
                    else if (this.selectedTab == 'usermanagement') {
                        this.loadComponent('HrmanagmentPackageModule', 'User management');
                    }
                } else {
                    this.selectedTabIndex = this.getTabIndex(this.selectedTab);
                }
            } else {
                this.selectedTab = "summary";
                this.router.navigate([
                    "activitytracker/activitydashboard",
                    this.selectedTab
                ]);
            }
        });
    }

    getTabIndex(tabName: string) {
        if (this.matTabGroup != null && this.matTabGroup != undefined) {
            const matTabs = this.matTabGroup._tabs.toArray();
            let index = 0;
            for (const matTab of matTabs) {
                if (matTab.textLabel === "summary" && tabName === "summary") {
                    return index;
                }
                if (matTab.textLabel === "timesheet" && tabName === "timesheet") {
                    return index;
                }
                if (matTab.textLabel === "screenshots" && tabName === "screenshots") {
                    return index;
                }
                if (matTab.textLabel === "productivity" && tabName === "productivity") {
                    return index;
                }
                if (matTab.textLabel === "detailedusage" && tabName === "detailedusage") {
                    return index;
                }
                if (matTab.textLabel === "timeline" && tabName === "timeline") {
                    return index;
                }
                if (matTab.textLabel === "myDashboard" && tabName === "myDashboard") {
                    return index;
                }
                if (matTab.textLabel === "teamDashboard" && tabName === "teamDashboard") {
                    return index;
                }
                if (matTab.textLabel === "reports" && tabName === "reports") {
                    if (!this.selectedWorkspaceId) {
                        this.GetCustomizedDashboardId();
                    }
                    return index;
                }
                index++;
            }
            return index;
        }
    }

    onTabClick(event: MatTabChangeEvent) {
        this.startIntrojs = false;
        if (event.tab.textLabel.includes("summary")) {
            this.selectedTab = "summary";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("timesheet")) {
            this.selectedTab = "timesheet";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("screenshots")) {
            this.selectedTab = "screenshots";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("productivity")) {
            this.selectedTab = "productivity";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("detailedusage")) {
            this.selectedTab = "detailedusage";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("timeline")) {
            this.selectedTab = "timeline";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("myDashboard")) {
            this.selectedTab = "myDashboard";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("teamDashboard")) {
            this.selectedTab = "teamDashboard";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        } else if (event.tab.textLabel.includes("reports")) {
            this.selectedTab = "reports";
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
            if (!this.selectedWorkspaceId) {
                this.GetCustomizedDashboardId();
            }
        }
    }

    GetCustomizedDashboardId() {
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "activity_tracker";
        this.timeUsageService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
            if (result.success === true) {
                this.selectedWorkspaceId = result.data;
                this.selectedApps = null;
                this.reloadDashboard = null;
                this.listView = true;
                this.dashboard = {};
                this.dashboard.inputs = {
                    isWidget: true,
                    selectedWorkspaceId: this.selectedWorkspaceId,
                    selectedApps: null,
                    dashboardFilters: new DashboardFilterModel(),
                    reloadDashboard: this.reloadDashboard,
                    selectedAppForListView: null,
                    isFromCustomizedBoard: true
                };
                this.loadWidgetModule();
            }
        });
    }

    onMenuOptionSelect(selectedOption: any) {
        this.threeDotsPopOver.close();

        this.selectedTab = selectedOption;

        if (this.selectedTab) {

            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        }

        if (this.selectedTab == 'productiveapps') {
            this.loadComponent('ActivityTrackerWidgetPackageModule', 'Productivity apps');
        }
        else if (this.selectedTab == 'usermanagement') {
            this.loadComponent('HrmanagmentPackageModule', 'User management');
        }
        else if (this.selectedTab == 'detailedusage') {
            this.router.navigate([
                "activitytracker/activitydashboard",
                this.selectedTab
            ]);
        }
    }

    loadWidgetModule() {
        var loader = this.activityTrackerModuleService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function(module){ return module['modulePackageName'] == 'WidgetPackageModule' });
        var component = "Custom apps view"
        var module = _.find(modules, function (module) { return module.modulePackageName == 'WidgetPackageModule' });
        if (!module) {
            console.error("No module found for WidgetPackageModule");
        }
        var path = loader[module.modulePackageName];
        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
            .then(moduleFactory => {
                try {
                    const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    var allComponentsInModule = (<any>componentService).components;

                    this.ngModuleRef = moduleFactory.create(this.injector);

                    var componentDetails = allComponentsInModule.find(elementInArray =>
                        elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
                    );

                     this.dashboard.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.componentLoded = true;
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // var modules = JSON.parse(localStorage.getItem("Modules"));
        // var projectModulePath = _.find(modules, function (module) { return module['modulePackageName'] == 'WidgetPackageModule' });
        // this.ngModuleFactoryLoader
        //     // .load(projectModulePath['moduleLazyLoadingPath'])
        //     // .then((moduleFactory: NgModuleFactory<any>) => {

        //         // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         // var allComponentsInModule = (<any>componentService).components;

        //         // this.ngModuleRef = moduleFactory.create(this.injector);

        //         // var componentDetails = allComponentsInModule.find(elementInArray =>
        //         //     elementInArray.name === "Custom apps view");

        //         this.dashboard.component = this.ngModuleFactoryLoader.resolveComponentFactory(CustomAppsListViewComponent);
        //         this.componentLoded = true;
        //     // });
    }

    loadComponent(packageName, componentName) {

        this.isLoading = true;
        this.dynamicComponentLoaded = false;

        var modules = JSON.parse(localStorage.getItem("Modules"));
        var loader = this.activityTrackerModuleService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function(module){ return module['modulePackageName'] == packageName });
        var component = componentName
        if (!module) {
            console.error("No module found for"+ packageName);
        }
        var path = loader[module.modulePackageName];
        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
            .then(moduleFactory => {
                try {
                    const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    var allComponentsInModule = (<any>componentService).components;

                    this.ngModuleRef = moduleFactory.create(this.injector);

                    var componentDetails = allComponentsInModule.find(elementInArray =>
                        elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
                    );

                     this.dynamicComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                     this.isLoading = false;
                     this.dynamicComponentLoaded = true;
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //     .load(projectModulePath['moduleLazyLoadingPath'])
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray => elementInArray.name === componentName);

                // this.dynamicComponent = this.ngModuleFactoryLoader.resolveComponentFactory(projectModulePath['moduleLazyLoadingPath']);

                // this.isLoading = false;
                // this.dynamicComponentLoaded = true;
            
    }

    activityTracking() {
        this.trackingStateChanged = true;
        this.setEnableBasicTracking();
        if (this.selectedTab != "configuration") {
            this.onMenuOptionSelect('configuration');
        }
        this.cdRef.detectChanges();
    }

    disabletrack(data) {
        this.tracking = data;
        this.trackingStateChanged = false;
        this.enableBasicTracking = false;
        this.cdRef.detectChanges();
    }


    getActivityTrackerConfigurationState() {
        this.activityTrackerService.getActivityTrackerConfigurationState().subscribe((response: any) => {
            if (response.success) {
                var data = response.data;
                this.timeStamp = data.timeStamp;
                this.id = data.id;
                if (data.isScreenshot || data.isBasicTracking || data.isMouse || data.isRecord || data.isTracking) {
                    this.tracking = true;
                    this.cdRef.detectChanges();
                } else {
                    this.tracking = false;
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    setEnableBasicTracking() {
        if (this.tracking == true && this.trackingStateChanged == true) {
            this.enableBasicTracking = true;
        } else {
            this.enableBasicTracking = false;
        }
    }

    getActTrackerRecorder() {
        this.activityTrackerService.getActTrackerRecorder().subscribe((response: any) => {
            if (response.success) {
                this.isRecording = response.data;
            }
        });
    }

    getAllEmployees() {
        let currentUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
        var webAppUsage = new WebAppUsageSearchModel();
        webAppUsage.dateFrom = new Date();
        webAppUsage.dateTo = new Date();
        webAppUsage.isApp = this.isActive;
        this.timeUsageService.getActivityTrackerUserStatus(webAppUsage).subscribe((responseData: any) => {
            var temp = responseData.data;
            if (temp && temp.length > 0) {
                temp.forEach(element => {
                    if (element.status && element.userId != currentUserId) {
                        this.isTeamMembersTrackerEnabled = true;
                    }
                });
            }
        })
    }
    checkIntroEnable() {
        let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
        if (intro) {
            intro.forEach(element => {
                if (element.moduleId == '9c9684ad-e2c2-485c-a66c-b6d388337bd5') {
                    if (element.enableIntro == 'True') {
                        this.isStartEnable = true;
                    }
                }
            });
        }
    }

    showTeamDashboard(event) {
        //this.teamDashboard = event;
    }

    enableIntro() {
        this.startIntrojs = false;
        this.cdRef.detectChanges();
        this.startIntrojs = !this.startIntrojs;
        this.cdRef.detectChanges();
    }
    getTeamMembers() {
        // var teamMemberModel;
        // if (this.canAccess_feature_ViewActivityReportsForAllEmployee) {
        //     teamMemberModel = {
        //         isAllUsers: true
        //     }
        // }
        // else {
        //     teamMemberModel = {
        //         isAllUsers: false
        //     }
        // }
        // teamMemberModel.isArchived = false;
        // this.timeUsageService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
        //     let employeesDropDown = responseData.data;
        //     if (employeesDropDown && employeesDropDown.length > 1) {
        //         this.teamDashboard = true;
        //     }
        //     else {
        //         this.teamDashboard = false;
        //     }
        // })
        let enableTeamDashBoard = this.cookieService.get(LocalStorageProperties.EnableTeamDashboard)
        if (enableTeamDashBoard == 'true') {
            this.teamDashboard = true;
        }
        else if (enableTeamDashBoard == 'false') {
            this.teamDashboard = false;
        }

    }

    getEmployees() {
        var teamMemberModel;
        teamMemberModel = {
            isForTracker: true
        }
        teamMemberModel.isArchived = false;
        this.timeUsageService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
            this.employeesDropDown = responseData.data;
            let enableTeamDashBoard = this.cookieService.get(LocalStorageProperties.EnableTeamDashboard);
            if (enableTeamDashBoard) {
                if (this.employeesDropDown && this.employeesDropDown.length > 1) {
                    this.cookieService.set(LocalStorageProperties.EnableTeamDashboard, 'true', null);
                    this.teamDashboard = true;
                }
                else {
                    this.cookieService.set(LocalStorageProperties.EnableTeamDashboard, 'false', null);
                    this.teamDashboard = false;
                }
            }
        })
    }

    getAllBranches() {
        this.timeUsageService.getBranchesList().subscribe((responseData: any) => {
            this.branchesList = responseData.data;
        })
    }

    getAllRoles() {
        this.timeUsageService.getAllRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
        })
    }

    getdepartments() {
        const departmentModel = new DepartmentModel();
        departmentModel.isArchived = false;
        this.timeUsageService.getdepartment(departmentModel).subscribe((response: any) => {
            if (response.success == true) {
                this.departmentList = response.data;
            }
        });
    }

}
