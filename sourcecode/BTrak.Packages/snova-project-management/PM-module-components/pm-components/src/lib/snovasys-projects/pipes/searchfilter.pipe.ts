import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "searchfilter",
  pure: true
})
@Injectable({ providedIn: 'root' })
export class SearchFilterPipe implements PipeTransform {
  transform(userStories: any[], userStoryStatusId: string): any[] {
    if (!userStoryStatusId) {
      return userStories;
    } else {
      var userStoryStatus = userStoryStatusId.split(",");
     
      var filteredUserStories = _.filter(userStories, function (s) {
        if (s.userStoryStatusId) {
          return userStoryStatus.includes(s.userStoryStatusId.toLowerCase());
        }
      });
      return filteredUserStories;
    }
  }
}
