import { SearchCriteriaInputModelBase } from "../models/searchCriteriaInputModelBase";

export class DepartmentModel extends SearchCriteriaInputModelBase {
    departmentId: string;
    departmentName: string;
    createdDateTime: Date;
    createdOn: string;
    inActiveDateTime: Date;
    timeStamp: any;
    totalCount: number;
}
