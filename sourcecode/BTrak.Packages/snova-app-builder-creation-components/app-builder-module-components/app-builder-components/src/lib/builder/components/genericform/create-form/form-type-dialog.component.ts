import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleFactory, Input, ComponentFactoryResolver } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { FormTypeComponent } from "@thetradeengineorg1/snova-admin-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "form-type-dailog",
    templateUrl: "form-type-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class FormTypeDialogComponent extends CustomAppBaseComponent implements OnInit {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    private ngModuleRef: NgModuleRef<any>;
    outputs: any;
    formTypeComponent: any;
    inputs: any;
    injector: any;

    constructor(
        private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private factoryResolver: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
    }

    onNoClick(): void {
        this.currentDialog.close();
    }   

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var projectModulePath = _.find(modules, function (module: any) { return module.modulePackageName == 'AdminPackageModule' });
        this.formTypeComponent = this.factoryResolver.resolveComponentFactory(FormTypeComponent);
        // this.ngModuleFactoryLoader
        //     .load(projectModulePath.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "Form type");

        //         this.formTypeComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        //     });
    }

}
