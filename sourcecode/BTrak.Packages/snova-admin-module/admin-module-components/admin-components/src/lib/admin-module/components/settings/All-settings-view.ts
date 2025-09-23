import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, ComponentFactoryResolver, ChangeDetectorRef, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { AdminModulesService } from "../../services/admin.module.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-All-Settings-View',
    templateUrl: `All-settings-view.html`,
    encapsulation: ViewEncapsulation.None,
})

export class AllSettingsViewComponent extends CustomAppBaseComponent implements OnInit {

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
        // private profileModulesService: ProfileModulesService,
        private adminModulesService: AdminModulesService,
        private cdRef: ChangeDetectorRef,
        private compiler: Compiler,
        private vcr: ViewContainerRef) {
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
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });

        // // this.ngModuleFactoryLoader
        // //     .load(module.moduleLazyLoadingPath)
        // //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         // var allComponentsInModule = (<any>componentService).components;

        //         // this.ngModuleRef = moduleFactory.create(this.injector);

        //         // var componentDetails = allComponentsInModule.find(elementInArray =>
        //         //     elementInArray.name === "Custom apps view"
        //         // );

        //         this.widgetGridComponent = this.ngModuleFactoryLoader.resolveComponentFactory(CustomAppsListViewComponent);
        //     // });
    }

}
