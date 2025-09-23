import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { WorkspaceDashboardFilterModel } from "../models/softLabels-model";
import { CustomQueryModel } from "../models/hr-models/custom-query-model";
import { DashboardConfiguration } from "../models/hr-models/dashboard-configuration.model";
import { ProjectList } from "../models/projectlist";
// import { environment } from "../../../../environments/environment";
import { CustomAppFilter } from "../models/customAppFilter";
import { CustomWidgetList } from "../models/customWidgetList";
import { DashboardList } from "../models/dashboardList";
import { DuplicateDashboardModel } from "../models/DuplicateDashboardModel";
import { WidgetList } from "../models/widgetlist";
import { WorkspaceList } from "../models/workspaceList";
import { DynamicDashboardFilterModel } from "../models/dynamicDashboardFilerModel";
import { Dashboard } from "../Models/dashboard";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { CustomTagsModel } from "../models/custom-tags-model";
import { CustomWidgetsModel } from   "../models/hr-models/custom-widget-model";
import { ApiUrls } from '../constants/api-urls';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
	providedIn: "root"
})

export class WidgetService {
	private Get_All_Widgets = "Widgets/WidgetsApi/GetWidgets";
	private Get_Widgets_Based_On_User = "Widgets/WidgetsApi/GetWidgetsBasedOnUser";
	private Get_All_Workspaces = "Widgets/WidgetsApi/GetWorkspaces";
	private Upsert_Workspaces = "Widgets/WidgetsApi/UpsertWorkspace";
	private Delete_Workspace = "Widgets/WidgetsApi/DeleteWorkspace";
	private Get_Dashboard = "Widgets/WidgetsApi/GetDashboards";
	private Upsert_Dashboard = "Widgets/WidgetsApi/UpdateDashboard";
	private Update_Dashboard_visualisation = ApiUrls.UpsertDashboardVisuaizationType;
	private Insert_Dashboard = "Widgets/WidgetsApi/InsertDashboard";
	private Get_Custom_Widgets_Based_On_User = "Widgets/WidgetsApi/GetCustomWidgetsBasedOnUser";
	private Get_Custom_Widget_Data = "Widgets/WidgetsApi/GetCustomGridData";
	private Upsert_Custom_Widget_Subquery = "Widgets/WidgetsApi/UpsertCustomWidgetSubQuery";
	private Upsert_Dashboard_Filter = "Widgets/WidgetsApi/UpsertCustomAppFilter";
	private Upsert_Dashboard_Configuration = "Widgets/WidgetsApi/UpsertDashboardConfiguration";
	private Get_Dashboard_Configurations = "Widgets/WidgetsApi/GetDashboardConfigurations";
	private Get_SubQuery_Types = "Widgets/WidgetsApi/GetSubQueryTypes";
	private Get_Custom_Tags = "Widgets/WidgetsApi/GetWidgetTags";
	private Execute_Custom_query = ApiUrls.GetWidgetDynamicQueryResult;
	private Set_As_Default_Persistance = ApiUrls.SetAsDefaultDashboardPersistance;
	private Reset_To_Default_Persistance = ApiUrls.ResetToDefaultDashboard;
	private Get_Projects = ApiUrls.GetProjects;
	private Get_WorkSpace_Filters = ApiUrls.GetWorkSpaceFilters;
	private Insert_Duplicate_dashboard = ApiUrls.InsertDuplicateDashboard;
	private Set_As_Default_Dashboard = ApiUrls.SetDefaultDashboardForUser;
	private Upsert_Tags_ReOrder = ApiUrls.ReOrderTags;


	constructor(private _http: HttpClient) { }

	public selectedApp = new EventEmitter<{obj:any,id:any}>();
	public selectedWorkspace = new Subject<any>();

	sendMessage(obj,id) {
        this.selectedApp.emit({obj:obj, id:id });
	}

	getCustomTags(isFromSearch) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		let paramsobj = new HttpParams().set("isFromSearch", isFromSearch);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsobj
		};
		return this._http.get(`${APIEndpoint + this.Get_Custom_Tags}`, httpOptions)
		.pipe(
		  map(result => {
			return result;
		  })
		);
	}
	
	getSubQueryTypes() {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		return this._http.get<any>(
			`${APIEndpoint + this.Get_SubQuery_Types}`,
			httpOptions
		  );
	}

	GetWidgetList(widget: WidgetList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${APIEndpoint + this.Get_All_Widgets}`, body, httpOptions);
	}

	GetWidgetsBasedOnUser(widget: WidgetList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${APIEndpoint + this.Get_Widgets_Based_On_User}`, body, httpOptions);
	}

	reOrderTags(TagIdList: string[]) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(TagIdList);
    
        return this._http.post(`${APIEndpoint + this.Upsert_Tags_ReOrder}`, body, httpOptions);
      }

	GetWorkspaceList(workspace: WorkspaceList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${APIEndpoint + this.Get_All_Workspaces}`, body, httpOptions);
	}

	UpsertWorkspace(workspace: WorkspaceList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${APIEndpoint + this.Upsert_Workspaces}`, body, httpOptions);
	}

	DeleteWorkspace(workspace: WorkspaceList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${APIEndpoint + this.Delete_Workspace}`, body, httpOptions);
	}

	GetDashboardList(dashboard: DashboardList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${APIEndpoint + this.Get_Dashboard}`, body, httpOptions);
	}

	GetCustomizedDashboardId(dashboard: DashboardList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(APIEndpoint + ApiUrls.GetCustomizedDashboardId, body, httpOptions);
	}


	updateDashboard(dashboard: DashboardList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${APIEndpoint + this.Upsert_Dashboard}`, body, httpOptions);
	}

	UpsertDashboardVisuaizationType(dashboard: DashboardList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${APIEndpoint + this.Update_Dashboard_visualisation}`, body, httpOptions);
	}

	InsertDashboard(dashboard: DashboardList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${APIEndpoint + this.Insert_Dashboard}`, body, httpOptions);
	}

	GetCustomWidgetsBasedOnUser(widget: CustomWidgetList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${APIEndpoint + this.Get_Custom_Widgets_Based_On_User}`, body, httpOptions);
	}

	GetCustomWidgetData(widget: CustomWidgetsModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${APIEndpoint + this.Get_Custom_Widget_Data}`, body, httpOptions);
	}

	UpsertCustomWidgetSubQuery(widget: CustomWidgetList) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		return this._http.post(`${APIEndpoint + this.Upsert_Custom_Widget_Subquery}`, widget, httpOptions)
		.pipe(map((result) => {
			return result;
		}));
	}

	UpsertDashboardFilter(AppFilter: CustomAppFilter) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(AppFilter);

		return this._http.post(`${APIEndpoint + this.Upsert_Dashboard_Filter}`, body, httpOptions);
	}

	GetCustomWidgetQueryResult(AppFilter: CustomQueryModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(AppFilter);

		return this._http.post(`${APIEndpoint + this.Execute_Custom_query}`, body, httpOptions);
	}

	UpsertDashboardConfiguration(dashboardConfiguration: DashboardConfiguration) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${APIEndpoint + this.Upsert_Dashboard_Configuration}`, body, httpOptions);
	}

	GetDashboardConfigurations(dashboardConfiguration: DashboardConfiguration) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${APIEndpoint + this.Get_Dashboard_Configurations}`, body, httpOptions);
	}

	SetAsDefaultDashboardPersistance(workspaceId: string) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const dashboardConfiguration = {
			workspaceId
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${APIEndpoint + this.Set_As_Default_Persistance}`, body, httpOptions);
	}

	ResetToDefaultDashboardPersistance(workspaceId: string) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const dashboardConfiguration = {
			workspaceId
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${APIEndpoint + this.Reset_To_Default_Persistance}`, body, httpOptions);
	}

	GetProjects() {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const getTestrailProjectsInputModel = new ProjectList();
		getTestrailProjectsInputModel.isArchived = false;

		const body = JSON.stringify(getTestrailProjectsInputModel);

		return this._http.post(`${APIEndpoint + this.Get_Projects}`, body, httpOptions);
	}

	GetWorkSpaceFilters(workspaceFilterInputModel: any) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspaceFilterInputModel);

		return this._http.post(`${APIEndpoint + this.Get_WorkSpace_Filters}`, body, httpOptions);
	}

	InsertDuplicateDashboard(dashboardModel: DuplicateDashboardModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${APIEndpoint + this.Insert_Duplicate_dashboard}`, body, httpOptions);
	}

	SetAsUserDefaultDashboard(dashboardModel: DuplicateDashboardModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${APIEndpoint + this.Set_As_Default_Dashboard}`, body, httpOptions);
	}

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

	UpsertCustomDashboardFilter(dashboardFilterModel: DynamicDashboardFilterModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.UpsertDashboardFilter, body, httpOptions);
	}

	GetCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetDashboardFilters, body, httpOptions);
	}

	GetAllCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetAllDashboardFilters, body, httpOptions);
	}

	
	GetCustomTags(customApplicationModel: CustomTagsModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
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
		  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    	let APIEndpoint = environment.apiURL;
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
}
