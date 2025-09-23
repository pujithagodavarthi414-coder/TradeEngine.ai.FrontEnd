import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { TimesheetFeed } from '../models/timesheetfeed';
import { TimesheetService } from '../services/timesheet-service.service';

@Component({
  selector: 'app-updatefeedtimesheet',
  templateUrl: './update-feed-timesheet.component.html'
})

export class UpdatefeedtimesheetComponent extends CustomAppBaseComponent implements OnInit {
  @Input("getFeedTimeHistoryCall")
  set getFeedTimeHistoryCall(data: boolean) {
    this.getFeedTimeHistory();
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;

  softLabels: SoftLabelConfigurationModel[];

  timeSheetFeedData: TimesheetFeed[];
  anyOperationInProgress: boolean;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;

  constructor(private timesheetService: TimesheetService, public snackBar: MatSnackBar, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getFeedTimeHistory();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  refreshTimeSheetData(data: string): any {
    if (data == '') {
      return;
    }
    var json = '[{"UserId":"c8e67425-1725-4436-948c-ce476352ab7c","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Praveen Baruri</b> stopped working for the day.","FieldName":null,"UserName":"Praveen Baruri","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 16:12:32"},{"UserId":"8a7e8dbf-48dd-4d49-a898-6fcf29f11835","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Vidya Udatha</b> stopped working for the day.","FieldName":null,"UserName":"Vidya Udatha","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 16:01:44"},{"UserId":"a6081d59-fe66-418f-8ed9-677dc0491dc9","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Saajid Syed</b> started break.","FieldName":null,"UserName":"Saajid Syed","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 14:50:36"},{"UserId":"cee1b36f-b608-43e3-8733-79e181842680","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Suman Kalyan Kandrapeti</b> stopped working for the day.","FieldName":null,"UserName":"Suman Kalyan Kandrapeti","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 14:43:41"},{"UserId":"0a299914-2871-4271-94b2-db8959d45f23","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Manoj Gurram</b> started break.","FieldName":null,"UserName":"Manoj Gurram","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 13:07:03"},{"UserId":"453e7e97-0e13-4a89-8255-436569191914","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Pujitha Godavarthi</b> meal break ended.","FieldName":null,"UserName":"Pujitha Godavarthi","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 09:42:28"},{"UserId":"40264c16-2a94-472f-8c2b-bc2ce37a325f","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Sowjanya Gattupalli</b> meal break ended.","FieldName":null,"UserName":"Sowjanya Gattupalli","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 09:34:51"},{"UserId":"e50fffca-15fb-4f55-9faf-9ef4d6237ede","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Sai Praneeth Mamidi</b> meal break ended.","FieldName":null,"UserName":"Sai Praneeth Mamidi","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 09:04:28"},{"UserId":"d1272dde-5e0f-44d0-abca-17e97ec5ac9d","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Anupam Sai Kumar Vuyyuru</b> meal break ended.","FieldName":null,"UserName":"Anupam Sai Kumar Vuyyuru","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 08:56:47"},{"UserId":"248006c1-4342-4275-b7f1-1deaff08f21e","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Divya Goli</b> meal break started.","FieldName":null,"UserName":"Divya Goli","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 08:51:12"},{"UserId":"565fb4eb-e90e-485a-b1a3-389e3f959382","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Sudha Goli</b> meal break started.","FieldName":null,"UserName":"Sudha Goli","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 08:51:05"},{"UserId":"cee1b36f-b608-43e3-8733-79e181842680","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Suman Kalyan Kandrapeti</b> meal break ended.","FieldName":null,"UserName":"Suman Kalyan Kandrapeti","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 08:37:42"},{"UserId":"c8e67425-1725-4436-948c-ce476352ab7c","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Praveen Baruri</b> meal break started.","FieldName":null,"UserName":"Praveen Baruri","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 08:05:36"},{"UserId":"7ac2737e-7b4f-45c0-aef4-133502bf8d03","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Venkata Supriya Golla</b> meal break started.","FieldName":null,"UserName":"Venkata Supriya Golla","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 07:55:10"},{"UserId":"e50fffca-15fb-4f55-9faf-9ef4d6237ede","FeatureId":"eae83d12-a1dd-4d88-b140-d971cb809a31","UserStoryId":null,"Date":"0001-01-01T00:00:00","Description":"<b>Sai Praneeth Mamidi</b> meal break started.","FieldName":null,"UserName":"Sai Praneeth Mamidi","CreatedDate":"0001-01-01T00:00:00","CreatedDateTime":"05 - Nov - 2018 07:55:08"}]';
    var data1 = JSON.parse(json);
    this.timeSheetFeedData = JSON.parse(JSON.stringify(data));
  }

  getFeedTimeHistory() {
    this.anyOperationInProgress = true;
    this.timesheetService.getFeedTimeHistory().subscribe((responseData: any) => {
      this.timeSheetFeedData = responseData.data;
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }
}