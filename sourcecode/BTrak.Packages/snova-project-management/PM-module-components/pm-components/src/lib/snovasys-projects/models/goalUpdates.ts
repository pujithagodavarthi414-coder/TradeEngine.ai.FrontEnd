import { GoalModel } from "./GoalModel";
import { SprintModel } from "./sprints-model";

export class goalUpdates{
    id:string;
    changes:GoalModel;
}


export class sprintUpdates{
    id:string;
    changes:SprintModel;
}