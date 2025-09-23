import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "projectGoalFilter"
})
@Injectable({ providedIn: 'root' })
export class ProjectGoalFilterPipe implements PipeTransform {
  transform(goals: any[], field: string, projectId: any): any[] {
 
    if (!projectId){
        return goals;
    } 
    else{
        
        var goalsList =  _.filter(goals, function(s) {
            return projectId.includes(s.projectId) && s.goalId !="00000000-0000-0000-0000-000000000000"
          });
          return goalsList;
    }
   
  }
}