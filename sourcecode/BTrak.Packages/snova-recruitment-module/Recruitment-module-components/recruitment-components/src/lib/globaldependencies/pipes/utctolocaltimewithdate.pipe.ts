import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as  moment_ from 'moment';
const moment = moment_;

@Injectable({providedIn:'root'})
@Pipe({ name: 'utcToLocalTimeWithDate' })
export class UtcToLocalTimeWithDatePipe implements PipeTransform {
    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }

        const temp = '2019-10-11T';
        const date = temp.toString().concat(utcDate);
        const localDate = moment.utc(date).local().format();
        return localDate;
    }
}