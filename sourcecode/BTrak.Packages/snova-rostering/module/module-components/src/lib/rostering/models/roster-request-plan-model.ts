import { RosterPlanOutput } from "./roster-planoutput-model";
import { Time } from "@angular/common";

export class RosterPlanOutputByRequestModel {
    requestId: string;
    solutionId: string;
    planId: string;
    planDate: Date;
    departmentId: string;
    departmentName: string;
    shiftId: string;
    shiftName: string;
    employeeId: string;
    plannedEmployeeId: string;
    plannedEmployeeName: string;
    plannedEmployeeProfileImage: string;
    employeeName: string;
    fromTime: Time;
    toTime: Time;
    totalRate: number;
    plannedRate: number;
    currencyCode: string;
    isNew: boolean;
    plannedFromTime: Time;
    plannedToTime: Time;
    actualEmployeeId: string;
    actualEmployeeName: string;
    actualEmployeeProfileImage: string;
    actualRate: number;
    actualFromTime: Time;
    actualToTime: Time;
    isArchived: boolean;
    totalCount: number;
}


export enum DataType {
    Planned = 1,
    Actual
}