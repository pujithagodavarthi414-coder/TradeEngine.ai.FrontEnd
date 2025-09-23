import { Pipe, PipeTransform, Injectable } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "versionnamefilter",
  pure: true
})
@Injectable({ providedIn: 'root' })
export class VersionNameFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    var userStories: any[] = [];
    // var searchText = searchText.trim();
    if (searchText) {
      searchText = searchText.trim();
    }
    if (!searchText) {
      return items;
    }
    else {
      return items.filter((x: any) =>{
        if(x.versionName){
          return  x.versionName.toLowerCase().includes(searchText.toLowerCase().trim())
        }
      }
    );
    }
  }
}
