export class ViewTimeSheet {
    EmployeeName: string;
    InTime: string;
    OutTime: string;
    Break: string;
    AbsenceReason: string;
    BreakTimings: string;
    FeededTime: string;
    FeedThrough: string;
}

export function createStubViewTimeSheet() {
    const viewTimeSheet = new ViewTimeSheet();

    viewTimeSheet.EmployeeName = 'Bala Koti	';
    viewTimeSheet.InTime = '09:10';
    viewTimeSheet.OutTime = '18:30';
    viewTimeSheet.Break = '14:31-15:31(1hr:0min)';
    viewTimeSheet.AbsenceReason = 'Sick Leave';
    viewTimeSheet.BreakTimings = '18:31-19:31(1hr:0min)';
    viewTimeSheet.FeededTime = '18:31';
    viewTimeSheet.FeedThrough = 'Feed Time Sheet';

    return viewTimeSheet;
}

