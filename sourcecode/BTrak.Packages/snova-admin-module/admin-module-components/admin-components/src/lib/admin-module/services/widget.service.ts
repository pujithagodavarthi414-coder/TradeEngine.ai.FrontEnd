import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Dashboard, DuplicateDashboardModel } from "../Models/dashboard";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { WidgetList } from '../models/widgetlist';
import { WorkspaceList } from '../models/workspaceList';
import { DashboardList } from '../models/dashboardList';
import { CustomWidgetList } from '../models/customWidgetList';
import { CustomWidgetsModel } from '../models/hr-models/custom-widget-model';
import { CustomAppFilter } from '../models/customAppFilter';
import { CustomQueryModel } from '../models/hr-models/custom-query-model';
import { DashboardConfiguration } from '../models/hr-models/dashboard-configuration.model';
import { ProjectList } from '../models/projectlist';
import { WorkspaceDashboardFilterModel } from '../models/hr-models/softlabels-model';
import { DynamicDashboardFilterModel } from '../models/dynamicDashboardFilerModel';
import { CustomTagsModel } from '../models/customTagsModel';


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
	private Execute_Custom_query = APIEndpoint + ApiUrls.GetWidgetDynamicQueryResult;
	private Set_As_Default_Persistance = APIEndpoint + ApiUrls.SetAsDefaultDashboardPersistance;
	private Reset_To_Default_Persistance = APIEndpoint + ApiUrls.ResetToDefaultDashboard;
	private Get_Projects = APIEndpoint + ApiUrls.GetProjects;
	private Get_WorkSpace_Filters = APIEndpoint + ApiUrls.GetWorkSpaceFilters;
	private Insert_Duplicate_dashboard = APIEndpoint + ApiUrls.InsertDuplicateDashboard;
	private Set_As_Default_Dashboard = APIEndpoint + ApiUrls.SetDefaultDashboardForUser;
	private Upsert_Tags_ReOrder = APIEndpoint + ApiUrls.ReOrderTags;


	constructor(private _http: HttpClient) { }

	public widget: any;
	public selectedApp = new EventEmitter<{obj:any,id:any}>();
	public selectedWorkspace = new Subject<any>();

	sendMessage(obj,id) {
        this.selectedApp.emit({obj:obj, id:id });
	}

	GetAllWidgets(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_All__Widgets}`, body, httpOptions);
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

	GetWidgetList(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_All_Widgets}`, body, httpOptions);
	}

	GetWidgetsBasedOnUser(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Widgets_Based_On_User}`, body, httpOptions);
	}

	reOrderTags(TagIdList: string[]) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
    
        let body = JSON.stringify(TagIdList);
    
        return this._http.post(`${this.Upsert_Tags_ReOrder}`, body, httpOptions);
      }

	GetWorkspaceList(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Get_All_Workspaces}`, body, httpOptions);
	}

	UpsertWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Upsert_Workspaces}`, body, httpOptions);
	}

	DeleteWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Delete_Workspace}`, body, httpOptions);
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

	GetCustomWidgetsBasedOnUser(widget: CustomWidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Custom_Widgets_Based_On_User}`, body, httpOptions);
	}

	GetCustomWidgetData(widget: CustomWidgetsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Custom_Widget_Data}`, body, httpOptions);
	}

	UpsertCustomWidgetSubQuery(widget: CustomWidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		return this._http.post(`${this.Upsert_Custom_Widget_Subquery}`, widget, httpOptions)
		.pipe(map((result) => {
			return result;
		}));
	}

	UpsertDashboardFilter(AppFilter: CustomAppFilter) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(AppFilter);

		return this._http.post(`${this.Upsert_Dashboard_Filter}`, body, httpOptions);
	}

	GetCustomWidgetQueryResult(AppFilter: CustomQueryModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(AppFilter);

		return this._http.post(`${this.Execute_Custom_query}`, body, httpOptions);
	}

	UpsertDashboardConfiguration(dashboardConfiguration: DashboardConfiguration) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${this.Upsert_Dashboard_Configuration}`, body, httpOptions);
	}

	GetDashboardConfigurations(dashboardConfiguration: DashboardConfiguration) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardConfiguration);

		return this._http.post(`${this.Get_Dashboard_Configurations}`, body, httpOptions);
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

	GetProjects() {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const getTestrailProjectsInputModel = new ProjectList();
		getTestrailProjectsInputModel.isArchived = false;

		const body = JSON.stringify(getTestrailProjectsInputModel);

		return this._http.post(`${this.Get_Projects}`, body, httpOptions);
	}

	GetWorkSpaceFilters(workspaceFilterInputModel: any) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspaceFilterInputModel);

		return this._http.post(`${this.Get_WorkSpace_Filters}`, body, httpOptions);
	}

	InsertDuplicateDashboard(dashboardModel: DuplicateDashboardModel) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${this.Insert_Duplicate_dashboard}`, body, httpOptions);
	}

	SetAsUserDefaultDashboard(dashboardModel: DuplicateDashboardModel) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${this.Set_As_Default_Dashboard}`, body, httpOptions);
	}

	updateDashboardName(dashboardModel: Dashboard){
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this._http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
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

	UpsertCustomDashboardFilter(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.UpsertDashboardFilter, body, httpOptions);
	}

	GetCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetDashboardFilters, body, httpOptions);
	}

	GetAllCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetAllDashboardFilters, body, httpOptions);
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
}
