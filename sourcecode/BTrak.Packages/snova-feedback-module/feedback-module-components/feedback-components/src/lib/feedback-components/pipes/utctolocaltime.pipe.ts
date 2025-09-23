import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from "moment";
@Injectable({ providedIn: 'root' })

@Pipe({ name: 'utcToLocalTime' })
export class UtcToLocalTimePipe implements PipeTransform {
    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }

        const localDate = moment.utc(utcDate).local().format();
        return localDate;
    }
}