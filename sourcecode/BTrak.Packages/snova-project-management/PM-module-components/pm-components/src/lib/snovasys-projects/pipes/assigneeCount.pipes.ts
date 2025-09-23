import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "assigneeCountFilter"
})
@Injectable({ providedIn: 'root' })
export class AssigneeCountPipe implements PipeTransform {
  transform(projectMembers: number,field: string): any {
   
      if(projectMembers >=0 && projectMembers <=5){
        return '';
      }
      else {
        return projectMembers - 5;
      }
  }
}
