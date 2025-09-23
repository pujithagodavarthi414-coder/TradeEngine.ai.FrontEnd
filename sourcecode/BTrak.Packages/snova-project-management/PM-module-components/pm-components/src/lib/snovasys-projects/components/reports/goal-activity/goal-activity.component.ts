import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Store } from "@ngrx/store";
import { GoalLevelReportsService } from '../../../services/reports.service';
import {SoftLabelConfigurationModel} from "../../../../globaldependencies/models/softlabels-models";
import {CustomAppBaseComponent} from "../../../../globaldependencies/components/componentbase"
import {State} from "../../../store/reducers/index";
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
@Component({
  selector: 'app-goal-activity',
  templateUrl: './goal-activity.component.html',
  styleUrls: ['./goal-activity.component.scss']
})

export class GoalActivityComponent extends CustomAppBaseComponent  implements OnInit {

  goal;
  softLabels: SoftLabelConfigurationModel[];
  goalActivityData:any[];
  dataSource: Object[];
  anyOperationInProgress: boolean;
  titleSettings: Object = {
    text: 'All User Stories In A Goal',
    textStyle: {
      size: '15px',
      fontWeight: '500',
      fontStyle: 'Normal',
      fontFamily: 'Segoe UI'
    }
  };
  @ViewChild('myTable') table: any;
  validationMessage: string = '';
  yAxis: Object = [];
  xAxis: Object = [];
  @Input('goal')
  set _goal(data) {
    this.goal = data.goalId;
    this.getalluserstories();
  }
  public legendSettings: Object = {
    visible: true,
  };
  public cellSettings: Object = {
    showLabel: false,
  };
  public showTooltip: boolean = true;

  constructor(private goalLevelReportsService: GoalLevelReportsService, private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
 super.ngOnInit();
 this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  getalluserstories() {

    this.anyOperationInProgress = true;
    this.goalLevelReportsService.getGoalActivity(this.goal).subscribe((Response: any) => {
      let success = Response.success;
      if (success) {
        this.goalActivityData =Response.data;
        this.anyOperationInProgress = false;
      }
      else {
        this.validationMessage = Response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }

    });

  }

  

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }  

  // onDetailToggle(event) {
  //   console.log('Detail Toggled', event);
  // }

  // toggleExpandRow(row) {
  //   console.log('Toggled Expand Row!', row);
  //   this.table.rowDetail.toggleExpandRow(row);
  // }


}
