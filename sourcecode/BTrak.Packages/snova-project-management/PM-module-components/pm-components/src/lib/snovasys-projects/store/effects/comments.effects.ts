import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map } from "rxjs/operators";
import {
  LoadCommentsByReceiverIdTriggered,
  LoadCommentsByReceiverIdCompleted,
  CommentsActionTypes,
  CommentsCountActions,
  UpsertCommentTriggered,
  UpsertCommentCompleted,
  LoadCommentsCountTriggered,
  LoadCommentsCountCompleted,
  UpsertCommentFailed,
  LoadBugsCountByUserStoryIdTriggered,
  LoadBugsCountByUserStoryIdCompleted,
  LoadBugsCountByGoalIdTriggered,
  LoadBugsCountByGoalIdCompleted,
  LoadLinksCountByUserStoryIdTriggered,
  LoadLinksCountByUserStoryIdCompleted
} from "../actions/comments.actions";
import { ShowValidationMessages } from '../actions/notification-validator.action';
import { ProjectGoalsService } from '../../services/goals.service';
import { CommentService } from '../../services/comments.service';

@Injectable()
export class CommentsApiEffects {
 
  @Effect()
  loadCommentsByReceiverId$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCommentsByReceiverIdTriggered>(
      CommentsActionTypes.LoadCommentsByReceiverIdTriggered
    ),
    switchMap(action => {
      return this.commentsService
        .getAllCommentsByReceiverId(action.receiverId)
        .pipe(
          map((comments: any) => {
            return new LoadCommentsByReceiverIdCompleted(comments.data);
          })
        );
    })
  );

  @Effect()
  upsertComments$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCommentTriggered>(CommentsActionTypes.UpsertCommentTriggered),
    switchMap(action => {
      return this.commentsService
        .upsertComment(null, action.receiverId, action.comment, null)
        .pipe(
          map((commentIdReturned: any) => {
            if(commentIdReturned.success){
              return new UpsertCommentCompleted(
                action.receiverId,
                commentIdReturned.data
              );
            }
           else{
             return new UpsertCommentFailed(commentIdReturned.apiResponseMessages);
           }
          })
        );
    })
  );

  @Effect()
  CommentsCount$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCommentsCountTriggered>(CommentsActionTypes.LoadCommentsCountTriggered),
    switchMap(action => {
      return this.commentsService
        .getCommentsCountByUserStoryId(action.userStoryId)
        .pipe(
          map((commentIdReturned: any) => {
            return new LoadCommentsCountCompleted(
              commentIdReturned.data,
              
            );
          })
        );
    })
  );

  @Effect()
  LinksCount$: Observable<Action> = this.actions$.pipe(
    ofType<LoadLinksCountByUserStoryIdTriggered>(CommentsActionTypes.LoadLinksCountByUserStoryIdTriggered),
    switchMap(action => {
      return this.goalService
        .getLinksCountByUserStoryId(action.userStoryId,action.isSprintUserStories)
        .pipe(
          map((commentIdReturned: any) => {
            return new LoadLinksCountByUserStoryIdCompleted(
              commentIdReturned.data,
              
            );
          })
        );
    })
  );
  
  @Effect()
  bugsCountByUserStoryId$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBugsCountByUserStoryIdTriggered>(CommentsActionTypes.LoadBugsCountByUserStoryIdTriggered),
    switchMap(action => {
      return this.commentsService.getBugsCount(action.countByUserStoryId)
        .pipe(
          map((count: any) => {
            return new LoadBugsCountByUserStoryIdCompleted(count.data);
          })
        );
    })
  );
  
  @Effect()
  bugsCountByGoalId$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBugsCountByGoalIdTriggered>(CommentsActionTypes.LoadBugsCountByGoalIdTriggered),
    switchMap(action => {
      return this.commentsService.getBugsCount(action.countByGoalId)
        .pipe(
          map((count: any) => {
            return new LoadBugsCountByGoalIdCompleted(count.data);
          })
        );
    })
  );

  @Effect()
  upsertCommentCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCommentCompleted>(CommentsActionTypes.UpsertCommentCompleted),
    map(action => new LoadCommentsByReceiverIdTriggered(action.receiverId))
  );

  @Effect()
  showValidationMessagesForUpsertComments$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertCommentFailed>(CommentsActionTypes.UpsertCommentFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  constructor(
    private actions$: Actions,
    private commentsService: CommentService,
    private goalService:ProjectGoalsService
  ) {}

}
