import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, NgModuleFactory, NgModuleFactoryLoader, Type, NgModuleRef, ViewContainerRef, ViewChildren, ComponentFactoryResolver } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";

// import { AppBaseComponent } from '../dependencies/components/appbasecomponent';
import { AuditTabs } from "../models/audit-tabs.model";
import { AuditActionTypes, LoadAuditRelatedCountsTriggered } from "../store/actions/audits.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardList } from '../dependencies/models/dashboardList';
import { AuditService } from '../services/audits.service';
import { DashboardFilterModel, DragedWidget } from '../dependencies/models/dashboardFilterModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as _ from "underscore";
import { AppStoreDialogComponent } from './app-store-dialog.component';
import { QuestionHistoryModel } from '../models/question-history.model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "audit-dashboard-view",
    templateUrl: "./audit-dashboard-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditDashboardViewComponent extends AppFeatureBaseComponent implements OnInit {

    @ViewChildren("addActionPopover") addActionPopover;

    anyOperationInProgress$: Observable<boolean>;
    activeAuditsCount$: Observable<number>;
    archivedAuditsCount$: Observable<number>;
    activeAuditConductsCount$: Observable<number>;
    archivedAuditConductsCount$: Observable<number>;
    activeAuditReportsCount$: Observable<number>;
    archivedAuditReportsCount$: Observable<number>;
    actionsCount$: Observable<number>;
    selectedApps: DragedWidget;
    selectedWorkspaceId: string = null;
    reloadDashboard: string = null;
    dashboardFilter: DashboardFilterModel;

    public ngDestroyed$ = new Subject();

    projectId: string;

    selectedTab: string;
    overviewTab: boolean = false;
    reportsTab: boolean = false;
    mileStoneTab: boolean = false;
    changeRoute: boolean = false;
    tabSelected: AuditTabs;
    loadAction: boolean = false;
    loadProjectModule: string;
    listView: boolean = false;
    injector: any;
    dashboard: any;
    isAnyAppSelected: boolean;
    loaded: boolean;
    selectedAppForListView: any;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService,
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>, private softLabelsPipe: SoftLabelPipe
        ) {
        super();
        this.injector = this.vcr.injector;
        this.route.params.subscribe(routeParams => {
          this.projectId = routeParams.id;
            if (routeParams.tab) {
                this.selectedTab = routeParams.tab;
                if(this.selectedTab == '6') 
                this.GetCustomizedDashboardId();
            }
            else {
                this.selectedTab = '0';
            }
            this.changeRoute = false;
            this.tabSelected = new AuditTabs();
            this.tabSelected.index = this.selectedTab;
          if (this.projectId && this.routes.url.includes('projects'))
            this.getAuditRelatedCounts();
            this.selectedMatTab(this.tabSelected);
            this.cdRef.markForCheck();
        });
        this.getSoftLabelConfigurations();
      }
    
      getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
      }

    ngOnInit() {
        super.ngOnInit();
    }

    getAuditRelatedCounts() {
        this.store.dispatch(new LoadAuditRelatedCountsTriggered(this.projectId));
        this.activeAuditsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditsCount));
        this.archivedAuditsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditsCount));
        this.activeAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditConductsCount));
        this.archivedAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditConductsCount));
        this.activeAuditReportsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditReportsCount));
        this.archivedAuditReportsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditReportsCount));
        this.actionsCount$ = this.store.pipe(select(auditModuleReducer.getActionsCount));
    }

    selectedMatTab(event) {
        this.changeRoute = true;
        this.cdRef.markForCheck();
        // this.routes.navigate(['audits/auditsview', event.index]);
        if (this.routes.url.includes("/audit/")) {
          this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/audit/conducts');
        } else {
          this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    openTimelineView() {
        // this.routes.navigate(["audits/auditsview/2"]);
        if (this.routes.url.includes("/audit/")) {
          this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/audit/conducts');
        } else {
          this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
        }
    }

    openAddActionPopover(addActionPopover) {
        this.loadAction = true;
        this.loadProjectModule = null;
        addActionPopover.openPopover();
    }

    closeActionPopover() {
        this.addActionPopover.forEach((p) => p.closePopover());
        this.loadAction = false;      
        this.loadProjectModule = 'true';  
       // this.loadProjectModule();
    }
    openAppsView() {
        this.listView = !this.listView;
        this.selectedApps = null;
        this.selectedAppForListView = null;
        this.reloadDashboard = null;
        if(this.listView) {
          this.loadWidgetModule("Custom apps view");
        } else {
          this.loadWidgetModule("Custom Widget");
        }
      }

    GetCustomizedDashboardId() {
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "Audits";
        this.auditService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
          if (result.success === true) {
            this.selectedWorkspaceId = result.data;
            this.selectedApps = null;
            this.reloadDashboard = null;
            this.listView = true;
            this.loadWidgetModule("Custom apps view");
          }
        });
      }

      loadWidgetModule(component) {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
          console.error(`No modules found`);
          return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function(module: any) {
          var widget = _.find(module.apps, function(app: any) { return app.displayName.toLowerCase() == component.toLowerCase() });
          if (widget) {
            return true;
          }
          return false;
        })
        // this.ngModuleFactoryLoader
        //   .load(module.moduleLazyLoadingPath)
        //   .then((moduleFactory: NgModuleFactory<any>) => {
            const componentService = (module.moduleLazyLoadingPath.moduleType as ModuleWithComponentService).componentService;
    
            var allComponentsInModule = (<any>componentService).components;
    
            this.ngModuleRef = module.moduleLazyLoadingPath.create(this.injector);
    
            // var componentDetails = allComponentsInModule.find(elementInArray =>
            //   elementInArray.name === "custom component"
            // );
            let workSpaceId;
    
            if (this.selectedTab == "6") {
              workSpaceId = this.selectedWorkspaceId;
            } 
            let factory ;
            if(!this.listView) {
              factory = this.ngModuleFactoryLoader.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
            } else {
              factory = this.ngModuleFactoryLoader.resolveComponentFactory(allComponentsInModule[1].componentTypeObject);
            }
             
            this.dashboard = {};
            this.dashboard.component = factory;
            this.dashboard.inputs = {
              isWidget: true,
              selectedWorkspaceId: workSpaceId,
              selectedApps: this.selectedApps,
              dashboardFilters: this.dashboardFilter,
              reloadDashboard: this.reloadDashboard,
              selectedAppForListView: this.selectedAppForListView
            }
            this.loaded = true;
            this.cdRef.detectChanges();
          // })
      }

      openAppsSettings(isfromdashboards) {
        var appTagSearchText = 'Audit analytics';
        const dialogRef = this.dialog.open(AppStoreDialogComponent, {
          minWidth: "80vw",
          minHeight: "50vh",
          data: { workspaces: [], isfromdashboards, appTagSearchText: appTagSearchText }
        });
        dialogRef.componentInstance.closeMatDialog.subscribe((app) => {
          this.selectedApps = JSON.parse(app);
          this.selectedAppForListView = app;
          this.dashboard.inputs.reloadDashboard = null;
          this.dashboard.inputs.selectedApps = this.selectedApps;
          this.upsertQuestionHistory({eventCode: 'InstalledApp', appName: this.selectedApps.name});
          this.cdRef.detectChanges();
        });
        dialogRef.componentInstance.closePopUp.subscribe((app) => {
          this.dialog.closeAll();
        })
      }

      outputs = {
        appsSelected: app => {
          this.isAnyAppSelected = true;      
        },
        description: data => {
          this.upsertQuestionHistory(data);
        }
      }
    
      upsertQuestionHistory(data) {
        var questionHistoryModel = new QuestionHistoryModel();
        questionHistoryModel.description = data.eventCode;
        questionHistoryModel.oldValue = data.appName;
        this.auditService.upsertAuditQuestionHistory(questionHistoryModel)
                .subscribe(data => {console.log(data)});
      }
}