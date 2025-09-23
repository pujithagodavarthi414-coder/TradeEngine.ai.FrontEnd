import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, ViewChildren, OnInit, Input } from '@angular/core';
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";
import { TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';
import { TestCaseActionTypes, LoadTestCaseViewTriggered, LoadSingleTestCaseBySectionIdTriggered } from '../store/actions/testcaseadd.actions';

import { TestSuiteCases } from '../models/testsuitesection';
import { TestCase } from '../models/testcase';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ConstantVariables } from '../constants/constant-variables';
import { LoadProjectRelatedCountsTriggered, LoadProjectsTriggered } from '../store/actions/testrailprojects.actions';
import { ActivatedRoute } from '@angular/router';
import { createStubProjectList } from '../models/projectlist';

@Component({
  selector: 'app-testrail-testsuites-view',
  templateUrl: './testsuites-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuitesViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
  @ViewChildren("addTestSuitePopover") addTestSuitePopovers;
  @ViewChildren("addSuitePopover") addSuitePopovers;
  @Output() selectedSectionData = new EventEmitter<any>();

  softLabels: SoftLabelConfigurationModel[];
  fromCustomApp: boolean = false;
  Ids: string;

  @Input("Ids")
  set _Ids(Ids) {
    this.fromCustomApp = true;
    this.Ids = Ids;
  }

  testSuitesCount$: Observable<number>;
  testSuiteSectionList$: Observable<TestSuiteCases>;
  projectRelatedDataLoading$: Observable<boolean>;
  public ngDestroyed$ = new Subject();


  testSuitesId: string;
  testSuiteDescription: any;
  sectionSelected: string;
  screenWidth: number;
  isTestSuite: boolean = false;
  isTestSuiteSection: boolean = false;
  isSectionsLoaded: boolean = false;
  isSectionsSubsectionsLoaded: boolean = false;
  loadAddTestSuite: boolean = false;
  isSuitesPresent: boolean = false;
  isHierarchical: boolean;
  sectionData: any;
  sectionTemporaryData: any;
  editSectionData: any;
  hierarchicalSectionsData: any;
  showCasePreview: any;
  showCaseEditPreview: any;
  selectedCaseFromPreview: any;
  isOpen: boolean = true;
  projectLabel: string;
  caseViewFieldName: string = ConstantVariables.CaseViewFieldName;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private route: ActivatedRoute) {
    super();

    var projectSearchResult = createStubProjectList();
    this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
    this.testSuitesCount$ = this.store.pipe(select(testSuiteModuleReducer.getTestSuitesCount));
    this.projectRelatedDataLoading$ = this.store.pipe(select(testSuiteModuleReducer.getProjectRelatedDataLoading));
    this.testSuiteSectionList$ = this.store.pipe(select(testSuiteModuleReducer.getTestSuiteSectionList));

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered),
      tap(() => {
        this.sectionSelected = null;
        this.showCasePreview = null;
        this.showCaseEditPreview = null;
        this.isTestSuite = false;
        this.isTestSuiteSection = false;
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCasesBySectionIdTriggered),
      tap(() => {
        if (localStorage.getItem('selectedSectionFilter') != null && localStorage.getItem('selectedSectionFilter') != undefined) {
          let sectionData = JSON.parse(localStorage.getItem('selectedSectionFilter'));
          this.sectionSelected = sectionData.sectionId;
          let sectionDetailedData = this.checkSubData(this.hierarchicalSectionsData.sections, this.sectionSelected);
          let passingData = {
            sectionId: sectionDetailedData.sectionId,
            sectionName: sectionDetailedData.sectionName,
            description: sectionDetailedData.description,
            subSections: null,
            isHierarchical: sectionData.isHierarchical
          }
          this.sectionTemporaryData = passingData;
          this.cdRef.detectChanges();
        }
        else {
          this.sectionTemporaryData = null;
          this.cdRef.markForCheck();
        }
        this.showCasePreview = null;
        this.showCaseEditPreview = null;
        this.selectedCaseFromPreview = null;
        this.cdRef.markForCheck();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted),
      tap(() => {
        this.testSuiteSectionList$.subscribe(result => {
          this.hierarchicalSectionsData = result;
          this.cdRef.markForCheck();
        })
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseAfterEditCompleted),
      tap((result: any) => {
        if (result && result.testCasesAfterEdit) {
          this.showCaseEditPreview = null;
          this.showCasePreview = result.testCasesAfterEdit[0];
          this.cdRef.detectChanges();
        }
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadMoveTestCasesTriggered),
      tap(() => {
        this.showCasePreview = null;
        this.showCaseEditPreview = null;
        this.selectedCaseFromPreview = null;
        this.cdRef.detectChanges();
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseTitleDeleteCompleted),
      tap((result: any) => {
        if (result && result.testCaseDeleteId && (this.showCasePreview || this.showCaseEditPreview)) {
          let data = result.testCaseDeleteId;
          if (this.showCaseEditPreview && this.showCaseEditPreview.testCaseId == data) {
            this.closePreviewDialog();
          }
          else if (this.showCasePreview && this.showCasePreview.testCaseId == data) {
            this.closePreviewDialog();
          }
        }
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      takeUntil(this.ngDestroyed$),
      ofType(TestCaseActionTypes.LoadTestCaseReorderCompleted),
      tap(() => {
        this.showCasePreview = null;
        this.showCaseEditPreview = null;
        this.isTestSuite = false;
        this.isTestSuiteSection = false;
        this.cdRef.detectChanges();
        // if (this.showCaseEditPreview && this.selectedCaseFromPreview && this.showCaseEditPreview.testCaseId == this.selectedCaseFromPreview.testCaseId) {
        //   let testCaseSearch = new TestCase();
        //   testCaseSearch.sectionId = this.showCaseEditPreview.sectionId;
        //   testCaseSearch.testCaseId = this.showCaseEditPreview.testCaseId;
        //   testCaseSearch.isArchived = false;
        //   this.store.dispatch(new LoadSingleTestCaseBySectionIdTriggered(testCaseSearch));
        // }
      })
    ).subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.fromCustomApp) {
      this.route.params.subscribe(routeParams => {
        let projectId = routeParams.id;
        this.store.dispatch(new LoadProjectRelatedCountsTriggered(projectId));
      });
    }

    this.getSoftLabelConfigurations();
    this.screenWidth = window.innerWidth;
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    if (this.softLabels && this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.cdRef.markForCheck();
    }
  }

  openSuiteDialog(addSuitePopover) {
    this.loadAddTestSuite = true;
    addSuitePopover.openPopover();
  }

  openTestSuiteDialog(addTestSuitePopover) {
    this.loadAddTestSuite = true;
    addTestSuitePopover.openPopover();
  }

  closeTestSuiteDialog() {
    this.loadAddTestSuite = false;
    this.addTestSuitePopovers.forEach(p => p.closePopover());
    this.addSuitePopovers.forEach(p => p.closePopover());
  }

  getTestSuiteId(testSuiteId) {
    this.testSuitesId = testSuiteId;
    //this.cdRef.detectChanges();
  }

  getTestSuiteDescription(value) {
    this.testSuiteDescription = value;
    //this.cdRef.detectChanges();
  }

  getSelectedSectionData(data) {
    this.sectionData = null;
    this.cdRef.detectChanges();
    this.sectionData = data;
    this.sectionTemporaryData = null;
    this.sectionSelected = data.sectionId;
    this.cdRef.detectChanges();
  }

  getSelectedEditSectionData(data) {
    this.editSectionData = data;
    this.cdRef.detectChanges();
  }

  getHierarchicalCases(data) {
    this.isHierarchical = data;
    this.cdRef.detectChanges();
  }

  changeSectionsStatus(value) {
    this.isSectionsLoaded = value;
  }

  getDeletedId(value) {
    this.isSectionsSubsectionsLoaded = value;
  }

  checkSubData(sectionsList, sectionId) {
    for (let i = 0; i < sectionsList.length; i++) {
      if (sectionsList[i].sectionId == sectionId) {
        return sectionsList[i];
      }
      else if (sectionsList[i].subSections && sectionsList[i].subSections.length > 0) {
        let checkSubSections = this.recursivecheckSubData(sectionsList[i].subSections, sectionId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  recursivecheckSubData(childList, sectionId) {
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].sectionId == sectionId) {
        return childList[i];
      }
      else if (childList[i].subSections && childList[i].subSections.length > 0) {
        let checkSubSections = this.recursivecheckSubData(childList[i].subSections, sectionId);
        if (checkSubSections != undefined && checkSubSections != undefined)
          return checkSubSections;
      }
    }
  }

  getCasePreviewDetails(data) {
    if (data.previewCase) {
      if (this.showCasePreview == undefined || this.showCasePreview == null || data.caseData.testCaseId != this.showCasePreview.testCaseId) {
        this.loadCaseHistory(data);
        this.closePreviewDialog();
        this.selectedCaseFromPreview = data.caseData;
        this.showCasePreview = data.caseData;
        this.showCaseEditPreview = null;
        if (this.screenWidth > 1279)
          this.isTestSuite = true;
        this.cdRef.detectChanges();
      }
    }
    else if (data.editCase) {
      this.showCasePreview = null;
      this.showCaseEditPreview = data.caseData;
      this.selectedCaseFromPreview = data.caseData;
      if (this.screenWidth > 1279)
        this.isTestSuite = true;
      this.isTestSuiteSection = true;
      this.cdRef.detectChanges();
    }
  }

  getCaseDataPreviewDetails(data) {
    if (data) {
      this.selectedCaseFromPreview = data.caseData;
      this.cdRef.detectChanges();
      this.getCasePreviewDetails(data);
    }
  }

  loadCaseHistory(data) {
    let caseView = new TestCase();
    caseView.testCaseId = data.caseData.testCaseId;
    caseView.fieldName = this.caseViewFieldName;
    this.store.dispatch(new LoadTestCaseViewTriggered(caseView));
  }

  closePreviewDialog() {
    this.showCasePreview = null;
    this.showCaseEditPreview = null;
    this.selectedCaseFromPreview = null;
    this.isTestSuite = false;
    this.isTestSuiteSection = false;
    this.cdRef.detectChanges();
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }
}
