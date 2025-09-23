import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LeaveFrequencyTypeSearchInputModel } from '../models/leave-type-search-model';
import { LeaveFrequencyTypeModel } from '../models/leave-frequency-type-model';
import { LeaveTypeInputModel } from '../models/leave-type-input-model';
import { LeaveApplicabilityModel } from '../models/leave-applicability-model';
import { EncashmentTypeModel } from '../models/encashment-type-model';
import { LeaveModel } from '../models/leave-model';
import { LeaveOverviewModel } from '../models/leave-overview-model';
import { EmployeeListModel } from '../models/employee';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LeaveDetails } from '../models/leaveDetails.model';
import { Observable } from "rxjs";
import { WorkspaceDashboardFilterModel } from '../models/workspacedashboardfiltermodel';


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class LeavesService {
  constructor(private http: HttpClient) { }

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

  getAllLeaveFrequencies(leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(leaveTypeSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveFrequency, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeaveFrequency(leaveType: LeaveFrequencyTypeModel) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(leaveType);

    return this.http.post(APIEndpoint + ApiUrls.UpsertLeaveFrequency, body, httpOptions)
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

  getMasterLeaveTypes() {
    return this.http.get<any>(APIEndpoint + ApiUrls.GetMasterLeaveTypes)
      .pipe(map(result => {
        return result;
      }));
  }

  getLeaveDetails(leaveDetailsModel : LeaveDetails){

    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(leaveDetailsModel);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  upsertLeaveApplicability(leaveApplicabilityModel: LeaveApplicabilityModel) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(leaveApplicabilityModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertLeaveApplicabilty, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEncashmentTypes(encashmentTypeModel: EncashmentTypeModel) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(encashmentTypeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEncashmentTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLeaveApplicability(leaveApplicabilitySearchModel: LeaveApplicabilityModel) {
    let paramsobj = new HttpParams().set('leaveTypeId', leaveApplicabilitySearchModel.leaveTypeId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetLeaveApplicabilty, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertLeave(leaveUpsertModel: LeaveModel) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(leaveUpsertModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertLeaves, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  
  approveOrRejectLeave(aprroveOrRejectLeaveModel: LeaveModel){
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(aprroveOrRejectLeaveModel);

    return this.http.post(APIEndpoint + ApiUrls.ApproveOrRejectLeave,body, httpOptions) .pipe(map(result => {
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

  getLeaveHistory(leaveHistorySearchModel: LeaveModel){
    const httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) };

    let body = JSON.stringify(leaveHistorySearchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveStatusSetHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getLeaveOverviewReport(leaveOverviewModel: LeaveOverviewModel){
    const httpOptions = {  headers: new HttpHeaders({'Content-type': 'application/json'})  };

    let body = JSON.stringify(leaveOverviewModel);

    return this.http.post(APIEndpoint + ApiUrls.GetLeaveOverViewReport,body,httpOptions)
    .pipe(map(result => {
      return result;
    }))

  }
  
  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'my-auth-token'}),
      params: paramsobj
    };
   
    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`,httpOptions)
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

getTeamLeadsList(teamleadInput?: any) {
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  const body = JSON.stringify(teamleadInput);

  return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, body, httpOptions)
    .pipe(map(result => {
      return result;
    }));
}


updateworkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  const body = JSON.stringify(dashboardFilterModel);

  return this.http.post(APIEndpoint + ApiUrls.UpsertWorkspaceDashboardFilter, body, httpOptions);
}

getWorkspaceDashboardFilter(dashboardFilterModel: WorkspaceDashboardFilterModel) {
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };
  const body = JSON.stringify(dashboardFilterModel);

  return this.http.post(APIEndpoint + ApiUrls.GetWorkspaceDashboardFilters, body, httpOptions);
}
}
