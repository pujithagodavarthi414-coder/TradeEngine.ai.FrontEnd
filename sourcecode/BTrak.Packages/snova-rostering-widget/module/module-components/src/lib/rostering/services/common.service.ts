import { Injectable, EventEmitter } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
// import { environment } from "../../globaldependencies/environments/environment";
import { Observable } from "rxjs/Observable";
import * as moment_ from "moment";
const moment = moment_;

// const APIEndpoint = environment.apiURL;
let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
let APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class CommonService {

    dateFormat: EventEmitter<any> = new EventEmitter();
    company: EventEmitter<any> = new EventEmitter();
    constructor(private http: HttpClient) { }

    GetCompanyById(companyId: string) {
        let paramsobj = new HttpParams().set('companyId', companyId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.GetCompanyById, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    GetTimeFormatById(timeFormatId: string) {
        let paramsobj = new HttpParams().set('timeFormatId', timeFormatId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.GetTimeFormatById, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    GetDateFormatById(dateFormatId: string) {
        let paramsobj = new HttpParams().set('dateFormatId', dateFormatId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get(APIEndpoint + ApiUrls.GetDateFormatById, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    convertToDate(inputDatetime) {
        if (inputDatetime == null || inputDatetime == "")
            return null;

        let dateNow = moment(inputDatetime);
        if (dateNow.isValid() && typeof (inputDatetime) != "string") {
            let formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local().toDate();
        }
        if (typeof (inputDatetime) === "string") {
            var current = new Date();
            var timeSplit = inputDatetime.toString().split(":");
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            let formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local().toDate();
        }
    }

    covertTimeIntoUtcTime(inputTime) {
        if (inputTime == null || inputTime == "")
            return null;

        let dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) != "string") {
            return moment.utc(dateNow)
        }
        if (typeof (inputTime) === "string") {
            var current = new Date();
            var timeSplit = inputTime.toString().split(":");
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            return moment.utc(current)
        }
    }

    convertUtcToLocal(inputTime) {
        if (inputTime == null || inputTime == "")
            return null;

        let dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) != "string") {
            let formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local()
        }
        if (typeof (inputTime) === "string") {
            var current = new Date();
            var timeSplit = inputTime.toString().split(":");
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            let formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local()
        }
    }

    groupBy(array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return groups;
    }
}