import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import * as _ from "underscore";

@Pipe
({
     name: "activityEmployeeRoleFilter"
})

@Injectable({
    providedIn: 'root',
  })
  
export class ActivityEmployeeRoleFilterPipe implements PipeTransform {
    constructor(public translateService: TranslateService) { }
    transform(userList: any[], rolesList: any[]){
        if (rolesList.length == 0) {
            return userList;
        } else {
        var returnList: any;
        returnList = [];
        rolesList.map(r => {
            userList.map( (user) => {
                // tslint:disable-next-line: prefer-const
                var uRole = user.role.split(",");
                // if (r.includes(uRole))
                if (uRole.includes(r)) {
                    returnList.push(user);
                }
            });
        })
       // return returnList;
        var unique = new Set(returnList);
    //    return returnList;
        return unique;
    }
    }
}
