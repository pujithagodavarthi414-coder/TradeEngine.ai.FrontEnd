import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChildren, NgModuleFactory, ComponentFactoryResolver, ViewContainerRef, NgModuleRef, Type, OnInit } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import * as auditModuleReducer from "../store/reducers/index";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { MatDialog } from '@angular/material/dialog';
import { AppStoreDialogComponent } from '../containers/app-store-dialog.component';
import { DashboardFilterModel, DragedWidget } from '../dependencies/models/dashboardFilterModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import { AuditModulesService } from '../services/audit.modules.service';
import * as _ from "underscore";
import { LoadQuestionViewTriggered, QuestionActionTypes } from '../store/actions/questions.actions';
import {  QuestionModel } from '../models/question.model';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditService } from '../services/audits.service';
import { QuestionHistoryModel } from '../models/question-history.model';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

@Component({
  selector: "audit-version-question-details",
  templateUrl: "./audit-version-question-details.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditVersionQuestionDetailsComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("FilesPopup") FilesPopup;

  @Output() closePreview = new EventEmitter<any>();

  @Input("selectedAudit")
  set _selectedAudit(data: any) {
    if (data) {
      this.selectedAudit = data;
      if (this.selectedAudit.isArchived == null || this.selectedAudit.isArchived == false)
        this.isAuditArchived = false;
      else
        this.isAuditArchived = true;
    }
  }

  @Input("question")
  set _question(data: any) {
    if (data) {
      this.questionData = data;
      this.selectedWorkspaceId = this.questionData.questionDashboardId;
    }
  }

  @Input("isHierarchical")
  set _isHierarchical(data: boolean) {
    if (data || data == false) {
      this.isHierarchical = data;
    }
  }

  selectedApps: DragedWidget;
  selectedWorkspaceId: string = null;
  reloadDashboard: string = null;
  dashboardFilter: DashboardFilterModel;
  filesCount: number;
  listView: boolean = false;
  isAuditArchived: boolean = false;
  injector: any;
  dashboard: any;
  isAnyAppSelected: boolean;
  loaded: boolean;
  selectedAppForListView: any;
  selectedAudit: any;
  isAnalyticsTab: boolean;
  anyOperationInProgress$: Observable<boolean>
  historyInProgress$: Observable<boolean>
  customHistoryComponent: any;
  public ngDestroyed$ = new Subject();

  files = [];
  allTestCases = [];
  projectcomponentLoaded:boolean =false;
  moduleTypeId: number = 14;
  referenceTypeId: string = ConstantVariables.AuditReferenceTypeId;
  selectedStoreId: string = null;
  isButtonVisible: boolean = true;
  questionData: any;
  position: any;
  loadDetails: boolean = false;
  isHierarchical: boolean = false;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, public dialog: MatDialog,
    private ngModuleFactoryLoader: ComponentFactoryResolver, private auditService: AuditService,
    private vcr: ViewContainerRef,
    private auditModulesService: AuditModulesService,
    private ngModuleRef: NgModuleRef<any>,
    private _sanitizer: DomSanitizer
    , private softLabelsPipe: SoftLabelPipe) {

    super();

    this.injector = this.vcr.injector;

    this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getSingleQuestionLoading));
    // this.historyInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionHistoryLoading));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(QuestionActionTypes.LoadSingleQuestionByIdCompleted),
      tap((result: any) => {
        if (result && result.searchQuestions.length > 0) {
          let data = result.searchQuestions[0];
          this.filesCount = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles.length : 0;
          this.files = (data.questionFiles && data.questionFiles.length > 0) ? data.questionFiles : [];
          this.cdRef.markForCheck();
        }
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

  onTabSelect(event) {
    // if (event && event.title.toLowerCase() == 'analytics') {
    //   this.isAnalyticsTab = true;
    //   this.loadWidgetModule("Custom Widget");
    // } else {
    //   this.isAnalyticsTab = false;
    // }

    // if (event && event.title.toLowerCase() == 'custom fields history') {
    //   this.projectcomponentLoaded = false;
    //   this.loadProjectModule();
    // }
  }

  closeFilesPopup() {
    this.FilesPopup.forEach((p) => p.closePopover());
  }

  openFilesPopover(FilesPopup) {
    FilesPopup.openPopover();
  }

  closeDialog() {
    this.closePreview.emit("");
  }

  openAppsSettings(isfromdashboards) {
    var appTagSearchText = 'Audit analytics';
    const dialogRef = this.dialog.open(AppStoreDialogComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
      data: { workspaces: [], isfromdashboards, appTagSearchText: appTagSearchText }
    });
    dialogRef.componentInstance.closeMatDialog.subscribe((app) => {
      this.selectedApps = JSON.parse(app);
      this.selectedAppForListView = app;
      this.dashboard.inputs.reloadDashboard = null;
      this.dashboard.inputs.selectedApps = this.selectedApps;
      this.upsertQuestionHistory({eventCode: 'InstalledApp', appName: this.selectedApps.name});
      this.cdRef.detectChanges();
    });
    dialogRef.componentInstance.closePopUp.subscribe((app) => {
      this.dialog.closeAll();
    })
  }

  outputs = {
    appsSelected: app => {
      this.isAnyAppSelected = true;      
    },
    description: data => {
      this.upsertQuestionHistory(data);
    }
  }

  upsertQuestionHistory(data) {
    var questionHistoryModel = new QuestionHistoryModel();
    questionHistoryModel.questionId = this.questionData.questionId;
    questionHistoryModel.description = data.eventCode;
    questionHistoryModel.oldValue = data.appName;
    questionHistoryModel.auditId = this.selectedAudit.auditId;
    this.auditService.upsertAuditQuestionHistory(questionHistoryModel)
            .subscribe(data => {console.log(data)});
  }

  sanitizeUrl(imgUrl) {
    return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}