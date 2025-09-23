import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({ name: 'utcToLocalTime' })
export class ConvertUtcToLocalTimePipe implements PipeTransform {
    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }
        
        const localDate = moment.utc(utcDate).local().format();
        return localDate;
    }
}