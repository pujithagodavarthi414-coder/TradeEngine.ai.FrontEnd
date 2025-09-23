import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';
import { RateTagForModel } from './ratetag-for-model';

export class RateTagConfigurationModel extends SearchCriteriaInputModelBase {
    rateTagConfigurationId: string;
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
    timeStamp: any;
    isArchived: boolean;
    isPermanent: boolean;
    totalCount: number;
    rateTagForNames: string;
    priority:number;
    rateTagDetailsList: RateTagForModel[] = []
    rateTagRoleBranchConfigurationId: string;
    startDate: Date;
    endDate: Date;
}
