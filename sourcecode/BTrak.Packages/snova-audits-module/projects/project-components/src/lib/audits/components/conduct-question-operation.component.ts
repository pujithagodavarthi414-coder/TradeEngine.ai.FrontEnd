import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, Output, EventEmitter, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, ViewChild, Input, ComponentFactoryResolver } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { State } from "../store/reducers/index";
import * as _ from "underscore";
import * as auditModuleReducer from "../store/reducers/index";
import { LoadConductQuestionViewTriggered, QuestionActionTypes } from "../store/actions/questions.actions";
import { AuditActionTypes } from '../store/actions/audits.actions';
import { ConstantVariables } from '../dependencies/constants/constant-variables';

import { AuditModulesService } from '../services/audit.modules.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AuditConduct } from '../models/audit-conduct.model';
import { LoadAuditConductByIdTriggered } from '../store/actions/conducts.actions';
import { QuestionModel } from '../models/question.model';
import { AppStoreDialogComponent } from '../containers/app-store-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DashboardFilterModel, DragedWidget } from '../dependencies/models/dashboardFilterModel';
import { DashboardList } from '../dependencies/models/dashboardList';
import { AuditService } from '../services/audits.service';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { QuestionHistoryModel } from '../models/question-history.model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentModel } from '@snovasys/snova-comments';
import { CookieService } from "ngx-cookie-service";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { CustomFormHistoryComponent, UserStoryLogTimeComponent } from "@snovasys/snova-project-management";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "conduct-question-operation",
    templateUrl: "./conduct-question-operation.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductQuestionOperationComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren("FileUploadPopup") FileUploadPopup;
    @ViewChildren("FilesPopup") FilesPopup;

    @Output() closePreview = new EventEmitter<any>();
    @Output() questionPreview = new EventEmitter<any>();
    @Input() fromDialog: boolean;
    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionData = data;
            this.actionsCount = this.questionData.actionsCount;
            this.questionFiles = (this.questionData && this.questionData.conductQuestionFilesXml) ? JSON.parse(this.questionData.conductQuestionFilesXml) : [];
            this.filesCount = this.questionFiles.length;
            this.selectedWorkspaceId = this.questionData.questionDashboardId ? this.questionData.questionDashboardId : this.questionData.auditConductQuestionId;
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.canLogTime == null || this.selectedConduct.canLogTime == false)
                this.canLogTime = false;
            else
                this.canLogTime = true;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isConductArchived = false;
            else
                this.isConductArchived = true;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.canConductSubmitted == null || this.selectedConduct.canConductSubmitted == false)
                this.canConductSubmitted = false;
            else
                this.canConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
            if (this.selectedConduct.areActionsAdded == null || this.selectedConduct.areActionsAdded == false)
                this.areActionsAdded = false;
            else
                this.areActionsAdded = true;
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false) {
            this.isHierarchical = data;
        }
    }
    dashboardFilter = new DashboardFilterModel();
    anyOperationInProgress$: Observable<boolean>
    historyInProgress$: Observable<boolean>

    public ngDestroyed$ = new Subject();
    componentModel: ComponentModel = new ComponentModel();
    allTestCases = [];
    questionFiles = [];

    questionData: any;
    injector: any;
    documentStoreComponent: any;
    customHistoryComponent: any;
    position: any;
    selectedConduct: any;
    actionsCount: number = 0;
    filesCount: number = 0;
    loadDetails: boolean = false;
    isHierarchical: boolean = false;
    isConductArchived: boolean = false;
    isConductSubmitted: boolean = false;
    canConductSubmitted: boolean = false;
    isConductEditable: boolean = false;
    canLogTime: boolean = false;
    areActionsAdded: boolean = false;
    componentLoaded: boolean = false;
    projectcomponentLoaded: boolean = false;
    toBeLoaded: boolean = false;
    moduleTypeId: number = 14;
    referenceTypeId: string = ConstantVariables.ConductReferenceTypeId;
    selectedStoreId: string = null;
    isButtonVisible: boolean = true;
    listView: boolean = false;
    dashboard: any;
    isAnyAppSelected: boolean;
    loaded: boolean;
    selectedAppForListView: any;
    selectedApps: DragedWidget;
    selectedWorkspaceId: string = null;
    reloadDashboard: string = null;
    isAnalyticsTab: boolean;
    projectId: any;
    loadDropzone: boolean;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>,
        private _sanitizer: DomSanitizer,
        public dialog: MatDialog,
        private auditService: AuditService,
        private routes: Router, private route: ActivatedRoute, private cookieService: CookieService, private softLabelsPipe: SoftLabelPipe) {

        super();

        this.injector = this.vcr.injector;
        this.route.params.subscribe(routeParams => {
            if (this.routes.url.includes('projects'))
                this.projectId = routeParams.id;
            this.dashboardFilter.projectId = this.projectId;
            this.cdRef.markForCheck();
        });
        this.historyInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionHistoryLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductActionQuestionByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions.length > 0) {
                        let data = result.searchQuestions[0];
                        if (this.questionData && this.questionData.questionId == data.questionId) {
                            this.actionsCount = data.actionsCount;
                            this.cdRef.markForCheck();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionViewCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions) {
                        let data = result.searchQuestions[0];
                        this.questionFiles = data.conductQuestionFilesXml ? JSON.parse(data.conductQuestionFilesXml) : [];
                        this.filesCount = this.questionFiles.length;
                        let dataa = {
                            questionData: result.searchQuestions[0],
                            upsertQuestion: false,
                            previewQuestion: true
                        };
                        this.questionPreview.emit({...dataa, load: true});
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
        if (event && event.title.toLowerCase() == 'time')
            this.loadProjectManagementModule();
        else
            this.componentLoaded = false;
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

    closeDialog() {
        this.closePreview.emit("");
    }

    getQuestionPreview(data) {
        this.loadRelatedConduct();
        this.questionPreview.emit(data);
    }

    openFileUploadPopover(FileUploadPopup) {
        this.loadDropzone = true;
        FileUploadPopup.openPopover();
    }

    closeFileUploadPopover() {
        this.loadDropzone = false;
        this.FileUploadPopup.forEach((p) => p.closePopover());
        let model = new QuestionModel();
        model.questionId = this.questionData.questionId;
        model.conductId = this.questionData.conductId;
        this.store.dispatch(new LoadConductQuestionViewTriggered(model));
        this.loadRelatedConduct();
    }

    openFilesPopover(FilesPopup) {
        FilesPopup.openPopover();
    }

    closeFilesPopup() {
        this.FilesPopup.forEach((p) => p.closePopover());
    }

    loadProjectManagementModule() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);

        // var modules = this.auditModulesService["modules"];

        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProjectPackageModule' });

        if (!module) {
            console.error("No module found for ProjectPackageModule");
        }

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name.toLocaleLowerCase() === "Log time".toLocaleLowerCase()
                // );
                this.documentStoreComponent = {};
                this.documentStoreComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(UserStoryLogTimeComponent);
                this.documentStoreComponent.inputs = {
                    userStoryId: this.questionData.auditConductQuestionId,
                    isFromAudits: true
                };

                this.documentStoreComponent.outputs = {
                    auditLog: param => this.loadRelatedConduct()
                };
                this.componentLoaded = true;
                this.cdRef.detectChanges();
            // });
    }

    loadProjectModule() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);

        // var modules = this.auditModulesService["modules"];

        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProjectPackageModule' });

        if (!module) {
            console.error("No module found for ProjectPackageModule");
        }

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name.toLocaleLowerCase() === "Custom field history".toLocaleLowerCase()
        //         );
                this.customHistoryComponent = {};
                this.customHistoryComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(CustomFormHistoryComponent);
                this.customHistoryComponent.inputs = {
                    referenceTypeId: this.selectedConduct.conductId,
                    referenceId: this.questionData.questionId

                };

                this.customHistoryComponent.outputs = {
                    auditLog: param => this.loadRelatedConduct()
                };
                this.projectcomponentLoaded = true;
                this.cdRef.detectChanges();
            // });
    }


    loadRelatedConduct() {
        let searchAudit = new AuditConduct();
        searchAudit.conductId = this.selectedConduct.conductId;
        searchAudit.isArchived = false;
        searchAudit.canRefreshConduct = true;
        this.store.dispatch(new LoadAuditConductByIdTriggered(searchAudit));
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
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
        var module = _.find(modules, function (module: any) {
            var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == component.toLowerCase() });
            if (widget) {
                return true;
            }
            return false;
        })
        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {
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
        questionHistoryModel.auditId = this.selectedConduct.conductId;
        this.auditService.upsertAuditQuestionHistory(questionHistoryModel)
            .subscribe(data => { console.log(data) });
    }
}