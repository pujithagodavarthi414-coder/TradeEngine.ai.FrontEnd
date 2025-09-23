export class ResourceUsageReportModel {
    public userIds: string;
    public dateFrom: Date;
    public dateTo: Date;
    public projectIds: string;
    public userName: string;
    public projectName: string;
    public goalIds: string;
    public goalName: string;
    public actualHours: number;
    public usedHours: number;
    public futureHours: number;
    public isChartData: boolean;
    public resourceUtilizationPercentage: number;
    public completionPercentage: number;
    public noOfHours: number;
    public userId: string;
    public resourceAvailable: number;
    public loggedApprovedHours: number;
    public estimatedApprovedHours: number;
}