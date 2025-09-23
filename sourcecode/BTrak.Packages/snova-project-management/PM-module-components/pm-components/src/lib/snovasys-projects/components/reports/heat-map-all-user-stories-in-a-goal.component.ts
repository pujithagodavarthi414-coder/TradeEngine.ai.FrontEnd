import { Component, OnInit, Input } from '@angular/core';
import { Store } from "@ngrx/store";


import { ToastrService } from 'ngx-toastr';

import { GoalLevelReportsService } from '../../services/reports.service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

@Component({
    selector: 'app-dashBoard-component-HeatmapAllUserStories',
    template: `  
    <app-common-message-box *ngIf="!(canAccess_feature_QaPerformance)"
  textToDisplay="{{'QAPERFORMANCE.PERMISSSION' | translate}}">
</app-common-message-box>
<div class="p-0" *ngIf="(canAccess_feature_QaPerformance)">
    <mat-progress-bar color="primary" mode="indeterminate" *ngIf="anyOperationInProgress">  </mat-progress-bar>
    <ejs-heatmap id='container1' style="display:block;"  [dataSource]='dataSource' [xAxis]='xAxis' [yAxis]='yAxis'
    [titleSettings]='titleSettings'  [paletteSettings]='paletteSettings' [showTooltip]='showTooltip' [legendSettings]='legendSettings'
     [cellSettings]='cellSettings'>
     </ejs-heatmap>
     </div>
    `
})

export class HeatmapAllUserStories extends CustomAppBaseComponent implements OnInit {
    goal;
    @Input('goal')
    set _goal(data) {
        this.goal = data.goalId;
        this.getalluserstories()
    }

    allUserStories: any;
    dataSource: Object[];
    validationMessage: string;
    anyOperationInProgress: boolean;
    titleSettings: Object = {
        text: 'Userstory Daily Status',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal',
            fontFamily: 'Segoe UI'
        }
    };
    yAxis: Object = [];
    xAxis: Object = [];
    public legendSettings: Object = {
        visible: true,
    };
    public cellSettings: Object = {
        showLabel: false,
    };
    public showTooltip: boolean = true;

    public paletteSettings: Object = {
        palette: [
            { value: 0, color: '#b7b7b7', label: 'Not Started' },
            { value: 1, color: '#04fefe', label: 'Analysis Completed/New' },
            { value: 2, color: '#33b2ff', label: 'DevInProgress/InProgress' },
            { value: 3, color: '#70ad47', label: 'DevCompleted/Resolved/Completed' },
            { value: 4, color: '#36c2c4', label: 'Deployed' },
            { value: 5, color: '#ffd966', label: 'QA Approved/Verified' },
            { value: 6, color: '#04fe02', label: 'SignedOff' },
            { value: 8, color: '#ead1dd', label: 'Blocked' },
        ],
        type: 'Fixed'
    };

    constructor(private goalLevelReportsService: GoalLevelReportsService, private toastr: ToastrService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getalluserstories() {
        this.anyOperationInProgress = true;
        this.goalLevelReportsService.getalluserstories(this.goal).subscribe((Response: any) => {
            let success = Response.success;
            if (success) {
                this.allUserStories = Response.data;
                if(Response.data.userStoryName.length || Response.data.dates.length ) 
                this.dataSource = Response.data.summaryValue;
                if(Response.data.dates.length)
                {
                this.xAxis = {
                    valueType: "Category",
                    labels: Response.data.dates,
                };
            }
            if(Response.data.userStoryName.length)
            {
                this.yAxis = {
                    valueType: "Category",
                    labels: Response.data.userStoryName,
                };
            }
            } else {
                this.validationMessage = Response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.anyOperationInProgress = false;
        });
    }

}
