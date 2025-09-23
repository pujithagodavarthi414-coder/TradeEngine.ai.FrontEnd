import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
    name: "blFilterPipe"
})

export class BlFilterPipe implements PipeTransform {
    transform(blDetails: any[], purchaseQuantityForm: any, index: number, purchaseId : any): any[] {
        if (purchaseQuantityForm && (index != null || index != undefined)) {
            let blList = [];
            let purchaseQuantity = purchaseQuantityForm.value;
            if (blDetails && blDetails.length > 0) {
                blDetails.forEach((x) => {
                    if (x.purchaseId.toLowerCase() == purchaseQuantity.purchaseQuantities[index].purchaseContractId.toLowerCase()) {
                        console.log(x.blDetails);
                        blList.push(x);
                    }
                })
            }
            return blList;
        }
        else {
            return [];
        }
    }
}
