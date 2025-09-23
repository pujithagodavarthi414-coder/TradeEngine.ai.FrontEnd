
import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from "@angular/core";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { ProjectGoalsService } from "../../../services/goals.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ProjectUsageReportModel } from "../../../models/projectusagereportmodel";
import { process, State } from "@progress/kendo-data-query";
import { ProjectUsageReportDrillDownComponent } from "./projectusagereportdrilldown.component";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-projectusagereport",
    templateUrl: "projectusagereport.component.html",
    styles: [`
    .project-usage-report >>> .k-grid .k-grouping-row {
        background-color: rgba(0,0,0,.14) !important;
    }

    .project-usage-report >>> .k-grid .k-grouping-row td > p,.project-usage-report >>> .k-grid .k-grouping-row td > span,
    .project-usage-report >>> .k-grid .k-grouping-row td {
        font-weight: 400 !important; 
    }
    .project-usage-report >>> .k-grid .k-grouping-row .k-icon {
     margin-left : -6px !important;   
    }
  `]
})
export class ProjectUsageReportComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild('myTable') table: any;
    @ViewChild("projectUsageReportDialog") private projectUsageReportDialog: TemplateRef<any>;

    loading: boolean = false;
    loadingIndicator: boolean = false;
    reportData: ProjectUsageReportModel[];

    displayUi: string;
    isProjectReportDataIsInprogress: boolean;
    validationMessage: any;

    public aggregates: any[] = [
        { field: "goalEstimatedHours", aggregate: "sum" },
        { field: "goalAllocatedHours", aggregate: "sum" },
        { field: "goalUsedHours", aggregate: "sum" },
        { field: "goalNonAllocatedHours", aggregate: "sum" },
        { field: "goalPendingHours", aggregate: "sum" },
    ];

    public state: State = {
        skip: 0,
        take: 10,
        group: [
            { field: "projectName", aggregates: this.aggregates }
        ]
    };
    gridData: any;

    constructor(private projectGoalsService: ProjectGoalsService, private toaster: ToastrService, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    openProjectUsageReportDetails(rowData, isGoal) {
        var list = [];
        if (isGoal) {
            list = this.reportData.filter(x => x.goalId == rowData.goalId);
        }
        else {
            list = this.reportData.filter(x => x.projectId == rowData.projectId);
        }

        this.openDialog(list);
    }

    toggleExpandGroup(group) {
        console.log('Toggled Expand Group!', group);
        this.table.groupHeader.toggleExpandGroup(group);
    }

    display(date1: any, date2: any) {
        if (date1.substring(0, 10) === date2.substring(0, 10)) {
            this.displayUi = 'block';
        }
        else {
            this.displayUi = 'none';
        }
    }

    getProjectUsageReport(inputmodel) {
        this.isProjectReportDataIsInprogress = true;
        var resourceUsageReportModel = new ProjectUsageReportModel();
        resourceUsageReportModel.projectIds = inputmodel.projectIds;
        resourceUsageReportModel.goalIds = inputmodel.goalIds;
        resourceUsageReportModel.userIds = inputmodel.userIds;
        resourceUsageReportModel.dateFrom = inputmodel.dateFrom;
        resourceUsageReportModel.dateTo = inputmodel.dateTo;
        resourceUsageReportModel.isChartData = false;
        this.projectGoalsService.GetProjectUsageReport(resourceUsageReportModel).subscribe((response: any) => {
            if (response.success == true) {
                this.reportData = response.data;
                if (this.reportData == null) {
                    this.reportData = [];
                }
                this.isProjectReportDataIsInprogress = false;
                this.cdRef.detectChanges();
                this.loadItems();
            }
            else {
                this.isProjectReportDataIsInprogress = false;
                this.cdRef.detectChanges();
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        });
    }

    getResults(inputmodel) {
        this.getProjectUsageReport(inputmodel);
    }

    openDialog(gridData): void {
        let dialogId = "app-projectusagereportdrilldown";
        const dialogRef = this.dialog.open(this.projectUsageReportDialog, {
            height: 'auto',
            width: 'calc(100vw)',
            disableClose: false,
            id: dialogId,
            data: { gridData: gridData, dialogId: dialogId }
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    public dataStateChange(state: DataStateChangeEvent): void {
        if (state && state.group) {
            state.group.map(group => (group.aggregates = this.aggregates));
        }

        this.state = state;

        this.gridData = process(this.reportData, this.state);
    }

    loadItems() {
        this.gridData = process(this.reportData, this.state);
    }

    fitContent(optionalParameters : any) {
        var interval;
        var count = 0;

        if(optionalParameters['gridsterView']) {       
          
           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                  if ($(optionalParameters['gridsterViewSelector'] + ' .gridster-noset .k-grid-content').length > 0) {
                                                               
                      var contentHeight = $(optionalParameters['gridsterViewSelector']).height() - 290;                                     
                      $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: ${contentHeight}px !important; padding-left:1px !important;`);                      
                      $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset .k-grid-content').addClass('widget-scroll'); 
                  }
        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);

        } else if (optionalParameters['popupView']) {     
           
           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                  if ($(optionalParameters['popupViewSelector'] + ' .gridster-noset .k-grid-content').length > 0) {
                  
                      $(optionalParameters['popupViewSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 455px) !important; padding-left:0px !important;`);
                      $(optionalParameters['popupViewSelector'] + ' .gridster-noset .k-grid-content').addClass('widget-scroll');                      
                      clearInterval(interval);
                  }
        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);

        } else if (optionalParameters['individualPageView']) {      
           
           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                  if ($(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').length > 0) {

                    if(optionalParameters['isAppStoreUrl']){                        
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 400px) !important; padding-left:0px !important;`);
                    }
                    else if($('app-projects-reports-and-settings .project-usage-table').length >0){
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 380px) !important; padding-left:0px !important;`);
                    }
                    else if($('custom-apps-listview .project-usage-table').length >0){
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 380px) !important; padding-left:0px !important;`);
                    }
                    else{
                      $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 320px) !important; padding-left:0px !important;`);                      
                    }

                    $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').addClass('widget-scroll');
                    
                    clearInterval(interval);
                  }
        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);
        }
    }


}