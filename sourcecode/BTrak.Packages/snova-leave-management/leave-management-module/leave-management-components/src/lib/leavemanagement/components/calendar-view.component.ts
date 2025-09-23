import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { LeaveModel } from "../models/leave-model";
import { DatePipe } from "@angular/common";
import { LeaveHistoryScheduler } from "../models/leave-history-schduler.model";
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { ShedularTranslateService } from '../services/schedular-translate-service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-fm-component-calendar-view',
    templateUrl: 'calendar-view.component.html'
})

export class CalendarViewComponent implements OnInit {
    @Input("calanderList")
    set _calanderList(data: any) {
        if (data) {
            this.leavesList = data;
            this.length = this.leavesList.length;
        }
    }
    @Input('selectedViewType')
    set _selectedViewType(data) {
        if (data) {
            this.selectedViewType = data;
        }
    }
    @Input("isMyLeaves")
    set _isMyLeaves(data: any) {
        if (data) {
            this.isMyLeaves = data;
        }
    }

    @Output() selectedEvent = new EventEmitter<any>();
    @Output() selectedViewIndex = new EventEmitter<any>();

    schedulerModel: LeaveHistoryScheduler[] = [];
    leavesList: LeaveModel[];
    loadingInprogress: boolean;
    length: number;
    isMyLeaves: boolean;
    viewTypes: any;
    selectedViewType: number = 0;
    constructor(
        private datePipe: DatePipe, private messages: MessageService, private cookieService: CookieService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef) { }
    ngOnInit() {
        this.schedulerView();
        this.changeLanguage();
        this.viewTypes = [
            { viewType: 'Day', viewTypeId: 0 },
            { viewType: 'Agenda', viewTypeId: 1 },
            { viewType: 'Week', viewTypeId: 2 },
            { viewType: 'Month', viewTypeId: 3 },
        ]
    }
    schedulerView() {
        if (this.length) {
            this.loadingInprogress = true;
            this.leavesList.forEach((leave: LeaveModel) => {
                let calendarmodel = new LeaveHistoryScheduler();
                calendarmodel.id = leave.id;
                calendarmodel.start = new Date(leave.start);
                calendarmodel.end = new Date(leave.end);
                calendarmodel.title = this.translateService.instant('LEAVESREPORT.LEAVEFROM') + ' ' + this.datePipe.transform(calendarmodel.start, 'medium') + ' ' + this.translateService.instant('LEAVETYPES.TO') + ' ' + this.datePipe.transform(calendarmodel.end, 'medium') + ' ' + this.translateService.instant('LEAVESREPORT.ANDSTATUSIS') + ' ' + this.translateService.instant(leave.leaveStatusName);
                calendarmodel.dataItem = leave.dataItem;
                this.schedulerModel.push(calendarmodel);
            });
            this.loadingInprogress = false;
        }


    }

    public changeLanguage() {
        const svc = <ShedularTranslateService>this.messages;
        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
        if (currentCulture == '' || currentCulture == null || currentCulture == undefined || currentCulture === 'null' || currentCulture === 'undefined') {
            currentCulture = 'en';
        }
        svc.language = currentCulture;
    }

    scheduler_navigate(event) {
        if (event.action.view) {
            let selectedView = this.viewTypes.find(x => x.viewType.toString().toLowerCase() == event.action.view.name.toString().toLowerCase());
            if (selectedView) {
                this.selectedViewIndex.emit(selectedView.viewTypeId);
            }
        }
    }
    onSelect(event) {
        this.selectedEvent.emit(event);
    }

    setHeight() {
        if (this.isMyLeaves) {
            if (this.selectedViewType != 3) {
                return 'profile-calender-height';
            }
            else {
                return 'profile-month-height';
            }
        }
        else {
            if (this.selectedViewType != 3) {
                return 'leaves-calender-height';
            }
            else {
                return 'leaves-month-height';
            }
        }
    }
}