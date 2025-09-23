import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { WidgetList } from '../../models/widgetlist';
import { WidgetService } from '../../services/widget.service';
import { WidgetsActionTypes, LoadWidgetsCompleted, LoadWidgetsTriggered, LoadTagsReorderTriggered, LoadTagsReorderCompleted, WidgetFailed, WidgetException, LoadWidgetsListTriggered, LoadWidgetsListCompleted } from '../actions/widgetslist.action';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class WidgetEffects {
    widgetId: string;    
    snackBarMessage: string;    
    validationMessages: any[];
    exceptionMessage: any;
    searchWidget: WidgetList;
    latestWidgetData: WidgetList;
    widgetList: any[] = [];

    constructor(private actions$: Actions, private widgetService: WidgetService) { }

    @Effect()
    loadwidgets$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWidgetsTriggered>(WidgetsActionTypes.LoadWidgetsTriggered),
        switchMap(getAction => {
            return this.widgetService.GetWidgetsBasedOnUser(getAction.widgets).pipe(
                map((widgets: any) => {
                    if (widgets.success == true) {
                        this.widgetId = widgets.data;
                        return new LoadWidgetsCompleted();
                    }
                    else {
                        this.validationMessages = widgets.apiResponseMessages
                        return new WidgetFailed(widgets.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WidgetException(err));
                })
            );
        })
    );

    @Effect()
    reOrderQuestions$: Observable<Action> = this.actions$.pipe(
        ofType<LoadTagsReorderTriggered>(WidgetsActionTypes.LoadTagsReorderTriggered),
        switchMap(getAction => {
            console.log("effect reOrderTags");
            return this.widgetService.reOrderTags(getAction.TagIdList).pipe(
                map((result: any) => {
                    if (result.success == true) {
                         return new LoadTagsReorderCompleted();
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new WidgetFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WidgetException(err));
                })
            );
        })
    );

   
    @Effect()
    loadWidgetsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWidgetsListTriggered>(WidgetsActionTypes.LoadWidgetsListTriggered),
        switchMap(getAction => {
            this.widgetList = [];
            return this.widgetService.GetWidgetsBasedOnUser(getAction.widgetsList).pipe(
                map((widgets: any) => {
                    if (widgets.success == true){
                        var widgetsList = this.loadWidgetTags(widgets.data);
                        return new LoadWidgetsListCompleted(widgetsList);
                    }
                    else {
                        this.validationMessages = widgets.apiResponseMessages
                        return new WidgetFailed(widgets.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new WidgetException(err));
                })
            );
        })
    );

    @Effect()
    loadwidgetsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<LoadWidgetsCompleted>(WidgetsActionTypes.LoadWidgetsCompleted),
        pipe(
            map(
                () => {
                    new SnackbarOpen({
                        message: this.snackBarMessage,
                        action: 'Success'
                    });                 
                    return new LoadWidgetsCompleted();
                }
            )
        )
    );

    @Effect()
    showValidationMessagesForWidget$: Observable<Action> = this.actions$.pipe(
        ofType<WidgetFailed>(WidgetsActionTypes.WidgetFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<WidgetException>(WidgetsActionTypes.WidgetException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    loadWidgetTags(widgetsList) {
        widgetsList.forEach(element => {
            var model = new WidgetList();
            model = element;
            model.widgetTags = element.tags ? element.tags.split(',') : null;
            model.widgetWorkSpaces = element.workSpaceNames ? element.workSpaceNames.split(',') : null;
            this.widgetList.push(model);
          });
          return this.widgetList;
    }
}