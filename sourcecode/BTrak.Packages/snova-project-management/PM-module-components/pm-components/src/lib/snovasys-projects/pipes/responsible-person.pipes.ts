import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "sprintResponsiblePersonFilter"
})
@Injectable({ providedIn: 'root' })
export class SprintResponsiblePersonfilterPipe implements PipeTransform {
    transform(sprints: any[]): any[] {
        if (!sprints || sprints.length === 0) {
            return sprints;
        }
        else {
            
            sprints = sprints.filter(
                (thing, i, arr) => arr.findIndex(t => t.sprintResponsiblePersonId === thing.sprintResponsiblePersonId) === i
            );
            sprints = sprints.filter(function (goal) {
                return goal.sprintResponsiblePersonId
            })
            return sprints;
        }

    }
}
