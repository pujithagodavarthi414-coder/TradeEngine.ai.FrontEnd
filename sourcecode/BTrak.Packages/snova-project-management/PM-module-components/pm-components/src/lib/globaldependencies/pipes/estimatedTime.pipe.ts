import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({ name: "estimatedTimeFilter", pure: true })

@Injectable({ providedIn: 'root' })
export class EstimatedTimeToHoursPipe implements PipeTransform {
    constructor(){}
   
    transform(estimatedTime: any) {
        let hoursInWeek = 40;
        let hoursInDay = 8;
        if(!estimatedTime){
            return '';
        }
       if(estimatedTime > 0 && estimatedTime < 8 ){
           return estimatedTime + 'h';
       }
       else if(estimatedTime > 8 && estimatedTime <40){
            var time = estimatedTime/8;
            return time.toFixed(2).replace(/\.?0*$/g,'') + 'd';
       }
       else{
        var time = estimatedTime/40;
        return time.toFixed(2).replace(/\.?0*$/g,'') + 'w';
       }
    }
}