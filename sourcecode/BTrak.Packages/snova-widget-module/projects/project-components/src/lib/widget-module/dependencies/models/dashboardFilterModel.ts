export class DashboardFilterModel {
    projectId: string;
    userId: string;
    goalId: string;
    sprintId: string;
    dateFrom: string;
    dateTo: string;
    date: any;
    entityId: string;
    branchId: string;
    designationId: string;
    roleId: string;
    sprintStartdate: Date;
    sprintEndDate: Date;
    departmentId: string;
    isFinancialYear: string;
    isActiveEmployeesOnly: string;
    monthDate: string;
    yearDate: string;
    auditId: string;
    businessUnitId: any [] = [];
    isMongoQuery : boolean;
    collectionName : string;
}
