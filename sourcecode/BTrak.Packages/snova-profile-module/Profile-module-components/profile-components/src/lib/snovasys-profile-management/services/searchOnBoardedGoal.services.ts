import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessDashboard } from '../models/processDashboard';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: 'root'
})
export class SearchOnBoardedGoalService {

    constructor(private http: HttpClient) {
    }

    private Search_OnboardedGoals_API_PATH = APIEndpoint + 'Dashboard/ProcessDashboardApi/SearchOnboardedGoals';

    SearchOnboardedGoals(): Observable<ProcessDashboard[]> {

        let paramsobj = new HttpParams().set('statusColor', ''); 
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
          params: paramsobj
        };
        var data = {statusColor : ''};

        let body = JSON.stringify(data);
        return this.http.post<ProcessDashboard[]>(`${this.Search_OnboardedGoals_API_PATH}` , body, httpOptions)
       .pipe(map(result => {
        console.log(result);
        return result;
    }));
      }

}

