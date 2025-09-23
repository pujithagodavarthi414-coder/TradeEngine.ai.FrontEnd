import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';


export class GradeDetailsModel extends SearchCriteriaInputModelBase{
    employeeId: string;
    employeeGradeId: string;
    gradeId: string;
    gradeName: string;
    gradeOrder: number;
    userId: string;
    employeeName: string;
    profileImage: string;
    activeFrom: string;;
    activeTo: string;
    createdByUserId: string;
    createdDateTime: Date;
    timeStamp: string;
}