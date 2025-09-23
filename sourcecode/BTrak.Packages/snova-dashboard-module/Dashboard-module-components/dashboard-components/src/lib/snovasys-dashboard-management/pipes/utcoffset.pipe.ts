import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from "moment";
@Pipe({ name: 'covertTimeIntoUtcTime' })
@Injectable({ providedIn: 'root' })

export class CovertTimeIntoUtcTime implements PipeTransform {

    transform(utcDate: string): string {
        if (!utcDate) {
            return null;
        }
            
        var result=moment.parseZone(utcDate).utcOffset().toString(); 
        console.log(result)
       
        return result;
    }
}