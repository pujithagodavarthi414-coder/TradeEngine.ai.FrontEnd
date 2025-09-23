import { RosterPlanBasicInput } from "./roster-plan-basicinput-model";
import { RosterSolution } from "./roster-solution-model";
import { RosterPlanOutput } from "./roster-planoutput-model";

export class RosterPlanInput {
    requestId: string;
    basicInput: RosterPlanBasicInput;
    solution: RosterSolution;
    plans: RosterPlanOutput[];
}