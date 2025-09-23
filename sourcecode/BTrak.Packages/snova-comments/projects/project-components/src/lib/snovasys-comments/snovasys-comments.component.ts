import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  SecurityContext,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { CommentApiReturnModel } from "./models/commentApiReturnModel";
import { ComponentModel } from "./models/componentModel";
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'snovasys-comments',
  templateUrl: './snovasys-comments.component.html',
  styleUrls: ['./snovasys-comments.component.scss'],
  inputs: ['receiverId', 'componentModel', 'isPermissionExists']
})

export class SnovasysCommentsComponent implements OnInit {
  receiverId
  @Input('receiverId')
  set _receiverId(data: string) {
    this.receiverId = data;
  }

  componentModel
  @Input('componentModel')
  set _componentModel(data: ComponentModel) {
    this.componentModel = data;
    console.log(this.componentModel);
    this.componentModel.callBackFunction(this.componentModel.parentComponent);
  }

  @Input() isPermissionExists: boolean;
  comments: CommentApiReturnModel[];
  show: boolean = false;
  commentText: string;
  isButtonDisabled: boolean = true;
  isCommentsTextValidation: boolean;
  count: number;
  GET_ALL_COMMENTS_BY_RECEIVER_API_PATH: string;
  UPSERT_COMMENT_API_PATH: string;
  GET_USERSTORY_COMMENTS_COUNT: string;
  GET_USERSTORY_BUGS_COUNT: string;
  commentsFormControl = new FormControl("", {

  })
  eventInProgress: boolean = false;

  public initSettings = {
    plugins: 'lists advlist,wordcount,paste',
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'undo redo | bold italic | bullist numlist outdent indent| charactercount | link image code'
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.GET_ALL_COMMENTS_BY_RECEIVER_API_PATH = this.componentModel.backendApi + "Comments/CommentsApi/GetCommentsByReceiverId";
    this.UPSERT_COMMENT_API_PATH = this.componentModel.backendApi + "Comments/CommentsApi/UpsertComment";
    this.GET_USERSTORY_COMMENTS_COUNT = this.componentModel.backendApi + "UserStory/UserStoryApi/GetCommentsCountByUserStoryId"
    this.GET_USERSTORY_BUGS_COUNT = this.componentModel.backendApi + "UserStory/UserStoryApi/GetBugsCountForUserStory";
    this.getComments();
  }

  getComments() {
    this.eventInProgress = true;
    this.getAllCommentsByReceiverId(this.receiverId).subscribe(
      (commentApiResult) => {
        this.comments = commentApiResult.data;
        this.updateCommentsCountInParentComponent();
        this.eventInProgress = false;
        this.cdRef.detectChanges();
      }
    );
  }

  updateCommentsCountInParentComponent() {
    this.componentModel.commentsCount = this.comments ? this.comments.length : 0;
    this.componentModel.callBackFunction(this.componentModel.parentComponent, this.componentModel.commentsCount);
  }

  getAllCommentsByReceiverId(receiverGuid: string) {
    let httpOptions = this.getHttpOptions();
    return this.http.get<any>(
      `${this.GET_ALL_COMMENTS_BY_RECEIVER_API_PATH}?id=${receiverGuid}`,
      httpOptions
    );
  }

  getHttpOptions() {
    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.componentModel.accessToken}`
      })
    };
    return httpOptions;
  }

  buttonDisabledInProgress(comments) {

    if (this.commentText) {
      this.isButtonDisabled = false;
      this.cdRef.detectChanges();
    }
    else {
      this.isButtonDisabled = true;
      this.cdRef.detectChanges();
    }
    if (comments.event.target.textContent.length > 800) {
      this.isCommentsTextValidation = true;
      this.isButtonDisabled = true;
      this.cdRef.detectChanges();
    }
    else {
      this.isCommentsTextValidation = false;
      this.isButtonDisabled = false;
      this.cdRef.detectChanges();
    }
  }

  checkIsButtonDisabled() {
    if (this.commentText) {
      return false;
    }
    else {
      return true;
    }
  }

  postComment(): void {
    this.eventInProgress = true;
    this.upsertComment(null, this.receiverId, this.commentText, null)
      .subscribe(
        (data: any) => {
          this.commentText = "";
          this.isButtonDisabled = true;
          this.isCommentsTextValidation = false;

          this.getAllCommentsByReceiverId(this.receiverId).subscribe(
            (data: any) => {
              this.comments = data.data;
              this.updateCommentsCountInParentComponent();
              this.eventInProgress = false;
              this.cdRef.detectChanges();
            }
          );
        }
      );
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
    let httpOptions = this.getHttpOptions();
    return this.http.post<any>(
      `${this.UPSERT_COMMENT_API_PATH}`,
      body,
      httpOptions
    );
  }

  convertCommentsToPlainText(): SafeHtml {
    return this._sanitizer.sanitize(SecurityContext.HTML, this.commentText);
  }

  getContent(text) {
    console.log(text);
  }

  goToProfile(id) {
    this.router.navigateByUrl("dashboard/profile/" + id);
  }
}
