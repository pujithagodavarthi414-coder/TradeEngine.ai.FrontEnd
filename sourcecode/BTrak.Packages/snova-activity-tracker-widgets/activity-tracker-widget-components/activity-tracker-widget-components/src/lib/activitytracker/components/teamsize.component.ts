import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { teamMembersModel } from "../models/Teammembers.model";
import { ActivityTrackerService } from "../services/activitytracker-services";

@Component({
    selector: "app-fm-component-teammembers",
    templateUrl: "teamsize.component.html",
})

export class TeamsizeComponent extends CustomAppBaseComponent implements OnInit {
    teammembersCount: number = 0;

    constructor(private timeUsageService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.teamMember();
    }

    teamMember() {
        var teammember = new teamMembersModel();
        this.timeUsageService.teamMember(teammember).subscribe((response: any) => {
            if (response.success == true) {
                this.teammembersCount = response.data;
            } else {
                this.teammembersCount = 0;
            }
            this.cdRef.detectChanges();
        });
    }
}