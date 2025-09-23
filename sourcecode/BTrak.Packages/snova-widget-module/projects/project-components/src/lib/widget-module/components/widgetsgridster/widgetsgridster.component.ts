import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Inject,
  OnInit,
  ViewChildren,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChild,
  NgModuleFactory,
  NgModuleFactoryLoader,
  NgModuleRef,
  Type,
  OnDestroy,
  ComponentFactoryResolver,
  Compiler,
  ElementRef
} from "@angular/core";
import { Location, DOCUMENT } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridsterConfig } from "angular-gridster2";
import * as _ from "underscore";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { UserModel } from "../../dependencies/models/user";
import { CustomQueryHeadersModel } from "../../dependencies/models/custom-query-headers.model";
import { Guid } from "guid-typescript";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { CustomWidgetsModel } from "../../dependencies/models/custom-widget.model";
import { Dashboard } from "../../dependencies/models/dashboard";
import { DashboardFilterModel } from "../../dependencies/models/dashboardFilterModel";
import { DashboardList } from "../../dependencies/models/dashboardList";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { DashboardModel } from "../../dependencies/models/models";
import { WidgetService } from "../../dependencies/services/widget.service";
import { AppDialogComponent } from "../app-dialog/app-dialog.component";
import { ISubscription } from "rxjs/Subscription";

import { MasterDataManagementService } from "../../dependencies/services/masterdata.management.service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ModulesService } from '../../dependencies/services/modules.service';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
// import { modules } from '../../dependencies/constants/modules';
import { CustomWidgetList } from '../../dependencies/models/customWidgetList';
import { WidgetList } from '../../dependencies/models/widgetlist';
import * as $_ from 'jquery';
const $ = $_;
import * as cloneDeep_ from 'lodash/cloneDeep';
import { CustomHtmlAppDetailsComponent, CustomWidgetTableComponent, ProcessAppComponent } from "@thetradeengineorg1/snova-app-builder-creation-components";
import { modules } from "../../dependencies/constants/modules";
const cloneDeep = cloneDeep_;
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';


@Component({
  selector: "app-widgetsgridster",
  templateUrl: "./widgetsgridster.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WidgetsgridsterComponent extends CustomAppBaseComponent
  implements OnInit, OnDestroy {
  selectedUserId: string;
  num = 5;
  Array = Array;

  @Input("fromAudits")
  set _fromAudits(data: any) {
    if (data != null) {
      this.fromAudits = data;
    }
  }

  @Input("reloadDashboard")
  set _reloadDashboard(data: boolean) {
    if (data != null) {
      this.loadDashboard();
    }
  }


  @Input("fromAppStore")
  set _fromAppStore(data: any) {
    if (data != null) {
      this.fromAppStore = data;
    }
  }

  @Input("fromRoute")
  set _fromRoute(data: boolean) {
    this.fromRoute = data;
  }

  @Input("isListView")
  set _isListView(data: boolean) {
    if (data != null) {
      this.isListView = data;
    }
  }

  isListView: boolean;

  @Input("isFromCustomizedBoard")
  set _isFromCustomizedBoard(data: boolean) {
    if (data != null && data == true) {
      this.allowCustomizations = false;
      this.changeGridsterOptions();
    } else {
      this.allowCustomizations = true;
      this.changeGridsterOptions();
    }
  }

  allowCustomizations: boolean = true;

  @Input("selectedApps")
  set _selectedApps(data: any) {
    if (data) {
      this.loadUser(data, true);
    }
  }

  @Input("reloadwidget")
  set _reloadwidget(data: any) {
    if (data) {
      this.cdRef.detectChanges();
      this.loadUser(data, true);
    }

  }
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

  @Input("filterApplied")
  set _filterApplied(data: any) {
    if (data !== this.filterApplied) {
      this.filterApplied = data;
      this.appFilterApplied();
    }
  }

  @Input("isSinglePage")
  set _setisSinglePage(data: boolean) {
    this.isSinglePage = data;
  }


  @Input("selectedWorkspaceId")
  set _selectedWorkspaceId(data: string) {
    if (data != null && data !== undefined) {
      if (this.workspaceId != data) {
        this.workspaceId = data;
        this.loadUser(null);
      }
    } else {
      this.workspaceId = null;
      this.selectedWidgetsList = [];
      this.changeGridsterOptions();
    }
  }

  @Input("isWidget")
  set _setiswidget(data: boolean) {
    this.isWidget = data;
  }


  @Input("dashboardGlobalData")
  set _dashboardGlobalData(data: any) {
    this.dashboardGlobalData = data;
  }

  @Input("deletedSelectedWidget")
  set _deletedSelectedWidget(data: any) {
    this.deletedSelectedWidget = data;
    if (this.deletedSelectedWidget) {
      this.description.emit({ eventCode: 'UnInstalledApp', appName: this.deletedSelectedWidget.name })
    }
  }

  @Input("isImageConvert")
  set _isImageConvert(data: boolean) {
    this.isImageConvert = data;
  }

  @Output() closePopUp = new EventEmitter<any>();
  @Output() description = new EventEmitter<any>();
  @Output() appInserted = new EventEmitter<boolean>();
  @Output() emitFiles =  new EventEmitter<any>();
  @Output() emitSelectedWidgetsList = new EventEmitter<any>();

  private subscription: ISubscription;
  private subscription1: ISubscription;
  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;
  @ViewChildren("widgetFilterPopup") widgetFilterPopover;
  @ViewChildren("deleteAppPopover") deleteAppPopovers;
  @Output() removeSelectedWidget = new EventEmitter<any>();
  @Output() convertedAllImages = new EventEmitter<any>();
  @ViewChild('gridster') gridsterContainer: ElementRef;
  fromAudits: boolean;
  isScrollVisible: boolean;
  isSinglePage: boolean;
  options: GridsterConfig;
  isImageConvert: boolean;
  dashboardId: string;
  dashboardsList$: Observable<DashboardList[]>;
  DashboardToBeAdded: Dashboard[];
  dashboardArray: any;
  selectedWidgets = [];
  selectedWidgetsList = [];
  firstSelectedWidgetList = [];
  customWidgetInput: any;
  deletedSelectedWidget: any;
  dashboardCollection: any;
  dashboards: DashboardModel[];
  dashboardlist: DashboardList;
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
    yearDate: null,
    auditId: null,
    businessUnitId: null
  };
  fromAppStore: boolean;
  pageLoad = true;
  timeStamp: any;
  workspaceId: string = null;
  widgetPersistanceId: string = null;
  anyOperationInProgress: boolean = false;;
  disableFilterQuery = false;
  isFeedTimeSheet = true;
  canteenButtonEnable = true;
  isAppsInDraft = false;
  filterApplied: string;
  anyOperationInProgress$: any;
  componentCollection: any[];
  validationMessage: string;
  previewGridColumns: CustomQueryHeadersModel[] = [];
  filterQuery: any;
  public ngDestroyed$ = new Subject();
  canAccess_feature_OffersCreditedToUsersSummary: boolean;
  canAccess_feature_FoodItemsList: boolean;
  canAccess_feature_CanteenPurchasesSummary: boolean;
  canAccess_feature_ViewEmployeeCredits: boolean;
  canAccess_feature_RecentIndividualFoodOrders: boolean;
  canAccess_feature_AllFoodOrders: boolean;
  submittedFormId: string = null;
  selectedApp: any;
  disableAppDelete = false;
  id: any;
  customDashboardAppId: string;
  idPrefix: string = 'widget-';

  userData$: Observable<UserModel>;
  selectedEmployeeId = null;
  registeredDateTime: Date;
  userId = "";
  isPermission = false;
  employeeId: string;
  fromRoute: boolean = false;
  completeWidget: boolean;
  widgetId: any;
  name: any;
  isHtml: any;
  customAppVisualizationId: any;
  isCustomWidget: any;
  url: any;
  draget = new DragedWidget();
  isWidget: boolean;
  isCustomAppAddOrEditRequire: boolean = false;
  dashboardGlobalData: any;
  injector: any;
  private ngModuleRef: NgModuleRef<any>;
  optionalParameters: any;

  loading = false;
  loadingTime: number = 0;
  interval;
  filesList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private factoryResolver: ComponentFactoryResolver,
    private toaster: ToastrService,
    private routes: Router,
    private widgetService: WidgetService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private location: Location,
    private router: Router,
    private masterDataManagementService: MasterDataManagementService,
    private ngModuleFactoryLoader: NgModuleFactoryLoader,
    @Inject('ModulesService') public modulesService: any,
    private compiler: Compiler,
    private vcr: ViewContainerRef) {
    super();
    this.loadComponentCollection();
    //   if (this.router.url.includes("profile") && this.router.url.split("/")[3]) {
    //     this.userId = this.router.url.split("/")[3];
    //     this.store.dispatch(new GetUserProfileByIdTriggered(this.userId));
    //  }
    // this.userData$ = this.store.pipe(select(dashboardModuleReducers.getUserProfileDetails));
    // this.userData$.subscribe((result) => {
    //   if (result) {
    //     if (result.employeeId != this.selectedEmployeeId) {
    //       this.selectedEmployeeId = result.employeeId;
    //       this.registeredDateTime = result.registeredDateTime;
    //       this.selectedUserId = result.userId;
    //       this.loadComponentCollection();
    //       this.appFilterApplied();
    //     }
    //   }
    // });

    this.changeGridsterOptions();
    this.route.params.subscribe((params) => {
      if (params["formid"] !== undefined) {
        this.submittedFormId = params["formid"];
      } else {
        this.submittedFormId = null;
      }
    });

    // this.subscription = this.widgetService.selectedApp.subscribe(app => {
    //   if (app && app.obj) {
    //     this.loadComponentCollection();
    //     this.changeGridsterOptions();
    //     this.id = app.id;
    //     this.onDrop(app.obj);
    //   }
    // });

    setTimeout(() => {
      if (this.routes.url.includes("dashboard-management/dashboard/")) {
        this.route.params.subscribe((params) => {
          if (params["id"] != null && params["id"] !== undefined && !this.fromAudits) {
            if (this.workspaceId != params["id"]) {
              this.workspaceId = params["id"];
              this.loadUser(null);
            }
          }
        });
      }
    }, 1000)


    if (this.routes.url.includes("dashboard-management/widgets/")) {
      this.subscription1 =
        this.route.paramMap.subscribe(p => {
          if (this.draget.customWidgetId != p.get("id")) {
            var widgetInput = new WidgetList();
            widgetInput.widgetId = p.get("id");
            this.widgetService.GetWidgetsBasedOnUser(widgetInput).subscribe((result: any) => {
              var widget = result.data[0];
              if (widget) {
                this.draget.isHtml = widget.isHtml;
                this.fromRoute = true;
                this.draget.isProc = widget.isProc;
                this.draget.isApi = widget.isApi;
                this.draget.procName = widget.procName;
                this.draget.isCustomWidget = widget.isCustomWidget;
                this.draget.customAppVisualizationId = widget.customAppVisualizationId;
                this.draget.name = widget.widgetName;
                this.draget.isProcess = widget.isProcess;
                this.draget.customWidgetId = p.get("id");
                this.isWidget = false;
                this.loadComponentCollection();
                this.changeGridsterOptions();
                this.onDrop(this.draget);
              }
            });
          }
        });
    }
  }

  ngOnInit() {
    this.injector = this.vcr.injector;
    super.ngOnInit();

    this.loadComponentCollection();
    this.changeGridsterOptions();
    this.getAddOrEditCustomAppIsRequired();

    // for fitcontnet method to set dynamic height for the element
    this.optionalParameters = {
      gridsterView: false, gridsterViewSelector: '',
      popupView: false, popupViewSelector: '',
      individualPageView: false, individualPageSelector: ''
    };

    if (this.isWidget) {
      this.optionalParameters.gridsterView = true;
    }
    else if (!this.isWidget && !this.router.url.includes('dashboard-management/widgets') && $('mat-dialog-container').length > 0) {

      if (this.routes.url.includes("dashboard-management/dashboard/") && $('mat-dialog-container app-store custom-apps-listview').length > 0) {
        this.optionalParameters.isAppStoreCustomViewFromDashboard = true;
      }

      this.optionalParameters.popupView = true;
      this.optionalParameters.popupViewSelector = 'mat-dialog-container';
    }
    // if (!this.isWidget && $('mat-dialog-container').length == 0) {
    else {

      if (this.router.url.includes('app-store/widgets')) {
        this.optionalParameters.isAppStoreUrl = true;
      }

      this.optionalParameters.individualPageView = true;
      this.optionalParameters.individualPageSelector = '.widget-gridster.individual-app';
    }
  }

  ngAfterViewInit() {

  }

  loadUser(data, isListView = false) {
    if (data == null && !isListView) {
      this.loading = true;
      this.loadingTime = 0;
      this.startTimer();
    }
    if (this.router.url.includes("profile") && this.router.url.split("/")[3]) {
      this.userId = this.router.url.split("/")[3];
    }
    else if (this.dashboardFilters && this.dashboardFilters.userId !== undefined && this.dashboardFilters.userId !== ""
      && this.dashboardFilters.userId !== null) {
      this.userId = this.dashboardFilters.userId;
    } else {
      this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }

    if (this.userId.toLowerCase() === this.cookieService.get(LocalStorageProperties.CurrentUserId).toLowerCase()) {
      this.isPermission = true;
    }

    var user = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if ((user != null || user != undefined) && this.userId.toLowerCase() == user.id.toLowerCase()) {
      this.selectedEmployeeId = user.employeeId;
      this.registeredDateTime = user.registeredDateTime;
      this.selectedUserId = user.id;
      this.loadComponentCollection();
      // this.appFilterApplied();
      if (!this.isListView && !isListView) {
        this.loadDashboard();
      } else if (isListView) {
        this.loading = false;
        clearInterval(this.interval);
        this.onDrop(data);
      }
      else {
        this.loading = false;
        clearInterval(this.interval);
      }
    } else {
      this.masterDataManagementService.getUserById(this.userId).subscribe((result: any) => {
        if (result.success = true) {
          if (result.data != undefined && result.data.employeeId != this.selectedEmployeeId) {
            this.selectedEmployeeId = result.data.employeeId;
            this.registeredDateTime = result.data.registeredDateTime;
            this.selectedUserId = result.data.userId;
            this.loadComponentCollection();
            // this.appFilterApplied();
          }
          this.loading = false;
          clearInterval(this.interval);

        }
        if (!this.isListView && !isListView) {
          this.loadDashboard();
        } else if (isListView) {
          this.loading = false;
          clearInterval(this.interval);
          this.onDrop(data);
        }
      });
    }



    // if(user == null || user == undefined || user.employeeId != this.selectedEmployeeId) { 
    // this.masterDataManagementService.getUserById(this.userId).subscribe((result: any)=> {
    //   if (result.success = true) {
    //     if (result.data.employeeId != this.selectedEmployeeId) {
    //       this.selectedEmployeeId = result.data.employeeId;
    //       this.registeredDateTime = result.data.registeredDateTime;
    //       this.selectedUserId = result.data.userId;
    //       this.loadComponentCollection();
    //       this.appFilterApplied();
    //     }
    //   }
    //   if (!this.isListView) {
    //     this.loadDashboard();
    //   }
    //  });
    // } else {
    //     this.loadComponentCollection();
    //     this.appFilterApplied();
    //     if (!this.isListView) {
    //       this.loadDashboard();
    //     }
    // }
  }

  getAddOrEditCustomAppIsRequired() {
    // this.masterDataManagementService.getAddOrEditCustomAppIsRequired().subscribe((response: any) => {
    //   if (response.success === true) {
    //     this.isCustomAppAddOrEditRequire = response.data;
    //   } else {
    //     this.validationMessage = response.apiResponseMessages[0].message;
    //   }
    // });
    this.isCustomAppAddOrEditRequire = this.cookieService.get(LocalStorageProperties.AddOrEditCustomAppIsRequired) == 'true';
  }

  loadComponentCollection() {

  }

  changeGridsterOptions() {
    this.options = {
      gridType: "verticalFixed",
      enableEmptyCellDrop: false,
      pushItems: this.allowCustomizations,
      fixedRowHeight: 30,
      pushResizeItems: this.allowCustomizations,
      disablePushOnDrag: this.allowCustomizations,
      disablePushOnResize: false,
      swap: this.allowCustomizations,
      margin: 10,
      outerMargin: false,
      pushDirections: { north: this.allowCustomizations, east: this.allowCustomizations, south: this.allowCustomizations, west: this.allowCustomizations },
      resizable: { enabled: this.allowCustomizations },
      itemChangeCallback: this.itemChange.bind(this),
      draggable: {
        enabled: this.allowCustomizations,
        ignoreContent: this.allowCustomizations,
        dropOverItems: this.allowCustomizations,
        dragHandleClass: "drag-handler",
        ignoreContentClass: "no-drag"
      },
      displayGrid: "onDrag&Resize",
      minCols: 50,
      minRows: 30,
      maxCols: 50,
      maxRows: 500
    };
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }

  loadDashboard() {
    // this.isWidget = true;
    this.pageLoad = true;
    this.anyOperationInProgress = true;
    this.selectedWidgetsList = [];
    this.dashboardCollection = [];
    this.changeGridsterOptions();
    this.dashboardlist = new DashboardList();
    this.dashboardlist.workspaceId = this.workspaceId;
    this.dashboardlist.isArchived = false;
    this.widgetService
      .GetDashboardList(this.dashboardlist)
      .subscribe((response: any) => {
        this.loading = false;
        if (response.success === true) {

          if (response.data != null) {
            let dashboards = response.data;
            let filteredList = _.filter(dashboards, function (rec) {
              return (rec.name == 'Daily Positions & P n L Reporting') || (rec.name == 'Contract level dashboard')
            });
            if (filteredList.length > 0) {
              this.isScrollVisible = false;
            } else {
              this.isScrollVisible = true;
            }

            if (!this.isListView) {
              this.parseOnDrag(response.data);
              this.changeGridsterOptions();
            }
          } else {
            this.selectedWidgetsList = [];
            this.changeGridsterOptions();
          }
        } else {
          this.validationMessage = response.apiResponseMessages[0].message;
          this.toaster.error(this.validationMessage);
        }
        clearInterval(this.interval);

        this.anyOperationInProgress = false;
        this.pageLoad = false;
        this.cdRef.detectChanges();
      });
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }

  parseOnDrag(data) {
    this.anyOperationInProgress = true;
    this.loadComponentCollection();
    data.sort(function (a, b) {
      var n = a.y - b.y;
      if (n != 0) {
        return n;
      }
      return a.x - b.x;
    });

    this.dashboardCollection = data;

    this.isAppsInDraft = false;
    this.dashboardCollection.forEach((dashboard, index) => {
      if (dashboard.isDraft == true) {
        this.isAppsInDraft = true;
      }
      dashboard.load = false;
      if (!this.fromRoute) {
        this.selectedWidgetsList.push(dashboard);
      }
    });
    this.emitSelectedWidgetsList.emit(this.selectedWidgetsList);
    this.appInserted.emit(this.isAppsInDraft);
    this.cdRef.detectChanges();

    setTimeout(() => { this.loadWidgets(); }, 100);
    window.addEventListener('scroll', () => this.loadWidgets(), true)

    this.cdRef.markForCheck();
    setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 250);

  }


  appFilterApplied() {
    this.selectedWidgetsList.forEach((dashboard, index) => {
      if (dashboard.isCustomWidget === true
        || dashboard.isHtml === true
        || dashboard.isProcess === true
      ) {
        this.isWidget ?
          dashboard.inputs = {
            widgetData: {
              isFromListView: this.isListView,
              filterQuery: null,
              customWidgetQuery: null,
              persistanceId: dashboard.dashboardId,
              isUserLevel: true,
              emptyWidget: null,
              customWidgetId: dashboard.customWidgetId,
              xCoOrdinate: null,
              yCoOrdinate: null,
              isFromGridster: true,
              visualizationType: dashboard.visualizationType,
              dashboardId: dashboard.dashboardId,
              workspaceId: this.workspaceId,
              customAppVisualizationId: dashboard.customAppVisualizationId,
              showVisualization: true,
              dashboardName: dashboard.dashboardName,
              submittedFormId: this.submittedFormId,
              filterApplied: this.filterApplied,
              dashboardFilters: this.dashboardFilters,
              isProc: dashboard.isProc,
              isApi: dashboard.isApi,
              procName: dashboard.procName,
              isMongoQuery: dashboard.isMongoQuery,
              collectionName: dashboard.collectionName,
              pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
              persistanceJson: dashboard.persistanceJson,
              isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
              isEditable: dashboard.isEditable,
              isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false
            },
            dashboardGlobalData: this.dashboardGlobalData
          } :
          dashboard.inputs = {
            widgetData: {
              isFromListView: this.isListView,
              filterQuery: null,
              customWidgetQuery: null,
              persistanceId: dashboard.dashboardId,
              isUserLevel: true,
              emptyWidget: null,
              customWidgetId: dashboard.customWidgetId,
              xCoOrdinate: null,
              yCoOrdinate: null,
              isFromGridster: true,
              visualizationType: dashboard.visualizationType,
              dashboardId: dashboard.dashboardId,
              workspaceId: this.workspaceId,
              customAppVisualizationId: dashboard.customAppVisualizationId,
              showVisualization: true,
              dashboardName: dashboard.dashboardName,
              submittedFormId: this.submittedFormId,
              filterApplied: this.filterApplied,
              dashboardFilters: this.dashboardFilters,
              isProc: dashboard.isProc,
              isApi: dashboard.isApi,
              procName: dashboard.procName,
              isMongoQuery: dashboard.isMongoQuery,
              collectionName: dashboard.collectionName,
              pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
              persistanceJson: dashboard.persistanceJson,
              isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
              isEditable: dashboard.isEditable,
              isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false
            },
            fromSearchBar: true,
            dashboardGlobalData: this.dashboardGlobalData
          };
        this.cdRef.detectChanges();
      } else {
        dashboard.inputs = {};
        dashboard.inputs.dashboardFilters = this.dashboardFilters;
        dashboard.inputs.dashboardId = dashboard.dashboardId;
        dashboard.inputs.dashboardName = dashboard.dashboardName ? dashboard.dashboardName : dashboard.name;
        dashboard.inputs.userId = this.selectedUserId;
        dashboard.inputs.isPermission = this.isPermission;
        dashboard.inputs.selectedEmployeeId = this.selectedEmployeeId;
        dashboard.inputs.isFeedTimeSheet = this.isFeedTimeSheet;
        dashboard.inputs.employeeId = this.selectedEmployeeId;
        dashboard.inputs.joiningDate = this.registeredDateTime;
        dashboard.inputs.buttonView = this.canteenButtonEnable;
        dashboard.inputs.isPendingExpenses = dashboard.name.toLowerCase() == "pending expenses" ? true : false;
        dashboard.inputs.isApprovedExpenses = dashboard.name.toLowerCase() == "approved expenses" ? true : false;
        if (dashboard.name.toLowerCase() == "actions assigned to me" || dashboard.name.toLowerCase() == "audits" || dashboard.name.toLowerCase() == "conducts" || dashboard.name.toLowerCase() == "audit reports") {
          dashboard.inputs.notFromAudits = false;
          dashboard.inputs.notFromAuditActions = false;
        }
        dashboard.inputs.fromRoute = this.fromRoute;
        this.cdRef.detectChanges();
      }
      //   if (dashboard.isCustomWidget === true) {
      //     var cFactory: any = this.resolver.resolveComponentFactory(CustomWidgetTableComponent);
      //     dashboard.component = cFactory.factory;
      //     dashboard.inputs = {
      //       widgetData: {
      //         filterQuery: null,
      //         customWidgetQuery: null,
      //         persistanceId: dashboard.dashboardId,
      //         isUserLevel: true,
      //         emptyWidget: null,
      //         customWidgetId: dashboard.customWidgetId,
      //         xCoOrdinate: null,
      //         yCoOrdinate: null,
      //         isFromGridster: true,
      //         visualizationType: dashboard.visualizationType,
      //         dashboardId: dashboard.dashboardId,
      //         workspaceId: this.workspaceId,
      //         customAppVisualizationId: dashboard.customAppVisualizationId,
      //         submittedFormId: this.submittedFormId,
      //         showVisualization: true,
      //         dashboardName: dashboard.dashboardName,
      //         filterApplied: this.filterApplied,
      //         dashboardFilters: this.dashboardFilters,
      //         isProc: dashboard.isProc,
      //         isApi: dashboard.isApi,
      //         procName: dashboard.procName,
      //         pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
      //         persistanceJson: dashboard.persistanceJson,
      //         isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
      //         isEditable: dashboard.isEditable
      //       },
      //       dashboardGlobalData: this.dashboardGlobalData
      //     }
      //   } else if (dashboard.isHtml == true) {
      //     var cFactory: any = this.resolver.resolveComponentFactory(CustomHtmlAppDetailsComponent);
      //     dashboard.component = cFactory.factory;
      //     dashboard.inputs = {
      //       widgetData: {
      //         customWidgetId: dashboard.customWidgetId,
      //         customDashboardAppId: dashboard.dashboardId
      //       }
      //     };
      //     this.customDashboardAppId = null;
      //     this.cdRef.markForCheck();
      //   } else if (dashboard.isProcess == true) {
      //     var cFactory: any = this.resolver.resolveComponentFactory(ProcessAppComponent);
      //     dashboard.component = cFactory.factory;
      //     dashboard.inputs = {
      //       applicationId: dashboard.customWidgetId,
      //       dashboardId: dashboard.dashboardId,
      //       dashboardName: dashboard.dashboardName,
      //       isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false
      //     }
      //   }
      //   else {
      //     var component = _.find(this.componentCollection, function (item) { return item.name.toLowerCase() == dashboard.name.toLowerCase() });
      //     if (component) {
      //       var cFactory: any = this.resolver.resolveComponentFactory(component.componentInstance);
      //       dashboard.component = cFactory.factory;
      //       dashboard.inputs = {};
      //       if (
      //         dashboard.name.toLowerCase() === "forms" ||
      //         dashboard.name.toLowerCase() === "all work items" ||
      //         dashboard.name.toLowerCase() === "work item type" ||
      //         dashboard.name.toLowerCase() === "form details" ||
      //         dashboard.name.toLowerCase() === "forms" ||
      //         dashboard.name.toLowerCase() === "form history" ||
      //         dashboard.name.toLowerCase() === "observation types" ||
      //         dashboard.name.toLowerCase() === "documents" ||
      //         dashboard.name.toLowerCase() === "comments app" ||
      //         dashboard.name.toLowerCase() === "custom fields" ||
      //         dashboard.name.toLowerCase() === "form submissions" ||
      //         dashboard.name.toLowerCase() === "form observations" ||
      //         dashboard.name.toLowerCase() === "esi monthly statement") {
      //         dashboard.inputs = {
      //           dashboardId: dashboard.dashboardId,
      //           dashboardName: dashboard.dashboardName,
      //           dashboardFilters: this.dashboardFilters
      //         };
      //       } else {
      //         dashboard.inputs = component.inputs;
      //         dashboard.inputs.dashboardGlobalData = this.dashboardGlobalData;
      //       }
      //     }
      //     else {
      //       var module = this.moduleservice.moduleJson.find(element => {
      //         return element.apps.find(item => item.displayName == dashboard.name);
      //       });
      //       let allModules = this.moduleservice.moduleJson.reduce((prev, next) => prev.concat(next.apps), []);
      //       let comp = allModules.find(obj => obj.displayName.toLowerCase() == dashboard.name.toLowerCase());
      //       //  var comp = _.find(this.moduleservice.moduleJson[0].apps, function(item:any) 
      //       //   { 
      //       //     return item.displayName == dashboard.name
      //       //   })
      //       this.moduleservice.loadModuleSystemJS(module, comp).then(data => {

      //         //const factories = Array.from(this.resolver['_factories'].keys());
      //         dashboard.component = data;
      //         dashboard.inputs = {};
      //         dashboard.inputs.dashboardFilters = this.dashboardFilters;
      //         dashboard.inputs.dashboardId = dashboard.dashboardId;
      //         dashboard.inputs.dashboardName = dashboard.name;
      //         dashboard.inputs.userId = this.selectedUserId;
      //         dashboard.inputs.isPermission = this.isPermission;
      //         dashboard.inputs.selectedEmployeeId = this.selectedEmployeeId;
      //         dashboard.inputs.isFeedTimeSheet = this.isFeedTimeSheet;
      //         dashboard.inputs.employeeId = this.selectedEmployeeId;
      //         dashboard.inputs.joiningDate = this.registeredDateTime;
      //         dashboard.inputs.buttonView = this.canteenButtonEnable;

      //         this.selectedWidgetsList.push(this.dashboardCollection[index]);
      //         this.cdRef.detectChanges();
      //       })
      //     }

      //   }
    });
  }

  itemChange(event) {
    if (this.pageLoad === false) {
      this.dashboardlist = new DashboardList();
      this.dashboardlist.workspaceId = this.workspaceId;
      this.dashboardlist.dashboard = this.selectedWidgetsList;
      var elementIdToRefresh;
      this.widgetService
        .updateDashboard(this.dashboardlist)
        .subscribe((response: any) => {
          if (response.success === true) {
            this.selectedWidgetsList.forEach((dashboard, index) => {
              var id = `#${this.idPrefix}${index}`;
              if (event.dashboardId == dashboard.dashboardId) {
                elementIdToRefresh = id;
              }
              this.setKendoHeight(id, this.isWidget);
              this.optionalParameters.gridsterViewSelector = id;
              try {
                dashboard.component.componentType.prototype.fitContent(cloneDeep(this.optionalParameters));
              } catch (err) {
                console.log(err);
              }
            });
            this.parallelLoad(event, elementIdToRefresh);
            // this.parseOnDrag(this.selectedWidgetsList);
            // this.changeGridsterOptions();
          }
          this.anyOperationInProgress = false;
        });
    }
  }

  InsertDasboard(dashboard) {
    this.DashboardToBeAdded = [];
    dashboard.yCoOrdinate = dashboard.yCoOrdinate;
    dashboard.CustomAppVisualizationId = dashboard.CustomAppVisualizationId;
    this.DashboardToBeAdded.push(dashboard);
    this.dashboardlist = new DashboardList();
    this.dashboardlist.workspaceId = this.id ? this.id : this.workspaceId;
    this.dashboardlist.dashboard = this.DashboardToBeAdded;
    this.widgetService
      .InsertDashboard(this.dashboardlist)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.customDashboardAppId = response.data;
          this.toaster.success(
            "",
            this.translateService.instant("APP.APPADDEDSUCCESSFULLY")
          );
          this.isAppsInDraft = true;
          this.appInserted.emit(this.isAppsInDraft);
          var insertedApp = [dashboard];
          this.parseOnDrag(insertedApp);
          this.changeGridsterOptions();
        }
        this.anyOperationInProgress = false;
      });
    //this.subscription.unsubscribe();
  }

  onDrop(app) {
    this.anyOperationInProgress = true;
    const componentType = app;
    if (!componentType.isCustomWidget && !componentType.isHtml && !componentType.isProcess) {
      const dashboard = {
        cols: 15,
        rows: 10,
        minItemCols: 5,
        minItemRows: 5,
        isDraft: 1,
        x: 0,
        y: 0,
        name: this.fromAppStore ? app.widgetName : app.name,
        dashboardName: app.dashboardName,
        // component: comp['componentName'],
        isCustomWidget: false,
        customWidgetId: this.fromAppStore ? app.widgetId : app.customWidgetId,
        dashboardId: this.isListView ? app.dashboardId : this.fromRoute ? null : Guid.create().toString()
      };
      !this.isWidget
        ? ((this.selectedWidgetsList = []),
          this.selectedWidgetsList.push(dashboard))
        : null;
      !this.isWidget
        ? (this.parseOnDrag(this.selectedWidgetsList),
          this.changeGridsterOptions()
          //(this.anyOperationInProgress = false)
        )
        : this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    } else if (componentType.isCustomWidget) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = this.fromAppStore ? componentType.widgetId : componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 4,
        isDraft: 1,
        x: 0,
        y: 0,
        name: this.fromAppStore ? componentType.widgetName : componentType.dashboardName ? componentType.dashboardName : componentType.name,
        dashboardName: componentType.dashboardName,
        // component: CustomWidgetTableComponent,
        isCustomWidget: true,
        customWidgetId: this.fromAppStore ? componentType.widgetId : componentType.customWidgetId,
        visualizationType: componentType.visualizationType,
        isFromGridster: true,
        customAppVisualizationId: componentType.customAppVisualizationId,
        dashboardId: this.isListView ? (app.dashboardId ? app.dashboardId : this.fromAppStore ? componentType.widgetId : componentType.customWidgetId) : Guid.create().toString(),
        isProc: componentType.isProc,
        isApi: componentType.isApi,
        procName: componentType.procName,
        isEditable: componentType.isEditable,
        isMongoQuery: componentType.isMongoQuery,
        collectionName: componentType.collectionName,
      };
      !this.isWidget
        ? ((this.selectedWidgetsList = []),
          this.selectedWidgetsList.push(dashboard))
        : null;
      !this.isWidget
        ? (this.parseOnDrag(this.selectedWidgetsList),
          this.changeGridsterOptions()
          //(this.anyOperationInProgress = false)
        )
        : this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    } else if (componentType.isHtml) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = this.fromAppStore ? componentType.widgetId : componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 4,
        isDraft: 1,
        x: 0,
        y: 0,
        name: this.fromAppStore ? componentType.widgetName : componentType.dashboardName ? componentType.dashboardName : componentType.name,
        dashboardName: componentType.dashboardName,
        // component: CustomHtmlAppDetailsComponent,
        customWidgetId: this.fromAppStore ? componentType.widgetId : componentType.customWidgetId,
        dashboardId: this.isListView ? app.dashboardId : Guid.create().toString(),
        isHtml: componentType.isHtml
      };
      !this.isWidget
        ? ((this.selectedWidgetsList = []),
          this.selectedWidgetsList.push(dashboard))
        : null;
      !this.isWidget
        ? (this.parseOnDrag(this.selectedWidgetsList),
          this.changeGridsterOptions()
          //(this.anyOperationInProgress = false)
        )
        : this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    } else if (componentType.isProcess) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = this.fromAppStore ? componentType.widgetId : componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 4,
        isDraft: 1,
        x: 0,
        y: 0,
        name: this.fromAppStore ? componentType.widgetName : componentType.name,
        // component: ProcessAppComponent,
        customWidgetId: this.fromAppStore ? componentType.widgetId : componentType.customWidgetId,
        dashboardId: this.isListView ? app.dashboardId : Guid.create().toString(),
        isProcess: componentType.isProcess,
        dashboardName: componentType.name,
        extraVariableJson: '{ "isEntryApp" : ' + componentType.isEntryApp + ' }'
      };
      !this.isWidget
        ? ((this.selectedWidgetsList = []),
          this.selectedWidgetsList.push(dashboard))
        : null;
      !this.isWidget
        ? (this.parseOnDrag(this.selectedWidgetsList),
          this.changeGridsterOptions()
          //(this.anyOperationInProgress = false)
        )
        : this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    }

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }

  removeItem($event, item) {
    this.disableAppDelete = true;
    this.anyOperationInProgress = true;
    $event.preventDefault();
    $event.stopPropagation();
    this.selectedWidgetsList[
      this.selectedWidgetsList.indexOf(item)
    ].isArchived = true;
    this.dashboardlist = new DashboardList();
    this.dashboardlist.workspaceId = this.workspaceId;
    this.dashboardlist.dashboard = this.selectedWidgetsList;
    this.widgetService
      .updateDashboard(this.dashboardlist)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.selectedWidgetsList.splice(
            this.selectedWidgetsList.indexOf(item),
            1
          );
          if (this.isSinglePage) {
            this.removeSelectedWidget.emit(item);
          }
          this.description.emit({ eventCode: 'UnInstalledApp', appName: item.name })
          this.emitSelectedWidgetsList.emit(this.selectedWidgetsList);
          // this.parseOnDrag(this.selectedWidgetsList);
          this.cdRef.detectChanges();
        }
        this.anyOperationInProgress = false;
        this.disableAppDelete = false;
      });
  }

  openDeleteAppPopover(deleteAppPopover, app) {
    this.disableAppDelete = false;
    this.selectedApp = app;
    deleteAppPopover.openPopover();
  }

  closeDeleteAppPopover() {
    this.selectedApp = null;
    this.deleteAppPopovers.forEach(p => p.closePopover());
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
    this.ngDestroyed$.complete();
    window.removeEventListener('scroll', () => this.loadWidgets(), true);
    //this.subscription.unsubscribe();
    // this.subscription1.unsubscribe();
  }

  openSettings(isfromdashboards) {
    const dialogRef = this.dialog.open(AppDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: null, isfromdashboards }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe(app => {
      this.onDrop(app);
    });
  }

  // outputs = {
  //   closePopUp: close => {
  //     if (close) {
  //       this.closePopUp.emit(true);
  //     }
  //   }
  // }

  closeAppPopUp(close) {
    this.closePopUp.emit(close);
  }

  setKendoHeight(elementId, isWidget) {
    var individualApp = false;
    var delay = 1000;
    if (elementId == '#widget-0' && !isWidget) {
      if (this.router.url.includes('dashboard-management/widgets') || $('mat-dialog-container .widget-gridster.individual-app').length == 0) {
        elementId = '.widget-gridster.individual-app';
      } else {
        elementId = 'mat-dialog-container';
        /**
         * Delay changed to 100 for popup view is due to an issue of scrolling down
         * the app before the data is populated
        */
        delay = 100;
      }

      individualApp = true;
    }
    setTimeout(() => {
      var loops = 0;
      var interval = setInterval(() => {

        /**
         * This gridster-noset is used for those widgets in which these styles not be added
         * If these styles not need for any of the widget just add the class(gridster-noset) to the top of that component html
        */
        if ($(elementId + ' .gridster-noset').length > 0) {
          clearInterval(interval);
          return;
        }

        /**
         * This loop should not run more than 30 times
        */
        if (loops > 30) {
          clearInterval(interval);
        }
        loops++;

        /**
         * For kendo grid
        */
        if ($(elementId + ' .k-grid-content').length > 0) {
          /**
           * 1. If() --> First condition is for widgets in dashboards
           * 2. else if() --> Second condition is for the widget opened in a popup via app store
           * 3. else --> Third else is for individual page
          */
          if (!individualApp) { // Dashboard Widgets

            var windowHeight = $(window).height();
            var gridContentOffsetHeight = $(elementId + ' .k-grid-content').offset().top;
            var gridPagerOffsetBottom = windowHeight - ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').offset().top : 0);
            $(elementId + ' .k-grid-content').css('height', '');

            // gridPagerOffsetBottom = windowHeight - $(elementId).offset().top - $(elementId).height() +
            //   ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').outerHeight() : 0) + 18;

            gridPagerOffsetBottom = windowHeight - $(elementId).offset().top - $(elementId).height() +
              ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').outerHeight() : 0);

            $(elementId + ' .k-grid-content').height(windowHeight - gridContentOffsetHeight - gridPagerOffsetBottom);
            //$(elementId + ' .k-grid-content').addClass('widget-scroll');

          } else if (elementId == 'mat-dialog-container') { // mat-dialog

            var windowHeight = $(window).height();
            var gridContentOffsetHeight = $(elementId + ' .k-grid-content').offset().top;
            var gridPagerOffsetBottom = windowHeight - ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').offset().top : 0);
            $(elementId + ' .k-grid-content').css('height', '');

            $(elementId + ' .k-grid-content').height((windowHeight * 0.9) - gridContentOffsetHeight - 24 -
              ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').outerHeight() : 0));

            $(elementId + ' .k-grid-content').attr('id', 'style-1');

          } else { // individual page

            var windowHeight = $(window).height();
            var gridContentOffsetHeight = $(elementId + ' .k-grid-content').offset().top;
            var gridPagerOffsetBottom = windowHeight - ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').offset().top : 0);
            $(elementId + ' .k-grid-content').css('height', '');

            $(elementId + ' .k-grid-content').height(windowHeight - gridContentOffsetHeight -
              ($(elementId + ' kendo-pager').length > 0 ? $(elementId + ' kendo-pager').outerHeight() : 0) - 5);

            $(elementId + ' .k-grid-content').attr('id', 'style-1');

          }

          $(elementId + ' .k-grid-content').addClass('widget-scroll');

          clearInterval(interval);
        }

        /**
         * For ngx-datatable
        */
        if ($(elementId + ' datatable-body').length > 0) {
          /**
           * 1. If() --> First condition is for widgets in dashboards
           * 2. else if() --> Second condition is for the widget opened in a popup via app store
           * 3. else --> Third else is for individual page
          */
          if (!individualApp) { // Dashboard Widgets

            var parentElementOffsetTop = $(elementId).offset().top;
            var parentElementHeight = $(elementId).height();
            var dtFooterHeight = $(elementId + ' datatable-footer').height();
            //dtFooterHeight = dtFooterHeight < 0 ? 50 : dtFooterHeight;
            dtFooterHeight = dtFooterHeight < 35 ? 35 : dtFooterHeight;
            var windowHeight = $(window).height();
            var dtContentOffsetHeight = $(elementId + ' datatable-body').offset().top;
            //var footerTop = parentElementOffsetTop + parentElementHeight - dtFooterHeight - 20;
            var footerTop = parentElementOffsetTop + parentElementHeight - dtFooterHeight;
            var dtPagerOffsetBottom = windowHeight - footerTop;

            $(elementId + ' datatable-body').css('height', '');
            $(elementId + ' datatable-body').css("cssText", `height: ${windowHeight - dtContentOffsetHeight - dtPagerOffsetBottom}px !important;`);
            // $(elementId + ' datatable-footer').offset({ top: footerTop });
            setTimeout(function () {
              $(elementId + ' datatable-body').addClass('widget-scroll');
            }, 1400);

          } else if (elementId == 'mat-dialog-container') { // mat-dialog
            var numberOfLoops = 0;
            var heightIntervalSet = setInterval(() => {
              if (numberOfLoops > 100) {
                clearInterval(heightIntervalSet);
              }
              numberOfLoops++;
              if ($(elementId + ' datatable-body').height() > 10) {
                try {
                  var parentElementOffsetTop = $(elementId).offset().top;
                  var parentElementHeight = $(elementId).height();
                  var dtFooterHeight = $(elementId + ' datatable-footer').height();
                  var windowHeight = $(window).height();
                  var dtContentOffsetHeight = $(elementId + ' datatable-body').offset().top;
                  var footerTop = parentElementOffsetTop + parentElementHeight - dtFooterHeight - 20;
                  var dtPagerOffsetBottom = windowHeight - footerTop;
                  $(elementId + ' datatable-body').css('height', '');
                  if ((windowHeight - dtContentOffsetHeight - dtPagerOffsetBottom) > 200) {
                    $(elementId + ' datatable-body').css("cssText", `height: ${windowHeight - dtContentOffsetHeight - dtPagerOffsetBottom}px !important;`);
                  }
                  $(elementId + ' datatable-body').attr('id', 'style-1');
                  clearInterval(heightIntervalSet);
                } catch (err) {
                  console.error(err);
                  clearInterval(heightIntervalSet);
                }
              }
            }, 100);
          } else { // individual page

            var parentElementOffsetTop = $(elementId).offset().top;
            var parentElementHeight = $(elementId).height();
            var dtFooterHeight = $(elementId + ' datatable-footer').height();
            dtFooterHeight = dtFooterHeight < 0 ? 35 : dtFooterHeight;
            var windowHeight = $(window).height();
            var dtContentOffsetHeight = $(elementId + ' datatable-body').offset().top;
            var footerTop = parentElementOffsetTop + parentElementHeight - dtFooterHeight - 20;
            var dtPagerOffsetBottom = windowHeight - footerTop;

            $(elementId + ' datatable-body').css("cssText", `height: ${windowHeight - dtContentOffsetHeight - dtFooterHeight - 5}px !important;`);
            $(elementId + ' datatable-body').attr('id', 'style-1');
          }
          clearInterval(interval);
        }
      }, 500);
    }, delay)
  }

  loadWidgets() {
    this.dashboardCollection.forEach((dashboard, index) => {
      var windowHeight = $(window).height();
      var id = `#${this.idPrefix}${index}`;
      var load = false;
      $(id).each(function () {
        var thisPos = $(this).offset().top;

        var topOfWindow = $(window).scrollTop();
        if (topOfWindow + windowHeight - 50 > thisPos) {
          load = true;
        }
      });

      if (!load || (dashboard.load == true)) {
        return;
      }
      dashboard.load = true;

      this.parallelLoad(dashboard, id);
    });

    this.cdRef.markForCheck();
  }

  parallelLoad(dashboard, id) {
    var loader = this.modulesService["modules"];
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);
    if (dashboard.isCustomWidget === true
      || dashboard.isHtml === true
      || dashboard.isProcess === true
    ) {

      var module = _.find(modules, function (module: any) { return module.modulePackageName == 'AppBuilderPacakgeModule' });

      let componentDetails;

      // if (dashboard.isCustomWidget === true) {
      //   componentDetails = CustomWidgetTableComponent;
      // } else if (dashboard.isHtml === true) {
      //   componentDetails = CustomHtmlAppDetailsComponent;
      // } else if (dashboard.isProcess === true) {
      //   componentDetails = ProcessAppComponent;
      // }

      // const factory = this.factoryResolver.resolveComponentFactory(componentDetails);

      // dashboard.component = factory;
      // this.isWidget ?
      //   dashboard.inputs = {
      //     widgetData: {
      //       isFromListView: this.isListView,
      //       filterQuery: null,
      //       customWidgetQuery: null,
      //       persistanceId: dashboard.dashboardId,
      //       isUserLevel: true,
      //       emptyWidget: null,
      //       customWidgetId: dashboard.customWidgetId,
      //       xCoOrdinate: null,
      //       yCoOrdinate: null,
      //       isFromGridster: true,
      //       visualizationType: dashboard.visualizationType,
      //       dashboardId: dashboard.dashboardId,
      //       workspaceId: this.workspaceId,
      //       customAppVisualizationId: dashboard.customAppVisualizationId,
      //       showVisualization: true,
      //       dashboardName: dashboard.dashboardName,
      //       submittedFormId: this.submittedFormId,
      //       filterApplied: this.filterApplied,
      //       dashboardFilters: this.dashboardFilters,
      //       isProc: dashboard.isProc,
      //       isApi: dashboard.isApi,
      //       procName: dashboard.procName,
      //       pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
      //       persistanceJson: dashboard.persistanceJson,
      //       isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
      //       isEditable: dashboard.isEditable,
      //       isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false
      //     },
      //     dashboardGlobalData: this.dashboardGlobalData
      //   } :
      //   dashboard.inputs = {
      //     widgetData: {
      //       isFromListView: this.isListView,
      //       filterQuery: null,
      //       customWidgetQuery: null,
      //       persistanceId: dashboard.dashboardId,
      //       isUserLevel: true,
      //       emptyWidget: null,
      //       customWidgetId: dashboard.customWidgetId,
      //       xCoOrdinate: null,
      //       yCoOrdinate: null,
      //       isFromGridster: true,
      //       visualizationType: dashboard.visualizationType,
      //       dashboardId: dashboard.dashboardId,
      //       workspaceId: this.workspaceId,
      //       customAppVisualizationId: dashboard.customAppVisualizationId,
      //       showVisualization: true,
      //       dashboardName: dashboard.dashboardName,
      //       submittedFormId: this.submittedFormId,
      //       filterApplied: this.filterApplied,
      //       dashboardFilters: this.dashboardFilters,
      //       isProc: dashboard.isProc,
      //       isApi: dashboard.isApi,
      //       procName: dashboard.procName,
      //       pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
      //       persistanceJson: dashboard.persistanceJson,
      //       isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
      //       isEditable: dashboard.isEditable,
      //       isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false
      //     },
      //     fromSearchBar: true,
      //     dashboardGlobalData: this.dashboardGlobalData
      //   };

      // if (this.selectedWidgetsList.length == 0 || _.filter(this.selectedWidgetsList, function (widget) { return widget.dashboardId == dashboard.dashboardId }).length == 0 || !dashboard.dashboardId) {
      //   this.selectedWidgetsList.push(dashboard);
      // }
      // this.anyOperationInProgress = false;
      // this.cdRef.detectChanges();

      // // dynamic height setting code
      // this.setKendoHeight(id, this.isWidget);
      // if (this.optionalParameters.gridsterView) {
      //   this.optionalParameters.gridsterViewSelector = id;
      // }
      // try {
      //   dashboard.component.componentType.prototype.fitContent(cloneDeep(this.optionalParameters));
      // } catch (err) {
      //   console.log(err);
      // }
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

          let componentDetails;

          if (dashboard.isCustomWidget === true) {
            componentDetails = allComponentsInModule.find(elementInArray =>
              elementInArray.name.toLowerCase() === "custom component"
            );
          } else if (dashboard.isHtml === true) {
            componentDetails = allComponentsInModule.find(elementInArray =>
              elementInArray.name.toLowerCase() === "html component"
            );
          } else if (dashboard.isProcess === true) {
            componentDetails = allComponentsInModule.find(elementInArray =>
              elementInArray.name.toLowerCase() === "process component"
            );
          }

          const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);

          dashboard.component = factory;
          this.isWidget ?
            dashboard.inputs = {
              widgetData: {
                isFromListView: this.isListView,
                filterQuery: null,
                customWidgetQuery: null,
                persistanceId: dashboard.dashboardId,
                isUserLevel: true,
                emptyWidget: null,
                customWidgetId: dashboard.customWidgetId,
                xCoOrdinate: null,
                yCoOrdinate: null,
                isFromGridster: true,
                visualizationType: dashboard.visualizationType,
                dashboardId: dashboard.dashboardId,
                workspaceId: this.workspaceId,
                customAppVisualizationId: dashboard.customAppVisualizationId,
                showVisualization: true,
                dashboardName: dashboard.dashboardName,
                submittedFormId: this.submittedFormId,
                filterApplied: this.filterApplied,
                dashboardFilters: this.dashboardFilters,
                isProc: dashboard.isProc,
                isApi: dashboard.isApi,
                procName: dashboard.procName,
                pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
                persistanceJson: dashboard.persistanceJson,
                isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
                isEditable: dashboard.isEditable,
                isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false,
                isMongoQuery: dashboard.isMongoQuery,
                collectionName: dashboard.collectionName,
              },
              dashboardGlobalData: this.dashboardGlobalData
            } :
            dashboard.inputs = {
              widgetData: {
                isFromListView: this.isListView,
                filterQuery: null,
                customWidgetQuery: null,
                persistanceId: dashboard.dashboardId,
                isUserLevel: true,
                emptyWidget: null,
                customWidgetId: dashboard.customWidgetId,
                xCoOrdinate: null,
                yCoOrdinate: null,
                isFromGridster: true,
                visualizationType: dashboard.visualizationType,
                dashboardId: dashboard.dashboardId,
                workspaceId: this.workspaceId,
                customAppVisualizationId: dashboard.customAppVisualizationId,
                showVisualization: true,
                dashboardName: dashboard.dashboardName,
                submittedFormId: this.submittedFormId,
                filterApplied: this.filterApplied,
                dashboardFilters: this.dashboardFilters,
                isProc: dashboard.isProc,
                isApi: dashboard.isApi,
                procName: dashboard.procName,
                pivotMeasurersToDisplay: dashboard.pivotMeasurersToDisplay ? JSON.parse(dashboard.pivotMeasurersToDisplay) : [],
                persistanceJson: dashboard.persistanceJson,
                isCustomAppAddOrEditRequire: this.isCustomAppAddOrEditRequire,
                isEditable: dashboard.isEditable,
                isEntryApp: dashboard.extraVariableJson ? JSON.parse(dashboard.extraVariableJson).isEntryApp : false,
                isMongoQuery: dashboard.isMongoQuery,
                collectionName: dashboard.collectionName,
              },
              fromSearchBar: true,
              dashboardGlobalData: this.dashboardGlobalData
            };

          if (this.selectedWidgetsList.length == 0 || _.filter(this.selectedWidgetsList, function (widget) { return widget.dashboardId == dashboard.dashboardId }).length == 0 || !dashboard.dashboardId) {
            this.selectedWidgetsList.push(dashboard);
          }
          this.anyOperationInProgress = false;
          this.cdRef.detectChanges();

          // dynamic height setting code
          this.setKendoHeight(id, this.isWidget);
          if (this.optionalParameters.gridsterView) {
            this.optionalParameters.gridsterViewSelector = id;
          }
          try {
            dashboard.component.componentType.prototype.fitContent(cloneDeep(this.optionalParameters));
          } catch (err) {
            console.log(err);
          }
        })
    } else {
      var module = _.find(modules, function (module: any) {
        var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == dashboard.name.toLowerCase() });
        if (widget) {
          return true;
        }
        return false;
      });
      if (module) {
        var componentDetails = module.apps.find(elementInArray =>
          elementInArray.displayName === dashboard.name
        );
        //const factory = this.factoryResolver.resolveComponentFactory(componentDetails.componentName);

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

            var componentDetails = allComponentsInModule.find(elementInArray =>
              elementInArray.name.toLowerCase() === dashboard.name.toLowerCase()
            );

            const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);

            dashboard.component = factory;
            dashboard.inputs = {};
            dashboard.inputs.dashboardFilters = this.dashboardFilters;
            dashboard.inputs.dashboardId = dashboard.dashboardId;
            dashboard.inputs.dashboardName = dashboard.dashboardName ? dashboard.dashboardName : dashboard.name;
            dashboard.inputs.userId = this.selectedUserId;
            dashboard.inputs.isPermission = this.isPermission;
            dashboard.inputs.selectedEmployeeId = this.selectedEmployeeId;
            dashboard.inputs.isFeedTimeSheet = this.isFeedTimeSheet;
            dashboard.inputs.employeeId = this.selectedEmployeeId;
            dashboard.inputs.joiningDate = this.registeredDateTime;
            dashboard.inputs.buttonView = this.canteenButtonEnable;
            dashboard.inputs.isPendingExpenses = dashboard.name.toLowerCase() == "pending expenses" ? true : false;
            dashboard.inputs.isApprovedExpenses = dashboard.name.toLowerCase() == "approved expenses" ? true : false;
            if (dashboard.name.toLowerCase() == "actions assigned to me" || dashboard.name.toLowerCase() == "audits" || dashboard.name.toLowerCase() == "conducts" || dashboard.name.toLowerCase() == "audit reports") {
              dashboard.inputs.notFromAudits = false;
              dashboard.inputs.notFromAuditActions = false;
            }
            dashboard.inputs.fromRoute = this.fromRoute;
            dashboard.inputs.widgetId = dashboard.customWidgetId;
            if (this.selectedWidgetsList.length == 0 || _.filter(this.selectedWidgetsList, function (widget) { return widget.dashboardId == dashboard.dashboardId }).length == 0 || !dashboard.dashboardId) {
              this.selectedWidgetsList.push(dashboard);
            }
            this.anyOperationInProgress = false;
            this.setKendoHeight(id, this.isWidget);

            this.cdRef.detectChanges();

            // dynamic height setting code and it should be at the last
            if (this.optionalParameters.gridsterView) {
              this.optionalParameters.gridsterViewSelector = id;
            }
            try {
              dashboard.component.componentType.prototype.fitContent(cloneDeep(this.optionalParameters));
            } catch (err) {
              console.log(err);
            }
          })
      } else {
        console.error(`No module found for ${dashboard.name.toUpperCase()}`);
      }
    }
  }

  startTimer() {
    this.interval = setInterval(() => {

      if (document.getElementById("loadingTime")) {
        this.loadingTime = this.loadingTime + 1;
        document.getElementById("loadingTime").innerHTML = this.loadingTime.toString();
      }
    }, 1000)
  }



 
  getFileDownload(event) {
    this.emitFiles.emit(event);
  }
}
