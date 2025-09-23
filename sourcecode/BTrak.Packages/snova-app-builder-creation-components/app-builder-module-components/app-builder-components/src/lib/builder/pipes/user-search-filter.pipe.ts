import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "userSearchFilter" })
@Injectable({ providedIn: 'root' })
export class UserSearchFilterPipe implements PipeTransform {
    transform(users: any[], roleIds: any[], selectedIndex : number, index : number) {
        let filteredList = [];
        if (roleIds.length == 0) {
            return users;
        } else {
            if(selectedIndex == index) {
                users.forEach((user)=> {
                    var list = user.roleIdsArray.filter((role) => roleIds.includes(role));
                    if(list.length > 0) {
                        filteredList.push(user);
                    }
                })
            } else {
                filteredList = users;
            }
           
            return filteredList;
        }

    }
}