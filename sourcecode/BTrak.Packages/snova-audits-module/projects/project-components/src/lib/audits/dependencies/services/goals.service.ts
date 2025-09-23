import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrls } from "../constants/api-urls";
import { AmendUserStoryModel } from "../models/amend-userstory-model";
import { ArchivedUserStoryLinkModel } from "../models/archived-user-story-link-model";
import { ArchivedUserStoryInputModel } from "../models/archivedUserStoryModel";
import { ArchiveGoalInputModel } from "../models/ArchiveGoalInputModel";
import { CustomTagsModel } from "../models/custom-tags-model";
import { GoalModel } from "../models/GoalModel";
import { GoalReplan } from "../models/goalReplan";
import { GoalReplanModel } from "../models/goalReplanModel";
import { GoalSearchCriteriaApiInputModel } from "../models/goalSearchInput";
import { GoalStatusDropDownData } from "../models/goalStatusDropDown";
import { ArchivedkanbanModel } from "../models/kanbanViewstatusModel";
import { LinkUserStoryInputModel } from "../models/link-userstory-input-model";
import { ParkUserStoryInputModel } from "../models/parkedUserstoryModel";
import { ParkGoalInputModel } from "../models/ParkGoalInputModel";
import { UserStoryInputTagsModel } from "../models/user-story-tags.model";
import { UserStory } from "../models/userStory";
import { UserStoryLinkModel } from "../models/userstory-link-types-model";
import { UserStoryReplanModel } from "../models/userStoryReplanModel";
import { UserStorySearchCriteriaInputModel } from "../models/userStorySearchInput";
import { SpentTimeReport } from "../models/userstorySpentTimeModel";
// import { WorkflowStatusesModel } from "../models/workflowStatusesModel";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})
export class ProjectGoalsService {
  constructor(private http: HttpClient) { }

  searchGoals(goalSearchInput: GoalSearchCriteriaApiInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.post<any[]>(
      `${APIEndpoint + ApiUrls.SearchGoals}`,
      goalSearchInput
    );
  }

  archiveKanban(archivedkanbanModel: ArchivedkanbanModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ArchiveCompletedUserStories}`,
        archivedkanbanModel
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  searchAllGoals(goalSearchInput: GoalSearchCriteriaApiInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http.post<any[]>(
      `${APIEndpoint + ApiUrls.GetUserStoriesForAllGoals}`,
      goalSearchInput
    )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  searchUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  searchLinkUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<UserStory[]>(
        `${APIEndpoint + ApiUrls.GetAllUserStories}`,
        userStorySearchInput
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchTemplateUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<UserStory[]>(
        `${APIEndpoint + ApiUrls.GetTemplatesUserStories}`,
        userStorySearchInput
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  searchSprintUserStories(userStorySearchInput: UserStorySearchCriteriaInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<UserStory[]>(
        `${APIEndpoint + ApiUrls.GetSprintUserStories}`,
        userStorySearchInput
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }


  searchTemplateUserStoryById(templateUserStoryId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const paramsobj = new HttpParams().set("templateUserStoryId", templateUserStoryId);

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetTemplateUserStoryById}`, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  searchSprintUserStoryById(templateUserStoryId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set("sprintUserStoryId", templateUserStoryId);

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetSprintUserStoryById}`, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  archiveGoal(archivedGoalModel: ArchiveGoalInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ArchiveGoal}`,
        archivedGoalModel
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  parkGoal(parkedGoalModel: ParkGoalInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ParkGoal}`,
        parkedGoalModel
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  upsertGoalTags(goalTagsModel: UserStoryInputTagsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertGoalTags}`,
        goalTagsModel
      )
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  updateUserStoryGoal(userStory: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpdateUserStoryGoal}`,
        userStory
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertUserStory(userStorySearchInput: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertUserStory}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  upsertUserStoryTags(userStoryTagsInput: UserStoryInputTagsModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStoryTagsInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertUserStoryTags}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  getLinkUserStoryTypes(userStoryLinkModel: UserStoryLinkModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStoryLinkModel);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.GetUserStoryLinkTypes}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  getLinkUserStories(linkUserStoryModel: LinkUserStoryInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(linkUserStoryModel);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.GetUserStoryLinks}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }


  upsertUserStoryLink(linkUserStoryModel: LinkUserStoryInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(linkUserStoryModel);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertUserStoryLink}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  archiveUserStoryLink(archiveLinkUserStoryModel: ArchivedUserStoryLinkModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(archiveLinkUserStoryModel);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ArchiveUserStoryLink}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  reOrderUserStories(userStorySearchInput: string[]) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);

    return this.http.post(
      `${APIEndpoint + ApiUrls.ReorderUserStories}`, body, httpOptions
    )
      .pipe(map((result) => {
        return result;
      }));
  }

  archiveUserStory(archivedUserStoryModel: ArchivedUserStoryInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ArchiveUserStory}`,
        archivedUserStoryModel
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  parkUserStory(parkedUserStoryModel: ParkUserStoryInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.ParkUserStory}`,
        parkedUserStoryModel
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertMultipleUserStoriesSplit(userStorySearchInput: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertMultipleUserStories}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertUserStoryReplan(userStorySearchInput: UserStoryReplanModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpsertUserStoryReplan}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpdateMultipleUserStories(userStorySearchInput: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.UpdateMultipleUserStories}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  GetUserStorySpentTimeReport(userStorySearchInput: SpentTimeReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);
    return this.http
      .post<any>(
        `${APIEndpoint + ApiUrls.SearchSpentTimeReport}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertGoals(goalModel: GoalModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(goalModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.UpsertGoal}`,
      body,
      httpOptions
    );
  }

  archiveGoals(goalModel: GoalModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(goalModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.UpsertGoal}`,
      body,
      httpOptions
    );
  }

  insertGoalReplan(goalModel: GoalReplan) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(goalModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.InsertGoalReplan}`,
      body,
      httpOptions
    );
  }

  GetAllGoals(
    goalSearchInput: GoalSearchCriteriaApiInputModel
  ): Observable<GoalModel[]> {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(goalSearchInput);
    return this.http
      .post<GoalModel[]>(
        `${APIEndpoint + ApiUrls.SearchGoals}`,
        body,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertFile(formData, moduleTypeId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const headers = new HttpHeaders();
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(
        `${APIEndpoint + ApiUrls.UploadFile}`,
        formData,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  UpsertMultipleUserStories(GoalId: string, filePath: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const paramsobj = new HttpParams()
      .set("goalId", GoalId)
      .set("filePath", filePath);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    return this.http
      .post(
        `${APIEndpoint + ApiUrls.InsertMultipleUserStoriesUsingFile}`,
        null,
        httpOptions
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  moveUserStoriesToSprint(userStoryId: string, sprintId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams()
      .set("userStoryId", userStoryId)
      .set("sprintId", sprintId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };
    return this.http
    .get(`${APIEndpoint + ApiUrls.MoveGoalUserStoryToSprint}`, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
  }

  GetUserStoryById(userStoryId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const paramsObj = new HttpParams().set("userStoryId", userStoryId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetUserStoryById}`, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  GetProjectOverViewStatus(projectId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const paramsObj = new HttpParams().set("projectId", projectId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetProjectOverViewDetails}`, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  GetAllGoalStatus() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(new GoalStatusDropDownData());
    return this.http.post<GoalModel[]>(
      `${APIEndpoint + ApiUrls.GetAllGoalStatuses}`,
      body,
      httpOptions
    );
  }

  GetAllGoalReplanTypes(goalReplanModel: GoalReplanModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const data = {
      GoalReplanTypeId: "",
      GoalReplanTypeName: "",
      isArchived: goalReplanModel.isArchived
    };

    const body = JSON.stringify(data);
    return this.http.post<GoalReplanModel[]>(
      `${APIEndpoint + ApiUrls.GetAllGoalReplanTypes}`,
      body,
      httpOptions
    );
  }

  getGoalById(goalId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const paramsObj = new HttpParams().set("goalId", goalId);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetGoalById}`, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }


  amendUserStoryDeadline(amendDeadline: AmendUserStoryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(amendDeadline);
    return this.http.post(
      `${APIEndpoint + ApiUrls.AmendUserStoriesDeadline}`,
      body,
      httpOptions
    );
  }

  getAllUserStoryTypes(userStoryTypesModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  updateSubTaskUserStory(userStory: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(userStory);
    return this.http.post(
      `${APIEndpoint + ApiUrls.UpdateUserStoryLink}`,
      body,
      httpOptions
    );
  }


  getLinksCountByUserStoryId(userStoryId, isSprintUserStories) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsObj = new HttpParams().set("userStoryId", userStoryId).set("isSprintUserStories", isSprintUserStories);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(`${APIEndpoint + ApiUrls.GetLinksCountForUserStory}`, httpOptions)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  searchCustomTags(searchText: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const customApplicationModel = new CustomTagsModel();
    customApplicationModel.searchTagText = searchText;
    const body = JSON.stringify(customApplicationModel);
    return this.http.post(
      `${APIEndpoint + ApiUrls.GetCustomApplicationTag}`,
      body,
      httpOptions
    );
  }


WorkItemUploadTemplate(isFromSprint) {
  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
  let obj = {
    isFromSprint: isFromSprint
  }
  return this.http
    .post(`${APIEndpoint + ApiUrls.WorkItemUploadTemplate}`, obj ,{ responseType: "arraybuffer" })
    .pipe(
      map(result => {
        return result;
      })
    );
}

workItemUpload(workItemList) {
  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
  const httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  let body = JSON.stringify(workItemList);
  return this.http
    .post(`${APIEndpoint + ApiUrls.WorkItemUpload}`, body, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
}

deleteLinkedBugs(templateUserStoryId: string) {
  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
  let paramsobj = new HttpParams().set("userStoryId", templateUserStoryId);

  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    params: paramsobj
  };

  return this.http
    .get(`${APIEndpoint + ApiUrls.DeleteLinkedBug}`, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
}

}
