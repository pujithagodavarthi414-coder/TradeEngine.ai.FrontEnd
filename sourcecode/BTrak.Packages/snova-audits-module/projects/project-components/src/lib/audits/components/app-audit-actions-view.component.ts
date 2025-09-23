import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, NgModuleFactoryLoader, NgModuleFactory, Type, ViewContainerRef, NgModuleRef, ViewChild, ViewChildren, Input, ComponentFactoryResolver, Compiler } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Subject, Observable } from 'rxjs';
import * as _ from "underscore";
import "../../globaldependencies/helpers/fontawesome-icons";
import * as auditModuleReducer from "../store/reducers/index";
import { State } from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditModulesService } from '../services/audit.modules.service';
import { SatPopover } from '@ncstate/sat-popover';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { AllWorkItemsComponent } from '@snovasys/snova-project-management';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: 'app-audit-actions-view',
    templateUrl: './app-audit-actions-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddAuditActionsViewComponent extends AppFeatureBaseComponent implements OnInit {
    public ngDestroyed$ = new Subject();
    @ViewChildren("addActionPopover") addActionPopover;

    @Input("loadProjectModule")
    set _loadProjectModule(data: string) {
        if (data) {
            this.loadProjectModule();
        }
    }
    actionsCount$: Observable<number>;
    injector: any;
    private ngModuleRef: NgModuleRef<any>;
    projectModuleLoaded: boolean = false;
    widgetGridComponent: any;
    componentInputs = {
        notFromAudits: false
    };
    loadAction: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>,
        private ngModuleFactoryLoader: ComponentFactoryResolver,
        private auditModulesService: AuditModulesService,
        private actionUpdates$: Actions,
        private  compiler: Compiler,
        private cdRef: ChangeDetectorRef,
        private vcr: ViewContainerRef, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.getAuditRelatedCounts();
        this.loadProjectModule();
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
        this.injector = this.vcr.injector;
    }

    getAuditRelatedCounts() {
        this.actionsCount$ = this.store.pipe(select(auditModuleReducer.getActionsCount));
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    loadProjectModule() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);
        var loader = this.auditModulesService["modules"];
        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'ProjectPackageModule' });
        var component = "All work items";
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

                    this.widgetGridComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.projectModuleLoaded = true;
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name.toLocaleLowerCase() === "All work items".toLocaleLowerCase()
        //         );

                // this.widgetGridComponent = this.ngModuleFactoryLoader.resolveComponentFactory(AllWorkItemsComponent);
                // this.projectModuleLoaded = true;
                // this.cdRef.detectChanges();
            // });
    }


    openAddActionPopover(addActionPopover) {
        this.loadAction = true;
        addActionPopover.openPopover();
    }

    closeActionPopover() {
        this.addActionPopover.forEach((p) => p.closePopover());
        this.loadAction = false;
        this.loadProjectModule();
    }

}