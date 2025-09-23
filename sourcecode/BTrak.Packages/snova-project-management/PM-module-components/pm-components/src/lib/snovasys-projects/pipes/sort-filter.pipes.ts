import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'sortByComponent' })
//@Injectable({ providedIn: 'root' })
export class SortByComparatorPipe implements PipeTransform {

        transform(userStories: any[], sortBy: any): any[] {
                if (userStories && userStories.length > 0) {
                        if (sortBy == 'ownerName') {
                                return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.ownerName.localeCompare(userStoriesSortDesc.ownerName);
                                });
                        } else if (sortBy == 'projectMember') {
                                return userStories.sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.projectMember.name.localeCompare(userStoriesSortDesc.projectMember.name);
                                });
                        }
                        else if (sortBy == 'sprintOwner') {
                                userStories = userStories.slice().sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.assignee - userStoriesSortDesc.assignee;
                                });
                                return userStories;
                        }
                        else {
                                userStories = userStories.slice().sort((userStoriesSortAsc, userStoriesSortDesc) => {
                                        return userStoriesSortAsc.order - userStoriesSortDesc.order;
                                });
                                return userStories;
                        }
                }
        }
}