import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, NgModuleFactory, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, Type, OnInit, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from "underscore";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { FileElement } from '../../models/file-element-model';
import { AuditUniqueDetailComponent, ConductUniqueDetailComponent } from "@snovasys/snova-audits-module";
import { DocumentStoreComponent } from "@snovasys/snova-document-management";
import { ProjectModulesService } from "../../services/project.modules.service";

@Component({
  selector: 'generic-detail',
  templateUrl: './generic-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDetailComponent extends CustomAppBaseComponent implements OnInit {

  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      this.currentDialogId = data[0].formPhysicalId;
      this.referenceId = data[0].referenceId;
      this.referenceTypeId = data[0].referenceTypeId;
      this.userStoryId = data[0].userStoryId;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }
  }
  userStoryId: any;
  currentDialogId: any;
  currentDialog: any;
  referenceId: any;
  loaded: boolean;
  injector: any;
  dashboard: any;
  referenceTypeId: any;
  documentStoreComponent: any;
  moduleTypeId: number = 14;
  questionReferenceTypeId: string;
  documentsModuleLoaded: boolean;
  selectedStoreId: string = null;
  isButtonVisible: boolean = true;
  loadedQ: boolean = false;
  constructor(public dialogRef: MatDialogRef<GenericDetailComponent>, 
    public dialog: MatDialog,private vcr: ViewContainerRef, @Inject('ProjectModuleLoader') public projectModulesService: any, private compiler: Compiler,
    private ngModuleRef: NgModuleRef<any>, private cdRef: ChangeDetectorRef) {
    super();
    this.injector = this.vcr.injector;
  }
  ngOnInit() {
    if (this.referenceTypeId.toLowerCase() == ConstantVariables.AuditReferenceTypeId.toLowerCase()) {
      this.loadDialg("audit unique details");
    } else if (this.referenceTypeId.toLowerCase() == ConstantVariables.ConductReferenceTypeId.toLowerCase()) {
      this.loadDialg("conduct unique details");
    } else if (this.referenceTypeId.toLowerCase() == ConstantVariables.AuditsUploadEvidenceReferenceTypeId.toLowerCase()) {
      this.loadDocumentManagementModule(ConstantVariables.AuditReferenceTypeId);
    } else if (this.referenceTypeId.toLowerCase() == ConstantVariables.ConductsUploadEvidenceReferenceTypeId.toLowerCase()) {
      this.loadDocumentManagementModule(ConstantVariables.ConductReferenceTypeId);
    } else if (this.referenceTypeId.toLowerCase() == ConstantVariables.AuditQuestionsUploadEvidenceReferenceTypeId.toLowerCase()) {
      this.loadQuestion("audit question upload");
    }else if (this.referenceTypeId.toLowerCase() == ConstantVariables.ConductQuestionsEvidenceUploadReferenceTypeId.toLowerCase()) {
      this.loadQuestion("conduct question upload");
    }
    // else if(this.referenceTypeId.toLowerCase() == ConstantVariables.AuditQuestionsReferenceTypeId) {
    //   this.loadDialg("audit unique details");
    // }
  }

  onNoClick(): void {
    this.currentDialog.close();
  }

  loadDialg(name) {
    var loader = this.projectModulesService["modules"];
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);
    var module = _.find(modules, function (module: any) {
      var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == name });
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
          elementInArray.name.toLowerCase() === name);

        let factory;
        factory = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);


        this.dashboard = {};
        this.dashboard.component = factory;
        this.dashboard.inputs = {
          referenceId: this.referenceId
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      })
  }

  loadDocumentManagementModule(data) {
    var loader = this.projectModulesService["modules"];
    let fileElement = new FileElement();
    fileElement.folderReferenceId = this.referenceId;
    fileElement.folderReferenceTypeId = data.toLowerCase();
    fileElement.isEnabled = true;
    

    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
        console.error(`No modules found`);
        return;
    }
    var modules = JSON.parse(moduleJson);

    // var modules = this.auditModulesService["modules"];

    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'DocumentManagementPackageModule' });

    if (!module) {
        console.error("No module found for DocumentManagementPackageModule");
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
                elementInArray.name.toLocaleLowerCase() === "Document Store".toLocaleLowerCase()
            );
            this.dashboard = {};
            this.dashboard.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
            this.dashboard.inputs = {
                fileElement: fileElement,
                isComponentRefresh: true,
                isFromAudits: true,
                userStoryId: this.userStoryId
            };

            this.dashboard.outputs = {}
            this.documentsModuleLoaded = true;
            this.loaded = true;
            this.cdRef.detectChanges();
        });
}

loadQuestion(data) {
  if(data == "audit question upload") {
    this.questionReferenceTypeId = ConstantVariables.AuditReferenceTypeId;
  }
else if(data == "conduct question upload") {
  this.questionReferenceTypeId = ConstantVariables.ConductReferenceTypeId;
}
this.loadedQ = true;
}
}