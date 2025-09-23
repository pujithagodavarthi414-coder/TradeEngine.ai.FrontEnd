import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { CookieService } from 'ngx-cookie-service';

import { ToastrService } from 'ngx-toastr';

import { Store, select } from "@ngrx/store";
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { GoalLevelReportsService } from '../../../services/reports.service';
import {SoftLabelConfigurationModel} from "../../../../globaldependencies/models/softlabels-models";
import {CustomAppBaseComponent} from "../../../../globaldependencies/components/componentbase"
import {State} from "../../../store/reducers/index";
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
@Component({
  selector: 'app-devoloper-goal-userstories',
  templateUrl: './devoloper-goal-userstories.component.html',
  styleUrls: ['./devoloper-goal-userstories.component.scss']
})

export class DevoloperGoalUserstoriesComponent extends CustomAppBaseComponent  implements OnInit {
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  goal;
  anyOperationInProgress: boolean;
  modiefied: any[];
  validationMessage: any;
  @Input('goal')
  set _goalId(data) {
    this.goal = data.goalId;
    this.getalluserstories();
  }
  devoloperGoalUserStories: Object[];
  titleSettings3: Object = {
    text: '',
    textStyle: {
      text: 'Spent time report of all user stories in a goal for the selected developer',
      size: '15px',
      fontWeight: '500',
      fontStyle: 'Normal',
      fontFamily: 'Segoe UI'
    }
  };
  devoloperGoalUserStoriesxAxis: Object = {
    labels: [],
  };
  devoloperGoalUserStoriesyAxis: Object = {
    labels: [],
    multiLevelLabels: [
      {
        border: { type: 'Rectangle', color: '#FFFFFF' },
        categories: []
      },
    ]
  };
  public cellSettings3: Object = {
    border: {
      width: 1,
      radius: 4,
      color: 'white'
    }
  };
  public paletteSettings3: Object = {
    palette: [
      { value: 0, color: '#ff141c', label: '' },
      { value: 1, color: '#04fe02', label: '' },
      { value: 2, color: '#b7b7b7', label: '' },
    ],
    type: 'Fixed'
  };
  selectedUserId: any;

  constructor(private cookieService: CookieService, private route: ActivatedRoute, private userService: UserService, private goalLevelReportsService: GoalLevelReportsService,private toastr: ToastrService
    ,private store: Store<State>) {
    super();
    this.route.params.subscribe(routeParams => {
      if (routeParams.id)
        this.selectedUserId = routeParams.id;
      else
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    })
  }

  ngOnInit() {
    this.getSoftLabelConfigurations();
    super.ngOnInit();
  }


  getSoftLabelConfigurations() {
   this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getalluserstories() {
    this.anyOperationInProgress = true;
    this.goalLevelReportsService.getDeveloperSpentTimeReportOnGoal(this.goal).subscribe((Response: any) => {
      let success = Response.success;
      if (success) {
      
      this.devoloperGoalUserStories = Response.data.summaryValue[0];
      let modiefied = [];
      if (Response.data.summaryValue[0].length != 0) {
        Response.data.userStoryName[0].forEach((element, index) => {
          let test = { start: null, end: null, text: '' };
          test.start = index;
          test.end = index;
          test.text = element;
          modiefied.push(test);
        });
      }
      this.modiefied = modiefied;
      this.devoloperGoalUserStoriesxAxis = {
        labelRotation: 45,
        labels: Response.data.date[0],
      };
      this.devoloperGoalUserStoriesyAxis = {
        labels: Response.data.developerName[0],
        multiLevelLabels: [
          {
            alignment: 'Start',
            border: { type: 'Rectangle', color: '#ffff' },
            categories: this.modiefied
          },
        ]
      };
    }
    else {
      this.validationMessage = Response.apiResponseMessages[0].message;
      this.toastr.error("", this.validationMessage);
  }
    
      this.anyOperationInProgress = false;
    });
  }

}
