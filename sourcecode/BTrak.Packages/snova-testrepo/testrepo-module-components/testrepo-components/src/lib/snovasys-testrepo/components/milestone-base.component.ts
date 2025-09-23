import { ChangeDetectionStrategy, Component, ChangeDetectorRef, ViewChild, ViewChildren, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SatPopoverAnchor } from "@ncstate/sat-popover";

import { MileStone, MileStoneWithCount } from "../models/milestone";
import { TestCaseDropdownList } from "../models/testcasedropdown";

import * as testRailModuleReducer from "../store/reducers/index";

import { LoadMileStoneListTriggered, MileStoneActionTypes } from "../store/actions/milestones.actions";
import { LoadMileStoneDropdownListTriggered } from "../store/actions/milestonedropdown.actions";

import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { LoadProjectRelatedCountsTriggered } from '../store/actions/testrailprojects.actions';

@Component({
    selector: 'app-testrail-component-milestone',
    templateUrl: './milestone-base.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestrailMileStoneBaseComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren(SatPopoverAnchor) MileStonesPopover;
    @ViewChildren("addMilestonePopover") addMilestonesPopover;
    @ViewChildren("editMilestonePopover") editMilestonesPopover;
    @ViewChild("deleteMilestoneComponent") deleteMilestoneComponentPopover;
    @ViewChild("editMilestoneComponent") editMilestoneComponentPopover;
    fromCustomApp: boolean = false;
    Ids: string;

    @Input("Ids")
    set _Ids(Ids) {
        this.fromCustomApp = true;
        this.Ids = Ids;
    }

    mileStoneList$: Observable<MileStoneWithCount[]>;
    mileStonesCount$: Observable<number>;
    projectRelatedDataLoading$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels: SoftLabelConfigurationModel[];
    addMileStoneForm: FormGroup;
    editMilestoneForm: FormGroup;
    mileStone: MileStone;
    mileStoneToEdit: MileStone;

    hideme = {};
    isEditable: boolean;
    isVisibleAddMileStone: boolean = false;
    isOpen: boolean = true;
    isArchived: boolean = false;
    isCompleted: boolean = false;

    dateFrom: string;
    dateTo: string;
    maxDate = new Date();

    public opened: any = false;
    projectId: string;
    searchText: string;
    projectLabel: string;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
        super();

        this.mileStonesCount$ = this.store.pipe(select(testRailModuleReducer.getMilestonesCount));
        this.projectRelatedDataLoading$ = this.store.pipe(select(testRailModuleReducer.getProjectRelatedDataLoading));

        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getMileStoneListLoading));

        // this.actionUpdates$
        // .pipe(
        //     ofType(softLabelsActionTypes.GetsoftLabelsCompleted),
        //     tap(() => {
        //         this.getSoftLabelConfigurations();
        //     })
        // )
        // .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        if(!this.fromCustomApp){
            this.route.params.subscribe(routeParams => {
                this.projectId = routeParams.id;
                this.store.dispatch(new LoadProjectRelatedCountsTriggered(this.projectId));
            });
        }
        
        this.getSoftLabelConfigurations();
        this.getMileStonesList();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
            this.projectLabel = this.softLabels[0].projectLabel;
            this.cdRef.markForCheck();
        }
    }

    closeMileStoneDialog() {
        this.isVisibleAddMileStone = false;
        this.addMilestonesPopover.forEach(p => p.closePopover());
        this.editMilestonesPopover.forEach(p => p.closePopover());
    }

    openMileStoneDialog(milestonePopover) {
        this.isVisibleAddMileStone = true;
        milestonePopover.openPopover();
    }

    closeDateFilter() {
        this.dateFrom = '';
        this.dateTo = '';
    }

    changeDeadline(from, to) {
        if (from > to)
            this.dateTo = '';
    }

    closeSearch() {
        this.searchText = null;
    }

    getMileStonesList() {
        this.mileStone = new MileStone();
        this.mileStone.milestoneId = this.Ids;
        this.mileStone.projectId = this.projectId;
        this.mileStone.isArchived = false;
        this.store.dispatch(new LoadMileStoneListTriggered(this.mileStone));
        this.mileStoneList$ = this.store.pipe(select(testRailModuleReducer.getMileStoneAll));
        this.mileStoneList$.subscribe((milestones: any) => {
            if(milestones && milestones.length > 0) {
                this.projectId = milestones[0].projectId;
            }
        })
    }

    editMilestone(milestone) {
        this.mileStoneToEdit = milestone;
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    closeCompleted() {
        this.isCompleted = false;
    }
}
