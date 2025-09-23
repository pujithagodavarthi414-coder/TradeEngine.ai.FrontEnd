import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "workItemTypesFilter",
    pure: true
})
@Injectable({providedIn: 'root'})
export class WorkItemTypesFilterPipe implements PipeTransform {
    transform(userStories: any[], field: string, workItemId: any): any[] {
        if (!workItemId) {
            return userStories;
        } else {
            var workItemTypeIdsList = workItemId.split(",");
            return _.filter(userStories, function (s) {
                return workItemTypeIdsList.includes(s.userStoryTypeId.toLowerCase());
            });
        }
    }
}
