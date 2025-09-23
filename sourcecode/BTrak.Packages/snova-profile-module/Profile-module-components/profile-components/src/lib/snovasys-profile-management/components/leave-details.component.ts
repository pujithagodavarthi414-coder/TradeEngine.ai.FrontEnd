import { Component, OnInit, ViewChild } from "@angular/core";
import { LeaveDetails } from "../models/leaveDetails.model";
import { SatPopover } from "@ncstate/sat-popover";
import { LoadLeaveTypesTriggered } from "../store/actions/leave-types.actions";
import { Observable } from "rxjs";
import * as LeaveTypeState from "../store/reducers/leave-types.reducers";
import { select, Store } from "@ngrx/store";
import * as leaveManagementModuleReducers from "../store/reducers/index"
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardService } from '../services/dashboard.service';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: "app-profile-component-leave-details",
    templateUrl: "leave-details.component.html"
})

export class LeaveDetailsCompnent extends CustomAppBaseComponent implements OnInit {
    @ViewChild('leaveTypePopover') leaveTypePopover: SatPopover;
    @ViewChild('dateFromPopover') dateFromPopover: SatPopover;
    @ViewChild('dateToPopover') dateToPopover: SatPopover;

    loadingInprogress: boolean;
    leaveDetails: LeaveDetails[] = [];
    dateFrom: Date;
    dateTo: Date;
    isOpen: boolean = true;
    minDate: Date;
    dateFromFilterIsActive: boolean = false;
    dateToFilterIsActive: boolean = false;
    leaveTypeId: string;
    leaveTypesList$: Observable<any>;
    searchByLeaveTypeFilterIsActive: boolean = false;
    selectedUserId: string;
    
    constructor(
        private store: Store<LeaveTypeState.State>,
        private cookieService: CookieService, private router: Router,
        private dashboardService: DashboardService) {
        super();

        if (this.router.url.split("/")[3]) {
            this.selectedUserId = this.router.url.split("/")[3];
        } else {
            this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        }
        
        this.getLeaveDetails();
        this.getAllLeaveTypes();
    }

    ngOnInIt() {
        super.ngOnInit();
    }

    getLeaveDetails() {
        this.loadingInprogress = true;
        let leaveDetail = new LeaveDetails();
        leaveDetail.leaveTypeId = this.leaveTypeId;
        leaveDetail.dateFrom = this.dateFrom;
        leaveDetail.dateTo = this.dateTo;
        leaveDetail.userId = this.selectedUserId;
        this.dashboardService.getLeaveDetails(leaveDetail).subscribe((response: any) => {
            if (response) {
                this.leaveDetails = response.data;
            }
            this.loadingInprogress = false;
        });
    }

    getAllLeaveTypes() {
        var leaveTypeSearchModel = new LeaveFrequencyTypeSearchInputModel();
        leaveTypeSearchModel.isApplyLeave = true;
        this.store.dispatch(new LoadLeaveTypesTriggered(leaveTypeSearchModel));
        this.leaveTypesList$ = this.store.pipe(select(leaveManagementModuleReducers.getLeaveTypesAll));
    }

    searchByLeaveType(leaveTypeId) {
        this.searchByLeaveTypeFilterIsActive = true;
        if (leaveTypeId == "all") {
            this.leaveTypeId = "";
        }
        else {
            this.leaveTypeId = leaveTypeId;
        }
        this.leaveTypePopover.close();
        this.getLeaveDetails();
    }

    onLeaveDateFromChange(event: MatDatepickerInputEvent<Date>) {
        this.dateFromFilterIsActive = true;
        this.dateFrom = event.target.value;
        this.minDate = this.dateFrom;
        this.dateFromPopover.close();
        this.getLeaveDetails();
    }

    onLeaveDateToChange(event: MatDatepickerInputEvent<Date>) {
        this.dateToFilterIsActive = true;
        this.dateTo = event.target.value;
        this.getLeaveDetails();
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    resetAllFilters() {
        this.dateTo = null;
        this.dateFrom = null;
        this.leaveTypeId = null;
        this.getLeaveDetails();
    }

}