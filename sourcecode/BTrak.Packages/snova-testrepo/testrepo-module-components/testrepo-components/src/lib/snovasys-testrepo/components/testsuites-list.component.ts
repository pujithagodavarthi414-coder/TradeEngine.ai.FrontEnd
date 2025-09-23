import { Component, ChangeDetectionStrategy, EventEmitter, Output, ChangeDetectorRef, OnInit, ViewChild, Input, ViewChildren } from '@angular/core';
import { Observable, Subject, Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { SatPopover } from '@ncstate/sat-popover';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";

import { TestSuiteList, TestSuiteExportModel } from "../models/testsuite";

import { LoadTestSuiteListTriggered, TestSuiteActionTypes } from "../store/actions/testsuiteslist.action";

import { TestRailService } from '../services/testrail.service';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { ConstantVariables } from '../constants/constant-variables';
import { createStubProjectList } from '../models/projectlist';
import { LoadProjectsTriggered } from '../store/actions/testrailprojects.actions';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'testsuites-list',
  templateUrl: './testsuites-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .custom-scenario-import {
        height: 85px;
        border-radius: 5px;
        font-size: 16px;
      }

      .custom-scenario-import .custom-dropzone-preview {
        height: 60px !important;
        min-height: 60px !important;
        min-width: 120px !important;
        max-width: 120px !important;
        padding: 0px !important;
        margin: 5px !important;
        font-size: 10px;
      }
    `
  ]
})

export class TestSuitesListComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @ViewChildren("addTestSuitePopover") addTestSuitePopovers;
  @ViewChild("exportPopover") exportsPopover: SatPopover;
  @ViewChild("importPopover") importsPopover: SatPopover;
  @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;

  @Output() testSuiteId = new EventEmitter<string>();
  @Output() testSuiteDescription = new EventEmitter<any>();
  @Output() testSuiteDeleted = new EventEmitter<boolean>();

  @Input("fromCustomApp")
  set _fromCustomApp(fromCustomApp) {
    this.fromCustomApp = fromCustomApp;
  }
  @Input("testSuiteIdApp")
  set _testSuiteIdApp(testSuiteIdApp) {
    this.testSuiteIdApp = testSuiteIdApp;
  }

  testSuiteIdApp: string;
  validationMessage: string;
  acceptableFileFormat: string;
  fromCustomApp: boolean = false;
  isCsvImport: boolean;
  testsuitesList$: Observable<TestSuiteList[]>;
  anyOperationInProgress$: Observable<boolean>;
  testSuitesCount$: Observable<number>;
  projectName$: Observable<string>;
  projectResponsiblePersonName$: Observable<string>;
  searchTextChanged = new Subject<any>();

  public ngDestroyed$ = new Subject();

  files: File[] = [];

  loadingCompleted: boolean = false;
  isArchived: boolean = false;
  selectedTestSuiteId: string = null;
  projectId: string;
  updatedId: string;
  updatedDescripion: string;
  updatedSuiteName: string;
  projectName: string;
  projectResponsiblePersonName: string;
  testSuiteName: string;
  toMails: string;
  deletedId: string = null;
  testSuiteOccurance: number = 0;
  searchText: string = '';
  dateFrom: string;
  dateTo: string;
  maxDate = new Date();
  disableExport: boolean = false;
  disableImport: boolean = false;
  importProgress: boolean = false;
  emptyMail: boolean = false;
  loadAddTestSuite: boolean = false;
  sub: Subscription;
  subscription: Subscription;
  testsuite: TestSuiteList;
  filteredTestSuitesList: TestSuiteList[];
  testSuitesList: TestSuiteList[];
  softLabels: SoftLabelConfigurationModel[];

  constructor(private store: Store<State>, private route: ActivatedRoute, private toasterService: ToastrService, private actionUpdates$: Actions, private testRailService: TestRailService, private cookieService: CookieService, private translateService: TranslateService, private softLabePipe: SoftLabelPipe, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.LoadTestSuiteDeleteCompleted),
        tap(() => {
          this.getTestSuitesList();
        })
      ).subscribe();

      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.MoveTestSuiteCompleted),
        tap(() => {
          this.getTestSuitesList();
        })
      ).subscribe();


    this.anyOperationInProgress$ = this.store.pipe(
      select(testSuiteModuleReducer.getTestSuitesListLoading)
    );

    var projectSearchResult = createStubProjectList();
    this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
    this.testSuitesCount$ = this.store.pipe(select(testSuiteModuleReducer.getTestSuitesCount));
    this.projectName$ = this.store.pipe(select(testSuiteModuleReducer.getProjectName));
    this.projectName$.subscribe((x) => {
      this.projectName = x;
      this.cdRef.markForCheck();
    });
    this.projectResponsiblePersonName$ = this.store.pipe(select(testSuiteModuleReducer.getProjectResponsiblePersonName));
    this.projectResponsiblePersonName$.subscribe((x) => {
      this.projectResponsiblePersonName = x;
      this.cdRef.markForCheck();
    });

    this.subscription = this.searchTextChanged
    .pipe(debounceTime(800),
          distinctUntilChanged()
     )
    .subscribe(term => {
      this.toMails = term;
      this.checkValidationForEmail();
    })
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.fromCustomApp) {
      this.route.params.subscribe(routeParams => {
        this.projectId = routeParams.id;
      });
    }
    this.getSoftLabels();
    this.loadTestSuitesList();
    this.getTestSuitesList();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  loadTestSuitesList() {
    this.testsuite = new TestSuiteList();
    this.testsuite.isArchived = false;
    if (this.fromCustomApp) {
      this.testsuite.testSuiteId = this.testSuiteIdApp;
    }
    this.testsuite.projectId = this.projectId;
    this.store.dispatch(new LoadTestSuiteListTriggered(this.testsuite));
  }

  getTestSuitesList() {
    this.testsuitesList$ = this.store.pipe(select(testSuiteModuleReducer.getTestSuiteAll),
      tap(suites => {
        if (suites && suites.length > 0) {
          this.testSuitesList = suites;
          this.filteredTestSuitesList = suites;
          this.testSuiteOccurance = this.testSuiteOccurance + 1;
          if (this.testSuiteOccurance <= 1 || this.selectedTestSuiteId == this.deletedId) {
            this.selectedTestSuiteId = suites[0].testSuiteId;
            this.testSuiteId.emit(this.selectedTestSuiteId);
            let suiteData = {
              testSuiteName: suites[0].testSuiteName,
              description: suites[0].description
            }
            this.testSuiteDescription.emit(suiteData);
          }
          if (this.selectedTestSuiteId == this.deletedId) {
            this.testSuiteDeleted.emit(true);
          }
        }
        else if (suites.length == 0) {
          this.testSuitesList = [];
          this.filteredTestSuitesList = [];
          this.selectedTestSuiteId = null;
          this.testSuiteDeleted.emit(false);
        }
      }));
  }

  handleClickOnTestSuiteItem(testSuite) {
    this.selectedTestSuiteId = testSuite.testSuiteId;
    this.testSuiteId.emit(this.selectedTestSuiteId);
    let suiteData = {
      testSuiteName: testSuite.testSuiteName,
      description: testSuite.description
    }
    this.testSuiteDescription.emit(suiteData);
  }

  getUpdatedDescription(value) {
    this.updatedDescripion = value.description;
    this.updatedSuiteName = value.testSuiteName;
    this.cdRef.markForCheck();
  }

  getUpdatedId(value) {
    if (this.selectedTestSuiteId == value) {
      let suiteData = {
        testSuiteName: this.updatedSuiteName,
        description: this.updatedDescripion
      }
      this.testSuiteDescription.emit(suiteData);
    }
  }

  getDeletedId(value) {
    this.deletedId = value;
    this.testSuiteDeleted.emit(false);
  }

  closeSearch() {
    this.searchText = '';
  }

  closeDateFilter() {
    this.dateFrom = '';
    this.dateTo = '';
  }

  changeDeadline(from, to) {
    if (from > to)
      this.dateTo = '';
  }

  filterTestSuite() {
    if (this.testSuitesList.length > 0) {
      this.filteredTestSuitesList = [];
      this.testSuitesList.forEach(x => {
        if (x.testSuiteName.toLowerCase().indexOf(this.searchText.toLowerCase().trim()) != -1)
          this.filteredTestSuitesList.push(x);
      })
    }
  }

  getTestSuitesByFilter() {
    this.searchText = null;
    this.testsuite = new TestSuiteList();
    this.testsuite.projectId = this.projectId;
    this.testsuite.isArchived = this.isArchived;
    this.store.dispatch(new LoadTestSuiteListTriggered(this.testsuite));
  }

  exportTestSuites() {
    let count = 0;
    if (this.toMails && this.toMails.trim() != '') {
      let emails = this.toMails.split("\n");
      this.disableExport = true;
      this.emptyMail = false;
      const regexp = new RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      emails.forEach(text => {
           if(text && text.trim() != "" ) {
            var isValid = text.match(regexp);
            if(!isValid) {
              count++;
            } 
           } else {
             var idx = emails.indexOf(text);
             if(idx > -1) {
              emails.splice(idx,1);
             }
           }
      })
      if (count == 0) {
    
        let suiteNames = (this.testSuiteName == undefined || this.testSuiteName == null) ? null : this.testSuiteName;
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
        let exportModel = new TestSuiteExportModel();
        exportModel.projectName = this.projectName;
        exportModel.personName = this.projectResponsiblePersonName;
        exportModel.toMails = (emails.length > 0) ? emails.join("\n") : null;
        exportModel.download = 'excel';
        exportModel.testSuiteName = suiteNames;
        this.testRailService.GetTestRepoDataForJson(exportModel).subscribe((result: any) => {
          if (result.success) {
            this.toastr.info(this.translateService.instant(ConstantVariables.SuccessMessageForExportShared));
            this.closeExportPopover();
          }
          else {
            this.disableExport = false;
            let validationmessage = result.apiResponseMessages[0].message;
            this.toastr.error(validationmessage);
          }
        });
      }
      else {
        this.toastr.error("You have entered an invalid email address!");
        this.disableExport = false;
      }
    }
    else {
      this.emptyMail = true;
      this.disableExport = false;
      this.cdRef.markForCheck();
    }
  }

  openExportPopover() {
    this.exportsPopover.open();
  }

  closeMenuPopover() {
    this.threeDotsPopOver.close();
  }

  closeExportPopover() {
    this.exportsPopover.close();
    this.disableExport = false;
    this.testSuiteName = null;
    this.toMails = null;
    this.emptyMail = false;
    this.cdRef.markForCheck();
  }

  openImportPopover(isCsvImport) {
    this.files = [];
    this.isCsvImport = isCsvImport;
    this.acceptableFileFormat = this.isCsvImport ? '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' : '.xml';
    this.disableImport = true;
    this.cdRef.markForCheck();
    this.importsPopover.open();
  }

  filesSelected(event) {
    //this.files = this.isCsvImport ? event.rejectedFiles : event.addedFiles;
    this.files =  event.addedFiles;
    if (this.files && this.files.length > 0) {
      this.disableImport = false;
      this.cdRef.detectChanges();
    }
    if(this.isCsvImport && this.files && this.files.length > 0) {
      if(!this.files[0].name.includes('.csv') && !this.files[0].name.includes('.xlsx')){
        this.disableImport = true;
        this.toastr.error("", this.translateService.instant("TESTMANAGEMENT.FILEFORMATISINCORRECT"));
        this.cdRef.detectChanges();
      }
      else {
        this.disableImport = false;
        this.cdRef.detectChanges();
      }
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.disableImport = true;
    this.cdRef.markForCheck();
  }

  importTestSuites() {
    this.disableImport = true;
    this.importProgress = true;
    if (this.files.length > 0) {
      const formData = new FormData();
      formData.append("file", this.files[0]);
      if (this.isCsvImport) {
        this.testRailService.ImportTestSuiteFromCsv(formData, this.projectName).subscribe((result: any) => {
          if (result.success) {
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            this.toastr.info("", this.softLabePipe.transform(this.translateService.instant('TESTMANAGEMENT.IMPORTCOMPLEDCONFIRMATION'), this.softLabels));
            this.closeImportPopover();
            this.cdRef.detectChanges();
          }
          else {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessage);
            this.disableImport = false;
            this.importProgress = false;
            this.cdRef.detectChanges();
          }
          this.closeMenuPopover();
        })
      } else {
        this.testRailService.ImportTestSuite(formData, this.projectName).subscribe((result: any) => {
          if (result.success) {
            this.disableImport = false;
            this.importProgress = false;
            this.files = [];
            let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
            let msg;
            if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined' || currentCulture == undefined)
              msg = "Scenario will be imported soon. Please, refresh after some time";
            else if (currentCulture == 'te')
              msg = "దృశ్యం త్వరలో సృష్టించబడుతుంది. దయచేసి, కొంత సమయం తర్వాత రిఫ్రెష్ చేయండి";
            else
              msg = "시나리오가 곧 생성됩니다. 잠시 후 새로 고침하세요";
            this.toastr.info("", this.softLabePipe.transform(msg, this.softLabels));
            this.closeImportPopover();
            this.cdRef.detectChanges();
          }
          else {
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessage);
            this.disableImport = false;
            this.importProgress = false;
            this.cdRef.detectChanges();
          }
          this.closeMenuPopover();
        })
      }
    }
  }

  downloadTestCasesCsvTemplate() {
    this.testRailService.downloadTestCasesCsvTemplate().subscribe((response: any) => {
      var blob = new Blob([response], { type: "text/csv" });
      FileSaver.saveAs(blob, "SampleCsvTestSuiteImport.csv");
      this.closeMenuPopover();
    },
      function (error) {
        this.toasterService.error("Template download failed.");
      });
  }remo

  closeImportPopover() {
    this.importsPopover.close();
    this.disableImport = false;
    this.cdRef.markForCheck();
  }

  openTestSuiteDialog(addTestSuitePopover) {
    this.loadAddTestSuite = true;
    addTestSuitePopover.openPopover();
  }

  closeTestSuiteDialog() {
    this.loadAddTestSuite = false;
    this.addTestSuitePopovers.forEach(p => p.closePopover());
  }

  checkValidationForEmail() {
    if (this.toMails && this.toMails.trim() != '') {
      const regexp = new RegExp('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      var isValid = this.toMails.match(regexp);
      if(isValid) {
         this.disableExport = true;
      } else {
        this.disableExport = false;
        this.toastr.error("You have entered an invalid email address!");
      }
    }
  }

  

  setValidationForEmail() {
    this.searchTextChanged.next(this.toMails);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ngDestroyed$.next();
  }
}