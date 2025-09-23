import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, ComponentFactoryResolver, ChangeDetectorRef, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { AdminModulesService } from '../../services/admin.module.service';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'gridstar-View',
    templateUrl: `gridstar-view.html`,
    encapsulation: ViewEncapsulation.None,
})

export class GridstarViewComponent extends CustomAppBaseComponent implements OnInit {

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
    // @Input("canDelateApps")
    // set _canDelateApps(data: boolean) {
    //     this.componentInputs.canDelateApps = data;
    // }

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    outputs: any;
    widgetGridComponent: any;
    canDelateApps: boolean;

    constructor(
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private adminModulesService: AdminModulesService,
        private vcr: ViewContainerRef, private cdRef: ChangeDetectorRef,
        private compiler: Compiler,) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.adminModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"))
        var component = "Custom Widget";
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
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        // var allComponentsInModule = (<any>componentService).components;

        // this.ngModuleRef = moduleFactory.create(this.injector);

        // var componentDetails = allComponentsInModule.find(elementInArray =>
        //     elementInArray.name === "Custom Widget"
        // );

        // this.widgetGridComponent = this.ngModuleFactoryLoader.resolveComponentFactory(WidgetsgridsterComponent);
        // });
    }

}
