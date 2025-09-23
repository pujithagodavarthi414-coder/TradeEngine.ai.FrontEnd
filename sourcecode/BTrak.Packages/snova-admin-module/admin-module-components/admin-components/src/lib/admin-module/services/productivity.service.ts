import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ApiUrls } from "../constants/api-urls";
import { Branch } from "../models/branch";
import { GetProductivityDetails } from "../models/productivity-models/getProductivityDetails.models";
import { ConfigurationType } from "../models/projects/configurationType";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
  })
  export class ProductivityService {
    private GetProductivityDetails = APIEndpoint + ApiUrls.GetProductivityDetails;
    private GetProductivityandQualityStats = APIEndpoint + ApiUrls.GetProductivityandQualityStats;
    private GetTrendInsightsReport = APIEndpoint + ApiUrls.GetTrendInsightsReport;
    private GetHrStats = APIEndpoint + ApiUrls.GetHrStats;
    private GetLineManagers = APIEndpoint + ApiUrls.GetLineManagers;
    private GetProductivityDrillDown = APIEndpoint + ApiUrls.GetProductivityDrillDown;
    private GetCompletedTasksDrillDown = APIEndpoint + ApiUrls.GetCompletedDetailsDrillDown;
    private GetNoOfBugssDrillDown = APIEndpoint + ApiUrls.GetNoOfBugssDrillDown;
    private GetEfficiencyDrillDown = APIEndpoint + ApiUrls.GetEfficiencyDrillDown;
    private GetUtilizationDrillDown = APIEndpoint + ApiUrls.GetUtilizationDrillDown;
    private GetPlannedDetailsDrillDown = APIEndpoint + ApiUrls.GetPlannedDetailsDrillDown;
    private GetDeliveredDetailsDrillDown = APIEndpoint + ApiUrls.GetDeliveredDetailsDrillDown;
    private GetSpentDetailsDrillDown = APIEndpoint + ApiUrls.GetSpentDetailsDrillDown;
    private GetPendingTasksDrillDown = APIEndpoint + ApiUrls.GetPendingTasksDrillDown;
    private GetBounceBacksDrillDown = APIEndpoint + ApiUrls.GetBounceBacksDrillDown;
    private GetReplansDrillDown = APIEndpoint + ApiUrls.GetReplansDrillDown;
    private GetBranchMembers = APIEndpoint + ApiUrls.GetBranchMembers;
    
    
    EditConfigurationType: ConfigurationType;
    constructor(private http: HttpClient) { }   

    getBranchMembers(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetBranchMembers, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

    getSpentDetailsDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetSpentDetailsDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }
    
    getDeliveredDetailsDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetDeliveredDetailsDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }


    getPlannedDetailsDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetPlannedDetailsDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

    getUtilizationDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetUtilizationDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }

    getEfficiencyDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetEfficiencyDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }
    
    getProductivityDrillDown(inputModel): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };    
      let body = JSON.stringify(inputModel);    
      return this.http.post(this.GetProductivityDrillDown, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
    }
  
    getProductivityDetails(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetProductivityDetails, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getProductivityandQualityStats(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetProductivityandQualityStats, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getTrendInsightsReport(inputmodel: GetProductivityDetails) {
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
    
        let body = JSON.stringify(inputmodel);
    
        return this.http.post(this.GetTrendInsightsReport, body, httpOptions);
      }

      getHrStats(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetHrStats, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getLineManagers(searchText: string) {
        let paramsobj = new HttpParams().set('searchText',searchText)
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          params: paramsobj
        };
        return this.http.get<any[]>(this.GetLineManagers, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getTeamLeadsList(model: any) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        let body = JSON.stringify(model);
        return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getBranchesList() {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
        };
        var branch = new Branch();
        branch.isArchived = false;
        let body = JSON.stringify(branch);
        return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getNoOfBugssDrillDown(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetNoOfBugssDrillDown, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getCompletedTasksDrillDown(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetCompletedTasksDrillDown, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getPendingTasksDrillDown(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetPendingTasksDrillDown, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getBounceBacksDrillDown(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetBounceBacksDrillDown, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
      getReplansDrillDown(inputModel): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };    
        let body = JSON.stringify(inputModel);    
        return this.http.post(this.GetReplansDrillDown, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
  }