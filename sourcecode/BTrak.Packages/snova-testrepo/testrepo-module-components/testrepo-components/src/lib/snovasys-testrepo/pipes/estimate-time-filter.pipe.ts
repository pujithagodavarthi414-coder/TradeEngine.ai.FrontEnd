import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: "estimationTime"
})

@Injectable({ providedIn: 'root' })

export class EstimationTimePipe implements PipeTransform {
    transform(estimateTime: any): string {
        let finalString = '';
        if (estimateTime != null && estimateTime != undefined && estimateTime != '' && estimateTime != 0) {
            let noOfSecondsInADay = 28800;
            let noOfSecondsInAnHour = 3600;
            let noOfSecondsInAMinute = 60;
            let remainingTime = estimateTime;
            let days = Math.floor(remainingTime / noOfSecondsInADay);
            remainingTime = remainingTime - (days * noOfSecondsInADay);
            let hours = Math.floor(remainingTime / noOfSecondsInAnHour);
            remainingTime = remainingTime - (hours * noOfSecondsInAnHour);
            if (days > 0) {
                if (days == 1)
                    finalString = finalString + days + ' day ';
                else
                    finalString = finalString + days + ' days ';
            }
            if (hours > 0) {
                if (hours == 1)
                    finalString = finalString + hours + ' hour ';
                else
                    finalString = finalString + hours + ' hours ';
            }
            if (remainingTime > 0) {
                let minutes = Math.floor(remainingTime / 60);
                remainingTime = remainingTime - (minutes * noOfSecondsInAMinute);
                if (minutes > 0) {
                    if (minutes == 1)
                        finalString = finalString + minutes + ' minute ';
                    else
                        finalString = finalString + minutes + ' minutes ';
                }
                if (remainingTime > 0) {
                    if (remainingTime == 1)
                        finalString = finalString + remainingTime + ' second';
                    else
                        finalString = finalString + remainingTime + ' seconds';
                }
            }
        }
        return finalString;
    }
}
