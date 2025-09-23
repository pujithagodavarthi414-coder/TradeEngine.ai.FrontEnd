import { Time } from "@angular/common";

export class RosterPlanOutput {
    solutionId: string;
    planId: string;
    planDate: Date;
    departmentId: string;
    departmentName: string;
    shiftId: string;
    shiftName: string;
    employeeId: string;
    employeeName: string;
    employeeProfileImage: string;
    totalRate: number;
    currencyCode: string;
    fromTime: any;
    toTime: any;
    isNew: boolean;
    availableStatus: string;
    isOverlay: boolean;
}
