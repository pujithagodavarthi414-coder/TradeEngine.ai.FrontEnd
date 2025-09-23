import {
  OnInit, Component, Input, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { DashboardList } from "../../dependencies/models/dashboardList";
import { WidgetService } from "../../dependencies/services/widget.service";
import { ToastrService } from "ngx-toastr";
import { componentCollection } from "../../dependencies/models/componentCollection";
import { DragedWidget } from "../../dependencies/models/dragedWidget";
import { Guid } from "guid-typescript";
// import { CustomWidgetTableComponent } from "app/views/masterdatamanagement/components/widgetmanagement/custom-widget-table-component";
// import { CustomHtmlAppDetailsComponent } from "app/views/masterdatamanagement/components/widgetmanagement/custom-html-app-details.component";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from 'underscore';
import { modules } from '../../dependencies/constants/modules';
import { DragulaService } from "ng2-dragula";
import { Subscription, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardOrderModel } from '../../dependencies/models/dashboardOrderModel';
import { CustomWidgetList } from '../../dependencies/models/customWidgetList';
import { DashboardFilterModel } from '../../dependencies/models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from "../../dependencies/models/softlabels-model";
import { Router } from "@angular/router";

@Component({
  selector: "custom-apps-listview",
  templateUrl: "./custom-apps-listview.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DragulaService],
  styles: [`
.widget-card .hide-icons {
  display:none !important;
  
  }

  .widget-card:hover .hide-icons  {
    display:block !important;
   
  }
  `]
})
export class CustomAppsListViewComponent extends CustomAppBaseComponent
  implements OnInit {
  selectedAppRefresh: any;
  fromProductivity: boolean = false;

  @Input("selectedWorkspaceId")
  set _selectedWorkspaceId(data: string) {
    if (data != null && data !== undefined) {
      this.isSinglePage = true;
      if (data != this.workspaceId) {
        this.workspaceId = data;
        this.getWidgetsByDashboard();
      }
    } else {
      this.workspaceId = null;
      this.isSinglePage = false;
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

  @Input("selectedApps")
  set _selectedApps(data: any) {
    if (data) {
      this.selectedApp = data
      this.workspaceId = this.workspaceId;
      this.onDrop(data);
      //this.widgets.unshift(this.selectedWidget);
      // this.upsertInstalledApp();
    }
  }
  @Input("reloadDashboard")
  set _reloadDashboard(data: string) {
    if (data != null) {
      this.loadDashboard();
    }
  }
  @Input("isFromProjectReports")
  set _isFromProjectReports(data: any) {
    if (data || data == false)
      this.isFromProjectReports = data;
    else
      this.isFromProjectReports = true;
  }

  @Input("isFromSprintReports")
  set _isFromSprintReports(data: any) {
    if (data || data == false)
      this.isFromSprintReports = data;
    else
      this.isFromSprintReports = true;
  }
  
  @Input("isFromCustomizedBoard")
  set _isFromCustomizedBoard(data: boolean) {
    if (data != null && data == true) {
      this.allowCustomizations = false;
    } else {
      this.allowCustomizations = true;
    }
  }

  @Output() appInserted = new EventEmitter<boolean>();
  @Output() dashboardFilterEnable = new EventEmitter<boolean>();
  @ViewChildren("deleteAppPopover") widgetFilterPopover;
  allowCustomizations: boolean = true;
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
  isAppsInDraft: boolean = false;
  selectedApp: any;
  workspaceId: any;
  widgets = [];
  orginalWidgets: any = [];
  selectedWidget: any = null;
  anyOperationInProgressForWidgets: boolean;
  isSinglePage: boolean;
  anyOperationInProgressForWidget: boolean;
  loadWorkspace: boolean;
  subs = new Subscription();
  reOrderOperationInProgress$: Observable<boolean>;
  reOrderIsInProgress: boolean;
  public ngDestroyed$ = new Subject();
  isTreeviewPinned: boolean = true;
  isFromProjectReports: boolean = true;
  isFromSprintReports: boolean = true;
  deleteWidget: any;
  deletedSelectedWidget: any;
  disableAppDelete: boolean;
  dashboardlist: DashboardList;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];

  constructor(
    private widgetService: WidgetService,
    private translateService: TranslateService,
    private toaster: ToastrService,
    private cdRef: ChangeDetectorRef,
    private dragulaService: DragulaService,private router: Router,
  ) {
    super();
    dragulaService.createGroup("widgets", {
      revertOnSpill: true
    });
    if(this.router.url.includes('productivity/dashboard/')){
      this.fromProductivity = true;
      this.isTreeviewPinned = false;
    }
    this.loadComponentCollection();

    this.subs.add(this.dragulaService.drop("widgets").pipe(
      takeUntil(this.ngDestroyed$))
      .subscribe(({ name, el, target, source, sibling }) => {
        var orderedListLength = target.children.length;
        let orderedWidgetList = [];
        for (var i = 0; i < orderedListLength; i++) {
          var tagId = target.children[i].attributes["data-widgetid"].value;
          orderedWidgetList.push(tagId.toLowerCase());
        }
        this.reOrderDashboardWidgets(orderedWidgetList);
      })
    )
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  getWidgetsByDashboard() {
    this.loadWorkspace = true;
    var dashboardlist = new DashboardList();
    dashboardlist.workspaceId = this.workspaceId;
    dashboardlist.isArchived = false;
    this.widgetService
      .GetDashboardList(dashboardlist)
      .subscribe((response: any) => {
        if (response.success === true) {
          if (response.data != null) {
            this.loadWorkspace = false;
            this.widgets = this.orginalWidgets = response.data;
            if (!this.isFromSprintReports && this.widgets && this.widgets.length > 0) {
              let index = this.widgets.findIndex(x => x.name == 'Goal burn down chart');
              if (index != -1) {
                this.widgets[index].name = 'Sprint burn down chart';
              }
            }
            let index = this.widgets.findIndex(x => x.isDraft == true);
            if (index != -1) {
              this.isAppsInDraft = true;
            } else {
              this.isAppsInDraft = false;
            }
            this.appInserted.emit(this.isAppsInDraft);
            this.selectedWidget = this.widgets[0];
            this.cdRef.detectChanges();
          } else {
            this.loadWorkspace = false;
            this.widgets = [];
          }
        } else {
          this.loadWorkspace = false;
          var validationMessage = response.apiResponseMessages[0].message;
          this.toaster.error(validationMessage);
        }
      });
  }

  // upsertInstalledApp() {

  // }

  selectWidget(widget) {
    this.anyOperationInProgressForWidget = true;
    this.selectedWidget = widget;
    this.anyOperationInProgressForWidget = false;
  }

  loadComponentCollection() {
    this.componentCollection = componentCollection;
  }

  closeWidgetsSearch() {
    this.searchWidget = "";
    this.searchWidgets();
  }


  onDrop(app) {
    //this.anyOperationInProgress = true;
    const componentType = app;
    if (!componentType.isCustomWidget && !componentType.isHtml && !componentType.isProcess) {
      // tslint:disable-next-line: prefer-for-of
      //  var component = _.find(this.componentCollection, function (item) { return item.name.toLowerCase() == componentType.name.toLowerCase() });
      //  if (component) {
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 5,
        x: 0,
        y: 0,
        isDraft: 1,
        name: app.name,
        dashboardName: app.dashboardName,
        //component: app.componentInstance,
        isCustomWidget: false,
        customWidgetId: null,
        dashboardId: Guid.create().toString()
      };
      this.selectedWidgetsList = [];
      this.selectedWidgetsList.push(dashboard);
      this.InsertDasboard(dashboard);
      //}   
      this.cdRef.detectChanges();
    } else if (componentType.isCustomWidget) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        isDraft: 1,
        minItemRows: 4,
        x: 0,
        y: 0,
        name: componentType.dashboardName ? componentType.dashboardName : componentType.name,
        dashboardName: componentType.dashboardName,
        // component: CustomWidgetTableComponent,
        isCustomWidget: true,
        customWidgetId: componentType.customWidgetId,
        visualizationType: componentType.visualizationType,
        isFromGridster: true,
        customAppVisualizationId: componentType.customAppVisualizationId,
        dashboardId: Guid.create().toString(),
        isProc: componentType.isProc,
        isApi: componentType.isApi,
        procName: componentType.procName,
        isEditable: componentType.isEditable,
        isMongoQuery : componentType.isMongoQuery,
        collectionName : componentType.collectionName,
      };
      this.selectedWidgetsList = [];
      this.selectedWidgetsList.push(dashboard);
      this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    } else if (componentType.isHtml) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 4,
        isDraft: 1,
        x: 0,
        y: 0,
        name: componentType.dashboardName ? componentType.dashboardName : componentType.name,
        dashboardName: componentType.dashboardName,
        // component: CustomHtmlAppDetailsComponent,
        customWidgetId: componentType.customWidgetId,
        dashboardId: Guid.create().toString(),
        isHtml: componentType.isHtml
      };
      this.selectedWidgetsList = [];
      this.selectedWidgetsList.push(dashboard);
      this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    } else if (componentType.isProcess) {
      const customWidget = new CustomWidgetList();
      customWidget.customWidgetId = componentType.customWidgetId;
      const dashboard = {
        cols: 10,
        rows: 10,
        minItemCols: 5,
        minItemRows: 4,
        isDraft: 1,
        x: 0,
        y: 0,
        name: componentType.name,
        // component: ProcessAppComponent,
        customWidgetId: componentType.customWidgetId,
        dashboardId: Guid.create().toString(),
        isProcess: componentType.isProcess,
        dashboardName: componentType.name,
        extraVariableJson: '{ "isEntryApp" : ' + componentType.isEntryApp + ' }'
      };
      this.selectedWidgetsList = [];
      this.selectedWidgetsList.push(dashboard);
      this.InsertDasboard(dashboard);
      this.cdRef.detectChanges();
    }

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }

  InsertDasboard(dashboard) {
    dashboard.yCoOrdinate = dashboard.yCoOrdinate;
    dashboard.CustomAppVisualizationId = dashboard.CustomAppVisualizationId;
    var DashboardToBeAdded = [];
    DashboardToBeAdded.push(dashboard);
    var dashboardlist = new DashboardList();
    dashboardlist.workspaceId = this.workspaceId;
    dashboardlist.dashboard = DashboardToBeAdded;
    this.widgetService
      .InsertDashboard(dashboardlist)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.selectedWidget = dashboard;
          var insertedApp = dashboard;
          this.orginalWidgets.unshift(insertedApp);
          this.widgets = this.orginalWidgets;
          this.isAppsInDraft = true;
          this.appInserted.emit(this.isAppsInDraft);
          this.cdRef.markForCheck();
          this.cdRef.detectChanges();
          this.toaster.success(
            "",
            this.translateService.instant("APP.APPADDEDSUCCESSFULLY")
          );
          //this.parseOnDrag(this.selectedWidgetsList);
          //this.changeGridsterOptions();
        }
        //this.anyOperationInProgress = false;
      });
    //this.subscription.unsubscribe();
  }

  searchWidgets() {
    const text = this.searchWidget;
    if (!text) {
      this.widgets = this.orginalWidgets;
    } else {
      this.widgets = [];
      this.orginalWidgets.forEach((item: any) => {
        if (item && item.name.toLowerCase().indexOf(text.toLowerCase().trim()) != -1) {
          this.widgets.push(item);
        }
      });
    }
  }

  pinTreeView() {
     this.isTreeviewPinned = !this.isTreeviewPinned;
      //  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
      // this.reloadDashboard = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
      this.selectedAppRefresh = Object.assign({},this.selectedWidget);
      //if(this.router.url.includes('productivity/dashboard/') && this.isTreeviewPinned){
        this.dashboardFilterEnable.emit(this.isTreeviewPinned);
      //}
      this.cdRef.detectChanges();
  }
  


  reOrderDashboardWidgets(dashboardLists) {
    this.anyOperationInProgressForWidgets = true;
    var dashboardList = new DashboardOrderModel();
    dashboardList.workspaceId = this.workspaceId;
    dashboardList.dashboardIds = dashboardLists;
    this.widgetService.setDashboardCustomOrder(dashboardList)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.getWidgetsByDashboard();
        } else {
          this.anyOperationInProgressForWidgets = false;
          var validationMessage = response.apiResponseMessages[0].message;
          this.toaster.error(validationMessage);
        }
      });
    this.anyOperationInProgressForWidgets = false;
  }

  removeSelectedWidget(event) {
    let widgetsList = this.widgets;
    let customWidgetId = event.name;
    var removedCustomWidgetDetails = widgetsList.filter((function (widget) {
      if (widget.dashboardName) {
        return (widget.dashboardName.toLowerCase() == customWidgetId.toLowerCase())
      } else {
        return (widget.name.toLowerCase() == customWidgetId.toLowerCase())
      }
    }))
    if (removedCustomWidgetDetails.length > 0) {
      const index = this.widgets.indexOf(removedCustomWidgetDetails[0]);
      if (index > -1) {
        this.widgets.splice(index, 1);
      }
    }

    this.selectedWidget = this.widgets[0];
    this.deletedSelectedWidget = event;
  }

  openDeletePopUp(popOver, widget) {
    this.deleteWidget = widget;
    popOver.openPopover();
  }

  closeDeleteAppPopover() {
    this.deleteWidget = null;
    this.widgetFilterPopover.forEach(p => p.closePopover());
  }

  removeItem() {
    let deleteWidget = this.deleteWidget;
    this.disableAppDelete = true;
    this.deleteWidget.isArchived = true;
    let dashboards = [];
    dashboards.push(this.deleteWidget);
    this.dashboardlist = new DashboardList();
    this.dashboardlist.workspaceId = this.workspaceId;
    this.dashboardlist.dashboard = dashboards;
    this.widgetService
      .updateDashboard(this.dashboardlist)
      .subscribe((response: any) => {
        if (response.success === true) {
          this.widgetFilterPopover.forEach(p => p.closePopover());
          this.removeSelectedWidget(deleteWidget);
          this.cdRef.detectChanges();
        }
        this.disableAppDelete = false;
      });
  }
  loadDashboard() {
    this.getWidgetsByDashboard()
  }

}
