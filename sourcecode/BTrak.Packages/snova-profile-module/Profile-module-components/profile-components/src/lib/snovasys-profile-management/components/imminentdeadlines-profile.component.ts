import { Component, OnInit, ViewEncapsulation, NgModuleRef, NgModuleFactoryLoader, Inject, ViewContainerRef, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import { ProfileModulesService } from '../services/profile.modules.service';
import * as _ from "underscore";
import { ImminentDeadlinesComponent } from '@thetradeengineorg1/snova-dashboard-module';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: 'app-dashboard-component-imminentdeadlines',
  templateUrl: 'imminentdeadlines-profile.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class ImminentDeadlinesProfileComponent extends CustomAppBaseComponent implements OnInit {

  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  inputs: any;
  outputs: any;
  employeeimminentDeadlinesReportComponent: any;

  constructor(
    private compiler: Compiler,
    //private ngModuleFactoryLoader: NgModuleFactoryLoader,
    private factoryResolver: ComponentFactoryResolver,
    private profileModulesService: ProfileModulesService,
    private vcr: ViewContainerRef) {
    super();
  }

  ngOnInit() {
    this.injector = this.vcr.injector;
    super.ngOnInit();
    this.loadComponent();
  }

  loadComponent() {
    var loader = this.profileModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'DashboardPackageModule' });

    if (!module) {
      console.error("No module found for DashboardPackageModule");
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
          elementInArray.name === "Imminent deadlines"
        );

        this.employeeimminentDeadlinesReportComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
      });
  }

}
