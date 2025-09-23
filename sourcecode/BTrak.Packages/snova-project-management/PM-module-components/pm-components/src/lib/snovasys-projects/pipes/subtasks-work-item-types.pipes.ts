import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "subTasksWorkItemTypesfilter",
  pure: true
})
@Injectable({ providedIn: 'root' })
export class SubTasksWorkItemTypesFilterPipe implements PipeTransform {
  transform(userStories: any[], field: string, userStoryTypeId: string): any[] {
    let subUserStories = [];
    let childUserStories = [];
    let filteredChildUserStories = [];
    if (!userStoryTypeId) {
      return userStories;
    } else {
      var userStoryTypes = userStoryTypeId.split(",");
      var userStoriesList = userStories.filter(function (userStory) {
        return userStory.subUserStories != null
      })
      userStoriesList.forEach((subTasks) => {
        subUserStories = subTasks.subUserStoriesList;
        if (subUserStories.length > 0) {
          filteredChildUserStories = _.filter(subUserStories, function (s) {
            if (s.userStoryTypeId) {
              return userStoryTypes.includes(s.userStoryTypeId.toLowerCase());
            }
          });
          if (filteredChildUserStories.length > 0) {
            filteredChildUserStories.forEach((userStory) => {
              childUserStories.push(userStory.parentUserStoryId.toLowerCase());
            })
          }
        }
      })
      var filteredUserStories = _.filter(userStories, function (s) {
        if (s.userStoryTypeId) {
          return userStoryTypes.includes(s.userStoryTypeId.toLowerCase());
        }
      });
      var childUserStoriesList = _.filter(userStories, function (s) {
        return childUserStories.includes(s.userStoryId);
      });

      if (childUserStoriesList.length > 0) {
        return _.uniq(filteredUserStories.concat(childUserStoriesList));
      }
      else {
        return filteredUserStories;
      }
    }
  }
}
