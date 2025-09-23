
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: "hoursAndMinutes", pure: true })

export class HoursandMinutesPipe implements PipeTransform {
    constructor(public translateService: TranslateService) { }

    transform(value: any) {
        let totalTimeHours = Math.floor(value / 60);

        let totalTimeMinutes = (value % 60);

        if (value == 0) {
            return null;
        }

        else if (totalTimeHours == 0) {
            return totalTimeMinutes + 'm';
        }

        return totalTimeHours + 'h ' + totalTimeMinutes + 'm';
    }
}