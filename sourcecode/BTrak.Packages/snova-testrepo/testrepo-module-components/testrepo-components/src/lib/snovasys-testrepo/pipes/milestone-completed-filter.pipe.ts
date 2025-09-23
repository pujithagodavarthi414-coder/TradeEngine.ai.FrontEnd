import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: "milestoneCompleted"
})

@Injectable({ providedIn: 'root' })

export class MilestoneCompletedPipe implements PipeTransform {
    transform(items: any[], isCompleted: boolean, parameter: string): any[] {
        if (items == null || items == undefined) {
            return [];
        }
        if (!items) {
            return items;
        }
        let filteredItems = [];
        if (parameter == "milestone") {
            items.forEach((item: any) => {
                if (item.isCompleted === isCompleted)
                    filteredItems.push(item);
            });
        }
        else if (parameter == "testrun") {
            items.forEach((item: any) => {
                if (item.isCompleted === isCompleted)
                    filteredItems.push(item);
            });
        }

        return filteredItems;
    }
}