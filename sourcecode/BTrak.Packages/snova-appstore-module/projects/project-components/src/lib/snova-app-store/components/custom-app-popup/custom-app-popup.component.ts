import {
  Component, ElementRef, EventEmitter, Inject, Output, ViewChild, Type, NgModuleFactoryLoader, NgModuleFactory, NgModuleRef,
  ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, Input, Compiler
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { DragedWidget } from '../../dependencies/models/dragedWidget';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import * as _ from 'underscore';
import { AppStoreModulesService } from '../../dependencies/services/app-store.modules.service';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import { modules } from '../../../globaldependencies/constants/module';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";

@Component({
  selector: 'custom-app-popup',
  templateUrl: './custom-app-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class CustomAppPopUpComponent extends CustomAppBaseComponent {

  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      this.draget = data[0].dragedWidget;
      this.currentDialogId = data[0].dialogId;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      this.loadWidgetModule();
    }
  }
  currentDialog: any;
  currentDialogId: any;
  draget: DragedWidget;
  private ngModuleRef: NgModuleRef<any>;
  injector: any;
  dashboard: any
  loaded: boolean = false;
  @Output() closeMatDialog = new EventEmitter<string>();
  @Output() refreshSoftLabes = new EventEmitter<any>();

  constructor(public AppDialog: MatDialogRef<CustomAppPopUpComponent>,
    private compiler: Compiler,
    private ngModuleFactoryLoader: NgModuleFactoryLoader, public dialog: MatDialog,
    private vcr: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    @Inject('AppStoreModuleLoader') public appStoreModulesService: any,
    public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
    //this.draget = data;
    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    this.injector = this.vcr.injector;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onNoClick(): void {
    //this.AppDialog.close();
    if (this.draget.name == "Soft label configuration") {
      this.refreshSoftLabes.emit(true);
    }
    this.currentDialog.close();
  }

  // closePopUp() {
  //     this.AppDialog.close();
  // }

  outputs = {
    closePopUp: (close) => {
      //this.AppDialog.close();
      if (close) {
        this.dialog.closeAll();
      }
      this.currentDialog.close();
    }
  }

  loadWidgetModule() {
    var loader = this.appStoreModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
    var module: any = _.find(modules, function (module) {
      var widget = _.find(module['apps'], function (app) { return app['componentName'].toLowerCase() == "widgetsgridstercomponent" });
      if (widget) {
        return true;
      }
      return false;
    })
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

        // var componentDetails = allComponentsInModule.find(elementInArray =>
        //   elementInArray.name === "custom component"
        // );

        const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(allComponentsInModule[0].componentTypeObject);
        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          fromRoute: true,
          isWidget: false,
          selectedApps: this.draget
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

}