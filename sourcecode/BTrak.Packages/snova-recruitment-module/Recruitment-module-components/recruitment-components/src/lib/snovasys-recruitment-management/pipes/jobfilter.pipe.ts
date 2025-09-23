import { variable } from '@angular/compiler/src/output/output_ast';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
@Pipe({
  name: 'jobFilter'
})
@Injectable({ providedIn: 'root' })
export class JobStatusFilterPipe implements PipeTransform {
  transform(jobOpeningStatus: any[], field: string, jobs: any[]): any[] {

    if (!jobs || jobs.length === 0) {
      return jobOpeningStatus;
    } else {
      const jobResponsiblePersonsList = jobs.map(x => x.statusColour);

      // tslint:disable-next-line: only-arrow-functions
      _.filter(jobOpeningStatus, function(s) {

        return jobResponsiblePersonsList.includes(s.statusColour);
      });
      return jobOpeningStatus;
    }
  }
}
