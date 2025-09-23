import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'timeZoneName' })

@Injectable({ providedIn: 'root' })

export class TimeZoneNamePipe implements PipeTransform {

    constructor() {
    }

    // here format refers to string without timezone in it
    transform(timeZone: string, overRideTimeZone?: string): string {

        if(overRideTimeZone && overRideTimeZone != null && overRideTimeZone != 'null') {
            return null;
        } else {
            return timeZone
        }

    }
}
