import { Component, OnInit, Inject, Input, Output, EventEmitter, OnDestroy, ComponentFactoryResolver, NgModuleFactory, Type, NgModuleRef, ViewContainerRef, Compiler, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { UserStory } from "../../models/userStory";
import * as _ from "underscore";
import { DashboardModulesService } from "../../services/dashboard.module.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "unique-userstory-dialog",
    templateUrl: "unique-userstory-dialog.component.html"
})
export class UniqueUserstorysDialogComponent implements OnInit, OnDestroy {

    private ngModuleRef: NgModuleRef<any>;
    @Output() afterClosed = new EventEmitter<string>();

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.userStory = this.matData.userStory;
                this.notFromAudits = (this.matData.notFromAudits != null && this.matData.notFromAudits != undefined) ? this.matData.notFromAudits : true;
                this.isFromBugsCount = this.matData != null && this.matData != undefined ? this.matData.isFromBugsCount : false;
                if (this.userStory.isSprintUserStory == true) {
                    this.isFromSprints = true;
                } else {
                    this.isFromSprints = false;
                }
                if (this.matData.isFromSprints) {
                    this.isFromSprints = data.isFromSprints;
                }
            }
        }
    }

    userStory: UserStory;
    toggleUserStory: string;
    isFromSprints: boolean;
    notFromAudits: boolean;
    isFromBugsCount: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    injector: any;
    widgetListinputs: any;
    uniquePageComponent: any;
    filterData: any;

    outputs = {
        toggleUserStory: event => this.getToggleUserStory(event),
        closeUniqueUserStory: () => this.getCloseUniqueUserStory()
    };

    constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UniqueUserstorysDialogComponent>,
        private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef, private compiler: Compiler, private cdRef: ChangeDetectorRef,private dashboardModulesService:DashboardModulesService) {

        if (Object.keys(data).length) {
            this.userStory = data.userStory;

            if (data.dialogId) {
                this.currentDialogId = this.data.dialogId;
                this.id = setTimeout(() => {
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                }, 1200)
            }

            this.notFromAudits = (data.notFromAudits != null && data.notFromAudits != undefined) ? data.notFromAudits : true;
            this.isFromBugsCount = data != null && data != undefined ? data.isFromBugsCount : false;
            if (this.userStory && this.userStory.isSprintUserStory == true) {
                this.isFromSprints = true;
            } else {
                this.isFromSprints = false;
            }
            if (data.isFromSprints) {
                this.isFromSprints = data.isFromSprints;
            }
        }
    }

    ngOnInit() {
        this.userStory;
        this.injector = this.vcr.injector;
        this.widgetListinputs = {
            userStoryId: this.userStory.userStoryId, isFromSprints: this.isFromSprints,
            isUniqueFromProjects: false, notFromAudits: this.notFromAudits, isFromBugsCount: this.isFromBugsCount, isFromUrl: false
        }
        this.loadComponent();
    }

    loadComponent() {
        var loader = this.dashboardModulesService["modules"];
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var projectModulePath : any = _.find(modules, function (module) { return module.modulePackageName == 'ProjectPackageModule' });
        var component = "Userstory";
        if (!projectModulePath) {
            console.error("No module found for ProjectPackageModule");
        }
        var path = loader[projectModulePath.modulePackageName];
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

                    this.uniquePageComponent = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                    this.cdRef.detectChanges();

                } catch (err) {
                    throw err;
                }
            });
        // // this.ngModuleFactoryLoader
        // //     .load(projectModulePath.moduleLazyLoadingPath)
        // //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (projectModulePath.moduleLazyLoadingPath.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = projectModulePath.moduleLazyLoadingPath.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "Userstory");

        // // this.uniquePageComponent = this.ngModuleFactoryLoader.resolveComponentFactory(componentDetails.componentTypeObject);
        // //     });UniqueUserstorysDialogComponent
        // this.ngModuleFactoryLoader.resolveComponentFactory(componentDetails.componentTypeObject); 
    }

    ngOnDestroy() {
        if (this.id)
            clearInterval(this.id);
    }

    onNoClick(): void {
        if (this.currentDialog) this.currentDialog.close();
        if (this.dialogRef) this.dialogRef.close();
    }

    closeDialog() {
        this.afterClosed.emit('');
        if (this.currentDialog) this.currentDialog.close({ success: this.toggleUserStory, redirection: false });

    }

    getCloseUniqueUserStory() {
        if (this.currentDialog) this.currentDialog.close({ success: this.toggleUserStory, redirection: true });
    }

    getToggleUserStory(value) {
        if (value == 'yes') {
            this.toggleUserStory = value;
            this.closeDialog();
        }
        else if (value == 'no') {
            this.toggleUserStory = value;
        }
    }
}
