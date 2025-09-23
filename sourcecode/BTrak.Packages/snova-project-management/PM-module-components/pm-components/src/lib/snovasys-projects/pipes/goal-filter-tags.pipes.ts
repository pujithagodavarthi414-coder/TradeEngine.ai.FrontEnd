import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";

@Pipe({
  name: "goalTagsFilter"
})
@Injectable({ providedIn: 'root' })
export class GoalTagsPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (searchText) {
        searchText = searchText.trim();
      }
      if (!searchText) {
        return items;
      }
      else{
        var filteredUserStories = items.filter((x: any) => {
            if (x.tag) {
              return x.tag.toLowerCase().includes(searchText.toLowerCase().trim())
            }
          }
          );
         return filteredUserStories;
      }
    }
  }