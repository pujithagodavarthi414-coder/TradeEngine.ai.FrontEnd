import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "userStorysubTasksTagsFilter"
})
@Injectable({ providedIn: 'root' })
export class UserStorySubTasksTagsPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    let subUserStories = [];
    let childUserStories = [];
    let filteredChildUserStories = [];
    var userStories: any[] = [];
    var filteredText = [];
    // var searchText = searchText.trim();
    if (searchText) {
      searchText = searchText.trim();
      filteredText = searchText.split(",");

    }
    if (!searchText) {
      return items;
    }
    else {
      var userStoriesList = items.filter(function (userStory) {
        return userStory.subUserStories != null
      })
      userStoriesList.forEach((subTasks) => {
        subUserStories = subTasks.subUserStoriesList;
        if (subUserStories.length > 0) {
          subUserStories.forEach((result) => {
            if (result.tag) {
              filteredText.forEach((searchTag) => {
                if (searchTag.trim()) {
                  if (result.tag.toLowerCase() == (searchTag.toLowerCase().trim())) {
                    filteredChildUserStories.push(result);
                  }
                }
              })
            }
          })

          if (filteredChildUserStories.length > 0) {
            filteredChildUserStories = _.uniq(filteredChildUserStories);
          }

          if (filteredChildUserStories.length > 0) {
            filteredChildUserStories.forEach((userStory) => {
              childUserStories.push(userStory.parentUserStoryId.toLowerCase());
            })
          }
        }
      })

      // var filteredUserStories = items.filter((x: any) => {
      //   if (x.tag) {
      //     filteredText.forEach((tagSearch) => {
      //       if(tagSearch.trim()) {
      //         return x.tag.toLowerCase().trim().includes(tagSearch.toLowerCase().trim())
      //       }
      //     })
      //   }
      // }
      // );

      let filteredUserStories = [];

      items.forEach((result) => {
        if (result.tag) {
          filteredText.forEach((searchTag) => {
            if (searchTag.trim()) {
              if (result.tag.trim().split(',').length > 1) {
                let tags = result.tag.trim().split(',');
                tags.forEach(element => {
                  if (element.toLowerCase() == (searchTag.toLowerCase().trim())) {
                    filteredUserStories.push(result);
                  }
                });
              }
              else {
                if (result.tag.toLowerCase() == (searchTag.toLowerCase().trim())) {
                  filteredUserStories.push(result);
                }
              }
            }
          })
        }
      })

      if (filteredUserStories.length > 0) {
        filteredUserStories = _.uniq(filteredUserStories);
      }
      var childUserStoriesList = _.filter(items, function (s) {
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
