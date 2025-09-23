import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({ name: "auditTags" })

@Injectable({ providedIn: 'root' })

export class AuditTagsPipe implements PipeTransform {
    transform(items: any[], searchTagsText: string, parameter: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchTagsText || searchTagsText.trim() == '') {
            return items;
        }
        let filteredItems = [];
        if (parameter == "conductTags") {
            for (let i = 0; i < items.length; i++) {
                let tagsModel = items[i].auditTagsModels;
                if (tagsModel && tagsModel.length > 0) {
                    for (let j = 0; j < tagsModel.length; j++) {
                        if (tagsModel[j].tagName.toLowerCase().indexOf(searchTagsText.toLowerCase().trim()) != -1) {
                            filteredItems.push(items[i]);
                            break;
                        }
                    }
                }
            }
        }
        return filteredItems;
    }
}
