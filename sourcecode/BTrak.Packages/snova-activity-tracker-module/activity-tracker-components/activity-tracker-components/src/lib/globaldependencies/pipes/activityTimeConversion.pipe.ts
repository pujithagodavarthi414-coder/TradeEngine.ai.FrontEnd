import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import * as _ from "underscore";

@Pipe
    ({
        name: "activityTimeFilter"
    })

@Injectable()
export class ActivityTimeFilterPipe implements PipeTransform {
    constructor(public translateService: TranslateService) { }

    transform(value: any) {
        let totalTimeSeconds = Math.floor(value % 60);

        let totalTimeMinutes = (value / 60);

        let totalTimeHours = Math.floor(totalTimeMinutes / 60);

        totalTimeMinutes = Math.floor(totalTimeMinutes % 60);

        //let totalTimeMinutes = (value % 60);

        if (value == 0) {
            return this.translateService.instant('NOTIME');
        }

        else if (totalTimeHours == 0) {
            if (totalTimeMinutes == 0) {
                return totalTimeSeconds + 's';
            }
            else {
                return totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
            }
        }

        else if (totalTimeMinutes == 0) {
            if (totalTimeHours > 0) {
                return totalTimeHours + 'h ' + totalTimeMinutes + 'm';
                // return totalTimeHours + 'h ' + totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
            }
            else {
                return totalTimeSeconds + 's';
            }
        }

        return totalTimeHours + 'h ' + totalTimeMinutes + 'm';
        // return totalTimeHours + 'h ' + totalTimeMinutes + 'm ' + totalTimeSeconds + 's';
    }
}