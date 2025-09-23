import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, NgModuleFactory, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, Type, OnInit, ComponentFactoryResolver } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import * as auditModuleReducer from "../store/reducers/index";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { MatDialog } from '@angular/material/dialog';
import { AppStoreDialogComponent } from '../containers/app-store-dialog.component';
import { DashboardFilterModel, DragedWidget } from '../dependencies/models/dashboardFilterModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import { AuditModulesService } from '../services/audit.modules.service';
import * as _ from "underscore";
import { LoadQuestionViewTriggered, QuestionActionTypes } from '../store/actions/questions.actions';
import { QuestionModel } from '../models/question.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditService } from '../services/audits.service';
import { QuestionHistoryModel } from '../models/question-history.model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentModel } from '@snovasys/snova-comments';
import { CookieService } from "ngx-cookie-service";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { CustomFormHistoryComponent } from "@snovasys/snova-project-management";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  selector: "audit-question-details",
  templateUrl: "./audit-question-details.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditQuestionDetailsComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("FileUploadPopup") FileUploadPopup;
  @ViewChildren("FilesPopup") FilesPopup;

  @Output() closePreview = new EventEmitter<any>();

  @Input("selectedAudit")
  set _selectedAudit(data: any) {
    if (data) {
      this.selectedAudit = data;
      if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
        this.isAuditArchived = false;
      else
        this.isAuditArchived = true;
    }
  }

  @Input("question")
  set _question(data: any) {
    if (data) {
      this.questionData = data;
      this.selectedWorkspaceId = this.questionData.questionDashboardId ? this.questionData.questionDashboardId : this.questionData.questionId;
    }
  }

  @Input("isHierarchical")
  set _isHierarchical(data: boolean) {
    if (data || data == false) {
      this.isHierarchical = data;
    }
  }
  selectedApps: DragedWidget;
  selectedWorkspaceId: string = null;
  reloadDashboard: string = null;
  dashboardFilter = new DashboardFilterModel();
  filesCount: number;
  listView: boolean = false;
  isAuditArchived: boolean = false;
  injector: any;
  dashboard: any;
  isAnyAppSelected: boolean;
  loaded: boolean;
  selectedAppForListView: any;
  selectedAudit: any;
  isAnalyticsTab: boolean;
  anyOperationInProgress$: Observable<boolean>
  historyInProgress$: Observable<boolean>
  customHistoryComponent: any;
  public ngDestroyed$ = new Subject();
  componentModel: ComponentModel = new ComponentModel();

  files = [];
  allTestCases = [];
  projectcomponentLoaded: boolean = false;
  moduleTypeId: number = 14;
  referenceTypeId: string = ConstantVariables.AuditReferenceTypeId;
  selectedStoreId: string = null;
  isButtonVisible: boolean = true;
  questionData: any;
  position: any;
  loadDetails: boolean = false;
  isHierarchical: boolean = false;
  projectId: any;
  softLabels: SoftLabelConfigurationModel[];
  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, public dialog: MatDialog,
    private ngModuleFactoryLoader: ComponentFactoryResolver, private auditService: AuditService, private routes: Router, private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    private auditModulesService: AuditModulesService,
    private ngModuleRef: NgModuleRef<any>,
    private _sanitizer: DomSanitizer,private cookieService: CookieService, private softLabelsPipe: SoftLabelPipe) {

    super();

    this.injector = this.vcr.injector;
    this.route.params.subscribe(routeParams => {             
      if (this.routes.url.includes('projects'))
        this.projectId = routeParams.id;       
        this.dashboardFilter.projectId = this.projectId;
        this.cdRef.markForCheck();
    });
    this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getSingleQuestionLoading));
    this.historyInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionHistoryLoading));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(QuestionActionTypes.LoadSingleQuestionByIdCompleted),
      tap((result: any) => {
        if (result && result.searchQuestions.length > 0) {
          let data = result.searchQuestions[0];
          this.filesCount = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles.length : 0;
          this.files = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles : [];
          this.cdRef.markForCheck();
        }
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(QuestionActionTypes.LoadQuestionViewCompleted),
      tap((result: any) => {
        if (result && result.searchQuestions.length > 0) {
          let data = result.searchQuestions[0];
          this.filesCount = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles.length : 0;
          this.files = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles : [];
          this.cdRef.markForCheck();
        }
      })
    ).subscribe();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ngOnInit() {
    super.ngOnInit();
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

  onTabSelect(event) {
    this.selectedApps = null;
    this.selectedAppForListView = null;
    if (event && event.title.toLowerCase() == 'analytics') {
      this.isAnalyticsTab = true;
      this.loadWidgetModule("Custom Widget");
    } else {
      this.isAnalyticsTab = false;
    }

    if (event && event.title.toLowerCase() == 'custom fields history') {
      this.projectcomponentLoaded = false;
      this.loadProjectModule();
    }
  }

  openFileUploadPopover(FileUploadPopup) {
    FileUploadPopup.openPopover();
  }

  closeFilesPopup() {
    this.FilesPopup.forEach((p) => p.closePopover());
  }

  openFilesPopover(FilesPopup) {
    FilesPopup.openPopover();
  }

  closeFileUploadPopover() {
    this.FileUploadPopup.forEach((p) => p.closePopover());
    let model = new QuestionModel();
    model.questionId = this.questionData.questionId;
    this.store.dispatch(new LoadQuestionViewTriggered(model));
  }

  closeDialog() {
    this.closePreview.emit("");
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
      this.upsertQuestionHistory({ eventCode: 'InstalledApp', appName: this.selectedApps.name });
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
    questionHistoryModel.questionId = this.questionData.questionId;
    questionHistoryModel.description = data.eventCode;
    questionHistoryModel.oldValue = data.appName;
    questionHistoryModel.auditId = this.selectedAudit.auditId;
    this.auditService.upsertAuditQuestionHistory(questionHistoryModel)
      .subscribe(data => { console.log(data) });
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
        workSpaceId = this.selectedWorkspaceId;
        let factory;
        if (!this.listView) {
          factory = this.ngModuleFactoryLoader.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
        } else {
          factory = this.ngModuleFactoryLoader.resolveComponentFactory(allComponentsInModule[1].componentTypeObject);
        }

        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          fromAudits: true,
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

  loadProjectModule() {
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);

    // var modules = this.auditModulesService["modules"];

    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'ProjectPackageModule' });

    if (!module) {
      console.error("No module found for ProjectPackageModule");
    }

    // this.ngModuleFactoryLoader
    //   .load(module.moduleLazyLoadingPath)
    //   .then((moduleFactory: NgModuleFactory<any>) => {

    //     const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

    //     var allComponentsInModule = (<any>componentService).components;

    //     this.ngModuleRef = moduleFactory.create(this.injector);

    //     var componentDetails = allComponentsInModule.find(elementInArray =>
    //       elementInArray.name.toLocaleLowerCase() === "Custom field history".toLocaleLowerCase()
    //     );
        this.customHistoryComponent = {};
        this.customHistoryComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(CustomFormHistoryComponent);
        this.customHistoryComponent.inputs = {
          referenceTypeId: this.selectedAudit.auditId,
          referenceId: this.questionData.questionId

        };

        this.customHistoryComponent.outputs = {

        };
        this.projectcomponentLoaded = true;
        this.cdRef.detectChanges();
      // });
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

  sanitizeUrl(imgUrl) {
    return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}