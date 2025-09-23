import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as moment from "moment";

@Pipe({
    name: 'dateFilter'
})

@Injectable({ providedIn: 'root' })

export class DateFilterPipe implements PipeTransform {

    transform(items: any[], datefrom?: any, dateto?: any): any[] {
        let filteredItems = [];
        if (!datefrom && !dateto) {
            return items;
        }
        if (!datefrom && dateto) {
            datefrom = new Date("December 5, 1990 12:00:00");
        }
        if (datefrom && !dateto) {
            dateto = new Date();
        }
        let startDate = new Date(datefrom);
        let endDate = new Date(dateto);
        endDate.setDate(endDate.getDate() + 1);
        console.log(startDate + " " + endDate);
        items.forEach((item: any) => {
            if (new Date(moment.utc(item.createdDateTime).local().format()) >= startDate && new Date(moment.utc(item.createdDateTime).local().format()) <= endDate)
                filteredItems.push(item);
        });

        return filteredItems;

    }
}