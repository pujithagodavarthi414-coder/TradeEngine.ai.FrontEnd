import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, Output, EventEmitter, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import { ShellModulesService } from '../../services/shell.modules.service';
import * as _ from "underscore";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-feed-time',
    templateUrl: 'feed-time.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class FeedTimeComponent extends CustomAppBaseComponent implements OnInit {

    componentInputs = {
        isFeedTimeSheet: false
    };
    @Input("isFeedTimeSheet")
    set _isFeedTimeSheet(data: boolean) {
        if (data != undefined && data != null) {
            this.componentInputs = {
                isFeedTimeSheet: data
            };
            this.loadComponent();
        }
    }

    outputs = {
        closeFeedTimeSheetPopup: () => this.closeFeedTimeSheet()
    };

    @Output() closeFeedTimeSheetPopup = new EventEmitter<string>();
    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    feedTimeComponent: any;

    constructor(
        private projectModulesService: ShellModulesService, private compiler: Compiler,
        private vcr: ViewContainerRef) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
    }

    closeFeedTimeSheet() {
        this.closeFeedTimeSheetPopup.emit();
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

