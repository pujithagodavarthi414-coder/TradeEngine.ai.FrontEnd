import { Time } from "@angular/common";

export class RosterAdhocRequirement {
    reqDate: Date;
    reqFromTime: Time;
    reqToTime: Time;
    noOfEmployeeRequired: number;
    employeeSpecifcation: any[];
}