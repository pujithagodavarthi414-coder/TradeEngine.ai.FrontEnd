import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'goalOrder' })
@Injectable({ providedIn: 'root' })
export class GoalOrderPipe implements PipeTransform {

    transform(goalsList: any[], goalModel: any): any[] {
        let updatedGoalsList: any[] = [];
        if (goalModel.sortBy) {
            if (goalModel.sortBy == "GoalShortName") {
                if (!goalModel.sortDirectionAsc) {
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.goalShortName.localeCompare(goalSortAsc.goalShortName);
                    });
                }
                else {
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.goalShortName.localeCompare(goalSortDesc.goalShortName);
                    });
                }
            }
            else if (goalModel.sortBy == "OnBoardProcessDate") {

                if (!goalModel.sortDirectionAsc) {
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortDesc.onboardProcessDate.localeCompare(goalSortAsc.onboardProcessDate);
                    });
                }
                else {
                    goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                        return goalSortAsc.onboardProcessDate.localeCompare(goalSortDesc.onboardProcessDate);
                    });
                }
            }
        }
        else {
            goalsList = goalsList.slice().sort((goalSortAsc, goalSortDesc) => {
                return goalSortDesc.createdDateTime - goalSortAsc.createdDateTime;
            });
        }

        const goalfilteredList = goalsList.filter(function (
            goal
        ) {
            return (
                goal.goalName == "All" && goal.goalShortName == "All"
            );
        });

        if (goalfilteredList.length > 0 && goalModel.isGoalsPage) {
            let idx = updatedGoalsList.indexOf(goalfilteredList[0]);
            if (idx == -1) {
                updatedGoalsList.push(goalfilteredList[0]);
            }

        }

        const filteredList = goalsList.filter(function (
            goal
        ) {
            return (
                goal.goalName == "Backlog" && goal.goalShortName == "Backlog"
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

    }
}
