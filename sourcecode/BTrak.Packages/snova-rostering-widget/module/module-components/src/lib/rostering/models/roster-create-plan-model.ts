import { RosterBasicRequirement } from "./roster-basic-model";
import { RosterShiftRequirement } from "./roster-shift-model";
import { RosterDepartmentWithShift } from "./roster-department-model";
import { RosterAdhocRequirement } from "./roster-adhoc-model";
import { RosterWorkingDay } from "./roster-workday-model";

export class RosterPlan {
    requestId: string;
    rosterBasicDetails: RosterBasicRequirement;
    workingdays: RosterWorkingDay[];
    rosterShiftDetails: RosterShiftRequirement[];
    rosterDepartmentDetails: RosterDepartmentWithShift[];
    rosterAdhocRequirement: RosterAdhocRequirement[];
    timeZone: number;
}