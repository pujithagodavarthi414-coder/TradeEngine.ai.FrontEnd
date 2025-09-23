import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'utcToLocalTime' })

@Injectable({ providedIn: 'root' })

export class UtcToLocalTimePipe implements PipeTransform {
    transform(utcDate: any): string {
        if (!utcDate) {
            return null;
        }
        
        const localDate = moment.utc(utcDate).local().format();
        return localDate;
    }
}