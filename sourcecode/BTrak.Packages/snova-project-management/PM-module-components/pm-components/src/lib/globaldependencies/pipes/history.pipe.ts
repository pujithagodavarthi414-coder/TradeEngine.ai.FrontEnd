import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "historyPipe"
})
@Injectable({ providedIn: 'root' })
export class UserStoryHistoryPipe implements PipeTransform {
  transform(userStoryHistory: any[], field: string, searchText: boolean): any[] {
      if(!searchText){
        var userStoryHistoryRecords =  _.filter(userStoryHistory, function(s) {
            return s.descriptionSlug !='UserStoryViewed'
          });
          return userStoryHistoryRecords;
      }
       else {
           return userStoryHistory;
       }
  }
}