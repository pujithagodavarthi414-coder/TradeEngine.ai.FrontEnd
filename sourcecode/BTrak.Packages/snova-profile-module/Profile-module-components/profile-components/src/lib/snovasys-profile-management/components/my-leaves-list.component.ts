import { Component, OnInit, NgModuleFactoryLoader, ViewContainerRef, Inject, NgModuleRef, ViewEncapsulation, ComponentFactoryResolver, Compiler } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import { ProfileModulesService } from '../services/profile.modules.service';
import * as _ from "underscore";
import { MyLeavesListComponent } from "@thetradeengineorg1/snova-leave-management";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: 'app-my-leaves-list-profile',
  templateUrl: 'my-leaves-list.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class MyLeavesListProfileComponent extends CustomAppBaseComponent implements OnInit {

  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  inputs: any;
  outputs: any;
  myleavesComponent: any;

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
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'LeavesManagementPackageModule' });

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
      .then((moduleFactory: NgModuleFactory<any>) => {

        const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        var componentDetails = allComponentsInModule.find(elementInArray =>
          elementInArray.name === "My leaves list"
        );

        this.myleavesComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
      });
  }
}