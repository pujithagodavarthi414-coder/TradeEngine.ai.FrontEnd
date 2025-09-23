import { FileBytesModel } from "./fileBytes-model";

export class CronExpressionModel {
    cronExpressionId: string;
    cronExpressionName: string;
    cronExpression: string;
    isArchived: boolean;
    timeStamp: any;
    customWidgetId: string;
    selectedCharts: string;
    templateType: string;
    fileBytes: FileBytesModel[];
    runNow: boolean;
    templateUrl: string;
    jobId: string;
    CustomAppName: string;
}

export class RecurringCronExpressionModel {
    isRecurringWorkItem: boolean;
    customWidgetId: string;
    cronExpression: string;
    cronExpressionId: string;
    cronExpressionDescription: string;
    cronExpressionTimeStamp: any;
    jobId: any;
    isArchived:boolean;
    isPaused:boolean;
    scheduleEndDate:any;
    conductStartDate:any;
    conductEndDate:any;
    spanInYears: number;
    spanInMonths: number;
    spanInDays: number;
    isIncludeAllQuestions: boolean;
    selectedQuestions: any;
    selectedCategories: any;
    condcutResponsibleId: any;
}
