import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, Compiler, ChangeDetectorRef } from '@angular/core';

import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { AppBaseComponent } from '../componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { WidgetService } from '../../services/widget.service';
import { BiilingwidgetModulesService } from '../../services/billing-widgets.module.service';


type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-dynamic-widget-component',
    templateUrl:`dynamic-widget-component.html`,
    encapsulation: ViewEncapsulation.None
})
export class DynamicWidgetComponent extends AppBaseComponent  implements OnInit {
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForStatusReports:string;
    loaded: boolean = false;
    componentInputs = {
        selectedApps: null,
        selectedWorkspaceId: null
    };

    selectedApps: any;
    @Input("selectedApps")
    set _selectedApps(data: any) {
        this.componentInputs.selectedApps = data;
    }

    selectedWorkspaceId: string;
    @Input("selectedWorkspaceId")
    set _selectedWorkspaceId(data: string) {
        this.componentInputs.selectedWorkspaceId = data;
    }

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    outputs: any;
    widgetGridComponent: any;

    constructor(
        private ngModuleFactoryLoader: NgModuleFactoryLoader,private biilingwidgetModulesService:BiilingwidgetModulesService,
        private compiler : Compiler,
        private widgetService: WidgetService,
        private cdRef: ChangeDetectorRef,
        private vcr: ViewContainerRef) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.biilingwidgetModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"))
        var component = "Custom apps view";
        var module = _.find(modules, function(module){ return module.modulePackageName == 'WidgetPackageModule' });
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
                    this.loaded = true;
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "Custom apps view"
        //         );

        //         this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        //     });
    }

}