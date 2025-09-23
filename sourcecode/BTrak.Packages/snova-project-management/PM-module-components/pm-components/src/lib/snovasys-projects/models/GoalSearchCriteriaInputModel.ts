import { GoalSearchCriteriaApiInputModel } from "./goalSearchInput";
export class GoalSearchCriteriaInputModel extends GoalSearchCriteriaApiInputModel {
  public title: string;
  public isFromSubquery?: boolean;
}
