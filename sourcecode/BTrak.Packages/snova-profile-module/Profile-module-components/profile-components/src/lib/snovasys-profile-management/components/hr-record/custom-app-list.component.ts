import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { ProfileModulesService } from '../../services/profile.modules.service';
import { CustomAppsListViewComponent } from '@thetradeengineorg1/snova-widget-module';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-profile-app-list',
    templateUrl: 'custom-app-list.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class ProfileAppListComponent extends CustomAppBaseComponent implements OnInit {

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
        private compiler: Compiler,
       // private ngModuleFactoryLoader: NgModuleFactoryLoader,
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
                    elementInArray.name === "Custom apps view"
                );

                this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }

}
