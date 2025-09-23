import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "tradeTemplatesFilterPipe"
})

export class TradeTemplatesFilterPipe implements PipeTransform {
    transform(tradeTemplatesList: any[], counterPartySettings: any, isDebitNote: boolean, isCreditNote: boolean, isFromVessel: boolean): any[] {
        if (isDebitNote == true) {
            if (counterPartySettings && counterPartySettings.length > 0) {
                let filteredSettings = [];
                if (isFromVessel == true) {
                    filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key == "Debit-VesselTemplate"
                    });
                } else {
                    filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key == "DebitTemplate"
                    });
                }

                if (filteredSettings.length > 0) {
                    let templateIds = filteredSettings[0].value;
                    let filteredList = _.filter(tradeTemplatesList, function (filter) {
                        return templateIds.toString().includes(filter.tradeTemplateId);
                    })
                    return filteredList;
                }
                else {
                    return [];
                }
            } else {
                return []
            }
        } else if (isCreditNote == true) {
            if (counterPartySettings && counterPartySettings.length > 0) {
                let filteredSettings = [];
                if (isFromVessel == true) {
                    filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key == "Credit-VesselTemplate"
                    });
                } else {
                    filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key == "CreditTemplate"
                    });
                }

                if (filteredSettings.length > 0) {
                    let templateIds = filteredSettings[0].value;
                    let filteredList = _.filter(tradeTemplatesList, function (filter) {
                        return templateIds.toString().includes(filter.tradeTemplateId);
                    })
                    return filteredList;
                }
                else {
                    return [];
                }
            } else {
                return []
            }
        }
        return tradeTemplatesList;
    }
}
