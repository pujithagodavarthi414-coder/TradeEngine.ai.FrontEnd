import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: "conductCompleted"
})
@Injectable({providedIn: 'root'})
export class ConductCompletedPipe implements PipeTransform {
    transform(items: any[], isCompleted: boolean, parameter: string): any[] {
        if (items == null || items == undefined) {
            return [];
        }
        if (!items) {
            return items;
        }
        let filteredItems = [];
        if (parameter == "conduct") {
            items.forEach((item: any) => {
                if (item.isCompleted === isCompleted)
                    filteredItems.push(item);
            });
        }

        return filteredItems;
    }
}