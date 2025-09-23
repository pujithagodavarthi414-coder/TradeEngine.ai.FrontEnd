import { Component, OnInit } from "@angular/core";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { ToastrService } from "ngx-toastr";
import { LeaveHistoryScheduler } from "../models/leave-history-schduler.model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardService } from '../services/dashboard.service';
import { LeaveHistoryModel } from '../models/leave-history.model';
import { LeaveModel } from '../models/leave.model';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-profile-component-profilepage",
    templateUrl: "leave-history-scheduler.component.html"
})

export class LeaveHistorySchedulerComponent extends CustomAppBaseComponent implements OnInit {

    leaveHistorySchedulerEventModel: LeaveHistoryScheduler[] = [];
    leaveHistoryModel: LeaveHistoryModel[];
    leavesDataLength: number;
    leave: SchedulerEvent[];
    loadingInProgress: boolean;

    constructor(
        private dashboardService: DashboardService, private toaster: ToastrService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getLeavesHistory();
    }

    getLeavesHistory() {
        this.loadingInProgress = true;
        const leaveHistorySearchModel = new LeaveModel();
        this.dashboardService.getLeaveHistory(leaveHistorySearchModel).subscribe((response: any) => {
            if (response.success) {
                this.leaveHistoryModel = response.data;
                this.leavesDataLength = response.data.length;
                this.leaveHistoryModel.forEach((element: LeaveHistoryModel) => {
                    const leaveHistorySchedulerEvent = new LeaveHistoryScheduler();
                    leaveHistorySchedulerEvent.id = element.leaveHistoryId;
                    leaveHistorySchedulerEvent.title = element.description;
                    leaveHistorySchedulerEvent.start = new Date(element.createdDateTime);
                    leaveHistorySchedulerEvent.end = new Date(element.endDateTime);
                    leaveHistorySchedulerEvent.dataItem = element;
                    this.leaveHistorySchedulerEventModel.push(leaveHistorySchedulerEvent);
                });
            } else {
                this.toaster.error(response.apiResponseMessages[0].message);
            }
            this.loadingInProgress = false;
        });
    }
}