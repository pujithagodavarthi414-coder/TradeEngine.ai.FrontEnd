import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'heatmapdatepipe' })

@Injectable({
    providedIn: "root"
})

export class HeatMapDatePipe implements PipeTransform {

    constructor(private datepipe: DatePipe) {}

    transform(date: any[]): any[] {
        if (!date) {
            return null;
        }

        let dateModel = date.map(x => this.datepipe.transform(x,"dd-MMM-yyyy"));
        
        return dateModel;
    }
}