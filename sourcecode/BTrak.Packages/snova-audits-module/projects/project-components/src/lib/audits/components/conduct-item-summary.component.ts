import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, ViewChildren, QueryList, Input, ViewChild, ElementRef, Output, EventEmitter, Type, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
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

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";
// import { AuditCompliance } from "../models/audit-compliance.model";
// import { AuditActionTypes, LoadAuditTriggered } from "../store/actions/audits.actions";
import { AuditConduct, CondutLinkEmailModel } from "../models/audit-conduct.model";
import { AuditConductActionTypes, LoadAuditConductTriggered } from "../store/actions/conducts.actions";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditService } from '../services/audits.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from "underscore";
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { GenericStatusComponent } from "@snovasys/snova-app-builder-creation-components";

@Component({
    selector: "conduct-item-summary",
    templateUrl: "./conduct-item-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductItemSummaryComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("addConduct") addConductPopover: SatPopover;
    @ViewChild("deleteConduct") deleteConductPopover: SatPopover;
    @ViewChild("conductTitle") conductTitleStatus: ElementRef;

    @Output() deletedConductId = new EventEmitter<string>();
    @Output() editedConductData = new EventEmitter<any>();

    @Input() conductSelected: boolean;

    @Input("conduct")
    set _conduct(data: AuditConduct) {
        if (data) {
            this.conductData = data;
            if(this.conductData.status) {
                this.loadStatus();
            }
            if (data.isRAG == null || data.isRAG == false) {
                this.isRAG = false;
                this.inBoundPercent = null;
                this.outBoundPercent = null;
            }
            else {
                this.isRAG = true;
                this.inBoundPercent = data.inBoundPercent;
                this.outBoundPercent = data.outBoundPercent;
            }
            if (data.isRAG)
                this.checkCompliancePercent(data);
            this.getExpansions();
        }
    }

    @Input("conductId")
    set _conductId(data: string) {
        this.conductId = data;
    }

    anyOperationInProgress$: Observable<boolean>;
    activeAuditConductsCount$: Observable<number>;
    archivedAuditConductsCount$: Observable<number>;

    public ngDestroyed$ = new Subject();
    emptyMail: boolean = false;

    contextMenuPosition = { x: '0px', y: '0px' };
    toMails: string;
    conductData: any;
    editedIsInclude: any;
    conductDataForAnswer: any;
    inBoundPercent: any;
    outBoundPercent: any;
    compliancePercent: any;
    sendingMailInProgress: boolean
    conductId: string;
    editedConductId: string;
    activeAuditConductsCount: number;
    archivedAuditConductsCount: number;
    editedConductIsCompleted: boolean;
    isRAG: boolean = false;
    isRed: boolean = false;
    isAmber: boolean = false;
    isGreen: boolean = false;
    noneAnswered: boolean = false;
    showTooltip: boolean = false;
    expansionIcon: boolean = false;
    panelOpenState: boolean = false;
    isEditConduct: boolean = false;
    disableConduct: boolean = false;
    disableConductDelete: boolean = false;
    uniqueNumberUrl: any;
    loaded: boolean;
    injector: any;
    dashboard: any;
    status: any;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService,
        private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private snackbar: MatSnackBar, private translateService: TranslateService,
        private auditService: AuditService,private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef,
        private ngModuleRef: NgModuleRef<any>, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.injector = this.vcr.injector;
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditConductLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdCompleted),
                tap((result: any) => {
                    this.disableConductDelete = false;
                    this.closeConductDialog();
                    if (result && result.searchAuditConducts && result.searchAuditConducts.length > 0) {
                        let resultData = result.searchAuditConducts[0];
                        if (resultData.conductId == this.conductData.conductId && resultData.isRAG) {
                            this.conductDataForAnswer = resultData;
                            this.checkCompliancePercent(resultData);
                            this.cdRef.markForCheck();
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.AuditConductEditCompletedWithInPlaceUpdate),
                tap(() => {
                    if (this.editedConductId == this.conductData.conductId) {
                        let editedTestRun = new AuditConduct();
                        editedTestRun.conductId = this.conductData.conductId;
                        editedTestRun.auditId = this.conductData.auditId;
                        if (this.editedIsInclude == true || this.editedIsInclude == 'true')
                            editedTestRun.isCategoriesRequired = false;
                        else
                            editedTestRun.isCategoriesRequired = true;
                        editedTestRun.isCompleted = this.editedConductIsCompleted;
                        this.editedConductData.emit(editedTestRun);
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductDelete),
                tap(() => {
                    this.deleteConductPopover.close();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.AuditConductFailed),
                tap(() => {
                    this.disableConduct = false;
                    this.disableConductDelete = false;
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
        this.activeAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditConductsCount));
        this.activeAuditConductsCount$.subscribe(x => {
            this.activeAuditConductsCount = x;
            if (this.activeAuditConductsCount <= 5 && !this.conductData.isArchived) {
                this.panelOpenState = true;
                this.expansionIcon = true;
            }
            else if (this.activeAuditConductsCount > 5 && !this.conductData.isArchived) {
                this.panelOpenState = false;
                this.expansionIcon = false;
            }
            this.cdRef.markForCheck();
        });

        this.archivedAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getArchivedAuditConductsCount));
        this.archivedAuditConductsCount$.subscribe(x => {
            this.archivedAuditConductsCount = x;
            if (this.archivedAuditConductsCount <= 5 && this.conductData.isArchived) {
                this.panelOpenState = true;
                this.expansionIcon = true;
            }
            else if (this.archivedAuditConductsCount > 5 && this.conductData.isArchived) {
                this.panelOpenState = false;
                this.expansionIcon = false;
            }
            this.cdRef.markForCheck();
        });
    }

    checkCompliancePercent(data) {
        if (data.answeredCount == 0) {
            this.noneAnswered = true;
        }
        else {
            this.noneAnswered = false;
            let quesCount = data.questionsCount;
            let answCount = data.answeredCount;
            let unAnswCount = quesCount - answCount;
            let validCount = data.validAnswersCount;
            let inValidCount = answCount - validCount;
            let percent = (validCount / answCount) * 100;
            this.compliancePercent = percent.toFixed(2);
            if (percent <= this.inBoundPercent) {
                this.isRed = true;
                this.isAmber = false;
                this.isGreen = false;
                this.cdRef.markForCheck();
            }
            else if (percent > this.inBoundPercent && percent < this.outBoundPercent) {
                this.isRed = false;
                this.isAmber = true;
                this.isGreen = false;
                this.cdRef.markForCheck();
            }
            else if (percent >= this.outBoundPercent) {
                this.isRed = false;
                this.isAmber = false;
                this.isGreen = true;
                this.cdRef.markForCheck();
            }
        }
    }

    exportAuditConduct(popover) {
        if (this.toMails && this.toMails.trim() != '') {
            this.sendingMailInProgress = true;
            this.emptyMail = false;
            let model = new CondutLinkEmailModel();
            model.toMails = (this.toMails && this.toMails.trim() != '') ? this.toMails.trim() : null;
            model.conductId = this.conductId;
            model.auditId = this.conductData.auditId;
            model.conductName = this.conductData.auditConductName
            this.auditService.exportAuditConduct(model)
                .subscribe((result: any) => {
                    if (result.success) {
                        this.toastr.info(this.translateService.instant(ConstantVariables.SuccessMessageForMailSent));
                    }
                    else {
                        let validationmessage = result.apiResponseMessages[0].message;
                        this.toastr.error(validationmessage);
                    }
                    this.sendingMailInProgress = false;
                    popover.close();
                    this.closeMail()
                });
        } else {
            this.emptyMail = true;
            this.cdRef.markForCheck();
        }
    }

    sendLinkToMails(popover) {
        if (this.toMails && this.toMails.trim() != '') {
            this.sendingMailInProgress = true;
            this.emptyMail = false;
            let model = new CondutLinkEmailModel();
            model.toMails = (this.toMails && this.toMails.trim() != '') ? this.toMails.trim() : null;
            model.conductId = this.conductId;
            model.conductName = this.conductData.auditConductName
            this.auditService.sendConductLinkToMails(model)
                .subscribe((result: any) => {
                    if (result.success) {
                        this.toastr.info(this.translateService.instant(ConstantVariables.SuccessMessageForMailSent));
                    }
                    else {
                        let validationmessage = result.apiResponseMessages[0].message;
                        this.toastr.error(validationmessage);
                    }
                    this.sendingMailInProgress = false;
                    popover.close();
                    this.closeMail()
                });
        } else {
            this.emptyMail = true;
            this.cdRef.markForCheck();
        }

    }
    openMail() {
        var conductAssignee = this.conductData.conductAssigneeMail;
        var auditResponsibleUser = this.conductData.auditResponsibleUserMail;
        if(!conductAssignee && !auditResponsibleUser) return;
        else if(conductAssignee == auditResponsibleUser) this.toMails = conductAssignee;
        else this.toMails = conductAssignee + '\n' + auditResponsibleUser;
    }
    closeMail() {
        this.toMails = null;
        this.emptyMail = false;
    }
    makeEditFalse() {
        this.isEditConduct = false;
    }

    detailsOpen() {
        this.isEditConduct = true;
    }

    deleteSelectedConduct(value) {
        this.disableConductDelete = true;
        let conduct = new AuditConduct();
        conduct = Object.assign({}, this.conductData);
        conduct.isArchived = value;
        if (conduct.isArchived == false)
            conduct.auditConductUnarchive = true;
        else
            conduct.auditConductUnarchive = false;
        this.store.dispatch(new LoadAuditConductTriggered(conduct));
        this.deletedConductId.emit(this.conductData.conductId);
        this.checkTooltipStatus();
    }

    getEditedConductData(value) {
        this.editedConductId = value.conductId;
        this.editedIsInclude = value.isIncludeAllQuestions;
        this.editedConductIsCompleted = value.isCompleted;
        if (this.editedConductIsCompleted)
            this.deletedConductId.emit(value.conductId);
    }

    checkTooltipStatus() {
        if (this.conductTitleStatus.nativeElement.scrollWidth > this.conductTitleStatus.nativeElement.clientWidth) {
            this.showTooltip = true;
        }
        else {
            this.showTooltip = false;
        }
    }

    addEditConduct() {
        this.addConductPopover.open();
        // (document.querySelector('.filter-data') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
    }

    closeConductDialog() {
        this.trigger.closeMenu();
        // let popover = this.addConductPopover;
        // if (popover)
        //     popover.close();
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedCategories');
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

    copyLink() {
        const angularRoute = this.routes.url;
        const url = window.location.href;
        this.uniqueNumberUrl = url.replace(angularRoute, "");
        // this.uniqueNumberUrl = this.uniqueNumberUrl + "/audits/" + this.conductData.conductId + "/conduct";
        this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/conduct/" + this.conductData.conductId;
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
        // this.uniqueNumberUrl = this.uniqueNumberUrl + "/audits/" + this.conductData.conductId + "/conduct";
        this.uniqueNumberUrl = this.uniqueNumberUrl + "/projects/conduct/" + this.conductData.conductId;
        window.open(this.uniqueNumberUrl, "_blank");
        // this.routes.navigate(["audits/" + this.conductData.conductId + "/conduct"]);
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
                referenceId: this.conductData.conductId,
                referenceName: 'Conduct',
                status: this.conductData.status
            }
            this.loaded = true;
            this.cdRef.detectChanges();
        //   })
      }

      loadStatus() {
        if(this.conductData.status == ConstantVariables.Draft) {
            this.status = this.translateService.instant(ConstantVariables.DraftStatus);
        } else if(this.conductData.status == ConstantVariables.Submitted) {
            this.status = this.translateService.instant(ConstantVariables.SubmittedStatus);
        } else if(this.conductData.status == ConstantVariables.SendFroApproved) {
            this.status = this.translateService.instant(ConstantVariables.SendForApprovalStatus);
        }else if(this.conductData.status == ConstantVariables.Approved) {
            this.status = this.translateService.instant(ConstantVariables.ApprovedStatus);
        } else if(this.conductData.status) {
            this.status = this.conductData.status;
        }
      }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
