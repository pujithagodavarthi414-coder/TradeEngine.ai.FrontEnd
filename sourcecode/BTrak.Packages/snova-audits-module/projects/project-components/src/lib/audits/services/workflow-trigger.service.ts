import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { WorkflowTrigger } from "../models/workflow-trigger.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
import { ApiUrls } from '../dependencies/constants/api-urls';

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

const APIEndpoint = environment.apiURL;

@Injectable({
    providedIn: "root"
})

export class WorkFlowTriggerService {

    constructor(private http: HttpClient) { }

    getTriggers(triggerModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(triggerModel);

        return this.http.post(APIEndpoint + ApiUrls.GetTriggers, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    getWorkflowsForTriggers(workflowModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(workflowModel);

        return this.http.post(APIEndpoint + ApiUrls.GetWorkFlowsForTriggers, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }
    
    getWorkflowsByReferenceId(triggerModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(triggerModel);

        return this.http.post(APIEndpoint + ApiUrls.GetWorkFlowTriggers, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    upsertWorkflowTrigger(triggerModel: WorkflowTrigger) {
        const httpOptions = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        const body = JSON.stringify(triggerModel);

        return this.http.post(APIEndpoint + ApiUrls.UpsertWorkFlowTrigger, body, httpOptions)
            .pipe(map((result) => {
                return result;
            }));
    }

    UploadFile(formData) {

        const httpOptions = {
            headers: new HttpHeaders({ enctype: "multipart/form-data" })
        };

        return this.http
            .post(APIEndpoint + ApiUrls.UploadFileAsync, formData, httpOptions)
            .pipe(
                map((result) => {
                    return result;
                })
            );
    }
}