
export class RosterPlanBasicInput {
    rostName: string;
    startDate: Date;
    endDate: Date;
    branchId: string;
    breakMins: number;
    budget: number;
    isApprove: boolean;
    isTemplate: boolean;
    isSubmitted: boolean;
    isArchived: boolean;
    timeZone: number;
}