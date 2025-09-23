import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeRateSheetModel extends SearchCriteriaInputModelBase {
    employeeRateSheetId: string;
    rateSheetStartDate: Date;
    rateSheetEndDate: Date;
    rateSheetId: string;
    rateSheetCurrencyId: string;
    rateSheetCurrencyName: string;
    rateSheetCurrencyCode: string;
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
    rateSheetEmployeeId: string;
    timeStamp: any;
    isArchived: boolean;
    isPermanent: boolean;
    totalCount: number;
}
