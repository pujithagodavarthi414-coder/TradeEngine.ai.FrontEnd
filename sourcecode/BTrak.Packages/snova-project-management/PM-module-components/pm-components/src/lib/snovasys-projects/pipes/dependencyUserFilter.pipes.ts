import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "dependencyFilter"
})
@Injectable({ providedIn: 'root' })
export class DependencyUserfilterPipe implements PipeTransform {
  transform(projectMembers: any[], field: string, userId: any): any[] {
    if (!projectMembers) return projectMembers;
    if(!userId)  return projectMembers;
    return _.filter(projectMembers, function(s) {
      return !userId.includes(s.projectMember.id);
    });
  }
}
