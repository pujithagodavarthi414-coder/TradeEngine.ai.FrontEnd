export class TimeSheetModel {
    buttonTypeId: string;
    timeSheetId: string;
    userId: string;
    fullName: string;
    profileImage: string;
    date: Date;
    inTime: string;
    lunchBreakStartTime: string;
    lunchBreakEndTime: string;
    breakInTime: string;
    breakOutTime: string;
    outTime: string;
    loggedUserId: string;
    isFeed: boolean;
    isNextDay: boolean;
    breakId: string;
    timeZoneOffset: string;
    timeZone: string;
}