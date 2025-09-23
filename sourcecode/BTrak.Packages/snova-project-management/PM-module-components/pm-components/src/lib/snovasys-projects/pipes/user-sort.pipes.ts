import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "userSortFilter",
    pure: true
})
@Injectable({ providedIn: 'root' })
export class UserSortFilter implements PipeTransform {
    transform(users: any[]): any[] {
            return _.filter(users, function (s) {
                return !s.email.toLowerCase().includes('support@snovasys.com');
            });
    }
}
