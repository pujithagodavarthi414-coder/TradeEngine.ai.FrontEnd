import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "tradeTemplatesXs13Filter"
})
@Injectable({ providedIn: 'root' })
export class TradeTemplatesXs13Pipe implements PipeTransform {
    transform(templateList: any, tradeTemplateTypeId: string, typeName: string, counterPartySettings: any[]): any[] {
        let templateTemplates = templateList;
        var filteredList = templateTemplates.filter(obj => obj.fields.TemplateTypeId == tradeTemplateTypeId);
        if (counterPartySettings && counterPartySettings.length > 0) {
            let filteredSettings = _.filter(counterPartySettings, function (filter) {
                return filter.key == typeName + "Template"
            });
            if (filteredSettings.length > 0) {
                let templateIds = filteredSettings[0].value;
                filteredList = _.filter(filteredList, function (filter) {
                    return templateIds.toString().includes(filter.tradeTemplateId);
                })

            }
            return filteredList;
        } else {
            return [];
        }
    }
}
