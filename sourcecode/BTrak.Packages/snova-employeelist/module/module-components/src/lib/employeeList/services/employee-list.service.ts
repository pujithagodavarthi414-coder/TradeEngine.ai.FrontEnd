import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { map } from 'rxjs/operators';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { Branch } from '../models/branch';
import { Observable } from 'rxjs';
import { Currency } from '../models/currency';
import { CurrencyModel } from '../models/currency-model';
import { EmployeeListModel } from '../models/employee-model';
import { JobCategorySearchModel } from '../models/job-category-search-model';
import { RoleModel } from '../models/role-model';
import { ShiftTimingModel } from '../models/shift-timing-model';
import { TimeZoneModel } from '../models/time-zone';
import { EmployeeInductionModel } from '../models/employee-induction.model';
import { InductionModel } from '../models/induction.model';
import { UserStory } from '../models/userStory';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CompanysettingsModel } from '../models/company-model';
import { ActivityConfigurationUserModel } from '../models/activity-configuration-user-model';
import { DepartmentModel } from '../models/department-model';
import { DesignationModel } from '../models/designations-model';
import { EmploymentStatusSearchModel } from '../models/employment-status-search-model';
import { PayRollTemplateModel } from '../models/PayRollTemplateModel';
import { BusinessUnitDropDownModel } from '../models/businessunitmodel';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class EmployeeListService {

    constructor(private http: HttpClient) { }

    private GET_ALL_Companysettings = APIEndpoint + ApiUrls.GetCompanysettings;
    private GET_ALL_PayRollTemplate = APIEndpoint + ApiUrls.GetPayRollTemplates;

    firstName: string;
    surName: string;
    employeeNumber: string;

    getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    upsertsoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(softLabels);

        return this.http.post(`${APIEndpoint + ApiUrls.UpsertSoftLabelConfigurations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getsoftLabelById(softLabelId: string) {
        let paramsObj = new HttpParams().set("softLabelId", softLabelId);
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            params: paramsObj
        };

        return this.http
            .get(`${APIEndpoint + ApiUrls.GetSoftLabelById}`, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
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

    getCurrencyList(): Observable<Currency[]> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        let currencyModel = new CurrencyModel();
        currencyModel.isArchived = false;
        let body = JSON.stringify(currencyModel);
        return this.http.post<Currency[]>(APIEndpoint + ApiUrls.GetCurrencies, body, httpOptions)
            .pipe(map(result => {
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
        this.firstName = employeeModel.firstName;
        this.surName = employeeModel.surName;
        this.employeeNumber = employeeModel.employeeNumber;
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

    getJobCategoryDetails(jobCategorySearchModel: JobCategorySearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(jobCategorySearchModel);
        return this.http.post(APIEndpoint + ApiUrls.GetJobCategoryDetails, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getRolesForEffects(roleModel: RoleModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(roleModel);
        return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }

    getAllShiftTimings(shiftTimingModel: ShiftTimingModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(shiftTimingModel);
        return this.http.post(`${APIEndpoint + ApiUrls.SearchShiftTiming}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllTimeZones(timeZoneModel: TimeZoneModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(timeZoneModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetAllTimeZones}`, body, httpOptions)
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

    upsertAdhocWork(userStory: UserStory) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
        let body = JSON.stringify(userStory);
        return this.http
            .post(APIEndpoint + ApiUrls.UpsertAdhocWork, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
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

    getAllCompanySettings(companysettingModel: CompanysettingsModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(companysettingModel);
        return this.http.post(`${this.GET_ALL_Companysettings}`, body, httpOptions);
    }

    upsertActivityTrackerUserConfiguration(activityConfigurationUser: ActivityConfigurationUserModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(activityConfigurationUser);
        return this.http.post(APIEndpoint + ApiUrls.UpsertActivityTrackerUserConfiguration, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }
    upsertEmployeeFields(employeeFields) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(employeeFields);
        return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeFields, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }
    getEmployeeFields(employeeFields) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(employeeFields);
        return this.http.post(APIEndpoint + ApiUrls.GetEmployeeFields, body, httpOptions)
            .pipe(map(result => {
                return result;
            })
            );
    }

    getEntityDropDown(searchText, isEmployeeList) {
        let paramsobj = new HttpParams().set('searchText', searchText).set('isEmployeeList', isEmployeeList);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
            params: paramsobj
        };

        return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    employeeUpload(empList) {
        const httpOptions = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        let body = JSON.stringify(empList);
        return this.http
            .post(`${APIEndpoint + ApiUrls.EmployeeUpload}`, body, httpOptions)
            .pipe(
                map(result => {
                    return result;
                })
            );
    }

    getAllDepartments(departmentModel: DepartmentModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(departmentModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetDepartments}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllDesignations(designationModel: DesignationModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(designationModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetDesignations}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllEmploymentStatus(employmentStatusModel: EmploymentStatusSearchModel) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
        };
        let body = JSON.stringify(employmentStatusModel);
        return this.http.post(`${APIEndpoint + ApiUrls.GetEmploymentStatus}`, body, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getLineManagers(searchText: string) {
        let paramsobj = new HttpParams().set('searchText', searchText)
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            params: paramsobj
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetLineManagers, httpOptions)
            .pipe(map(result => {
                return result;
            }));
    }

    getAllPayRollTemplates(PayRollTemplateModel: PayRollTemplateModel) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        let body = JSON.stringify(PayRollTemplateModel);

        return this.http.post(`${this.GET_ALL_PayRollTemplate}`, body, httpOptions);
    }

    employeeUploadTemplate() {
        var url = APIEndpoint + ApiUrls.EmployeeUploadTemplate;
        return this.http.get(url, { responseType: "arraybuffer" });
    }
    
    getBusinessUnits(getBusinessUnitDropDownModel: BusinessUnitDropDownModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
      
        let body = JSON.stringify(getBusinessUnitDropDownModel);
      
        return this.http.post(`${APIEndpoint + ApiUrls.GetBusinessUnitDropDown}`, body, httpOptions);
      }

      ConvertDataToCSVFile(HeaderColumns: any[], data: any,
        HeaderColumnsIgnored: any[], filename: string) {
        let csvArray: any;
        const replacer = (key, value) => value === null ? '' :
          (value.toString().indexOf('"') > 0 ?
            value.replace(/"/g, " ") : value); // specify how you want to handle null values here
    
        if (data.length > 0) {
          const header_original = Object.keys(data[0]).filter(function (item) {
            return HeaderColumnsIgnored.findIndex(x => x.field === item) === -1
          });
          const header_show = header_original.map(function (value: string, index: number) {
            return HeaderColumns.filter(function (item) { 
                return item.field === value })[0].title
          });
          let csv = data.map(row => header_original.map
            (fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
          csv.unshift(header_show.join(','));
          csvArray = csv.join('\r\n');
        }
        else {
          // no record rows
          const header_show = HeaderColumns.map(function (value: string, index: number) {
            return value["title"];
          });
          let csv = data.map(row => header_show.map
            (fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
          csv.unshift(header_show.join(','));
          csvArray = csv.join('\r\n');
        }
        var a = document.createElement('a');
        var blob = new Blob([csvArray], { type: 'text/csv' }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
}