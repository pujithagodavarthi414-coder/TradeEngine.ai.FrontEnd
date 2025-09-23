import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "tradeTemplateTypeFilterPipe"
})

export class TradeTemplateTypeFilterPipe implements PipeTransform {
    transform(tradeTemplatesList: any[], selectedTemplateTypeIds: any[]): any[] {
        if (tradeTemplatesList && tradeTemplatesList.length > 0 && selectedTemplateTypeIds && selectedTemplateTypeIds.length > 0) {
            let templateTypeIds = selectedTemplateTypeIds.toString();
            let filteredList = _.filter(tradeTemplatesList, function(filter){
                return templateTypeIds.toString().includes(filter.fields.TemplateTypeId)
            })
            if(filteredList.length > 0) {
                return filteredList;
            }
        }
        else {
            return tradeTemplatesList;
        }
    }
}
