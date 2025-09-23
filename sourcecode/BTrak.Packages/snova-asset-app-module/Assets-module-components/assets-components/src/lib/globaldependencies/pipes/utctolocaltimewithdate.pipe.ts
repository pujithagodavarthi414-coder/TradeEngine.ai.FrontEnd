import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from "moment";

@Injectable({providedIn:'root'})
@Pipe({ name: 'utcToLocalTimeWithDate' })
export class UtcToLocalTimeWithDatePipe implements PipeTransform {
    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }

        var temp = '2019-10-11T';
        var date = temp.toString().concat(utcDate);
        const localDate = moment.utc(date).local().format();
        return localDate;
    }
}