import {
    Component, ElementRef, EventEmitter, Inject, Output, ViewChild,
    Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
    ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, Input, AfterViewInit, ViewChildren, QueryList, ComponentFactoryResolver, Compiler
} from "@angular/core";
import { ConductUniqueDetailComponent } from "@snovasys/snova-audits-module";

import * as _ from "underscore";

import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ProjectModulesService } from '../../services/project.modules.service';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "conduct-unique-page",
    templateUrl: "./conduct-unique-page.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductUniquePageComponent {
    conductView: any = {};

    injector: any;
    isAuditsLoaded: boolean;

    constructor(private compiler: Compiler, private vcr: ViewContainerRef, private ngModuleRef: NgModuleRef<any>, @Inject('ProjectModuleLoader') public projectModulesService: any, private cdRef: ChangeDetectorRef) {
        this.injector = this.vcr.injector;

        this.loadAuditsModule();
    }

    loadAuditsModule() {
        var loader = this.projectModulesService["modules"];
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);

        // var modules = this.projectModulesService["modules"];

        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'AuditsPackageModule' });

        if (!module) {
            console.error("No module found for AuditsPackageModule");
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
            .then((moduleFactory: NgModuleFactory<any>) => {

                const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                var allComponentsInModule = (<any>componentService).components;

                this.ngModuleRef = moduleFactory.create(this.injector);

                var componentDetails = allComponentsInModule.find(elementInArray =>
                    elementInArray.name.toLocaleLowerCase() === "Conduct unique page".toLocaleLowerCase()
                );

                this.conductView = {};
                this.conductView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                this.conductView.inputs = {};
                this.conductView.outputs = {};

                this.isAuditsLoaded = true;
                this.cdRef.detectChanges();
            });
    }
}