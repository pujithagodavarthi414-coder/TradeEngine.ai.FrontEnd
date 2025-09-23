import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { DuplicateDashboardModel } from "../models/dashboard";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { WidgetList } from '../models/widgetlist';
import { WorkspaceList } from '../models/workspaceList';
import { DashboardList } from '../models/dashboardList';
import { ProjectList } from '../models/projectlist';
import { DynamicDashboardFilterModel } from '../models/dynamicDashboardFilerModel';
import { CustomTagsModel } from '../models/customTagsModel';
import { RoleModel } from '../models/role-model';
import { DesignationModel } from '../models/designation-model';
import { DepartmentModel } from '../models/department-model';
import * as _ from "underscore";
import * as cloneDeep_ from 'lodash/cloneDeep';
import { DashboardOrderModel } from '../models/dashboardOrderModel';
import { AuditCompliance } from '../models/audit-compliance.model';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
const cloneDeep = cloneDeep_;


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const ApiUrls = {
	UpsertDashboardVisuaizationType: `Widgets/WidgetsApi/UpsertDashboardVisuaizationType`,
	GetWidgetDynamicQueryResult: `Widgets/WidgetsApi/GetWidgetDynamicQueryResult`,
	GetCustomizedDashboardId: `Widgets/WidgetsApi/GetCustomizedDashboardId`,
	ResetToDefaultDashboard: `Widgets/WidgetsApi/ResetToDefaultDashboard`,
	SetAsDefaultDashboardPersistance: `Widgets/WidgetsApi/SetAsDefaultDashboardPersistance`,
	GetProjects: `TestRail/TestSuiteApi/GetProjects`,
	GetWorkSpaceFilters: `Widgets/WidgetsApi/GetWorkspaceFilters`,
	InsertDuplicateDashboard: `Widgets/WidgetsApi/InsertDuplicateDashboard`,
	SetDefaultDashboardForUser: `Widgets/WidgetsApi/SetDefaultDashboardForUser`,
	ReOrderTags: `Widgets/WidgetsApi/ReOrderWidgetTagsForUser`,
	UpdateDashboardName: `Widgets/WidgetsApi/UpdateDashboardName`,
	UpsertWorkspaceDashboardFilter: `Widgets/WidgetsApi/UpsertWorkspaceDashboardFilter`,
	GetWorkspaceDashboardFilters: `Widgets/WidgetsApi/GetWorkspaceDashboardFilters`,
	UpsertDashboardFilter: "Widgets/WidgetsApi/UpsertDashboardFilter",
	GetCustomApplicationTagKeys: "GenericForm/GenericFormApi/GetCustomApplicationTagKeys",
	GetDashboardFilters: "Widgets/WidgetsApi/GetDashboardFilters",
	GetCustomApplicationTag: "GenericForm/GenericFormApi/GetCustomApplicationTag",
	GetAllDashboardFilters: "Widgets/WidgetsApi/GetAllDashboardFilters",
	UpsertTags: `CustomTags/CustomTagsApi/UpsertTags`,
	GetAllRoles: `Roles/RolesApi/GetAllRoles`,
	GetDesignations: `HrManagement/HrManagementApi/GetDesignations`,
	GetDepartments: `HrManagement/HrManagementApi/GetDepartments`,
	SetAsDefaultDashboardView: `Widgets/WidgetsApi/SetAsDefaultDashboardView`,
	GetBusinessUnitDropDown: `MasterData/CompanyStructure/GetBusinessUnitDropDown`,
	ShareDashboardAsPdf: `GenericForm/GenericFormApi/ShareDashBoardAsPDF`
}

@Injectable({
	providedIn: "root"
})

export class WidgetService {
	private Get_All_Widgets = APIEndpoint + "Widgets/WidgetsApi/GetWidgets";
	private Get_Widgets_Based_On_User = APIEndpoint + "Widgets/WidgetsApi/GetWidgetsBasedOnUser";
	private Get_Widgets_Tags_Workspaces = APIEndpoint + "Widgets/WidgetsApi/GetWidgetTagsAndWorkspaces";
	private Get_All_Workspaces = APIEndpoint + "Widgets/WidgetsApi/GetWorkspaces";
	private Upsert_Workspaces = APIEndpoint + "Widgets/WidgetsApi/UpsertWorkspace";
	private Upsert_Child_Workspaces = APIEndpoint + "Widgets/WidgetsApi/UpsertChildWorkspace";
	private Delete_Workspace = APIEndpoint + "Widgets/WidgetsApi/DeleteWorkspace";
	private Get_Dashboard = APIEndpoint + "Widgets/WidgetsApi/GetDashboards";
	private Upsert_Dashboard = APIEndpoint + "Widgets/WidgetsApi/UpdateDashboard";
	private Insert_Dashboard = APIEndpoint + "Widgets/WidgetsApi/InsertDashboard";
	private Get_Custom_Tags = APIEndpoint + "Widgets/WidgetsApi/GetWidgetTags";
	private Get_Custom_Widget_Data = APIEndpoint + "Widgets/WidgetsApi/GetCustomGridData";
	private Set_As_Default_Persistance = APIEndpoint + ApiUrls.SetAsDefaultDashboardPersistance;
	private Reset_To_Default_Persistance = APIEndpoint + ApiUrls.ResetToDefaultDashboard;
	private Get_Projects = APIEndpoint + ApiUrls.GetProjects;
	private Get_WorkSpace_Filters = APIEndpoint + ApiUrls.GetWorkSpaceFilters;
	private Insert_Duplicate_dashboard = APIEndpoint + ApiUrls.InsertDuplicateDashboard;
	private Set_As_Default_Dashboard = APIEndpoint + ApiUrls.SetDefaultDashboardForUser;
	private Upsert_Tags_ReOrder = APIEndpoint + ApiUrls.ReOrderTags;
	private Set_As_Default_View = APIEndpoint + ApiUrls.SetAsDefaultDashboardView;
	private Set_Dashboard_Order = APIEndpoint + "Widgets/WidgetsApi/SetDashboardsOrder";
	private Share_Dashboard_As_Pdf = APIEndpoint + ApiUrls.ShareDashboardAsPdf;

	constructor(private _http: HttpClient) { }

	public widget: any;
	public selectedApp = new EventEmitter<{ obj: any, id: any }>();
	public selectedWorkspace = new Subject<any>();

	sendMessage(obj, id) {
		this.selectedApp.emit({ obj: obj, id: id });
	}
	upsertTag(TagIdList: string[]) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(TagIdList);

		return this._http.post(APIEndpoint + ApiUrls.UpsertTags, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}
	updateDashboard(dashboards: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		var dashboardClone = {};
		dashboardClone['workspaceId'] = cloneDeep(dashboards.workspaceId);
		dashboardClone['dashboard'] = [];
		dashboards.dashboard.forEach((d) => {
			var d1 = {};
			for (var property in d) {
				if (property != 'component') {
					d1[property] = cloneDeep(d[property]);
				}
			}
			dashboardClone['dashboard'].push(d1);
		});

		const body = JSON.stringify(dashboardClone);

		return this._http.post(`${this.Upsert_Dashboard}`, body, httpOptions);
	}
	InsertDashboard(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Insert_Dashboard}`, body, httpOptions);
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
	getAllDesignations(designationModel: DesignationModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
		};
		let body = JSON.stringify(designationModel);
		return this._http.post(`${APIEndpoint + ApiUrls.GetDesignations}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	searchAudits(audit: AuditCompliance) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		}

		let body = JSON.stringify(audit);

		return this._http.post(APIEndpoint + "ComplianceAudit/ComplianceAuditApi/SearchAudits", body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllRoles(roleModel: RoleModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		let body = JSON.stringify(roleModel);
		return this._http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
			.pipe(map(result => {
				return result;
			})
			);
	}
	getAllDepartments(departmentModel: DepartmentModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
		};
		let body = JSON.stringify(departmentModel);
		return this._http.post(`${APIEndpoint + ApiUrls.GetDepartments}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}
	GetCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetDashboardFilters, body, httpOptions);
	}
	UpsertCustomDashboardFilter(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.UpsertDashboardFilter, body, httpOptions);
	}
	GetWorkSpaceFilters(workspaceFilterInputModel: any) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspaceFilterInputModel);

		return this._http.post(`${this.Get_WorkSpace_Filters}`, body, httpOptions);
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
	GetAllCustomDashboardFilters(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this._http.post(APIEndpoint + ApiUrls.GetAllDashboardFilters, body, httpOptions);
	}
	SetAsDefaultDashboardPersistance(workspaceModel: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspaceModel);

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
	SetAsUserDefaultDashboard(dashboardModel: DuplicateDashboardModel) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${this.Set_As_Default_Dashboard}`, body, httpOptions);
	}
	InsertDuplicateDashboard(dashboardModel: DuplicateDashboardModel) {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${this.Insert_Duplicate_dashboard}`, body, httpOptions);
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
	GetDashboardList(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(`${this.Get_Dashboard}`, body, httpOptions);
	}
	GetWidgetsBasedOnUser(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Widgets_Based_On_User}`, body, httpOptions);
	}

	GetWidgetTagsAndWorkspaces(widget) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Widgets_Tags_Workspaces}`, body, httpOptions);
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

	UpsertChildWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Upsert_Child_Workspaces}`, body, httpOptions);
	}

	DeleteWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Delete_Workspace}`, body, httpOptions);
	}

	GetWidgetList(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_All_Widgets}`, body, httpOptions);
	}

	SetAsDefaultDashboarView(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Set_As_Default_View}`, body, httpOptions);
	}
	setDashboardCustomOrder(dashboardModel: DashboardOrderModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);

		return this._http.post(`${this.Set_Dashboard_Order}`, body, httpOptions);
	}

	getBusinessUnits(getBusinessUnitDropDownModel: BusinessUnitDropDownModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(getBusinessUnitDropDownModel);

		return this._http.post(`${APIEndpoint + ApiUrls.GetBusinessUnitDropDown}`, body, httpOptions);
	}

	shareDashboardAsPdf(model) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(model);

		return this._http.post(`${APIEndpoint + ApiUrls.ShareDashboardAsPdf}`, body, httpOptions);
	}
}
