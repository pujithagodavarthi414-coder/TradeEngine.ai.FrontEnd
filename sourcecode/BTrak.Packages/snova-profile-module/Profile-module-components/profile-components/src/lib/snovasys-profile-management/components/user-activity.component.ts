import { Component, ChangeDetectionStrategy, OnInit, NgModuleFactoryLoader, NgModuleFactory, Type, NgModuleRef, ViewContainerRef, ChangeDetectorRef, Input, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ProfileModulesService } from "../services/profile.modules.service";
import * as _ from "underscore";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { TranslateService } from '@ngx-translate/core';
import { ProjectManagementComponentsModule } from '@thetradeengineorg1/snova-project-management';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "app-pm-component-user-activity",
    templateUrl: "user-activity.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserActivityComponent extends CustomAppBaseComponent implements OnInit {
    injector: any;
    userActivity: any;
    outputs: any;
    selectedUserId: string;
    componentInputs = {
        isFromActivity: true,
        isFromUserActivity: true,

    };
    dashboardFilters: DashboardFilterModel;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
        this.loadProjectModule();
    }
    constructor(private profileModulesService: ProfileModulesService,
        //private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private factoryResolver: ComponentFactoryResolver,
        private ngModuleRef: NgModuleRef<any>,
        private vcr: ViewContainerRef,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private cookieService: CookieService,
        private compiler: Compiler) {
        super();
        this.injector = this.vcr.injector;
        if (this.router.url.split("/")[3]) {
            this.selectedUserId = this.router.url.split("/")[3];
        } else {
            this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this.loadProjectModule();
    }

    loadProjectModule() {
        var loader = this.profileModulesService["modules"];
        var component = "Goal Activity"
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
                    this.userActivity = {};
                    this.userActivity.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);;
                    this.userActivity.inputs = {
                        isFromUserActivity: true,
                        userId: this.selectedUserId,
                        isFromActivity: true,
                        dashboardFiltersFromProfile: this.dashboardFilters
                    }
                    this.cdRef.detectChanges();

                    // do something with the module...
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
        //             elementInArray.name.toLocaleLowerCase() === component.toLocaleLowerCase()
        //         );
        //         this.userActivity = {};
        //         this.userActivity.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);;
        //         this.userActivity.inputs = {
        //             isFromUserActivity: true,
        //             userId: this.selectedUserId,
        //             isFromActivity: true,
        //             dashboardFiltersFromProfile: this.dashboardFilters
        //         }
        //         this.cdRef.detectChanges();
        //     });

        // this.userActivity.inputs = {
        //                 isFromUserActivity: true,
        //                 userId: this.selectedUserId,
        //                 isFromActivity: true,
        //                 dashboardFiltersFromProfile: this.dashboardFilters
        //             }
        //             this.cdRef.detectChanges();
    }

}