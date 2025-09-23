import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "assigneeFilter"
})
@Injectable({ providedIn: 'root' })
export class AssigneefilterPipe implements PipeTransform {
  transform(projectMembers: any[], field: string, userStories: any[]): any[] {

    if(!projectMembers || (projectMembers && projectMembers.length === 0)){
       return [];
    }    
    else if (!userStories || (userStories && userStories.length === 0)){
        return projectMembers;
    } 
    else{

      var userStoriesList = userStories.filter(function(userStory){
        return userStory.subUserStories !=null
      })
     
      userStories = userStories.filter(function(userStory){
        return userStory.ownerUserId != null
      })
     
      userStories = userStories.filter(
        (thing, i, arr) => arr.findIndex(t => t.ownerUserId.toLowerCase() === thing.ownerUserId.toLowerCase()) === i
      );
     
        userStoriesList.forEach((userStory)=>{
          var subUserStories = userStory.subUserStoriesList;
          subUserStories = subUserStories.filter(function(userStory){
            return userStory.ownerUserId !=null
         })
           subUserStories = subUserStories.filter(
            (thing, i, arr) => arr.findIndex(t =>  t.ownerUserId.toLowerCase() ===  thing.ownerUserId.toLowerCase()) === i
          );
          subUserStories.forEach((userStory) =>{
            if(userStory.ownerUserId){
              userStories.push(userStory);
            }
          })
        })

        userStories = userStories.filter(
          (thing, i, arr) => arr.findIndex(t => t.ownerUserId.toLowerCase() === thing.ownerUserId.toLowerCase()) === i
        );

        return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
          return userStoriesSortAsc.ownerName.localeCompare(userStoriesSortDesc.ownerName);
        }); 
    }
  }
}
