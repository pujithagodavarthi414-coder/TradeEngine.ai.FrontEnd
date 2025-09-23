import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { offset } from '@progress/kendo-date-math';
import * as moment from "moment";
@Pipe({ name: 'covertTimeIntoUtcTime' })
@Injectable({ providedIn: 'root' })

export class CovertTimeIntoUtcTime implements PipeTransform {

    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }
            
        var result=moment.parseZone(utcDate).utcOffset().toString(); // 120
console.log(result)
       
        return result;
    }
}