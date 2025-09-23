import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class DepartmentModel extends SearchCriteriaInputModelBase {
    departmentId: string;
    departmentName: string;
    createdDateTime: Date;
    createdOn: string;
    inActiveDateTime: Date;
    timeStamp: any;
    totalCount: number;
}
