import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "userStoryfilter",
    pure: true
})
@Injectable({ providedIn: 'root' })
export class UserstoryFilterPipe implements PipeTransform {
    transform(userStories: any[], field: string, userStoryOwnerId: any): any[] {
        let subUserStories = [];
        let childUserStories = [];
        let filteredChildUserStories = [];
        if (!userStoryOwnerId) {
            return userStories;
        }
        else {
            var userStoryOwnerList = userStoryOwnerId.split(",");
            if(userStoryOwnerList.length > 0) {
                userStoryOwnerList = userStoryOwnerList.map(name => name.toLowerCase());
            }
            
            var userStoriesList = userStories.filter(function (userStory) {
                return userStory.subUserStories != null
            })
            userStoriesList.forEach((subTasks) => {
                subUserStories = subTasks.subUserStoriesList;
                if (subUserStories.length > 0) {
                     filteredChildUserStories = _.filter(subUserStories, function (s) {
                       // if (s.ownerUserId) {
                         return userStoryOwnerList.includes(s.ownerUserId == null ? 'null' : s.ownerUserId.toLowerCase());
                       // }
                    });
                    if(filteredChildUserStories.length >0){
                        filteredChildUserStories.forEach((userStory)=>{
                            childUserStories.push(userStory.parentUserStoryId.toLowerCase());
                        })
                    }
                  
                }
            })
            var filteredUserStories = _.filter(userStories, function (s) {
               // if(s.ownerUserId){
                return userStoryOwnerList.includes(s.ownerUserId == null ? 'null' : s.ownerUserId.toLowerCase());
                //}
            });

            var childUserStoriesList = _.filter(userStories, function (s) {
                return childUserStories.includes(s.userStoryId.toLowerCase());
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
