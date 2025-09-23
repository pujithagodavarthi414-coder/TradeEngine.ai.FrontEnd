import { GoalsFilter } from "./goal-filter.model";

export class UserGoalFilter{
    goalFilterId : string;
    isPublic : string;
    goalFilterDetailsJsonModel : GoalsFilter;
    goalFilterName : string;
    goalFilterDetailsId : string;
    createdByUserId : string;
    createdUserName : string;
    createdDateTime : any;
}