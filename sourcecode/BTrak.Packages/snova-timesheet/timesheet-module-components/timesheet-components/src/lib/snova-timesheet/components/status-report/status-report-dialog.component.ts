import { Component, EventEmitter, Inject, OnInit, Output, Type, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, NgModuleFactory, Input, ComponentFactoryResolver, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from "underscore";
import { TimesheetModuleService } from '../../services/timesheet.modules.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { StatusReportingComponent } from "@snovasys/snova-status-reports-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "status-report-dailogue",
    templateUrl: "status-report-dialog.component.html"
})

export class StatusReportDialogComponent extends CustomAppBaseComponent implements OnInit {
    @Output() closeReportsSheetPopup = new EventEmitter<any>();
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];

            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    outputs = {
        closeStatusReportPopup: () => this.onNoClick()
    };

    private ngModuleRef: NgModuleRef<any>;
    allWorkItemsoutputs: any;
    allWorkitemsComponent: any;
    widgetListinputs: any;
    injector: any;
    statusReportComponent: any;
    componentInputs = {};
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(
        //private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private factoryResolver: ComponentFactoryResolver,
        private timesheetModuleService: TimesheetModuleService,
        public dialog: MatDialog,
        private compiler : Compiler,
        private vcr: ViewContainerRef,
        public reportsDialog: MatDialogRef<StatusReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) {
        super();
    }


    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    loadComponent() {
        // var modules = this.timesheetModuleService["modules"];
        //var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
       // var statusReportModulePath = _.find(modules, function (module) { return module['modulePackageName'] == 'StatusReportPackageModule' });
       // this.statusReportComponent = this.factoryResolver.resolveComponentFactory(StatusReportingComponent);
        // this.ngModuleFactoryLoader
        //     .load(statusReportModulePath['moduleLazyLoadingPath'])
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
        //         var allComponentsInModule = (<any>componentService).components;
        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "Status reporting"
        //         );
        //         this.statusReportComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        //     });

        var loader = this.timesheetModuleService["modules"];
        var component = "Status reporting"
        var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'StatusReportPackageModule' });

        if (!module) {
            console.error("No module found for StatusReportPackageModule");
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
                    
                    this.statusReportComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    // do something with the module...
                } catch (err) {
                    throw err;
                }
            });
    }

    onNoClick(): void {
        this.currentDialog.close();
        this.closeReportsSheetPopup.emit(true);
    }
}
