import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DashboardList } from '../models/dashboardList';



const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
	providedIn: "root"
})

export class WidgetService {
	
	private Get_Dashboard = APIEndpoint + "Widgets/WidgetsApi/GetDashboards";
	


	constructor(private _http: HttpClient) { }

	public widget: any;
	public selectedApp = new EventEmitter<{obj:any,id:any}>();
	public selectedWorkspace = new Subject<any>();

	sendMessage(obj,id) {
        this.selectedApp.emit({obj:obj, id:id });
	}

	GetDashboardList(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Get_Dashboard}`, body, httpOptions);
	}

	GetCustomizedDashboardId(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(APIEndpoint + ApiUrls.GetCustomizedDashboardId, body, httpOptions);
	}


}
