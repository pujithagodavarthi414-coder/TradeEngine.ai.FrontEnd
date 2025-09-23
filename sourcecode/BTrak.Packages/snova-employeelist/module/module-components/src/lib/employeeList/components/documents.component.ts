import { Component, OnInit, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleFactory, ComponentFactoryResolver, Compiler } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { DocumentStoreComponent, StoreManagementComponent } from "@snovasys/snova-document-management";
import { EmployeeModulesService } from "../services/employee_module.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-doc-component',
    templateUrl: 'documents.component.html'
})
export class documentsComponent extends CustomAppBaseComponent implements OnInit {

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    inputs: any;
    outputs: any;
    documentMangementComponent: any;

    constructor(private compiler: Compiler, private vcr: ViewContainerRef,private projectModulesService: EmployeeModulesService) {
        super();
        this.loadComponent();

    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }
    loadComponent() {
        var loader = this.projectModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"))
        var module = _.find(modules, function (module) { return module.modulePackageName == 'DocumentManagementPackageModule' });
        
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
            }).then((moduleFactory: NgModuleFactory<any>) => {

            const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

            var allComponentsInModule = (<any>componentService).components;

            this.ngModuleRef = moduleFactory.create(this.injector);

            var componentDetails = allComponentsInModule.find(elementInArray =>
              elementInArray.name === "Store management"
            );

            this.documentMangementComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
          });
    }
}
