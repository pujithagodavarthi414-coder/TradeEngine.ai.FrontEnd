import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "estimatetimeremoval"
})
@Injectable({ providedIn: 'root' })
export class EstimateTimeRemoval implements PipeTransform {
  transform(deadLineDate: Date,estimatedTime: any): Date {
      var Start: Date = new Date();
      
      var Hours: any = estimatedTime? Math.floor(estimatedTime) : 0;
      
      var Minutes: any = estimatedTime? (estimatedTime - Hours) * 60 : 0;
      deadLineDate? Start.setDate(deadLineDate.getUTCDate()) : Start.setDate(Start.getDate());
      deadLineDate? Start.setTime(deadLineDate.getTime()) : Start.setTime(Start.getTime());
      Start.setHours(Start.getHours() - Hours);
      Start.setMinutes(Start.getMinutes() - Minutes);
      return Start;
  }
}