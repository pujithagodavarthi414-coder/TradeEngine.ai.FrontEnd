import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "userStoryNamefilter",
    pure: true
})
@Injectable({ providedIn: 'root' })
export class UserStoryNameFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        let subUserStories = [];
        let childUserStories = [];
        let filteredChildUserStories = [];

        if (!items || !searchText) {
            return items;
        }
        else {
            var userStoriesList = items.filter(function (userStory) {
                return userStory.subUserStories != null
            })
            userStoriesList.forEach((subTasks) => {
                subUserStories = subTasks.subUserStoriesList;
                if (subUserStories.length > 0) {
                    filteredChildUserStories = _.filter(subUserStories, function (s) {
                        if (s.userStoryName) {
                            return s.userStoryName.toLowerCase().includes(searchText.toLowerCase().trim());
                        }
                    });
                    if (filteredChildUserStories.length > 0) {
                        filteredChildUserStories.forEach((userStory) => {
                            childUserStories.push(userStory.parentUserStoryId.toLowerCase());
                        })
                    }
                }
            })

            var filteredUserStories = items.filter((x: any) => {
                if (x.userStoryName) {
                    return x.userStoryName.toLowerCase().includes(searchText.toLowerCase().trim())
                }
            }
            );
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
