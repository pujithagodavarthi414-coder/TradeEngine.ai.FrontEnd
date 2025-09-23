import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "userFilter" })
@Injectable({ providedIn: 'root' })
export class UserFilterPipe implements PipeTransform {
    transform(userId: string, users: any[],  isImage: boolean) {
       if(!userId) {
        return "";
       } else {
          let filteredList = _.filter(users, function(filter){
            return filter.userId == userId
          })
          if(filteredList.length > 0) {
             if(isImage) {
                return filteredList[0].profileImage;
             } else {
                return filteredList[0].fullName;
             }
          } else {
            return "";
          }
       }
    }
}