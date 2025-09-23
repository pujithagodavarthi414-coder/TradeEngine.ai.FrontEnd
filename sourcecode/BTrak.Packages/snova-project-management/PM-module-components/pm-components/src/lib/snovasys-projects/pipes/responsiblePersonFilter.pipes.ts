import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "goalResponsiblePersonFilter"
})
@Injectable({ providedIn: 'root' })
export class GoalResponsiblePersonfilterPipe implements PipeTransform {
  transform(projectMembers: any[], field: string, goals: any[]): any[] {
    if (!goals || goals.length === 0) {
      return projectMembers;
    }
    else {
      goals = goals.filter(
        (thing, i, arr) => arr.findIndex(t => t.goalResponsibleUserId === thing.goalResponsibleUserId) === i
      );
      goals = goals.filter(function(goal){
        return goal.goalResponsibleUserId
     })
      return goals;
    }

  }
}
