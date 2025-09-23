import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestCase, TestCaseTitle } from '../models/testcase';

import { TestCaseDropdownList } from '../models/testcasedropdown';

import { UpdateMultiple } from '../models/updatemultiple';

import { TestCasesShift, MoveTestCasesModel } from '../models/testcaseshift';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { TestSuite, TestSuiteList, TestSuiteExportModel } from '../models/testsuite';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class TestRailService {

  constructor(private http: HttpClient) { }

  private Get_All_Projects = APIEndpoint + ApiUrls.GetProjects;
  private Get_User_Story_Scenario_History = APIEndpoint + ApiUrls.GetUserStoryScenarioHistory;
  private Get_Users = APIEndpoint + ApiUrls.GetProjectMemberDropdown;


  GetUserStoryScenarioHistory(historyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(historyModel);

    return this.http.post(`${this.Get_User_Story_Scenario_History}`, body, httpOptions);
  }


  GetUsers(projectId: string) {
    var paramsObj = new HttpParams().set("projectId", projectId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(`${this.Get_Users}`, httpOptions);
  }
}