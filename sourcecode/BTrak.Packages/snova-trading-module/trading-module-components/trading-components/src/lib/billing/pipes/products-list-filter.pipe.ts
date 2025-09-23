import { I } from "@angular/cdk/keycodes";
import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { filter } from "rxjs/operators";
import * as _ from "underscore";
@Pipe({
    name: "productFilterPipe"
})
@Injectable({ providedIn: 'root' })
export class ProductFilterPipe implements PipeTransform {
    transform(productId: string, productTypes: any[]): any {
      if(!productId || productTypes.length == 0) {
          return "";
      } else {
          var filteredList = _.filter(productTypes, function(filter){
              return productId.toLowerCase() == filter.productId.toLowerCase();
          })
          if(filteredList.length > 0) {
              return filteredList[0].productName;
          } else {
              return "";
          }
      }
    }
}
