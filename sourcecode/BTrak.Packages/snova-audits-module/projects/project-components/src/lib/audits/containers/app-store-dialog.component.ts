import {
    Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
    Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
    ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, ComponentFactoryResolver
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import * as _ from 'underscore';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { WorkspaceList } from '../dependencies/models/workspaceList';
import{WidgetslistComponent } from '@snovasys/snova-appstore-module';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };


@Component({
    selector: "app-store-dialog",
    templateUrl: "./app-store-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppStoreDialogComponent extends CustomAppBaseComponent {
    @Output() closePopUp = new EventEmitter<any>();
    isAnyAppSelected = false;
    selectedTab = 0;
    workspacelist: WorkspaceList;
    workspacesList: WorkspaceList[];
    showTitleTooltip = false;
    tagSearchText = "";
    workspaces: WorkspaceList[];
    isFromDashboards = true;
    searchText: string;
    title: string;
    injector: any;
    dashboard: any
    loaded: boolean = false;
    isFromSprints: boolean;
    private ngModuleRef: NgModuleRef<any>;
    @Output() closeMatDialog = new EventEmitter<string>();
    @Output() dashboardSelect = new EventEmitter<any>();
    @ViewChild("description") descriptionStatus: ElementRef;

    constructor(private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private cdRef: ChangeDetectorRef,
        public AppDialog: MatDialogRef<AppStoreDialogComponent>,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.isAnyAppSelected = false;
        this.workspacesList = data.workspaces;
        this.title = data.title;
        this.selectedTab = data.tab;
        this.tagSearchText = data.appTagSearchText;
        this.isFromDashboards = data.isfromdashboards;
        this.isFromSprints = data.isFromSprints;
        this.injector = this.vcr.injector;
        this.loadWidgetModule();
    }

    loadWidgetModule() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
          console.error(`No modules found`);
          return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function (module: any) {
            var widget = _.find(module.apps, function (app: any) { return app.displayName == "Widget list" });
            if (widget) {
                return true;
            }
            return false;
        })
        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {
        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //   elementInArray.name === "custom component"
                // );

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name === "Widget list"
                // );

                const factory = this.ngModuleFactoryLoader.resolveComponentFactory(WidgetslistComponent);
                this.dashboard = {};
                this.dashboard.component = factory;
                    this.dashboard.inputs = {
                        canInstall: true,
                        tagsFilter: this.tagSearchText,
                        fromSearch: true
                    }
                this.loaded = true;
                this.cdRef.detectChanges();
            // })
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

        },

        closePopUp: app => {
         this.closePopUp.emit();
        }
         

    }
}
