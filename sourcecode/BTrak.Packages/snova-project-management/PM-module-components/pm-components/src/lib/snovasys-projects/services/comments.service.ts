import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpClient
} from "@angular/common/http";

import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class CommentService {
  constructor(private http: HttpClient) {}

  private GET_ALL_COMMENTS_BY_RECEIVER_API_PATH =
    APIEndpoint + "Comments/CommentsApi/GetCommentsByReceiverId";
  private UPSERT_COMMENT_API_PATH =
    APIEndpoint + "Comments/CommentsApi/UpsertComment";
  private GET_USERSTORY_COMMENTS_COUNT = APIEndpoint + "UserStory/UserStoryApi/GetCommentsCountByUserStoryId"
  private GET_USERSTORY_BUGS_COUNT = APIEndpoint + ApiUrls.GetBugsCountForUserStory;

  getAllCommentsByReceiverId(receiverGuid: string) {
    return this.http.get<any>(
      `${this.GET_ALL_COMMENTS_BY_RECEIVER_API_PATH}?id=${receiverGuid}`,
      httpOptions
    );
  }


  getCommentsCountByUserStoryId(userStoryId: string) {
    return this.http.get<any>(
      `${this.GET_USERSTORY_COMMENTS_COUNT}?userStoryId=${userStoryId}`,
      httpOptions
    );
  }
  
  getBugsCount(countsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(countsModel);

    return this.http.post(`${this.GET_USERSTORY_BUGS_COUNT}`, body, httpOptions);
  }

  upsertComment(
    commentId: string,
    receiverId: string,
    comment: string,
    parentCommentId: string
  ) {
    var commentUserInputModel = {
      commentId: commentId,
      receiverId: receiverId,
      comment: comment,
      parentCommentId: parentCommentId
    };

    let body = JSON.stringify(commentUserInputModel);
    return this.http.post<any>(
      `${this.UPSERT_COMMENT_API_PATH}`,
      body,
      httpOptions
    );
  }


}