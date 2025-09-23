import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'timeZoneData' })

@Injectable({ providedIn: 'root' })

export class TimeZoneDataPipe implements PipeTransform {

    ipAddress: string = null;

    constructor(public datePipe: DatePipe) {
    }

    // here format refers to string without timezone in it
    transform(utcDate: any, format?: any): string {
        if (!utcDate) {
            return null;
        }
        return this.datePipe.transform(utcDate, format);
    }
}
