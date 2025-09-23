import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { ProjectGoalsService } from "../../../services/goals.service";
import { ToastrService } from "ngx-toastr";
import { ResourceUsageReportModel } from "../../../models/resourceusagereportmodel";
import { process, State } from "@progress/kendo-data-query";
import { ResourceUsageReportGridComponent } from "./resourceusagereportgrid.component";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent, GridComponent } from "@progress/kendo-angular-grid";
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "resourceusagereport.component",
    templateUrl: "resourceusagereport.component.html",    
    styles: [`
    .resource-usage-report >>> .k-grid .k-grouping-row {
        background-color: rgba(0,0,0,.14) !important;
    }

    .resource-usage-report >>> .k-grid .k-grouping-row td > p,.resource-usage-report >>> .k-grid .k-grouping-row td > span {
        font-weight: 400 !important; 
    }
  `]
})
export class ResourceUsageReportComponent extends CustomAppBaseComponent implements OnInit {

    @Output() getDataResults = new EventEmitter<any>();
    @ViewChild("resourceUsageReportDialog") private resourceUsageReportDialog: TemplateRef<any>;

    validationMessage: string;
    isAnyOperationIsInprogress: boolean = false;
    userIds: string;
    projectIds: string;
    goalIds: string;
    dateFrom: Date;
    dateTo: Date;
    reportData: ResourceUsageReportModel[];
    groupvalues: any;
    public autofit = true;
    noOfHours: number;
    pieChartData: ResourceUsageReportModel[];
    pieData: any = [];
    public gridData: any

    public aggregates: any[] = [
        { field: "userStoryAllocatedHours", aggregate: "sum" },
        { field: "userStoryUsedHours", aggregate: "sum" },
        { field: "userStoryBalanceHours", aggregate: "sum" },
        { field: "resourceUtilizationPercentage", aggregate: "sum" },
        { field: "completionPercentage", aggregate: "sum" },
        { field: "resourceAvailable", aggregate: "sum" },
        { field: "loggedApprovedHours", aggregate: "sum" },
        { field: "estimatedApprovedHours", aggregate: "sum" },
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
    isChartDataIsInprogress: boolean;
    isReportDataIsInprogress: boolean;


    constructor(private projectGoalsService: ProjectGoalsService, private toaster: ToastrService, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    openDialog(gridData): void {
        let dialogId = "app-resourceusagereportdrilldown";
        const dialogRef = this.dialog.open(this.resourceUsageReportDialog, {
            height: 'auto',
            width: 'calc(100vw)',
            disableClose: false,
            id: dialogId,
            data: { gridData: gridData,dialogId: dialogId }
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    getResourceUsageReport(inputmodel) {
        this.isReportDataIsInprogress = true;
        var resourceUsageReportModel = new ResourceUsageReportModel();
        resourceUsageReportModel.projectIds = inputmodel.projectIds;
        resourceUsageReportModel.goalIds = inputmodel.goalIds;
        resourceUsageReportModel.userIds = inputmodel.userIds;
        resourceUsageReportModel.dateFrom = inputmodel.dateFrom;
        resourceUsageReportModel.dateTo = inputmodel.dateTo;
        resourceUsageReportModel.isChartData = false;
        this.projectGoalsService.GetResourceUsageReport(resourceUsageReportModel).subscribe((response: any) => {
            if (response.success == true) {
                this.reportData = response.data;
                if (this.reportData == null) {
                    this.reportData = [];
                }
                else {
                    this.noOfHours = this.reportData[0].noOfHours;
                }
                this.isReportDataIsInprogress = false;
                this.loadItems();
                //this.getChartData(inputmodel);
                this.cdRef.detectChanges();
            }
            else {
                this.cdRef.detectChanges();
                this.isReportDataIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        });
    }

    getResults(inputmodel) {
        this.getResourceUsageReport(inputmodel);
    }

    getChartData(inputmodel) {
        this.pieChartData = [];
        this.isChartDataIsInprogress = true;
        var resourceUsageReportModel = new ResourceUsageReportModel();
        resourceUsageReportModel.projectIds = inputmodel.projectIds;
        resourceUsageReportModel.goalIds = inputmodel.goalIds;
        resourceUsageReportModel.userIds = inputmodel.userIds;
        resourceUsageReportModel.dateFrom = inputmodel.dateFrom;
        resourceUsageReportModel.dateTo = inputmodel.dateTo;
        resourceUsageReportModel.isChartData = true;
        this.projectGoalsService.GetResourceUsageReport(resourceUsageReportModel).subscribe((response: any) => {
            if (response.success == true) {
                this.pieChartData = response.data;
                if (this.pieChartData == null) {
                    this.pieChartData = [];
                    this.pieData = [];
                }
                else {
                    this.pieData = [];
                    var count = 0;
                    this.pieChartData.forEach((item) => {
                        count = count + 1
                        if (item.resourceUtilizationPercentage > 0) {
                            this.pieData.push({ kind: item.userName, share: item.resourceUtilizationPercentage, userId: item.userId })
                        }
                        if (this.pieChartData.length == count) {
                            this.isChartDataIsInprogress = false;
                        }
                    });
                }
                this.isChartDataIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
                this.isChartDataIsInprogress = false;
                this.toaster.error(this.validationMessage);
            }
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

    public labelContent(e: any): string {
        return e.category + ' ( ' + e.value + '% )';
    }

    onClick(rowData) {
        const list = this.reportData.filter(x => x.userId == rowData.dataItem.userId);
        this.openDialog(list)
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
                      $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: ${contentHeight}px !important; padding-left:5px !important;`);                      
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
                  
                      $(optionalParameters['popupViewSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 455px) !important; padding-left:5px !important;`);
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
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 400px) !important; padding-left:5px !important;`);
                    }
                    else if($('app-projects-reports-and-settings .resource-usage-table').length >0){
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 380px) !important; padding-left:5px !important;`);
                    }
                    else if($('custom-apps-listview .resource-usage-table').length >0){
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 380px) !important; padding-left:5px !important;`);
                    }
                    else{
                      $(optionalParameters['individualPageSelector'] + ' .gridster-noset .k-grid-content').css("cssText", `height: calc(100vh - 320px) !important; padding-left:5px !important;`);                      
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
    
    exportToExcel(grid: GridComponent): void {
        this.state.take = this.reportData.length;
        this.gridData = process(this.reportData,this.state);
        this.cdRef.detectChanges();
        grid.saveAsExcel();
        this.state.take = 20;
        this.gridData = process(this.reportData,this.state);
        this.cdRef.detectChanges();
    }

    getAggrigates(getAggrigates){
     console.log(getAggrigates);
    }

}
