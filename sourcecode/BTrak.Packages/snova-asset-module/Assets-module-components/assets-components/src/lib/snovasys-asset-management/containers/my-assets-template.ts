import { Component, OnInit, NgModuleFactoryLoader, Inject, NgModuleRef, ViewContainerRef, ComponentFactoryResolver, Compiler } from "@angular/core";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { NgModuleFactory, Type } from '@angular/core';
import * as _ from "underscore";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { AssetModulesService } from "../services/asset.module.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: 'app-myassets',
  templateUrl: 'my-assets-template.html',
})

export class MyAssetsComponent extends CustomAppBaseComponent implements OnInit {

  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  inputs: any;
  outputs: any;
  myAssetsComponent: any;

  constructor(
    private ngModuleFactoryLoader: ComponentFactoryResolver,
    private vcr: ViewContainerRef, private compiler: Compiler,
    private assetModulesService: AssetModulesService,
  ) {
    super();
  }

  ngOnInit() {
    this.injector = this.vcr.injector;
    super.ngOnInit();
    this.loadComponent();
  }

  loadComponent() {
    var loader = this.assetModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProfileManagementModule' });

    if (!module) {
      console.error("No module found for ProfileManagementModule");
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
        // const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        var allComponentsInModule = (<any>componentService).components;

        this.ngModuleRef = moduleFactory.create(this.injector);

        var componentDetails = allComponentsInModule.find(elementInArray =>
          elementInArray.name === "My assets"
        );

        this.myAssetsComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
      });
  }

}