import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "workflowStatusFilter"
})
@Injectable({ providedIn: 'root' })

export class WorkflowStatusFilterPipe implements PipeTransform {
  transform(workflowStatus: any[], field: string, workflowStatusId: string): any[] {
 
    if (!workflowStatusId){
        return workflowStatus;
    } 
    else{
       
        var workflowStatus =  _.filter(workflowStatus, function(s) {
      
            return !workflowStatusId.includes(s.userStoryStatusId);
          });
          return workflowStatus;
    }
   
  }
}