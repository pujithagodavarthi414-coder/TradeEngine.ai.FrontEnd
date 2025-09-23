import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "customApplicationFilter" })
@Injectable({ providedIn: 'root' })
export class CustomApplicationFilterPipe implements PipeTransform {
    transform(customApplications: any[], formIds: any) {
        if (!formIds) {
            return customApplications
        } else {
            let selectedForms = formIds.split(",");
            let filteredList = _.filter(customApplications, function (filter) {
                return selectedForms.includes(filter.formId)
            })
            if (filteredList.length > 0) {
                return filteredList
            }
            else {
                return [];
            }
        }

    }
}