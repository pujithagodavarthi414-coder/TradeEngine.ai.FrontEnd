import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
@Pipe({ name: 'monthOrderByPipe' })
export class MonthOrderByPipe implements PipeTransform {

    transform(months: any[], sortColumn: string): any[] {
        if (months && months.length > 0) {
            months = months.sort((a, b) => a[sortColumn] < b[sortColumn] ? -1 : a[sortColumn] > b[sortColumn] ? 1 : 0);
            // months = months.sort((notificationSortAscModel, notificationSortDescModel) => {
            //     return notificationSortDescModel.notificationCreatedDateTime - notificationSortAscModel.notificationCreatedDateTime;
            // });
            return months;
        }
    }
}