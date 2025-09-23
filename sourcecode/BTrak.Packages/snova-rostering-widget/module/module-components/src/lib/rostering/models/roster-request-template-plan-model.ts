import { Time } from "@angular/common";

export class RosterTemplatePlanOutputByRequestModel {
    requestId: string;
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
    isNew: boolean;
    fromTime: Time;
    toTime: Time;
    isArchived: boolean;
    totalCount: number;
    availableStatus: string;
    isOverlay: boolean;
}