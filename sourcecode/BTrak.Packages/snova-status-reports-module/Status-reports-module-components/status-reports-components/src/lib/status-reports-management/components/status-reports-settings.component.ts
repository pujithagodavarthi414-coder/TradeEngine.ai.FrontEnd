import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, ChangeDetectorRef, ComponentFactoryResolver } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { WidgetService } from '../services/widget.service';
import { DashboardList } from '../models/dashboardList';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { CustomAppsListViewComponent } from '@snovasys/snova-widget-module';
import { Compiler } from '@angular/core';
import { StatusreportService } from '../services/statusreport.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { StatusReportsModuleService } from '../services/statusreports.modules.service';





type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-status-reports-settings',
    templateUrl: `status-reports-settings.component.html`,
    encapsulation: ViewEncapsulation.None,
})

export class StatusReportsSettingsComponent extends CustomAppBaseComponent implements OnInit {

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
        private factoryResolver: ComponentFactoryResolver,
        private widgetService: WidgetService,
        private cdRef: ChangeDetectorRef,
        private statusreportService : StatusReportsModuleService,
        private compiler : Compiler,
        private vcr: ViewContainerRef) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        
        //this.GetCustomizedDashboardIdForStatusReports();
        this.loadComponent();
    }

    loadComponent() {
        //var modules = JSON.parse(localStorage.getItem("Modules"))
        //var module = _.find(modules, function(module){ return module.modulePackageName == 'WidgetPackageModule' });
        //this.widgetGridComponent = this.factoryResolver.resolveComponentFactory(CustomAppsListViewComponent);

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

        
        var loader = this.statusreportService["modules"];
           var component = "Custom apps view"
           var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
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
               .then(moduleFactory => {
                   try {
                       const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
   
                       var allComponentsInModule = (<any>componentService).components;
   
                       this.ngModuleRef = moduleFactory.create(this.injector);
   
                       var componentDetails = allComponentsInModule.find(elementInArray =>
                           elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
                       );
                       
                       this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                       // do something with the module...
                   } catch (err) {
                       throw err;
                   }
               });
    }

    // GetCustomizedDashboardIdForStatusReports() {
    //     this.dashboardFilter = new DashboardFilterModel();
    //     const dashboardModel = new DashboardList();
    //     dashboardModel.isCustomizedFor = "StatusReports";
    //     this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
    //       if (result.success === true) {
    //         this.selectedWorkspaceIdForStatusReports = result.data;
    //         this.componentInputs.selectedWorkspaceId=this.selectedWorkspaceIdForStatusReports;
    //         this.cdRef.markForCheck();
    //       }

    //     });
    //   }

    
  
}
