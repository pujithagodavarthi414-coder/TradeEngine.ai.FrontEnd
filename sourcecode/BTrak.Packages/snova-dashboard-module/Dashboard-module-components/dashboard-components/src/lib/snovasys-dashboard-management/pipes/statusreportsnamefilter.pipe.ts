import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "statusReportsNameFilter"
})

export class StatusReportsNamePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        let filteredItems = [];
        items.forEach((item: any) => {
            if (item.formName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                filteredItems.push(item);
        });
        return filteredItems;
    }
}
