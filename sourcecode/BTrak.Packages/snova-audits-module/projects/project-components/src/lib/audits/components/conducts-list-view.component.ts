import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChildren, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { SatPopover } from "@ncstate/sat-popover";
import { FormControl, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreeItemDropEvent, DropPosition, TreeItemLookup, DropAction } from '@progress/kendo-angular-treeview';
import { ToastrService } from 'ngx-toastr';

import * as auditModuleReducer from "../store/reducers/index";
import { AuditCompliance } from "../models/audit-compliance.model";
import * as _ from 'underscore';
// import { LoadAuditListTriggered, AuditActionTypes } from "../store/actions/audits.actions";
import { AuditConduct, CondutLinkEmailModel } from "../models/audit-conduct.model";
import { AuditConductActionTypes, LoadAuditConductByIdTriggered, LoadAuditConductListTriggered, LoadAuditConductTriggered } from "../store/actions/conducts.actions";
import { AuditCategory } from "../models/audit-category.model";
import { LoadAuditCategoryListTriggered } from "../store/actions/audit-categories.actions";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditService } from '../services/audits.service';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { HrBranchModel } from '../dependencies/models/hr-models/branch-model';
import { EmployeeListModel } from '../dependencies/models/employee-model';
import { EmployeeService } from '../dependencies/services/employee-service';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { SoftLabelPipe } from '../dependencies/pipes/softlabels.pipes';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { AuditActionTypes, LoadConductTagListTriggered, LoadConductTagTriggered } from '../store/actions/audits.actions';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';

import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: "conducts-list-view",
    templateUrl: "./conducts-list-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConductsListViewComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren("addAuditConductsPopover") addAuditConductPopover;
    @ViewChild("addConduct") addConductPopover: SatPopover;
    @ViewChild("addAuditConduct") addAuditConductsPopover: SatPopover;
    @ViewChild("conductDetails") conductDetailsPopover: SatPopover;
    @ViewChild("customFields") customFieldsPopover: SatPopover;
    @ViewChild("deleteConduct") deleteConductPopover: SatPopover;
    @ViewChild("reConduct") reConductPopover: SatPopover;
    @ViewChild("sendMail") sendMailPopover: SatPopover;
    @ViewChild("exportAuditConductConfirmation") exportAuditConductConfirmation: SatPopover;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("importPopover") importsPopover: SatPopover;
    @ViewChild("auditTagsPopover") auditTagPopover: SatPopover;
    @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild("businessUnitsSelected") private businessUnitsSelected: MatOption;
    @ViewChild("addComment") addCommentPopover: SatPopover;

    @Output() selectedConduct = new EventEmitter<any>();
    @Output() loadConductRelatedData = new EventEmitter<boolean>();

    anyOperationInProgress$: Observable<boolean>;
    deleteOperationInProgress$: Observable<boolean>;
    tagsOperationInProgress$: Observable<boolean>;
    tagOperationInProgress$: Observable<boolean>;
    activeAuditConductsCount$: Observable<number>;
    activeAuditFoldersCount$: Observable<number>;

    conductList$: Observable<AuditConduct[]>;
    auditList$: Observable<AuditCompliance[]>;
    customTagsModel$: Observable<AuditCompliance[]>;

    public ngDestroyed$ = new Subject();
    public selectedKeys: any[] = ['0'];
    public allParentNodes = [];
    public expandKeys = this.allParentNodes.slice();

    keyIndexes: any = [];

    projectId: string;

    selectedAudit: any;
    conductRequiredData: any;
    folderOrConductSelectedId: any;
    inBoundPercent: any;
    outBoundPercent: any;
    compliancePercent: any;
    tagNames: any;
    conductTagNames: any;
    index: any;
    acceptableFileFormat: string;
    tag: string;
    isCsvImport: boolean;
    disableExport: boolean = false;
    disableImport: boolean = false;
    importProgress: boolean = false;
    disableReconduct: boolean = false;
    isInValidQuestionsPresent: boolean = false;
    files: File[] = [];

    folderTreeModel = [];
    filteredFolderTreeModel = [];
    conductInputTags = [];

    customTagsModel: AuditCompliance[];

    isArchived: boolean = false;
    loadAddAuditConduct: boolean = false;
    categoryFilter: string = '1';
    searchText: string;
    searchTagsText: string;
    editingConductId: string;
    selectedConductId: string;
    loadParticularConduct: string;
    deletedConductId: string;
    conductOccurance: number = 0;
    softLabels: any;
    isNewConduct: any;
    parentConductId: any;
    contextMenuPosition = { x: '0', y: '0' };
    emptyMail: boolean = false;
    toMails: string;
    isOpen: boolean = true;
    validationMessage: string;
    periodDropDown: string[] = ["Current month", "Last month", "Last 3 months", "Last 6 months", "Last 12 months", "Select period"];
    statusDropDown: string[] = ["In progress", "Over due", "Completed"];
    userDropdown = [];
    branchDropdown: any;
    selectedPeriod: string;
    selectedUser: any;
    dateTofilter: boolean = false;
    dateFromfilter: boolean = false;
    isSearching: boolean = false;
    isRAG: boolean = false;
    isRed: boolean = false;
    isAmber: boolean = false;
    isGreen: boolean = false;
    noneAnswered: boolean = false;
    disableConductDelete: boolean = false;
    anyOperationInProgress: boolean = false;
    fromConductComponent: boolean = false;
    isConductDeleted: boolean = false;
    sendingMailInProgress: boolean = false;
    callSucceeded: boolean = false;
    canRefreshConduct: boolean = false;
    disableTag: boolean = false;
    removable: boolean = true;
    selectable: boolean = true;
    expandAll: boolean = true;
    componentModel: ComponentModel = new ComponentModel();
    dateToTimePicker: any;
    dateTo: Date;
    dateFrom: Date;
    fromDate: Date = new Date();
    minToDate: any;
    selectedStatus: string;
    selectedBranch: string;
    userList = [];
    selectedMember: string;
    status: any;
    pageY: number;
    activeAuditConductsCount: number;
    activeAuditFoldersCount: number;
    allBusinessUnits: BusinessUnitDropDownModel[] = [];
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    selectedBusinessUnits: any;
    searchStatusText: string;
    businessUnitIds = new FormControl(null,
        Validators.compose([
        ])
    );

    sample = [
        {
            auditId: '123',
            auditName: 'First',
            auditDescription: 'Sample',
            categoriesCount: 10,
            questionsCount: 5,
            createdByUserName: 'Srihari U',
            createdByUserProfileImage: null,
            createdDatetime: Date.now(),
            isArchived: false,
            timeStamp: '12324rdfgf'
        }
    ];
    isAnyOperationIsInprogress: boolean;

    constructor(private store: Store<State>, private employeeService: EmployeeService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef, private auditService: AuditService
        , private cookieService: CookieService, private snackbar: MatSnackBar, private translateService: TranslateService, private toastr: ToastrService, private softLabePipe: SoftLabelPipe) {
        super();

        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.activeAuditConductsCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditConductsCount));
        this.activeAuditConductsCount$.subscribe(x => {
            this.activeAuditConductsCount = x;
            this.cdRef.markForCheck();
        });

        this.activeAuditFoldersCount$ = this.store.pipe(select(auditModuleReducer.getActiveAuditFoldersCount));
        this.activeAuditFoldersCount$.subscribe(x => {
            this.activeAuditFoldersCount = x;
            this.cdRef.markForCheck();
        });

        this.initializeConductForm();
        this.loadConductFolderView();
        this.getAuditList();

        this.getSoftLabelConfigurations();

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getAuditConductsListLoading));
        this.deleteOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditConductLoading));
        this.tagsOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getConductTagListLoading));
        this.tagOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertConductTagLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditActionTypes.LoadConductTagCompleted),
                tap((result: any) => {
                    if (result && result.conductId) {
                        // this.closeTagsDialog();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductListTriggered),
                tap((result: any) => {
                    this.selectedConductId = null;
                    this.deletedConductId = null;
                    this.editingConductId = null;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductTriggered),
                tap((result: any) => {
                    if (result && result.auditConduct) {
                        let data = result.auditConduct;
                        this.isNewConduct = data.isNewConduct;
                        this.fromConductComponent = data.fromConductComponent;
                        this.isConductDeleted = data.isToBeDeleted;
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdTriggered),
                tap((result: any) => {
                    if (result && result.auditConduct) {
                        let data = result.auditConduct;
                        this.canRefreshConduct = data.canRefreshConduct ? true : false;
                        if (this.canRefreshConduct) {
                            this.fromConductComponent = false;
                            this.isNewConduct = false;
                        }
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchAuditConducts && result.searchAuditConducts.length > 0) {
                        let data = result.searchAuditConducts[0];
                        if (this.reConductPopover._open) {
                            this.closeReConductPopover();
                        }
                        if (this.fromConductComponent && this.isNewConduct) {
                            this.folderOrConductSelectedId = data.conductId;
                            this.cdRef.markForCheck();
                            this.toggleSearchData();
                            this.pushConductOrFolderIndexCategorydata(this.folderTreeModel, data.parentConductId, data, false);
                            this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
                            if (!this.isSearching) {
                                this.findIndexCategorydata(this.folderOrConductSelectedId);
                                this.selectedConduct.emit(data);
                            }
                            // setTimeout(function () {
                            //     let element = document.getElementById(data.conductId);
                            //     if (element) {
                            //         // element.scrollIntoView();
                            //         element.scrollIntoView({ behavior: 'smooth' });
                            //     }
                            // }, 500);
                        }
                        else if (this.canRefreshConduct) {
                            this.toggleSearchData();
                            this.findConductIndexCategorydata(this.folderTreeModel, data.conductId, data, false);
                            // this.folderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
                        }
                    }
                    this.closeTagsDialog();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductDelete),
                tap((result: any) => {
                    this.deleteConductPopover.close();
                    this.disableConductDelete = false;
                    if (result && result.conductId) {
                        if (this.fromConductComponent && this.isConductDeleted) {
                            this.toggleSearchData();
                            if (this.folderOrConductSelectedId && result.conductId == this.folderOrConductSelectedId) {
                                this.selectedKeys = ['0'];
                                this.folderOrConductSelectedId = this.folderTreeModel[0].conductId;
                                this.cdRef.markForCheck();
                                this.selectedConduct.emit('empty');
                            }
                            this.findConductIndexCategorydata(this.folderTreeModel, result.conductId, null, true);
                        }
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.AuditConductFailed),
                tap(() => {
                    this.disableConductDelete = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
        this.getConductUserDropdown();
        this.getBranchDropdown();
        this.getBusinessUnits();
    }

    getConductUserDropdown() {
        // this.auditService.getConductUserDropdown("audit").subscribe((result: any) => {
        //     this.userDropdown = result.data
        //     if (result.success == false) {
        //         this.validationMessage = result.apiResponseMessages[0].message;
        //     }
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

    getBranchDropdown() {
        let branch = new HrBranchModel();
        this.auditService.getBrachDropdown(branch).subscribe((result: any) => {
            this.branchDropdown = result.data
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
            }
        })
    }

    
getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
}

    loadConductList() {
        this.changeRelatedVariables();
        let auditConductModel = new AuditConduct();
        auditConductModel.isArchived = this.isArchived;
        auditConductModel.periodValue = this.selectedPeriod;
        auditConductModel.dateFrom = this.dateFrom;
        auditConductModel.dateTo = this.dateTo;
        auditConductModel.userId = this.selectedUser;
        auditConductModel.branchId = this.selectedBranch;
        auditConductModel.statusFilter = this.selectedStatus;
        auditConductModel.projectId = this.projectId;
        auditConductModel.businessUnitIds = this.businessUnitIds.value;
        this.store.dispatch(new LoadAuditConductListTriggered(auditConductModel));
        // this.conductList$ = this.store.pipe(select(auditModuleReducer.getAuditConductAll),
        //     tap(result => {
        //         if (result && result.length > 0) {
        //             let conductsList = result;
        //             this.conductOccurance = this.conductOccurance + 1;
        //             let conductCompleted = false;
        //             let index = 0;
        //             if (this.loadParticularConduct && this.conductOccurance <= 1 && conductsList.findIndex(x => x.conductId == this.loadParticularConduct) != -1) {
        //                 index = conductsList.findIndex(x => x.conductId == this.loadParticularConduct);
        //                 this.loadParticularConduct = null;
        //                 this.cdRef.markForCheck();
        //             }
        //             if (this.conductOccurance <= 1 || (this.selectedConductId == this.deletedConductId && result.length > 0) || (this.isArchived == false && conductCompleted)) {
        //                 this.selectedConductId = conductsList[index].conductId;
        //                 this.selectedConduct.emit(conductsList[index]);
        //             }
        //             if (this.conductOccurance <= 1 && result.length > 0) {
        //                 this.loadConductRelatedData.emit(true);
        //             }
        //         }
        //         else if (result.length == 0) {
        //             this.conductOccurance = 0;
        //             this.selectedConductId = null;
        //             this.deletedConductId = null;
        //             this.loadConductRelatedData.emit(false);
        //             this.cdRef.detectChanges();
        //         }
        //     }));
    }

    loadConductFolderView() {
        this.anyOperationInProgress = true;
        this.expandKeys = [];
        let treeModel = new AuditConduct();
        treeModel.isArchived = this.isArchived;
        treeModel.periodValue = this.selectedPeriod;
        treeModel.dateFrom = this.dateFrom;
        treeModel.dateTo = this.dateTo;
        treeModel.userId = this.selectedUser;
        treeModel.branchId = this.selectedBranch;
        treeModel.statusFilter = this.selectedStatus;
        treeModel.projectId = this.projectId;
        treeModel.businessUnitIds = this.businessUnitIds.value;
        this.auditService.getConductsFolderView(treeModel).subscribe((response: any) => {
            if (response.success) {
                let folderStructure = response.data;
                this.folderTreeModel = folderStructure ? JSON.parse(folderStructure) : [];
                this.filteredFolderTreeModel = JSON.parse(JSON.stringify(this.folderTreeModel));
                if (this.folderTreeModel.length > 0) {
                    var isFromRedirect = false;
                    var redirectedId = null;
                    // let conductId = this.auditService.redirectedConductId;
                    let conductId = localStorage.getItem('ConductedAudit');
                    if (conductId) {
                        let firstConduct = this.checkFirstConduct(this.folderTreeModel, true, conductId);
                        if (firstConduct) {
                            this.folderOrConductSelectedId = firstConduct.conductId;
                            this.findIndexCategorydata(this.folderOrConductSelectedId);
                            isFromRedirect = true;
                            redirectedId = firstConduct.conductId;
                            // localStorage.removeItem('ConductedAudit');
                            // this.auditService.redirectedConductId = null;
                            this.selectedConduct.emit(firstConduct);
                        }
                        else {
                            this.folderOrConductSelectedId = this.folderTreeModel[0].conductId;
                            this.selectedKeys = ['0'];
                            this.selectedConduct.emit('empty');
                        }
                    }
                    else if (!isFromRedirect) {
                        let firstConduct = this.checkFirstConduct(this.folderTreeModel, false, null);
                        if (firstConduct) {
                            this.folderOrConductSelectedId = firstConduct.conductId;
                            this.findIndexCategorydata(this.folderOrConductSelectedId);
                            this.selectedConduct.emit(firstConduct);
                        }
                    }
                    else {
                        this.folderOrConductSelectedId = this.folderTreeModel[0].conductId;
                        this.selectedKeys = ['0'];
                        this.selectedConduct.emit('empty');
                    }
                }
                else {
                    this.folderOrConductSelectedId = null;
                    this.selectedKeys = [];
                    this.selectedConduct.emit('empty');
                }
                this.getParentTextProperties(this.folderTreeModel);
                this.getAllTextProperties(this.folderTreeModel);
                this.anyOperationInProgress = false;
                this.callSucceeded = true;
                this.cdRef.markForCheck();
                // setTimeout(function () {
                //     let element = document.getElementById(redirectedId);
                //     if (element && isFromRedirect) {
                //         // element.scrollIntoView();
                //         element.scrollIntoView({ behavior: 'smooth' });
                //     }
                // }, 1000);
            }
            else {
                this.anyOperationInProgress = false;
                this.folderTreeModel = [];
                this.selectedKeys = [];
                this.selectedConduct.emit('empty');
                let validationmessage = response.apiResponseMessages[0].message;
                this.toastr.error(validationmessage);
                this.callSucceeded = true;
                this.cdRef.markForCheck();
            }
        }, (error) => {
            this.anyOperationInProgress = false;
            this.callSucceeded = true;
            this.folderTreeModel = [];
            this.selectedConduct.emit('empty');
            // Need to remove later
            this.getParentTextProperties(this.folderTreeModel);
            this.getAllTextProperties(this.folderTreeModel);
            // Need to remove later
            this.cdRef.markForCheck();
        })
    }

    getAuditList() {
        this.auditList$ = this.store.pipe(select(auditModuleReducer.getAuditAll));
    }

    getEditedConductData(value) {
        this.editingConductId = value.conductId;
        if (this.selectedConductId == value.conductId) {
            let categoriesList = new AuditCategory();
            categoriesList.auditId = value.auditId;
            categoriesList.conductId = value.conductId;
            categoriesList.isCategoriesRequired = value.isCategoriesRequired;
            categoriesList.includeConductQuestions = false;
            this.store.dispatch(new LoadAuditCategoryListTriggered(categoriesList));
        }
        this.cdRef.markForCheck();
    }

    changeRelatedVariables() {
        this.conductOccurance = 0;
        this.selectedConductId = null;
        this.deletedConductId = null;
        this.cdRef.markForCheck();
    }

    handleClickOnConductItem(conduct) {
        this.selectedConductId = conduct.conductId;
        this.selectedConduct.emit(conduct);
    }

    getDeletedConductId(data) {
        this.deletedConductId = data;
    }

    closeSearch() {
        this.toggleSearchData();
    }

    closeTagsSearch() {
        this.toggleSearchData();
    }

    closeStatusSearch() {
        if (this.isSearching) {
          if(!this.searchTagsText) {
            this.isSearching = false;
          }
          this.searchText = null;
          this.searchStatusText = null;
          this.findIndexCategorydata(this.folderOrConductSelectedId);
          this.cdRef.detectChanges();
        }
      }

    openAuditConductDialog(addAuditConductPopover, conductData) {
        if (conductData) {
            this.parentConductId = conductData.conductId;
            this.cdRef.markForCheck();
        }
        else {
            this.parentConductId = null;
            this.cdRef.markForCheck();
        }
        this.initializeConductForm();
        addAuditConductPopover.openPopover();
    }

    addConducts() {
        this.closeNewConductDialog();
        this.loadAddAuditConduct = true;
        this.addAuditConductsPopover.open();
        // (document.querySelector('.card-filter-runs') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
    }

    closeNewConductDialog() {
        this.addAuditConductPopover.forEach(p => p.closePopover());
    }

    closeAuditConductDialog() {
        this.loadAddAuditConduct = false;
        this.addAuditConductsPopover.close();
    }

    checkStatusDisabled() {
        if (this.selectedAudit.value || this.selectedMember)
            return false;
        else
            return true;
    }

    initializeConductForm() {
        this.selectedAudit = new FormControl('', [Validators.required]);
    }

    openTimelineView() {
        // this.routes.navigate(["audits/auditsview/2"]);
        this.routes.navigateByUrl('projects/projectstatus/' + this.projectId + '/timeline');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    statusValues(value) {
        this.selectedUser = value;
        this.loadList();
    }

    periodValue(value) {
        if (value == "Select period") {
            this.dateFromfilter = true;
        }
        else {
            this.selectedPeriod = value;
            this.dateTo = null;
            this.dateFrom = null;
            this.dateFromfilter = false;
            this.dateTofilter = false;
            this.loadList();
        }

    }

    statusValue(value) {
        this.selectedStatus = value;
        this.loadList();
    }

    branchValue(value) {
        this.selectedBranch = value;
        this.loadList();
    }

    loadList() {
        // this.loadConductList();
        localStorage.removeItem('ConductedAudit');
        this.loadConductFolderView();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateFrom = event.target.value;
        this.minToDate = this.dateFrom;
        this.dateTofilter = true;
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.dateTo = event.target.value;
        this.loadList();
    }

    goToUserProfile(userId) { }

    resetFilters() {
        this.selectedUser = null;
        this.selectedPeriod = null;
        this.selectedStatus = null;
        this.selectedBranch = null;
        this.dateTo = null;
        this.dateFrom = null;
        this.dateFromfilter = false;
        this.dateTofilter = false;
        this.searchTagsText = null;
        this.loadList();
    }

    conductDetailsOpen(auditData) {
        this.conductRequiredData = auditData;
        this.tagsvalue(this.conductRequiredData);
        this.checkCompliancePercent(this.conductRequiredData);
        this.conductDetailsPopover.open();
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
        var conductTags = data.conductTagsModels;
        let conductTagValue = [];
        if (conductTags && conductTags.length > 0) {
            conductTags.forEach(element => {
                conductTagValue.push(element.tagName)
            });
            this.conductTagNames = conductTagValue.toString();
            this.cdRef.markForCheck();
        }
        else {
            this.conductTagNames = null;
            this.cdRef.markForCheck();
        }
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
            if (percent <= data.inBoundPercent) {
                this.isRed = true;
                this.isAmber = false;
                this.isGreen = false;
                this.cdRef.markForCheck();
            }
            else if (percent > data.inBoundPercent && percent < data.outBoundPercent) {
                this.isRed = false;
                this.isAmber = true;
                this.isGreen = false;
                this.cdRef.markForCheck();
            }
            else if (percent >= data.outBoundPercent) {
                this.isRed = false;
                this.isAmber = false;
                this.isGreen = true;
                this.cdRef.markForCheck();
            }
        }
    }

    closeConductDetailsPopover() {
        this.conductRequiredData = null;
        this.conductDetailsPopover.close();
        this.trigger.closeMenu();
        this.cdRef.markForCheck();
    }

    openDeletePopover(data, value) {
        this.conductRequiredData = data;
        this.deleteConductPopover.open();
        this.cdRef.markForCheck();
    }

    deleteSelectedConduct(value) {
        this.disableConductDelete = true;
        let conduct = new AuditConduct();
        conduct = Object.assign({}, this.conductRequiredData);
        conduct.isArchived = value;
        if (conduct.isArchived == false)
            conduct.auditConductUnarchive = true;
        else
            conduct.auditConductUnarchive = false;
        conduct.isToBeDeleted = true;
        conduct.fromConductComponent = true;
        conduct.projectId = this.projectId;
        this.store.dispatch(new LoadAuditConductTriggered(conduct));
    }

    closeDeletePopover() {
        this.conductRequiredData = null;
        this.deleteConductPopover.close();
        this.trigger.closeMenu();
        this.cdRef.markForCheck();
    }

    openReconductPopover(data) {
        this.conductRequiredData = data;
        this.disableReconduct = false;
        this.reConductPopover.open();
        this.cdRef.markForCheck();
    }

    reConductAudit() {
        this.disableReconduct = true;
        let conductModel = new AuditConduct();
        conductModel = Object.assign({}, this.conductRequiredData);
        this.auditService.reConductAudit(conductModel).subscribe((result: any) => {
            if (result.success) {
                this.isNewConduct = true;
                this.fromConductComponent = true;
                this.cdRef.markForCheck();
                let searchAudit = new AuditConduct();
                searchAudit.conductId = result.data;
                searchAudit.projectId = this.projectId;
                this.store.dispatch(new LoadAuditConductByIdTriggered(searchAudit));
                this.cdRef.markForCheck();
            }
            else {
                this.disableReconduct = false;
                let validationmessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationmessage);
                this.cdRef.markForCheck();
            }
        });
    }

    closeReConductPopover() {
        this.conductRequiredData = null;
        this.disableReconduct = false;
        this.reConductPopover.close();
        this.trigger.closeMenu();
        this.cdRef.markForCheck();
    }

    copyLink(conductData) {
        const angularRoute = this.routes.url;
        const url = window.location.href;
        let uniqueNumberUrl = url.replace(angularRoute, "");
        // uniqueNumberUrl = uniqueNumberUrl + "/audits/" + conductData.conductId + "/conduct";
        uniqueNumberUrl = uniqueNumberUrl + "/projects/conduct/" + conductData.conductId;
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

    openInNewTab(conductData) {
        const angularRoute = this.routes.url;
        const url = window.location.href;
        let uniqueNumberUrl = url.replace(angularRoute, "");
        // uniqueNumberUrl = uniqueNumberUrl + "/audits/" + conductData.conductId + "/conduct";
        uniqueNumberUrl = uniqueNumberUrl + "/projects/conduct/" + conductData.conductId;
        window.open(uniqueNumberUrl, "_blank");
        // this.routes.navigate(["audits/" + this.conductData.conductId + "/conduct"]);
    }

    openMail(conductData) {
        this.conductRequiredData = conductData;
        var conductAssignee = this.conductRequiredData.conductAssigneeMail;
        var auditResponsibleUser = this.conductRequiredData.auditResponsibleUserMail;
        if (!conductAssignee && !auditResponsibleUser) return;
        else if (conductAssignee == auditResponsibleUser) this.toMails = conductAssignee;
        else this.toMails = conductAssignee + '\n' + auditResponsibleUser;
        this.sendMailPopover.open();
        this.cdRef.markForCheck();
    }


    sendLinkToMails(popover) {
        if (this.toMails && this.toMails.trim() != '') {
            this.sendingMailInProgress = true;
            this.emptyMail = false;
            let model = new CondutLinkEmailModel();
            model.toMails = (this.toMails && this.toMails.trim() != '') ? this.toMails.trim() : null;
            model.conductId = this.conductRequiredData.conductId;
            model.conductName = this.conductRequiredData.auditConductName
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

    closeMail() {
        this.conductRequiredData = null;
        this.toMails = null;
        this.emptyMail = false;
        if (this.sendMailPopover._open)
            this.sendMailPopover.close();
        if (this.exportAuditConductConfirmation._open)
            this.exportAuditConductConfirmation.close();
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
        this.expandKeys = [this.folderTreeModel[0].conductId];
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
        this.folderOrConductSelectedId = data.conductId;
        this.cdRef.markForCheck();
        if (data && data.isConduct) {
            this.selectedConduct.emit(data);
        }
        else {
            this.selectedConduct.emit('empty');
        }
    }

    public isItemSelected = (_: any, index: string) => this.selectedKeys.indexOf(index) > -1;

    iconClass({ isConduct }: any): any {
        return {
            'k-i-folder': (isConduct == false),
            'k-i-clipboard-text': (isConduct == true),
            'k-icon': true,
            'mt-02': true
        };
    }

    public log(event: string, args?: any): void {
        console.log(event, args);
    }

    openFolderMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
        // if (this.istoShowEditandDeleteIcons(dataItem)) {
        event.preventDefault();
        viewChild.openMenu();
        // }
    }

    openConductMenu(event: MouseEvent, viewChild: MatMenuTrigger, dataItem: any) {
        // if (this.istoShowEditandDeleteIcons(dataItem)) {
        event.preventDefault();
        if (dataItem) {
            let answCount = dataItem.answeredCount;
            let validCount = dataItem.validAnswersCount;
            let inValidCount = answCount - validCount;
            if (dataItem.status) {
                this.loadStatus(dataItem);
            }
            if (inValidCount > 0) {
                this.isInValidQuestionsPresent = true;
                this.cdRef.markForCheck();
            }
            else {
                this.isInValidQuestionsPresent = false;
                this.cdRef.markForCheck();
            }
        }
        this.pageY = event.pageY;
        this.cdRef.markForCheck();
        viewChild.openMenu();
        // }
    }

    loadStatus(dataItem) {
        if (dataItem.status == ConstantVariables.Draft) {
            this.status = this.translateService.instant(ConstantVariables.DraftStatus);
        } else if (dataItem.status == ConstantVariables.Submitted) {
            this.status = this.translateService.instant(ConstantVariables.SubmittedStatus);
        } else if (dataItem.status == ConstantVariables.SendFroApproved) {
            this.status = this.translateService.instant(ConstantVariables.SendForApprovalStatus);
        } else if (dataItem.status == ConstantVariables.Approved) {
            this.status = this.translateService.instant(ConstantVariables.ApprovedStatus);
        } else if (dataItem.status) {
            this.status = dataItem.status;
        }
        this.cdRef.detectChanges();
    }

    getAllTextProperties(items: Array<any>) {
        items.forEach(i => {
            if (i.children) {
                this.allParentNodes.push(i.conductId);
                this.getAllTextProperties(i.children);
            }
        })
        this.expand();
    }

    getParentTextProperties(items: Array<any>) {
        let parentLevels = [];
        items.forEach(element => {
            parentLevels.push(element.conductId);
        });
        if (this.expandKeys && this.expandKeys.length > 0) { } else {
            this.expandKeys = parentLevels;
        }
    }

    findConductIndexCategorydata(nodeDetails, conductId, fileDetails, isDeletion) {
        if (nodeDetails) {
            for (let i = 0; i < nodeDetails.length; i++) {
                if (nodeDetails[i].isConduct && nodeDetails[i].conductId == conductId) {
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
                    let checkSubSections = this.recursiveFindConductIndexSectiondata(nodeDetails[i].children, conductId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    recursiveFindConductIndexSectiondata(childList, conductId, fileDetails, isDeletion) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].isConduct && childList[i].conductId == conductId) {
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
                    let checkSubSections = this.recursiveFindConductIndexSectiondata(childList[i].children, conductId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    pushConductOrFolderIndexCategorydata(nodeDetails, parentConductId, fileDetails, isDeletion) {
        if (nodeDetails) {
            for (let i = 0; i < nodeDetails.length; i++) {
                if (nodeDetails[i].conductId == parentConductId) {
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
                    let checkSubSections = this.recursivePushConductOrFolderIndexSectiondata(nodeDetails[i].children, parentConductId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    recursivePushConductOrFolderIndexSectiondata(childList, parentConductId, fileDetails, isDeletion) {
        if (childList) {
            for (let i = 0; i < childList.length; i++) {
                if (childList[i].conductId == parentConductId) {
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
                    let checkSubSections = this.recursivePushConductOrFolderIndexSectiondata(childList[i].children, parentConductId, fileDetails, isDeletion);
                    if (checkSubSections != undefined && checkSubSections != undefined)
                        return checkSubSections;
                }
            }
        }
    }

    findIndexCategorydata(folderId) {
        if (this.folderTreeModel) {
            for (let i = 0; i < this.folderTreeModel.length; i++) {
                if (this.folderTreeModel[i].conductId == folderId.toLowerCase()) {
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
                if (childList[j].conductId == folderId.toString().toLowerCase()) {
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
                if (childList[j].conductId == folderId.toString().toLowerCase()) {
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
                if (childList[j].conductId == folderId.toString().toLowerCase()) {
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

    selecteNodeDetils(nodeDetails) { }

    checkSearchText(event, text) {
        if (event.keyCode == 13) {
            this.searchText = (text != null) ? text.trim() : null;
            if (this.searchText) {
                this.isSearching = true;
            }
            else {
                this.isSearching = false;
                // this.findIndexCategorydata(this.folderOrAuditSelectedId);
            }
            this.filteredFolderTreeModel = [];
            this.folderTreeModel.forEach((element, i) => {
                if (this.folderTreeModel[i].auditConductName.toLowerCase().includes(this.searchText.toLowerCase())) {
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
            if (children[j].auditConductName.toLowerCase().includes(this.searchText.toLowerCase())) {
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
              if (e.isConduct &&  e.status && e.status.toLowerCase().indexOf(this.searchStatusText.toLowerCase().trim()) != -1) {
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
          if(this.filteredFolderTreeModel[0].children.length < 1) {
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
          if (e.isConduct &&  e.status && e.status.toLowerCase().indexOf(this.searchStatusText.toLowerCase().trim()) != -1) {
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
                let conductTagsModel = this.folderTreeModel[i].conductTagsModels;
                if (!tagsMatched && conductTagsModel && conductTagsModel.length > 0) {
                    for (let j = 0; j < conductTagsModel.length; j++) {
                        if (conductTagsModel[j].tagName.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
                            this.filteredFolderTreeModel.push(Object.assign({}, this.folderTreeModel[i]));
                            tagsMatched = true;
                            break;
                        }
                    }
                }
                let rating = this.folderTreeModel[i].auditRatingName;
                if (!tagsMatched && rating) {
                    if (rating.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
                        this.filteredFolderTreeModel.push(Object.assign({}, this.folderTreeModel[i]));
                        tagsMatched = true;
                    }
                }
                if (!tagsMatched && this.folderTreeModel[i].children && this.folderTreeModel[i].children.length > 0) {
                    let childSections = this.checkTagsSubSectionsList(this.folderTreeModel[i].children);
                    if (childSections.length > 0) {
                        let parentSection = Object.assign({}, this.folderTreeModel[i]);
                        parentSection.children = childSections;
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
            let conductTagsModel = children[j].conductTagsModels;
            if (!tagsMatched && conductTagsModel && conductTagsModel.length > 0) {
                for (let l = 0; l < conductTagsModel.length; l++) {
                    if (conductTagsModel[l].tagName.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
                        subSectionsList.push(Object.assign({}, children[j]));
                        tagsMatched = true;
                        break;
                    }
                }
            }
            let rating = children[j].auditRatingName;
            if (!tagsMatched && rating) {
                if (rating.toLowerCase().indexOf(this.searchTagsText.toLowerCase().trim()) != -1) {
                    subSectionsList.push(Object.assign({}, children[j]));
                    tagsMatched = true;
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

    checkFirstConduct(foldersList, isRedirectedCounduct, redirectedCounductId) {
        for (let i = 0; i < foldersList.length; i++) {
            if (foldersList[i].isConduct && !isRedirectedCounduct) {
                return foldersList[i];
            }
            else if (foldersList[i].isConduct && foldersList[i].conductId == redirectedCounductId && isRedirectedCounduct) {
                return foldersList[i];
            }
            else if (foldersList[i].children && foldersList[i].children.length > 0) {
                let conduct = this.recursiveCheckFirstConduct(foldersList[i].children, isRedirectedCounduct, redirectedCounductId);
                if (conduct && conduct != undefined)
                    return conduct;
            }
        }
    }

    recursiveCheckFirstConduct(childList, isRedirectedCounduct, redirectedCounductId) {
        for (let i = 0; i < childList.length; i++) {
            if (childList[i].isConduct && !isRedirectedCounduct) {
                return childList[i];
            }
            else if (childList[i].isConduct && childList[i].conductId == redirectedCounductId && isRedirectedCounduct) {
                return childList[i];
            }
            else if (childList[i].children && childList[i].children.length > 0) {
                let conduct = this.recursiveCheckFirstConduct(childList[i].children, isRedirectedCounduct, redirectedCounductId);
                if (conduct && conduct != undefined)
                    return conduct;
            }
        }
    }

    toggleSearchData() {
        if (this.isSearching) {
            if(!this.searchStatusText) {
                this.isSearching = false;
              }
            this.searchText = null;
            this.searchTagsText = null;
            this.findIndexCategorydata(this.folderOrConductSelectedId);
            this.cdRef.detectChanges();
        }
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        this.disableImport = true;
        this.cdRef.markForCheck();
    }

    openExportConduct(conductData) {
        this.conductRequiredData = conductData;
        this.exportAuditConductConfirmation.open();
    }

    exportAuditConduct(popover) {
        if (this.toMails && this.toMails.trim() != '') {
            this.sendingMailInProgress = true;
            this.emptyMail = false;
            var mails = this.toMails.split('\n');
            const regexp = new RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
            //var isValid = this.toMails.match(regexp);
            var isValid: string[] = mails.filter(i => !i.match(regexp));
            if (isValid.length > 0) {
                this.toastr.error("You have entered an invalid email address!");
                this.disableExport = false;
                return;
            }
            let model = new CondutLinkEmailModel();
            model.toMails = (this.toMails && this.toMails.trim() != '') ? this.toMails.trim() : null;
            model.conductId = this.conductRequiredData.conductId;
            model.auditId = this.conductRequiredData.auditId;
            model.conductName = this.conductRequiredData.auditConductName
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
                    this.closeMail();
                });
            //}
            // else {
            //     this.toastr.error("You have entered an invalid email address!");
            //     this.disableExport = false;
            // }
        } else {
            this.emptyMail = true;
            this.cdRef.markForCheck();
        }
    }

    openImportPopover(isCsvImport) {
        this.isCsvImport = isCsvImport;
        this.acceptableFileFormat = this.isCsvImport ? 'text/csv' : 'text/xml';
        this.disableImport = true;
        this.cdRef.markForCheck();
        this.importsPopover.open();
    }

    downloadConductsCsvTemplate() {
        this.auditService.downloadConductsCsvTemplate().subscribe((response: any) => {
            var blob = new Blob([response], { type: "text/csv" });
            FileSaver.saveAs(blob, "SampleAuditConductImport.csv");
            this.closeMenuPopover();
        }, function (error) {
            this.toastrService.error("Template download failed.");
        });
    }

    closeMenuPopover() {
        this.threeDotsPopOver.close();
    }

    filesSelected(event) {
        this.files = this.isCsvImport ? event.rejectedFiles : event.addedFiles;
        if (this.files && this.files.length > 0) {
            this.disableImport = false;
            this.cdRef.detectChanges();
        }
    }

    closeImportPopover() {
        this.importsPopover.close();
        this.files = [];
        this.disableImport = false;
        this.cdRef.markForCheck();
    }

    importConduct() {
        this.disableImport = true;
        this.importProgress = true;
        if (this.files.length > 0) {
            const formData = new FormData();
            formData.append("file", this.files[0]);
            if (this.isCsvImport) {
                this.auditService.ImportConductFromCsv(formData, this.projectId).subscribe((result: any) => {
                    if (result.success) {
                        this.disableImport = false;
                        this.importProgress = false;
                        this.files = [];
                        this.toastr.info("", this.softLabePipe.transform(this.translateService.instant('AUDIT.IMPORTCOMPLEDCONFIRMATIONFORCONDUCT'), this.softLabels));
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
        }
    }

    openTagsPopUp(conductData) {
        this.conductRequiredData = conductData;
        if (this.conductRequiredData.conductTagsModels && this.conductRequiredData.conductTagsModels.length > 0) {
            this.conductRequiredData.conductTagsModels.forEach(x => {
                this.conductInputTags.push(x);
            });
            this.cdRef.markForCheck();
        }
        this.auditTagPopover.open();
    }

    searchTags(tags) {
        let tagsModel = new AuditCompliance();
        tagsModel.searchText = (tags && tags.trim() != '') ? tags.trim() : null;
        let selIds = [];
        if (this.conductInputTags) {
            this.conductInputTags.forEach(x => {
                selIds.push(x.tagId);
            });
        }
        tagsModel.selectedIds = selIds.length > 0 ? selIds.toString() : null;
        this.store.dispatch(new LoadConductTagListTriggered(tagsModel));
        this.customTagsModel$ = this.store.pipe(select(auditModuleReducer.getConductTagList));
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
            this.conductInputTags.push(data);
            this.tagInput.nativeElement.value = '';
            this.cdRef.markForCheck();
        }
    }

    saveAuditTags() {
        this.disableTag = true;
        let tagsModel = new AuditCompliance();
        tagsModel.auditId = this.conductRequiredData.auditId;
        tagsModel.conductId = this.conductRequiredData.conductId;
        tagsModel.auditTagsModels = this.conductInputTags;
        tagsModel.projectId = this.projectId;
        this.store.dispatch(new LoadConductTagTriggered(tagsModel));
    }

    checkDisableTag() {
        if (this.conductInputTags.length > 0)
            return false;
        else
            return true;
    }

    removeAuditTags(tag) {
        let index = this.conductInputTags.findIndex(x => x.tagId.toLowerCase() == tag.tagId.toLowerCase());
        if (index != -1) {
            this.conductInputTags.splice(index, 1);
            this.cdRef.markForCheck();
        }
    }

    closeTagsDialog() {
        this.disableTag = false;
        this.conductInputTags = [];
        this.customTagsModel = [];
        this.tagInput.nativeElement.value = '';
        if (this.auditTagPopover._open)
            this.auditTagPopover.close();
        this.trigger.closeMenu();
        this.tag = null;
        this.conductRequiredData = null;
        this.cdRef.markForCheck();
    }

    openCustomFields(conductData) {
        this.conductRequiredData = conductData;
        this.cdRef.markForCheck();
        this.customFieldsPopover.open();
    }

    
  openAddComment(conductData) {
    this.conductRequiredData = conductData;
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
        this.conductRequiredData = null;
        this.cdRef.markForCheck();
    }

    closeAddCommentPopover() {
        let popover = this.addCommentPopover;
        if (popover._open)
          popover.close();
        this.conductRequiredData = null;
        this.cdRef.markForCheck();
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
}