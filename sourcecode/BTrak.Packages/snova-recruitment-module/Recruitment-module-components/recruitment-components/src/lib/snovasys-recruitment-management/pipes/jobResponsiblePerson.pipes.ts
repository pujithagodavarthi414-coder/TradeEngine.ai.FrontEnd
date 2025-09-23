import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
    name: 'JobResponsiblefilter'
})
@Injectable({ providedIn: 'root' })
export class JobResponsibleFilterPipe implements PipeTransform {
    transform(openingstatus: any[], field: string, jobResponsiblePerson: any): any[] {
        if (!jobResponsiblePerson) {
            return openingstatus;
        } else {
            const jobStatusColor = jobResponsiblePerson.split(',');
            // tslint:disable-next-line: only-arrow-functions
            return _.filter(openingstatus, function(s) {
                return jobStatusColor.includes(s.hiringManagerId);
            });
        }
    }
}
