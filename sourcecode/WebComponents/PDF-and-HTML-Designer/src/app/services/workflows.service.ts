import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { WorkflowModel } from "../models/workflow-model";
import { ApiUrls } from "../constants/api-urls";
import { LocalStorageProperties } from "../constants/localstorage-properties";
import { environment } from "src/environments/environment.prod";
const env = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = env && env.apiURL? env.apiURL : environment.apiURL;; 

@Injectable({
  providedIn: "root"
})


export class WorkflowService {

    private Workflow_List = APIEndpoint + ApiUrls.GetWorkflows;
    
    constructor(private http: HttpClient) { }

    getWorkflows(workflowModel: WorkflowModel){
        const httpOptions = {
          headers: new HttpHeaders({ "Content-Type": "application/json" })
        };
    
        const body = JSON.stringify(workflowModel);
    
        return this.http.post(this.Workflow_List, body,  httpOptions)
          .pipe(map((result) => {
            return result;
          }));
      }
      
}