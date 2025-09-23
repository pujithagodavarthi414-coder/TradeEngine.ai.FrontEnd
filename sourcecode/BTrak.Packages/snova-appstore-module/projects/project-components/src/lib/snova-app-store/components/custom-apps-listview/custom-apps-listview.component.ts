import {
  OnInit, Component, Input, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  SimpleChanges,
  NgModuleFactoryLoader,
  ViewContainerRef,
  NgModuleRef,
  Type,
  NgModuleFactory,
  Compiler,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { DashboardList } from "../../dependencies/models/dashboardList";
import { WidgetService } from "../../dependencies/services/widget.service";
import { ToastrService } from "ngx-toastr";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { Guid } from "guid-typescript";
// import { CustomWidgetTableComponent } from "app/views/masterdatamanagement/components/widgetmanagement/custom-widget-table-component";
// import { CustomHtmlAppDetailsComponent } from "app/views/masterdatamanagement/components/widgetmanagement/custom-html-app-details.component";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from 'underscore';
import { DragulaService } from "ng2-dragula";
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardFilterModel } from '../../dependencies/models/models/dashboardFilterModel';
import { CustomWidgetList } from '../../dependencies/models/models/customWidgetList';
import { DashboardOrderModel } from '../../dependencies/models/models/dashboardOrderModel';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softlabels-model';
import { AppStoreModulesService } from "../../dependencies/services/app-store.modules.service";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: "custom-apps-listview",
  templateUrl: "./custom-apps-listview.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAppsListViewComponent extends CustomAppBaseComponent
  implements OnInit {


  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.loadComponentCollection();
      if (this.workspaceId != null && this.workspaceId !== undefined) {
        // this.appFilterApplied();
      }
    }
  }

  @Input() pag: any
  // set _paginate(data: any) {
  //   if(data) {
  //     this.itemsPerPage = data.itemsPerPage;
  //     this.totalItems = data.totalItems;
  //     this.currentPage = data.currentPage;
  //   }
  // }

  @Input("selectedAppsFromAppStore")
  set _selectedAppsFromAppStore(data: any) {
    this.fromAppStore = true;
    this.appStoreApps = data;
    this.orginalWidgets = data;
    this.selectedWidget = this.appStoreApps.length > 0 ? this.appStoreApps[0] : null;
    if (this.selectedWidget) {
      this.loadWidget();
    }
  }

  @Input("fromSearch")
  set _fromSearch(data: any){
    if(data){
      this.fromSearch = data;
    }
  }

  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  appStoreApps: any = [];
  fromAppStore: boolean = false;
  dashboardFilters = {
    projectId: null,
    userId: null,
    goalId: null,
    sprintId: null,
    dateFrom: null,
    dateTo: null,
    date: null,
    entityId: null,
    branchId: null,
    designationId: null,
    roleId: null,
    departmentId: null,
    isFinancialYear: null,
    isActiveEmployeesOnly: null,
    monthDate: null,
    yearDate: null
  };
  searchWidget: string;
  selectedWidgetsList: any = [];
  componentCollection: any[];
  installWidget: boolean = false;
  selectedApp: any;
  workspaceId: any;
  widgets = [];
  orginalWidgets: any = [];
  selectedWidget: any = null;
  anyOperationInProgressForWidgets: boolean;
  anyOperationInProgressForWidget: boolean;
  loadWorkspace: boolean;
  subs = new Subscription();
  reOrderOperationInProgress$: Observable<boolean>;
  reOrderIsInProgress: boolean;
  public ngDestroyed$ = new Subject();
  isTreeviewPinned: boolean = true;
  isFromProjectReports: boolean = true;
  isFromSprintReports: boolean = true;
  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  dashboard: any
  loaded: boolean = false;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  fromSearch: boolean = false;

  constructor(
    @Inject('AppStoreModuleLoader') public appStoreModulesService: any,
    private compiler: Compiler,
    private ngModuleFactoryLoader: NgModuleFactoryLoader,
    private vcr: ViewContainerRef,
    private widgetService: WidgetService,
    private translateService: TranslateService,
    private toaster: ToastrService,
    private cdRef: ChangeDetectorRef,
    private dragulaService: DragulaService,
  ) {
    super();
    this.injector = this.vcr.injector;
    this.loadComponentCollection();
  }

  ngOnInit() { 
    this.getSoftLabelConfigurations();
  }

  ngOnChanges(change: SimpleChanges) {
    this.pag = change.pag.currentValue;
  }

  getSoftLabelConfigurations() {
    this.softLabels = localStorage.getItem('SoftLabels') ? JSON.parse(localStorage.getItem('SoftLabels')) : null;
  }

  // upsertInstalledApp() {

  // }

  selectWidget(widget) {
    this.anyOperationInProgressForWidget = true;
    this.selectedWidget = widget;
    this.anyOperationInProgressForWidget = false;
    this.dashboard.inputs = {
      selectedApps: this.selectedWidget
    }
  }

  loadComponentCollection() {
    //this.componentCollection = componentCollection;
  }

  closeWidgetsSearch() {
    this.searchWidget = "";
    this.searchWidgets();
  }

  selectAppStoreWidget(w) {
    console.log(w);
  }

  searchWidgets() {
    const text = this.searchWidget;
    if (!text) {
      this.appStoreApps = this.orginalWidgets;
    } else {
      this.appStoreApps = [];
      this.orginalWidgets.forEach((item: any) => {
        if (item && item.widgetName.toLowerCase().indexOf(text.toLowerCase().trim()) != -1) {
          this.appStoreApps.push(item);
        }
      });
    }
  }

  pinTreeView() {
    this.isTreeviewPinned = !this.isTreeviewPinned;
  }
  loadWidget() {
    var loader = this.appStoreModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    var module: any = _.find(modules, function (module) {
      var widget = _.find(module['apps'], function (app) { return app['componentName'].toLowerCase() == "widgetsgridstercomponent" });
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

        const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          fromRoute: true,
          fromAppStore: true,
          isListView: true,
          selectedApps: this.selectedWidget
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

}
