import {
  Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
  Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
  ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input, ComponentFactoryResolver, Compiler
} from "@angular/core";
import { SprintModel } from "../../models/sprints-model";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import { DragedWidget } from '../../models/dragedWidget';
import { WidgetService } from '../../services/widget.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DashboardList } from '../../Models/dashboardList';
import * as _ from "underscore";
import { AppStoreDialogComponent } from '../dialogs/app-store-dialog.component';
import { ProjectModulesService } from '../../services/project.modules.service';
import { CustomAppsListViewComponent, WidgetsgridsterComponent } from "@snovasys/snova-widget-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-pm-sprints-reports-board",
  templateUrl: "sprints-reports-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsReportsBoardComponent implements OnInit {
  @Input("sprint")
  set _sprint(data: SprintModel) {
    this.sprint = data;
    this.GetCustomizedDashboardId();
  }
  @Output() eventClicked = new EventEmitter<boolean>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getReportsBoard = new EventEmitter<boolean>();
  @Output() getCalenderViewClicked = new EventEmitter<boolean>();
  @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver: SatPopover;
  sprint: SprintModel;
  reloadDashboard: string = null;
  selectedWorkspaceId: string;
  appTagSearchText = "Sprints";
  selectedAppForListView: DragedWidget;
  selectedApps: DragedWidget;
  listView: boolean;
  validationMessage: string;
  dashboardFilter: DashboardFilterModel;
  injector: any;
  dashboard: any;
  loaded: boolean;
  isAnyAppSelected: boolean;

  ngOnInit() {

  }
  constructor(private widgetService: WidgetService, private translateService: TranslateService, private toastr: ToastrService, private cdref: ChangeDetectorRef,
    private snackbar: MatSnackBar, public dialog: MatDialog,
    private compiler: Compiler,
    @Inject('ProjectModuleLoader') public projectModulesService: any,
    private vcr: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private ngModuleRef: NgModuleRef<any>) {
    this.injector = this.vcr.injector;
  }

  GetCustomizedDashboardId() {
    this.dashboardFilter = new DashboardFilterModel();
    this.dashboardFilter.sprintId = this.sprint.sprintId;
    this.dashboardFilter.projectId = this.sprint.projectId;
    this.dashboardFilter.sprintStartdate = this.sprint.sprintStartDate;
    this.dashboardFilter.sprintEndDate = this.sprint.sprintEndDate;
    this.dashboardFilter.date = this.sprint.sprintStartDate;
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "Sprints";
    this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
      if (result.success === true) {
        this.selectedWorkspaceId = result.data;
        this.listView = true;
        this.dashboardFilter.isListView = this.listView;
        this.loadWidgetModule("Custom apps view");
        this.cdref.detectChanges();
      }
    });
  }


  boardChange(event) {
    this.eventClicked.emit(event);
  }

  reportsBoardClicked() {
    this.getReportsBoard.emit(true);
  }

  getDocumentView(event) {
    this.getDocumentStore.emit("");
  }

  getCalenderView(event) {
    this.getCalenderViewClicked.emit(true);
  }


  openAppsSettings(isfromdashboards) {
    const dialogRef = this.dialog.open(AppStoreDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: this.appTagSearchText, isFromSprints: true }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app: any) => {
      this.selectedApps = app;
      this.dashboard.inputs.selectedApps = this.selectedApps;
      this.dashboard.inputs.reloadDashboard = null;
      this.cdref.detectChanges();
    });
    dialogRef.componentInstance.closePopUp.subscribe((app) => {
      this.dialog.closeAll();
    })
  }

  emitAppListView(data) {
    this.listView = data;
    this.selectedApps = null;
    this.selectedAppForListView = null;
    this.reloadDashboard = null;
    this.dashboardFilter.isListView = this.listView;
    if (this.listView) {
      this.loadWidgetModule("Custom apps view");
    } else {
      this.loadWidgetModule("Custom Widget");
    }
  }

  saveAsDefaultPersistance(event) {
    this.widgetService.SetAsDefaultDashboardPersistance(this.selectedWorkspaceId).subscribe((response: any) => {
      if (response.success === true) {
        this.snackbar.open(this.translateService.instant("APP.DASHBOARDPUBLISHEDSUCCESSFULLY"), "Ok", { duration: 3000 });
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.filterthreeDotsPopOver.close();
    });
  }

  resetToDefaultDashboardPersistance(event) {
    this.widgetService.ResetToDefaultDashboardPersistance(this.selectedWorkspaceId).subscribe((response: any) => {
      if (response.success === true) {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
        this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
        this.dashboard.inputs.reloadDashboard = this.reloadDashboard;
        this.dashboard.inputs.selectedApps = null;
        this.cdRef.detectChanges();
      } else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.filterthreeDotsPopOver.close();
    });
  }

  refreshDashboard(event) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
    this.dashboard.inputs.reloadDashboard = this.reloadDashboard;
    this.dashboard.inputs.selectedApps = null;
    this.filterthreeDotsPopOver.close();
  }

  loadWidgetModule(component) {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) {
      var widget = _.find(module.apps, function(app: any) { return app.displayName.toLowerCase() == component.toLowerCase() });
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

        // var componentDetails = allComponentsInModule.find(elementInArray =>
        //   elementInArray.name === "custom component"
        // );
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
          selectedWorkspaceId: this.selectedWorkspaceId,
          selectedApps: this.selectedApps,
          minDate : this.sprint.sprintStartDate,
          dashboardFilters: this.dashboardFilter,
          reloadDashboard: this.reloadDashboard,
          selectedAppForListView: this.selectedAppForListView,
          isFromProjectReports: false,
          isFromSprintReports: false
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

  outputs = {
    appsSelected: app => {
      this.isAnyAppSelected = true;
    }
  }
}