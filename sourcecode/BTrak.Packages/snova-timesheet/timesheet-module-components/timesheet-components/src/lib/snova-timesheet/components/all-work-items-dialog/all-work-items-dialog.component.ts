import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleFactory, Input, ComponentFactoryResolver, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { AllWorkItemsComponent } from "@snovasys/snova-project-management";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

import { TimesheetModuleService } from "../../services/timesheet.modules.service";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";


@Component({
    selector: "work-items-dailogue",
    templateUrl: "all-work-items-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class WorkItemsDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];

            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    private ngModuleRef: NgModuleRef<any>;
    allWorkItemsoutputs: any;
    allWorkitemsComponent: any;
    widgetListinputs: any;
    allWorkItemsinputs = {
        isPopup: true
    };
    injector: any;
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(
       // private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private vcr: ViewContainerRef,
        private factoryResolver: ComponentFactoryResolver,
        public dialog: MatDialog,
        private compiler: Compiler,
        public timesheetModuleService:TimesheetModuleService,
        public reportsDialog: MatDialogRef<WorkItemsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
    }

    onNoClick(): void {
        this.currentDialog.close();
        this.closeReportsSheetPopup.emit(true);
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        // var modules = this.shellModulesService["modules"];
        //var modules = JSON.parse(localStorage.getItem("Modules"));
        //var projectModulePath = _.find(modules, function (module) { return module['modulePackageName'] == 'ProjectPackageModule' });
        //this.allWorkitemsComponent = this.factoryResolver.resolveComponentFactory(AllWorkItemsComponent);
        // this.ngModuleFactoryLoader
        //     .load(projectModulePath['moduleLazyLoadingPath'])
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "All work items"
        //         );

        //         this.allWorkitemsComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        //     });

   
        var loader = this.timesheetModuleService["modules"];
        var component = "All work items"
        var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProjectPackageModule' });

        if (!module) {
            console.error("No module found for ProjectPackageModule");
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
                    
                    this.allWorkitemsComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    // do something with the module...
                } catch (err) {
                    throw err;
                }
            });

    }

}
