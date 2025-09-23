import { Component, OnInit, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleFactory, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { EntityPermissionsComponent } from "@snovasys/snova-role-management";
import { ProjectModulesService } from "../services/project.modules.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-projects-roles',
    templateUrl: 'project-roles.component.html'
})
export class ProjectRolesComponent extends CustomAppBaseComponent implements OnInit {

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    inputs: any;
    outputs: any;
    entityRoleMangementComponent: any;

    constructor(private ngModuleFactoryLoader: NgModuleFactoryLoader, private factoryResolver: ComponentFactoryResolver, private vcr: ViewContainerRef,
        @Inject('ProjectModuleLoader') public projectModulesService: any, private compiler: Compiler) {
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
        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'RoleManagementPackageModule' });

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
                    elementInArray.name === "Project role permissions"
                );

                this.entityRoleMangementComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }
}
