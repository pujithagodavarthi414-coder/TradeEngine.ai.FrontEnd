import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { ApiUrls } from "../constants/api-urls";
import { WorkspaceDashboardFilterModel } from "../models/softLabels-model";
import { Dashboard } from "../models/dashboard";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
	providedIn: "root"
})

export class WidgetService {
	constructor(private _http: HttpClient) { }

	updateDashboardName(dashboardModel: Dashboard){
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this._http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
	}

	updateworkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.UpsertWorkspaceDashboardFilter, body, httpOptions);
	}

	getWorkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetWorkspaceDashboardFilters, body, httpOptions);
	}
}
