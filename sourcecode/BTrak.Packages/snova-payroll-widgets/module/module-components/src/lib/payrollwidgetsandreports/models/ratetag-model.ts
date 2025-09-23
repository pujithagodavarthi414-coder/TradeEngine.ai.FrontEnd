import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class RateTagModel extends SearchCriteriaInputModelBase {
    rateTagId: string;
    rateTagName: string;
    rateTagForIds: any = [];
    rateTagForName: string;
    ratePerHour: number;
    ratePerHourMon: number;
    ratePerHourTue: number;
    ratePerHourWed: number;
    ratePerHourThu: number;
    ratePerHourFri: number;
    ratePerHourSat: number;
    ratePerHourSun: number;
    timeStamp: any;
    isArchived: boolean;
    priority: number;
    rateTagDetailsList: any = [];
    roleId: string;
    branchId: string;
    employeeId: string;
    minTime: number;
    maxTime: number;
}
