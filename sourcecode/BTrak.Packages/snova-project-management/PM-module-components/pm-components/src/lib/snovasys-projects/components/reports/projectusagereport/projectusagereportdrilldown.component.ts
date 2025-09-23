
import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA , MatDialogRef, MatDialog} from "@angular/material/dialog";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process,State } from "@progress/kendo-data-query";
import { ProjectUsageReportModel } from "../../../models/projectusagereportmodel";
import { ResourceUsageReportModel } from "../../../models/resourceusagereportmodel";

export interface DialogData {
    gridData: ProjectUsageReportModel[];
}

@Component({
    selector: "app-projectusagereportdrilldown",
    templateUrl: "projectusagereportdrilldown.component.html",
    styles: [`
    .project-usage-report >>> .k-grid .k-grouping-row {
        background-color: rgba(0,0,0,.14) !important;
    }

    .project-usage-report >>> .k-grid .k-grouping-row td > p,.project-usage-report >>> .k-grid .k-grouping-row td > span,
    .project-usage-report >>> .k-grid .k-grouping-row td  {
        font-weight: 400 !important; 
    }
    `]
})
export class ProjectUsageReportDrillDownComponent {
    gridData: any;
    projectName: string;
    currentDialogId: any;
    currentDialog: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.data = data[0];
            this.currentDialogId = this.data.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.gridData = process(this.data.gridData, this.state);
            this.projectName =  this.data.gridData[0].projectName;
        }
        if(this.data.gridData == null ||  this.data.gridData.length == 0){
            this.data.gridData = [];
        }
    }

    constructor(public dialog : MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
 
    public aggregates: any[] = [
        { field: "goalEstimatedHours", aggregate: "sum" },
        { field: "goalAllocatedHours", aggregate: "sum" },
        { field: "goalUsedHours", aggregate: "sum" },
        { field: "goalNonAllocatedHours", aggregate: "sum" },
        { field: "goalPendingHours", aggregate: "sum" }
    ];

    public state: State = {
        skip: 0,
        take: 10,
        group: [
            { field: "projectName", aggregates: this.aggregates }
        ]
    };

    public dataStateChange(state: DataStateChangeEvent): void {
        if (state && state.group) {
            state.group.map(group => (group.aggregates = this.aggregates));
        }

        this.state = state;

        this.gridData = process(this.data.gridData, this.state);
    }

    onNoClick(): void {
        if(this.currentDialog) this.currentDialog.close();
    }
}