import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: "auditArchive"
})
@Injectable({providedIn: 'root'})
export class AuditArchivePipe implements PipeTransform {
    transform(items: any[], isArchived: boolean, parameter: string): any[] {
        if (!items) {
            return [];
        }
        if (isArchived == null || isArchived == undefined) {
            return items;
        }
        let filteredItems = [];
        if (parameter == "audit") {
            items.forEach((item: any) => {
                if (item.isArchived === isArchived)
                    filteredItems.push(item);
            });
        }
        if (parameter == "conduct") {
            items.forEach((item: any) => {
                if (item.isArchived === isArchived)
                    filteredItems.push(item);
            });
        }
        if (parameter == "auditreport") {
            items.forEach((item: any) => {
                if (item.isArchived === isArchived)
                    filteredItems.push(item);
            });
        }
        return filteredItems;
    }
}
