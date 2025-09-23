import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";
import { CustomTagsModel } from "../models/custom-tags-model";
import { Dashboard } from "../models/dashboard";
import { DashboardList, WorkspaceDashboardFilterModel } from "../models/dashboardList";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
	providedIn: "root"
})

export class WidgetService {
	private Get_All_Widgets = APIEndpoint + "Widgets/WidgetsApi/GetWidgets";
	private Get_Widgets_Based_On_User = APIEndpoint + "Widgets/WidgetsApi/GetWidgetsBasedOnUser";
	private Get_All__Widgets = APIEndpoint + "Widgets/WidgetsApi/GetAllWidgets";
	private Get_All_Workspaces = APIEndpoint + "Widgets/WidgetsApi/GetWorkspaces";
	private Upsert_Workspaces = APIEndpoint + "Widgets/WidgetsApi/UpsertWorkspace";
	private Delete_Workspace = APIEndpoint + "Widgets/WidgetsApi/DeleteWorkspace";
	private Get_Dashboard = APIEndpoint + "Widgets/WidgetsApi/GetDashboards";
	private Upsert_Dashboard = APIEndpoint + "Widgets/WidgetsApi/UpdateDashboard";
	private Update_Dashboard_visualisation = APIEndpoint + ApiUrls.UpsertDashboardVisuaizationType;
	private Insert_Dashboard = APIEndpoint + "Widgets/WidgetsApi/InsertDashboard";
	private Get_Custom_Widgets_Based_On_User = APIEndpoint + "Widgets/WidgetsApi/GetCustomWidgetsBasedOnUser";
	private Get_Custom_Widget_Data = APIEndpoint + "Widgets/WidgetsApi/GetCustomGridData";
	private Upsert_Custom_Widget_Subquery = APIEndpoint + "Widgets/WidgetsApi/UpsertCustomWidgetSubQuery";
	private Upsert_Dashboard_Filter = APIEndpoint + "Widgets/WidgetsApi/UpsertCustomAppFilter";
	private Upsert_Dashboard_Configuration = APIEndpoint + "Widgets/WidgetsApi/UpsertDashboardConfiguration";
	private Get_Dashboard_Configurations = APIEndpoint + "Widgets/WidgetsApi/GetDashboardConfigurations";
	private Get_SubQuery_Types = APIEndpoint + "Widgets/WidgetsApi/GetSubQueryTypes";
	private Get_Custom_Tags = APIEndpoint + "Widgets/WidgetsApi/GetWidgetTags";
	private Set_As_Default_Persistance = APIEndpoint + ApiUrls.SetAsDefaultDashboardPersistance;
	private Reset_To_Default_Persistance = APIEndpoint + ApiUrls.ResetToDefaultDashboard;
	private Get_Projects = APIEndpoint + ApiUrls.GetProjects;
	private Get_WorkSpace_Filters = APIEndpoint + ApiUrls.GetWorkSpaceFilters;
	private Insert_Duplicate_dashboard = APIEndpoint + ApiUrls.InsertDuplicateDashboard;
	private Set_As_Default_Dashboard = APIEndpoint + ApiUrls.SetDefaultDashboardForUser;
	

	constructor(private _http: HttpClient) { }

	public widget: any;
	public selectedApp = new EventEmitter<{obj:any,id:any}>();
	public selectedWorkspace = new Subject<any>();

	sendMessage(obj,id) {
        this.selectedApp.emit({obj:obj, id:id });
	}

	
	updateDashboardName(dashboardModel: Dashboard){
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this._http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
	}



	getCustomTags(isFromSearch) {
		let paramsobj = new HttpParams().set("isFromSearch", isFromSearch);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsobj
		};
		return this._http.get(`${this.Get_Custom_Tags}`, httpOptions)
		.pipe(
		  map(result => {
			return result;
		  })
		);
	}
	
	getSubQueryTypes() {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		return this._http.get<any>(
			`${this.Get_SubQuery_Types}`,
			httpOptions
		  );
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


	updateDashboard(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Upsert_Dashboard}`, body, httpOptions);
	}

	UpsertDashboardVisuaizationType(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Update_Dashboard_visualisation}`, body, httpOptions);
	}

	InsertDashboard(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Insert_Dashboard}`, body, httpOptions);
	}


	SetAsDefaultDashboardPersistance(workspaceId: string) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const dashboardConfiguration = {
			workspaceId
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${this.Set_As_Default_Persistance}`, body, httpOptions);
	}

	ResetToDefaultDashboardPersistance(workspaceId: string) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const dashboardConfiguration = {
			workspaceId
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${this.Reset_To_Default_Persistance}`, body, httpOptions);
	}

	GetWorkSpaceFilters(workspaceFilterInputModel: any) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspaceFilterInputModel);

		return this._http.post(`${this.Get_WorkSpace_Filters}`, body, httpOptions);
	}


	updateworkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.UpsertWorkspaceDashboardFilter, body, httpOptions);
	}

	getWorkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetWorkspaceDashboardFilters, body, httpOptions);
	}

	GetCustomTags(customApplicationModel: CustomTagsModel) {
		const httpOptions = {
		  headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(customApplicationModel);
		return this._http.post(
		  `${APIEndpoint + ApiUrls.GetCustomApplicationTag}`,
		  body,
		  httpOptions
		);
	  }
	
	  GetCustomApplicationTagKeys(customApplicationModel: CustomTagsModel) {
		const httpOptions = {
		  headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(customApplicationModel);
		return this._http.post(
		  `${APIEndpoint + ApiUrls.GetCustomApplicationTagKeys}`,
		  body,
		  httpOptions
		);
	  }

	  upsertAuditQuestionHistory(dashboard: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(APIEndpoint + ApiUrls.UpsertAuditQuestionHistory, body, httpOptions);
	}
}
