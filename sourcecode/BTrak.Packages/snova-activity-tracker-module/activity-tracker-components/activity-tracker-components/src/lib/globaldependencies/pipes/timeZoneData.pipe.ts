import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'timeZoneData' })

@Injectable({ providedIn: 'root' })

export class TimeZoneDataPipe implements PipeTransform {

    ipAddress: string = null;

    constructor(public datePipe: DatePipe) {
    }

    // here format refers to string without timezone in it
    transform(date: any, format?: any): string {
        if (!date) {
            return null;
        }
        var index;
        var zone;
        date = date.toString();
        if(date.indexOf("+") != -1){
            index = date.indexOf("+");
            zone = date.substring(index, date.length);
        } else if(date.indexOf("-") != -1) {
            index = date.indexOf("-");
            zone = date.substring(index, date.length);
        } else {
            zone = '+00:00';
        }
        
        return this.datePipe.transform(date, format, zone);
    }
}
