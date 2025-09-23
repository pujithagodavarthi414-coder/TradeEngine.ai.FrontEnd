import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, QueryList, Input, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, ViewContainerRef, Type, ComponentFactoryResolver } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SatPopover } from "@ncstate/sat-popover";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
import { AuditCompliance } from "../models/audit-compliance.model";
import { AuditActionTypes, LoadAuditTriggered, LoadAuditTagListTriggered, LoadAuditTagTriggered, LoadAuditCloneTriggered } from "../store/actions/audits.actions";

import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { RecurringCronExpressionModel } from '../dependencies/models/cron-expression-model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Guid } from 'guid-typescript';
import { AuditService } from '../services/audits.service';
import cronstrue from 'cronstrue';
import { AuditConductActionTypes } from '../store/actions/conducts.actions';
import { WorkflowTrigger } from '../models/workflow-trigger.model';
import { WorkFlowTriggerService } from '../services/workflow-trigger.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from "underscore";
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { GenericStatusComponent } from "@snovasys/snova-app-builder-creation-components";

@Component({
    selector: "audit-item-summary",
    templateUrl: "./audit-item-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditItemSummaryComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("addAudit") addAuditPopover: SatPopover;
    @ViewChild("deleteAudit") deleteAuditPopover: SatPopover;
    @ViewChild("cloneAudit") cloneAuditPopover: SatPopover;
    @ViewChild("auditTagsPopover") auditTagPopover: SatPopover;
    @ViewChild("auditTitle") auditTitleStatus: ElementRef;
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild('addAuditConduct') addAuditConductsPopover: SatPopover;
    @ViewChild("workflowSelectionComponent") workflowSelectionComponent: TemplateRef<any>;

    @Output() deletedCategoryId = new EventEmitter<string>();

    @Input() auditSelected: boolean;

    @Input("audit")
    set _audit(data: AuditCompliance) {
        if (data) {
            this.auditData = data;
            if(this.auditData.status) {
                this.checkStatus();
                this.loadGenericStatusComponent();
            }
            this.getExpansions();
        }
    }

    @Input("auditId")
    set _auditId(data: string) {
        this.auditId = data;
    }

    anyOperationInProgress$: Observable<boolean>;
    tagsOperationInProgress$: Observable<boolean>;
    tagOperationInProgress$: Observable<boolean>;
    cloneOperationInProgress$: Observable<boolean>;
    customTagsModel$: Observable<AuditCompliance[]>;
    activeAuditsCount$: Observable<number>;
    archivedAuditsCount$: Observable<number>;
    workFlowList = [{name: 'workflow1'},{name: 'workflow2'}];
    customTagsModel: AuditCompliance[];
    guidEmpty: any = Guid.EMPTY;
    statusCategories = [];
    displayEdit: boolean;
    displayConductAudit: boolean;
    displaySubmitted: boolean;
    public ngDestroyed$ = new Subject();

    projectId: string;

    contextMenuPosition = { x: '0px', y: '0px' };

    auditInputTags = [];

    auditData: any;

    auditId: string;
    tag: string;
    activeAuditsCount: number;
    archivedAuditsCount: number;
    showTooltip: boolean = false;
    expansionIcon: boolean = false;
    panelOpenState: boolean = false;
    isEditAudit: boolean = false;
    disableAudit: boolean = false;
    disableTag: boolean = false;
    removable: boolean = true;
    visible: boolean = true;
    selectable: boolean = true;
    disableAuditDelete: boolean = false;
    disableAuditClone: boolean = false;
    uniqueNumberUrl: any;
    selectedAudit: any;
    loadAddAuditConduct: boolean = false;
    isAnyOperationIsInprogress: boolean;
    workFlowItems = [];
    workflowId: any;
    workFlowType: any;
    loaded: boolean;
    injector: any;
    dashboard: any;
    submitAudit: boolean;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private toastr: ToastrService,
        private translateService: TranslateService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute,
        public dialog: MatDialog, private cdRef: ChangeDetectorRef, private snackbar: MatSnackBar,private workFlowTriggerService: WorkFlowTriggerService,
        private auditService: AuditService,
        private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.injector = this.vcr.injector;

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditLoading));
        this.cloneOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditCloneLoading));
        this.tagsOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditTagListLoading));
        this.tagOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditTagLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditByIdCompleted),
                tap(() => {
                    this.disableAuditDelete = false;
                    this.disableAuditClone = false;
                    this.disableTag = false;
                    this.closeAuditDialog();
                    this.closeTagsDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadAuditDelete),
                tap(() => {
                    this.deleteAuditPopover.close();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.AuditFailed),
                tap(() => {
                    this.disableAudit = false;
                    this.disableTag = false;
                    this.disableAuditDelete = false;
                    this.disableAuditClone = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductCompleted),
                tap(() => {
                    // this.routes.navigate(["audits/auditsview/1"]);
                    if (this.routes.url.includes("/audit/")) {
                        this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/audit/conducts');
                      } else {
                        this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
                      }
                    this.cdRef.markForCheck();
                })
            ).subscribe();
            this.getSoftLabelConfigurations();
        }
      
        getSoftLabelConfigurations() {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }

    ngOnInit() {
        super.ngOnInit();        
    }

    getExpansions() {
        this.activeAuditsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditsCount));
        this.activeAuditsCount$.subscribe(x => {
            this.activeAuditsCount = x;
            if (this.activeAuditsCount <= 5 && !this.auditData.isArchived) {
                this.panelOpenState = true;
                this.expansionIcon = true;
            }
            else if (this.activeAuditsCount > 5 && !this.auditData.isArchived) {
                this.panelOpenState = false;
                this.expansionIcon = false;
            }
            this.cdRef.markForCheck();
        });

        this.archivedAuditsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditsCount));
        this.archivedAuditsCount$.subscribe(x => {
            this.archivedAuditsCount = x;
            if (this.archivedAuditsCount <= 5 && this.auditData.isArchived) {
                this.panelOpenState = true;
                this.expansionIcon = true;
            }
            else if (this.archivedAuditsCount > 5 && this.auditData.isArchived) {
                this.panelOpenState = false;
                this.expansionIcon = false;
            }
            this.cdRef.markForCheck();
        });
    }

    makeEditFalse() {
        this.isEditAudit = false;
    }

    checkStatus() {
       this.displaySubmitted = this.displayEdit = (this.auditData.status == ConstantVariables.Draft);
       this.displayConductAudit = this.auditData.status == ConstantVariables.Approved;
       this.cdRef.detectChanges();
    }

    detailsOpen() {
        this.isEditAudit = true;
    }

    deleteSelectedAudit(value) {
        if (this.auditData.conductsCount > 0) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForAuditError));
        }
        else {
            this.disableAuditDelete = true;
            let audit = new AuditCompliance();
            audit = Object.assign({}, this.auditData);
            // audit.schedulingDetails = new RecurringCronExpressionModel();
            // audit.schedulingDetails = Object.assign({}, this.auditData);
            audit.isArchived = value;
            if (audit.isArchived == false)
                audit.auditUnarchive = true;
            else
                audit.auditUnarchive = false;
            this.store.dispatch(new LoadAuditTriggered(audit));
            this.deletedCategoryId.emit(this.auditData.auditId);
            this.checkTooltipStatus();
        }
    }

    auditClone() {
        this.disableAuditClone = true;
        let audit = new AuditCompliance();
        audit = Object.assign({}, this.auditData);
        audit.projectId = this.projectId;
        this.store.dispatch(new LoadAuditCloneTriggered(audit));
    }

    checkTooltipStatus() {
        if (this.auditTitleStatus.nativeElement.scrollWidth > this.auditTitleStatus.nativeElement.clientWidth) {
            this.showTooltip = true;
        }
        else {
            this.showTooltip = false;
        }
    }

    closeAuditDialog() {
        this.trigger.closeMenu();
        let popover = this.addAuditPopover;
        if (popover)
            popover.close();
        this.makeEditFalse();
    }

    openContextMenu(event: MouseEvent) {
        event.preventDefault();
        var contextMenu = this.triggers.toArray()[0];
        if (contextMenu) {
            this.contextMenuPosition.x = (event.clientX) + 'px';
            this.contextMenuPosition.y = (event.clientY - 30) + 'px';
            contextMenu.openMenu();
        }
    }

    togglePanel() {
        this.panelOpenState = !this.panelOpenState;
        this.expansionIcon = !this.expansionIcon;
    }

    expandClick() {
        this.expansionIcon = !this.expansionIcon;
        this.panelOpenState = !this.panelOpenState;
    }

    openTagsPopUp() {
        if (this.auditData.auditTagsModels && this.auditData.auditTagsModels.length > 0) {
            this.auditData.auditTagsModels.forEach(x => {
                this.auditInputTags.push(x);
            });
            this.cdRef.markForCheck();
        }
        this.auditTagPopover.open();
    }

    searchTags(tags) {
        let tagsModel = new AuditCompliance();
        tagsModel.searchText = (tags && tags.trim() != '') ? tags.trim() : null;
        let selIds = [];
        if (this.auditInputTags) {
            this.auditInputTags.forEach(x => {
                selIds.push(x.tagId);
            });
        }
        tagsModel.selectedIds = selIds.length > 0 ? selIds.toString() : null;
        this.store.dispatch(new LoadAuditTagListTriggered(tagsModel));
        this.customTagsModel$ = this.store.pipe(select(auditModuleReducer.getAuditTagList));
        this.customTagsModel$.subscribe(result => {
            this.customTagsModel = result;
            this.cdRef.markForCheck();
        });
    }

    selectedTagValue(event: any) {
        let value = event.option.value;
        let index = this.customTagsModel.findIndex(x => x.tagId == value);
        if (index != -1) {
            let data = this.customTagsModel[index];
            this.auditInputTags.push(data);
            this.tagInput.nativeElement.value = '';
            this.cdRef.markForCheck();
        }
    }

    saveAuditTags() {
        this.disableTag = true;
        let tagsModel = new AuditCompliance();
        tagsModel.auditId = this.auditData.auditId;
        tagsModel.auditTagsModels = this.auditInputTags;
        this.store.dispatch(new LoadAuditTagTriggered(tagsModel));
    }

    checkDisableTag() {
        if (this.auditInputTags.length > 0)
            return false;
        else
            return true;
    }

    removeAuditTags(tag) {
        let index = this.auditInputTags.findIndex(x => x.tagId.toLowerCase() == tag.tagId.toLowerCase());
        if (index != -1) {
            this.auditInputTags.splice(index, 1);
            this.cdRef.markForCheck();
        }
    }

    closeTagsDialog() {
        this.disableTag = false;
        this.auditInputTags = [];
        this.customTagsModel = [];
        if (this.auditTagPopover)
            this.auditTagPopover.close();
        if (this.cloneAuditPopover)
            this.cloneAuditPopover.close();
        this.trigger.closeMenu();
        this.tag = null;
        this.cdRef.markForCheck();
    }

    copyLink() {
        const angularRoute = this.routes.url;
        const url = window.location.href;
        this.uniqueNumberUrl = url.replace(angularRoute, "");
        // this.uniqueNumberUrl = this.uniqueNumberUrl + "/audits/" + this.auditData.auditId + "/audit";
        this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/audit/" + this.auditData.auditId;
        const selBox = document.createElement("textarea");
        selBox.style.position = "fixed";
        selBox.style.left = "0";
        selBox.style.top = "0";
        selBox.style.opacity = "0";
        selBox.value = this.uniqueNumberUrl;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand("copy");
        document.body.removeChild(selBox);
        // tslint:disable-next-line: max-line-length
        this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
    }

    openInNewTab() {
        const angularRoute = this.routes.url;
        const url = window.location.href;
        this.uniqueNumberUrl = url.replace(angularRoute, "");
        // this.uniqueNumberUrl = this.uniqueNumberUrl + "/audits/" + this.auditData.auditId + "/audit";
        this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/audit/" + this.auditData.auditId;
        window.open(this.uniqueNumberUrl, "_blank");
        // this.routes.navigate(["audits/" + this.auditData.auditId + "/audit"]);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    triggerJob(auditData) {
        if (auditData.schedulingDetails && auditData.schedulingDetails.length > 0) {
            for (let index = 0; index < auditData.schedulingDetails.length; index++) {
                const schedule = auditData.schedulingDetails[index];
                if (schedule.jobId) {
                    let cronDesc = cronstrue.toString(schedule.cronExpression);
                    this.auditService.triggerJob(schedule.jobId).subscribe((result: any) => {
                        if (result.success) {
                            this.toastr.success("Job " + cronDesc + " triggered successfully");
                        }
                        else {
                            this.toastr.error(result.apiResponseMessages[0].message);
                        }
                    });
                }
            }
        }
    }

    addConducts(auditData) {
        this.loadAddAuditConduct = true;
        this.addAuditConductsPopover.open();
        let auditControl = { value: auditData };
        this.selectedAudit = auditControl;
    }

    closeAuditConductDialog() {
        this.loadAddAuditConduct = false;
        this.addAuditConductsPopover.close();
    }

    submitAuditToTriggerWorkFlow(triggerWorkFlow) {
        this.submitAudit = true;
        var audit = new AuditCompliance();
        audit = Object.assign({}, this.auditData);
        this.auditService.SubmitAuditCompliance(audit)
                        .subscribe((res: any) => {
                            if (res.success) {
                                this.toastr.success("successfully submitted");
                                let auditcompliance = new AuditCompliance();
                                auditcompliance = Object.assign({}, this.auditData);
                                this.store.dispatch(new LoadAuditTriggered(audit));
                            }
                            else {
                                this.toastr.error(res.apiResponseMessages[0].message);
                            }
                            this.submitAudit = false;
                            triggerWorkFlow.close();
                        })
    }

    loadGenericStatusComponent() {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
          console.error(`No modules found`);
          return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function(module: any) {
          var widget = _.find(module.apps, function(app: any) { return app.displayName.toLowerCase() == "generic status" });
          if (widget) {
            return true;
          }
          return false;
        })
        // this.ngModuleFactoryLoader
        //   .load(module.moduleLazyLoadingPath)
        //   .then((moduleFactory: NgModuleFactory<any>) => {
        //     const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;
    
        //     var allComponentsInModule = (<any>componentService).components;
    
        //     this.ngModuleRef = moduleFactory.create(this.injector);
    
        //     var componentDetails = allComponentsInModule.find(elementInArray =>
        //       elementInArray.name === "Generic status");
      
            let factory;      
            factory = this.ngModuleFactoryLoader.resolveComponentFactory(GenericStatusComponent);
            
    
            this.dashboard = {};
            this.dashboard.component = factory;
            this.dashboard.inputs = {
                referenceId: this.auditData.auditId,
                referenceName: 'Audits',
                status: this.auditData.status
            }
            this.loaded = true;
            this.cdRef.detectChanges();
        //   })
      }
}