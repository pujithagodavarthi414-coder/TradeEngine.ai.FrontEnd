import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleFactory, ComponentFactoryResolver, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ShellModulesService } from '../../services/shell.modules.service';
import * as _ from "underscore";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "work-items-dailogue",
    templateUrl: "all-work-items-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class WorkItemsDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();

    private ngModuleRef: NgModuleRef<any>;
    allWorkitemsComponent: any;
    widgetListinputs: any;
    allWorkItemsinputs = {
        isPopup: true
    };
    injector: any;

    allWorkItemsoutputs = {
        closePopUp: event => this.closeDialog(event)
    };

    constructor(
        private projectModulesService: ShellModulesService, private compiler: Compiler,
        private vcr: ViewContainerRef,
        public reportsDialog: MatDialogRef<WorkItemsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
    }

    onNoClick(): void {
        this.reportsDialog.close();
        this.closeReportsSheetPopup.emit(true);
    }

    closeDialog(event) {
        this.reportsDialog.close();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        // var modules = this.shellModulesService["modules"];
        var loader = this.projectModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProjectPackageModule' });
        
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
                    elementInArray.name === "All work items");

                this.widgetListinputs = {
                    isFromMyWork: true,
                    isMyWork: true
                }

                this.allWorkitemsComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }

}
