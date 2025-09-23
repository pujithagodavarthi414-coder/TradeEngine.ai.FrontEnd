export class ScheduleDetailsModel{
    scheduleId: string;
    userId: string;
    clientId: string;
    currencyId: string;
    invoiceId: string;
    companyLogo: string;
    searchText: string;
    scheduleName: string;
    startDate: Date;
    issueDate: Date;
    ratePerHour: number;
    noOfHours: number;
    rateForExcessHours: number;
    scheduleType: string;
    hoursPerSchedule: number;
    configureSequence: number;
    configureDays: number;
    invoiceAmount: number;
    isArchived: boolean;
    timeStamp: any;
}