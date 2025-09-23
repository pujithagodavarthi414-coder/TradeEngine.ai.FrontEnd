import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';
import { RateTagForModel } from './ratetag-for-model';

export class EmployeeRateTagModel extends SearchCriteriaInputModelBase {
    employeeRateTagId: string;
    rateTagStartDate: Date;
    rateTagEndDate: Date;
    rateTagId: string;
    rateTagCurrencyId: string;
    rateTagCurrencyName: string;
    rateTagCurrencyCode: string;
    rateTagName: string;
    rateTagForId: string;
    rateTagForName: string;
    ratePerHour: number;
    ratePerHourMon: number;
    ratePerHourTue: number;
    ratePerHourWed: number;
    ratePerHourThu: number;
    ratePerHourFri: number;
    ratePerHourSat: number;
    ratePerHourSun: number;
    rateTagEmployeeId: string;
    timeStamp: any;
    isArchived: boolean;
    isPermanent: boolean;
    totalCount: number;
    rateTagForNames: string;
    priority:number;
    rateTagDetailsList: RateTagForModel[] = [];
    datePeriod: string;
    isInHerited: boolean;
    isOverRided: boolean;
    roleBranchConfigurationId: string;
    groupPriority: number;
    roleId: string;
    branchId: string;
}
