import { ChangeDetectionStrategy, Component, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { Actions, ofType } from "@ngrx/effects";
import { ActivatedRoute } from '@angular/router';
import { tap, takeUntil } from "rxjs/operators";

import { MileStonesList, MileStone } from "../models/milestone";
import { TestCaseDropdownList } from "../models/testcasedropdown";

import * as testRailModuleReducer from "../store/reducers/index";

import { MileStoneActionTypes, LoadMileStoneTriggered } from "../store/actions/milestones.actions";
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';

@Component({
    selector: 'app-testrail-component-milestoneedit',
    templateUrl: './milestone-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestrailMileStoneEditComponent {
    @Output() closePopover: EventEmitter<boolean> = new EventEmitter();
    @Output() refreshList: EventEmitter<boolean> = new EventEmitter();

    @Input()
    set mileStoneToEdit(value: any) {
        if (value) {
            this._mileStoneToEdit = value;
            this.editMilestoneForm.setValue({
                milestoneTitle: value.milestoneTitle,
                parentMileStoneId: value.milestoneId,
                description: value.description,
                startDate: value.startDate,
                endDate: value.endDate,
                isCompleted: value.isCompleted
            });
        }
    };

    get mileStoneToEdit() {
        return this._mileStoneToEdit;
    }

    @Input()
    set isEditable(value: any) {
        this._isEditable = value;
    }

    get isEditable() {
        return this._isEditable;
    }

    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    _mileStoneToEdit: MileStone;
    mileStone: MileStone;
    softLabels: SoftLabelConfigurationModel[];

    editMilestoneForm: FormGroup;

    _isEditable: boolean;
    disableMilestone: boolean = false;
    public opened: any = false;
    minDate: string;
    maxDate: string;
    projectId: string;

    constructor(private store: Store<State>,
        private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        public googleAnalyticsService: GoogleAnalyticsService) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.initializeMileStoneForm();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(MileStoneActionTypes.LoadMileStoneByIdCompleted),
            tap(() => {
                this.disableMilestone = false;
                this.initializeMileStoneForm();
                this.closeMileStoneDialog();
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(MileStoneActionTypes.MileStoneFailed),
                tap(() => {
                    this.disableMilestone = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    initializeMileStoneForm() {
        this.editMilestoneForm = new FormGroup({
            milestoneTitle: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(150)])),
            parentMileStoneId: new FormControl("", []),
            description: new FormControl("", Validators.compose([Validators.maxLength(300)])),
            startDate: new FormControl("", []),
            endDate: new FormControl("", []),
            isCompleted: new FormControl(false, [])
        });
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getMileStoneLoading));
    }

    editMilestone() {
        this.disableMilestone = true;
        if (this.mileStoneToEdit) {
            const dataObject = this.editMilestoneForm.value;
            this.mileStone = Object.assign({}, this.mileStoneToEdit);
            this.mileStone.description = dataObject.description;
            this.mileStone.endDate = dataObject.endDate;
            this.mileStone.isCompleted = dataObject.isCompleted;
            this.mileStone.milestoneTitle = dataObject.milestoneTitle;
            this.mileStone.parentMileStoneId = dataObject.parentMileStoneId;
            this.mileStone.startDate = dataObject.startDate;
            this.store.dispatch(new LoadMileStoneTriggered(this.mileStone));
            this.googleAnalyticsService.eventEmitter("Test Management", "Updated Milestone", this.mileStone.milestoneTitle, 1);
        } else {
            this.mileStone = new MileStone();
            this.mileStone = this.editMilestoneForm.value;
            this.mileStone.projectId = this.projectId;
            this.store.dispatch(new LoadMileStoneTriggered(this.mileStone));
            this.googleAnalyticsService.eventEmitter("Test Management", "Created Milestone", this.mileStone.milestoneTitle, 1);
        }
    }

    changeDateFrom(minDate) {
        this.minDate = minDate;
        this.cdRef.markForCheck();
    }

    changeDateTo(maxDate) {
        this.maxDate = maxDate;
        this.cdRef.markForCheck();
    }

    closeMileStoneDialog() {
        this.closePopover.emit(true);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
