import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleFactory, ComponentFactoryResolver, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ShellModulesService } from '../../services/shell.modules.service';
import * as _ from "underscore";
import { FeedtimesheetComponentProfile } from "@thetradeengineorg1/snova-timesheet";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "feed-time-dailogue",
    templateUrl: "feed-time-dialog.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class FeedTimeDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();

    outputs = {
        closeFeedTimeSheetPopup: () => this.onNoClick()
    };
    private ngModuleRef: NgModuleRef<any>;
    allWorkItemsoutputs: any;
    allWorkitemsComponent: any;
    widgetListinputs: any;
    componentInputs = {
        isFeedTimeSheet: false
    };
    injector: any;
    feedTimeComponent: any;

    constructor(
        private projectModulesService: ShellModulesService, private compiler: Compiler,
        private vcr: ViewContainerRef,
        public reportsDialog: MatDialogRef<FeedTimeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
        this.componentInputs = {
            isFeedTimeSheet: data
        };
    }

    onNoClick(): void {
        this.reportsDialog.close();
        this.closeReportsSheetPopup.emit(true);
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
        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'TimesheetPackageModule' });
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
                    elementInArray.name === "Time punch card"
                );

                this.feedTimeComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }


}
