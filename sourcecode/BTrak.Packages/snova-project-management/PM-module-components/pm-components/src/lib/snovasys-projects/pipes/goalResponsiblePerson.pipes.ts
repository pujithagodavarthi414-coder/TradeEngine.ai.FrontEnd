import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "goalResponsiblefilter"
})
@Injectable({ providedIn: 'root' })
export class GoalResponsibleFilterPipe implements PipeTransform {
    transform(goalsList: any[], field: string, goalResponsiblePerson: any): any[] {
        if (!goalResponsiblePerson) {
            return goalsList;
        } else {
            var goalsStatusColor = goalResponsiblePerson.split(",");
            return _.filter(goalsList, function (s) {
                return goalsStatusColor.includes(s.goalResponsibleUserId);
            });
        }

    }
}
