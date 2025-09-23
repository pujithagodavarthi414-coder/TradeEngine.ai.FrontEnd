import { E } from "@angular/cdk/keycodes";
import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "tradeTemplatesFilter"
})
@Injectable({ providedIn: 'root' })
export class TradeTemplatesPipe implements PipeTransform {
    transform(tradeTemplates: any[], stepName: string, templateTypes: any[], counterPartySettings: any[]): any[] {
        if (stepName && (stepName.toLowerCase() == "Discharge port".toLowerCase() || stepName.toLowerCase() == "documents per shipping Instruction".toLowerCase()
            || stepName.toLowerCase() == 'Discharge  Port Surveyor inspection report'.toLowerCase()
            || stepName.toLowerCase() == 'Discharge Port Surveyor inspection report'.toLowerCase()
            || stepName.toLowerCase() == "Presentation of Documents".toLowerCase() || stepName.toLowerCase() == "Load port documents".toLowerCase() || stepName.toLowerCase() == "Pre-Check of documents".toLowerCase()
            || stepName.toLowerCase() == "Discharge Port Surveyor inspection report".toLowerCase())) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "File Uploader".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "File UploaderTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }
            }

        } else if (stepName && (stepName.toLowerCase() == "BL Draft".toLowerCase() || stepName.toLowerCase() == "Purchase BL".toLowerCase())) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => (x.templateTypeName.toLowerCase() == "BL Draft".toLowerCase()) || (x.templateTypeName.toLowerCase() == "Purchase BL".toLowerCase()));
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return (filter.key.toLowerCase() == "BL DraftTemplate".toLowerCase() || filter.key.toLowerCase() == "Purchase BLTemplate".toLowerCase())
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }

            }
        } else if (stepName && stepName.toLowerCase() == "Letter of indemnity for Discharging Cargo".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "LOI for Discharging Cargo".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "LOI for Discharging CargoTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList
                    }
                    else {
                        return filteredList;
                    }
                } else {
                    return filteredList;
                }
            }
        } else if (stepName && (stepName.toLowerCase() == "Invoice from Seller".toLowerCase() || stepName.toLowerCase() == "Invoice from Supplier".toLowerCase() || stepName.toLowerCase() == "Invoice from Commodity Broker Sales Side".toLowerCase())) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "Invoice".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "InvoiceTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    } else {
                        return [];
                    }

                } else {
                    return [];
                }
            }
        }
        else if (stepName && stepName.toLowerCase() == "Letter of indemnity for switching BLs".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "LOI For Switching BLs".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "LOI For Switching BLsTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        } else if (stepName && stepName.toLowerCase() == "Shipping Instructions".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "Shipping Instructions".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "Shipping InstructionsTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        } else if (stepName && stepName.toLowerCase() == "Laytime calculation".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "Laytime calculation".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "Laytime CalculationTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        } else if (stepName && stepName.toLowerCase() == "Shipment Tender".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "Shipment Tender".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "Shipment TenderTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList;
                    } else {
                        return [];
                    }

                } else {
                    return [];
                }
            }
        } else if (stepName && stepName.toLowerCase() == "Invoice to Buyer".toLowerCase()) {
            if (templateTypes.length > 0 && tradeTemplates.length > 0) {
                let templateTemplates = templateTypes;
                let tradeTemplatesList = tradeTemplates;
                var tradeTemplate = templateTemplates.filter(x => x.templateTypeName.toLowerCase() == "Invoice to Buyer".toLowerCase());
                var filteredList = tradeTemplatesList.filter(obj => obj.fields.TemplateTypeId == tradeTemplate[0].templateTypeId);
                if (counterPartySettings && counterPartySettings.length > 0) {
                    let filteredSettings = _.filter(counterPartySettings, function (filter) {
                        return filter.key.toLowerCase() == "Invoice to BuyerTemplate".toLowerCase()
                    });
                    if (filteredSettings.length > 0) {
                        let templateIds = filteredSettings[0].value;
                        filteredList = _.filter(filteredList, function (filter) {
                            return templateIds.toString().includes(filter.tradeTemplateId);
                        })
                        return filteredList
                    }
                    else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
        } else {
            return [];
        }
    }
}
