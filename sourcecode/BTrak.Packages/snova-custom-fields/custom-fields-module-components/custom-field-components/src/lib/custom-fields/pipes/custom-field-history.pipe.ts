import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "customFieldHistory"
})
@Injectable({providedIn:'root'})

export class CustomFieldHistoryPipe implements PipeTransform {
  transform(customFieldHistory: any[]): any[] {
 
        var customFieldHistoryList =  _.filter(customFieldHistory, function(s) {
            return s.newValue !=s.oldValue
          });
          return customFieldHistoryList;
    }
}