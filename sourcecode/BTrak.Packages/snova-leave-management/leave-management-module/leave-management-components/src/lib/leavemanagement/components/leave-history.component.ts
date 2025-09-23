import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";

import { LeaveModel } from "../models/leave-model";
import { ToastrService } from "ngx-toastr";
import { LeaveHistoryModel } from "../models/leave-history-model";
import { AppBaseComponent } from "../../globaldependencies/components/componentbase";
import { LeavesService } from "../services/leaves-service";

@Component({
    selector: "app-fm-component-leave-history",
    templateUrl: `leave-history.component.html`
})

export class LeaveHistoryComponent extends AppBaseComponent implements OnInit {
    @Output() closeHistoryWindow = new EventEmitter<any>();

    @Input("leaveApplicationParamId")
    set _leaveApplicationParamId(data: any) {
        this.leaveApplicationId = data;
        if (this.leaveApplicationId) {
            this.getLeavesHistory();
        }
    }

    leaveHistory: LeaveHistoryModel;
    leaveApplicationId: string;
    isAnyOperationInProgress: boolean;
    leaveStatusName: string;
    constructor(private cdRef: ChangeDetectorRef, private leaveManagementService: LeavesService, private toaster: ToastrService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();

    }

    getLeavesHistory() {
        this.isAnyOperationInProgress = true;
        const leaveHistorySearchModel = new LeaveModel();
        leaveHistorySearchModel.leaveApplicationId = this.leaveApplicationId;
        this.leaveManagementService.getLeaveHistory(leaveHistorySearchModel).subscribe((response: any) => {
            if (response.success) {
                this.leaveHistory = response.data;
                this.leaveStatusName = this.leaveHistory[0].leaveStatusName;
                this.isAnyOperationInProgress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.toaster.error(response.apiResponseMessage[0].message);
                this.isAnyOperationInProgress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    closeLeaveHistoryWindow() {
        this.closeHistoryWindow.emit();
    }
}
