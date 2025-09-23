import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "linkUserStoryfilter"
})
@Injectable({ providedIn: 'root' })
export class LinkUserStoryFilterPipe implements PipeTransform {
    transform(userStoriesList: any[], field: string, userStoryId: any): any[] {
        if (!userStoryId) {
            return userStoriesList;
        } else {
            return _.filter(userStoriesList, function (s) {
                return !userStoryId.includes(s.userStoryId);
            });
        }

    }
}
