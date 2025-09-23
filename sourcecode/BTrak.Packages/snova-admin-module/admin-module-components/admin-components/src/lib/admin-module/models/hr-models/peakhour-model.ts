import { Time } from "@angular/common";
import { SearchCriteriaInputModelBase } from '../searchCriteriaInputModelBase';

export class PeakHourModel extends SearchCriteriaInputModelBase {
    peakHourId: string;
    peakHourOn: string;
    filterType: string;
    peakHourFrom: Time;
    peakHourTo: Time;
    isPeakHour: boolean;
    timeStamp: any;
    isArchived: boolean;
}

export enum WeekorDay {
    Week = "W",
    Day = "D"
}
