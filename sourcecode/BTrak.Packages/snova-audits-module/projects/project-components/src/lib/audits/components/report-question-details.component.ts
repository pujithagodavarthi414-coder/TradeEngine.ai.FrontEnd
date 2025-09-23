import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, Output, EventEmitter, NgModuleFactoryLoader, ViewContainerRef, NgModuleRef, NgModuleFactory, Type, ViewChild, Input, ComponentFactoryResolver } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';

import { State } from "../store/reducers/index";
import * as _ from "underscore";
import * as auditModuleReducer from "../store/reducers/index";
// import { QuestionActionTypes } from "../store/actions/questions.actions";
import { ConstantVariables } from '../dependencies/constants/constant-variables';

import { AuditModulesService } from '../services/audit.modules.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { UserStoryLogTimeComponent } from "@snovasys/snova-project-management";

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

@Component({
    selector: "report-question-details",
    templateUrl: "./report-question-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportQuestionDetailsComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() closePreview = new EventEmitter<any>();

    @Input() projectId: string;

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data) {
            this.questionData = data;
            let conductData = {
                conductId: this.questionData.conductId,
                auditId: this.questionData.auditId
            };
            this.selectedConduct = conductData;
        }
    }

    anyOperationInProgress$: Observable<boolean>
    historyInProgress$: Observable<boolean>

    public ngDestroyed$ = new Subject();

    allTestCases = [];

    questionData: any;
    position: any;
    selectedConduct: any;
    injector: any;
    documentStoreComponent: any;
    actionsCount: number = 0;
    loadDetails: boolean = false;
    isHierarchical: boolean = false;
    componentLoaded: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef
        , private auditModulesService: AuditModulesService
        , private ngModuleFactoryLoader: ComponentFactoryResolver,
        private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>, private softLabelsPipe: SoftLabelPipe) {

        super();

        this.injector = this.vcr.injector;

        this.historyInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionHistoryLoading));
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onTabSelect(event) {
        if (event && event.title.toLowerCase() == 'time')
            this.loadProjectManagementModule();
        else
            this.componentLoaded = false;
    }

    loadProjectManagementModule() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);

        // var modules = this.auditModulesService["modules"];

        var module = _.find(modules, function (module: any) { return module.modulePackageName == 'ProjectPackageModule' });

        if (!module) {
            console.error("No module found for ProjectPackageModule");
        }

        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {

        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name.toLocaleLowerCase() === "Log time".toLocaleLowerCase()
        //         );
                this.documentStoreComponent = {};
                this.documentStoreComponent.component = this.ngModuleFactoryLoader.resolveComponentFactory(UserStoryLogTimeComponent);
                this.documentStoreComponent.inputs = {
                    userStoryId: this.questionData.auditConductQuestionId,
                    isFromAudits: true,
                    notFromAuditReports: false
                };

                this.documentStoreComponent.outputs = {};
                this.componentLoaded = true;
                this.cdRef.detectChanges();
            // });
    }

    closeDialog() {
        this.closePreview.emit("");
    }
}
