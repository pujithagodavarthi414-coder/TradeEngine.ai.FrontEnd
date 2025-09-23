import {
  Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
  Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
  ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input, ComponentFactoryResolver, Compiler
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, } from "@angular/material/dialog";
import { SatPopover } from "@ncstate/sat-popover";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { DragedWidget } from '../../models/dragedWidget';
import { WidgetService } from '../../services/widget.service';
import { ToastrService } from 'ngx-toastr';
import { DashboardList } from '../../Models/dashboardList';
import * as _ from "underscore";
import { AppStoreDialogComponent } from '../dialogs/app-store-dialog.component';
import { ProjectModulesService } from '../../services/project.modules.service';
import { CustomAppsListViewComponent, WidgetsgridsterComponent } from "@snovasys/snova-widget-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-pm-component-goal-burn-charts",
  templateUrl: "projects-reports.page.template.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsReportsComponent extends CustomAppBaseComponent implements OnInit {
  goal;
  @Input("goal")
  set _goal(data) {
    this.goal = data;
  }
  @Output() eventClicked = new EventEmitter<any>();
  @Output() getGoalCalenderView = new EventEmitter<string>();
  @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
  @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver: SatPopover;
  // @Output() getGoalCalenderView = new EventEmitter<string>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getGoalEmployeeTaskBoard = new EventEmitter<any>();

  selectedAppForListView: any;
  listView: boolean;
  isTheBoardLayoutKanban: boolean;
  showCheckBox: boolean;
  ownerUserList: string;
  isCalenderView = false;
  isReportsPage = true;
  isEmployeeTaskBoardPage: boolean = false;

  reloadDashboard: string = null;
  selectedApps: DragedWidget;
  appTagSearchText = "Goals";
  selectedWorkspaceId: string;
  validationMessage: string;
  dashboardFilter: DashboardFilterModel;
  injector: any;
  dashboard:any;
  loaded:boolean;
  componentName: any;
  isAnyAppSelected: boolean;
  reports:string="reports";



  ngOnInit() {
    super.ngOnInit();
    this.GetCustomizedDashboardId();
  }

  constructor(
    private cdref: ChangeDetectorRef, private widgetService: WidgetService,
    private translateService: TranslateService, private snackbar: MatSnackBar, public dialog: MatDialog,
    private toastr: ToastrService, 
    @Inject('ProjectModuleLoader') public projectModulesService: any, private compiler: Compiler,
    private vcr: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private ngModuleRef: NgModuleRef<any>) {
    super();
    this.injector = this.vcr.injector;
  }

  GetCustomizedDashboardId() {
    this.dashboardFilter = new DashboardFilterModel();
    this.dashboardFilter.goalId = this.goal.goalId;
    this.dashboardFilter.projectId = this.goal.projectId;
    this.dashboardFilter.userId = null;
    this.dashboardFilter.date = this.goal.onboardProcessDate;
    const dashboardModel = new DashboardList();
    dashboardModel.isCustomizedFor = "Goal";
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

  ClickAfterEvent(event) {
    this.eventClicked.emit(event);
  }

  getCalanderView(event) {
    this.getGoalCalenderView.emit("");
  }

  getChartDetails(event) {
    this.getGoalRelatedBurnDownCharts.emit("");
  }

  getDocumentView(event) {
    this.getDocumentStore.emit('');
  }

  getEmployeeTaskBoard(event) {
    this.getGoalEmployeeTaskBoard.emit('');
  }

  // getCalanderView(event){
  //   this.getGoalCalenderView.emit('');
  // }

  filterUserStoriesByAssignee(ownerUserId) {
    this.ownerUserList = ownerUserId;
  }

  openAppsSettings(isfromdashboards) {
    const dialogRef = this.dialog.open(AppStoreDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: this.appTagSearchText, isFromSprints: false }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app:any) => {
      this.selectedApps = app;
      this.selectedAppForListView = app;
      this.dashboard.inputs.reloadDashboard = null;
      this.dashboard.inputs.selectedApps = this.selectedApps;
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
    if(this.listView) {
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
    this.selectedApps = null;
    this.dashboard.inputs.reloadDashboard = this.reloadDashboard; 
    this.dashboard.inputs.selectedApps = null;
    this.filterthreeDotsPopOver.close();
  }

  loadWidgetModule(component) {
    var loader = this.projectModulesService["modules"];
    var modulesList = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modulesList, function(module: any) {
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
        if(!this.listView) {
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
          minDate : this.goal.onboardProcessDate,
          dashboardFilters: this.dashboardFilter,
          reloadDashboard: this.reloadDashboard,
          selectedAppForListView: this.selectedAppForListView,
          isFromProjectReports: false,
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
