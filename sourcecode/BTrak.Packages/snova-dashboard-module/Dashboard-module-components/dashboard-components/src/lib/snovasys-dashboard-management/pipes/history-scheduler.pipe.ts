import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthscheduler' })
export class MonthScheduler implements PipeTransform {
    transform(title: string): string {
        if (!title) {
            return null;
        }

        const array = title.split(',');
        array.splice(3,1);
        return array.toString();
    }
}