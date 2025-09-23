import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "contractTemplateTypeFilterPipe"
})

export class ContractTemplateTypeFilterPipe implements PipeTransform {
    transform(contractTemplatesList: any[], selectedTemplateTypeIds: any[]): any[] {
        if (contractTemplatesList && contractTemplatesList.length > 0 && selectedTemplateTypeIds && selectedTemplateTypeIds.length > 0) {
            let templateTypeIds = selectedTemplateTypeIds.toString();
            let filteredList = _.filter(contractTemplatesList, function (filter) {
                return templateTypeIds.toString().includes(filter.fields.ContractTypeId)
            })
            if (filteredList.length > 0) {
                return filteredList;
            }
        }
        else {
            return contractTemplatesList;
        }
    }
}
