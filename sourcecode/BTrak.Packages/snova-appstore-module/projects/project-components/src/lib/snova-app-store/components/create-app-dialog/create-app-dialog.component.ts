import { Component, Inject, EventEmitter, Output, Type, NgModuleFactoryLoader, ViewContainerRef, ChangeDetectorRef, NgModuleFactory, NgModuleRef, Input, Compiler } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomTagModel } from "../../dependencies/models/customTagModel";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { AppStoreModulesService } from '../../dependencies/services/app-store.modules.service';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from 'underscore';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "create-app-dialog",
    templateUrl: "create-app-dialog.component.html"
})

export class CreateAppDialogComponet extends CustomAppBaseComponent {


    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.selectedAppIdForEdit = data[0].appId;
            this.fromSearch = data[0].fromSearch;
            this.tagSearchText = data[0].tag;
            this.isHtmlApp = data[0].isForHtmlApp;
            this.tagModel = data[0].tagModel;
            this.appType = data[0].appType;
            this.currentDialogId = data[0].dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.loadCustomAppCreationComponent();
        }
    }
    currentDialog: any;
    currentDialogId: any;
    private ngModuleRef: NgModuleRef<any>;
    injector: any;
    component: any
    loaded: boolean = false;
    selectedAppIdForEdit: string;
    isHtmlApp: boolean;
    tagSearchText: string;
    fromSearch: string;
    tagModel: CustomTagModel;
    appType: number;
    inputs: any;
    outputs: any;
    @Output() isReloadRequired = new EventEmitter<boolean>();
    constructor(
        private compiler: Compiler,
        public CreateAppDialog: MatDialogRef<CreateAppDialogComponet>,
        public dialog: MatDialog,
        private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private vcr: ViewContainerRef,
        private cdRef: ChangeDetectorRef,
        @Inject('AppStoreModuleLoader') public appStoreModulesService: any,
        public routes: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        this.injector = this.vcr.injector;
    }

    ngOnInIt() {
        super.ngOnInit();
    }

    onNoClick(isReload): void {
        if (isReload === true) {
            this.isReloadRequired.emit(isReload);
        }
        //this.CreateAppDialog.close();
        this.currentDialog.close();
    }

    loadCustomAppCreationComponent() {
        var loader = this.appStoreModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem(LocalStorageProperties.Modules));
        let componentToBeRenderer = "";
        if (this.isHtmlApp == false && this.appType == null) {
            componentToBeRenderer = "AddCustomWidgetComponent";
        } else if (this.isHtmlApp == true && this.appType == null) {
            componentToBeRenderer = "AddCustomHtmlAppComponent";
        } else if (this.appType == 3) {
            componentToBeRenderer = "NewProcessWidgetComponent";
        }

        var module: any = _.find(modules, function (module) {
            var widget = _.find(module['apps'], function (app) { return app['componentName'].toLowerCase() == componentToBeRenderer.toLowerCase() });
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


                var componentDetails = allComponentsInModule.find(elementInArray =>
                    elementInArray.name.toLowerCase() === componentToBeRenderer.toLowerCase()
                );

                const factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                this.component = {};
                this.component = factory;
                this.inputs = {
                    selectedAppId: this.selectedAppIdForEdit,
                    tagModel: this.tagModel,
                    isPopUp: this.isHtmlApp == false && this.appType == null ? true : null,
                    fromSearch: true,
                    tagSearchText: this.tagSearchText
                }
                this.outputs = {
                    closeDialog: (data) => this.onNoClick(data)
                }

                this.loaded = true;
                this.cdRef.detectChanges();
            })
    }
}
