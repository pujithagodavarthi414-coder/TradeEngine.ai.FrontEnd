// tslint:disable-next-line: ordered-imports
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
// tslint:disable-next-line: ordered-imports
import { ToastrService } from "ngx-toastr";
import { Observable, of, pipe } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { catchError, map, switchMap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import {
    // tslint:disable-next-line: ordered-imports
    ExceptionHandled, FeedBackActionTypes, GetFeedbackByIdCompleted,
    GetFeedbackByIdFailed, GetFeedbackByIdTriggered, GetFeedbacksCompleted, GetFeedbacksFailed,
    // tslint:disable-next-line: max-line-length
    GetFeedbacksTriggered, GetMoreFeedbacksLoaded, SubmitBugFeedbackCompleted, SubmitBugFeedbackFailed, SubmitBugFeedbackTriggered, SubmitFeedBackCompleted, SubmitFeedBackFailed, SubmitFeedBackTriggered, UpsertMissingFeatureCompleted, UpsertMissingFeatureFailed, UpsertMissingFeatureTriggered, EmptyFeedBackTriggered
} from "../actions/feedback.action";
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { FeedBackService } from '../../services/feedback.service';
import { GetReferenceIdOfFile } from '../actions/file-upload.action';
import { FeedBackModel } from '../../models/feedbackModel';
@Injectable()
export class FeedBackEffects {
    feedbackId: string;
    feedbackList: FeedBackModel[] = [];
    userStoryId: string;
    isFileUpload: boolean;
    @Effect()
    submitFeedBack$: Observable<Action> = this.actions$.pipe(
        ofType<SubmitFeedBackTriggered>(FeedBackActionTypes.SubmitFeedBackTriggered),
        switchMap((action) => {
            return this.feedBackService
                .upsertFeedBackReport(action.feedBackModel)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            this.feedbackId = result.data;
                            return new SubmitFeedBackCompleted(result.data);
                        } else {
                            return new SubmitFeedBackFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    getFeedBacksList$: Observable<Action> = this.actions$.pipe(
        ofType<GetFeedbacksTriggered>(FeedBackActionTypes.GetFeedbacksTriggered),
        switchMap((action) => {
            if (action.feedBackModel.pageNumber === 1) {
                this.feedbackList = [];
            }
            return this.feedBackService
                .getFeedBackReport(action.feedBackModel)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            const feedbackList = result.data;
                            feedbackList.forEach((feedback) => {
                                this.feedbackList.push(feedback);
                            });
                            return new GetFeedbacksCompleted(this.feedbackList);
                        } else {
                            return new GetFeedbacksFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    getMoreFeedBacksList$: Observable<Action> = this.actions$.pipe(
        ofType<GetMoreFeedbacksLoaded>(FeedBackActionTypes.GetMoreFeedbacksLoaded),
        switchMap((action) => {
            if (action.feedBackModel.pageNumber <= 1) {
                this.feedbackList = [];
            }
            return this.feedBackService
                .getFeedBackReport(action.feedBackModel)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            const feedbackList = result.data;
                            feedbackList.forEach((feedback) => {
                                this.feedbackList.push(feedback);
                            });
                            return new GetFeedbacksCompleted(this.feedbackList);
                        } else {
                            return new GetFeedbacksFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    submitFeedbackSuccessfulAndLoadFeedbacks$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<SubmitFeedBackCompleted>(FeedBackActionTypes.SubmitFeedBackCompleted),
        pipe(
            map(() => {
                return new GetFeedbackByIdTriggered(this.feedbackId);
            })
        )
    );

    @Effect()
    getFeedBacksById$: Observable<Action> = this.actions$.pipe(
        ofType<GetFeedbackByIdTriggered>(FeedBackActionTypes.GetFeedbackByIdTriggered),
        switchMap((action) => {
            return this.feedBackService
                .getFeedbackById(action.feedBackId)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            return new GetFeedbackByIdCompleted(result.data);
                        } else {
                            return new GetFeedbackByIdFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    submitBug$: Observable<Action> = this.actions$.pipe(
        ofType<SubmitBugFeedbackTriggered>(FeedBackActionTypes.SubmitBugFeedbackTriggered),
        switchMap((action) => {
            this.isFileUpload = action.userStory.isFileUplaod;
            return this.feedBackService
                .submitBug(action.userStory)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            this.userStoryId = result.data;
                            return new SubmitBugFeedbackCompleted(result.data);
                        } else {
                            return new SubmitBugFeedbackFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    requestMissingFeature$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMissingFeatureTriggered>(FeedBackActionTypes.UpsertMissingFeatureTriggered),
        switchMap((action) => {
            this.isFileUpload = action.userStory.isFileUplaod;
            return this.feedBackService
                .requestMissingFeature(action.userStory)
                .pipe(
                    map((result: any) => {
                        if (result.success) {
                            this.userStoryId = result.data;
                            return new UpsertMissingFeatureCompleted(result.data);
                        } else {
                            return new UpsertMissingFeatureFailed(result.apiResponseMessages)
                        }
                    }),
                    catchError((error) => of(new ExceptionHandled(error)))
                );
        })
    );

    @Effect()
    submitBugSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<SubmitFeedBackCompleted>(FeedBackActionTypes.SubmitFeedBackCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message:
                            this.translateService.instant("FEEDBACKS.FEEDBACKSUBMITTEDSUCCESSFULLY"),
                        action: "Success",
                        config: {
                            panelClass: "toaster-alignment"
                        }
                    })
            )
        )
    );

    @Effect()
    showValidationMessagesForSubmitBugFeedBackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<SubmitBugFeedbackFailed>(
            FeedBackActionTypes.SubmitBugFeedbackFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
        ofType<SubmitBugFeedbackCompleted>(FeedBackActionTypes.SubmitBugFeedbackCompleted),
        switchMap((searchAction) => {
            // if (this.isFileUpload) {
            //     return of(new GetReferenceIdOfFile(this.userStoryId))
            // } else {
            // return of(new ArchiveUnArchiveGoalCompleted())
            return of(new EmptyFeedBackTriggered());
            // }
        })
    )

    @Effect()
    sendUpsertedIdAsReferenceIdtoDropzone$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertMissingFeatureCompleted>(FeedBackActionTypes.UpsertMissingFeatureCompleted),
        switchMap((searchAction) => {
            // if (this.isFileUpload) {
            //     return of(new GetReferenceIdOfFile(this.userStoryId))
            // } else {
            // return of(new ArchiveUnArchiveGoalCompleted())
            return of(new EmptyFeedBackTriggered());
            // }
        })
    )

    @Effect()
    showValidationMessagesForFeedBackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<SubmitFeedBackFailed>(
            FeedBackActionTypes.SubmitFeedBackFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForRequestFeedbackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<UpsertMissingFeatureFailed>(
            FeedBackActionTypes.UpsertMissingFeatureFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForSubmitBugFeedbackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<SubmitBugFeedbackFailed>(
            FeedBackActionTypes.SubmitBugFeedbackFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForFeedBackByIdFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<GetFeedbackByIdFailed>(
            FeedBackActionTypes.GetFeedbackByIdFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGetFeedBackFailed$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<GetFeedbacksFailed>(
            FeedBackActionTypes.GetFeedbacksFailed
        ),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<
        Action
    > = this.actions$.pipe(
        ofType<ExceptionHandled>(
            FeedBackActionTypes.ExceptionHandled
        ),
        switchMap((searchAction) => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage // TODO: Change to proper toast message
            })
            )
        })
    );

    // tslint:disable-next-line: max-line-length
    constructor(private actions$: Actions, private feedBackService: FeedBackService, private translateService: TranslateService, private toastr: ToastrService) {
    }
}
