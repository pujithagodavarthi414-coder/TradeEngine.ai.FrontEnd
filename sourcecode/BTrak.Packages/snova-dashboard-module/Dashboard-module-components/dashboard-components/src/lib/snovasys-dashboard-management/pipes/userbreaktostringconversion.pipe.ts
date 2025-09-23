import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';
const moment = moment_;

@Pipe({ name: 'convertUserBreakToString' })
export class ConvertUserBreakToStringPipe implements PipeTransform {
    transform(userBreak: string): any {
        let userBreakArray = [];
        let userBreakString = '' ;
        let breakDetailsInJSON = JSON.parse(userBreak);
        if(breakDetailsInJSON != null){
          breakDetailsInJSON.Breaks.forEach(element => {
            element.BreakIn = moment.utc(element.BreakIn).local().format("HH:mm");
            element.BreakOut = moment.utc(element.BreakOut).local().format("HH:mm");
            if(element.BreakDifference != null && element.BreakDifference != undefined)
                userBreakString = element.BreakIn+'-'+ element.BreakOut+'( '+ element.BreakDifference +' )';
            else
                userBreakString = element.BreakIn
            userBreakArray.push(userBreakString);
          })
          userBreakArray.join();
        }
        return userBreakArray;
    }
}