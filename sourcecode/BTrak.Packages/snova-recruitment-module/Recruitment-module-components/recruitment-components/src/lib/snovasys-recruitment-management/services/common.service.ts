import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from 'rxjs/Observable';
import * as moment_ from 'moment';
const moment = moment_;

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: 'root'
})

export class CommonService {

    dateFormat: EventEmitter<any> = new EventEmitter();
    company: EventEmitter<any> = new EventEmitter();
    constructor(private http: HttpClient) { }

    GetCompanyById(companyId: string) {
        const paramsobj = new HttpParams().set('companyId', companyId);
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
        const paramsobj = new HttpParams().set('timeFormatId', timeFormatId);
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
        const paramsobj = new HttpParams().set('dateFormatId', dateFormatId);
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
        if (inputDatetime == null || inputDatetime === '') {
            return null;
        }

        const dateNow = moment(inputDatetime);
        if (dateNow.isValid() && typeof (inputDatetime) !== 'string') {
            const formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local().toDate();
        }
        if (typeof (inputDatetime) === 'string') {
            const current = new Date();
            const timeSplit = inputDatetime.toString().split(':');
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            const formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local().toDate();
        }
    }

    covertTimeIntoUtcTime(inputTime) {
        if (inputTime == null || inputTime === '') {
            return null;
        }
        const dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) !== 'string') {
            return moment.utc(dateNow);
        }
        if (typeof (inputTime) === 'string') {
            const current = new Date();
            const timeSplit = inputTime.toString().split(':');
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            return moment.utc(current);
        }
    }

    convertUtcToLocal(inputTime) {
        if (inputTime == null || inputTime === '') {
            return null;
        }

        const dateNow = moment(inputTime);
        if (dateNow.isValid() && typeof (inputTime) !== 'string') {
            const formatted = dateNow.format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local();
        }
        if (typeof (inputTime) === 'string') {
            const current = new Date();
            const timeSplit = inputTime.toString().split(':');
            current.setHours(+timeSplit[0], +timeSplit[1], null, null);
            const formatted = moment(current).format('YYYY-MM-DD HH:mm:ss');
            return moment(moment.utc(formatted).format()).local();
        }
    }

    groupBy(array, f) {
        const groups = {};
        array.forEach(function(o) {
            const group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return groups;
    }
}
