import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { Subscription, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RecentSearchModel, SearchTaskTypeModel } from "../models/RecentSearchModel";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { RecentSearchApiModel } from '../models/recentSearchApiModel';

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})

export class RecentSearchService {
  constructor(private http: HttpClient) { }

  // insertRecentSearch(search: string) {
  //   let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  //   let APIEndpoint = environment.apiURL;
  //   return this.http.post(APIEndpoint + "RecentSearch/RecentSearchApi/InsertRecentSearch" + "?search=" + search, httpOptions);
  // }

  getSearchMenuItems(search: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let data = new HttpParams();
    data = data.append('ItemId', search.itemId);
    data = data.append('SearchText', search.searchText);
    data = data.append('SearchUniqueId', search.searchUniqueId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: data
    };
    return this.http.get<any[]>(APIEndpoint + "RecentSearch/RecentSearchApi/GetSearchMenuItems", httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  insertRecentSearch(search: RecentSearchApiModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		  };
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		let body = JSON.stringify(search);
		// return this._http.post(APIEndpoint + "RecentSearch/RecentSearchApi/InsertRecentSearch" + "?search=" + search.name
		// + "?searchType=" + search.recentSearchType, httpOptions);
		return this.http.post(APIEndpoint + "RecentSearch/RecentSearchApi/InsertRecentSearch",body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	  }

  getRecentSearch(): Observable<RecentSearchModel[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.get<any[]>(APIEndpoint + "RecentSearch/RecentSearchApi/GetRecentSearch", httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchGoalTasks(searchText: string): Observable<SearchTaskTypeModel[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: new HttpParams().set('searchText', searchText)
    };
    return this.http.get<SearchTaskTypeModel[]>(APIEndpoint + "RecentSearch/RecentSearchApi/SearchGoalTasks", httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchMenuData(retrieveDashboards: boolean) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: new HttpParams().set('getDashboards', retrieveDashboards.toString())
    };
    return this.http.get(APIEndpoint + "RecentSearch/RecentSearchApi/GetSearchMenuData", httpOptions)
    .pipe(map(result => {
      return result;
    }));
  }

}