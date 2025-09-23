
import { Component, Inject, Input } from "@angular/core";
import { MAT_DIALOG_DATA , MatDialogRef, MatDialog} from "@angular/material/dialog";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process,State } from "@progress/kendo-data-query";
import { ResourceUsageReportModel } from "../../../models/resourceusagereportmodel";

export interface DialogData {
    gridData: ResourceUsageReportModel[];
}

@Component({
    selector: "app-resourceusagereportdrilldown",
    templateUrl: "resourceusagereportgrid.component.html"
})
export class ResourceUsageReportGridComponent {
    noOfHours: number;
    gridData: any;
    userName: string;
    currentDialogId: any;
    currentDialog: MatDialogRef<any, any>;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.data = data[0];
            this.currentDialogId = this.data.dialogId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.gridData = process(this.data.gridData, this.state);
            this.userName =  this.data.gridData[0].userName;
            this.noOfHours = this.data.gridData[0].noOfHours;
        }

        if(this.data.gridData == null ||  this.data.gridData.length == 0){
            this.data.gridData = [];
        }
    }

    constructor(public dialog : MatDialog,public dialogRef: MatDialogRef<ResourceUsageReportGridComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
       
    }
    
 
    public aggregates: any[] = [
        { field: "userStoryAllocatedHours", aggregate: "sum" },
        { field: "userStoryUsedHours", aggregate: "sum" },
        { field: "userStoryBalanceHours", aggregate: "sum" },
        { field: "resourceUtilizationPercentage", aggregate: "sum" },
        { field: "completionPercentage", aggregate: "sum" },
        { field: "resourceAvailable", aggregate: "sum" }
    ];

    public state: State = {
        skip: 0,
        take: 10,
        group: [
            { field: "userName", aggregates: this.aggregates },
            { field: "projectName", aggregates: this.aggregates },
            { field: "goalName", aggregates: this.aggregates }
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