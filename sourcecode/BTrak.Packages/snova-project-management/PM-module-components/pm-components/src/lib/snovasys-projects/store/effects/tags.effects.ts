import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { LoadTagsTriggred, TagsActionTypes, LoadTagsCompleted, LoadTagsFailed, TagsExceptionHandled } from "../actions/tags.action";
import { switchMap, map, catchError } from "rxjs/operators";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { CustomTagService } from '../../services/customTag.service';
@Injectable()

export class TagsEffects {
    @Effect()
    loadingTags$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTagsTriggred>(TagsActionTypes.LoadTagsTriggred),
        switchMap((action) => {
            return this.widgetService
                .getCustomTags(action.tagsModel)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            return new LoadTagsCompleted(result.data);
                        } else {
                            return new LoadTagsFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new TagsExceptionHandled(error)))
                );
        })
    );

    @Effect()
    showValidationMessagesForGetFeedBackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<LoadTagsFailed>(
            TagsActionTypes.LoadTagsFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    TagsExceptionHandled$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<TagsExceptionHandled>(
            TagsActionTypes.TagsExceptionHandled
        ),
        switchMap((searchAction) => {
            return of(new ShowExceptionMessages({
                message: searchAction.exceptionMessage // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(private actions$: Actions, private widgetService: CustomTagService) {
    }

}