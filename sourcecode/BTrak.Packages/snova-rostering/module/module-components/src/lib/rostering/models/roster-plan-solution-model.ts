import { RosterPlanOutput } from "./roster-planoutput-model";
import { RosterSolution } from "./roster-solution-model";
import { RosterBasicRequirement } from "./roster-basic-model";

export class RosterPlanSolution {
    requestId: string;
    solution: RosterSolution;
    plans: RosterPlanOutput[];
}
