import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CustomWidgetList } from "../models/custom-widget-list.model";
import { map } from "rxjs/operators";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { WebHookModel } from '../models/webhook.model';
import { CustomWidgetsModel } from '../models/custom-widget.model';
import { WorkspaceList } from '../models/workspace-list.model';
import { Dashboard } from '../models/dashboard.model';
import { DashboardList } from '../models/dashboard-list.model';
import { WidgetList } from '../models/widget-list.model';
import { ProjectList } from '../models/project-list';
import { DesignationModel } from '../models/designation.model';
import { HrBranchModel } from '../models/hr-branch.model';
import { DynamicDashboardFilterModel } from '../models/dynamic-dashboard-filter.model';
import { DepartmentModel } from '../models/department.model';
import { Observable } from "rxjs/Observable";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiInputDetailsModel } from '../models/api-input-details.model';
import { AuditCompliance } from '../models/audit-compliance.model';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';
import { EmploymentStatusModel } from '../models/employment.status.model';
import { SourceModel } from '../models/source.model';
import { JobOpeningStatusModel } from '../models/job-opening-status.model';
import { HiringStatusModel } from '../models/hiring-status.model';
import { CandidateModel } from '../models/candidate.model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
	providedIn: "root"
})

export class WidgetService {

	private Upsert_Custom_Widget_Subquery = APIEndpoint + "Widgets/WidgetsApi/UpsertCustomWidgetSubQuery";
	private Get_SubQuery_Types = APIEndpoint + "Widgets/WidgetsApi/GetSubQueryTypes";
	private Get_Custom_Widget_Data = APIEndpoint + "Widgets/WidgetsApi/GetCustomGridData";
	private Get_All_Workspaces = APIEndpoint + "Widgets/WidgetsApi/GetWorkspaces";
	private Get_All__Widgets = APIEndpoint + "Widgets/WidgetsApi/GetAllWidgets";
	private Get_Projects = APIEndpoint + ApiUrls.GetProjects;
	private Get_Custom_Tags = APIEndpoint + "Widgets/WidgetsApi/GetWidgetTags";
	private Get_Widgets_Based_On_User = APIEndpoint + "Widgets/WidgetsApi/GetWidgetsBasedOnUser";
	private Get_ColumnFormat_Types = APIEndpoint + "Widgets/WidgetsApi/GetColumnFormatTypes";
	private Get_ColumnFormat_Types_By_Id = APIEndpoint + "Widgets/WidgetsApi/GetColumnFormatTypesById";
	private Delete_DataSet_ById = APIEndpoint + "Lives/LivesApi/DeleteDatasetById";
	private Delete_Multiple_DataSets = APIEndpoint + "DataService/DataSetApi/DeleteMultipleDataSets";
	private UnArchive_Multiple_DataSets = APIEndpoint + "DataService/DataSetApi/UnArchiveMultipleDataSets";

	constructor(private _http: HttpClient) { }

	getSubQueryTypes() {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		return this._http.get<any>(
			`${this.Get_SubQuery_Types}`,
			httpOptions
		);
	}

	getColumnFormatTypes() {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		return this._http.get<any>(
			`${this.Get_ColumnFormat_Types}`,
			httpOptions
		);
	}


	getColumnFormatTypesId(id:any) {
		
		let paramsobj = new HttpParams().set("ColumnFormatTypeId", id);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsobj
		};
		
		
       
		return this._http.get(`${this.Get_ColumnFormat_Types_By_Id}`,httpOptions)
			.pipe(
				map(result => {
					return result;

				})
			);
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

	GetProjects() {

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const getTestrailProjectsInputModel = new ProjectList();
		getTestrailProjectsInputModel.isArchived = false;

		const body = JSON.stringify(getTestrailProjectsInputModel);

		return this._http.post(`${this.Get_Projects}`, body, httpOptions);
	}

	searchAudits(audit: AuditCompliance) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }

        let body = JSON.stringify(audit);

        return this._http.post(APIEndpoint + "Audit/AuditApi/SearchAudits", body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

	getTeamLeadsList() {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		return this._http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetApiData(apiInputDetails: ApiInputDetailsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(apiInputDetails);

		return this._http.post(`${APIEndpoint + "Widgets/WidgetsApi/GetApiData"}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	UpsertApiData(apiInputDetails: ApiInputDetailsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(apiInputDetails);

		return this._http.post(`${APIEndpoint + "Widgets/WidgetsApi/UpsertCustomAppApiDetails"}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetCustomAppApiData(apiInputDetails: ApiInputDetailsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(apiInputDetails);

		return this._http.post(`${APIEndpoint + "Widgets/WidgetsApi/GetCustomAppApiDetails"}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}
	SendWidgetReportEmail(apiInputDetails: any) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(apiInputDetails);

		return this._http.post(`${APIEndpoint + "Widgets/WidgetsApi/SendWidgetReportEmail"}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllDesignations(designationModel: DesignationModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		let body = JSON.stringify(designationModel);
		return this._http
			.post(APIEndpoint + ApiUrls.GetDesignations, body, httpOptions)
			.pipe(
				map(result => {
					console.log(" result:", result);
					return result;
				})
			);
	}


	getBranches(branchModel: HrBranchModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(branchModel);

		return this._http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
			.pipe(map((result) => {
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

	GetEmploymentStatus( employmentStatusModel: EmploymentStatusModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify( employmentStatusModel);

		return this._http.post(APIEndpoint + ApiUrls.GetEmploymentStatus, body, httpOptions);
	}

	GetSources(sourceModel: SourceModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(sourceModel);

		return this._http.post(APIEndpoint + ApiUrls.GetSources, body, httpOptions);
	}

	GetJobOpeningStatus(jobOpeningStatusModel: JobOpeningStatusModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(jobOpeningStatusModel);

		return this._http.post(APIEndpoint + ApiUrls.GetJobOpeningStatus, body, httpOptions);
	}

	GetHiringStatus(hiringStatusModel: HiringStatusModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(hiringStatusModel);

		return this._http.post(APIEndpoint + ApiUrls.GetHiringStatus, body, httpOptions);
	}

	GetCandidates(candidateModel: CandidateModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(candidateModel);

		return this._http.post(APIEndpoint + ApiUrls.GetCandidates, body, httpOptions);
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


	getEntityDropDown(searchText) {
		let paramsobj = new HttpParams().set('searchText', searchText);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
			params: paramsobj
		};

		return this._http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getwebhook(webhookModel: WebHookModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(webhookModel);

		return this._http.post(APIEndpoint + ApiUrls.GetWebHooks, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetCustomWidgetData(widget: CustomWidgetsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Custom_Widget_Data}`, body, httpOptions);
	}

	GetAllWidgets(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_All__Widgets}`, body, httpOptions);
	}

	GetWorkspaceList(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this._http.post(`${this.Get_All_Workspaces}`, body, httpOptions);
	}

	updateDashboardName(dashboardModel: Dashboard) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this._http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
	}

	UpsertDashboardVisuaizationType(dashboard: DashboardList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(dashboard);

		return this._http.post(APIEndpoint + ApiUrls.UpsertDashboardVisuaizationType, body, httpOptions);
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

	GetWidgetsBasedOnUser(widget: WidgetList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(widget);

		return this._http.post(`${this.Get_Widgets_Based_On_User}`, body, httpOptions);
	}

	getBusinessUnits(getBusinessUnitDropDownModel: BusinessUnitDropDownModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(getBusinessUnitDropDownModel);
      
        return this._http.post(`${APIEndpoint + ApiUrls.GetBusinessUnitDropDown}`, body, httpOptions);
    }
	
	deleteDataSetById(id: any) {
		let paramsobj = new HttpParams().set("id", id);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			// params: paramsobj
		};
		return this._http.get(`${this.Delete_DataSet_ById}?id=${id}`, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	getCollectionsList() {
		let paramsobj = new HttpParams().set("id", null);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			// params: paramsobj
		};
		return this._http.get(APIEndpoint+ ApiUrls.GetCollectionsList, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	deleteMultipleDataSets(inputModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(inputModel);
      
        return this._http.post(`${this.Delete_Multiple_DataSets}`, body, httpOptions);
    }

	unArchiveMultipleDataSets(inputModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(inputModel);
      
        return this._http.post(`${this.UnArchive_Multiple_DataSets}`, body, httpOptions);
    }

}
