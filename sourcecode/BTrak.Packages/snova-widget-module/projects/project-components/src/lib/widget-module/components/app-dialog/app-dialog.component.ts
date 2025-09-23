import {
    Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
    Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
    ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, ComponentFactoryResolver, Compiler
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { WorkspaceList } from "../../dependencies/models/workspaceList";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from 'underscore';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
//import { modules } from '../../dependencies/constants/modules';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { AppStoreComponent } from "@thetradeengineorg1/snova-appstore-module";
import { ModulesService } from "../../dependencies/services/modules.service";


@Component({
    selector: "app-dialog",
    templateUrl: "./app-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppDialogComponent extends CustomAppBaseComponent {
    isAnyAppSelected = false;
    selectedTab = 0;
    workspacelist: WorkspaceList;
    workspacesList: WorkspaceList[];
    showTitleTooltip = false;
    tagSearchText = "";
    workspaces: WorkspaceList[];
    isFromDashboards: boolean;
    searchText: string;
    title: string;
    injector: any;
    dashboard: any
    loaded: boolean = false;
    private ngModuleRef: NgModuleRef<any>;
    @Output() closeMatDialog = new EventEmitter<string>();
    @Output() dashboardSelect = new EventEmitter<any>();
    @ViewChild("description") descriptionStatus: ElementRef;

    constructor(private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private vcr: ViewContainerRef,
        @Inject('ModulesService') public modulesService: any,
        private compiler: Compiler,
        private factoryResolver: ComponentFactoryResolver,
        private cdRef: ChangeDetectorRef,
        public AppDialog: MatDialogRef<AppDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.isAnyAppSelected = false;
        this.workspacesList = data.workspaces;
        this.title = data.title;
        this.selectedTab = data.tab;
        this.tagSearchText = data.appTagSearchText;
        this.isFromDashboards = data.isfromdashboards;
        this.injector = this.vcr.injector;
        if (!this.isFromDashboards) {
            this.loadWidgetModule();
        }
    }

    loadWidgetModule() {
        this.loaded = true;
        var loader = this.modulesService["modules"];
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);
        var module: any = _.find(modules, function (module) {
            var widget = _.find(module['apps'], function (app) { return app['displayName'].toLowerCase() == "app store" });
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
                    canInstall: true
                }
                this.loaded = false;
                this.cdRef.detectChanges();
            })
    }

    appsSelected(app) {
        this.isAnyAppSelected = true;
        this.closeMatDialog.emit(app);
    }

    dashboardSelected(dashboard) {
        this.dashboardSelect.emit(dashboard.workspaceId);
        this.AppDialog.close();
    }

    onNoClick(): void {
        this.AppDialog.close(this.isAnyAppSelected);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
        this.closeSearch();
    }

    checkTitleTooltipStatus() {
        if (this.descriptionStatus.nativeElement.scrollWidth > this.descriptionStatus.nativeElement.clientWidth) {
            this.showTitleTooltip = true;
        } else {
            this.showTitleTooltip = false;
        }
    }

    closeSearch() {
        this.searchText = "";
    }

    outputs = {
        appsSelected: app => {
            if (app == null)
                this.AppDialog.close(this.isAnyAppSelected);
            else {
                this.isAnyAppSelected = true;
                this.closeMatDialog.emit(app);
            }

        }
    }
}
