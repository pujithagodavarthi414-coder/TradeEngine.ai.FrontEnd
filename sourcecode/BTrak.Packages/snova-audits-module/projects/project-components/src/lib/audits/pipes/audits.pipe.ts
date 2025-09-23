import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: "auditName"
})
@Injectable({providedIn: 'root'})
export class AuditNamePipe implements PipeTransform {
    transform(items: any[], searchText: string, parameter: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        let filteredItems = [];
        if (parameter == "audit") {
            items.forEach((item: any) => {
                if (item.auditName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "conduct") {
            items.forEach((item: any) => {
                if (item.auditConductName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "auditcopy") {
            items.forEach((item: any) => {
                if (item.auditId.toLowerCase() != searchText.toLowerCase())
                    filteredItems.push(item);
            });
        }
        if (parameter == "auditreport") {
            items.forEach((item: any) => {
                if (item.auditReportName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        return filteredItems;
    }
}
