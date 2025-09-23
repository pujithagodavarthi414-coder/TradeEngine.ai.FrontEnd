import { Component, OnInit, Input, OnChanges, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, Inject, NgModuleFactory, Type, ComponentFactoryResolver, Compiler } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ProfileModulesService } from '../services/profile.modules.service';
import * as _ from "underscore";
import { WorkAllocationSummaryChartComponent } from '@thetradeengineorg1/snova-dashboard-module';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
  selector: 'app-profile-component-workallocationchart-profile',
  templateUrl: './workallocation-summary-chart-profile.component.html'
})

export class WorkAllocationSummaryChartProfileComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(info: DashboardFilterModel) {
    if (info && info !== undefined) {
      this.dashboardFilters = info;
      this.filtersApplied();
    }
  }

  @Input("isFromDashboard")
  set _isFromDashboard(data: boolean) {
    if (data && data !== undefined) {
      this.isFromDashboard = data;
      this.filtersApplied();
    }
  }

  isFromDashboard = false;
  dashboardFilters: DashboardFilterModel;

  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  inputs: any;
  outputs: any;
  employeeimminentDeadlinesReportComponent: any;

  constructor(
    private compiler: Compiler,
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

  filtersApplied() {
    this.inputs = {
      isFromDashboard: this.isFromDashboard,
      dashboardFilters: this.dashboardFilters
    }
  }

  loadComponent() {
    var loader = this.profileModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    var module = _.find(modules, function (module: any) { return module.modulePackageName == 'DashboardPackageModule' });

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
          elementInArray.name === "Work allocation summary"
        );

        this.employeeimminentDeadlinesReportComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
      });
  }
}
