import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "goalStatusfilter"
})
@Injectable({ providedIn: 'root' })
export class GoalStatusColorFilterPipe implements PipeTransform {
    transform(goalsList: any[],  goalStatusColor: any): any[] {
        if (!goalStatusColor) {
            return goalsList;
        } else {
            var goalsStatusColor = goalStatusColor.split(",");
            return _.filter(goalsList, function (s) {
                return goalsStatusColor.includes(s.goalStatusColor);
            });
        }

    }
}
