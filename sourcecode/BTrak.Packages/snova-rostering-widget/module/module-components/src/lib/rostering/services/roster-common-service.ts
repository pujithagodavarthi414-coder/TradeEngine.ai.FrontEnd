import { Injectable, EventEmitter } from "@angular/core";
import { RosterWorkingDay } from "../models/roster-workday-model";
import { addDays } from "date-fns";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class RosterCommonService {

    exportPDF: EventEmitter<any> = new EventEmitter();
    exportEXCEL: EventEmitter<any> = new EventEmitter();
    exportPDFsubject: Subject<Object> = new Subject<Object>();

    constructor() { }

    roundtoTwo(roundingValue) {
        return Math.round((roundingValue + Number.EPSILON) * 100) / 100;
    }

    getDates(startDate, endDate) {
        let allDays = [];
        let refDate = startDate.toDate();
        while (refDate <= endDate) {
            const workingDay = new RosterWorkingDay();
            workingDay.reqDate = refDate;
            allDays.push(workingDay);
            refDate = addDays(refDate, 1);
        }
        return allDays;
    }
}
