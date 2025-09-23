import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "resultsfilter", pure: true })

@Injectable({ providedIn: 'root' })

export class ResultsFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, parameter: string): any[] {

        if (!items || !searchText) {
            return items;
        }
        if (parameter === "deadline") {
            return items.filter((x: any) =>
                x.deadline.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "operationName") {
            return items.filter((x: any) =>
                x.operationName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "userStoryName") {

            var filteredUserStories = items.filter((x: any) => {
                if (x.userStoryName) {
                    return x.userStoryName.toLowerCase().includes(searchText.toLowerCase().trim())
                }
            }
            );
            return filteredUserStories;
        } else if (parameter === "projectName") {
            return items.filter((x: any) =>
                x.projectName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "componentName") {
            return items.filter((x: any) =>
                x.projectFeatureName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "memberName") {
            return items.filter((x: any) =>
                x.projectMember.name.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "userStoryStatusId") {
            return _.where(items, {
                userStoryStatusId: searchText
            });
        } else if (parameter === "goalName") {
            var items = items.filter(function (x) {
                return (x.goalShortName.toLowerCase().includes(searchText.toLowerCase().trim()) || x.goalName.toLowerCase().includes(searchText.toLowerCase().trim()))
            });
            return items;
        } else if (parameter === "processDashboardStatusName") {
            return items.filter((x: any) =>
                x.processDashboardStatusName
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "considerHourName") {
            return items.filter((x: any) =>
                x.considerHourName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "apiName") {
            return items.filter((x: any) =>
                x.apiName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "sprintName") {
            return items.filter((x: any) =>
                x.sprintName.toLowerCase().includes(searchText.toLowerCase().trim())
            );
        } else if (parameter === "bugReport") {
            return _.where(items, {
                ownerUserId: searchText
            });
        }
        else if (parameter === "bugBoard") {
            // return _.where(items, {
            //   boardTypeUiId: searchText.toLowerCase() && isBugBoard
            // });
            return items.filter((x: any) =>
                x.isBugBoard == true
            );
        }
    }
}