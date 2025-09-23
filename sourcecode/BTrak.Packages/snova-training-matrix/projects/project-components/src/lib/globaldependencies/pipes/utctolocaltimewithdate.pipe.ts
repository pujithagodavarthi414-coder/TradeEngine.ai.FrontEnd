import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from "moment";
const moment = moment_;

@Pipe({ name: 'utcToLocalTimeWithDate' })
@Injectable({providedIn: 'root'})
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