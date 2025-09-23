import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef,  ViewContainerRef, NgModuleFactory, Input, ComponentFactoryResolver, ChangeDetectorRef, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ApplicationCategoryComponent } from "@snovasys/snova-activity-tracker-widgets";

import * as _ from "underscore";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { ActivityTrackerModuleService } from "../../services/activitytracker.module.services";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-category-dailog",
    templateUrl: "applicaton-category-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})


export class CreateAppCategoryDialogComponent extends CustomAppBaseComponent implements OnInit {

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
    applicationsComponent: any;
    inputs: any;
    injector: any;

    constructor(
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,private compiler:Compiler,
        private activityTrackerModuleService :ActivityTrackerModuleService, private cdref:ChangeDetectorRef,
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
        var loader = this.activityTrackerModuleService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var projectModulePath = _.find(modules, function (module) { return module['modulePackageName'] == 'ActivityTrackerWidgetPackageModule' });
        var component = "Application category"
        var module = _.find(modules, function (module) { return module.modulePackageName == 'ActivityTrackerWidgetPackageModule' });
        if (!module) {
            console.error("No module found for TimesheetPackageModule");
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

                    this.applicationsComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.cdref.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // this.ngModuleFactoryLoader
        //     .load(projectModulePath['moduleLazyLoadingPath'])
        //     .then((moduleFactory: NgModuleFactory<any>) => {

                // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                // var allComponentsInModule = (<any>componentService).components;

                // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name === "Application category");

                // this.applicationsComponent = this.ngModuleFactoryLoader.resolveComponentFactory(ApplicationCategoryComponent);
            // });
    }

}
