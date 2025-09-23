import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { DatePipe } from "@angular/common";
import { LeaveHistoryScheduler } from '../models/leave-history-schduler.model';
import { LeaveModel } from '../models/leave.model';
import '../../globaldependencies/helpers/fontawesome-icons';

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
    constructor(private datePipe: DatePipe){}
    ngOnInit() {
        this.schedulerView();
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
                calendarmodel.title = 'Leave from '+ this.datePipe.transform(calendarmodel.start,'medium') + ' to ' + this.datePipe.transform(calendarmodel.end,'medium') + ' and status is ' + leave.leaveStatusName;
                calendarmodel.dataItem = leave.dataItem;
                this.schedulerModel.push(calendarmodel);
            });
            this.loadingInprogress = false;
        }

       
    }
    
    scheduler_navigate(event) {
        if (event.action.view) {
          let selectedView = this.viewTypes.find(x => x.viewType.toString().toLowerCase() == event.action.view.name.toString().toLowerCase());
          if(selectedView)
          {
          this.selectedViewIndex.emit(selectedView.viewTypeId);
          }
        }
      }
    onSelect(event) {
        this.selectedEvent.emit(event);
    }
}