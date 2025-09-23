import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class RateSheetModel extends SearchCriteriaInputModelBase {
    rateSheetId: string;
    rateSheetName: string;
    rateSheetForId: string;
    rateSheetForName: string;
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
}
