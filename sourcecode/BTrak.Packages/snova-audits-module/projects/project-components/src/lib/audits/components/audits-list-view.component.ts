import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef, TemplateRef, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, ViewContainerRef, Type, ComponentFactoryResolver } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import { TreeItemDropEvent, DropPosition, TreeItemLookup, DropAction } from '@progress/kendo-angular-treeview';

import * as _ from "underscore";

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";

import { AuditCompliance, AuditsExportModel } from "../models/audit-compliance.model";

import { LoadAuditListTriggered, AuditActionTypes, LoadAuditCloneTriggered, LoadAuditTriggered, LoadAuditTagListTriggered, LoadAuditTagTriggered, LoadAuditByIdTriggered } from "../store/actions/audits.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditService } from '../services/audits.service';
import * as FileSaver from 'file-saver';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ToastrService } from 'ngx-toastr';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../dependencies/constants/constant-variables';

import { FolderTreeModel, FolderModel } from '../models/folder-tree.model';
import { AuditConductActionTypes } from '../store/actions/conducts.actions';

import cronstrue from 'cronstrue';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { HrBranchModel } from '../dependencies/models/hr-models/branch-model';
import { EmployeeService } from '../dependencies/services/employee-service';
import { DefaultWorkflowModel } from '../models/default-workflows.mode';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };

import { ComponentModel } from '@snovasys/snova-comments';
import { GenericStatusComponent } from "@snovasys/snova-app-builder-creation-components";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
  selector: "audits-list-view",
  templateUrl: "./audits-list-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditsListViewComponent extends AppFeatureBaseComponent implements OnInit {
  @ViewChildren("addAuditsPopover") addComplianceAuditPopover;
  @ViewChildren("addEditAuditPopover") addOrEditAuditPopover;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @ViewChild("auditVersionUniqueDetail") private auditVersionUniqueDetailDialog: TemplateRef<any>;

  @Output() selectedAudit = new EventEmitter<any>();
  @Output() loadAuditRelatedData = new EventEmitter<boolean>();
  @ViewChild("exportPopover") exportsPopover: SatPopover;
  @ViewChild("importPopover") importsPopover: SatPopover;
  @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;

  @ViewChild("addAudit") addAuditPopover: SatPopover;
  @ViewChild("editAudit") editAuditPopover: SatPopover;
  @ViewChild("customFields") customFieldsPopover: SatPopover;
  @ViewChild("addComment") addCommentPopover: SatPopover;
  @ViewChild("auditDetails") auditDetailsPopover: SatPopover;
  @ViewChild("deleteAudit") deleteAuditPopover: SatPopover;
  @ViewChild("cloneAudit") cloneAuditPopover: SatPopover;
  @ViewChild("versionAudit") versionAuditPopover: SatPopover;
  @ViewChild("versionHistory") versionHistoryPopover: SatPopover;
  // @ViewChild("openAuditsPage") openAuditsPagePopover: SatPopover;
  @ViewChild("auditTagsPopover") auditTagPopover: SatPopover;
  @ViewChild("auditTitle") auditTitleStatus: ElementRef;
  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild('addAuditConduct') addAuditConductsPopover: SatPopover;
  @ViewChild('deleteFolder') deleteFolderPopover: SatPopover;
  @ViewChild("businessUnitsSelected") private businessUnitsSelected: MatOption;

  anyOperationInProgress$: Observable<boolean>;
  deleteOperationInProgress$: Observable<boolean>;
  tagsOperationInProgress$: Observable<boolean>;
  tagOperationInProgress$: Observable<boolean>;
  cloneOperationInProgress$: Observable<boolean>;
  activeAuditsCount$: Observable<number>;
  activeAuditFoldersCount$: Observable<number>;

  auditList$: Observable<AuditCompliance[]>;
  customTagsModel$: Observable<AuditCompliance[]>;

  public ngDestroyed$ = new Subject();
  public selectedKeys: any[] = ['0'];
  public allParentNodes = [];
  public expandKeys = this.allParentNodes.slice();

  keyIndexes: any = [];
  auditInputTags = [];

  customTagsModel: AuditCompliance[];

  auditFolderForm: FormGroup;
  auditVersionForm: FormGroup;

  folderTreeModel: FolderTreeModel[];
  filteredFolderTreeModel = [];
  auditVersions = [];
  displaySubmitted: boolean;
  displayConductAudit: boolean;
  displayEdit: boolean;
  loaded: boolean;
  injector: any;
  dashboard: any
  audit: any;
  submitAudit: boolean;
  allBusinessUnits: BusinessUnitDropDownModel[] = [];
  businessUnitsList: BusinessUnitDropDownModel[] = [];
  selectedBusinessUnits: any;

  // auditVersions = [
  //   {
  //     auditVersionName: 'First',
  //     auditId: '0b1a9831-6373-4a20-9200-35bbd50746b6',
  //     createdByUserName: 'Manoj Gurram',
  //     createdByUserProfileImage: null,
  //     createdDateTime: '2020-10-31T00:00:00+00:00'
  //   },
  //   {
  //     auditVersionName: 'Second',
  //     auditId: '',
  //     createdByUserName: 'Sai Kumar',
  //     createdByUserProfileImage: null,
  //     createdDateTime: '2020-10-31T00:00:00+00:00'
  //   },
  //   {
  //     auditVersionName: 'Third',
  //     auditId: '',
  //     createdByUserName: 'Jhonson Jhonson',
  //     createdByUserProfileImage: null,
  //     createdDateTime: '2020-10-31T00:00:00+00:00'
  //   }
  // ];

  isArchived: boolean = false;
  loadAddAudit: boolean = false;
  loadPopover: boolean = false;
  categoryFilter: string = '1';
  searchText: string;
  searchTagsText: string;
  searchStatusText: string;
  projectId: string;
  auditVersionId: string;
  selectedAuditId: string;
  deletedCategoryId: string;
  folderOrAuditSelectedId: string;
  tag: string;
  parentAuditId: string;
  auditOccurance: number = 0;
  softLabels: any;
  auditRequiredData: any;
  selectedAuditConduct: any;
  isNewAudit: any;
  index: any;
  tagNames: any;
  contextMenuPosition = { x: '0', y: '0' };
  defaultWorkflows: DefaultWorkflowModel;
  auditName: string;
  toMails: string;
  acceptableFileFormat: string;
  periodDropDown: string[] = ["Current month", "Last month", "Last 3 months", "Last 6 months", "Last 12 months", "Select period"];
  statusDropDown: string[] = ["In progress", "Over due", "Completed"];
  userDropdown = [];
  branchDropdown: any;
  selectedPeriod: string;
  selectedUser: any;
  dateTofilter: boolean = false;
  dateFromfilter: boolean = false;
  isCsvImport: boolean;
  isExcelImport: boolean;
  disableExport: boolean = false;
  disableImport: boolean = false;
  importProgress: boolean = false;
  emptyMail: boolean = false;
  disableAuditDelete: boolean = false;
  disableAuditClone: boolean = false;
  disableAddVersion: boolean = false;
  disableTag: boolean = false;
  disableAudit: boolean = false;
  isEditAudit: boolean = false;
  loadAddAuditConduct: boolean = false;
  editFolder: boolean = false;
  disableAddEditFolder: boolean = false;
  disableAuditFolderDelete: boolean = false;
  fromAuditComponent: boolean = false;
  isAuditDeleted: boolean = false;
  anyOperationInProgress: boolean = false;
  isSearching: boolean = false;
  callSucceeded: boolean = false;
  canRefreshAudit: boolean = false;
  folderCantDelete: boolean = false;
  fromClone: boolean = false;
  loadingAuditVersions: boolean = false;
  canDragOrDrop: boolean;
  removable: boolean = true;
  selectable: boolean = true;
  expandAll: boolean = true;
  files: File[] = [];
  validationMessage: string;
  selectedBranch: string;
  userList = [];
  selectedMember: string;
  pageY: number;
  activeAuditsCount: number;
  activeAuditFoldersCount: number;

  dateToTimePicker: any;
  dateTo: Date;
  dateFrom: Date;
  fromDate: Date = new Date();
  minToDate: any;
  isAnyOperationIsInprogress: boolean;
  componentModel: ComponentModel = new ComponentModel();

  businessUnitIds = new FormControl(null,
    Validators.compose([
    ])
  );

  constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService, private employeeService: EmployeeService, private cookieService: CookieService, private toastr: ToastrService, private softLabePipe: SoftLabelPipe, private translateService: TranslateService, private snackbar: MatSnackBar
    , private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef,
    private ngModuleRef: NgModuleRef<any>) {
    super();

    this.injector = this.vcr.injector;

    this.route.params.subscribe((params) => {
      this.projectId = params["id"];
    });

    this.getSoftLabelConfigurations();
    this.activeAuditsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditsCount));
    this.activeAuditsCount$.subscribe(x => {
      this.activeAuditsCount = x;
      this.cdRef.markForCheck();
    });

    this.activeAuditFoldersCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditFoldersCount));
    this.activeAuditFoldersCount$.subscribe(x => {
      this.activeAuditFoldersCount = x;
      this.cdRef.markForCheck();
    });

    // this.loadAuditList();
    this.loadAuditFolderView();
    this.initializeAuditFolderForm();
    this.initializeAuditVersionForm();

    this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditsListLoading));
    this.deleteOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditLoading));
    this.cloneOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditCloneLoading));
    this.tagsOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditTagListLoading));
    this.tagOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditTagLoading));

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditListTriggered),
        tap((result: any) => {
          this.selectedAuditId = null;
          this.deletedCategoryId = null;
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditTriggered),
        tap((result: any) => {
          if (result && result.audit) {
            let data = result.audit;
            this.isNewAudit = data.isNewAudit;
            this.fromAuditComponent = data.fromAuditComponent;
            this.isAuditDeleted = data.isToBeDeleted;
            this.cdRef.markForCheck();
          }
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditTagCompleted),
        tap((result: any) => {
          if (result && result.auditId) {
            this.loadAuditFolderView();
            this.closeTagsDialog();
          }
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.RefreshAuditsList),
        tap((result: any) => {
          this.selectedAuditId = null;
          this.deletedCategoryId = null;
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditByIdTriggered),
        tap((result: any) => {
          if (result && result.audit) {
            let data = result.audit;
            this.canRefreshAudit = data.canRefreshAudit ? true : false;
            this.fromClone = data.fromClone ? true : false;
            if (this.canRefreshAudit) {
              this.fromAuditComponent = false;
              this.isNewAudit = false;
            }
            this.getDefaultWorkflows();
            this.cdRef.markForCheck();
          }
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditByIdCompleted),
        tap((result: any) => {
          this.disableAuditDelete = false;
          this.disableAuditClone = false;
          this.disableTag = false;
          if (result && result.searchAudits && result.searchAudits.length > 0) {
            let data = result.searchAudits[0];
            if ((this.fromAuditComponent && this.isNewAudit) || this.fromClone) {
              this.toggleSearchData();
              this.pushAuditOrFolderIndexCategorydata(this.folderTreeModel, data.parentAuditId, data, false);
              this.allParentNodes.push(data.auditId);
              this.expandKeys.push(data.auditId);
              this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
            }
            else if ((this.fromAuditComponent && this.isNewAudit == false) || this.canRefreshAudit) {
              // this.getAudit(data);
              this.toggleSearchData();
              this.findAuditIndexCategorydata(this.folderTreeModel, data.auditId, data, false);
              // this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
            }
          }
          this.closeAuditDialog();
          this.closeTagsDialog();
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAnotherAuditByIdCompleted),
        tap((result: any) => {
          if (result && result.searchAudits && result.searchAudits.length > 0) {
            let data = result.searchAudits[0];
            this.toggleSearchData();
            this.findAuditIndexCategorydata(this.folderTreeModel, data.auditId, data, false);
            // this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
          }
          this.closeAuditDialog();
          this.closeTagsDialog();
        })
      ).subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(AuditActionTypes.LoadAuditDelete),
        tap((result: any) => {
          this.deleteAuditPopover.close();
          this.disableAuditDelete = false;
          if (result && result.auditId) {
            if (this.fromAuditComponent && this.isAuditDeleted) {
              this.toggleSearchData();
              if (this.folderOrAuditSelectedId && result.auditId == this.folderOrAuditSelectedId) {
                this.selectedKeys = ['0'];
                this.folderOrAuditSelectedId = this.folderTreeModel[0].auditId;
                this.cdRef.markForCheck();
                this.selectedAudit.emit('empty');
              }
              else if (this.folderOrAuditSelectedId != result.auditId) {
                let sectionSub = this.checkSubData(this.folderTreeModel, result.auditId);
                if (sectionSub != undefined && sectionSub != null && sectionSub.length > 0) {
                  let checkRefresh = this.checkDeleteRefresh(sectionSub, this.folderOrAuditSelectedId);
                  if (checkRefresh && checkRefresh != undefined) {
                    this.selectedKeys = ['0'];
                    this.folderOrAuditSelectedId = this.folderTreeModel[0].auditId;
                    this.cdRef.markForCheck();
                    this.selectedAudit.emit('empty');
                  }
                }
              }
              this.findAuditIndexCategorydata(this.folderTreeModel, result.auditId, null, true);
            }
          }
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
        tap((result: any) => {
          if (result && result.conductId) {
            localStorage.setItem('ConductedAudit', result.conductId);
            // this.routes.navigate(["audits/auditsview/1"]);
            // this.auditService.redirectedConductId = result.conductId;
            if (this.routes.url.includes("/audit/")) {
              this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/audit/conducts');
            } else {
              this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/conducts');
            }
            this.cdRef.markForCheck();
          }
        })
      ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
    this.componentModel.backendApi = environment.apiURL;
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });

    let roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
    this.canDragOrDrop = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateAuditFolder.toString().toLowerCase(); }) != null;
    this.cdRef.markForCheck();
    this.getDefaultWorkflows();
    this.getConductUserDropdown();
    this.getBranchDropdown();
    this.getBusinessUnits();
  }


  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }
  getDefaultWorkflows() {
    this.auditService.getDefaultWorkflows()
      .subscribe((res: any) => {
        if (res.success && res.data && res.data.length > 0)
          this.defaultWorkflows = res.data[0];
      })
  }

  getConductUserDropdown() {
    // this.auditService.getConductUserDropdown("audit").subscribe((result: any) => {
    //   if (result.success) {
    //     this.userDropdown = result.data;
    //     this.cdRef.markForCheck();
    //   }
    //   else {
    //     this.userDropdown = [];
    //     this.validationMessage = result.apiResponseMessages[0].message;
    //     this.cdRef.markForCheck();
    //   }
    // })
    this.employeeService.getAllProjectMembers(this.projectId).subscribe((response: any) => {
      if (response.success) {
        this.userDropdown = response.data;
        this.cdRef.markForCheck();
      }
      else {
        this.userDropdown = [];
        this.cdRef.markForCheck();
      }
    });
  }


  getAudit(data) {
    for (var i = 0; i < this.folderTreeModel.length; i++) {
      if (this.folderTreeModel[i].auditId.toLowerCase() == data.auditId.toLowerCase()) {
        this.folderTreeModel[i] == data;
        if ((this.folderOrAuditSelectedId.toLowerCase() == data.auditId.toLowerCase()) && (this.folderTreeModel[i].auditId.toLowerCase() == this.folderOrAuditSelectedId.toLowerCase())) {
          this.selectedAudit.emit(this.folderTreeModel[i]);
        }
      } else if (this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
        this.getAuditFromChildren(data, this.folderTreeModel[i].children);
      }
    }
  }

  getAuditFromChildren(data, children) {
    for (var j = 0; j < children.length; j++) {
      if (children[j].auditId.toLowerCase() == data.auditId.toLowerCase()) {
        children[j] == data;
        if ((this.folderOrAuditSelectedId.toLowerCase() == data.auditId.toLowerCase()) && (children[j].auditId.toLowerCase() == this.folderOrAuditSelectedId.toLowerCase())) {
          this.selectedAudit.emit(children[j]);
        }
      } else if (children[j].children && children[j].children.length > 0) {
        this.getAuditFromChildren(data, children[j].children);
      }
    }
  }


  getBranchDropdown() {
    let branch = new HrBranchModel();
    this.auditService.getBrachDropdown(branch).subscribe((result: any) => {
      if (result.success) {
        this.branchDropdown = result.data;
        this.cdRef.markForCheck();
      }
      else {
        this.branchDropdown = [];
        this.validationMessage = result.apiResponseMessages[0].message;
        this.cdRef.markForCheck();
      }
    })
  }

  loadAuditList() {
    this.changeRelatedVariables();
    let auditModel = new AuditCompliance();
    auditModel.isArchived = this.isArchived;
    this.store.dispatch(new LoadAuditListTriggered(auditModel));
    // this.auditList$ = this.store.pipe(select(auditModuleReducer.getAuditAll),
    //   tap(result => {
    //     if (result && result.length > 0) {
    //       let auditsList = result;
    //       this.auditOccurance = this.auditOccurance + 1;
    //       if (this.auditOccurance <= 1 || (this.selectedAuditId == this.deletedCategoryId && result.length > 0)) {
    //         // let index = auditsList.findIndex(x => x.auditId == deletedCategoryId);
    //         this.selectedAuditId = auditsList[0].auditId;
    //         this.selectedAudit.emit(auditsList[0]);
    //       }
    //       if (this.auditOccurance <= 1 && result.length > 0) {
    //         this.loadAuditRelatedData.emit(true);
    //       }
    //     }
    //     else if (result.length == 0) {
    //       this.auditOccurance = 0;
    //       this.selectedAuditId = null;
    //       this.deletedCategoryId = null;
    //       this.loadAuditRelatedData.emit(false);
    //       this.cdRef.detectChanges();
    //     }
    //   }));
  }

  loadAuditFolderView() {
    this.anyOperationInProgress = true;
    this.expandKeys = [];
    let treeModel = new AuditCompliance();
    treeModel.projectId = this.projectId;
    treeModel.isArchived = this.isArchived;
    treeModel.periodValue = this.selectedPeriod;
    treeModel.dateFrom = this.dateFrom;
    treeModel.dateTo = this.dateTo;
    treeModel.userId = this.selectedUser;
    treeModel.branchId = this.selectedBranch;
    treeModel.businessUnitIds = this.businessUnitIds ? this.businessUnitIds.value : null;
    this.auditService.getAuditsFolderView(treeModel).subscribe((response: any) => {
      if (response.success) {
        let folderStructure = response.data;
        this.folderTreeModel = folderStructure ? JSON.parse(folderStructure) : [];
        this.filteredFolderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
        if (this.folderTreeModel.length > 0) {
          let firstAudit = this.checkFirstAudit(this.folderTreeModel);
          if (firstAudit) {
            this.folderOrAuditSelectedId = firstAudit.auditId;
            this.findIndexCategorydata(this.folderOrAuditSelectedId);
            // this.selectedKeys = [firstAudit.auditId.toString()];
            this.selectedAudit.emit(firstAudit);
          }
          else {
            this.folderOrAuditSelectedId = this.folderTreeModel[0].auditId;
            this.selectedKeys = ['0'];
            this.selectedAudit.emit('empty');
          }
        }
        else {
          this.folderOrAuditSelectedId = null;
          this.selectedKeys = [];
          this.selectedAudit.emit('empty');
        }
        this.getParentTextProperties(this.folderTreeModel);
        this.getAllTextProperties(this.folderTreeModel);
        this.anyOperationInProgress = false;
        this.callSucceeded = true;
        this.cdRef.markForCheck();
      }
      else {
        this.anyOperationInProgress = false;
        this.folderTreeModel = [];
        this.selectedKeys = [];
        this.selectedAudit.emit('empty');
        let validationmessage = response.apiResponseMessages[0].message;
        this.toastr.error(validationmessage);
        this.callSucceeded = true;
        this.cdRef.markForCheck();
      }
    }, (error) => {
      this.anyOperationInProgress = false;
      this.callSucceeded = true;
      this.folderTreeModel = [];
      this.selectedAudit.emit('empty');
      // Need to remove later
      this.getParentTextProperties(this.folderTreeModel);
      this.getAllTextProperties(this.folderTreeModel);
      // Need to remove later
      this.cdRef.markForCheck();
    })
  }

  openExportPopover() {
    this.exportsPopover.open();
  }

  exportaudit() {
    if (this.toMails && this.toMails.trim() != '') {
      this.disableExport = true;
      this.emptyMail = false;
      var mails = this.toMails.split('\n');
      const regexp = new RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$');
      //var isValid = this.toMails.match(regexp);
      var isValid: string[] = mails.filter(i => !i.match(regexp));
      if (isValid.length > 0) {
        this.toastr.error("You have entered an invalid email address!");
        this.disableExport = false;
        return;
      }
      let suiteNames = (this.auditName == undefined || this.auditName == null) ? null : this.auditName;
      let suites = [];
      if (suiteNames != null && suiteNames.trim() != '') {
        suiteNames = suiteNames.trim();
        let array = suiteNames.split(',');
        if (array.length > 0) {
          for (var i = 0; i < array.length; i++) {
            suites.push(array[i].trim());
          }
          suiteNames = suites.toString();
        }
      }
      let exportModel = new AuditsExportModel();
      exportModel.auditName = this.auditName;
      exportModel.toMails = (this.toMails && this.toMails.trim() != '') ? this.toMails.trim() : null;
      exportModel.download = 'excel';
      exportModel.projectId = this.projectId;
      exportModel.isForFilter = true;
      this.auditService.GetAuditDataForJson(exportModel).subscribe((result: any) => {
        if (result.success) {
          this.toastr.info(this.translateService.instant(ConstantVariables.SuccessMessageForMailSent));
          this.closeExportPopover();
        }
        else {
          this.disableExport = false;
          let validationmessage = result.apiResponseMessages[0].message;
          this.toastr.error(validationmessage);
        }
      });
      // }
      // else {
      //   this.toastr.error("You have entered an invalid email address!");
      //   this.disableExport = false;
      // }
    }
    else {
      this.emptyMail = true;
      this.disableExport = false;
      this.cdRef.markForCheck();
    }
  }

  openImportPopover(isCsvImport, isExcelImport) {
    if (isCsvImport) {
      this.isCsvImport = isCsvImport;
      this.isExcelImport = false;
      this.acceptableFileFormat = this.isCsvImport ? 'text/csv' : 'text/xml';
      this.disableImport = true;
      this.cdRef.markForCheck();
      this.importsPopover.open();
    }
    else if (isExcelImport) {
      this.isExcelImport = isExcelImport;
      this.isCsvImport = false;
      this.acceptableFileFormat = this.isExcelImport ? 'text/csv' : 'text/xml';
      this.disableImport = true;
      this.cdRef.markForCheck();
      this.importsPopover.open();
    }
  }

  closeImportPopover() {
    this.importsPopover.close();
    this.disableImport = false;
    this.cdRef.markForCheck();
  }

  downloadAuditsCsvTemplate() {
    this.auditService.downloadAuditsCsvTemplate().subscribe((response: any) => {
      var blob = new Blob([response], { type: "text/csv" });
      FileSaver.saveAs(blob, "SampleAuditImport.csv");
      this.closeMenuPopover();
    }, function (error) {
      this.toastrService.error("Template download failed.");
    });
  }

  closeMenuPopover() {
    this.threeDotsPopOver.close();
  }

  closeExportPopover() {
    this.exportsPopover.close();
    this.disableExport = false;
    this.auditName = null;
    this.toMails = null;
    this.emptyMail = false;
    this.cdRef.markForCheck();
  }

  filesSelected(event) {
    this.files = this.isCsvImport || this.isExcelImport ? event.rejectedFiles : event.addedFiles;
    if (this.files && this.files.length > 0) {
      this.disableImport = false;
      this.cdRef.detectChanges();
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.disableImport = true;
    this.cdRef.markForCheck();
  }

  importaudit() {
    this.disableImport = true;
    this.importProgress = true;
    if (this.files.length > 0) {
      const formData = new FormData();
      formData.append("file", this.files[0]);
      if (this.isCsvImport) {
        this.auditService.ImportAuditFromCsv(formData, this.projectId).subscribe((result: any) => {
          if (result.success) {
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            this.toastr.info("", this.softLabePipe.transform(this.translateService.instant('AUDIT.IMPORTCOMPLEDCONFIRMATION'), this.softLabels));
            this.closeImportPopover();
            this.cdRef.detectChanges();
          }
          else {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessage);
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            this.cdRef.detectChanges();
          }
          this.closeMenuPopover();
        })
      } else if (this.isExcelImport) {
        this.auditService.ImportAuditFromExcel(formData, this.projectId).subscribe((result: any) => {
          if (result.success) {
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            this.toastr.info("", this.softLabePipe.transform(this.translateService.instant('AUDIT.IMPORTCOMPLEDCONFIRMATION'), this.softLabels));
            this.closeImportPopover();
            this.cdRef.detectChanges();
          }
          else {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessage);
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            this.cdRef.detectChanges();
          }
          this.closeMenuPopover();
        })
      }
      else {
        // this.auditService.ImportAudit(formData, this.projectName).subscribe((result: any) => {
        //   if (result.success) {
        //     this.disableImport = false;
        //     this.importProgress = false;
        //     this.files = [];
        //     let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
        //     let msg;
        //     if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined' || currentCulture == undefined)
        //       msg = "Scenario will be imported soon. Please, refresh after some time";
        //     else if (currentCulture == 'te')
        //       msg = "దృశ్యం త్వరలో సృష్టించబడుతుంది. దయచేసి, కొంత సమయం తర్వాత రిఫ్రెష్ చేయండి";
        //     else
        //       msg = "시나리오가 곧 생성됩니다. 잠시 후 새로 고침하세요";
        //     this.toastr.info("", this.softLabePipe.transform(msg, this.softLabels));
        //     this.closeImportPopover();
        //     this.cdRef.detectChanges();
        //   }
        //   else {
        //     this.validationMessage = result.apiResponseMessages[0].message;
        //     this.toastr.error(this.validationMessage);
        //     this.disableImport = false;
        //     this.importProgress = false;
        //     this.cdRef.detectChanges();
        //   }
        //   this.closeMenuPopover();
        // })
      }
    }
  }

  changeRelatedVariables() {
    this.auditOccurance = 0;
    this.selectedAuditId = null;
    this.deletedCategoryId = null;
    this.cdRef.markForCheck();
  }

  handleClickOnAuidtItem(audit) {
    this.selectedAuditId = audit.auditId;
    this.selectedAudit.emit(audit);
  }

  getDeletedCategoryId(data) {
    this.deletedCategoryId = data;
  }

  closeSearch() {
    this.toggleSearchData();
  }

  openAuditDialog(addAuditPopover, auditData) {
    this.loadAddAudit = true;
    this.isEditAudit = false;
    this.parentAuditId = auditData ? auditData.auditId : null;
    this.cdRef.markForCheck();
    addAuditPopover.openPopover();
  }

  closeAuditDialog() {
    this.loadAddAudit = false;
    this.addComplianceAuditPopover.forEach(p => p.closePopover());
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  auditdetailsOpen(auditData) {
    this.auditRequiredData = auditData;
    this.tagsvalue(this.auditRequiredData);
    this.auditDetailsPopover.open();
    this.cdRef.markForCheck();
  }

  tagsvalue(data) {
    var tags = data.auditTagsModels;
    let tagValue = [];
    if (tags && tags.length > 0) {
      tags.forEach(element => {
        tagValue.push(element.tagName)
      });
      this.tagNames = tagValue.toString();
      this.cdRef.markForCheck();
    }
    else {
      this.tagNames = null;
      this.cdRef.markForCheck();
    }
  }

  closeAuditDetailsPopover() {
    this.auditRequiredData = null;
    this.auditDetailsPopover.close();
    this.cdRef.markForCheck();
  }

  assignAuditData(auditData) {
    this.auditRequiredData = auditData;
    this.cdRef.markForCheck();
  }

  detailsOpen(auditData) {
    this.auditRequiredData = auditData;
    this.isEditAudit = true;
    this.cdRef.markForCheck();
    this.editAuditPopover.open();
  }

  closeEditAuditDialog() {
    this.isEditAudit = false;
    this.trigger.closeMenu();
    let popover = this.editAuditPopover;
    if (popover._open)
      popover.close();
    // this.isEditAudit = false;
    this.auditRequiredData = null;
    this.cdRef.markForCheck();
  }

  openCustomFields(auditData) {
    this.auditRequiredData = auditData;
    this.cdRef.markForCheck();
    this.customFieldsPopover.open();
  }

  openAddComment(auditData) {
    this.auditRequiredData = auditData;
    this.cdRef.markForCheck();
    this.addCommentPopover.open();
  }

  setAlignmentForpopUp() {
    if (this.pageY <= 400) {
      return "center";
    }
    else {
      return "above";
    }
  }

  closeCustomFieldsPopover() {
    let popover = this.customFieldsPopover;
    if (popover._open)
      popover.close();
    this.auditRequiredData = null;
    this.cdRef.markForCheck();
  }

  closeAddCommentPopover() {
    let popover = this.addCommentPopover;
    if (popover._open)
      popover.close();
    this.auditRequiredData = null;
    this.cdRef.markForCheck();
  }

  openCloneAuditPopover(auditData) {
    this.auditRequiredData = auditData;
    this.cloneAuditPopover.open();
    this.cdRef.markForCheck();
  }

  auditClone() {
    this.disableAuditClone = true;
    let audit = new AuditCompliance();
    audit = Object.assign({}, this.auditRequiredData);
    audit.projectId = this.projectId;
    this.store.dispatch(new LoadAuditCloneTriggered(audit));
  }

  closeAuditClonePopover() {
    this.auditRequiredData = null;
    this.cloneAuditPopover.close();
    this.trigger.closeMenu();
    this.cdRef.detectChanges();
  }

  openAuditVersionPopover(auditData) {
    this.auditRequiredData = auditData;
    this.initializeAuditVersionForm();
    this.versionAuditPopover.open();
    this.cdRef.markForCheck();
  }

  addAuditVersion() {
    this.disableAddVersion = true;
    let model = new AuditCompliance();
    model = this.auditVersionForm.value;
    model.auditId = this.auditRequiredData.auditId;
    this.auditService.createAuditVersion(model).subscribe((response: any) => {
      if (response.success) {
        this.disableAddVersion = false;
        let searchAudit = new AuditCompliance();
        searchAudit.auditId = model.auditId;
        searchAudit.isArchived = false;
        searchAudit.canRefreshAudit = true;
        this.store.dispatch(new LoadAuditByIdTriggered(searchAudit));
        this.closeAuditVersionPopover();
        this.snackbar.open(this.translateService.instant('TESTMANAGEMENT.MILESTONECREATEDSUCCESSFULLY'), this.translateService.instant(ConstantVariables.success), { duration: 2000 });
      }
      else {
        this.disableAddVersion = false;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.cdRef.markForCheck();
      }
    });
  }

  initializeAuditVersionForm() {
    this.auditVersionForm = new FormGroup({
      auditVersionName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(15)])),
      auditVersionNameDescription: new FormControl(null, [])
    });
  }

  closeAuditVersionPopover() {
    this.auditRequiredData = null;
    this.versionAuditPopover.close();
    this.trigger.closeMenu();
    this.cdRef.detectChanges();
  }

  openAuditVersionHistoryPopover(auditData) {
    this.auditRequiredData = auditData;
    this.loadVersionHistory(auditData.auditId);
    this.versionHistoryPopover.open();
    this.cdRef.markForCheck();
  }

  loadVersionHistory(auditId) {
    this.loadingAuditVersions = true;
    let versionModel = new AuditCompliance();
    versionModel.auditId = auditId;
    versionModel.projectId = this.projectId;
    this.auditService.getAuditRelatedVersions(versionModel).subscribe((response: any) => {
      if (response.success) {
        this.auditVersions = response.data;
        this.loadingAuditVersions = false;
        this.cdRef.markForCheck();
      }
      else {
        this.auditVersions = [];
        this.loadingAuditVersions = false;
        this.cdRef.markForCheck();
      }
    });
  }

  closeAuditVersionHistoryPopover() {
    this.auditRequiredData = null;
    this.versionHistoryPopover.close();
    this.trigger.closeMenu();
    this.cdRef.markForCheck();
  }

  openAuditRelatedVersionPopover(auditId) {
    this.auditVersionId = auditId;
    this.loadPopover = true;
    let dialogId = "audit-version-unique-dialog";
    const dialogRef = this.dialog.open(this.auditVersionUniqueDetailDialog, {
      height: "90vh",
      width: "90%",
      direction: 'ltr',
      id: dialogId,
      data: { auditId: auditId, notFromAuditVersion: false, projectId: this.projectId, dialogId: dialogId },
      disableClose: true,
      panelClass: 'userstory-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => { });
    // this.openAuditsPagePopover.open();
  }

  closeSatPopover(value) {
    this.auditVersionId = null;
    this.loadPopover = false;
    // this.openAuditsPagePopover.close();
    this.cdRef.markForCheck();
  }

  openArchiveAuditPopover(auditData) {
    this.auditRequiredData = auditData;
    this.cdRef.markForCheck();
    this.deleteAuditPopover.open();
  }

  deleteSelectedAudit(value) {
    if (this.auditRequiredData.conductsCount > 0) {
      this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForAuditError));
    }
    else {
      this.disableAuditDelete = true;
      let audit = new AuditCompliance();
      audit = Object.assign({}, this.auditRequiredData);
      // audit.schedulingDetails = new RecurringCronExpressionModel();
      // audit.schedulingDetails = Object.assign({}, this.auditData);
      audit.isArchived = value;
      if (audit.isArchived == false)
        audit.auditUnarchive = true;
      else
        audit.auditUnarchive = false;
      audit.isToBeDeleted = true;
      audit.fromAuditComponent = true;
      audit.projectId = this.projectId;
      this.store.dispatch(new LoadAuditTriggered(audit));
      // this.deletedCategoryId.emit(this.auditRequiredData.auditId);
      // this.checkTooltipStatus();
    }
  }

  closeDeleteAuditPopover() {
    this.auditRequiredData = null;
    this.deleteAuditPopover.close();
    this.trigger.closeMenu();
    this.cdRef.markForCheck();
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
    this.selectedAuditConduct = auditControl;
  }

  closeAuditConductDialog() {
    this.loadAddAuditConduct = false;
    this.addAuditConductsPopover.close();
    this.trigger.closeMenu();
  }

  openTagsPopUp(auditData) {
    this.auditRequiredData = auditData;
    if (this.auditRequiredData.auditTagsModels && this.auditRequiredData.auditTagsModels.length > 0) {
      this.auditRequiredData.auditTagsModels.forEach(x => {
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
    tagsModel.auditId = this.auditRequiredData.auditId;
    tagsModel.auditTagsModels = this.auditInputTags;
    tagsModel.projectId = this.projectId;
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
    this.tagInput.nativeElement.value = '';
    if (this.auditTagPopover._open)
      this.auditTagPopover.close();
    if (this.cloneAuditPopover._open)
      this.cloneAuditPopover.close();
    this.trigger.closeMenu();
    this.tag = null;
    this.auditRequiredData = null;
    this.cdRef.markForCheck();
  }

  copyLink(auditData) {
    const angularRoute = this.routes.url;
    const url = window.location.href;
    let uniqueNumberUrl = url.replace(angularRoute, "");
    // uniqueNumberUrl = uniqueNumberUrl + "/audits/" + auditData.auditId + "/audit";
    uniqueNumberUrl = uniqueNumberUrl + "/projects/audit/" + auditData.auditId;
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    // tslint:disable-next-line: max-line-length
    this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
  }

  openInNewTab(auditData) {
    const angularRoute = this.routes.url;
    const url = window.location.href;
    let uniqueNumberUrl = url.replace(angularRoute, "");
    // uniqueNumberUrl = uniqueNumberUrl + "/audits/" + auditData.auditId + "/audit";
    uniqueNumberUrl = uniqueNumberUrl + "/projects/audit/" + auditData.auditId;
    window.open(uniqueNumberUrl, "_blank");
    // this.routes.navigate(["audits/" + this.auditData.auditId + "/audit"]);
  }

  openAddEditFolder(addEditAuditPopover, auditData, isEditFolder) {
    this.editFolder = isEditFolder;
    this.initializeAuditFolderForm();
    if (this.editFolder)
      this.auditFolderForm.patchValue(auditData);
    else
      this.auditFolderForm.get('parentAuditId').setValue(auditData.auditId);
    addEditAuditPopover.openPopover();
    this.cdRef.markForCheck();
  }

  addOrEditAuditFolder() {
    this.disableAddEditFolder = true;
    let auditFolderModel = new AuditCompliance();
    auditFolderModel = this.auditFolderForm.value;
    auditFolderModel.projectId = this.projectId;
    auditFolderModel.timeStamp = auditFolderModel.folderTimeStamp;
    this.auditService.upsertAuditFolder(auditFolderModel).subscribe((response: any) => {
      if (response.success) {
        this.getAuditFolderDetailsById(response.data, false, this.editFolder);
      }
      else {
        this.disableAddEditFolder = false;
        this.toastr.error(response.apiResponseMessages[0].message);
        this.cdRef.markForCheck();
      }
    });
  }

  initializeAuditFolderForm() {
    this.auditFolderForm = new FormGroup({
      auditId: new FormControl(null, []),
      auditName: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(150)])),
      parentAuditId: new FormControl(null, []),
      folderTimeStamp: new FormControl(null, []),
      timeStamp: new FormControl(null, [])
    });
  }

  closeAddEditFolder() {
    this.trigger.closeMenu();
    this.editFolder = false;
    this.disableAddEditFolder = false;
    this.addOrEditAuditPopover.forEach(p => p.closePopover());
    this.initializeAuditFolderForm();
    this.cdRef.markForCheck();
  }

  openDeleteFolderPopover(auditData) {
    this.auditRequiredData = auditData;
    this.deleteFolderPopover.open();
    let sectionSub = (auditData.children && auditData.children.length > 0) ? auditData.children : [];
    if (sectionSub != undefined && sectionSub != null && sectionSub.length > 0) {
      let auditsPresent = this.checkAuditPresent(sectionSub);
      if (auditsPresent && auditsPresent != undefined) {
        this.folderCantDelete = true;
        this.cdRef.markForCheck();
      }
      else {
        this.folderCantDelete = false;
        this.cdRef.markForCheck();
      }
    }
    else {
      this.folderCantDelete = false;
      this.cdRef.markForCheck();
    }
  }

  deleteSelectedAuditFolder() {
    if (this.folderCantDelete) {
      this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForAuditFolderDeleteError));
    }
    else {
      this.disableAuditFolderDelete = true;
      let auditFolderModel = new AuditCompliance();
      auditFolderModel = Object.assign({}, this.auditRequiredData);
      auditFolderModel.timeStamp = auditFolderModel.folderTimeStamp;
      auditFolderModel.projectId = this.projectId;
      auditFolderModel.isArchived = true;
      this.auditService.upsertAuditFolder(auditFolderModel).subscribe((response: any) => {
        if (response.success) {
          this.disableAuditFolderDelete = false;
          if (this.folderOrAuditSelectedId && auditFolderModel.auditId == this.folderOrAuditSelectedId) {
            this.selectedKeys = ['0'];
            this.folderOrAuditSelectedId = this.folderTreeModel[0].auditId;
            this.cdRef.markForCheck();
            this.selectedAudit.emit('empty');
          }
          else if (this.folderOrAuditSelectedId != auditFolderModel.auditId) {
            let sectionSub = this.checkSubData(this.folderTreeModel, auditFolderModel.auditId);
            if (sectionSub != undefined && sectionSub != null && sectionSub.length > 0) {
              let checkRefresh = this.checkDeleteRefresh(sectionSub, this.folderOrAuditSelectedId);
              if (checkRefresh && checkRefresh != undefined) {
                this.selectedKeys = ['0'];
                this.folderOrAuditSelectedId = this.folderTreeModel[0].auditId;
                this.cdRef.markForCheck();
                this.selectedAudit.emit('empty');
              }
            }
          }
          this.getAuditFolderDetailsById(response.data, true, false);
          this.cdRef.markForCheck();
        }
        else {
          this.disableAuditFolderDelete = false;
          this.toastr.error(response.apiResponseMessages[0].message);
          this.cdRef.markForCheck();
        }
      });
    }
  }

  closeDeleteAuditFolderPopover() {
    this.auditRequiredData = null;
    this.disableAuditFolderDelete = false;
    this.deleteFolderPopover.close();
    this.trigger.closeMenu();
    this.cdRef.markForCheck();
  }

  public keys: string[] = this.keyIndexes;

  /**
   * A function that checks whether a given node index exists in the expanded keys collection.
   * If the index can be found, the node is marked as expanded.
   */
  public isExpanded = (dataItem: any, index: string) => {
    return this.keys.indexOf(index) > -1;
  }

  expand() {
    this.expandKeys = this.allParentNodes.slice();
  }

  collapse() {
    this.expandKeys = [this.folderTreeModel[0].auditId];
  }

  /**
   * A `collapse` event handler that will remove the node hierarchical index
   * from the collection, collapsing its children.
   */
  public handleCollapse(node) {
    this.keys = this.keys.filter(k => k !== node.index);
  }

  /**
   * An `expand` event handler that will add the node hierarchical index
   * to the collection, expanding the its children.
   */
  public handleExpand(node) {
    this.keys = this.keys.concat(node.index);
  }

  public handleSelection(event: any): void {
    this.selectedKeys = [event.index];
    let data = event.dataItem;
    this.folderOrAuditSelectedId = data.auditId;
    this.cdRef.markForCheck();
    if (data && data.isAudit) {
      this.selectedAudit.emit(data);
    }
    else {
      this.selectedAudit.emit('empty');
    }
  }

  public isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;

  iconClass({ isAudit }: any): any {
    return {
      'k-i-folder': (isAudit == false),
      'k-i-clipboard-text': (isAudit == true),
      'k-icon': true,
      'mt-02': true
    };
  }

  public handleDrop(event: TreeItemDropEvent): void {
    this.log('nodeDrop', event);
    if (this.isSearching || !this.canDragOrDrop) {
      event.setValid(false);
    }
    else if (event.destinationItem.item.dataItem.isAudit && event.dropPosition === DropPosition.Over) {
      event.setValid(false);
    }
    else if (event.destinationItem.item.dataItem.parentAuditId == null && (event.dropPosition === DropPosition.Before || event.dropPosition === DropPosition.After)) {
      event.setValid(false);
    }
    else if (event.sourceItem.item.dataItem.parentAuditId == event.destinationItem.item.dataItem.auditId && event.dropPosition === DropPosition.Over) {
      event.setValid(false);
    }
    else if (event.sourceItem.item.dataItem.parentAuditId == event.destinationItem.item.dataItem.parentAuditId && (event.dropPosition === DropPosition.Before || event.dropPosition === DropPosition.After)) {
      event.setValid(false);
    }
    else if (event.sourceItem.item.dataItem.parentAuditId == null && event.dropPosition === DropPosition.Over) {
      event.setValid(false);
    }
    else if (event.sourceItem.item.dataItem.isAudit == false && event.dropPosition === DropPosition.Over) {
      let data = this.folderTreeModel;
      let folderDetails = new AuditCompliance();
      folderDetails = Object.assign({}, event.sourceItem.item.dataItem);
      folderDetails.parentAuditId = event.destinationItem.item.dataItem.auditId;
      folderDetails.projectId = this.projectId;
      this.auditService.upsertAuditFolder(folderDetails).subscribe((response: any) => {
        if (response.success) {
          // this.getAuditFolderDetailsById(response.data, false, true);
          this.updateAuditOrFolderParentIdData(this.folderTreeModel, folderDetails.auditId, folderDetails.parentAuditId);
          this.findIndexCategorydata(this.folderOrAuditSelectedId);
        }
        else {
          event.setValid(false);
          this.toastr.error(response.apiResponseMessages[0].message);
        }
      });
    }
    else if (event.sourceItem.item.dataItem.isAudit == false && (event.dropPosition === DropPosition.Before || event.dropPosition === DropPosition.After)) {
      let folderDetails = new AuditCompliance();
      folderDetails = Object.assign({}, event.sourceItem.item.dataItem);
      folderDetails.parentAuditId = event.destinationItem.item.dataItem.parentAuditId;
      this.auditService.upsertAuditFolder(folderDetails).subscribe((response: any) => {
        if (response.success) {
          // this.getAuditFolderDetailsById(response.data, false);
          this.updateAuditOrFolderParentIdData(this.folderTreeModel, folderDetails.auditId, folderDetails.parentAuditId);
          this.findIndexCategorydata(this.folderOrAuditSelectedId);
        }
        else {
          event.setValid(false);
          this.toastr.error(response.apiResponseMessages[0].message);
        }
      });
    }
    else if (event.sourceItem.item.dataItem.isAudit && event.dropPosition === DropPosition.Over) {
      let auditDetails = new AuditCompliance();
      auditDetails = Object.assign({}, event.sourceItem.item.dataItem);
      auditDetails.parentAuditId = event.destinationItem.item.dataItem.auditId;
      auditDetails.projectId = this.projectId;
      this.auditService.upsertAuditCompliance(auditDetails).subscribe((response: any) => {
        if (response.success) {
          // this.getAuditDetailsById(response.data, false, true);
          this.updateAuditOrFolderParentIdData(this.folderTreeModel, auditDetails.auditId, auditDetails.parentAuditId);
          this.findIndexCategorydata(this.folderOrAuditSelectedId);
        }
        else {
          event.setValid(false);
          this.toastr.error(response.apiResponseMessages[0].message);
        }
      });
    }
    else if (event.sourceItem.item.dataItem.isAudit && (event.dropPosition === DropPosition.Before || event.dropPosition === DropPosition.After)) {
      let auditDetails = new AuditCompliance();
      auditDetails = Object.assign({}, event.sourceItem.item.dataItem);
      auditDetails.parentAuditId = event.destinationItem.item.dataItem.parentAuditId;
      this.auditService.upsertAuditCompliance(auditDetails).subscribe((response: any) => {
        if (response.success) {
          // this.getAuditDetailsById(response.data, false);
          this.updateAuditOrFolderParentIdData(this.folderTreeModel, auditDetails.auditId, auditDetails.parentAuditId);
          this.findIndexCategorydata(this.folderOrAuditSelectedId);
        }
        else {
          event.setValid(false);
          this.toastr.error(response.apiResponseMessages[0].message);
        }
      });
    }
  }

  public log(event: string, args?: any): void {
    console.log(event, args);
  }

  getAuditFolderDetailsById(auditId, isDeletion, isEditFolder) {
    if (!isDeletion) {
      let model = new AuditCompliance();
      model.auditId = auditId;
      model.projectId = this.projectId;
      model.isArchived = false;
      this.auditService.searchAuditFolders(model).subscribe((response: any) => {
        if (response.success && response.data && response.data.length > 0) {
          let details = response.data[0];
          this.disableAddEditFolder = false;
          this.cdRef.markForCheck();
          this.toggleSearchData();
          if (!isEditFolder) {
            this.pushAuditOrFolderIndexCategorydata(this.folderTreeModel, details.parentAuditId, details, false);
            this.allParentNodes.push(details.auditId);
            this.expandKeys.push(details.auditId);
            this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
            this.closeAddEditFolder();
          }
          else {
            this.findFolderIndexCategorydata(this.folderTreeModel, details.auditId, details, isDeletion);
            this.closeAddEditFolder();
          }
        }
        else {
          this.disableAddEditFolder = false;
          this.cdRef.markForCheck();
        }
      });
    }
    else {
      this.toggleSearchData();
      this.findFolderIndexCategorydata(this.folderTreeModel, auditId, null, isDeletion);
      this.closeDeleteAuditFolderPopover();
    }
  }

  findFolderIndexCategorydata(nodeDetails, auditId, fileDetails, isDeletion) {
    if (nodeDetails) {
      for (let i = 0; i < nodeDetails.length; i++) {
        if (nodeDetails[i].isAudit == false && nodeDetails[i].auditId == auditId) {
          if (isDeletion) {
            nodeDetails = nodeDetails.splice(i, 1);
          }
          else if (!isDeletion) {
            fileDetails.children = nodeDetails[i].children;
            // nodeDetails[i] = fileDetails;
            nodeDetails.splice(i, 1, fileDetails);
          }
          this.cdRef.detectChanges();
        }
        else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
          let checkSubSections = this.recursiveFindFolderIndexSectiondata(nodeDetails[i].children, auditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  recursiveFindFolderIndexSectiondata(childList, auditId, fileDetails, isDeletion) {
    if (childList) {
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].isAudit == false && childList[i].auditId == auditId) {
          if (isDeletion) {
            childList = childList.splice(i, 1);
          }
          else if (!isDeletion) {
            fileDetails.children = childList[i].children;
            // childList[i] = fileDetails;
            childList.splice(i, 1, fileDetails);
          }
          this.cdRef.detectChanges();
        }
        else if (childList[i].children && childList[i].children.length > 0) {
          let checkSubSections = this.recursiveFindFolderIndexSectiondata(childList[i].children, auditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  updateAuditOrFolderParentIdData(nodeDetails, auditId, parentAuditId) {
    if (nodeDetails) {
      for (let i = 0; i < nodeDetails.length; i++) {
        if (nodeDetails[i].auditId == auditId) {
          nodeDetails[i].parentAuditId = parentAuditId;
          this.cdRef.detectChanges();
        }
        else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
          let checkSubSections = this.recursiveUpdateAuditOrFolderParentIdData(nodeDetails[i].children, auditId, parentAuditId);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  recursiveUpdateAuditOrFolderParentIdData(childList, auditId, parentAuditId) {
    if (childList) {
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].auditId == auditId) {
          childList[i].parentAuditId = parentAuditId;
          this.cdRef.detectChanges();
        }
        else if (childList[i].children && childList[i].children.length > 0) {
          let checkSubSections = this.recursiveUpdateAuditOrFolderParentIdData(childList[i].children, auditId, parentAuditId);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  pushAuditOrFolderIndexCategorydata(nodeDetails, parentAuditId, fileDetails, isDeletion) {
    if (nodeDetails) {
      for (let i = 0; i < nodeDetails.length; i++) {
        if (nodeDetails[i].auditId == parentAuditId) {
          if (isDeletion) {
            nodeDetails = nodeDetails.splice(i, 1);
          }
          else if (!isDeletion) {
            // fileDetails.children = nodeDetails[i].children;
            let children = [];
            if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
              children = [...nodeDetails[i].children];
            }
            children.push(fileDetails);
            nodeDetails[i].children = children;
          }
          // this.folderTreeModel = JSON.parse(JSON.stringify(nodeDetails));
          this.cdRef.detectChanges();
        }
        else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
          let checkSubSections = this.recursivePushAuditOrFolderIndexSectiondata(nodeDetails[i].children, parentAuditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  recursivePushAuditOrFolderIndexSectiondata(childList, parentAuditId, fileDetails, isDeletion) {
    if (childList) {
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].auditId == parentAuditId) {
          if (isDeletion) {
            childList = childList.splice(i, 1);
          }
          else if (!isDeletion) {
            // fileDetails.children = childList[i].children;
            // childList[i] = fileDetails;
            let children = [];
            if (childList[i].children && childList[i].children.length > 0) {
              children = [...childList[i].children];
            }
            children.push(fileDetails);
            childList[i].children = children;
          }
          this.cdRef.detectChanges();
        }
        else if (childList[i].children && childList[i].children.length > 0) {
          let checkSubSections = this.recursivePushAuditOrFolderIndexSectiondata(childList[i].children, parentAuditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  getAuditDetailsById(auditId, isDeletion, isEditAudit) {
    if (!isDeletion) {
      let model = new AuditCompliance();
      model.auditId = auditId;
      model.isArchived = false;
      this.auditService.searchAuditCompliances(model).subscribe((response: any) => {
        if (response.success && response.data && response.data.length > 0) {
          let details = response.data[0];
          this.toggleSearchData();
          if (!isEditAudit) {
            this.pushAuditOrFolderIndexCategorydata(this.folderTreeModel, details.parentAuditId, details, false);
          }
          else {
            this.findAuditIndexCategorydata(this.folderTreeModel, details.auditId, details, isDeletion);
          }
        }
      });
    }
    else {
      this.toggleSearchData();
      this.findAuditIndexCategorydata(this.folderTreeModel, auditId, null, isDeletion);
    }
  }

  findAuditIndexCategorydata(nodeDetails, auditId, fileDetails, isDeletion) {
    if (nodeDetails) {
      for (let i = 0; i < nodeDetails.length; i++) {
        if (nodeDetails[i].isAudit && nodeDetails[i].auditId == auditId) {
          if (isDeletion) {
            nodeDetails = nodeDetails.splice(i, 1);
          }
          else if (!isDeletion && fileDetails) {
            // fileDetails.folderName = fileDetails.fileName;
            // fileDetails.extension = fileDetails.fileExtension;
            // fileDetails.folderReferenceId = fileDetails.referenceId;
            // fileDetails.folderReferenceTypeId = fileDetails.referenceTypeId;
            // fileDetails = Object.assign({}, fileDetails);
            fileDetails.children = nodeDetails[i].children;
            // nodeDetails[i] = fileDetails;
            nodeDetails.splice(i, 1, fileDetails);
          }
          this.cdRef.detectChanges();
        }
        else if (nodeDetails[i].children && nodeDetails[i].children.length > 0) {
          let checkSubSections = this.recursiveFindAuditIndexSectiondata(nodeDetails[i].children, auditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  recursiveFindAuditIndexSectiondata(childList, auditId, fileDetails, isDeletion) {
    if (childList) {
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].isAudit && childList[i].auditId == auditId) {
          if (isDeletion) {
            childList = childList.splice(i, 1);
          }
          else if (!isDeletion && fileDetails && !fileDetails.folderName) {
            // fileDetails.folderName = fileDetails.fileName;
            // fileDetails.extension = fileDetails.fileExtension;
            // fileDetails.folderReferenceId = fileDetails.referenceId;
            // fileDetails.folderReferenceTypeId = fileDetails.referenceTypeId;
            fileDetails.children = childList[i].children;
            // childList[i] = fileDetails;
            childList.splice(i, 1, fileDetails);
          }
          this.cdRef.detectChanges();
        }
        else if (childList[i].children && childList[i].children.length > 0) {
          let checkSubSections = this.recursiveFindAuditIndexSectiondata(childList[i].children, auditId, fileDetails, isDeletion);
          if (checkSubSections != undefined && checkSubSections != undefined)
            return checkSubSections;
        }
      }
    }
  }

  openFolderMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
    // if (this.istoShowEditandDeleteIcons(dataItem)) {
    event.preventDefault();
    viewChild.openMenu();
    // }
  }

  openAuditMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
    // if (this.istoShowEditandDeleteIcons(dataItem)) {
    event.preventDefault();
    this.audit = dataItem;
    if (dataItem.enableWorkFlowForAudit) {
      this.loaded = false;
      this.checkStatus(dataItem);
      this.loadGenericStatusComponent(dataItem);
    } else {
      //this.displayEdit = true;
      this.displaySubmitted = false;
      this.displayConductAudit = true;
    }
    this.pageY = event.pageY;
    this.cdRef.markForCheck();
    viewChild.openMenu();
    // }
  }

  checkStatus(dataItem) {
    //this.displayEdit = ((dataItem.status == ConstantVariables.Draft) || !dataItem.status || dataItem.status == null || dataItem.status == undefined);
    this.displaySubmitted = ((dataItem.enableWorkFlowForAudit && !dataItem.status) || (dataItem.status == ConstantVariables.Draft));
    this.displayConductAudit = dataItem.status == ConstantVariables.Approved;
    this.cdRef.detectChanges();
  }

  outputs = {
    refreshAudit: data => {
      if (data.referenceName == 'Audits') {
        var audit = new AuditCompliance();
        audit.auditId = data.referenceId;
        audit.isArchived = false;
        this.store.dispatch(new LoadAuditByIdTriggered(audit));
      }
      this.getDefaultWorkflows();
    }
  }

  loadGenericStatusComponent(dataItem) {
    this.loaded = false;
    var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
    if (!moduleJson || moduleJson == 'null') {
      console.error(`No modules found`);
      return;
    }
    var modules = JSON.parse(moduleJson);
    var module = _.find(modules, function (module: any) {
      var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == "generic status" });
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
          referenceId: dataItem.auditId,
          referenceName: 'Audits',
          status: dataItem.status,
          statusColor: dataItem.statusColor ? dataItem.statusColor : null,
          auditDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.auditDefaultWorkflowId : null,
          conductDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.conductDefaultWorkflowId : null,
          questionDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.questionDefaultWorkflowId : null
        }
        this.loaded = true;
        this.cdRef.detectChanges();
      // })
  }

  getAllTextProperties(items: Array<any>) {
    items.forEach(i => {
      if (i.children) {
        this.allParentNodes.push(i.auditId);
        this.getAllTextProperties(i.children);
      }
    })
    this.expand();
  }

  getParentTextProperties(items: Array<any>) {
    let parentLevels = [];
    items.forEach(element => {
      parentLevels.push(element.auditId);
      // if (element.children && element.children.length > 0) {
      //   for (let i = 0; i < element.children.length; i++) {
      //     parentLevels.push(element.children[i].auditId);
      //   }
      // }
    });
    if (this.expandKeys && this.expandKeys.length > 0) { } else {
      this.expandKeys = parentLevels;
    }
  }

  selecteNodeDetils(nodeDetails) { }

  checkSearchText(event, text) {
    if (event.keyCode == 13) {
      this.searchText = (text != null) ? text.trim() : null;
      if (this.searchText) {
        this.isSearching = true;
      }
      else {
        this.isSearching = false;
        this.findIndexCategorydata(this.folderOrAuditSelectedId);
      }
      this.filteredFolderTreeModel = [];
      this.folderTreeModel.forEach((element, i) => {
        if (this.folderTreeModel[i].auditName.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.filteredFolderTreeModel.push(Object.assign({}, this.folderTreeModel[i]));
        }
        else if (this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
          let childSections = this.checkSubSectionsList(this.folderTreeModel[i].children);
          if (childSections.length > 0) {
            let parentSection = Object.assign({}, this.folderTreeModel[i]);
            parentSection.children = childSections
            this.filteredFolderTreeModel.push(parentSection);
          }
        }
      });
    }
  }

  checkSubSectionsList(children): any {
    let subSectionsList = [];
    for (let j = 0; j < children.length; j++) {
      if (children[j].auditName.toLowerCase().includes(this.searchText.toLowerCase())) {
        subSectionsList.push(Object.assign({}, children[j]));
      }
      else if (children[j].children && children[j].children.length > 0) {
        let childSubSections = this.checkSubSectionsList(children[j].children);
        if (childSubSections.length > 0) {
          let parentSubSection = Object.assign({}, children[j]);
          parentSubSection.children = childSubSections;
          subSectionsList.push(Object.assign({}, parentSubSection));
        }
      }
    }
    return subSectionsList;
  }

  findIndexCategorydata(folderId) {
    if (this.folderTreeModel) {
      for (let i = 0; i < this.folderTreeModel.length; i++) {
        if (this.folderTreeModel[i].auditId == folderId.toLowerCase()) {
          this.index = i;
          this.selectedKeys = [this.index.toString()];
          this.cdRef.markForCheck();
        }
        else if (this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
          this.index = i.toString();
          this.cdRef.markForCheck();
          this.recursiveFindIndexSectiondata(this.folderTreeModel[i].children, folderId);
        }
      }
    }
  }

  recursiveFindIndexSectiondata(childList, folderId) {
    if (childList) {
      for (let j = 0; j < childList.length; j++) {
        if (childList[j].auditId == folderId.toString().toLowerCase()) {
          this.index = this.index.toString() + '_' + j.toString();
          this.selectedKeys = [this.index.toString()];
          this.cdRef.markForCheck();
        }
        else if (childList[j].children && childList[j].children.length > 0) {
          let value = this.findSubIndexSectiondata(childList[j].children, folderId);
          if (value)
            this.index = this.index.toString() + '_' + j.toString();
          else
            continue;
          this.cdRef.markForCheck();
          this.recursiveFindIndexSectiondata(childList[j].children, folderId);
        }
      }
    }
  }

  findSubIndexSectiondata(childList, folderId) {
    if (childList) {
      for (let j = 0; j < childList.length; j++) {
        if (childList[j].auditId == folderId.toString().toLowerCase()) {
          return true;
        }
        else if (childList[j].children && childList[j].children.length > 0) {
          let value = this.recursiveFindSubIndexSectiondata(childList[j].children, folderId);
          if (value != null && value != undefined)
            return value;
          else
            return false;
        }
      }
      return false;
    }
  }

  recursiveFindSubIndexSectiondata(childList, folderId) {
    if (childList) {
      for (let j = 0; j < childList.length; j++) {
        if (childList[j].auditId == folderId.toString().toLowerCase()) {
          return true;
        }
        else if (childList[j].children && childList[j].children.length > 0) {
          let value = this.recursiveFindSubIndexSectiondata(childList[j].children, folderId);
          if (value != null && value != undefined)
            return value;
        }
      }
      return false;
    }
  }

  toggleSearchData() {
    if (this.isSearching) {
      if (!this.searchStatusText) {
        this.isSearching = false;
      }
      this.searchText = null;
      this.searchTagsText = null;
      //this.searchStatusText = null;
      this.findIndexCategorydata(this.folderOrAuditSelectedId);
      this.cdRef.detectChanges();
    }
  }

  checkSubData(foldersList, auditId) {
    for (let i = 0; i < foldersList.length; i++) {
      if (foldersList[i].auditId == auditId) {
        return foldersList[i].children;
      }
      else if (foldersList[i].children && foldersList[i].children.length > 0) {
        let checkSubSections = this.recursivecheckSubData(foldersList[i].children, auditId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  recursivecheckSubData(childList, auditId) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].auditId == auditId) {
        return childList[i].children;
      }
      else if (childList[i].children && childList[i].children.length > 0) {
        let checkSubSections = this.recursivecheckSubData(childList[i].children, auditId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  checkDeleteRefresh(foldersList, auditId) {
    for (let i = 0; i < foldersList.length; i++) {
      if (foldersList[i].auditId == auditId) {
        return true;
      }
      else if (foldersList[i].children && foldersList[i].children.length > 0) {
        let checkDelete = this.recursivecheckDeleteRefresh(foldersList[i].children, auditId);
        if (checkDelete != undefined && checkDelete != undefined)
          return true;
      }
    }
  }

  recursivecheckDeleteRefresh(childList, auditId) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].auditId == auditId) {
        return true;
      }
      else if (childList[i].children && childList[i].children.length > 0) {
        let checkDelete = this.recursivecheckDeleteRefresh(childList[i].children, auditId);
        if (checkDelete != undefined && checkDelete != undefined)
          return true;
      }
    }
  }

  checkAuditPresent(foldersList) {
    for (let i = 0; i < foldersList.length; i++) {
      if (foldersList[i].isAudit) {
        return true;
      }
      else if (foldersList[i].children && foldersList[i].children.length > 0) {
        let checkDelete = this.recursiveCheckAuditPresent(foldersList[i].children);
        if (checkDelete != undefined && checkDelete != undefined)
          return true;
      }
    }
  }

  recursiveCheckAuditPresent(childList) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].isAudit) {
        return true;
      }
      else if (childList[i].children && childList[i].children.length > 0) {
        let checkDelete = this.recursiveCheckAuditPresent(childList[i].children);
        if (checkDelete != undefined && checkDelete != undefined)
          return true;
      }
    }
  }

  checkFirstAudit(foldersList) {
    for (let i = 0; i < foldersList.length; i++) {
      if (foldersList[i].isAudit) {
        return foldersList[i];
      }
      else if (foldersList[i].children && foldersList[i].children.length > 0) {
        let audit = this.recursiveCheckFirstAudit(foldersList[i].children);
        if (audit && audit != undefined)
          return audit;
      }
    }
  }

  recursiveCheckFirstAudit(childList) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].isAudit) {
        return childList[i];
      }
      else if (childList[i].children && childList[i].children.length > 0) {
        let audit = this.recursiveCheckFirstAudit(childList[i].children);
        if (audit && audit != undefined)
          return audit;
      }
    }
  }

  checkAuditsCount(foldersList) {
    let auditCount = 0;
    if (foldersList && foldersList.length > 0) {
      for (let i = 0; i < foldersList.length; i++) {
        if (foldersList[i].isAudit) {
          auditCount = auditCount + 1;
        }
        if (foldersList[i].children && foldersList[i].children.length > 0) {
          auditCount = this.recursiveCheckAuditsCount(foldersList[i].children, auditCount);
        }
      }
    }
    return auditCount;
  }

  recursiveCheckAuditsCount(childList, auditCount) {
    if (childList && childList.length > 0) {
      for (let i = 0; i < childList.length; i++) {
        if (childList[i].isAudit) {
          auditCount = auditCount + 1;
        }
        if (childList[i].children && childList[i].children.length > 0) {
          auditCount = this.recursiveCheckAuditsCount(childList[i].children, auditCount);
        }
      }
      return auditCount;
    }
  }

  checksearchStatusText(event, text) {
    if (event.keyCode == 13) {
      this.searchStatusText = (text != null) ? text.trim() : null;
      if (this.searchStatusText) {
        this.isSearching = true;
      }
      else {
        this.isSearching = false;
      }
      this.filteredFolderTreeModel = [];
      this.folderTreeModel.forEach((element, i) => {
        let statusMatched = false;
        var parentSection = Object.assign({}, element);
        parentSection.children = [];
        this.filteredFolderTreeModel.push(parentSection);
        for (let j = 0; j < this.folderTreeModel[i].children.length; j++) {
          let e = this.folderTreeModel[i].children[j];
          if (e.isAudit && e.enableWorkFlowForAudit && e.status && e.status.toLowerCase().indexOf(this.searchStatusText.toLowerCase().trim()) != -1) {
            this.filteredFolderTreeModel[0].children.push(e);
          }
          else if (!e.isAudit && !e.isConduct) {
            let childSections = this.checkstatusSub(e);
            if (childSections.length > 0) {
              this.filteredFolderTreeModel[0].children.push(...childSections);
            }
          }
        }
      });
      if (this.filteredFolderTreeModel[0].children.length < 1) {
        this.filteredFolderTreeModel = null;
      }
    }
  }

  checkstatusSub(children): any {
    var subSectionsList = [];
    var parentSection = Object.assign({}, children);
    parentSection.children = [];
    subSectionsList.push(Object.assign({}, parentSection));
    for (let j = 0; j < children.children.length; j++) {
      let e = children.children[j];
      if (e.isAudit && e.enableWorkFlowForAudit && e.status && e.status.toLowerCase().indexOf(this.searchStatusText.toLowerCase().trim()) != -1) {
        /** @type {?} */
        subSectionsList[0].children.push(e);
      }
      else if (!e.isAudit && !e.isConduct) {
        var childSections = this.checkstatusSub(e);
        if (childSections.length > 0) {
          subSectionsList[0].children.push(...childSections);
        }
      }
    }
    return subSectionsList.filter(function (x) {
      return !(!x.isAudit && !x.isConduct && x.children.length < 1);
    });
  }

  checkStatusSubSectionsList(children): any {
    let subSectionsList = [];
    for (let j = 0; j < children.length; j++) {
      let statusMatched = false;
      let tagsModel = children[j].auditTagsModels;
      if (tagsModel && tagsModel.length > 0) {
        for (let k = 0; k < tagsModel.length; k++) {
          if (tagsModel[k].tagName.toLowerCase().indexOf(this.searchStatusText.toLowerCase().trim()) != -1) {
            subSectionsList.push(Object.assign({}, children[j]));
            statusMatched = true;
            break;
          }
        }
      }
      if (!statusMatched && children[j].children && children[j].children.length > 0) {
        let childSubSections = this.checkStatusSubSectionsList(children[j].children);
        if (childSubSections.length > 0) {
          let parentSubSection = Object.assign({}, children[j]);
          parentSubSection.children = childSubSections;
          subSectionsList.push(Object.assign({}, parentSubSection));
        }
      }
    }
    return subSectionsList;
  }

  checkSearchTagsText(event, text) {
    if (event.keyCode == 13) {
      this.searchTagsText = (text != null) ? text.trim() : null;
      if (this.searchTagsText) {
        this.isSearching = true;
      }
      else {
        this.isSearching = false;
      }
      this.filteredFolderTreeModel = [];
      this.folderTreeModel.forEach((element, i) => {
        let tagsMatched = false;
        let tagsModel = this.folderTreeModel[i].auditTagsModels;
        if (tagsModel && tagsModel.length > 0) {
          for (let j = 0; j < tagsModel.length; j++) {
            if (tagsModel[j].tagName.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
              this.filteredFolderTreeModel.push(Object.assign({}, this.folderTreeModel[i]));
              tagsMatched = true;
              break;
            }
          }
        }
        if (!tagsMatched && this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
          let childSections = this.checkTagsSubSectionsList(this.folderTreeModel[i].children);
          if (childSections.length > 0) {
            let parentSection = Object.assign({}, this.folderTreeModel[i]);
            parentSection.children = childSections
            this.filteredFolderTreeModel.push(parentSection);
          }
        }
      });
    }
  }

  checkTagsSubSectionsList(children): any {
    let subSectionsList = [];
    for (let j = 0; j < children.length; j++) {
      let tagsMatched = false;
      let tagsModel = children[j].auditTagsModels;
      if (tagsModel && tagsModel.length > 0) {
        for (let k = 0; k < tagsModel.length; k++) {
          if (tagsModel[k].tagName.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
            subSectionsList.push(Object.assign({}, children[j]));
            tagsMatched = true;
            break;
          }
        }
      }
      if (!tagsMatched && children[j].children && children[j].children.length > 0) {
        let childSubSections = this.checkTagsSubSectionsList(children[j].children);
        if (childSubSections.length > 0) {
          let parentSubSection = Object.assign({}, children[j]);
          parentSubSection.children = childSubSections;
          subSectionsList.push(Object.assign({}, parentSubSection));
        }
      }
    }
    return subSectionsList;
  }

  closeTagsSearch() {
    this.toggleSearchData();
  }

  closeStatusSearch() {
    if (this.isSearching) {
      if (!this.searchTagsText) {
        this.isSearching = false;
      }
      this.searchText = null;
      this.searchStatusText = null;
      this.findIndexCategorydata(this.folderOrAuditSelectedId);
      this.cdRef.detectChanges();
    }
  }

  statusValues(value) {
    this.selectedUser = value;
    this.cdRef.markForCheck();
    this.loadList();
  }

  periodValue(value) {
    if (value == "Select period") {
      this.dateFromfilter = true;
      this.cdRef.markForCheck();
    }
    else {
      this.selectedPeriod = value;
      this.dateTo = null;
      this.dateFrom = null;
      this.dateFromfilter = false;
      this.dateTofilter = false;
      this.cdRef.markForCheck();
      this.loadList();
    }
  }

  branchValue(value) {
    this.selectedBranch = value;
    this.cdRef.markForCheck();
    this.loadList();
  }

  loadList() {
    // this.loadConductList();
    this.loadAuditFolderView();
  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.dateFrom = event.target.value;
    this.minToDate = this.dateFrom;
    this.dateTofilter = true;
    if (this.dateTo)
      this.loadList();
    this.cdRef.markForCheck();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.dateTo = event.target.value;
    this.cdRef.markForCheck();
    this.loadList();
  }

  goToUserProfile(userId) { }

  resetFilters() {
    this.selectedUser = null;
    this.selectedPeriod = null;
    this.selectedBranch = null;
    this.dateTo = null;
    this.dateFrom = null;
    this.dateFromfilter = false;
    this.dateTofilter = false;
    this.searchTagsText = null;
    this.searchStatusText = null;
    this.businessUnitIds = null;
    this.cdRef.markForCheck();
    this.loadList();
  }

  submitAuditToTriggerWorkFlow(triggerWorkFlow) {
    this.submitAudit = true;
    var audit = new AuditCompliance();
    audit = Object.assign({}, this.audit);
    this.auditService.SubmitAuditCompliance(audit)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success("successfully submitted");
          // let auditcompliance = new AuditCompliance();
          // auditcompliance = Object.assign({}, this.audit);
          // this.store.dispatch(new LoadAuditTriggered(audit));
        }
        else {
          this.toastr.error(res.apiResponseMessages[0].message);
        }
        this.submitAudit = false;
        triggerWorkFlow.close();
      })
  }

  getBusinessUnits() {
    this.isAnyOperationIsInprogress = true;
    var businessUnitDropDownModel = new BusinessUnitDropDownModel();
    businessUnitDropDownModel.isArchived = false;
    businessUnitDropDownModel.isFromHR = false;
    this.employeeService.getBusinessUnits(businessUnitDropDownModel).subscribe((response: any) => {
      if (response.success == true) {
        this.allBusinessUnits = response.data;
        this.businessUnitsList = this.allBusinessUnits;
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });
  }

  getSelectedBusinessUnits() {

    let businessUnitvalues;
    if (Array.isArray(this.businessUnitIds.value))
      businessUnitvalues = this.businessUnitIds.value;
    else
      businessUnitvalues = this.businessUnitIds.value.split(',');

    const component = businessUnitvalues;
    const index = component.indexOf(0);
    if (index > -1) {
      component.splice(index, 1);
    }
    const businessUnitsList = this.allBusinessUnits;
    const selectedBusinessUnitsList = _.filter(businessUnitsList, function (role) {
      return component.toString().includes(role.businessUnitId);
    })
    const businessUnitsNames = selectedBusinessUnitsList.map((x) => x.businessUnitName);
    this.selectedBusinessUnits = businessUnitsNames.toString();
    this.loadList();
  }

  toggleAllBusinessUnitsSelected() {
    if (this.businessUnitsSelected.selected) {
      this.businessUnitIds.patchValue([
        0, ...this.allBusinessUnits.map(item => item.businessUnitId)
      ]);
    } else {
      this.businessUnitIds.setValue([]);
    }
    this.getSelectedBusinessUnits();
  }

  toggleBusinessUnitsPerOne() {
    if (this.businessUnitsSelected.selected) {
      this.businessUnitsSelected.deselect();
      return false;
    }
    if (this.businessUnitIds.value.length === this.allBusinessUnits.length) {
      this.businessUnitsSelected.select();
    }
    this.loadList();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}