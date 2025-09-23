import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: 'sortBy'
})

@Injectable({ providedIn: 'root' })

export class SortByPipe implements PipeTransform {
    transform(items: any[], sortBy: string): any[] {
        if (!sortBy) {
            return items;
        }
        // else if (sortBy == "AssignToName") {
        //     return items.sort((item1, item2) => {
        //         return (item1.assignToName) ? (item1.assignToName).localeCompare(item2.assignToName) : 1;
        //     });
        // }
        else if (sortBy == "CreatedDate") {
            return items.sort((item1, item2) => {
                return <any>new Date(item2.createdDateTime) - <any>new Date(item1.createdDateTime);
            });
        }
        else if (sortBy == "TestRunName") {
            return items.sort((item1, item2) => (item1.testRunName).localeCompare(item2.testRunName));
        }
        else if (sortBy == "CompletionPercent") {
            return items.sort((item1, item2) => {
                return item2.passedPercent - item1.passedPercent
            });
        }
        else {
            return items;
        }
    }
}