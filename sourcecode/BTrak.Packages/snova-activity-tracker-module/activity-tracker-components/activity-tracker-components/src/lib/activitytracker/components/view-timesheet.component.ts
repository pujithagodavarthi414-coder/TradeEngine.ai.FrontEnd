import { ChangeDetectorRef,Component,NgModuleFactory, ComponentFactoryResolver, NgModuleRef, OnInit, Type, ViewContainerRef,Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { ViewTimeSheetComponent } from '@snovasys/snova-timesheet';
import { ActivityTrackerModuleService } from '../services/activitytracker.module.services';


type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-time-sheet-tracker-component',
    templateUrl: `view-timesheet.component.html`
})

export class ViewTrackerTimeSheetComponent extends CustomAppBaseComponent implements OnInit {

    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    timesheetComponent: any;
    widgetListinputs: any;
    outputs: any;

    constructor(private factoryResolver: ComponentFactoryResolver, private vcr: ViewContainerRef,private compiler:Compiler,
        private activityTrackerModuleService :ActivityTrackerModuleService, private cdref:ChangeDetectorRef) {
        super();
    }
    ngOnInit() {
        super.ngOnInit();
        this.injector = this.vcr.injector;
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.activityTrackerModuleService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var projectModulePath = _.find(modules, function (module) { return module['modulePackageName'] == 'TimesheetPackageModule' });
        var component = "Time sheet"
        var module = _.find(modules, function (module) { return module.modulePackageName == 'TimesheetPackageModule' });
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

                    this.timesheetComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
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

                // // this.ngModuleRef = moduleFactory.create(this.injector);

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name === "Time sheet");

                // this.timesheetComponent = this.factoryResolver.resolveComponentFactory(ViewTimeSheetComponent);
            // });
    }
}