import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
import { BoardTypeIds } from '../../globaldependencies/constants/board-types';

@Pipe({
    name: "boardTypesFilter"
})
//@Injectable({ providedIn: 'root' })
export class BoardTypesFilter implements PipeTransform {
    transform(boardTypes: any[],  isActive: boolean): any[] {
        if (!isActive) {
            return boardTypes;
        } else {
            return _.filter(boardTypes, function (s) {
                return s.isSuperAgileBoard == false || s.isSuperAgileBoard == null;
            });
        }

    }
}
