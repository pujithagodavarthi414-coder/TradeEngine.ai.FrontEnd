import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "timefilter"
})
@Injectable({ providedIn: 'root' })
export class TimeFilterPipe implements PipeTransform {
  transform(estimatedTime: any): string {
    let estimatedTimeString = '';
    if (estimatedTime != null || estimatedTime != undefined) {
      let hoursInWeek = 40;
      let hoursInDay = 8;
      var weeks = Math.floor(estimatedTime / hoursInWeek);
      estimatedTime = estimatedTime - (weeks * hoursInWeek);
      let days = Math.floor(estimatedTime / hoursInDay);
      estimatedTime = estimatedTime - (days * hoursInDay);

      var estimatedFinalConstructedString = '';

      if (weeks > 0) {
        estimatedFinalConstructedString = weeks.toFixed(2).replace(/\.?0*$/g,'') + 'w';
      }

      if (days > 0) {
        if (estimatedFinalConstructedString != '') {
          estimatedFinalConstructedString += ' ';
        }
        estimatedFinalConstructedString += days.toFixed(2).replace(/\.?0*$/g,'') + 'd';
      }

      if (estimatedTime > 0) {
        if (estimatedFinalConstructedString != '') {
          estimatedFinalConstructedString += ' ';
        }
        estimatedFinalConstructedString += estimatedTime.toFixed(2).replace(/\.?0*$/g,'') + 'h';
      }

      estimatedTimeString = estimatedFinalConstructedString;
    }
    return estimatedTimeString;
  }
}
