import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type, ComponentFactoryResolver } from '@angular/core';
import * as _ from "underscore";
import { WidgetService } from '../services/widget.service';
import { DashboardList } from '../models/dashboardList';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { ProjectModulesService } from '../services/project.modules.service';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-projects-reports-and-settings',
    templateUrl:`projects-reports-and-settings.html`
})
export class ProjectReportsAndSettingsComponent extends CustomAppBaseComponent  implements OnInit {
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
        private vcr: ViewContainerRef,@Inject('ProjectModuleLoader') public projectModulesService: any, private compiler: Compiler) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.projectModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"))
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
