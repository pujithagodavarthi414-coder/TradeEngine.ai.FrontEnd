import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "datafilter"
})
@Injectable({ providedIn: 'root' })
export class DataFilterPipe implements PipeTransform {
  transform(usersList: any[], field: string, projectMembers: any[]): any[] {
    if (!projectMembers) return usersList;
    let memberIds = projectMembers.map(item => item.projectMember.id);
    return _.filter(usersList, function(s) {
      return !memberIds.includes(s.id);
    });
  }
}
