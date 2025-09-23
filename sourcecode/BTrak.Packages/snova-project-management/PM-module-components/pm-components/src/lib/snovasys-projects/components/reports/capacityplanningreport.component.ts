import { Component, ViewChild } from '@angular/core';
import { process, State } from "@progress/kendo-data-query";
import { ChartComponent, SeriesLabels } from "@progress/kendo-angular-charts";
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ProjectService } from '@snovasys/snova-testrepo';
import { ToastrService } from 'ngx-toastr';
import { CapacityPlanningReportModel } from '../../models/capacityplanningreportmodel';
import { ProjectGoalsService } from '../../services/goals.service';

@Component({
  selector: 'capacity-planning-report',
  templateUrl: "capacityplanningreport.component.html"
})
export class CapacityPlanningReportComponent {

  @ViewChild("chart") private chart: ChartComponent;
  public gridView: GridDataResult;

  // capacityPlanningReportList: any = []
  validationMessage: string;
  isAnyOperationIsInprogress: boolean = false;
  public seriesLabels: SeriesLabels = {
    visible: true, // Note that visible defaults to false
    padding: 3,
    font: "bold 16px Arial, sans-serif"
  };

  public state: State = {
    skip: 0,
    take: 10,

  };

  public autofit = true;
  public data: any[] = [{
    kind: 'Solar', share: 0.052
  }, {
    kind: 'Wind', share: 0.225
  }, {
    kind: 'Other', share: 0.192
  }, {
    kind: 'Hydroelectric', share: 0.175
  }, {
    kind: 'Nuclear', share: 0.238
  }, {
    kind: 'Coal', share: 0.118
  }];

  public capacityPlanningReportList: any[] = [
    {
      projectName: 'Snova',
      goalName: "Snova goal",
      allocatedHours: "3",
      usedHours: "33",
      futureHours: "33"
    },
  ];
  userId: string;
  dateFrom: Date;
  dateTo: Date;

  public labelContent(e: any): string {
    return e.category;
  }


  constructor(private projectGoalsService: ProjectGoalsService,private toaster: ToastrService){
  }

  ngOnInit() {
    this.loadItems();
    this.getCapacityPlanningReport();
  }

  getCapacityPlanningReport(){
    this.isAnyOperationIsInprogress = true;
    var capacityPlanningReportModel = new CapacityPlanningReportModel();
    capacityPlanningReportModel.userId = this.userId;
    capacityPlanningReportModel.dateFrom = this.dateFrom;
    capacityPlanningReportModel.dateTo = this.dateTo;

    this.projectGoalsService.GetCapacityPlanningReport(capacityPlanningReportModel).subscribe((response: any) => {
      if (response.success == true) {
        this.data = response.data;
        this.isAnyOperationIsInprogress = false;
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
        this.toaster.error(this.validationMessage);
      }
    });
  }

  loadItems() {
    this.gridView = {
      data: this.capacityPlanningReportList.slice(this.state.skip, this.state.skip + this.state.take),
      total: this.capacityPlanningReportList.length
    };
  }
}

