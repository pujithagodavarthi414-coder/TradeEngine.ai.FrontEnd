import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'sortByGoal' })
@Injectable({ providedIn: 'root' })
export class SortByGoalPipe implements PipeTransform {

    transform(goalsList: any[], goalModel: any): any[] {
        let updatedGoalsList: any[] = [];
        if (goalModel.sortBy && (goalModel.sortBy == "GoalShortName" || goalModel.sortBy == "OnBoardProcessDate")) {
            if (goalModel.sortBy == "GoalShortName") {
                if (!goalModel.sortDirectionAsc) {
                    goalsList = goalsList.sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.goalShortName.localeCompare(goalSortAsc.goalShortName);
                    });
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.goalShortName - goalSortAsc.goalShortName;
                    });
                }
                else {
                    goalsList = goalsList.sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.goalShortName.localeCompare(goalSortDesc.goalShortName);
                    });
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.goalShortName - goalSortDesc.goalShortName;
                    });

                }
                if (goalModel.isGoalsPage) {
                    const filteredList = goalsList.filter(function (
                        goal
                    ) {
                        return (
                            goal.goalName == "All" && goal.goalShortName == "All"
                        );
                    });

                    if (filteredList.length > 0 && !goalModel.isGoalsPage) {
                        let idx = updatedGoalsList.indexOf(filteredList[0]);
                        if (idx == -1) {
                            updatedGoalsList.push(filteredList[0]);
                        }

                    }

                    goalsList.forEach((goal) => {
                        var index = updatedGoalsList.indexOf(goal);
                        if (index == -1) {
                            updatedGoalsList.push(goal);
                        }

                    })
                    return updatedGoalsList;
                } else {
                    return goalsList;
                }
            }
            else if (goalModel.sortBy == "OnBoardProcessDate") {

                if (!goalModel.sortDirectionAsc) {
                    goalsList = goalsList.sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.onboardProcessDate.localeCompare(goalSortAsc.onboardProcessDate);
                    });
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.onboardProcessDate - goalSortAsc.onboardProcessDate;
                    });
                }
                else {
                    goalsList = goalsList.sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.onboardProcessDate.localeCompare(goalSortDesc.onboardProcessDate);
                    });
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.onboardProcessDate - goalSortDesc.onboardProcessDate;
                    });
                }
                if (goalModel.isGoalsPage) {
                    const filteredList = goalsList.filter(function (
                        goal
                    ) {
                        return (
                            goal.goalName == "All" && goal.goalShortName == "All"
                        );
                    });

                    if (filteredList.length > 0 && !goalModel.isGoalsPage) {
                        let idx = updatedGoalsList.indexOf(filteredList[0]);
                        if (idx == -1) {
                            updatedGoalsList.push(filteredList[0]);
                        }

                    }

                    goalsList.forEach((goal) => {
                        var index = updatedGoalsList.indexOf(goal);
                        if (index == -1) {
                            updatedGoalsList.push(goal);
                        }

                    })
                    return updatedGoalsList;
                } else {
                    return goalsList;
                }
            }
        }
        else {
            return goalsList;
        }
    }
}