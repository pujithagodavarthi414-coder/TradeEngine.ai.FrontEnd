import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { ProfileModulesService } from '../../services/profile.modules.service';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { WidgetsgridsterComponent } from '@thetradeengineorg1/snova-widget-module';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-profile-gridster',
    templateUrl: 'app-profile-gridster.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class AppProfileGridsterComponent extends CustomAppBaseComponent implements OnInit {

    componentInputs = {
        reloadDashboard: null,
        fromRoute: null,
        isListView: null,
        selectedApps: null,
        dashboardFilters: null,
        filterApplied: null,
        selectedWorkspaceId: null,
        isWidget: null,
        dashboardGlobalData: null
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
        private compiler: Compiler,
        //private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private factoryResolver: ComponentFactoryResolver,
        private profileModulesService: ProfileModulesService,
        private vcr: ViewContainerRef) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.profileModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
        var module = _.find(modules, function(module: any){ return module.modulePackageName == 'WidgetPackageModule' });

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
                    elementInArray.name === "Custom Widget"
                );

                this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }

}
