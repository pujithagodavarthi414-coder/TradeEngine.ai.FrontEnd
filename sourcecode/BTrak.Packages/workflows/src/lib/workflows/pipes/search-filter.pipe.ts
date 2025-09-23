import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "searchFilter" })
export class SearchFilterPipe implements PipeTransform {
    transform(users: any[], roleIds: any[]) {
        let filteredList = [];
        if (roleIds.length == 0) {
            return users;
        } else {
            users.forEach((user)=> {
                var list = user.roleIdsArray.filter((role) => roleIds.includes(role));
                if(list.length > 0) {
                    filteredList.push(user);
                }
            })
            return filteredList;
        }

    }
}