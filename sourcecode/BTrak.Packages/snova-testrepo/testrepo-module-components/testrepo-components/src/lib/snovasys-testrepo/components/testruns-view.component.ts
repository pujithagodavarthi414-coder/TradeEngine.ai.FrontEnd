import { Component, ChangeDetectionStrategy, ViewChild, OnInit, ChangeDetectorRef, ViewChildren, Input } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { TestSuiteList } from '../models/testsuite';
import { TestSuiteCases } from '../models/testsuitesection';
import { TestCase } from '../models/testcase';

import { State } from "../store/reducers/index";
import * as testSuiteModuleReducer from "../store/reducers/index";
import { TestSuiteSectionActionTypes } from '../store/actions/testsuitesection.actions';
import { TestCaseActionTypes, LoadTestCaseViewTriggered } from '../store/actions/testcaseadd.actions';
import { LoadTestSuiteListTriggered } from "../store/actions/testsuiteslist.action";

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { TimeConfiguration } from '../models/time-configuration-model';
import { ConstantVariables } from '../constants/constant-variables';
import { MaterSettingService } from '../services/master-setting.services';
import { LoadProjectRelatedCountsTriggered } from '../store/actions/testrailprojects.actions';

@Component({
    selector: 'app-testrail-component-testruns-view',
    templateUrl: './testruns-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunsViewComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren("addRunPopover") addRunPopovers;
    @ViewChildren("addNewRunPopover") addNewRunPopovers;
    @ViewChild("addTestRun") addTestRunPopover: SatPopover;
    @ViewChild("addNewTestRun") addNewTestRunPopover: SatPopover;

    fromCustomApp: boolean = false;
    Ids: string;

    @Input("Ids")
    set _Ids(Ids) {
        this.fromCustomApp = true;
        this.Ids = Ids;
    }

    @Input("typeOfRun")
    set _typeOfRun(typeOfRun) {
        this.typeOfRun = typeOfRun;
    }

    typeOfRun: string;
    testsuitesList$: Observable<TestSuiteList[]>;
    testRunsCount$: Observable<number>;
    testRunSectionList$: Observable<TestSuiteCases>;
    projectRelatedDataLoading$: Observable<boolean>;

    softLabels: SoftLabelConfigurationModel[];
    projectLabel: string;

    public ngDestroyed$ = new Subject();

    testsuite: TestSuiteList;
    configurations: TimeConfiguration[];

    projectId: string;
    testSuitesId: string;
    testRunsId: string;
    testRunDescription: any;
    selectedTestSuite: any;
    isTestRun: boolean = false;
    isTestRunSection: boolean = false;
    loadAddTestRun: boolean = false;
    loadNewTestRun: boolean = false;
    isSectionsLoaded: boolean = false;
    isHierarchical: boolean;
    loadRunSections: boolean;
    sectionSelected: string;
    statusRunId: string;
    statusProjectId: string;
    sectionData: any;
    sectionTemporaryData: any;
    isInclude: any;
    requiredValues: any;
    hierarchicalSectionsData: any;
    showCaseStatusPreview: any;
    selectedCaseFromPreview: any;
    screenWidth: number;
    testRunCompleted: boolean = false;
    isTestRunCompleted: boolean = false;
    isStatusUpdated: boolean = false;
    caseViewFieldName: string = ConstantVariables.CaseViewFieldName;

    constructor(private route: ActivatedRoute, private store: Store<State>, private actionUpdates$: Actions, private masterSettingsService: MaterSettingService, private cdRef: ChangeDetectorRef) {
        super();

        this.testRunsCount$ = this.store.pipe(select(testSuiteModuleReducer.getTestRunsCount));
        this.testRunSectionList$ = this.store.pipe(select(testSuiteModuleReducer.getTestRunSectionList));
        this.projectRelatedDataLoading$ = this.store.pipe(select(testSuiteModuleReducer.getProjectRelatedDataLoading));
        
        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered),
            tap(() => {
                this.sectionSelected = null;
                this.showCaseStatusPreview = null;
                this.isTestRunCompleted = false;
                this.statusRunId = null;
                this.statusProjectId = null;
                this.isTestRun = false;
                this.isTestRunSection = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesBySectionAndRunIdTriggered),
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
                this.showCaseStatusPreview = null;
                this.selectedCaseFromPreview = null;
                this.isTestRunCompleted = false;
                this.statusRunId = null;
                this.statusProjectId = null;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusTriggered),
            tap((result: any) => {
                if (result && result.searchCaseAfterStatus && this.showCaseStatusPreview != null) {
                    this.isStatusUpdated = result.searchCaseAfterStatus.isBugAdded;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterStatusCompleted),
            tap((result: any) => {
                if (result && result.searchCaseAfterStatusDetails && this.isStatusUpdated && this.showCaseStatusPreview != null) {
                    this.showCaseStatusPreview = null;
                    this.cdRef.detectChanges();
                    this.showCaseStatusPreview = result.searchCaseAfterStatusDetails;
                    this.cdRef.detectChanges();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseBySectionAndRunIdAfterBugStatusCompleted),
            tap((result: any) => {
                if (result && result.searchCaseAfterStatusDetails && this.showCaseStatusPreview != null) {
                    let data = result.searchCaseAfterStatusDetails;
                    if (data.bugsCount == null || data.bugsCount == 0) {
                        this.showCaseStatusPreview = null;
                        this.cdRef.detectChanges();
                        this.showCaseStatusPreview = result.searchCaseAfterStatusDetails;
                        this.cdRef.detectChanges();
                    }
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestSuiteSectionActionTypes.LoadTestRunSectionListCompleted),
            tap(() => {
                this.testRunSectionList$.subscribe(result => {
                    this.hierarchicalSectionsData = result;
                    this.cdRef.markForCheck();
                })
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        if (!this.fromCustomApp) {
            this.route.params.subscribe(routeParams => {
                this.projectId = routeParams.id;
                this.store.dispatch(new LoadProjectRelatedCountsTriggered(this.projectId));
            })
        }

        this.initializeTestRunForm();
        this.loadTestSuitesList();
        this.getSoftLabelConfigurations();
        this.screenWidth = window.innerWidth;
        this.loadTestRailConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.projectLabel = this.softLabels[0].projectLabel;
            this.cdRef.markForCheck();
        }
    }

    openTestRunDialog(addRunPopover) {
        this.initializeTestRunForm();
        addRunPopover.openPopover();
    }

    closeTestRunDialog() {
        this.addRunPopovers.forEach(p => p.closePopover());
    }

    closeNewTestRunDialog() {
        this.loadNewTestRun = false;
        this.addNewTestRunPopover.close();
    }

    getTestSuiteId(testSuiteId) {
        this.testSuitesId = testSuiteId;
        this.cdRef.detectChanges();
    }

    getTestRunId(testRunId) {
        this.testRunsId = testRunId;
        this.cdRef.detectChanges();
    }

    getIsIncludeOrNot(value) {
        this.isInclude = value;
        this.cdRef.detectChanges();
    }

    getRequiredIds(value) {
        if (value) {
            this.testSuitesId = value.testSuiteId;
            this.testRunsId = value.testRunId;
            this.isInclude = value.isIncludeAllCases;
            this.requiredValues = value;
            this.cdRef.detectChanges();
        }
    }

    getTestRunDescription(value) {
        this.testRunDescription = value;
        this.cdRef.detectChanges();
    }

    getSelectedSectionData(data) {
        this.sectionData = null;
        this.cdRef.detectChanges();
        this.sectionData = data;
        this.sectionTemporaryData = null;
        this.sectionSelected = data.sectionId;
        this.cdRef.detectChanges();
    }

    getHierarchicalCases(data) {
        this.isHierarchical = data;
        this.cdRef.detectChanges();
    }

    getTestRunIsCompleted(data) {
        this.testRunCompleted = data;
        this.cdRef.detectChanges();
    }

    getLoadRunSections(data) {
        this.loadRunSections = data;
        this.isSectionsLoaded = data;
        this.cdRef.markForCheck();
    }

    changeSectionsStatus(value) {
        this.isSectionsLoaded = value;
        this.cdRef.markForCheck();
    }

    changeStatusOfDelete(value) { }

    addTestRuns() {
        this.closeTestRunDialog();
        localStorage.removeItem('selectedTestCases');
        localStorage.removeItem('selectedSections');
        this.loadNewTestRun = true;
        this.addNewTestRunPopover.open();
        (document.querySelector('.card-filter-runs') as HTMLElement).parentElement.parentElement.style.overflow = 'auto';
    }

    loadTestSuitesList() {
        this.testsuite = new TestSuiteList();
        this.testsuite.projectId = this.projectId;
        this.testsuite.isArchived = false;
        this.store.dispatch(new LoadTestSuiteListTriggered(this.testsuite));
        this.testsuitesList$ = this.store.pipe(select(testSuiteModuleReducer.getTestSuiteAll));
    }

    loadTestRailConfigurations() {
        let configurationModel = new TimeConfiguration();
        configurationModel.isArchived = false;
        this.masterSettingsService.getTimeConfigurationSettings(configurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.configurations = response.data;
            }
        });
    }

    checkStatusDisabled() {
        if (this.selectedTestSuite.value)
            return false;
        else
            return true;
    }

    initializeTestRunForm() {
        this.selectedTestSuite = new FormControl('', [Validators.required]);
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

    getCaseStatusPreviewDetails(data) {
        if (this.showCaseStatusPreview == undefined || this.showCaseStatusPreview == null || data.caseData.testCaseId != this.showCaseStatusPreview.testCaseId) {
            this.loadCaseHistory(data);
            this.closePreviewDialog();
            this.selectedCaseFromPreview = data.caseData;
            this.showCaseStatusPreview = data.caseData;
            this.isTestRunCompleted = data.testRunCompleted;
            this.statusRunId = data.testRunId;
            this.statusProjectId = data.projectId;
            if (this.screenWidth > 1279)
                this.isTestRun = true;
            this.cdRef.detectChanges();
        }
    }

    getCasePreviewDetails(data) {
        if (data) {
            this.selectedCaseFromPreview = data.caseData;
            this.cdRef.detectChanges();
            this.getCaseStatusPreviewDetails(data);
        }
    }

    loadCaseHistory(data) {
        let viewConfigurationId = this.configurations.find(x => x.configurationShortName == "TestCaseViewed");
        let caseView = new TestCase();
        caseView.testCaseId = data.caseData.testCaseId;
        caseView.fieldName = this.caseViewFieldName;
        caseView.testRunId = data.caseData.testRunId;
        caseView.configurationId = viewConfigurationId.testRailConfigurationId;
        this.store.dispatch(new LoadTestCaseViewTriggered(caseView));
    }

    closePreviewDialog() {
        this.showCaseStatusPreview = null;
        this.selectedCaseFromPreview = null;
        this.isTestRun = false;
        this.isTestRunSection = false;
        this.cdRef.detectChanges();
    }

    onResize() {
        this.screenWidth = window.innerWidth;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}