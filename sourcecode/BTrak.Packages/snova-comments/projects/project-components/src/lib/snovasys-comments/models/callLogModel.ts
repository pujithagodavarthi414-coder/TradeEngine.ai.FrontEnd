import { Time } from '@angular/common';
import { UserMiniModel } from './userMiniModel';

export class CallLogModel {
    logId: string;
    callDescription: string;
    callLoggedDateTime: Date;
    callDuration: string;
    callRecordingLink: string;
    loggedForUser: UserMiniModel;
    contacted: string;
    callOutcome: string;
    callLogType: string;
    createdDateTime: Date;
    callEndedOn: Date;
}