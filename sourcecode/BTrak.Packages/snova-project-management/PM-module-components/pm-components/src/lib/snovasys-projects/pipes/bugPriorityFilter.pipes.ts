import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "bugPriorityfilter",
    pure: true
})
@Injectable({ providedIn: 'root' })
export class BugPriorityFilterPipe implements PipeTransform {
    transform(userStories: any[], field: string, bugPriorityId: any): any[] {
        if (!bugPriorityId) {
            return userStories;
        } else {
            var bugPrioritiesList = bugPriorityId.split(",");
            return _.filter(userStories, function (s) {
                return bugPrioritiesList.includes(s.bugPriorityId);
            });
        }

    }
}
