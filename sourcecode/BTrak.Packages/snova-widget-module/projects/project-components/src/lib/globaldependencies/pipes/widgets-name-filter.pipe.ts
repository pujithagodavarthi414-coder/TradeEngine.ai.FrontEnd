import { Pipe, PipeTransform, Injectable } from "@angular/core";


@Pipe({
    name: "widgetName"
})

@Injectable({
    providedIn: "root"
})
export class WidgetNameFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, filterFrom: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        const filteredItems = [];
        if (filterFrom == "Widgets") {
            items.forEach((item: any) => {
                if (item.widgetName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1 ||
                    (item.description && item.description.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)) {
                    filteredItems.push(item);
                }
            });
        }
        if (filterFrom == "HiddenWorkspace") {
            items.forEach((item: any) => {
                if (item.workspaceName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1) {
                    filteredItems.push(item);
                }
            });
        }
        if (filterFrom == "CustomWidgets") {
            items.forEach((item: any) => {
                if (item.customWidgetName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1 ||
                    (item.description && item.description.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)) {
                    filteredItems.push(item);
                }
            });
        }
        if (filterFrom == "dashboards") {
            items.forEach((item: any) => {
                if (item.workspaceName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1) {
                    filteredItems.push(item);
                }
            });
        }
        return filteredItems;
    }
}
