import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({ name: "formFilter" })
export class FormFilterPipe implements PipeTransform {
    transform(forms: any[], formIds: any) {
        if (!formIds) {
            return forms
        } else {
            let selectedForms = formIds.split(",");
            let filteredList = _.filter(forms, function (filter) {
                return selectedForms.includes(filter.id)
            })
            if(filteredList.length > 0) {
                return filteredList
            }
        }

    }
}