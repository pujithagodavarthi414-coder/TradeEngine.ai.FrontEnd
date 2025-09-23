import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "sprintFilter"
})
@Injectable({ providedIn: 'root' })
export class SprintFilterPipe implements PipeTransform {
    transform(sprintList: any[], sprintResponsiblePerson: any): any[] {
        if (!sprintResponsiblePerson) {
            return sprintList;
        } else {
            var goalsStatusColor = sprintResponsiblePerson.split(",");
            return _.filter(sprintList, function (s) {
                return goalsStatusColor.includes(s.sprintResponsiblePersonId);
            });
        }

    }
}
