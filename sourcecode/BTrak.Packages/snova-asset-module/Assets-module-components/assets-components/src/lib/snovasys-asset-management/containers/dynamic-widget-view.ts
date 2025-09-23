import { Component, OnInit, ViewEncapsulation, NgModuleRef, Inject, ViewContainerRef, Input, ComponentFactoryResolver, Compiler } from '@angular/core';

import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { CustomAppsListViewComponent } from '@snovasys/snova-widget-module';
import { AssetModulesService } from '../services/asset.module.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-dynamic-widget-view',
    templateUrl:`dynamic-widget-view.html`
})
export class DynamicWidgetComponent extends CustomAppBaseComponent  implements OnInit {
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForStatusReports:string;

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
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef, private compiler: Compiler,
        private assetModulesService:AssetModulesService,
        ) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.assetModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"))
        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'WidgetPackageModule' });
    
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
          .then((moduleFactory: NgModuleFactory<any>) => {
    
            const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

            var allComponentsInModule = (<any>componentService).components;

            this.ngModuleRef = moduleFactory.create(this.injector);

            var componentDetails = allComponentsInModule.find(elementInArray =>
                elementInArray.name === "Custom apps view"
            );

            this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        });
        // var modules = JSON.parse(localStorage.getItem("Modules"))
        // var module = _.find(modules, function(module){ return module.modulePackageName == 'WidgetPackageModule' });

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name === "Custom apps view"
                // );

                // this.widgetGridComponent = this.ngModuleFactoryLoader.resolveComponentFactory(CustomAppsListViewComponent);
            // });
    }

}
