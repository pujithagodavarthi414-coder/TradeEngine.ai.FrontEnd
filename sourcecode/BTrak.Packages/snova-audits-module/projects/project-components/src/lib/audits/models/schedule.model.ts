export class JobScheduleModel
{
    id: string;
    expression: string;
    expressionDescription: string;
    conductStartDate: Date;
    conductEndDate: Date;
    spanInYears: number;
    spanInMonths: number;
    spanInDays: number;
    isPaused: boolean;
    isArchived: boolean;
}