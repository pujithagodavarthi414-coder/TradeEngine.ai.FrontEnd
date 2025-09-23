import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "userStoryLinkFilter",
  pure: true
})
@Injectable({ providedIn: 'root' })
export class UserStoryLinkFilterPipe implements PipeTransform {
  transform(userStories: any[], field: string, linkTypeId: any): any[] {
 
    if (!linkTypeId){
        return userStories;
    } 
    else{
        
        var userStoriesList =  _.filter(userStories, function(s) {
            return linkTypeId.includes(s.linkUserStoryTypeId);
          });
          return userStoriesList;
    }
   
  }
}