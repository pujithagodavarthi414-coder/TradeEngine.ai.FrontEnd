import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, Input, Output, EventEmitter, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import { ShellModulesService } from '../../services/shell.modules.service';
import * as _ from "underscore";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-submit-feedback',
    templateUrl: 'submit-feedback.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class FeedBackSubmissionComponent extends CustomAppBaseComponent implements OnInit {

    componentInputs: any;
    outputs = {
        closeDialog: type => this.closeDialogRef(type)
    };

    @Output() closeDialog = new EventEmitter<string>();
    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    shellFeedbackComponent: any;

    constructor(
        private shellModulesService: ShellModulesService,
        private vcr: ViewContainerRef,private projectModulesService: ShellModulesService, private compiler: Compiler) {
        super();
    }

    ngOnInit() {
        this.injector = this.vcr.injector;
        super.ngOnInit();
        this.loadComponent();
    }

    closeDialogRef(data) {
        this.closeDialog.emit(data);
    }

    loadComponent() {
        // var modules = this.shellModulesService["modules"];
        var loader = this.projectModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function (module: any){ return module.modulePackageName == 'FeedbackPackageModule' });
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
                    elementInArray.name === "Feedback comp"
                );

                this.shellFeedbackComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            });
    }

}
