
export class EmployeeModel {
    id: string;
    employeeId: string;
    userId: string;
    employeeNumber: string;
    genderId: string;
    maritalStatusId: string;
    nationalityId: string;
    dateofBirth: string;
    smoker: boolean;
    militaryService: boolean;
    nickName: string;
    isTerminated: boolean;
    operationsPerformedBy: string;
    createdDateTime: string;
    createdByUserId: string;
    updatedDateTime: string;
    updatedByUserId: string;
}

export class EmployeeInputModel {
    id: string;
    employeeId: string;
    userId: string;
    employeeNumber: string;
    genderId: string;
    maritalStatusId: string;
    nationalityId: string;
    dateofBirth: string;
    smoker: boolean;
    militaryService: boolean;
    nickName: string;
    isTerminated: boolean;
    operationsPerformedBy: string;
    createdDateTime: string;
    createdByUserId: string;
    updatedDateTime: string;
    updatedByUserId: string;
    //paging
    pageSize: number;
    pageNumber: number;
    companyId: number;
    searchText: number;
    searchGoal: number;
    searchUserStory: number;
    orderByField: number;
    orderByDirection: number;
    isActive: boolean;
    isArchived: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
}