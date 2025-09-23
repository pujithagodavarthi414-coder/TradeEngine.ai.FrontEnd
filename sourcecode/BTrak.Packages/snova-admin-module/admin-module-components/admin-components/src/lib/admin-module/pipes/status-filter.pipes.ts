import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "statusFilter",
  pure: true
})
@Injectable({ providedIn: 'root' })
export class StatusFilterPipe implements PipeTransform {
  transform(statusList: any[], workflowStatusList: any[]): any[] {
 
    if (!workflowStatusList || workflowStatusList.length == 0){
        return statusList;
    } 
    else{
        let statusIds = workflowStatusList.map(item => item.userStoryStatusId);
        return _.filter(statusList, function(s) {
          return !statusIds.includes(s.userStoryStatusId);
        });
    }
   
  }
}