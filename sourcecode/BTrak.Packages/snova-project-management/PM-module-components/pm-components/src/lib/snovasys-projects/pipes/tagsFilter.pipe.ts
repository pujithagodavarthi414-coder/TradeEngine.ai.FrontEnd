import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "tagsFilter"
})
@Injectable({ providedIn: 'root' })
export class TagsFilterPipe implements PipeTransform {
    transform(tagsList: any[],  selectedTags: any[]): any[] {
        if (selectedTags.length == 0) {
            return tagsList;
        } else {
            return _.filter(tagsList, function (s) {
                return !selectedTags.includes(s.tagId);
            });
        }

    }
}
