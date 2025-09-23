import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "appTags"
})

@Injectable({
    providedIn: "root"
})

export class AppTagsFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, fromSearch: boolean): any[] {

        if (!items || !searchText) {
            return items;
        }
        let filteredItems = [];

        if (!fromSearch) {
            if (searchText == "Other") {
                items.forEach((item: any) => {
                    if (!item.tags) {
                        filteredItems.push(item);
                    }
                });

            } else {
                items.forEach((item: any) => {
                    if (item.tags && item.tags.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1) {
                        filteredItems.push(item);
                    }
                });
            }

            return filteredItems;
        } else {
            var searchTags = searchText.split(",");
            searchTags.forEach((text: any) => {
                if (text == "Other") {
                    filteredItems = items.filter((tag) => {
                        return !tag.tags;
                    })
                } else {
                    items.forEach((item: any) => {
                        var tags = item.widgetTags;
                        var filteredList = _.filter(tags, function (s) {
                            return text == (s);
                        });
                        if (filteredList.length > 0) {
                            filteredItems.push(item);
                        }
                    });
                }

            })
            filteredItems = _.uniq(filteredItems);
            return filteredItems;

        }
    }
}
