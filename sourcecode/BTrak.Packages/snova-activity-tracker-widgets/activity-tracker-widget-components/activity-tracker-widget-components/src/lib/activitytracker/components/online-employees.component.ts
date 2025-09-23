import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { TrackingUserModel } from '../models/tracking-user-model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import * as $_ from 'jquery';
const $ = $_;
  
@Component({
  selector: 'online-employees',
  templateUrl: 'online-employees.component.html'
})

export class OnlineEmployeesComponent {
  
  inputModel: TrackingUserModel = new TrackingUserModel();
  list: TrackingUserModel[] = [];
  anyOperationInProgress: boolean;
  
  constructor(private router: Router, private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.getTrackingUsers();
  }

  getTrackingUsers() {

    this.inputModel.status = 'online';
    this.anyOperationInProgress = true;
    this.activityTrackerService.getTrackingUsers(this.inputModel).subscribe((responseData: any) => {
      this.list = responseData.data;
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  resetFilter() {
    this.getTrackingUsers();
  }

  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  fitContent(optionalParameters : any) {

    if(optionalParameters['gridsterView']) {      
      $(optionalParameters['gridsterViewSelector'] + ' online-employees #widget-scroll-id').height($(optionalParameters['gridsterViewSelector']).height() - 40);
    } else if (optionalParameters['popupView']) {     
      $(optionalParameters['popupViewSelector'] + ' online-employees #widget-scroll-id').css({"height" : "calc(100vh - 400px)" });
    } else if (optionalParameters['individualPageView']) {      
      $(optionalParameters['individualPageSelector'] + ' online-employees #widget-scroll-id').css({"height" : "calc(100vh - 95px)" });
    }

  }

}