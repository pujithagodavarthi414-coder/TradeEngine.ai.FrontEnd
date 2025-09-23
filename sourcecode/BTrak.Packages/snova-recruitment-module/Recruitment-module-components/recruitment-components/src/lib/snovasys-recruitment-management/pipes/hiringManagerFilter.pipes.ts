import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'hiringManagerFilter'
})
@Injectable({ providedIn: 'root' })
export class HiringManagerfilterPipe implements PipeTransform {
  transform(JobOpeningStatus: any[], field: string, jobs: any[]): any[] {
    if (!jobs || jobs.length === 0) {
      return JobOpeningStatus;
    } else {
      jobs = jobs.filter(
        (thing, i, arr) => arr.findIndex(t => t.hiringManagerId === thing.hiringManagerId) === i
      );
      // tslint:disable-next-line: only-arrow-functions
      jobs = jobs.filter(function(job){
        return job.hiringManagerId;
     });
      return jobs;
    }
  }
}
