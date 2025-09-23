import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeEducationLevelsModel extends SearchCriteriaInputModelBase{
    educationLevelId: string;
    masterValue: string;
    educationLevelName: string;
    createdDateTime: Date;
    createdByUserId: string;
    timeStamp: any;
    totalCount: number;
}