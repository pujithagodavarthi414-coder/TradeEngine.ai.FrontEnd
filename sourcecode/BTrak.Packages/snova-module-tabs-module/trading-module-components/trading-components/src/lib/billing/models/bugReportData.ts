export class BugReportData {
    Date: string;
    P0Left: string;
    P1Left: string;
    P2Left: string;
    P3Left: string;
    P0Fixed: string;
    P1Fixed: string;
    P2Fixed: string;
    P3Fixed: string;
    P0Added: string;
    P1Added: string;
    P2Added: string;
    P3Added: string;
    P0Approved: string;
    P1Approved: string;
    P2Approved: string;
    P3Approved: string;
    Type: string;
    ProjectId: string;
    AssigneeId: string;
    FeatureId: string;
    ShowGoalLevel: boolean;
    ParameterId: string;
    ParameterName: string;
    totalCount:number;
   
}

export class BugReportModel {
    Type: string;
    ProjectId: string;
    AssigneeId: string;
    ProjectFeatureId: string;
    ShowGoalLevel: boolean;
    PageNumber: number;
    PageSize: number;
    SortBy: string;
    SortDirectionAsc: boolean;
    SelectedDate: Date;
    entityId:string;
}

