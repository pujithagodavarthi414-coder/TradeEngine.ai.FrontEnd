import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
    name: 'manageFilter',
    pure: true
})
@Injectable({ providedIn: 'root' })
export class ManagerFilterPipe implements PipeTransform {
    transform(userStories: any[], field: string, assignedToManagerId: any): any[] {

        if (!assignedToManagerId) {
            return userStories;
        } else {
            let userStoryOwnerList = assignedToManagerId.split(',');
            if (userStoryOwnerList.length > 0) {
                userStoryOwnerList = userStoryOwnerList.map(name => name.toLowerCase());
            }
            // tslint:disable-next-line: only-arrow-functions
            const filteredUserStories = _.filter(userStories, function(s) {
                return userStoryOwnerList.includes(s.ownerUserId == null ? 'null' : s.ownerUserId.toLowerCase());
            });
        }
    }
}
