import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
    name: 'jobStatusfilter'
})
@Injectable({ providedIn: 'root' })
export class JobStatusColorFilterPipe implements PipeTransform {
    transform(openingstatus: any[],  statusColour: any): any[] {
        if (!statusColour) {
            return openingstatus;
        } else {
            const jobStatusColor = statusColour.split(',');
            // tslint:disable-next-line: only-arrow-functions
            return _.filter(openingstatus, function(s) {
                return jobStatusColor.includes(s.statusColour);
            });
        }

    }
}
