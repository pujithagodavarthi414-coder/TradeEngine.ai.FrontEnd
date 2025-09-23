import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "activityfilter"
})

@Injectable({ providedIn: 'root' })
export class ActivityFilterPipe implements PipeTransform {
  // transform(rolesList: any[], field: string,userNames: any[]): any[] {
  //   if (!userNames) return rolesList;
  //   return _.filter(rolesList, function (s) {
  //     return !userNames.includes(s.roleId);
  //   });
  // }
  transform(rolesList: any[], selectedRoles: any[], selectList: any[]): any[] {
    console.log("Selected List");
    console.log(selectList);
    if (!selectedRoles) { return rolesList; }
    return _.filter(rolesList, (s) => {
      return !selectedRoles.includes(s.roleId) || selectList.includes(s.roleId);
    });
  }
}


