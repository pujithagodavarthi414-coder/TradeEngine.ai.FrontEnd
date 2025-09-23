import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs';
import { TestSuite, TestSuiteList } from "../models/testsuite";
import { ActivatedRoute } from "@angular/router";

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";

import { LoadTestSuiteTriggered, MoveTestSuiteTriggered, TestSuiteActionTypes } from "../store/actions/testsuiteslist.action";

import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { ProjectList } from '../models/projectlist';
import { ProjectService } from '../services/projects.service';
import { ProjectSearchCriteriaInputModel } from '../models/ProjectSearchCriteriaInputModel';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';

@Component({
    selector: 'app-testrail-testsuite-edit',
    templateUrl: './testsuite-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuiteEditComponent extends CustomAppFeatureBaseComponent implements OnInit  {
    @Output() closeTestSuite = new EventEmitter<string>();
    @Output() updatedDescription = new EventEmitter<any>();
    @Output() updatedId = new EventEmitter<string>();
    softLabels$: any;
    softLabels: any;

    @Input("editTestSuites")
    set _editTestSuites(data: string) {
        if (data == 'true')
            this.editTestSuite = true;
        else
            this.editTestSuite = false;
    }

    @Input("testSuiteId")
    set _testSuiteId(data: string) {
        if (data)
            this.testSuiteId = data;
    }

    @Input("projectId")
    set _projectId(data: any) {
        if (data) {
            this.uniqueProjectId = data;
            this.uniqueVar = true;
        }
    }

    @Input("testSuite")
    set _testSuite(data: TestSuiteList) {
        if (data) {
            this.editTestSuiteData = data;
            this.editTestSuite = true;
            this.initializeTestSuiteForm();
            this.testSuiteForm.patchValue({
                testSuiteName: this.editTestSuiteData.testSuiteName,
                description: this.editTestSuiteData.description,
                projectId: this.editTestSuiteData.projectId
            });
        }
    }

    public ngDestroyed$ = new Subject();

    testSuite: TestSuite;
    editTestSuiteData: TestSuiteList;

    testSuiteForm: FormGroup;

    projectId: string;
    testSuiteId: string;

    editTestSuite: boolean = false;
    testSuiteDelete: boolean = false;
    disableTestSuite: boolean = false;
    disableTestSuiteDelete: boolean = false;
    viewTestRuns: boolean = false;
    selectedTestSuiteId: string;
    selectedTimeStamp: string;
    uniqueVar: boolean = false;
    uniqueProjectId: string;
    projectSearchResults: ProjectList[];
    constructor(private store: Store<State>, private route: ActivatedRoute, private actionUpdates$: Actions,
        public googleAnalyticsService: GoogleAnalyticsService,
        private projectService: ProjectService,
        private cdRef: ChangeDetectorRef
    ) {
        super();
        this.route.params.subscribe(routeParams => {
            if (!this.uniqueVar) {
                this.projectId = routeParams.id;
                this.uniqueVar = false;
            }
        });
        this.initializeTestSuiteForm();
        this.searchProjects();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestSuiteActionTypes.LoadTestSuiteByIdCompleted),
                tap(() => {
                    this.closeAddTestSuiteDialog();
                    this.disableTestSuite = false;
                    let suiteData = {
                        testSuiteName: this.testSuiteForm.value.testSuiteName,
                        description: this.testSuiteForm.value.description
                    }
                    this.updatedDescription.emit(suiteData);
                    if (this.testSuite && this.testSuite.testSuiteId)
                        this.updatedId.emit(this.testSuite.testSuiteId);
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestSuiteActionTypes.TestSuiteFailed),
                tap(() => {
                    this.disableTestSuite = false;
                    this.disableTestSuiteDelete = false;
                })
            ).subscribe();

            
      this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(TestSuiteActionTypes.MoveTestSuiteCompleted),
        tap(() => {
          this.closeAddTestSuiteDialog();
        })
      ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    searchProjects() {
        var projectsModel = new ProjectSearchCriteriaInputModel();
        projectsModel.isArchived = false;
        projectsModel.sortBy = 'projectName';
        projectsModel.sortDirectionAsc = true;
      this.projectService.searchProjects(projectsModel).subscribe((x: any) => {
          if(x.success) {
              this.projectSearchResults = x.data;
              this.cdRef.detectChanges();
          }
      })
    }

    addNewTestSuite() {
        this.disableTestSuite = true;
        this.testSuite = new TestSuite();
        this.testSuite = this.testSuiteForm.value;
        this.testSuite.isMovingToAnotherProject = (this.testSuiteForm.get("projectId").value == this.projectId) ? false : true;
        if(!this.editTestSuite) {
            this.testSuite.projectId = this.uniqueVar ? this.uniqueProjectId : this.projectId;
        }
        this.testSuite.oldProjectId = this.uniqueVar ? this.uniqueProjectId : this.projectId;
        if (this.editTestSuite) {
            this.testSuite.testSuiteId = this.editTestSuiteData.testSuiteId;
            this.testSuite.timeStamp = this.editTestSuiteData.timeStamp;
            this.googleAnalyticsService.eventEmitter("Test Management", "Updated Test Suite", this.testSuite.testSuiteName, 1);
        }
        else
            this.googleAnalyticsService.eventEmitter("Test Management", "Created Test Suite", this.testSuite.testSuiteName, 1);
            if(this.testSuite.isMovingToAnotherProject == true) {
                this.store.dispatch(new MoveTestSuiteTriggered(this.testSuite));
            } else {
                this.store.dispatch(new LoadTestSuiteTriggered(this.testSuite));
            }
    }

    closeAddTestSuiteDialog() {
        this.closeTestSuite.emit('');
    }

    initializeTestSuiteForm() {
        this.testSuiteForm = new FormGroup({
            testSuiteName: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(100)])),
            description: new FormControl("", Validators.compose([Validators.maxLength(150)])),
            projectId: new FormControl(this.projectId, Validators.compose([Validators.required]))
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}