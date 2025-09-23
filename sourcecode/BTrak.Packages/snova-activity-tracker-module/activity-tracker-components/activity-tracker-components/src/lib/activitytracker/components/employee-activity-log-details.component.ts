import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
import { OnInit, Inject, Component } from "@angular/core";
import { TimeUsageService } from "../services/time-usage.service";
import { TrackedInformationOfUserStoryModel } from "../models/trackedinformation-of-userstory.model";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
  selector: "app-view-activitytracker-employee-activity-log",
  templateUrl: "employee-activity-log-details.component.html",
})


export class EmployeeActivityLogDetailsComponent extends CustomAppBaseComponent implements OnInit {
  public selectedDate: Date;
  public events: SchedulerEvent[];
  // = [{
  //   id: 1,
  //   title: "track1",
  //   start: new Date("2020-03-24T09:00:00"),
  //   end: new Date("2020-03-24T12:30:00")
  // }, {
  //   id: 2,
  //   title: "Lunch",
  //   start: new Date("2020-03-24T12:31:00"),
  //   end: new Date("2020-03-24T13:30:00")
  // }, {
  //   id: 3,
  //   title: "track2",
  //   start: new Date("2020-03-24T13:31:00"),
  //   end: new Date("2020-03-24T16:30:00")
  // }, {
  //   id: 4,
  //   title: "Break",
  //   start: new Date("2020-03-24T16:31:00"),
  //   end: new Date("2020-03-24T17:00:00")
  // }, {
  //   id: 5,
  //   title: "track3",
  //   start: new Date("2020-03-24T17:01:00"),
  //   end: new Date("2020-03-24T18:30:00")
  // }];
  public maxDate: Date;
  // = [{
  //     id: 1,
  //     title: "Breakfast",
  //     start: new Date("2020-03-19T09:00:00"),
  //     end: new Date("2020-03-19T09:30:00")
  // },{
  //     id: 2,
  //     title: "Breakfast",
  //     start: new Date("2020-03-19T10:00:00"),
  //     end: new Date("2020-03-19T10:30:00")
  // }];

  loggedUser: string;

  trackedInformationOfUserStory: TrackedInformationOfUserStoryModel = new TrackedInformationOfUserStoryModel();

  ngOnInit() {
    super.ngOnInit();
    this.maxDate = new Date();
    this.getLoggedInUser();
    // this.getTrackedInformationOfUserStory();
  }

  constructor(@Inject(TimeUsageService) private timeUsageService: TimeUsageService) {
    super();
  }

  dateChange(value) {
    this.selectedDate = value.selectedDate;
    this.trackedInformationOfUserStory.DateFrom = value.dateRange.start;
    this.trackedInformationOfUserStory.DateTo = value.dateRange.end;
    this.getInformation();
    // this.trackedInformationOfUserStory.UserId = this.loggedUser;
    // this.getTrackedInformationOfUserStory();
  }

  getInformation() {
    this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
      this.loggedUser = responseData.data.id;
      this.trackedInformationOfUserStory.UserId = this.loggedUser;
      this.getTrackedInformationOfUserStory();
    })
  }

  getTrackedInformationOfUserStory() {
    this.timeUsageService.getTrackedInformationOfUserStory(this.trackedInformationOfUserStory).subscribe((responseData: any) => {
      if (responseData.success == true) {
        //  alert("success");
        //  alert(responseData.data);
        let data = JSON.parse(responseData.data.activityInformation);

        let userStoryData = JSON.parse(responseData.data.userStoryInfo);
        // var trackedInfo = data.activityInformation;
        // var userStoryLog = data.userStoryInfo;
        let result = [];
        data.forEach((item, index) => {
          const trackInfo = item.TrackedInfo.map((items, idx) => {
            // if( items.BreakType != null && items.BreakType != undefined) {
            return {
              id: idx + 1,
              title: items.BreakType != null && items.BreakType != undefined ? items.BreakType : "Tracked",
              start: new Date(items.StartTime),
              end: new Date(items.EndTime)
            }
          })
          result = [...result, ...trackInfo];
          // result.concat(trackInfo);
        })

        userStoryData.forEach((item, index) => {
          const userStoryInfo = item.UserStory.map((items, idx) => {
            return {
              id: idx + 1,
              title: items.UserStoryName,
              start: new Date(items.StartTime),
              end: new Date(items.EndTime),
              color:'#a70000'
            }
          })
          result = [...result, ...userStoryInfo];
        })
        
        this.events = [...result];
        // this.events = data.map((item, index) => {
        //   // tslint:disable-next-line: no-unused-expression
        //   // this.selectedDate = new Date(item.Date);
        //   result = item.TrackedInfo.map((items, idx) => {
        //     // if( items.BreakType != null && items.BreakType != undefined) {
        //     return {
        //       id: idx + 1,
        //       title: items.BreakType != null && items.BreakType != undefined ? items.BreakType : "Tracked",
        //       start: items.StartTime,
        //       end: items.EndTime
        //     }
        //     // result.push(obj);
        //     //  }
        //   })
        //   // return result;
        // })
        console.log(this.events);
      } else {
        // alert("fail");
      }
    })
  }

  getLoggedInUser() {
    this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
      this.loggedUser = responseData.data.id;
    })
  }
}