import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'assigneeFilter'
})
@Injectable({ providedIn: 'root' })
export class AssigneefilterPipe implements PipeTransform {
  transform(projectMembers: any[], field: string, userStories: any[]): any[] {

    if (!projectMembers || (projectMembers && projectMembers.length === 0)) {
      return [];
    } else if (!userStories || (userStories && userStories.length === 0)) {
      return projectMembers;
    } else {

      // tslint:disable-next-line: only-arrow-functions
      userStories = userStories.filter(function(userStories) {
        return userStories.assignedToManagerId != null;
      });

      userStories = userStories.filter(
        (thing, i, arr) => arr.findIndex(t => t.assignedToManagerId.toLowerCase() === thing.assignedToManagerId.toLowerCase()) === i
      );

      userStories = userStories.filter(
        (thing, i, arr) => arr.findIndex(t => t.assignedToManagerId.toLowerCase() === thing.assignedToManagerId.toLowerCase()) === i
      );

      return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
        return userStoriesSortAsc.assignedToManagerName - userStoriesSortDesc.assignedToManagerName;
      });
    }
  }
}
