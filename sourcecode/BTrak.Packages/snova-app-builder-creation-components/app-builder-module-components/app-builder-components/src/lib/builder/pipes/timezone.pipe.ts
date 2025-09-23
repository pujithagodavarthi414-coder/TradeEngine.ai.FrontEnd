import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'timeZone' })

@Injectable({ providedIn: 'root' })

export class TimeZonePipe implements PipeTransform {

    ipAddress: string = null;

    constructor(public datePipe: DatePipe) {
    }

    // here format refers to string without timezone in it
    transform(utcDate: any, format?: any,overRideTimeZone?: string): string {
        const zone = utcDate.toString()
        const incomingTimeZone = zone.substring(utcDate.length - 6, utcDate.length);

        const timeZoneforPipe = incomingTimeZone.replace(':', '');

        if (overRideTimeZone != null) {
            return this.datePipe.transform(utcDate, format, overRideTimeZone);
        }

        return this.datePipe.transform(utcDate, format, timeZoneforPipe);
    }
}
