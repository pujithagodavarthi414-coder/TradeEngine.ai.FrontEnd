import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { UserModel } from '../models/user';
import { ProjectSearchCriteriaInputModel } from '../models/ProjectSearchCriteriaInputModel';
import { Project } from '../models/project';
import { WidgetList } from '../models/widgetlist';
import { WorkspaceList } from '../models/workspaceList';
import { EmployeeListModel } from '../models/employee';
import { StoreSearchModel } from '../models/store-search-model';
import { CompanyModel, CompanysettingsModel } from '../models/company-model';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { ExportConfigurationModel } from '../models/export-configuration-model';
import { ImportConfigurationModel } from '../models/import-configuration-model';
import { IntroModel } from "../models/IntroModel";

@Injectable({ providedIn: "root" })

export class CommonService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }

    getUserInitialData() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post(APIEndpoint + ApiUrls.GetUsersInitialData, httpOptions).pipe(
            map((result) => {
                return result;
            })
        );
    }

    getAddOrEditCustomAppIsRequired() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        return this.http.get(APIEndpoint + ApiUrls.GetAddOrEditCustomAppIsRequired, httpOptions)
          .pipe(map((result) => {
            return result;
          }));
      }

    companyLogin(userDetails: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        const body = JSON.stringify(userDetails);
        return this.http.post(APIEndpoint + ApiUrls.CompanyLogin, body, httpOptions).pipe(
            map((result) => {
                return result;
            })
        );
    }

    getActTrackerRecorder() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.get(APIEndpoint + ApiUrls.GetActTrackerRecorder, httpOptions).pipe(
            map(result => {
                return result;
            })
        );
    }

    getCompanyById(companyId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        let paramsobj = new HttpParams().set('companyId', companyId);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };

        return this.http.get(APIEndpoint + ApiUrls.GetCompanyById, httpOptions).pipe(
            map(result => {
                return result;
            })
        );
    }

    updateCompanyDetails(companyModel : CompanyModel ){
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        let body = JSON.stringify(companyModel);

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post(`${APIEndpoint + ApiUrls.UpsertCompanyDetails}`, body, httpOptions)
        .pipe(map(result => {
            return result;
        }));
    }

    getTimeSheetEnabledInformation() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.get<any>(APIEndpoint + ApiUrls.GetEnableorDisableTimesheetButtons, httpOptions).pipe(
            map(data => {
                // this.timeSheetEnabledInformation.next(data);
                return data;
            })
        );
    }

    getUserById(userId: string) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
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

    searchProjects(projectSearchInput: ProjectSearchCriteriaInputModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
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

    GetWidgetsBasedOnUser(widget: WidgetList) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(widget);

        return this.http.post(APIEndpoint + ApiUrls.GetWidgetsBasedOnUser, body, httpOptions);
    }

    GetWorkspaceList(workspace: WorkspaceList) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(workspace);

        return this.http.post(APIEndpoint + ApiUrls.GetWorkspaces, body, httpOptions);
    }

    GetallRoles() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;

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

    getAllEmployees(employeeModel: EmployeeListModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employeeModel);
        return this.http.post(APIEndpoint + ApiUrls.GetAllEmployees, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getStores(storeSearchModel: StoreSearchModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(storeSearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetStores, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getAllCompanySettingsDetails(companysettingModel: CompanysettingsModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(companysettingModel);

        return this.http.post(APIEndpoint + ApiUrls.GetCompanySettingsDetails, body, httpOptions);
    }

    getLoggedInUser() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http.get(APIEndpoint + ApiUrls.GetLoggedInUser, httpOptions).pipe(
            map(result => {
                return result;
            })
        );
    }

    getCompanyWorkItemStartFunctionalityRequired() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http.get(APIEndpoint + ApiUrls.GET_COMPANY_START_FUNCTIONALITY_ENABLED, httpOptions).pipe(
            map(result => {
                return result;
            })
        );
    }

    getSoftLabels(softLabelModel: SoftLabelConfigurationModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(softLabelModel);
        return this.http.post(APIEndpoint + ApiUrls.GetSoftLabelConfigurations, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    GetExportData(exportConfigurationModel: ExportConfigurationModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(exportConfigurationModel);
        return this.http.post(APIEndpoint + ApiUrls.ExportSystemConfiguration, body, httpOptions);
    }

    SystemImportConfiguration(importConfigurationModel: ImportConfigurationModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        const body = JSON.stringify(importConfigurationModel);
        return this.http.post(APIEndpoint + ApiUrls.ImportSystemConfiguration, body, httpOptions);
    }
    getIntroDetails(introModel : IntroModel) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
        };

        const body = JSON.stringify(introModel);
        return this.http.post<any[]>(APIEndpoint + ApiUrls.GetIntroDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getTeamLeadsList(model: any) {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        let APIEndpoint = environment.apiURL;
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        let body = JSON.stringify(model);
        return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
}