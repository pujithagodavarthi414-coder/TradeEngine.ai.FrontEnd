import {
    MessageTriggered,
    MessageCompleted,
    MessageFailed,
    ReceiveMessageTriggered,
    ReceiveMessageCompleted,
    ReceiveMessageFailed,
    PresenceEventTriggered,
    PresenceEventCompleted,
    PresenceEventFailed,
    CountCompleted,
    CountFailed,
    CountTriggered,
    InitalStateOfUsersTriggered,
    InitalStateOfUsersFailed,
    InitalStateOfUsersCompleted,
    RequestingStateOfUsersTriggered,
    RequestingStateOfUsersCompleted,
    RequestingStateOfUsersFailed,
    MessageActionTypes,
    SendChannelUpdateModelTriggered,
    SendChannelUpdateModelFailed,
    SendChannelUpdateModelCompleted,
    ReceiveChannelUpdateModelTriggered,
    ReceiveChannelUpdateModelFailed,
    ReceiveChannelUpdateModelCompleted,
    SendingSignalTriggered,
    SendingSignalCompleted,
    SendingSignalFailed,
    ReceiveSignalFailed,
    ReceiveSignalCompleted,
    ReceiveSignalTriggered
} from "../actions/chat.actions"
import { Action } from "@ngrx/store";
import { Observable, pipe } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';

@Injectable()

export class MessageEffects {

    @Effect()
    MessageTrigged$: Observable<Action> = this.actions$.pipe(
        ofType<MessageTriggered>(MessageActionTypes.MessageTriggered),
        pipe(
            map((action) => {
                return new MessageCompleted(action.messageDetails);
            })
        )
    );

    @Effect()
    MessageFailed$: Observable<Action> = this.actions$.pipe(
        ofType<MessageFailed>(MessageActionTypes.MessageFailed),
        pipe(
            map((action) => {
                return new MessageFailed(action.errorMessage);
            })
        )
    );

    @Effect()
    ReceiveMessageTrigged$: Observable<Action> = this.actions$.pipe(
        ofType<ReceiveMessageTriggered>(MessageActionTypes.ReceiveMessageTriggered),
        pipe(
            map((action) => {
                return new ReceiveMessageCompleted(action.messageDetails);
            })
        )
    );

    @Effect()
    ReceiveMessageFailed$: Observable<Action> = this.actions$.pipe(
        ofType<MessageFailed>(MessageActionTypes.ReceiveMessageFailed),
        pipe(
            map((action) => {
                return new ReceiveMessageFailed(action.errorMessage);
            })
        )
    );

    @Effect()
    PresenceEventTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<PresenceEventTriggered>(MessageActionTypes.PresenceEventTriggered),
        pipe(
            map((action) => {
                return new PresenceEventCompleted(action.employeeStatusModel);
            })
        )
    );

    @Effect()
    PresenceEventFailed$: Observable<Action> = this.actions$.pipe(
        ofType<PresenceEventFailed>(MessageActionTypes.PresenceEventFailed),
        pipe(
            map((action) => {
                return new PresenceEventFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    CountTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<CountTriggered>(MessageActionTypes.CountTriggered),
        pipe(
            map((action) => {
                return new CountCompleted(action.messageCount);
            })
        )
    );

    @Effect()
    CountFailed$: Observable<Action> = this.actions$.pipe(
        ofType<CountFailed>(MessageActionTypes.CountFailed),
        pipe(
            map((action) => {
                return new CountFailed(action.errorMessage);
            })
        )
    );

    @Effect()
    InitalStateOfUsersTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<InitalStateOfUsersTriggered>(MessageActionTypes.InitalStateOfUsersTriggered),
        pipe(
            map((action) => {
                return new InitalStateOfUsersCompleted(action.initialStatusOfUsers);
            })
        )
    );

    @Effect()
    InitalStateOfUsersFailed$: Observable<Action> = this.actions$.pipe(
        ofType<InitalStateOfUsersFailed>(MessageActionTypes.InitalStateOfUsersFailed),
        pipe(
            map((action) => {
                return new InitalStateOfUsersFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    RequestingStateOfUsersTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<RequestingStateOfUsersTriggered>(MessageActionTypes.RequestingStateOfUsersTriggered),
        pipe(
            map((action) => {
                return new RequestingStateOfUsersCompleted(action.gotColleagues);
            })
        )
    );

    @Effect()
    RequestingStateOfUsersFailed$: Observable<Action> = this.actions$.pipe(
        ofType<RequestingStateOfUsersFailed>(MessageActionTypes.RequestingStateOfUsersFailed),
        pipe(
            map((action) => {
                return new RequestingStateOfUsersFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    SendChannelUpdateModelTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<SendChannelUpdateModelTriggered>(MessageActionTypes.SendChannelUpdateModelTriggered),
        pipe(
            map((action) => {
                return new SendChannelUpdateModelCompleted(action.channelUpdateModel);
            })
        )
    );

    @Effect()
    SendChannelUpdateModelFailed$: Observable<Action> = this.actions$.pipe(
        ofType<SendChannelUpdateModelFailed>(MessageActionTypes.SendChannelUpdateModelFailed),
        pipe(
            map((action) => {
                return new SendChannelUpdateModelFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    ReceiveChannelUpdateModelTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<ReceiveChannelUpdateModelTriggered>(MessageActionTypes.ReceiveChannelUpdateModelTriggered),
        pipe(
            map((action) => {
                return new ReceiveChannelUpdateModelCompleted(action.channelUpdateModel);
            })
        )
    );

    @Effect()
    ReceiveChannelUpdateModelFailed$: Observable<Action> = this.actions$.pipe(
        ofType<ReceiveChannelUpdateModelFailed>(MessageActionTypes.ReceiveChannelUpdateModelFailed),
        pipe(
            map((action) => {
                return new ReceiveChannelUpdateModelFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    SendingSignalTriggered$: Observable<Action> = this.actions$.pipe(
        ofType<SendingSignalTriggered>(MessageActionTypes.SendingSignalTriggered),
        pipe(
            map((action) => {
                return new SendingSignalCompleted(action.messageTypingDetails);
            })
        )
    );

    @Effect()
    SendingSignalFailed$: Observable<Action> = this.actions$.pipe(
        ofType< SendingSignalFailed>(MessageActionTypes. SendingSignalFailed),
        pipe(
            map((action) => {
                return new  SendingSignalFailed(action.errorMessage);
            })
        )
    );
    @Effect()
    ReceiveSignalTriggered$: Observable<Action> = this.actions$.pipe(
        ofType< ReceiveSignalTriggered>(MessageActionTypes. ReceiveSignalTriggered),
        pipe(
            map((action) => {
                return new ReceiveSignalCompleted(action.messageTypingDetails);
            })
        )
    );

    @Effect()
    ReceiveSignalFailed$: Observable<Action> = this.actions$.pipe(
        ofType<  ReceiveSignalFailed>(MessageActionTypes.  ReceiveSignalFailed),
        pipe(
            map((action) => {
                return new  ReceiveSignalFailed(action.errorMessage);
            })
        )
    );
    constructor(private actions$: Actions) {
    }
}