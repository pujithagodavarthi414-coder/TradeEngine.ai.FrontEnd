import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment_ from 'moment';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
const moment = moment_;

@Pipe({ name: 'timeZoneData' })

@Injectable({ providedIn: 'root' })

export class TimeZoneDataPipe implements PipeTransform {

    ipAddress: string = null;

    constructor(public datePipe: DatePipe) {
    }

    // here format refers to string without timezone in it
    transform(utcDate: any, format?: string): string {
        if (!utcDate) {
            return null;
        }

        let localZone = null;

        if ((localStorage.getItem(LocalStorageProperties.UserModel) != null && localStorage.getItem(LocalStorageProperties.UserModel) != undefined)
        ) {
            localZone = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel)).timeZoneOffset;
        }

        const zone = utcDate.toString()
        const incomingTimeZone = zone.substring(utcDate.length - 6, utcDate.length);

        const timeZoneforPipe = incomingTimeZone.replace(':', '');

        if (localZone == null || localZone == undefined || localZone == 'null' || localZone == 'undefined') {
            localZone = moment().format('Z');
            localZone = localZone.replace(':', '');
        }

        // if (localZone != timeZoneforPipe) {
        //     return this.datePipe.transform(utcDate, format, timeZoneforPipe) + " (UTC" + incomingTimeZone + ")";
        // } else {
            return this.datePipe.transform(utcDate, format, timeZoneforPipe);
        // }
    }
}
