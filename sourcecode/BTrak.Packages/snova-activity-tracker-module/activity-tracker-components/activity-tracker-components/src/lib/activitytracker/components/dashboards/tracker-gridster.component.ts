import { ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, Input, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, Type, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboard.filter.model';
import * as _ from "underscore";
import { ActivityTrackerModuleService } from '../../services/activitytracker.module.services';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-tracker-gridster',
    templateUrl: 'tracker-gridster.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class TrackerGridsterComponent {
    componentInputs = {
        reloadDashboard: null,
        fromRoute: null,
        isListView: null,
        selectedApps: null,
        dashboardFilters: null,
        filterApplied: null,
        selectedWorkspaceId: null,
        isWidget: null,
        dashboardGlobalData: null,
        isFromCustomizedBoard: true
    }

    reloadDashboard: any;
    @Input("reloadDashboard")
    set _reloadDashboard(data: boolean) {
        this.componentInputs.reloadDashboard = data;
    }

    fromRoute: any;
    @Input("fromRoute")
    set _fromRoute(data: boolean) {
        this.componentInputs.fromRoute = data;
    }


    isListView: boolean;
    @Input("isListView")
    set _isListView(data: boolean) {
        this.componentInputs.isListView = data;
    }

    selectedApps: any;
    @Input("selectedApps")
    set _selectedApps(data: any) {
        this.componentInputs.selectedApps = data;
    }

    dashboardFilters: DashboardFilterModel;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.componentInputs.dashboardFilters = data;
    }

    filterApplied: any;
    @Input("filterApplied")
    set _filterApplied(data: any) {
        this.componentInputs.filterApplied = data;
    }

    selectedWorkspaceId: string;
    @Input("selectedWorkspaceId")
    set _selectedWorkspaceId(data: string) {
        this.componentInputs.selectedWorkspaceId = data;
    }

    isWidget: boolean;
    @Input("isWidget")
    set _setiswidget(data: boolean) {
        this.componentInputs.isWidget = data;
    }

    dashboardGlobalData: any;
    @Input("dashboardGlobalData")
    set _dashboardGlobalData(data: any) {
        this.componentInputs.dashboardGlobalData = data;
    }

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    outputs: any;
    widgetGridComponent: any;

    constructor(
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,private compiler:Compiler,
        private activityTrackerModuleService :ActivityTrackerModuleService, private cdref:ChangeDetectorRef,) {
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.activityTrackerModuleService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function (module) { return module['modulePackageName'] == 'WidgetPackageModule' });
        var component = "Custom Widget"
        var module = _.find(modules, function (module) { return module.modulePackageName == 'WidgetPackageModule' });
        if (!module) {
            console.error("No module found for WidgetPackageModule");
        }
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
            .then(moduleFactory => {
                try {
                    const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                    var allComponentsInModule = (<any>componentService).components;

                    this.ngModuleRef = moduleFactory.create(this.injector);

                    var componentDetails = allComponentsInModule.find(elementInArray =>
                        elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
                    );

                    this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.cdref.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //     .load(module['moduleLazyLoadingPath'])
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name === "Custom Widget"
                // );

                // this.widgetGridComponent = this.ngModuleFactoryLoader.resolveComponentFactory(module['moduleLazyLoadingPath']);
            // });
    }
}