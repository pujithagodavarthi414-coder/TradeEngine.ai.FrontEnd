import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { TrainingCourseSearchModel } from "../models/training-course-search-model";
import { TrainingAssignmentSearchModel } from "../models/training-assignment-search-model";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

const httpOptions = {
  headers: new HttpHeaders(
    { 
      "Content-Type": "application/json",
      "TimeZone-Offset": new Date().getTimezoneOffset().toString()
    }
  )
};

@Injectable({
  providedIn: "root"
})

export class TrainingManagementService {
  constructor(private http: HttpClient) { }

  searchTrainingCourses(trainingSearchModel: TrainingCourseSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(trainingSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchTrainingCourses, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  upsertTrainingCourse(trainingCourseDetails: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(trainingCourseDetails);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTrainingCourse, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  searchAssignments(trainingAssignmentSearchModel: TrainingAssignmentSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(trainingAssignmentSearchModel);

    return this.http.post(APIEndpoint + ApiUrls.SearchTrainingAssignments, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  archiveOrUnArchiveTrainingCourse(trainingCourse) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(trainingCourse);

    return this.http.post(APIEndpoint + ApiUrls.ArchiveOrUnArchiveTrainingCourse, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getTrainingCourses() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    return this.http.get(APIEndpoint + ApiUrls.GetTrainingCourses, httpOptions)
  }

  AssignOrUnAssignTrainingCourse(assignments) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(assignments);

    return this.http.post(APIEndpoint + ApiUrls.AssignOrUnAssignTrainingCourse, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAssignmentStatuses() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    return this.http.get(APIEndpoint + ApiUrls.GetAssignmentStatuses, httpOptions)
  }

  addOrUpdateAssignmentStatus(assignment) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const body = JSON.stringify(assignment);

    return this.http.post(APIEndpoint + ApiUrls.AddOrUpdateAssignmentStatus, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAssignmentWorkflow(assignmentId: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    return this.http.get(APIEndpoint + ApiUrls.GetAssignmentWorkflow + `?assignmentId=${assignmentId}`, httpOptions)
  }
}
