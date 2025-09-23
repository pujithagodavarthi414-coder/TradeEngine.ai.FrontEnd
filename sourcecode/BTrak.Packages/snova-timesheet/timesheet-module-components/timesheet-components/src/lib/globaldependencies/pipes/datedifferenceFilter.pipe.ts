import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as moment_ from 'moment';

const moment = moment_;

@Pipe({ name: "dateDifferenceFilter", pure: true })

@Injectable({ providedIn: 'root' })

export class DateDifferencePipe implements PipeTransform {
    transform(punchTime: any) {
        if (!punchTime) {
            return '';
        }
        return moment(moment.utc(punchTime).local().format(), "YYYY-MM-DD HH:mm:ss").fromNow();
    }
}