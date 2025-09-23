import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "goalFilter"
})
@Injectable({ providedIn: 'root' })
export class GoalFilterPipe implements PipeTransform {
  transform(processDashboardStatus: any[], field: string, goals: any[]): any[] {
 
    if (!goals || goals.length === 0){
        return processDashboardStatus;
    } 
    else{
        let  goalResponsiblePersonsList = goals.map(x=>x.goalStatusColor);
        
        var processDashboardStatus =  _.filter(processDashboardStatus, function(s) {
      
            return goalResponsiblePersonsList.includes(s.processDashboardStatusHexaValue);
          });
          return processDashboardStatus;
    }
   
  }
}