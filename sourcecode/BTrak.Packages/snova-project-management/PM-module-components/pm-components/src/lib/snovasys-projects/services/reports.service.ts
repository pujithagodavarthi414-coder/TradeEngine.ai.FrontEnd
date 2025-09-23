import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { GoalReplan } from "../models/goalReplan";
import { Observable } from "rxjs";
import { BurnDownChartDetailsModel } from "../models/burnDownChart";
import { SelectedGoalActivityModel } from "../models/selectedGoalActivityModel";
import { BugReportModel } from "../models/sprints-bug-report-model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class GoalLevelReportsService {
  private Get_All_Roles_API_PATH = APIEndpoint +"Goals/GoalsApi/GetGoalHeatmap";

  constructor(private http: HttpClient) {}

  getalluserstories(goalId){
    let paramsobj = new HttpParams().set('goalId' , goalId);
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
        params:paramsobj
      };
      return this.http.get<any[]>(APIEndpoint + ApiUrls.GetGoalHeatmap, httpOptions)
     .pipe(map(result => {
      return result;
     }));
    }

    GetDeveloperGoalHeatMap(goalId,userId){
      let paramsobj = new HttpParams().set('goalId' , goalId).set('userId' ,userId);
      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
          params:paramsobj
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetDeveloperGoalHeatMap, httpOptions)
       .pipe(map(result => {
        return result;
       }));
      }


      
      getDeveloperSpentTimeReportOnGoal(goalId){
      let paramsobj = new HttpParams().set('goalId' , goalId);
      const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
          params:paramsobj
        };
        return this.http.get<any[]>(APIEndpoint + ApiUrls.GetDeveloperSpentTimeReport , httpOptions)
       .pipe(map(result => {
        return result;
       }));
      }
      
      getGoalActivity(goalId){
        let paramsobj = new HttpParams().set('goalId' , goalId);
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
            params:paramsobj
          };
          return this.http.get<any[]>(APIEndpoint + ApiUrls.GetGoalActivity , httpOptions)
         .pipe(map(result => {
          return result;
         }));
        }
  

  getGoalReplainHistory(goalId: string) {
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    let body = JSON.stringify({'GoalId':goalId});
    return this.http.post(APIEndpoint + ApiUrls.GoalReplanHistory, body, httpOptions)
      .pipe(map(result => {
       
        return result;
      }));
  }
  getBurnDownChartDetails(BurnDownChartDetails: BurnDownChartDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(BurnDownChartDetails);
    return this.http.post(APIEndpoint + ApiUrls.GetUserGoalBurnDownChart, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getGoalReplanHistory(goalId, goalReplanValue){
    let paramsobj = new HttpParams().set('goalId' , goalId).set('goalReplanValue' , goalReplanValue);
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
        params:paramsobj
      };
      return this.http.get<any[]>(APIEndpoint + ApiUrls.GetGoalReplanHistory , httpOptions)
     .pipe(map(result => {
      return result;
     }));
    }

    getSprintReplanHistory(sprintId, goalReplanValue){
    let paramsobj = new HttpParams().set('sprintId' , sprintId).set('goalReplanValue' , goalReplanValue);
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
        params:paramsobj
      };
      return this.http.get<any[]>(APIEndpoint + ApiUrls.GetSprintReplanHistory , httpOptions)
     .pipe(map(result => {
      return result;
     }));
    }
    
    getUserStoryStatusReport(statusModel){
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let body = JSON.stringify(statusModel);
      return this.http.post(APIEndpoint + ApiUrls.GetUserStoryStatusReport, body, httpOptions)
        .pipe(map(result => {
          return result;
        }));
      
      }

      getSelectedGoalActivity(SelectedGoalActivityModel: SelectedGoalActivityModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(SelectedGoalActivityModel);
        return this.http.post(APIEndpoint + ApiUrls.GetGoalActivityWithUserStories, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getSelectedSprintActivity(SelectedGoalActivityModel: SelectedGoalActivityModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(SelectedGoalActivityModel);
        return this.http.post(APIEndpoint + ApiUrls.GetSprintActivityWithUserStories, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }

      getBugReport(bugReportModel: BugReportModel) {
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        let body = JSON.stringify(bugReportModel);
        return this.http.post(APIEndpoint + ApiUrls.GetSprintsBugReport, body, httpOptions)
          .pipe(map(result => {
            return result;
          }));
      }
}