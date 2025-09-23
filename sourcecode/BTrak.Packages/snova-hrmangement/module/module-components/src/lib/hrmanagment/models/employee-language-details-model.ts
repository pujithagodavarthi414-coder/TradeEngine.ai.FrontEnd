export class EmployeeLanguageDetailsModel {
    employeeLanguageId: string;
    employeeId: string;
    languageId: string;
    language: string;
    fluencyId: string;
    fluency: string;
    competencyId: string;
    competency: string;
    comments: string;
    isArchived: boolean;
    operationsPerformedBy: string;
    firstName: string;
    surName: string;
    userName: string;
    email: string;
    timeStamp: any;
    totalCount: number;
    canRead: boolean;
    canWrite: boolean;
    canSpeak: boolean;
    fluencyIds: any[] = [];
}