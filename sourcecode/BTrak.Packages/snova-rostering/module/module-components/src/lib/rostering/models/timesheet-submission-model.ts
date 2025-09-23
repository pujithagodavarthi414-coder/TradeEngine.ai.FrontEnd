export class TimeSheetSubmissionOutputModel {
    timeSheetTitle: string;
    date: DateTimeValues[];
    isHeaderVisible: boolean;
    status: string;
    rejectedReason: string;
    isEnableBuuton: boolean;
    userName: string;
    userId: string;
    statusColour: string;
    profileImage: string;
}
export class DateTimeValues {
    date: Date;
    spentTime: number;
    inTime: Date;
    outTime: Date;
    userId: string;
    userName: string;
    timeSheetSubmissionId: string;
    breakmins: string;
    isOnLeave: boolean;
    additionInformation: string;
    additionalIntTime: Date;
    additionalOuttTime: Date;
    isButtonEnable: boolean;
    information: string;
}