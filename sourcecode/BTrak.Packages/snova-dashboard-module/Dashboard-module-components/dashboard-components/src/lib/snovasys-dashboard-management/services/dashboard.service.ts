import { HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { map } from "rxjs/operators";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Dashboard } from '../models/dashboard.model';
import { WorkspaceDashboardFilterModel } from '../models/soft-labels.model';
import { FormSubmissionModel } from '../models/formsubmission.Model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EmployeeListModel } from '../models/employee-list.model';
import { EmployeeInductionModel } from '../models/employee-induction.model';
import { InductionModel } from '../models/induction.model';

import { EmployeeExitModel } from '../models/employee-exit.model';
import { ExitModel } from '../models/exit.model';
import { UserModel } from '../models/user-details.model';
import { SignatureModel } from '../models/signature.model';
import { ProjectFeature } from '../models/project-feature.model';
import { EmployeeBadgeModel } from '../models/employee-badge.model';
import { Project } from '../models/project.model';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import { UserStorySearchCriteriaInputModel } from '../models/userstorysearch-input.model';
import { UserStory } from '../models/userstory.model';
import { LeaveDetails } from '../models/leaveDetails.model';
import { LeaveModel } from '../models/leave.model';
import { LeaveSessionModel } from '../models/leaves-session.model';
import { LeaveStatusModel } from '../models/leave-status.model';
import { TimeSheetManagementSearchInputModel } from '../models/timesheet.model';
import { BugPriorityDropDownData } from '../models/bug-priority-dropdown-data.model';
import { AssetInputModel } from '../models/asset-input.model';
import { Observable } from 'rxjs';
import { Assets } from '../models/asset.model';
import { PrintAssetsModel } from '../models/print-asset.model';
import { BoardType } from '../models/board-type.model';
import { CompanysettingsModel } from '../models/company-settings.model';
import { Branch } from '../models/branch';
import { LeaveTypeInputModel } from '../models/leave-type-input.model';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import { ArchivedProjectInputModel } from '../models/archive-project-input.model';
import { WorkspaceList } from '../Models/workspace-list.model';
import { ChangePasswordModel } from '../models/change-password.model';
import { CanteenPurchaseItemModel } from '../models/canteen-purchase.model';
import { CanteenPurchaseItemSearchModel } from '../models/canteen-purchase-item-search.model';
import { CanteenBalanceSearchInputModel } from '../models/canteen-balance-search-input.model';
import { Persistance } from '../models/persistance.model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { SearchCommitModel } from '../models/search-repository-commits.model';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
	providedIn: 'root',
})

export class DashboardService {

	constructor(private http: HttpClient) { }

	updateDashboardName(dashboardModel: Dashboard) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardModel);
		return this.http.post(APIEndpoint + ApiUrls.UpdateDashboardName, body, httpOptions);
	}

	updateworkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);
		return this.http.post(APIEndpoint + ApiUrls.UpsertWorkspaceDashboardFilter, body, httpOptions);
	}

	getAllInductionConfigurations(induction: InductionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(induction);

		return this.http.post(APIEndpoint + ApiUrls.GetInductionConfigurations, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}
	
	SearchRepositoryCommits(searchCommitModel: SearchCommitModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
		  headers: new HttpHeaders({
			"Content-Type": "application/json"
		  })
		};
		let body = JSON.stringify(searchCommitModel);
		return this.http
		  .post(APIEndpoint + ApiUrls.SearchRepositoryCommits, body, httpOptions)
		  .pipe(map(result => {
			return result;
		  }));
	  }

	GetEmployeeInductions(induction: EmployeeInductionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(induction);

		return this.http.post(APIEndpoint + ApiUrls.GetEmployeeInductions, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	upsertInductionConfiguration(induction: InductionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(induction);

		return this.http.post(APIEndpoint + ApiUrls.UpsertInductionConfiguration, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	 //exit
	 getAllExitConfigurations(exit: ExitModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(exit);

		return this.http.post(APIEndpoint + ApiUrls.GetExitConfigurations, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}
 

	GetEmployeeExits(exit: EmployeeExitModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(exit);
		return this.http.post(APIEndpoint + ApiUrls.GetEmployeeExits, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}


	upsertExitConfiguration(exit: ExitModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(exit);

		return this.http.post(APIEndpoint + ApiUrls.UpsertExitConfiguration, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	getAllEmployees(employeeModel: EmployeeListModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
		};
		let body = JSON.stringify(employeeModel);
		return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
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

		return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetallRoles() {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		var data = { RoleId: null, RoleName: null, Data: null, isArchived: false };
		let body = JSON.stringify(data);
		return this.http
			.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}
	GetEmployeeReportToMembers(userId: string) {
		let paramsobj = new HttpParams().set('userId', userId);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			params: paramsobj
		};
		return this.http.get(`${APIEndpoint + ApiUrls.GetEmployeeReportToMembers}`, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllUsers(userModel: UserModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
		};
		let body = JSON.stringify(userModel);
		return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllUserStoryTypes(userStoryTypesModel) {
		const paramsObj = new HttpParams().set("isArchived", userStoryTypesModel.isArchived).set("searchText", userStoryTypesModel.searchText);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsObj
		};

		return this.http.get(
			`${APIEndpoint + ApiUrls.GetUserStoryTypeDropDown}`,
			httpOptions
		);
	}

	getWorkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);
		return this.http.post(APIEndpoint + ApiUrls.GetWorkspaceDashboardFilters, body, httpOptions);
	}

	getUsersDropDown(searchText: string) {
		let paramsobj = new HttpParams().set('searchText', searchText);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
			params: paramsobj
		};
		return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}


	getAllCustomFormSubmission(customFormType: FormSubmissionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(customFormType);

		return this.http.post(APIEndpoint + ApiUrls.GetCustomFormSubmissions, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	getGenericApiData(model: any) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(model);
		return this.http.post(APIEndpoint + "BusinessSuite/BusinessSuiteApi/UpsertData", body, httpOptions).pipe(map((result) => {
			return result;
		}));
	}

	UpsertCustomFormSubmission(customFormType: FormSubmissionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(customFormType);

		return this.http.post(APIEndpoint + ApiUrls.UpsertCustomFormSubmission, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	upsertSignature(signature: SignatureModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(signature);

		return this.http.post(APIEndpoint + ApiUrls.UpsertSignature, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	getSignature(signature: SignatureModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(signature);

		return this.http.post(APIEndpoint + ApiUrls.GetSignature, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}

	downloadFile(filePath: string) {
		let paramsobj = new HttpParams().set("filePath", filePath);
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsobj
		};
		return this.http.get(APIEndpoint + ApiUrls.DownloadFile, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	UploadFile(formData, moduleTypeId) {
		const httpOptions = {
			headers: new HttpHeaders({ enctype: "multipart/form-data" })
		};

		return this.http
			.post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	getLoggedInUser() {
		const httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json"
			})
		};
		return this.http.get(`${APIEndpoint + ApiUrls.GetLoggedInUser}`, httpOptions).pipe(
			map(result => {
				return result;
			})
		);
	}

	GetAllProjectFeatures(projectFeatureModel: ProjectFeature) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(projectFeatureModel);
		return this.http
			.post<any[]>(`${APIEndpoint + ApiUrls.GetAllProjectFeaturesByProjectId}`, body, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	getUserById(userId: string) {
		let paramsobj = new HttpParams().set('userId', userId);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			params: paramsobj
		};
		return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getBadgesAssignedToEmployee(badgeModel: EmployeeBadgeModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(badgeModel);

		return this.http.post(APIEndpoint + ApiUrls.GetBadgesAssignedToEmployee, body, httpOptions)
			.pipe(map((result) => {
				return result;
			}));
	}


	searchProjects(projectSearchInput: ProjectSearchCriteriaInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		let body = JSON.stringify(projectSearchInput);
		return this.http.post<Project[]>(
			`${APIEndpoint + ApiUrls.SearchProjects}`,
			body,
			httpOptions
		);
	}

	searchUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
		return this.http
			.post<UserStory[]>(
				`${APIEndpoint + ApiUrls.GetUserStoriesOverview}`,
				userStorySearchInput
			)
			.pipe(
				map((result) => {
					return result;
				})
			);
	}

	searchAllUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
		return this.http
			.post<UserStory[]>(
				`${APIEndpoint + ApiUrls.SearchUserStories}`,
				userStorySearchInput
			)
			.pipe(
				map((result) => {
					return result;
				})
			);
	}

	getLeaveDetails(leaveDetailsModel: LeaveDetails) {

		const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

		let body = JSON.stringify(leaveDetailsModel);

		return this.http.post(APIEndpoint + ApiUrls.GetLeaveDetails, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getLeaveHistory(leaveHistorySearchModel: LeaveModel) {
		const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

		let body = JSON.stringify(leaveHistorySearchModel);

		return this.http.post(APIEndpoint + ApiUrls.GetLeaveStatusSetHistory, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllLeaveSessions(leaveSession: LeaveSessionModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(leaveSession);

		return this.http.post(APIEndpoint + ApiUrls.GetAllLeaveSessions, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllLeaveStatuss(leaveStatus: LeaveStatusModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(leaveStatus);

		return this.http.post(APIEndpoint + ApiUrls.GetLeaveStatus, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getTimeSheetDetails(timeSheetManagementSearchInputModel: TimeSheetManagementSearchInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(timeSheetManagementSearchInputModel);
		return this.http.post(APIEndpoint + ApiUrls.GetTimeSheetDetails, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getviewTimeSheet(TimeSheetDetails: TimeSheetManagementSearchInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};

		let body = JSON.stringify(TimeSheetDetails);
		return this.http.post(APIEndpoint + ApiUrls.GetMyTimeSheetDetails, body, httpOptions)
			.pipe(map(result => {
				return result;
			})
			);
	}

	GetAllBugPriporities(bugPripority: BugPriorityDropDownData) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(bugPripority);

		return this.http
			.post(APIEndpoint + ApiUrls.GetAllBugPriorities, body, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	upsertLeave(leaveUpsertModel: LeaveModel) {
		const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

		let body = JSON.stringify(leaveUpsertModel);

		return this.http.post(APIEndpoint + ApiUrls.UpsertLeaves, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	searchLeaves(leavesSearchModel: LeaveModel) {
		const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

		let body = JSON.stringify(leavesSearchModel);

		return this.http.post(APIEndpoint + ApiUrls.SearchLeaves, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	upsertAssetDetails(assetDetailsModel: Assets) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(assetDetailsModel);
		return this.http.post(APIEndpoint + ApiUrls.UpsertAsset, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	printAssets(printAssetsModel: PrintAssetsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(printAssetsModel);
		return this.http.post(APIEndpoint + ApiUrls.PrintAssets, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllAssets(assetsInputModel: AssetInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(assetsInputModel);
		return this.http.post(APIEndpoint + ApiUrls.SearchAssets, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetAllBoardTypes() {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		var boardTypeModel = new BoardType();
		boardTypeModel.isArchived = false;
		let body = JSON.stringify(boardTypeModel);
		return this.http
			.post<any[]>(APIEndpoint + "BoardTypes/BoardTypesApi/GetAllBoardTypes", body, httpOptions)
			.pipe(
				map(result => {
					return result;
				})
			);
	}

	getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(companysettingModel);

		return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);
	}

	getBranchList(branchSearchResult: Branch): Observable<Branch[]> {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let body = JSON.stringify(branchSearchResult);
		return this.http.post<Branch[]>(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	upsertLeaveType(leaveTypeInputModel: LeaveTypeInputModel) {
		const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

		let body = JSON.stringify(leaveTypeInputModel);

		return this.http.post(APIEndpoint + ApiUrls.UpsertLeaveType, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllLeaveTypes(leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(leaveTypeSearchModel);

		return this.http.post(APIEndpoint + ApiUrls.GetAllLeaveTypes, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetProjectById(projectId: string) {
		let paramsobj = new HttpParams().set("projectId", projectId);

		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
			params: paramsobj
		};

		return this.http.get(`${APIEndpoint + ApiUrls.GetProjectById}`, httpOptions);
	}

	upsertProject(project: Project) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(project);
		return this.http.post(`${APIEndpoint + ApiUrls.UpsertProject}`, body, httpOptions);
	}

	archiveProject(project: ArchivedProjectInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(project);
		return this.http.post(`${APIEndpoint + ApiUrls.ArchiveProject}`, body, httpOptions);
	}

	GetWorkspaceList(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this.http.post(APIEndpoint + "Widgets/WidgetsApi/GetWorkspaces", body, httpOptions);
	}

	UpsertWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this.http.post(APIEndpoint + "Widgets/WidgetsApi/UpsertWorkspace", body, httpOptions);
	}

	DeleteWorkspace(workspace: WorkspaceList) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		const body = JSON.stringify(workspace);

		return this.http.post(APIEndpoint + "Widgets/WidgetsApi/DeleteWorkspace", body, httpOptions);
	}

	changePassword(changePasswordModel: ChangePasswordModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};

		let body = JSON.stringify(changePasswordModel);

		return this.http.post<UserModel[]>(APIEndpoint + ApiUrls.ChangePassword, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	upsertCanteenPurchaseItem(canteenPurchaseItemModel: CanteenPurchaseItemModel[]) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(canteenPurchaseItemModel);
		return this.http.post(APIEndpoint + ApiUrls.PurchaseCanteenItem, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	searchMyCanteenPurchases(canteenPurchaseItemSearchModel: CanteenPurchaseItemSearchModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(canteenPurchaseItemSearchModel);
		return this.http.post(APIEndpoint + ApiUrls.GetUserCanteenPurchases, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	searchCanteenPurchaseItem(canteenPurchaseItemSearchModel: CanteenPurchaseItemSearchModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(canteenPurchaseItemSearchModel);
		return this.http.post(APIEndpoint + ApiUrls.SearchCanteenPurchases, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getAllEmployeesDetails(employeeModel: EmployeeListModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
		};
		let body = JSON.stringify(employeeModel);
		return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployeesDetails}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	upsertEmployees(employeeModel: EmployeeListModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" }),
		};
		let body = JSON.stringify(employeeModel);
		return this.http.post(`${APIEndpoint + ApiUrls.UpsertEmployeePersonalDetails}`, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	getEmployeeById(employeeId: string) {
		let paramsobj = new HttpParams().set('employeeId', employeeId);
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
			params: paramsobj
		};
		return this.http.get(APIEndpoint + ApiUrls.GetEmployeeById, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	searchCanteenBalance(canteenBalanceSearchInputModel: CanteenBalanceSearchInputModel) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		};
		let body = JSON.stringify(canteenBalanceSearchInputModel);
		return this.http.post(APIEndpoint + ApiUrls.SearchCanteenBalance, body, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	GetLateEmployeeCount(model) {
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};
		let data = JSON.stringify(model);
		return this.http.post<any[]>(APIEndpoint + ApiUrls.GetLateEmployeeCount, data, httpOptions)
			.pipe(map(result => {
				return result;
			}));
	}

	UpsertPersistance(inputModel: Persistance) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(inputModel);

		return this.http.post(APIEndpoint + ApiUrls.UpdatePersistance, body, httpOptions);
	}

	GetPersistance(searchModel: Persistance) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};

		let body = JSON.stringify(searchModel);

		return this.http.post(APIEndpoint + ApiUrls.GetPersistance, body, httpOptions);
	}

	getActTrackerUserActivityScreenshots(webAppUsageSearchModel: WebAppUsageSearchModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(webAppUsageSearchModel);
		return this.http.post(APIEndpoint + ApiUrls.GetActTrackerUserActivityScreenshots, body, httpOptions)
			.pipe(map(result => {
				return result;
			})
			);
	}

	getActTrackerUserActivityScreenshotsById(webAppUsageSearchModel: WebAppUsageSearchModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(webAppUsageSearchModel);
		return this.http.post(APIEndpoint + ApiUrls.GetActTrackerUserActivityScreenshotsBasedOnId, body, httpOptions)
			.pipe(map(result => {
				return result;
			})
			);
	}

	deleteMultipleScreenshots(deleteScreenShotModel: DeleteScreenShotModel) {
		let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
		let APIEndpoint = environment.apiURL;
		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		let body = JSON.stringify(deleteScreenShotModel);
		return this.http.post(APIEndpoint + ApiUrls.MultipleDeleteScreenShot, body, httpOptions)
			.pipe(map(result => {
				return result;
			})
			);
	}
}