import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";
import { LoadTestCaseAssignToTriggered, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';
import { LoadTestRunUsersListTriggered } from '../store/actions/testrunusers.actions';

import * as testRailModuleReducer from "../store/reducers/index";

import { TestCase } from '../models/testcase';
import { TestCaseDropdownList } from '../models/testcasedropdown';

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';

@Component({
    selector: 'testrun-case-assignto-status',
    templateUrl: './testrun-case-assignto-status.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCaseAssignToStatusComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @Output() closeOperations = new EventEmitter<string>();
    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.projectsId = data;
            this.loadUsersList();
        }
    }
    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        this.testCaseDetail = data;
        this.initializeAssignToForm();
        this.assignToForm.patchValue(this.testCaseDetail);
        if (this.testCaseDetail.testCaseSteps) {
            this.stepStatus = this.assignToForm.get('stepStatus') as FormArray;
            this.testCaseDetail.testCaseSteps.forEach(x => {
                this.stepStatus.push(this.formBuilder.group({
                    stepId: x.stepId,
                    stepText: x.stepText,
                    stepStatusId: x.stepStatusId,
                    stepStatusName: x.stepStatusName,
                    stepExpectedResult: x.stepExpectedResult,
                    stepActualResult: x.stepActualResult,
                    viewActualresult: false
                }))
            })
        }
    }

    usersList$: Observable<TestCaseDropdownList[]>;

    public ngDestroyed$ = new Subject();

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    projectsId: string;

    addAssignTo: TestCase;

    assignToForm: FormGroup;
    stepStatus: FormArray;

    testCaseDetail: any;
    disableAssignTo: boolean = false;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private route: ActivatedRoute, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
        super();

        this.initializeAssignToForm();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseAssignToCompleted),
                tap(() => {
                    this.disableAssignTo = false;
                    this.closeOperations.emit('');
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disableAssignTo = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    loadUsersList() {
        this.store.dispatch(new LoadTestRunUsersListTriggered(this.projectsId));
        this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
    }

    addAssign() {
        this.disableAssignTo = true;
        this.addAssignTo = new TestCase();
        this.addAssignTo = this.assignToForm.value;
        this.addAssignTo.testCaseId = this.testCaseDetail.testCaseId;
        this.addAssignTo.testRunId = this.testCaseDetail.testRunId;
        this.addAssignTo.timeStamp = this.testCaseDetail.timeStamp;
        this.store.dispatch(new LoadTestCaseAssignToTriggered(this.addAssignTo));
    }

    cancelAssign() {
        this.closeOperations.emit('');
    }

    initializeAssignToForm() {
        this.assignToForm = new FormGroup({
            assignToId: new FormControl("", Validators.compose([Validators.required])),
            assignToComment: new FormControl("", Validators.compose([])),
            statusId: new FormControl("", Validators.compose([])),
            statusComment: new FormControl("", Validators.compose([])),
            stepStatus: this.formBuilder.array([])
        });
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}