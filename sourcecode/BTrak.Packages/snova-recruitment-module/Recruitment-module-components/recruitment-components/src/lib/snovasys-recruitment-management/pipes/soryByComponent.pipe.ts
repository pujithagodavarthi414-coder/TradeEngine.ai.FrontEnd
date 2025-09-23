import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByComponent' })
export class SortByComparatorPipe implements PipeTransform {

        transform(userStories: any[], sortBy: any): any[] {
                if (userStories && userStories.length > 0) {
                        if (sortBy === 'assignedToManagerName') {
                                return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.assignedToManagerName - (userStoriesSortDesc.assignedToManagerName);
                                });
                        } else if (sortBy === 'projectMember') {
                                return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.projectMember.name - (userStoriesSortDesc.projectMember.name);
                                });
                        } else if (sortBy === 'sprintOwner') {
                                userStories = userStories.slice().sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.assignee - userStoriesSortDesc.assignee;
                                });
                                return userStories;
                        } else {
                                userStories = userStories.slice().sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.order - userStoriesSortDesc.order;
                                });
                                return userStories;
                        }
                }
        }
}
