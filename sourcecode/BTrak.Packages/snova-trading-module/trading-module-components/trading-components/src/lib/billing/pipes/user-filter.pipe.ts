import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "userFilterPipe"
})

export class UserFilterPipe implements PipeTransform {
    transform(usersList: any[], stepName: string, clientTypes: any[]): any[] {
        if (usersList.length > 0 && clientTypes.length > 0) {
            if ((stepName.toLowerCase() == "Discharge port".toLowerCase())
                || (stepName.toLowerCase() == "BL Draft".toLowerCase())
                || (stepName.toLowerCase() == "Purchase BL".toLowerCase())
                || (stepName.toLowerCase() == "Load port documents".toLowerCase())
                || (stepName.toLowerCase() == "Load port surveyor inspection report".toLowerCase())
                || (stepName.toLowerCase() == "Documents per Shipping Instruction".toLowerCase())
                || (stepName.toLowerCase() == "Presentation of documents".toLowerCase())
                || (stepName.toLowerCase() == "Discharge  Port Surveyor inspection report".toLowerCase())
                || (stepName.toLowerCase() == "Discharge Port Surveyor inspection report".toLowerCase())
                || (stepName.toLowerCase() == "Pre-Check of Documents".toLowerCase())
                || (stepName.toLowerCase() == "Lifting of Subjects".toLowerCase()
                || (stepName.toLowerCase() == "Switch Bill of Lading".toLowerCase()))
            ) {
                let filteredList = _.filter(usersList, function (client) {
                    return (clientTypes.toString().includes(client.clientTypeName)) && (client.kycStatusName == "Verified") 
                })
                if (filteredList.length > 0) {
                    return filteredList;
                } else {
                    return [];
                }
            }
        }
        else {
            return usersList;
        }

    }
}
