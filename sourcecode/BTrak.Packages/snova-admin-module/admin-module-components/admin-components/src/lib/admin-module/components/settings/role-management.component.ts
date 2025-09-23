import { Component, OnInit, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleFactory, ComponentFactoryResolver, ChangeDetectorRef, Compiler } from "@angular/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { RolePermissionsComponent } from "@thetradeengineorg1/snova-role-management";
import { AdminModulesService } from "../../services/admin.module.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-roles-management',
    templateUrl: 'role-management.component.html'
})
export class RoleManagementComponent extends CustomAppBaseComponent {

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    inputs: any;
    outputs: any;
    roleMangementComponent: any;

    constructor(private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef, private cdRef: ChangeDetectorRef,
        private compiler: Compiler, private adminModulesService: AdminModulesService) {
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
        var component = "Role permissions";
        var module = _.find(modules, function (module) { return module.modulePackageName == 'RoleManagementPackageModule' });
        if (!module) {
            console.error("No module found for RoleManagementPackageModule");
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

                    this.roleMangementComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //   .load(module.moduleLazyLoadingPath)
        // //   .then((moduleFactory: NgModuleFactory<any>) => {

        // //     const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        // //     var allComponentsInModule = (<any>componentService).components;

        // //     this.ngModuleRef = moduleFactory.create(this.injector);

        // //     var componentDetails = allComponentsInModule.find(elementInArray =>
        // //       elementInArray.name === "Role permissions"
        // //     );

        //     this.roleMangementComponent = this.ngModuleFactoryLoader.resolveComponentFactory(RolePermissionsComponent);
        //   // });
    }
}
