import { Component, OnInit, Input, ViewEncapsulation, Inject, ChangeDetectorRef, ViewContainerRef, ViewChild, TemplateRef , NgModuleRef , Compiler, Type, NgModuleFactory } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from "ngx-cookie-service";
import { Subject } from 'rxjs';
import * as _ from "underscore";
import { AppStoreDialogComponent } from '../app-store/app-store-dialog.component';
import { AppBaseComponent } from '../constants/componentbase';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DashboardList } from '../models/dashboardList';
import { DragedWidget } from '../models/dragedWidget';
import { WidgetService } from '../services/widget.service';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: 'app-overview-component',
  templateUrl: './overivew.component.html'
})

export class OverviewComponent extends AppBaseComponent implements OnInit {

  public ngDestroyed$ = new Subject();
  tabisActive = false;
  visibleLabel = true;
  selectedApps: DragedWidget;
  selectedWorkspaceId: string;
  reloadDashboard: string = null;
  dashboardFilter: DashboardFilterModel;
  selectedAppForListView: any;
  listView: boolean = false;
  loaded: boolean;
 
  injector: any;
  dashboard: any;
  isAnyAppSelected: boolean;
  @Input("tabId")
  set _tabId(data: any) {
    if(data) {
      this.selectedWorkspaceId = data;
      this.loadWidgetModule("Custom Widget");
    }
  }

  constructor(private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, @Inject('TradingModuleLoader') public tradingModulesService: any,
  public dialog: MatDialog, private cookieService: CookieService, private compiler: Compiler, private vcr: ViewContainerRef, private ngModuleRef: NgModuleRef<any>, 
  private widgetService: WidgetService) {
    super();
    this.injector = this.vcr.injector;
  }

  ngOnInit() {
    //this.GetCustomizedDashboardId();
  }

  outputs = {
    appsSelected: app => {
      this.isAnyAppSelected = true;
    },
    description: data => {
      // this.upsertQuestionHistory(data);
    }
  }

  openAppsSettings(isfromdashboards) {
    var appTagSearchText = null;
    const dialogRef = this.dialog.open(AppStoreDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: appTagSearchText }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app: any) => {
      this.selectedApps = app;
      this.selectedAppForListView = app;
      this.dashboard.inputs.reloadDashboard = null;
      this.dashboard.inputs.selectedApps = this.selectedApps;
      this.cdRef.detectChanges();
    });
    dialogRef.componentInstance.closePopUp.subscribe((app) => {
      this.dialog.closeAll();
    })
  }

  openAppsView() {
    this.listView = !this.listView;
    this.selectedApps = null;
    this.selectedAppForListView = null;
    this.reloadDashboard = null;
    if (this.listView) {
      this.loadWidgetModule("Custom apps view");
    } else {
      this.loadWidgetModule("Custom Widget");
    }
  }

  loadWidgetModule(component) {
    var loader = this.tradingModulesService["modules"];
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);

    var modules = JSON.parse(localStorage.getItem("Modules"));

    var module = _.find(modules, function (module: any) {
      var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == component.toLowerCase() });
      if (widget) {
        return true;
      }
      return false;
    })
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
      .then((moduleFactory: NgModuleFactory<any>) => {
        const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        let workSpaceId;

        workSpaceId = this.selectedWorkspaceId;
        
        let factory;
        if (!this.listView) {
          factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
        } else {
          factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[1].componentTypeObject);
        }

        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          isWidget: true,
          selectedWorkspaceId: workSpaceId,
          selectedApps: null,
          dashboardFilters: this.dashboardFilter,
          reloadDashboard: this.reloadDashboard,
          selectedAppForListView: this.selectedAppForListView
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

  GetCustomizedDashboardId() {
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "OverviewCustomizedDashboard";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceId = result.data;
        this.selectedApps = null;
        this.reloadDashboard = null;
        this.listView = false;
        this.loadWidgetModule("Custom Widget");
      }
    });
  }
}