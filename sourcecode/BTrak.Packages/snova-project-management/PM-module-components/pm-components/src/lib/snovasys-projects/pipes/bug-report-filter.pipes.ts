import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "bugReportFilter"
})
@Injectable({ providedIn: 'root' })
export class BugReportFilterPipe implements PipeTransform {
  transform(userStories: any[]): any[] {
    if (!userStories && userStories.length === 0){
        return userStories;
    } 
    else{
      userStories = userStories.filter(function(userStory){
        return userStory.ownerUserId != null;
     })
     
      userStories = userStories.filter(
        (thing, i, arr) => arr.findIndex(t => t.ownerUserId.toLowerCase() === thing.ownerUserId.toLowerCase()) === i
      );
      
        userStories = userStories.filter(
          (thing, i, arr) => arr.findIndex(t => t.ownerUserId.toLowerCase() === thing.ownerUserId.toLowerCase()) === i
        );

        return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
          return userStoriesSortAsc.assignee.localeCompare(userStoriesSortDesc.assignee);
  }); 
    }
  }
}
