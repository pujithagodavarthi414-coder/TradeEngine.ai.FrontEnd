import { ChangeDetectorRef, Type, ViewContainerRef, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef, Input, OnInit, ComponentFactoryResolver, Compiler, Injector } from "@angular/core";
import { Component, Inject, EventEmitter, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { CustomQueryModel } from "../../models/custom-query.model";
import { RoleManagementService } from '../../services/role-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as _ from "underscore";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import { BuilderModulesService } from '../../services/builder.modules.service';


@Component({
    selector: "custom-app-drilldown",
    templateUrl: "custom-app-drilldown.component.html"
})

export class CustomAppDrillDownComponent extends CustomAppBaseComponent {
    optionalParameters: any;
    dashboardFilters: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.changeFilterValue(this.matData.filterType);
            this.selectedAppIdForEdit = this.matData.appId;
            this.dashboardId = this.matData.dashboardId;
            this.clikedColumnData = this.matData.clikedColumnData;
            this.subQuery = this.matData.subQuery;
            this.subQueryType = this.matData.subQueryType;
            this.dashboardFilters = this.matData.dashboardFilters;
        }
    }
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    initialized: boolean = false;
    injector: any;
    dataExists: boolean;
    selectedAppIdForEdit: string;
    Ids: any;
    statusId: string;
    customWidget: any;
    component: any = [];
    @Output() isReloadRequired = new EventEmitter<boolean>();
    componentCollection: any[];
    dashboardId: any;
    clikedColumnData: any;
    subQuery: any;
    subQueryType: any;
    isFetchOperationIsInprogress: boolean;
    all: boolean = true;
    reportingOnly: boolean = false;
    myself: boolean = false;
    private ngModuleRef: NgModuleRef<any>;
    inputIds: any;

    constructor(
        public dialog: MatDialog,
        public CreateAppDialog: MatDialogRef<CustomAppDrillDownComponent>,
        private masterDataManagementService: MasterDataManagementService,
        private vcr: ViewContainerRef,
        private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private factoryResolver: ComponentFactoryResolver,
        private roleManagementService: RoleManagementService, private cdref: ChangeDetectorRef,
        private builderModulesService: BuilderModulesService,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any,
        private compiler: Compiler, private injectorr: Injector) {
        super();
        this.injector = this.vcr.injector;

        //this.editWidget();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.getEntityRoleFeaturesByUserId();
        this.LoadSystemApps();
        this.getVisualizationRelatedData();
    }

    getEntityRoleFeaturesByUserId() {
        this.roleManagementService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
            if (features.success == true) {
                localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
            }
        })
    }

    getVisualizationRelatedData() {
        this.isFetchOperationIsInprogress = true;
        const customQueryModel = new CustomQueryModel();
        customQueryModel.dynamicQuery = this.subQuery;
        customQueryModel.clickedColumn = this.clikedColumnData && this.clikedColumnData.column ? this.clikedColumnData.column.field : null;
        customQueryModel.clickedColumnData = this.clikedColumnData && this.clikedColumnData.dataItem ? JSON.stringify(this.clikedColumnData.dataItem) : null;
        customQueryModel.isAll = this.all;
        customQueryModel.isReportingOnly = this.reportingOnly;
        customQueryModel.isMyself = this.myself;
        customQueryModel.dashboardFilters = this.dashboardFilters;
        this.masterDataManagementService.GetCustomWidgetQueryResult(customQueryModel).subscribe((response: any) => {
            if (response.success === true) {
                var queryData = response.data.queryData ? JSON.parse(response.data.queryData) : [];
                this.Ids = queryData.map(data => data.Id);
                const isBelowThreshold = (currentValue) => currentValue == null || currentValue == undefined;
                if (queryData.length > 0 && this.Ids.every(isBelowThreshold)) {
                    this.Ids = queryData;
                } else {
                    this.Ids = this.Ids.toString();
                }
                if (!this.Ids || this.Ids === "") {
                    this.dataExists = false;
                } else {
                    this.dataExists = true;
                }

                var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
                if (!moduleJson || moduleJson == 'null') {
                    console.error(`No modules found`);
                    return;
                }
                var appModules = JSON.parse(moduleJson);
                let currentSubQueryType = this.subQueryType.toLowerCase();



                var module = _.find(appModules, function (module: any) {
                    var widget = _.find(module.apps, function (app: any) {
                        return app.displayName.toLowerCase() == currentSubQueryType;
                    });
                    if (widget) {
                        return true;
                    }
                    return false;
                });

                if (module) {
                    var componentDetails = module.apps.find(elementInArray =>
                        elementInArray.displayName.toLowerCase() === this.subQueryType.toLowerCase()
                    );
                    this.loadModule(() => import(module.moduleLazyLoadingPath).then(m => m[module.moduleName]), queryData);
                    // const factory = this.factoryResolver.resolveComponentFactory(componentDetails.componentName);

                    // console.log(factory);

                    // this.component = factory;
                    // if (this.subQueryType == 'Runs') {
                    //     this.statusId = queryData.map(data => data.StatusId).toString();
                    //     this.inputIds = { Ids: this.Ids, typeOfRun: this.statusId };
                    // } else {
                    //     this.inputIds = { Ids: this.Ids };
                    // }
                    // console.log(this.inputIds);

                    // this.isFetchOperationIsInprogress = false;

                    // this.initialized = true;
                    // this.cdref.detectChanges();
                    // try {
                    //     this.optionalParameters = {};
                    //     this.optionalParameters.fromCustomDrillDown = true;
                    //     this.optionalParameters.drillDownSelector = 'mat-dialog-container custom-app-drilldown';
                    //     this.component.componentType.prototype.fitContent(this.optionalParameters);
                    // } catch(err) {
                    //     console.log(err);
                    // }
                    // this.ngModuleFactoryLoader
                    //     .load(module.moduleLazyLoadingPath)
                    //     .then((moduleFactory: NgModuleFactory<any>) => {

                    //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    //         var allComponentsInModule = (<any>componentService).components;

                    //         console.log(moduleFactory);
                    //         this.ngModuleRef = moduleFactory.create(this.injector);

                    //         var componentDetails = allComponentsInModule.find(elementInArray =>
                    //             elementInArray.name.toLowerCase() === this.subQueryType.toLowerCase()
                    //         );

                    //         console.log(componentDetails);

                    //         const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);

                    //         console.log(factory);

                    //         this.component = factory;
                    //         if (this.subQueryType == 'Runs') {
                    //             this.statusId = queryData.map(data => data.StatusId).toString();
                    //             this.inputIds = { Ids: this.Ids, typeOfRun: this.statusId };
                    //         } else {
                    //             this.inputIds = { Ids: this.Ids };
                    //         }
                    //         console.log(this.inputIds);

                    //         this.isFetchOperationIsInprogress = false;

                    //         this.initialized = true;
                    //         this.cdref.detectChanges();
                    //         try {
                    //             this.optionalParameters = {};
                    //             this.optionalParameters.fromCustomDrillDown = true;
                    //             this.optionalParameters.drillDownSelector = 'mat-dialog-container custom-app-drilldown';
                    //             this.component.componentType.prototype.fitContent(this.optionalParameters);
                    //         } catch(err) {
                    //             console.log(err);
                    //         }
                    //     })
                }
            }
            this.isFetchOperationIsInprogress = false;
            this.cdref.detectChanges();
        });
    }

    LoadSystemApps() {

        // this.componentCollection = [
        //     {
        //         name: "Goals", componentInstance: GoalsBrowseBoardComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Goal", componentInstance: GoalUniqueDetailComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Userstory", componentInstance: UserStoryUniqueDetailComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Userstories", componentInstance: AllWorkItemsComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Project", componentInstance: ProjectListComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Scenarios", componentInstance: TestSuitesViewComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Runs", componentInstance: TestRunsViewComponent,
        //         inputs: { Ids: this.Ids, typeOfRun: this.statusId }
        //     },
        //     {
        //         name: "EmployeeIndex", componentInstance: EmployeeIndexComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "CustomSubQuery", componentInstance: CustomSubqueryTableComponent,
        //         inputs: { Ids: this.Ids }
        //     }
        //     , {
        //         name: "Versions", componentInstance: TestrailMileStoneBaseComponent,
        //         inputs: { Ids: this.Ids }
        //     }, {
        //         name: "GoalReplanHistory", componentInstance: GoalReplanHistoryComponent,
        //         inputs: { Ids: this.Ids }
        //     }, {
        //         name: "Sprint", componentInstance: SprintsUniqueDetailComponent,
        //         inputs: { Ids: this.Ids }
        //     },
        //     {
        //         name: "Leaves", componentInstance: MyLeavesListComponent,
        //         inputs: { Ids: this.Ids }
        //     }
        // ]
    }

    outputs = {
        closePopUp: (close) => {
            if (close) {
                this.currentDialog.close({ isReloadRequired: true });
            }
        }
    }

    onNoClick(isReload): void {
        if (isReload === true) {
            this.isReloadRequired.emit(isReload);
        } else {
            this.currentDialog.close();
        }
    }

    changeFilterValue(value) {
        if (value == "all") {
            this.all = true;
            this.reportingOnly = false;
            this.myself = false;
        }
        else if (value == "reportingOnly") {
            this.all = false;
            this.reportingOnly = true;
            this.myself = false;
        }
        else if (value == "mySelf") {
            this.all = false;
            this.reportingOnly = false;
            this.myself = true;
        }
    }

    loadModule(path: any, queryData: any) {
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
                    //   const elementModuleRef = moduleFactory.create(this.injector);
                    //   const moduleInstance = elementModuleRef.instance;
                    const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    var allComponentsInModule = (<any>componentService).components;

                    console.log(moduleFactory);
                    this.ngModuleRef = moduleFactory.create(this.injector);

                    var componentDetails = allComponentsInModule.find(elementInArray =>
                        elementInArray.name.toLowerCase() === this.subQueryType.toLowerCase()
                    );

                    console.log(componentDetails);

                    const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);

                    console.log(factory);

                    this.component = factory;

                    if (this.subQueryType == 'Runs') {
                        this.statusId = queryData.map(data => data.StatusId).toString();
                        this.inputIds = { Ids: this.Ids, typeOfRun: this.statusId };
                    } else {
                        this.inputIds = { Ids: this.Ids };
                    }
                    console.log(this.inputIds);

                    this.isFetchOperationIsInprogress = false;

                    this.initialized = true;
                    this.cdref.detectChanges();
                    try {
                        this.optionalParameters = {};
                        this.optionalParameters.fromCustomDrillDown = true;
                        this.optionalParameters.drillDownSelector = 'mat-dialog-container custom-app-drilldown';
                        this.component.componentType.prototype.fitContent(this.optionalParameters);
                    } catch (err) {
                        console.log(err);
                    }

                    // do something with the module...
                } catch (err) {
                    throw err;
                }
            });
    }


}
